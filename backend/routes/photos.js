const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const crypto = require("crypto");

const {
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} = require("@aws-sdk/client-s3");

const Photo = require("../models/Photo");
const r2 = require("../config/r2");

const router = express.Router();


// ---------------------------------------------
// MULTER CONFIGURATION
// ---------------------------------------------

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        // Maximum original file size: 25 MB.
        fileSize: 25 * 1024 * 1024,

        // Maximum photos in one upload.
        files: 25
    },

    fileFilter: (req, file, callback) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/heic",
            "image/heif"
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return callback(
                new Error(
                    "Only JPEG, PNG, WebP, HEIC, and HEIF images are allowed."
                )
            );
        }

        callback(null, true);
    }
});


// ---------------------------------------------
// HELPERS
// ---------------------------------------------

function isValidDate(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return false;
    }

    const [year, month, day] =
        date.split("-").map(Number);

    const parsedDate =
        new Date(year, month - 1, day);

    return (
        parsedDate.getFullYear() === year &&
        parsedDate.getMonth() === month - 1 &&
        parsedDate.getDate() === day
    );
}

function createStorageKey(date) {
    const randomId =
        crypto.randomUUID();

    return `photos/${date}/${randomId}.webp`;
}

async function deleteFromR2(storageKey) {
    try {
        await r2.send(
            new DeleteObjectCommand({
                Bucket:
                    process.env.R2_BUCKET_NAME,

                Key:
                    storageKey
            })
        );
    } catch (error) {
        console.error(
            "Failed to clean up R2 object:",
            storageKey,
            error
        );
    }
}


// ---------------------------------------------
// GET PHOTOS BY DATE, MONTH, OR ALL
// ---------------------------------------------

router.get("/", async (req, res) => {
    try {
        const { date, month } = req.query;

        let filter = {};

        if (date) {
            if (!isValidDate(date)) {
                return res.status(400).json({
                    message: "Invalid date."
                });
            }

            filter.date = date;
        } else if (month) {
            if (!/^\d{4}-\d{2}$/.test(month)) {
                return res.status(400).json({
                    message: "Invalid month."
                });
            }

            filter.date = {
                $regex: `^${month}-`
            };
        }

        const photos =
            await Photo.find(filter).sort({
                date: -1,
                _id: -1
            });

        const safePhotos =
            photos.map((photo) => ({
                _id:
                    photo._id,

                date:
                    photo.date,

                originalName:
                    photo.originalName,

                mimeType:
                    photo.mimeType,

                size:
                    photo.size,

                caption:
                    photo.caption,

                imageUrl:
                    `/api/photos/${photo._id}/image`
            }));

        res.json(safePhotos);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message:
                "Failed to retrieve photos."
        });
    }
});


// ---------------------------------------------
// SERVE A PRIVATE PHOTO
// ---------------------------------------------

router.get("/:id/image", async (req, res) => {
    try {
        const photo =
            await Photo.findById(
                req.params.id
            );

        if (!photo) {
            return res.status(404).json({
                message: "Photo not found."
            });
        }

        const object =
            await r2.send(
                new GetObjectCommand({
                    Bucket:
                        process.env
                            .R2_BUCKET_NAME,

                    Key:
                        photo.storageKey
                })
            );

        res.setHeader(
            "Content-Type",
            photo.mimeType
        );

        res.setHeader(
            "Cache-Control",
            "private, max-age=3600"
        );

        if (object.ContentLength) {
            res.setHeader(
                "Content-Length",
                object.ContentLength
            );
        }

        object.Body.on(
            "error",
            (error) => {
                console.error(
                    "R2 stream error:",
                    error
                );

                if (!res.headersSent) {
                    res.status(500).json({
                        message:
                            "Failed to load photo."
                    });
                } else {
                    res.destroy(error);
                }
            }
        );

        object.Body.pipe(res);
    } catch (error) {
        console.error(
            "Photo retrieval error:",
            error
        );

        if (!res.headersSent) {
            res.status(500).json({
                message:
                    "Failed to load photo."
            });
        }
    }
});


// ---------------------------------------------
// UPLOAD PHOTOS
// ---------------------------------------------

router.post(
    "/upload",

    upload.array("photos", 25),

    async (req, res) => {
        const uploadedStorageKeys = [];

        try {
            const { date } = req.body;

            if (!date) {
                return res.status(400).json({
                    message: "A date is required."
                });
            }

            if (!isValidDate(date)) {
                return res.status(400).json({
                    message: "Invalid date."
                });
            }

            if (
                !req.files ||
                req.files.length === 0
            ) {
                return res.status(400).json({
                    message:
                        "At least one photo is required."
                });
            }

            const createdPhotos = [];

            for (const file of req.files) {
                const optimizedBuffer =
                    await sharp(
                        file.buffer,
                        {
                            limitInputPixels:
                                80000000
                        }
                    )
                        .rotate()
                        .resize({
                            width: 2880,
                            height: 2880,
                            fit: "inside",
                            withoutEnlargement: true
                        })
                        .webp({
                            quality: 88
                        })
                        .toBuffer();

                const storageKey =
                    createStorageKey(date);

                await r2.send(
                    new PutObjectCommand({
                        Bucket:
                            process.env
                                .R2_BUCKET_NAME,

                        Key:
                            storageKey,

                        Body:
                            optimizedBuffer,

                        ContentType:
                            "image/webp"
                    })
                );

                uploadedStorageKeys.push(
                    storageKey
                );

                const photo =
                    await Photo.create({
                        date:
                            date,

                        storageKey:
                            storageKey,

                        originalName:
                            file.originalname,

                        mimeType:
                            "image/webp",

                        size:
                            optimizedBuffer.length,

                        caption:
                            ""
                    });

                createdPhotos.push({
                    _id:
                        photo._id,

                    date:
                        photo.date,

                    originalName:
                        photo.originalName,

                    mimeType:
                        photo.mimeType,

                    size:
                        photo.size,

                    caption:
                        photo.caption,

                    imageUrl:
                        `/api/photos/${photo._id}/image`
                });
            }

            res.status(201).json({
                message:
                    `${
                        createdPhotos.length
                    } ${
                        createdPhotos.length === 1
                            ? "photo"
                            : "photos"
                    } uploaded successfully.`,

                photos:
                    createdPhotos
            });
        } catch (error) {
            console.error(
                "Photo upload error:",
                error
            );

            for (
                const storageKey
                of uploadedStorageKeys
            ) {
                await deleteFromR2(
                    storageKey
                );
            }

            if (
                uploadedStorageKeys.length > 0
            ) {
                try {
                    await Photo.deleteMany({
                        storageKey: {
                            $in:
                                uploadedStorageKeys
                        }
                    });
                } catch (cleanupError) {
                    console.error(
                        "MongoDB cleanup failed:",
                        cleanupError
                    );
                }
            }

            res.status(500).json({
                message:
                    "Photo upload failed."
            });
        }
    }
);

// ---------------------------------------------
// UPDATE PHOTO CAPTION
// ---------------------------------------------

router.put("/:id/caption", async (req, res) => {
    try {
        const { caption } = req.body;

        if (typeof caption !== "string") {
            return res.status(400).json({
                message:
                    "Caption must be text."
            });
        }

        const cleanCaption =
            caption.trim();

        if (cleanCaption.length > 500) {
            return res.status(400).json({
                message:
                    "Caption must be 500 characters or fewer."
            });
        }

        const photo =
            await Photo.findByIdAndUpdate(
                req.params.id,
                {
                    caption:
                        cleanCaption
                },
                {
                    returnDocument: "after",
                    runValidators: true
                }
            );

        if (!photo) {
            return res.status(404).json({
                message: "Photo not found."
            });
        }

        res.json({
            message:
                "Caption saved successfully.",

            photo: {
                _id:
                    photo._id,

                date:
                    photo.date,

                originalName:
                    photo.originalName,

                mimeType:
                    photo.mimeType,

                size:
                    photo.size,

                caption:
                    photo.caption,

                imageUrl:
                    `/api/photos/${photo._id}/image`
            }
        });
    } catch (error) {
        console.error(
            "Caption update error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to save caption."
        });
    }
});

// ---------------------------------------------
// DELETE PHOTO
// ---------------------------------------------

router.delete("/:id", async (req, res) => {
    try {
        const photo =
            await Photo.findById(
                req.params.id
            );

        if (!photo) {
            return res.status(404).json({
                message: "Photo not found."
            });
        }

        // Delete the actual image from
        // private Cloudflare R2 storage.
        await r2.send(
            new DeleteObjectCommand({
                Bucket:
                    process.env.R2_BUCKET_NAME,

                Key:
                    photo.storageKey
            })
        );

        // Only remove the MongoDB record
        // after R2 deletion succeeds.
        await Photo.findByIdAndDelete(
            photo._id
        );

        res.json({
            message:
                "Photo deleted successfully."
        });
    } catch (error) {
        console.error(
            "Photo deletion error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to delete photo."
        });
    }
});

// ---------------------------------------------
// MULTER ERROR HANDLING
// ---------------------------------------------

router.use((error, req, res, next) => {
    if (
        error instanceof multer.MulterError
    ) {
        if (
            error.code ===
            "LIMIT_FILE_SIZE"
        ) {
            return res.status(400).json({
                message:
                    "Each photo must be 25 MB or smaller."
            });
        }

        if (
            error.code ===
            "LIMIT_FILE_COUNT"
        ) {
            return res.status(400).json({
                message:
                    "You can upload a maximum of 25 photos at once."
            });
        }

        return res.status(400).json({
            message:
                "Photo upload could not be processed."
        });
    }

    if (error) {
        console.error(
            "Upload validation error:",
            error
        );

        return res.status(400).json({
            message:
                error.message ||
                "Invalid photo upload."
        });
    }

    next();
});


module.exports = router;