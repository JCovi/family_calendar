const express = require("express");

const {
    GetObjectCommand
} = require("@aws-sdk/client-s3");

const r2 =
    require("../config/r2");

const router = express.Router();


const allowedBubblePhotos = new Set([
    "amanda.png",
    "cameron.png",
    "dad.png",
    "dane.png",
    "ellah.png",
    "jared.png",
    "jolene.png",
    "joshua.png",
    "leila.png",
    "mom.png",
    "mylah.png",
    "norah.png",
    "randy.png",
    "sara.png"
]);


/*
 * GET /api/family-bubbles/:filename
 *
 * Streams an approved family bubble image
 * from the private Cloudflare R2 bucket.
 */

router.get(
    "/:filename",
    async (req, res) => {
        try {
            const filename =
                req.params.filename;

            if (
                !allowedBubblePhotos.has(
                    filename
                )
            ) {
                return res
                    .status(404)
                    .json({
                        message:
                            "Family bubble not found."
                    });
            }

            const command =
                new GetObjectCommand({
                    Bucket:
                        process.env
                            .R2_BUCKET_NAME,

                    Key:
                        `family-bubbles/${filename}`
                });

            const result =
                await r2.send(command);

            res.setHeader(
                "Content-Type",
                result.ContentType ||
                    "image/png"
            );

            res.setHeader(
                "Cache-Control",
                "private, max-age=3600"
            );

            result.Body.pipe(res);

        } catch (error) {
            console.error(
                "Family bubble error:",
                error
            );

            res
                .status(404)
                .json({
                    message:
                        "Family bubble not found."
                });
        }
    }
);


module.exports = router;