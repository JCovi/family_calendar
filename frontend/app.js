const loadingScreen =
    document.getElementById("loadingScreen");

const loginScreen =
    document.getElementById("loginScreen");

const appContainer =
    document.getElementById("appContainer");

const loginForm =
    document.getElementById("loginForm");

const loginPassword =
    document.getElementById("loginPassword");

const loginError =
    document.getElementById("loginError");

const loginButton =
    document.getElementById("loginButton");

const logoutButton =
    document.getElementById("logoutButton");

const monthView =
    document.getElementById("monthView");

const dayView =
    document.getElementById("dayView");

const monthName =
    document.getElementById("monthName");

const yearSelect =
    document.getElementById("yearSelect");

const calendarGrid =
    document.getElementById("calendarGrid");

const previousMonthButton =
    document.getElementById("previousMonth");

const nextMonthButton =
    document.getElementById("nextMonth");

const backToCalendarButton =
    document.getElementById("backToCalendar");

const dayViewDate =
    document.getElementById("dayViewDate");

const previousDayButton =
    document.getElementById("previousDay");

const nextDayButton =
    document.getElementById("nextDay");

const addEventButton =
    document.getElementById("addEventButton");

const cancelEventButton =
    document.getElementById("cancelEventButton");

const eventForm =
    document.getElementById("eventForm");

const eventFormHeading =
    document.getElementById("eventFormHeading");

const saveEventButton =
    document.getElementById("saveEventButton");

const eventTitle =
    document.getElementById("eventTitle");

const eventTime =
    document.getElementById("eventTime");

const eventLocation =
    document.getElementById("eventLocation");

const eventNotes =
    document.getElementById("eventNotes");

const eventsList =
    document.getElementById("eventsList");

const addBirthdayButton =
    document.getElementById(
        "addBirthdayButton"
    );

const cancelBirthdayButton =
    document.getElementById(
        "cancelBirthdayButton"
    );

const birthdayForm =
    document.getElementById(
        "birthdayForm"
    );

const birthdayFormHeading =
    document.getElementById(
        "birthdayFormHeading"
    );

const saveBirthdayButton =
    document.getElementById(
        "saveBirthdayButton"
    );

const birthdayName =
    document.getElementById(
        "birthdayName"
    );

const birthdayNotes =
    document.getElementById(
        "birthdayNotes"
    );

const birthdaysList =
    document.getElementById(
        "birthdaysList"
    );

const uploadPhotosButton =
    document.getElementById(
        "uploadPhotosButton"
    );

const photoInput =
    document.getElementById(
        "photoInput"
    );

const photoUploadStatus =
    document.getElementById(
        "photoUploadStatus"
    );

const photosContainer =
    document.getElementById(
        "photosContainer"
    );

    const photoViewer =
    document.getElementById(
        "photoViewer"
    );

const photoViewerImage =
    document.getElementById(
        "photoViewerImage"
    );

const photoViewerCaption =
    document.getElementById(
        "photoViewerCaption"
    );

const photoViewerCounter =
    document.getElementById(
        "photoViewerCounter"
    );

const closePhotoViewerButton =
    document.getElementById(
        "closePhotoViewer"
    );

const previousPhotoButton =
    document.getElementById(
        "previousPhoto"
    );

const nextPhotoButton =
    document.getElementById(
        "nextPhoto"
    );

const photosButton =
    document.getElementById(
        "photosButton"
    );

const bubblesButton =
    document.getElementById(
        "bubblesButton"
    );

const gameButton =
    document.getElementById(
        "gameButton"
    );

const gameView =
    document.getElementById(
        "gameView"
    );

const exitGameButton =
    document.getElementById(
        "exitGameButton"
    );

const poolTable =
    document.getElementById(
        "poolTable"
    );

const familyPoolWinPopup =
    document.getElementById(
        "familyPoolWinPopup"
    );

const poolPlayingSurface =
    document.getElementById(
        "poolPlayingSurface"
    );

const poolBallsLayer =
    document.getElementById(
        "poolBallsLayer"
    );

const poolPockets =
    Array.from(
        document.querySelectorAll(
            ".pool-pocket"
        )
    );

const photoArchiveView =
    document.getElementById(
        "photoArchiveView"
    );

const backFromPhotosButton =
    document.getElementById(
        "backFromPhotos"
    );

const photoArchiveContainer =
    document.getElementById(
        "photoArchiveContainer"
    );

const deletePhotoButton =
    document.getElementById(
        "deletePhotoButton"
    );

const photoCaptionInput =
    document.getElementById(
        "photoCaptionInput"
    );

const savePhotoCaptionButton =
    document.getElementById(
        "savePhotoCaptionButton"
    );

let currentDate = new Date();
let selectedDate = null;
let editingEventId = null;
let editingBirthdayId = null;
let currentPhotos = [];
let currentPhotoIndex = 0;
let photoViewerSource = "day";

let calendarInitialized = false;


/* FLOATING FAMILY BUBBLES */

const familyBubblesLayer =
    document.getElementById(
        "familyBubblesLayer"
    );

const familyBubblePhotos = [
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
];

const familyBubbles = [];

let familyBubbleAnimationFrame = null;

let familyBubbleMode = "calendar";

let familyBubblesEnabled = false;

let familyPoolBreaker = null;

let familyPoolAnimationFrame = null;

let familyPoolGameWon = false;

const FAMILY_POOL_MAX_SPEED = 22;
const FAMILY_POOL_FRICTION = 0.985;
const FAMILY_POOL_STOP_SPEED = 0.035;
const FAMILY_POOL_RAIL_BOUNCE = 0.88;
const FAMILY_POOL_COLLISION_BOUNCE = 0.96;

const familyBubblePointer = {
    x: 0,
    y: 0,
    active: false
};

const FAMILY_BUBBLE_DRIFT_SPEED = 0.18;
const FAMILY_BUBBLE_MAX_SPEED = 100;
const FAMILY_BUBBLE_PUSH_RADIUS = 120;
const FAMILY_BUBBLE_PUSH_STRENGTH = 0.5;

function randomBetween(min, max) {
    return (
        Math.random() *
            (max - min) +
        min
    );
}

function updateBubblesButton() {
    if (!bubblesButton) {
        return;
    }

    bubblesButton.setAttribute(
        "aria-pressed",
        familyBubblesEnabled
            ? "true"
            : "false"
    );

    bubblesButton.textContent =
        familyBubblesEnabled
            ? "Bubbles On"
            : "Bubbles";
}


function createFamilyBubbles() {
    if (
        !familyBubblesLayer ||
        familyBubbles.length > 0
    ) {
        return;
    }

    familyBubblePhotos.forEach(
        (photo) => {

            const bubbleElement =
                document.createElement(
                    "div"
                );

            bubbleElement.classList.add(
                "family-bubble"
            );

            const image =
                document.createElement(
                    "img"
                );

            image.src =
                `/api/family-bubbles/${photo}`;

            image.alt = "";

            bubbleElement.appendChild(
                image
            );

            familyBubblesLayer.appendChild(
                bubbleElement
            );


            const size =
                window.innerWidth <= 600
                    ? 48
                    : 64;

            bubbleElement.style.width =
                `${size}px`;

            bubbleElement.style.height =
                `${size}px`;


            const maxX =
                Math.max(
                    0,
                    window.innerWidth - size
                );

            const maxY =
                Math.max(
                    0,
                    window.innerHeight - size
                );


            let x = 0;
            let y = 0;

            let validPosition = false;

            const radius =
                size / 2;


            /*
             * Try several random locations
             * until this bubble does not
             * overlap an existing one.
             */

            for (
                let attempt = 0;
                attempt < 100;
                attempt++
            ) {
                const candidateX =
                    randomBetween(
                        0,
                        maxX
                    );

                const candidateY =
                    randomBetween(
                        0,
                        maxY
                    );


                const candidateCenterX =
                    candidateX + radius;

                const candidateCenterY =
                    candidateY + radius;


                const overlaps =
                    familyBubbles.some(
                        (otherBubble) => {

                            const otherRadius =
                                otherBubble.size /
                                2;

                            const otherCenterX =
                                otherBubble.x +
                                otherRadius;

                            const otherCenterY =
                                otherBubble.y +
                                otherRadius;


                            const distance =
                                Math.hypot(
                                    candidateCenterX -
                                        otherCenterX,

                                    candidateCenterY -
                                        otherCenterY
                                );


                            return (
                                distance <
                                radius +
                                    otherRadius +
                                    1
                            );
                        }
                    );


                if (!overlaps) {
                    x = candidateX;
                    y = candidateY;

                    validPosition = true;

                    break;
                }
            }


            /*
             * Extremely small screens may
             * not have enough free space.
             * Collision physics will resolve
             * the fallback position.
             */

            if (!validPosition) {
                x =
                    randomBetween(
                        0,
                        maxX
                    );

                y =
                    randomBetween(
                        0,
                        maxY
                    );
            }


            let velocityX =
                randomBetween(
                    -0.18,
                    0.18
                );

            let velocityY =
                randomBetween(
                    -0.18,
                    0.18
                );


            /*
             * Make sure a bubble does not
             * begin almost completely still.
             */

            if (
                Math.abs(velocityX) < 0.06
            ) {
                velocityX =
                    velocityX < 0
                        ? -0.06
                        : 0.06;
            }

            if (
                Math.abs(velocityY) < 0.06
            ) {
                velocityY =
                    velocityY < 0
                        ? -0.06
                        : 0.06;
            }


            const bubble = {
                element:
                    bubbleElement,

                x,
                y,

                size,

                velocityX,
                velocityY,

                dragging: false,
                pointerId: null,

                dragOffsetX: 0,
                dragOffsetY: 0,

                previousPointerX: 0,
                previousPointerY: 0,
                previousPointerTime: 0,

                pocketed: false
            };


            familyBubbles.push(bubble);


            addFamilyBubbleDragHandlers(
                bubble
            );
        }
    );

    updateFamilyBubblePositions();
}


function updateFamilyBubblePositions() {
    familyBubbles.forEach(
        (bubble) => {

            bubble.element.style.transform =
                `translate3d(
                    ${bubble.x}px,
                    ${bubble.y}px,
                    0
                )`;
        }
    );
}

function limitFamilyPoolBallSpeed(
    bubble
) {
    const speed =
        Math.hypot(
            bubble.velocityX,
            bubble.velocityY
        );


    if (
        speed <=
        FAMILY_POOL_MAX_SPEED
    ) {
        return;
    }


    const scale =
        FAMILY_POOL_MAX_SPEED /
        speed;


    bubble.velocityX *= scale;
    bubble.velocityY *= scale;
}

function limitFamilyBubbleSpeed(bubble) {
    const speed =
        Math.hypot(
            bubble.velocityX,
            bubble.velocityY
        );

    if (
        speed <= FAMILY_BUBBLE_MAX_SPEED
    ) {
        return;
    }

    const scale =
        FAMILY_BUBBLE_MAX_SPEED /
        speed;

    bubble.velocityX *= scale;
    bubble.velocityY *= scale;
}


function applyFamilyBubblePointerPush() {
    if (!familyBubblePointer.active) {
        return;
    }

    familyBubbles.forEach(
        (bubble) => {

            if (bubble.dragging) {
                return;
            }


            const centerX =
                bubble.x +
                bubble.size / 2;

            const centerY =
                bubble.y +
                bubble.size / 2;


            let deltaX =
                centerX -
                familyBubblePointer.x;

            let deltaY =
                centerY -
                familyBubblePointer.y;


            let distance =
                Math.hypot(
                    deltaX,
                    deltaY
                );


            if (
                distance >=
                FAMILY_BUBBLE_PUSH_RADIUS
            ) {
                return;
            }


            if (distance < 1) {
                deltaX =
                    Math.random() - 0.5;

                deltaY =
                    Math.random() - 0.5;

                distance =
                    Math.hypot(
                        deltaX,
                        deltaY
                    );
            }


            const normalX =
                deltaX / distance;

            const normalY =
                deltaY / distance;


            const strength =
                (
                    1 -
                    distance /
                    FAMILY_BUBBLE_PUSH_RADIUS
                ) *
                FAMILY_BUBBLE_PUSH_STRENGTH;


            bubble.velocityX +=
                normalX * strength;

            bubble.velocityY +=
                normalY * strength;


            limitFamilyBubbleSpeed(
                bubble
            );
        }
    );
}


function addFamilyBubbleDragHandlers(
    bubble
) {
    const element =
        bubble.element;


    element.addEventListener(
        "pointerdown",
        (event) => {
            event.preventDefault();


            bubble.dragging = true;

            bubble.pointerId =
                event.pointerId;


            element.setPointerCapture(
                event.pointerId
            );


            /*
             * Grabbing a moving bubble
             * immediately stops its existing
             * motion.
             */

            bubble.velocityX = 0;
            bubble.velocityY = 0;


            if (
                familyBubbleMode === "game"
            ) {
                const surfaceRect =
                    poolPlayingSurface
                        .getBoundingClientRect();


                bubble.dragOffsetX =
                    event.clientX -
                    surfaceRect.left -
                    bubble.x;

                bubble.dragOffsetY =
                    event.clientY -
                    surfaceRect.top -
                    bubble.y;

            } else {

                bubble.dragOffsetX =
                    event.clientX -
                    bubble.x;

                bubble.dragOffsetY =
                    event.clientY -
                    bubble.y;
            }


            bubble.previousPointerX =
                event.clientX;

            bubble.previousPointerY =
                event.clientY;

            bubble.previousPointerTime =
                performance.now();
        }
    );


    element.addEventListener(
        "pointermove",
        (event) => {

            if (
                !bubble.dragging ||
                event.pointerId !==
                    bubble.pointerId
            ) {
                return;
            }


            const now =
                performance.now();


            const elapsed =
                Math.max(
                    1,
                    now -
                        bubble
                            .previousPointerTime
                );


            const movementX =
                event.clientX -
                bubble.previousPointerX;

            const movementY =
                event.clientY -
                bubble.previousPointerY;


            /*
             * Convert pointer movement into
             * frame-based throw velocity.
             */

            bubble.velocityX =
                movementX /
                elapsed *
                16.67;

            bubble.velocityY =
                movementY /
                elapsed *
                16.67;


            if (
                familyBubbleMode === "game"
            ) {
                limitFamilyPoolBallSpeed(
                    bubble
                );


                const surfaceRect =
                    poolPlayingSurface
                        .getBoundingClientRect();


                bubble.x =
                    event.clientX -
                    surfaceRect.left -
                    bubble.dragOffsetX;

                bubble.y =
                    event.clientY -
                    surfaceRect.top -
                    bubble.dragOffsetY;


                const maxX =
                    Math.max(
                        0,
                        poolPlayingSurface
                            .clientWidth -
                            bubble.size
                    );

                const maxY =
                    Math.max(
                        0,
                        poolPlayingSurface
                            .clientHeight -
                            bubble.size
                    );


                bubble.x =
                    Math.min(
                        Math.max(
                            bubble.x,
                            0
                        ),
                        maxX
                    );

                bubble.y =
                    Math.min(
                        Math.max(
                            bubble.y,
                            0
                        ),
                        maxY
                    );

            } else {

                limitFamilyBubbleSpeed(
                    bubble
                );


                bubble.x =
                    event.clientX -
                    bubble.dragOffsetX;

                bubble.y =
                    event.clientY -
                    bubble.dragOffsetY;


                const maxX =
                    Math.max(
                        0,
                        window.innerWidth -
                            bubble.size
                    );

                const maxY =
                    Math.max(
                        0,
                        window.innerHeight -
                            bubble.size
                    );


                bubble.x =
                    Math.min(
                        Math.max(
                            bubble.x,
                            0
                        ),
                        maxX
                    );

                bubble.y =
                    Math.min(
                        Math.max(
                            bubble.y,
                            0
                        ),
                        maxY
                    );
            }


            bubble.previousPointerX =
                event.clientX;

            bubble.previousPointerY =
                event.clientY;

            bubble.previousPointerTime =
                now;


            updateFamilyBubblePositions();
        }
    );


    const releaseBubble =
        (event) => {

            if (
                !bubble.dragging ||
                event.pointerId !==
                    bubble.pointerId
            ) {
                return;
            }


            bubble.dragging = false;
            bubble.pointerId = null;


            if (
                familyBubbleMode === "game"
            ) {
                limitFamilyPoolBallSpeed(
                    bubble
                );
            } else {
                limitFamilyBubbleSpeed(
                    bubble
                );
            }


            if (
                element.hasPointerCapture(
                    event.pointerId
                )
            ) {
                element.releasePointerCapture(
                    event.pointerId
                );
            }
        };


    element.addEventListener(
        "pointerup",
        releaseBubble
    );


    element.addEventListener(
    "pointercancel",
    releaseBubble
);
}


/*
 * Resolve collisions between the floating
 * Calendar family bubbles.
 *
 * This is intentionally separate from
 * Family Pool collision physics.
 */
function resolveFamilyBubbleCollisions() {
    for (
        let i = 0;
        i < familyBubbles.length;
        i++
    ) {
        for (
            let j = i + 1;
            j < familyBubbles.length;
            j++
        ) {
            const bubbleA =
                familyBubbles[i];

            const bubbleB =
                familyBubbles[j];


            const radiusA =
                bubbleA.size / 2;

            const radiusB =
                bubbleB.size / 2;


            const centerAX =
                bubbleA.x + radiusA;

            const centerAY =
                bubbleA.y + radiusA;

            const centerBX =
                bubbleB.x + radiusB;

            const centerBY =
                bubbleB.y + radiusB;


            let deltaX =
                centerBX - centerAX;

            let deltaY =
                centerBY - centerAY;


            let distance =
                Math.hypot(
                    deltaX,
                    deltaY
                );


            const minimumDistance =
                radiusA + radiusB;


            if (
                distance >=
                minimumDistance
            ) {
                continue;
            }


            /*
             * Avoid dividing by zero if two
             * bubbles somehow have exactly
             * the same center point.
             */
            if (distance === 0) {
                deltaX = 1;
                deltaY = 0;
                distance = 1;
            }


            const normalX =
                deltaX / distance;

            const normalY =
                deltaY / distance;


            /*
             * Separate overlapping bubbles
             * so they cannot remain stuck
             * inside one another.
             */
            const overlap =
                minimumDistance -
                distance;

            const separation =
                overlap / 2;


            if (!bubbleA.dragging) {
                bubbleA.x -=
                    normalX *
                    separation;

                bubbleA.y -=
                    normalY *
                    separation;
            }


            if (!bubbleB.dragging) {
                bubbleB.x +=
                    normalX *
                    separation;

                bubbleB.y +=
                    normalY *
                    separation;
            }


            /*
             * Determine how quickly the
             * bubbles are moving toward
             * one another.
             */
            const relativeVelocityX =
                bubbleB.velocityX -
                bubbleA.velocityX;

            const relativeVelocityY =
                bubbleB.velocityY -
                bubbleA.velocityY;


            const velocityAlongNormal =
                relativeVelocityX *
                    normalX +
                relativeVelocityY *
                    normalY;


            /*
             * If they're already moving
             * apart, separation alone is
             * enough.
             */
            if (
                velocityAlongNormal >= 0
            ) {
                continue;
            }


            /*
             * Equal-mass elastic collision.
             *
             * This preserves the lively
             * bouncing behavior used by the
             * original Calendar bubbles.
             */
            const impulse =
                -velocityAlongNormal;


            const impulseX =
                impulse * normalX;

            const impulseY =
                impulse * normalY;


            if (!bubbleA.dragging) {
                bubbleA.velocityX -=
                    impulseX;

                bubbleA.velocityY -=
                    impulseY;
            }


            if (!bubbleB.dragging) {
                bubbleB.velocityX +=
                    impulseX;

                bubbleB.velocityY +=
                    impulseY;
            }


            limitFamilyBubbleSpeed(
                bubbleA
            );

            limitFamilyBubbleSpeed(
                bubbleB
            );
        }
    }
}

function finishFamilyPoolGame() {
    /*
     * Prevent the win sequence from
     * running more than once.
     */

    if (familyPoolGameWon) {
        return;
    }


    familyPoolGameWon = true;


    /*
     * Stop pool physics immediately.
     */

    if (
        familyPoolAnimationFrame !== null
    ) {
        cancelAnimationFrame(
            familyPoolAnimationFrame
        );

        familyPoolAnimationFrame = null;
    }


    /*
     * Show the large victory popup.
     */

    familyPoolWinPopup.classList.remove(
        "hidden"
    );


    /*
     * Leave the celebration visible for
     * 2.5 seconds before returning to the
     * Family Calendar.
     */

    setTimeout(
        () => {

            /*
             * The player may have already
             * navigated away.
             */

            if (
                familyBubbleMode !== "game"
            ) {
                familyPoolWinPopup
                    .classList.add(
                        "hidden"
                    );

                return;
            }


            familyPoolWinPopup.classList.add(
                "hidden"
            );


            closeGame();

        },
        2500
    );
}

function checkFamilyPoolPockets() {
    /*
     * Pocket positions are measured from
     * the actual rendered DOM so this works
     * for both:
     *
     * Desktop landscape tables
     * and
     * Mobile portrait tables.
     */

    const surfaceRect =
        poolPlayingSurface
            .getBoundingClientRect();


    const pocketData =
        poolPockets.map(
            (pocket) => {

                const rect =
                    pocket
                        .getBoundingClientRect();


                return {
                    x:
                        rect.left +
                        rect.width / 2 -
                        surfaceRect.left,

                    y:
                        rect.top +
                        rect.height / 2 -
                        surfaceRect.top,

                    radius:
                        Math.min(
                            rect.width,
                            rect.height
                        ) / 2
                };
            }
        );


    familyBubbles.forEach(
        (bubble) => {

            /*
             * A pocketed ball no longer
             * participates in the game.
             */

            if (
                bubble.pocketed ||
                bubble.dragging
            ) {
                return;
            }


            const ballRadius =
                bubble.size / 2;


            const centerX =
                bubble.x +
                ballRadius;

            const centerY =
                bubble.y +
                ballRadius;


            const enteredPocket =
                pocketData.some(
                    (pocket) => {

                        const distance =
                            Math.hypot(
                                centerX -
                                    pocket.x,

                                centerY -
                                    pocket.y
                            );


                        /*
                         * Slightly forgiving
                         * detection makes the
                         * pockets fun without
                         * making them enormous.
                         */

                        const captureRadius =
                            pocket.radius +
                            ballRadius *
                                0.95;


                        return (
                            distance <=
                            captureRadius
                        );
                    }
                );


            if (!enteredPocket) {
                return;
            }


            /*
             * Sink this family member.
             *
             * Keep the bubble object alive
             * so Exit Game can restore it.
             */

            bubble.pocketed = true;

            bubble.velocityX = 0;
            bubble.velocityY = 0;

            bubble.dragging = false;
            bubble.pointerId = null;

                        bubble.element.style.display =
                "none";
        }
    );


    /*
     * If every family member has been
     * pocketed, the game is complete.
     */

    const allPocketed =
        familyBubbles.length > 0 &&
        familyBubbles.every(
            (bubble) =>
                bubble.pocketed
        );


    if (allPocketed) {
        finishFamilyPoolGame();
    }
}


function resolveFamilyPoolCollisions() {
    for (
        let i = 0;
        i < familyBubbles.length;
        i++
    ) {
        for (
            let j = i + 1;
            j < familyBubbles.length;
            j++
        ) {
            const bubbleA =
                familyBubbles[i];

            const bubbleB =
                familyBubbles[j];


            if (
                bubbleA.pocketed ||
                bubbleB.pocketed
            ) {
                continue;
            }


            const radiusA =
                bubbleA.size / 2;

            const radiusB =
                bubbleB.size / 2;


            const centerAX =
                bubbleA.x + radiusA;

            const centerAY =
                bubbleA.y + radiusA;

            const centerBX =
                bubbleB.x + radiusB;

            const centerBY =
                bubbleB.y + radiusB;


            let deltaX =
                centerBX - centerAX;

            let deltaY =
                centerBY - centerAY;


            let distance =
                Math.hypot(
                    deltaX,
                    deltaY
                );


            const minimumDistance =
                radiusA + radiusB;


            if (
                distance >=
                minimumDistance
            ) {
                continue;
            }


            if (distance === 0) {
                deltaX = 1;
                deltaY = 0;
                distance = 1;
            }


            const normalX =
                deltaX / distance;

            const normalY =
                deltaY / distance;


            /*
             * First physically separate
             * overlapping balls.
             */

            const overlap =
                minimumDistance -
                distance;

            const separation =
                overlap / 2;


            if (!bubbleA.dragging) {
                bubbleA.x -=
                    normalX *
                    separation;

                bubbleA.y -=
                    normalY *
                    separation;
            }


            if (!bubbleB.dragging) {
                bubbleB.x +=
                    normalX *
                    separation;

                bubbleB.y +=
                    normalY *
                    separation;
            }


            /*
             * Find their relative speed
             * along the collision normal.
             */

            const relativeVelocityX =
                bubbleB.velocityX -
                bubbleA.velocityX;

            const relativeVelocityY =
                bubbleB.velocityY -
                bubbleA.velocityY;


            const velocityAlongNormal =
                relativeVelocityX *
                    normalX +
                relativeVelocityY *
                    normalY;


            if (
                velocityAlongNormal >= 0
            ) {
                continue;
            }


            /*
             * Equal-mass pool-ball collision
             * with a tiny energy loss.
             */

            const impulse =
                -(
                    1 +
                    FAMILY_POOL_COLLISION_BOUNCE
                ) *
                velocityAlongNormal /
                2;


            const impulseX =
                impulse * normalX;

            const impulseY =
                impulse * normalY;


            if (!bubbleA.dragging) {
                bubbleA.velocityX -=
                    impulseX;

                bubbleA.velocityY -=
                    impulseY;
            }


            if (!bubbleB.dragging) {
                bubbleB.velocityX +=
                    impulseX;

                bubbleB.velocityY +=
                    impulseY;
            }


            limitFamilyPoolBallSpeed(
                bubbleA
            );

            limitFamilyPoolBallSpeed(
                bubbleB
            );
        }
    }
}

function animateFamilyPool() {
    if (
        familyBubbleMode !== "game" ||
        gameView.classList.contains(
            "hidden"
        )
    ) {
        familyPoolAnimationFrame = null;
        return;
    }


    const surfaceWidth =
        poolPlayingSurface.clientWidth;

    const surfaceHeight =
        poolPlayingSurface.clientHeight;


    familyBubbles.forEach(
        (bubble) => {

            if (
                bubble.pocketed ||
                bubble.dragging
            ) {
                return;
            }


            /*
             * Rolling resistance.
             *
             * Unlike Calendar Mode, there
             * is NO minimum drift speed.
             */

            bubble.velocityX *=
                FAMILY_POOL_FRICTION;

            bubble.velocityY *=
                FAMILY_POOL_FRICTION;


            const speed =
                Math.hypot(
                    bubble.velocityX,
                    bubble.velocityY
                );


            /*
             * Real pool balls eventually
             * stop. Once movement is tiny,
             * snap it exactly to zero.
             */

            if (
                speed <
                FAMILY_POOL_STOP_SPEED
            ) {
                bubble.velocityX = 0;
                bubble.velocityY = 0;
            }


            limitFamilyPoolBallSpeed(
                bubble
            );


            bubble.x +=
                bubble.velocityX;

            bubble.y +=
                bubble.velocityY;


            const maxX =
                Math.max(
                    0,
                    surfaceWidth -
                        bubble.size
                );

            const maxY =
                Math.max(
                    0,
                    surfaceHeight -
                        bubble.size
                );


            /*
             * Left rail.
             */

            if (bubble.x < 0) {
                bubble.x = 0;

                bubble.velocityX =
                    Math.abs(
                        bubble.velocityX
                    ) *
                    FAMILY_POOL_RAIL_BOUNCE;
            }


            /*
             * Right rail.
             */

            if (bubble.x > maxX) {
                bubble.x = maxX;

                bubble.velocityX =
                    -Math.abs(
                        bubble.velocityX
                    ) *
                    FAMILY_POOL_RAIL_BOUNCE;
            }


            /*
             * Top rail.
             */

            if (bubble.y < 0) {
                bubble.y = 0;

                bubble.velocityY =
                    Math.abs(
                        bubble.velocityY
                    ) *
                    FAMILY_POOL_RAIL_BOUNCE;
            }


            /*
             * Bottom rail.
             */

            if (bubble.y > maxY) {
                bubble.y = maxY;

                bubble.velocityY =
                    -Math.abs(
                        bubble.velocityY
                    ) *
                    FAMILY_POOL_RAIL_BOUNCE;
            }
        }
    );


    /*
    * Check whether any moving ball has
    * reached one of the six pockets.
    */

    checkFamilyPoolPockets();


    /*
    * Transfer momentum between the
    * remaining balls.
    */

    resolveFamilyPoolCollisions();


    /*
     * Collisions can push a ball slightly
     * outside the felt, so clamp everyone
     * once more.
     */

    familyBubbles.forEach(
        (bubble) => {

            if (bubble.pocketed) {
                return;
            }


            const maxX =
                Math.max(
                    0,
                    surfaceWidth -
                        bubble.size
                );

            const maxY =
                Math.max(
                    0,
                    surfaceHeight -
                        bubble.size
                );


            bubble.x =
                Math.min(
                    Math.max(
                        bubble.x,
                        0
                    ),
                    maxX
                );

            bubble.y =
                Math.min(
                    Math.max(
                        bubble.y,
                        0
                    ),
                    maxY
                );
        }
    );


    updateFamilyBubblePositions();


    /*
    * A pocket check may have completed
    * the game during this frame.
    *
    * Do not schedule another pool frame
    * after the win.
    */

    if (
        familyPoolGameWon ||
        familyBubbleMode !== "game"
    ) {
        familyPoolAnimationFrame = null;
        return;
    }


    familyPoolAnimationFrame =
        requestAnimationFrame(
            animateFamilyPool
        );
}

function animateFamilyBubbles() {
        if (
            familyBubbleMode !== "calendar"
        ) {
            familyBubbleAnimationFrame = null;
            return;
        }
    if (
        familyBubblesLayer.classList.contains(
            "hidden"
        )
    ) {
        familyBubbleAnimationFrame = null;
        return;
    }


    applyFamilyBubblePointerPush();


    familyBubbles.forEach(
        (bubble) => {

            if (bubble.dragging) {
                return;
            }


            /*
             * Gradually return very slow
             * bubbles toward a gentle drift.
             */

            const speed =
                Math.hypot(
                    bubble.velocityX,
                    bubble.velocityY
                );


            if (
                speed <
                FAMILY_BUBBLE_DRIFT_SPEED
            ) {
                const direction =
                    Math.atan2(
                        bubble.velocityY,
                        bubble.velocityX
                    );

                bubble.velocityX =
                    Math.cos(direction) *
                    FAMILY_BUBBLE_DRIFT_SPEED;

                bubble.velocityY =
                    Math.sin(direction) *
                    FAMILY_BUBBLE_DRIFT_SPEED;
            }


            /*
             * Gentle resistance means thrown
             * bubbles gradually slow down.
             */

            if (
                speed >
                FAMILY_BUBBLE_DRIFT_SPEED
            ) {
                bubble.velocityX *=
                    0.995;

                bubble.velocityY *=
                    0.995;
            }


            limitFamilyBubbleSpeed(
                bubble
            );


            bubble.x +=
                bubble.velocityX;

            bubble.y +=
                bubble.velocityY;


            const maxX =
                Math.max(
                    0,
                    window.innerWidth -
                        bubble.size
                );

            const maxY =
                Math.max(
                    0,
                    window.innerHeight -
                        bubble.size
                );


            if (bubble.x <= 0) {
                bubble.x = 0;

                bubble.velocityX =
                    Math.abs(
                        bubble.velocityX
                    );
            }


            if (bubble.x >= maxX) {
                bubble.x = maxX;

                bubble.velocityX =
                    -Math.abs(
                        bubble.velocityX
                    );
            }


            if (bubble.y <= 0) {
                bubble.y = 0;

                bubble.velocityY =
                    Math.abs(
                        bubble.velocityY
                    );
            }


            if (bubble.y >= maxY) {
                bubble.y = maxY;

                bubble.velocityY =
                    -Math.abs(
                        bubble.velocityY
                    );
            }
        }
    );


    resolveFamilyBubbleCollisions();


    /*
     * Collisions can move bubbles slightly
     * beyond an edge, so clamp them again.
     */

    familyBubbles.forEach(
        (bubble) => {

            const maxX =
                Math.max(
                    0,
                    window.innerWidth -
                        bubble.size
                );

            const maxY =
                Math.max(
                    0,
                    window.innerHeight -
                        bubble.size
                );


            bubble.x =
                Math.min(
                    Math.max(
                        bubble.x,
                        0
                    ),
                    maxX
                );

            bubble.y =
                Math.min(
                    Math.max(
                        bubble.y,
                        0
                    ),
                    maxY
                );
        }
    );


    updateFamilyBubblePositions();


    familyBubbleAnimationFrame =
        requestAnimationFrame(
            animateFamilyBubbles
        );
}

function getFamilyPoolBubbleSize() {
    return window.innerWidth <= 600
        ? 42
        : 56;
}


function moveFamilyBubblesToPoolLayer() {
    familyBubbles.forEach(
        (bubble) => {

            poolBallsLayer.appendChild(
                bubble.element
            );


            const size =
                getFamilyPoolBubbleSize();


            bubble.size = size;

            bubble.element.style.width =
                `${size}px`;

            bubble.element.style.height =
                `${size}px`;


            bubble.velocityX = 0;
            bubble.velocityY = 0;

            bubble.dragging = false;
            bubble.pointerId = null;

            bubble.pocketed = false;

            bubble.element.style.display = "";

            bubble.element.classList.add(
                "family-pool-ball"
            );
        }
    );
}


function arrangeFamilyPoolBalls() {
    if (
        familyBubbles.length !== 14
    ) {
        return;
    }


    const surfaceWidth =
        poolPlayingSurface.clientWidth;

    const surfaceHeight =
        poolPlayingSurface.clientHeight;


    if (
        surfaceWidth <= 0 ||
        surfaceHeight <= 0
    ) {
        return;
    }


    /*
     * Choose one random family member
     * to act as the breaker.
     */

    const breakerIndex =
        Math.floor(
            Math.random() *
            familyBubbles.length
        );


    familyPoolBreaker =
        familyBubbles[breakerIndex];


    const rackBubbles =
        familyBubbles.filter(
            (bubble) =>
                bubble !==
                familyPoolBreaker
        );


    const size =
        familyPoolBreaker.size;

    const radius =
        size / 2;


    /*
     * Keep a tiny amount of space between
     * bubbles so the rack begins stable,
     * but close enough for the break to
     * transfer through the whole group.
     */

    const spacing = 2;

    const step =
        size + spacing;


    const isPortrait =
        surfaceHeight >
        surfaceWidth;


    /*
     * -------------------------------
     * BREAKER
     * -------------------------------
     *
     * Landscape:
     * breaker on the left.
     *
     * Portrait:
     * breaker near the top.
     */

    if (!isPortrait) {
        familyPoolBreaker.x =
            surfaceWidth * 0.20 -
            radius;

        familyPoolBreaker.y =
            surfaceHeight / 2 -
            radius;
    } else {
        familyPoolBreaker.x =
            surfaceWidth / 2 -
            radius;

        familyPoolBreaker.y =
            surfaceHeight * 0.18 -
            radius;
    }


    /*
     * -------------------------------
     * 13-BUBBLE RACK
     * -------------------------------
     *
     * Pattern:
     *
     *       ●
     *      ● ●
     *     ● ● ●
     *    ● ● ● ●
     *     ● ● ●
     *
     * 1 + 2 + 3 + 4 + 3 = 13
     */

    const rows = [
        1,
        2,
        3,
        4,
        3
    ];


    let bubbleIndex = 0;


    if (!isPortrait) {

        /*
         * Landscape table:
         *
         * Rack points toward the breaker.
         * Rows extend toward the right.
         */

        const rackStartX =
            surfaceWidth * 0.68;


        rows.forEach(
            (count, rowIndex) => {

                const rowX =
                    rackStartX +
                    rowIndex *
                    step *
                    0.87;


                const rowHeight =
                    (count - 1) *
                    step;


                const startY =
                    surfaceHeight / 2 -
                    rowHeight / 2 -
                    radius;


                for (
                    let position = 0;
                    position < count;
                    position++
                ) {
                    const bubble =
                        rackBubbles[
                            bubbleIndex
                        ];


                    bubble.x =
                        rowX -
                        radius;

                    bubble.y =
                        startY +
                        position *
                        step;


                    bubble.velocityX = 0;
                    bubble.velocityY = 0;


                    bubbleIndex++;
                }
            }
        );

    } else {

        /*
         * Portrait table:
         *
         * Rack points upward toward the
         * breaker and extends downward.
         */

        const rackStartY =
            surfaceHeight * 0.64;


        rows.forEach(
            (count, rowIndex) => {

                const rowY =
                    rackStartY +
                    rowIndex *
                    step *
                    0.87;


                const rowWidth =
                    (count - 1) *
                    step;


                const startX =
                    surfaceWidth / 2 -
                    rowWidth / 2 -
                    radius;


                for (
                    let position = 0;
                    position < count;
                    position++
                ) {
                    const bubble =
                        rackBubbles[
                            bubbleIndex
                        ];


                    bubble.x =
                        startX +
                        position *
                        step;

                    bubble.y =
                        rowY -
                        radius;


                    bubble.velocityX = 0;
                    bubble.velocityY = 0;


                    bubbleIndex++;
                }
            }
        );
    }


    updateFamilyBubblePositions();
}


function startFamilyPoolGame() {
    /*
     * Switch to Game Mode FIRST.
     *
     * This prevents the normal Calendar
     * physics loop from continuing to
     * control the bubbles.
     */

    familyBubbleMode = "game";

    familyPoolGameWon = false;

    familyPoolWinPopup.classList.add(
        "hidden"
    );


    /*
     * Completely stop the normal
     * Calendar bubble animation.
     */

    if (
        familyBubbleAnimationFrame !== null
    ) {
        cancelAnimationFrame(
            familyBubbleAnimationFrame
        );

        familyBubbleAnimationFrame = null;
    }


    /*
     * If a pool animation somehow still
     * exists from a previous game, stop it
     * before starting a fresh one.
     */

    if (
        familyPoolAnimationFrame !== null
    ) {
        cancelAnimationFrame(
            familyPoolAnimationFrame
        );

        familyPoolAnimationFrame = null;
    }


    /*
     * Make sure all 14 family bubbles
     * have been created.
     */

    createFamilyBubbles();


    /*
     * Hide the normal full-screen
     * Calendar bubble layer.
     */

    familyBubblesLayer.classList.add(
        "hidden"
    );


    /*
     * Transfer the existing bubble
     * elements into the pool table.
     *
     * This also changes them to their
     * smaller Game Mode size and resets
     * their velocities to zero.
     */

    moveFamilyBubblesToPoolLayer();


    /*
     * Wait until the browser has laid out
     * the visible pool table.
     *
     * Then:
     * 1. Pick a random breaker.
     * 2. Arrange the other 13 in the rack.
     * 3. Start ONLY the pool physics loop.
     */

    requestAnimationFrame(
        () => {
            /*
             * Make sure we did not leave
             * Game Mode before this frame
             * was reached.
             */

            if (
                familyBubbleMode !== "game"
            ) {
                return;
            }


            arrangeFamilyPoolBalls();


            familyPoolAnimationFrame =
                requestAnimationFrame(
                    animateFamilyPool
                );
        }
    );
}


function resetFamilyBubblesToCalendar() {
    /*
     * Switch modes FIRST so Calendar Mode
     * is allowed to restart.
     */

    familyBubbleMode = "calendar";


    /*
     * Completely stop the pool animation.
     */

    if (
        familyPoolAnimationFrame !== null
    ) {
        cancelAnimationFrame(
            familyPoolAnimationFrame
        );

        familyPoolAnimationFrame = null;
    }


    familyPoolBreaker = null;


    /*
     * Move every bubble back into the
     * full-screen Calendar bubble layer.
     */

    familyBubbles.forEach(
        (bubble) => {

            familyBubblesLayer.appendChild(
                bubble.element
            );


            const size =
                window.innerWidth <= 600
                    ? 48
                    : 64;


            bubble.size = size;

            bubble.element.style.width =
                `${size}px`;

            bubble.element.style.height =
                `${size}px`;


            bubble.element.classList.remove(
                "family-pool-ball"
            );

            bubble.pocketed = false;

            bubble.element.style.display = "";


            /*
            * Give each bubble a fresh
            * Calendar position.
            */

            const maxX =
                Math.max(
                    0,
                    window.innerWidth -
                        size
                );

            const maxY =
                Math.max(
                    0,
                    window.innerHeight -
                        size
                );


            bubble.x =
                randomBetween(
                    0,
                    maxX
                );

            bubble.y =
                randomBetween(
                    0,
                    maxY
                );


            /*
             * Restore the normal gentle
             * Calendar movement.
             */

            bubble.velocityX =
                randomBetween(
                    -0.18,
                    0.18
                );

            bubble.velocityY =
                randomBetween(
                    -0.18,
                    0.18
                );


            if (
                Math.abs(
                    bubble.velocityX
                ) < 0.06
            ) {
                bubble.velocityX =
                    bubble.velocityX < 0
                        ? -0.06
                        : 0.06;
            }


            if (
                Math.abs(
                    bubble.velocityY
                ) < 0.06
            ) {
                bubble.velocityY =
                    bubble.velocityY < 0
                        ? -0.06
                        : 0.06;
            }


            bubble.dragging = false;
            bubble.pointerId = null;
        }
    );


    /*
    * Resolve any random overlaps before
    * returning the bubbles to Calendar Mode.
    */

    for (
        let pass = 0;
        pass < 8;
        pass++
    ) {
        resolveFamilyBubbleCollisions();
    }


    updateFamilyBubblePositions();


    /*
    * Restore the normal Calendar bubbles only
    * if the family has them enabled.
    */

    if (familyBubblesEnabled) {
        showFamilyBubbles();
    } else {
        hideFamilyBubbles();
    }
}

function showFamilyBubbles() {
    if (
        !familyBubblesEnabled ||
        familyBubbleMode !== "calendar"
    ) {
        hideFamilyBubbles();
        return;
    }

    if (!familyBubblesLayer) {
        return;
    }

    createFamilyBubbles();

    familyBubblesLayer.classList.remove(
        "hidden"
    );

    if (
        familyBubbleAnimationFrame === null
    ) {
        familyBubbleAnimationFrame =
            requestAnimationFrame(
                animateFamilyBubbles
            );
    }
}


function hideFamilyBubbles() {
    if (!familyBubblesLayer) {
        return;
    }

    familyBubblesLayer.classList.add(
        "hidden"
    );

    if (
        familyBubbleAnimationFrame !== null
    ) {
        cancelAnimationFrame(
            familyBubbleAnimationFrame
        );

        familyBubbleAnimationFrame = null;
    }
}

window.addEventListener(
    "pointermove",
    (event) => {

        /*
         * Mouse and stylus can push bubbles
         * simply by moving near them.
         *
         * Touch is excluded here because a
         * finger has no hover state.
         */

        if (
            event.pointerType === "touch"
        ) {
            return;
        }

        familyBubblePointer.x =
            event.clientX;

        familyBubblePointer.y =
            event.clientY;

        familyBubblePointer.active =
            true;
    }
);


window.addEventListener(
    "pointerleave",
    () => {
        familyBubblePointer.active =
            false;
    }
);

window.addEventListener(
    "resize",
    () => {
        familyBubbles.forEach(
            (bubble) => {

                const maxX =
                    Math.max(
                        0,
                        window.innerWidth -
                            bubble.size
                    );

                const maxY =
                    Math.max(
                        0,
                        window.innerHeight -
                            bubble.size
                    );

                bubble.x =
                    Math.min(
                        Math.max(
                            bubble.x,
                            0
                        ),
                        maxX
                    );

                bubble.y =
                    Math.min(
                        Math.max(
                            bubble.y,
                            0
                        ),
                        maxY
                    );
            }
        );

        updateFamilyBubblePositions();
    }
);


/* BROWSER NAVIGATION */

function setBrowserView(view, data = {}) {
    history.pushState(
        {
            view,
            ...data
        },
        ""
    );
}


function showCalendarFromHistory() {
    /*
     * If browser navigation is returning
     * from Game Mode, fully restore the
     * bubbles to Calendar Mode first.
     */

    if (
        familyBubbleMode === "game"
    ) {
        resetFamilyBubblesToCalendar();
    }


    gameView.classList.add(
        "hidden"
    );

    photosButton.classList.remove(
    "hidden"
    );

    bubblesButton.classList.remove(
        "hidden"
    );

    gameButton.classList.remove(
        "hidden"
    );


    selectedDate = null;

    resetEventForm();
    resetBirthdayForm();


    dayView.classList.add(
        "hidden"
    );

    photoArchiveView.classList.add(
        "hidden"
    );

    monthView.classList.remove(
        "hidden"
    );


       renderCalendar();

        updateBubblesButton();
        showFamilyBubbles();
}


window.addEventListener(
    "popstate",
    async (event) => {
        const state = event.state;

        if (!state || state.view === "calendar") {
            showCalendarFromHistory();
            return;
        }

        if (
            state.view === "day" &&
            state.date
        ) {
            await openDayView(
                state.date,
                false
            );

            return;
        }

        if (state.view === "photos") {
            await openPhotoArchive(false);
            return;
        }

        showCalendarFromHistory();
    }
);


/* AUTHENTICATION */

function showLoginScreen() {
    familyBubblesEnabled = false;

    updateBubblesButton();
    hideFamilyBubbles();

    loadingScreen.classList.add("hidden");
    appContainer.classList.add("hidden");

    loginScreen.classList.remove("hidden");

    loginForm.reset();

    loginError.textContent = "";
    loginError.classList.add("hidden");

    loginPassword.focus();
}

function showApplication() {
    loadingScreen.classList.add("hidden");
    loginScreen.classList.add("hidden");

    appContainer.classList.remove("hidden");

    if (!calendarInitialized) {
        buildYearSelector();
        calendarInitialized = true;

        history.replaceState(
            {
                view: "calendar"
            },
            ""
        );
    }

        renderCalendar();

        updateBubblesButton();
        showFamilyBubbles();
}

async function checkAuthentication() {
    try {
        const response = await fetch(
            "/api/auth/status"
        );

        if (!response.ok) {
            throw new Error(
                "Could not check authentication."
            );
        }

        const data = await response.json();

        if (data.authenticated) {
            showApplication();
        } else {
            showLoginScreen();
        }
    } catch (error) {
        console.error(error);

        showLoginScreen();

        loginError.textContent =
            "Could not connect to the server.";

        loginError.classList.remove("hidden");
    }
}

loginForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        loginError.textContent = "";
        loginError.classList.add("hidden");

        loginButton.disabled = true;
        loginButton.textContent = "Checking...";

        try {
            const response = await fetch(
                "/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        password:
                            loginPassword.value
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                loginError.textContent =
                    data.message ||
                    "Login failed.";

                loginError.classList.remove(
                    "hidden"
                );

                loginPassword.select();

                return;
            }

            loginForm.reset();

            showApplication();
        } catch (error) {
            console.error(error);

            loginError.textContent =
                "Could not connect to the server.";

            loginError.classList.remove("hidden");
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = "Enter";
        }
    }
);

logoutButton.addEventListener(
    "click",
    async () => {
        try {
            const response = await fetch(
                "/api/auth/logout",
                {
                    method: "POST"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Logout failed."
                );
            }

            selectedDate = null;

            resetEventForm();

            dayView.classList.add("hidden");
            monthView.classList.remove("hidden");

            showLoginScreen();
        } catch (error) {
            console.error(error);

            alert(
                "Could not log out. Please try again."
            );
        }
    }
);


/* CALENDAR HELPERS */

function buildYearSelector() {
    const currentYear =
        new Date().getFullYear();

    yearSelect.innerHTML = "";

    for (
        let year = currentYear - 100;
        year <= currentYear + 50;
        year++
    ) {
        const option =
            document.createElement("option");

        option.value = year;
        option.textContent = year;

        yearSelect.appendChild(option);
    }
}

function formatDate(year, month, day) {
    const formattedMonth =
        String(month + 1).padStart(2, "0");

    const formattedDay =
        String(day).padStart(2, "0");

    return (
        `${year}-${formattedMonth}-${formattedDay}`
    );
}

function formatMonth(year, month) {
    const formattedMonth =
        String(month + 1).padStart(2, "0");

    return `${year}-${formattedMonth}`;
}

function isToday(year, month, day) {
    const today = new Date();

    return (
        year === today.getFullYear() &&
        month === today.getMonth() &&
        day === today.getDate()
    );
}

function formatDayViewDate(dateString) {
    const [year, month, day] =
        dateString
            .split("-")
            .map(Number);

    const date =
        new Date(year, month - 1, day);

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );
}

function formatEventTime(time) {
    if (!time) {
        return "";
    }

    const [hourString, minute] =
        time.split(":");

    let hour = Number(hourString);

    const period =
        hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    if (hour === 0) {
        hour = 12;
    }

    return `${hour}:${minute} ${period}`;
}


/* EVENT FORM */

function resetEventForm() {
    editingEventId = null;

    eventForm.reset();

    eventFormHeading.textContent =
        "Add Event";

    saveEventButton.textContent =
        "Save Event";

    eventForm.classList.add("hidden");
}

function openAddEventForm() {
    editingEventId = null;

    eventForm.reset();

    eventFormHeading.textContent =
        "Add Event";

    saveEventButton.textContent =
        "Save Event";

    eventForm.classList.remove("hidden");

    eventTitle.focus();
}

function openEditEventForm(event) {
    editingEventId = event._id;

    eventTitle.value =
        event.title || "";

    eventTime.value =
        event.startTime || "";

    eventLocation.value =
        event.location || "";

    eventNotes.value =
        event.notes || "";

    eventFormHeading.textContent =
        "Edit Event";

    saveEventButton.textContent =
        "Save Changes";

    eventForm.classList.remove("hidden");

    eventForm.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

    eventTitle.focus();
}

/* BIRTHDAY FORM */

function resetBirthdayForm() {
    editingBirthdayId = null;

    birthdayForm.reset();

    birthdayFormHeading.textContent =
        "Add Birthday";

    saveBirthdayButton.textContent =
        "Save Birthday";

    birthdayForm.classList.add("hidden");
}


function openAddBirthdayForm() {
    editingBirthdayId = null;

    birthdayForm.reset();

    birthdayFormHeading.textContent =
        "Add Birthday";

    saveBirthdayButton.textContent =
        "Save Birthday";

    birthdayForm.classList.remove("hidden");

    birthdayName.focus();
}


function openEditBirthdayForm(birthday) {
    editingBirthdayId = birthday._id;

    birthdayName.value =
        birthday.name || "";

    birthdayNotes.value =
        birthday.notes || "";

    birthdayFormHeading.textContent =
        "Edit Birthday";

    saveBirthdayButton.textContent =
        "Save Changes";

    birthdayForm.classList.remove("hidden");

    birthdayForm.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

    birthdayName.focus();
}

/* AUTH FAILURE HANDLING */

function handleUnauthorized(response) {
    if (response.status !== 401) {
        return false;
    }

    showLoginScreen();

    return true;
}

/* BIRTHDAY DATA */

async function loadBirthdaysForDay() {
    if (!selectedDate) {
        return;
    }

    birthdaysList.innerHTML = `
        <p class="empty-message">
            Loading birthdays...
        </p>
    `;

    const [
        selectedYear,
        selectedMonth,
        selectedDay
    ] = selectedDate
        .split("-")
        .map(Number);

    try {
        const response = await fetch(
            `/api/birthdays?month=${selectedMonth}&day=${selectedDay}`
        );

        if (handleUnauthorized(response)) {
            return;
        }

        if (!response.ok) {
            throw new Error(
                "Failed to load birthdays."
            );
        }

        const birthdays =
            await response.json();

        renderBirthdays(birthdays);

    } catch (error) {
        console.error(error);

        birthdaysList.innerHTML = `
            <p class="empty-message">
                Could not load birthdays.
            </p>
        `;
    }
}


function renderBirthdays(birthdays) {
    birthdaysList.innerHTML = "";

    if (birthdays.length === 0) {
        birthdaysList.innerHTML = `
            <p class="empty-message">
                No birthdays on this day.
            </p>
        `;

        return;
    }

    birthdays.forEach((birthday) => {
        const birthdayCard =
            document.createElement("div");

        birthdayCard.classList.add(
            "event-card",
            "birthday-card"
        );


        const cardHeader =
            document.createElement("div");

        cardHeader.classList.add(
            "event-card-header"
        );


        const title =
            document.createElement("h4");

        title.textContent =
            `🎂 ${birthday.name}`;


        const actions =
            document.createElement("div");

        actions.classList.add(
            "event-actions"
        );


        const editButton =
            document.createElement("button");

        editButton.type = "button";

        editButton.classList.add(
            "edit-button"
        );

        editButton.textContent = "Edit";

        editButton.addEventListener(
            "click",
            () => {
                openEditBirthdayForm(
                    birthday
                );
            }
        );


        const deleteButton =
            document.createElement("button");

        deleteButton.type = "button";

        deleteButton.classList.add(
            "delete-button"
        );

        deleteButton.textContent =
            "Delete";

        deleteButton.addEventListener(
            "click",
            async () => {
                await deleteBirthday(
                    birthday
                );
            }
        );


        actions.appendChild(
            editButton
        );

        actions.appendChild(
            deleteButton
        );

        cardHeader.appendChild(
            title
        );

        cardHeader.appendChild(
            actions
        );

        birthdayCard.appendChild(
            cardHeader
        );


        if (birthday.notes) {
            const notes =
                document.createElement("p");

            notes.classList.add(
                "event-detail"
            );

            notes.textContent =
                `Notes: ${birthday.notes}`;

            birthdayCard.appendChild(
                notes
            );
        }


        birthdaysList.appendChild(
            birthdayCard
        );
    });
}


async function deleteBirthday(birthday) {
    const confirmed = confirm(
        `Delete ${birthday.name}'s birthday?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `/api/birthdays/${birthday._id}`,
            {
                method: "DELETE"
            }
        );

        if (handleUnauthorized(response)) {
            return;
        }

        if (!response.ok) {
            throw new Error(
                "Failed to delete birthday."
            );
        }

        if (
            editingBirthdayId ===
            birthday._id
        ) {
            resetBirthdayForm();
        }

        await loadBirthdaysForDay();

    } catch (error) {
        console.error(error);

        alert(
            "The birthday could not be deleted."
        );
    }
}


/* EVENT DATA */

async function loadEventsForDay() {
    eventsList.innerHTML = `
        <p class="empty-message">
            Loading events...
        </p>
    `;

    try {
        const response = await fetch(
            `/api/events?date=${selectedDate}`
        );

        if (handleUnauthorized(response)) {
            return;
        }

        if (!response.ok) {
            throw new Error(
                "Failed to load events."
            );
        }

        const events =
            await response.json();

        renderEvents(events);
    } catch (error) {
        console.error(error);

        eventsList.innerHTML = `
            <p class="empty-message">
                Could not load events.
            </p>
        `;
    }
}

async function loadMonthEventIndicators() {
    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();

    const monthString =
        formatMonth(year, month);

    try {
        const response = await fetch(
            `/api/events?month=${monthString}`
        );

        if (handleUnauthorized(response)) {
            return;
        }

        if (!response.ok) {
            throw new Error(
                "Failed to load month events."
            );
        }

        const events =
            await response.json();

        const eventCounts = {};

        events.forEach((event) => {
            if (!eventCounts[event.date]) {
                eventCounts[event.date] = 0;
            }

            eventCounts[event.date]++;
        });

        Object.entries(eventCounts).forEach(
            ([date, count]) => {
                const dayElement =
                    calendarGrid.querySelector(
                        `[data-date="${date}"]`
                    );

                if (!dayElement) {
                    return;
                }

                const indicator =
                    document.createElement("div");

                indicator.classList.add(
                    "event-indicator"
                );

                const icon =
                    document.createElement("span");

                icon.classList.add(
                    "event-indicator-icon"
                );

                icon.textContent = "📅";

                const text =
                    document.createElement("span");

                text.textContent = count;

                indicator.appendChild(icon);
                indicator.appendChild(text);

                dayElement.appendChild(
                    indicator
                );
            }
        );
    } catch (error) {
        console.error(error);
    }
}

async function loadMonthBirthdayIndicators() {
    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();

    try {
        const response = await fetch(
            `/api/birthdays?month=${month + 1}`
        );

        if (handleUnauthorized(response)) {
            return;
        }

        if (!response.ok) {
            throw new Error(
                "Failed to load month birthdays."
            );
        }

        const birthdays =
            await response.json();

        const birthdayCounts = {};

        birthdays.forEach((birthday) => {
            if (!birthdayCounts[birthday.day]) {
                birthdayCounts[birthday.day] = 0;
            }

            birthdayCounts[birthday.day]++;
        });

        Object.entries(birthdayCounts).forEach(
            ([day, count]) => {
                const dateString =
                    formatDate(
                        year,
                        month,
                        Number(day)
                    );

                const dayElement =
                    calendarGrid.querySelector(
                        `[data-date="${dateString}"]`
                    );

                if (!dayElement) {
                    return;
                }

                const indicator =
                    document.createElement("div");

                indicator.classList.add(
                    "birthday-indicator"
                );

                const icon =
                    document.createElement("span");

                icon.classList.add(
                    "birthday-indicator-icon"
                );

                icon.textContent = "🎂";

                const text =
                    document.createElement("span");

                text.textContent = count;

                indicator.appendChild(icon);
                indicator.appendChild(text);

                dayElement.appendChild(
                    indicator
                );
            }
        );

    } catch (error) {
        console.error(error);
    }
}

function renderEvents(events) {
    eventsList.innerHTML = "";

    if (events.length === 0) {
        eventsList.innerHTML = `
            <p class="empty-message">
                No events have been added yet.
            </p>
        `;

        return;
    }

    events.forEach((event) => {
        const eventCard =
            document.createElement("div");

        eventCard.classList.add(
            "event-card"
        );

        const cardHeader =
            document.createElement("div");

        cardHeader.classList.add(
            "event-card-header"
        );

        const title =
            document.createElement("h4");

        title.textContent = event.title;

        const actions =
            document.createElement("div");

        actions.classList.add(
            "event-actions"
        );

        const editButton =
            document.createElement("button");

        editButton.type = "button";

        editButton.classList.add(
            "edit-button"
        );

        editButton.textContent = "Edit";

        editButton.addEventListener(
            "click",
            () => {
                openEditEventForm(event);
            }
        );

        const deleteButton =
            document.createElement("button");

        deleteButton.type = "button";

        deleteButton.classList.add(
            "delete-button"
        );

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener(
            "click",
            async () => {
                await deleteEvent(event);
            }
        );

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        cardHeader.appendChild(title);
        cardHeader.appendChild(actions);

        eventCard.appendChild(cardHeader);

        if (event.startTime) {
            const time =
                document.createElement("p");

            time.classList.add(
                "event-detail"
            );

            time.textContent =
                `Time: ${
                    formatEventTime(
                        event.startTime
                    )
                }`;

            eventCard.appendChild(time);
        }

        if (event.location) {
            const location =
                document.createElement("p");

            location.classList.add(
                "event-detail"
            );

            location.textContent =
                `Location: ${event.location}`;

            eventCard.appendChild(location);
        }

        if (event.notes) {
            const notes =
                document.createElement("p");

            notes.classList.add(
                "event-detail"
            );

            notes.textContent =
                `Notes: ${event.notes}`;

            eventCard.appendChild(notes);
        }

        eventsList.appendChild(eventCard);
    });
}

async function deleteEvent(event) {
    const confirmed = confirm(
        `Delete "${event.title}"?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `/api/events/${event._id}`,
            {
                method: "DELETE"
            }
        );

        if (handleUnauthorized(response)) {
            return;
        }

        if (!response.ok) {
            throw new Error(
                "Failed to delete event."
            );
        }

        if (
            editingEventId === event._id
        ) {
            resetEventForm();
        }

        await loadEventsForDay();
    } catch (error) {
        console.error(error);

        alert(
            "The event could not be deleted."
        );
    }
}

/* PHOTO DATA */

function openPhotoViewer(index) {
    if (
        index < 0 ||
        index >= currentPhotos.length
    ) {
        return;
    }

    currentPhotoIndex = index;

    updatePhotoViewer();

    photoViewer.classList.remove(
        "hidden"
    );

    photoViewer.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";
}


function closePhotoViewer() {
    photoViewer.classList.add(
        "hidden"
    );

    photoViewer.setAttribute(
        "aria-hidden",
        "true"
    );

    photoViewerImage.src = "";

    document.body.style.overflow = "";
}


function updatePhotoViewer() {
    const photo =
        currentPhotos[currentPhotoIndex];

    if (!photo) {
        return;
    }

    photoViewerImage.src =
        photo.imageUrl;

    photoViewerImage.alt =
        photo.caption ||
        photo.originalName ||
        "Family photo";

    photoViewerCaption.textContent =
        photo.caption || "";

    photoCaptionInput.value =
        photo.caption || "";

    photoViewerCounter.textContent =
         `${currentPhotoIndex + 1} of ${
             currentPhotos.length
          }`;

    const multiplePhotos =
        currentPhotos.length > 1;

    previousPhotoButton.classList.toggle(
        "hidden",
        !multiplePhotos
    );

    nextPhotoButton.classList.toggle(
        "hidden",
        !multiplePhotos
    );
}


function showPreviousPhoto() {
    if (currentPhotos.length <= 1) {
        return;
    }

    currentPhotoIndex--;

    if (currentPhotoIndex < 0) {
        currentPhotoIndex =
            currentPhotos.length - 1;
    }

    updatePhotoViewer();
}


function showNextPhoto() {
    if (currentPhotos.length <= 1) {
        return;
    }

    currentPhotoIndex++;

    if (
        currentPhotoIndex >=
        currentPhotos.length
    ) {
        currentPhotoIndex = 0;
    }

    updatePhotoViewer();
}

async function loadPhotosForDay() {
    photosContainer.innerHTML = `
        <p class="photo-message">
            Loading photos...
        </p>
    `;

    try {
        const response = await fetch(
            `/api/photos?date=${selectedDate}`
        );

        if (handleUnauthorized(response)) {
            return;
        }

        if (!response.ok) {
            throw new Error(
                "Failed to load photos."
            );
        }

        const photos =
            await response.json();

        renderPhotos(photos);
    } catch (error) {
        console.error(error);

        photosContainer.innerHTML = `
            <p class="photo-message">
                Could not load photos.
            </p>
        `;
    }
}


function renderPhotos(photos) {
    photosContainer.innerHTML = "";

    currentPhotos = photos;

    if (photos.length === 0) {
        photosContainer.innerHTML = `
            <p class="photo-message">
                No photos have been added yet.
            </p>
        `;

        return;
    }

    const photoGrid =
        document.createElement("div");

    photoGrid.classList.add(
        "photos-grid"
    );

    photos.forEach((photo, index) => {
        const photoItem =
            document.createElement("div");

        photoItem.classList.add(
            "photo-item"
        );

        const image =
            document.createElement("img");

        image.src =
            photo.imageUrl;

        image.alt =
            photo.caption ||
            photo.originalName ||
            "Family photo";

        image.loading = "lazy";

        photoItem.appendChild(image);

        photoItem.addEventListener(
            "click",
              () => {
                photoViewerSource = "day";

                 openPhotoViewer(index);
             }
        );

        if (photo.caption) {
            const caption =
                document.createElement("p");

            caption.classList.add(
                "photo-caption"
            );

            caption.textContent =
                photo.caption;

            photoItem.appendChild(
                caption
            );
        }

        photoGrid.appendChild(
            photoItem
        );
    });

    photosContainer.appendChild(
        photoGrid
    );
}


async function loadMonthPhotoIndicators() {
    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();

    const monthString =
        formatMonth(year, month);

    try {
        const response = await fetch(
            `/api/photos?month=${monthString}`
        );

        if (handleUnauthorized(response)) {
            return;
        }

        if (!response.ok) {
            throw new Error(
                "Failed to load month photos."
            );
        }

        const photos =
            await response.json();

        const photoCounts = {};

        photos.forEach((photo) => {
            if (!photoCounts[photo.date]) {
                photoCounts[photo.date] = 0;
            }

            photoCounts[photo.date]++;
        });

        Object.entries(photoCounts).forEach(
            ([date, count]) => {
                const dayElement =
                    calendarGrid.querySelector(
                        `[data-date="${date}"]`
                    );

                if (!dayElement) {
                    return;
                }

                const indicator =
                    document.createElement("div");

                indicator.classList.add(
                    "photo-indicator"
                );

                const icon =
                    document.createElement("span");

                icon.classList.add(
                    "photo-indicator-icon"
                );

                icon.textContent = "📷";

                const text =
                    document.createElement("span");

                text.textContent = count;

                indicator.appendChild(icon);
                indicator.appendChild(text);

                dayElement.appendChild(
                    indicator
                );
            }
        );
    } catch (error) {
        console.error(error);
    }
}

/* DAY VIEW */

async function changeSelectedDay(amount) {
    if (!selectedDate) {
        return;
    }

    const [year, month, day] =
        selectedDate
            .split("-")
            .map(Number);

    const newDate =
        new Date(
            year,
            month - 1,
            day
        );

    newDate.setDate(
        newDate.getDate() + amount
    );

    const newDateString =
        formatDate(
            newDate.getFullYear(),
            newDate.getMonth(),
            newDate.getDate()
        );

    history.replaceState(
        {
            view: "day",
            date: newDateString
        },
        ""
    );

    await openDayView(
        newDateString,
        false,
        true
    );
}

async function openDayView(
    dateString,
    addToHistory = true,
    preserveForms = false
) {
    selectedDate = dateString;

    const [
        selectedYear,
        selectedMonth
    ] = dateString
        .split("-")
        .map(Number);

    currentDate =
        new Date(
            selectedYear,
            selectedMonth - 1,
            1
        );

    if (addToHistory) {
        setBrowserView(
            "day",
            {
                date: dateString
            }
        );
    }

    dayViewDate.textContent =
        formatDayViewDate(dateString);

    if (!preserveForms) {
        resetEventForm();
        resetBirthdayForm();
    }

    photoUploadStatus.textContent = "";
    photoUploadStatus.className =
        "photo-upload-status hidden";

    photoArchiveView.classList.add(
        "hidden"
    );

    monthView.classList.add("hidden");
    dayView.classList.remove("hidden");

    hideFamilyBubbles();

    await Promise.all([
        loadEventsForDay(),
        loadBirthdaysForDay(),
        loadPhotosForDay()
    ]);
}


function closeDayView() {
    history.back();
}


/* CALENDAR */

function renderCalendar() {
    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();

    const displayMonth =
        currentDate.toLocaleString(
            "default",
            {
                month: "long"
            }
        );

    monthName.textContent =
        displayMonth;

    yearSelect.value = year;

    calendarGrid.innerHTML = "";

    const firstDayOfMonth =
        new Date(
            year,
            month,
            1
        ).getDay();

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

    for (
        let i = 0;
        i < firstDayOfMonth;
        i++
    ) {
        const emptyDay =
            document.createElement("div");

        emptyDay.classList.add(
            "calendar-day",
            "empty-day"
        );

        calendarGrid.appendChild(
            emptyDay
        );
    }

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {
        const dayElement =
            document.createElement("div");

        dayElement.classList.add(
            "calendar-day"
        );

        const dateString =
            formatDate(
                year,
                month,
                day
            );

        dayElement.dataset.date =
            dateString;

        if (
            isToday(
                year,
                month,
                day
            )
        ) {
            dayElement.classList.add(
                "today"
            );
        }

        const dayNumber =
            document.createElement("span");

        dayNumber.classList.add(
            "day-number"
        );

        dayNumber.textContent = day;

        dayElement.appendChild(
            dayNumber
        );

        dayElement.addEventListener(
            "click",
            () => {
                openDayView(
                    dateString
                );
            }
        );

        calendarGrid.appendChild(
            dayElement
        );
    }

    const totalCells =
        firstDayOfMonth +
        daysInMonth;

    const remainingCells =
        (
            7 -
            (totalCells % 7)
        ) % 7;

    for (
        let i = 0;
        i < remainingCells;
        i++
    ) {
        const emptyDay =
            document.createElement("div");

        emptyDay.classList.add(
            "calendar-day",
            "empty-day"
        );

        calendarGrid.appendChild(
            emptyDay
        );
    }

    loadMonthEventIndicators();
    loadMonthBirthdayIndicators();
    loadMonthPhotoIndicators();
}


/* CALENDAR CONTROLS */

previousDayButton.addEventListener(
    "click",
    async () => {
        await changeSelectedDay(-1);
    }
);


nextDayButton.addEventListener(
    "click",
    async () => {
        await changeSelectedDay(1);
    }
);

previousMonthButton.addEventListener(
    "click",
    () => {
        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        renderCalendar();
    }
);

nextMonthButton.addEventListener(
    "click",
    () => {
        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        renderCalendar();
    }
);

yearSelect.addEventListener(
    "change",
    () => {
        currentDate.setFullYear(
            Number(yearSelect.value)
        );

        renderCalendar();
    }
);

backToCalendarButton.addEventListener(
    "click",
    () => {
        closeDayView();
    }
);

addEventButton.addEventListener(
    "click",
    () => {
        openAddEventForm();
    }
);

cancelEventButton.addEventListener(
    "click",
    () => {
        resetEventForm();
    }
);

addBirthdayButton.addEventListener(
    "click",
    () => {
        openAddBirthdayForm();
    }
);

cancelBirthdayButton.addEventListener(
    "click",
    () => {
        resetBirthdayForm();
    }
);


/* CREATE / EDIT EVENT */

eventForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        const eventData = {
            title:
                eventTitle.value.trim(),

            date:
                selectedDate,

            startTime:
                eventTime.value,

            location:
                eventLocation.value.trim(),

            notes:
                eventNotes.value.trim()
        };

        try {
            let response;

            if (editingEventId) {
                response = await fetch(
                    `/api/events/${editingEventId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                eventData
                            )
                    }
                );
            } else {
                response = await fetch(
                    "/api/events",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                eventData
                            )
                    }
                );
            }

            if (
                handleUnauthorized(response)
            ) {
                return;
            }

            if (!response.ok) {
                throw new Error(
                    "Failed to save event."
                );
            }

            resetEventForm();

            await loadEventsForDay();
        } catch (error) {
            console.error(error);

            alert(
                "The event could not be saved."
            );
        }
    }
);

/* CREATE / EDIT BIRTHDAY */

birthdayForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        if (!selectedDate) {
            return;
        }

        const [
            selectedYear,
            selectedMonth,
            selectedDay
        ] = selectedDate
            .split("-")
            .map(Number);

        const birthdayData = {
            name:
                birthdayName.value.trim(),

            month:
                selectedMonth,

            day:
                selectedDay,

            notes:
                birthdayNotes.value.trim()
        };

        try {
            let response;

            if (editingBirthdayId) {
                response = await fetch(
                    `/api/birthdays/${editingBirthdayId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                birthdayData
                            )
                    }
                );
            } else {
                response = await fetch(
                    "/api/birthdays",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                birthdayData
                            )
                    }
                );
            }

            if (
                handleUnauthorized(response)
            ) {
                return;
            }

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to save birthday."
                );
            }

            resetBirthdayForm();

            await loadBirthdaysForDay();

        } catch (error) {
            console.error(error);

            alert(
                error.message ||
                "The birthday could not be saved."
            );
        }
    }
);

/* PHOTO UPLOAD */

uploadPhotosButton.addEventListener(
    "click",
    () => {
        photoInput.click();
    }
);

photoInput.addEventListener(
    "change",
    async () => {
        const files =
            Array.from(photoInput.files);

        if (files.length === 0) {
            return;
        }

        if (files.length > 25) {
            photoUploadStatus.textContent =
                "You can upload a maximum of 25 photos at once.";

            photoUploadStatus.className =
                "photo-upload-status error";

            photoInput.value = "";

            return;
        }

        const formData =
            new FormData();

        formData.append(
            "date",
            selectedDate
        );

        files.forEach((file) => {
            formData.append(
                "photos",
                file
            );
        });

        uploadPhotosButton.disabled = true;

        photoUploadStatus.textContent =
            `Uploading ${
                files.length
            } ${
                files.length === 1
                    ? "photo"
                    : "photos"
            }...`;

        photoUploadStatus.className =
            "photo-upload-status";

        try {
            const response = await fetch(
                "/api/photos/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

            if (
                handleUnauthorized(response)
            ) {
                return;
            }

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Photo upload failed."
                );
            }

            photoUploadStatus.textContent =
                 data.message;

            photoUploadStatus.className =
                "photo-upload-status success";

            await loadPhotosForDay();

        } catch (error) {
            console.error(error);

            photoUploadStatus.textContent =
                error.message ||
                "Photo upload failed.";

            photoUploadStatus.className =
                "photo-upload-status error";
        } finally {
            uploadPhotosButton.disabled =
                false;

            photoInput.value = "";
        }
    }
);

async function saveCurrentPhotoCaption() {
    const photo =
        currentPhotos[currentPhotoIndex];

    if (!photo) {
        return;
    }

    const caption =
        photoCaptionInput.value.trim();

    savePhotoCaptionButton.disabled =
        true;

    savePhotoCaptionButton.textContent =
        "Saving...";

    try {
        const response = await fetch(
            `/api/photos/${photo._id}/caption`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    caption
                })
            }
        );

        if (handleUnauthorized(response)) {
            closePhotoViewer();
            return;
        }

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to save caption."
            );
        }

        photo.caption =
            data.photo.caption;

        photoViewerCaption.textContent =
            photo.caption || "";

        if (photoViewerSource === "archive") {
            await loadPhotoArchive();

            /*
            * Keep the viewer's current
            * photo data updated.
            */
            photo.caption =
                data.photo.caption;

            photoCaptionInput.value =
                photo.caption || "";

            photoViewerCaption.textContent =
                photo.caption || "";

        } else {
            await loadPhotosForDay();

            /*
            * loadPhotosForDay() rebuilds
            * currentPhotos, so find this
            * same photo again.
            */
            const updatedIndex =
                currentPhotos.findIndex(
                    (item) =>
                        item._id === photo._id
                );

            if (updatedIndex !== -1) {
                currentPhotoIndex =
                    updatedIndex;
            }

            updatePhotoViewer();
        }

    } catch (error) {
        console.error(error);

        alert(
            error.message ||
            "The caption could not be saved."
        );
    } finally {
        savePhotoCaptionButton.disabled =
            false;

        savePhotoCaptionButton.textContent =
            "Save Caption";
    }
}

async function deleteCurrentPhoto() {
    const photo =
        currentPhotos[currentPhotoIndex];

    if (!photo) {
        return;
    }

    const confirmed = confirm(
        "Delete this photo? This cannot be undone."
    );

    if (!confirmed) {
        return;
    }

    deletePhotoButton.disabled = true;
    deletePhotoButton.textContent =
        "Deleting...";

    try {
        const response = await fetch(
            `/api/photos/${photo._id}`,
            {
                method: "DELETE"
            }
        );

        if (handleUnauthorized(response)) {
            closePhotoViewer();
            return;
        }

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to delete photo."
            );
        }

        closePhotoViewer();

        if (photoViewerSource === "archive") {
            await loadPhotoArchive();
        } else {
            await loadPhotosForDay();
        }

    } catch (error) {
        console.error(error);

        alert(
            error.message ||
            "The photo could not be deleted."
        );
    } finally {
        deletePhotoButton.disabled =
            false;

        deletePhotoButton.textContent =
            "Delete Photo";
    }
}

async function loadPhotoArchive() {
    photoArchiveContainer.innerHTML = `
        <p class="photo-message">
            Loading photos...
        </p>
    `;

    try {
        const response = await fetch(
            "/api/photos"
        );

        if (handleUnauthorized(response)) {
            return;
        }

        if (!response.ok) {
            throw new Error(
                "Failed to load photo archive."
            );
        }

        const photos =
            await response.json();

        renderPhotoArchive(photos);

    } catch (error) {
        console.error(error);

        photoArchiveContainer.innerHTML = `
            <p class="photo-message">
                Could not load photos.
            </p>
        `;
    }
}

function renderPhotoArchive(photos) {
    photoArchiveContainer.innerHTML = "";

    if (photos.length === 0) {
        photoArchiveContainer.innerHTML = `
            <p class="photo-message">
                No photos have been added yet.
            </p>
        `;

        return;
    }

    const groupedPhotos = {};

    photos.forEach((photo) => {
        const month =
            photo.date.substring(0, 7);

        if (!groupedPhotos[month]) {
            groupedPhotos[month] = [];
        }

        groupedPhotos[month].push(photo);
    });

    Object.entries(groupedPhotos).forEach(
        ([month, monthPhotos]) => {
            const monthSection =
                document.createElement("div");

            monthSection.classList.add(
                "photo-archive-month"
            );

            const heading =
                document.createElement("h3");

            const [year, monthNumber] =
                month.split("-");

            const monthDate =
                new Date(
                    Number(year),
                    Number(monthNumber) - 1,
                    1
                );

            heading.textContent =
                monthDate.toLocaleDateString(
                    "en-US",
                    {
                        month: "long",
                        year: "numeric"
                    }
                );

            monthSection.appendChild(
                heading
            );

            const grid =
                document.createElement("div");

            grid.classList.add(
                "photo-archive-grid"
            );

            monthPhotos.forEach(
                (photo, index) => {
                    const item =
                        document.createElement(
                            "div"
                        );

                    item.classList.add(
                        "photo-archive-item"
                    );

                    const image =
                        document.createElement(
                            "img"
                        );

                    image.src =
                        photo.imageUrl;

                    image.alt =
                        photo.caption ||
                        photo.originalName ||
                        "Family photo";

                    image.loading = "lazy";

                    item.appendChild(image);

                    const info =
                        document.createElement(
                            "div"
                        );

                    info.classList.add(
                        "photo-archive-item-info"
                    );

                    const date =
                        document.createElement(
                            "p"
                        );

                    date.classList.add(
                        "photo-archive-date"
                    );

                    const [
                        photoYear,
                        photoMonth,
                        photoDay
                    ] = photo.date.split("-");

                    const displayDate =
                        new Date(
                            Number(photoYear),
                            Number(photoMonth) - 1,
                            Number(photoDay)
                        );

                    date.textContent =
                        displayDate.toLocaleDateString(
                            "en-US",
                            {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                            }
                        );

                    info.appendChild(date);

                    if (photo.caption) {
                        const caption =
                            document.createElement(
                                "p"
                            );

                        caption.classList.add(
                            "photo-archive-caption"
                        );

                        caption.textContent =
                            photo.caption;

                        info.appendChild(
                            caption
                        );
                    }

                    item.appendChild(info);

                    item.addEventListener(
                        "click",
                        () => {
                            photoViewerSource =
                                "archive";

                            currentPhotos =
                                monthPhotos;

                            currentPhotoIndex =
                                index;

                            openPhotoViewer(
                                index
                            );
                        }
                    );

                    grid.appendChild(item);
                }
            );

            monthSection.appendChild(grid);

            photoArchiveContainer.appendChild(
                monthSection
            );
        }
    );
}

function openGame() {
    /*
     * Switch the visible application view
     * to Family Pool.
     */

    monthView.classList.add(
        "hidden"
    );

    dayView.classList.add(
        "hidden"
    );

    photoArchiveView.classList.add(
        "hidden"
    );

    gameView.classList.remove(
        "hidden"
    );


    /*
     * Hide Calendar-only header controls.
     */

    photosButton.classList.add(
    "hidden"
    );

    bubblesButton.classList.add(
        "hidden"
    );

    gameButton.classList.add(
        "hidden"
    );


    /*
     * Transfer the existing family bubbles
     * into the pool and start ONLY the
     * pool physics system.
     *
     * Do NOT call hideFamilyBubbles()
     * after this. startFamilyPoolGame()
     * handles the transition itself.
     */

    startFamilyPoolGame();


    history.pushState(
        {
            view: "game"
        },
        "",
        "#game"
    );
}

function closeGame() {
    gameView.classList.add(
        "hidden"
    );

    monthView.classList.remove(
        "hidden"
    );


    photosButton.classList.remove(
    "hidden"
    );

    bubblesButton.classList.remove(
        "hidden"
    );

    gameButton.classList.remove(
        "hidden"
    );


    renderCalendar();

    resetFamilyBubblesToCalendar();


    history.replaceState(
        {
            view: "calendar"
        },
        "",
        window.location.pathname
    );
}

async function openPhotoArchive(
    addToHistory = true
) {
    if (addToHistory) {
        setBrowserView(
            "photos"
        );
    }

    monthView.classList.add("hidden");
    dayView.classList.add("hidden");

    hideFamilyBubbles();

    photoArchiveView.classList.remove(
        "hidden"
    );

    await loadPhotoArchive();
}

function closePhotoArchive() {
    history.back();
}

photosButton.addEventListener(
    "click",
    openPhotoArchive
);

bubblesButton.addEventListener(
    "click",
    () => {
        familyBubblesEnabled =
            !familyBubblesEnabled;

        updateBubblesButton();

        if (familyBubblesEnabled) {
            showFamilyBubbles();
        } else {
            hideFamilyBubbles();
        }
    }
);

gameButton.addEventListener(
    "click",
    () => {
        openGame();
    }
);


exitGameButton.addEventListener(
    "click",
    () => {
        closeGame();
    }
);

backFromPhotosButton.addEventListener(
    "click",
    closePhotoArchive
);

/* PHOTO VIEWER CONTROLS */

savePhotoCaptionButton.addEventListener(
    "click",
    saveCurrentPhotoCaption
);

deletePhotoButton.addEventListener(
    "click",
    deleteCurrentPhoto
);

closePhotoViewerButton.addEventListener(
    "click",
    closePhotoViewer
);

previousPhotoButton.addEventListener(
    "click",
    showPreviousPhoto
);

nextPhotoButton.addEventListener(
    "click",
    showNextPhoto
);

photoViewer.addEventListener(
    "click",
    (event) => {
        if (event.target === photoViewer) {
            closePhotoViewer();
        }
    }
);

document.addEventListener(
    "keydown",
    (event) => {
        if (
            photoViewer.classList.contains(
                "hidden"
            )
        ) {
            return;
        }

        if (event.key === "Escape") {
            closePhotoViewer();
        }

        if (event.key === "ArrowLeft") {
            showPreviousPhoto();
        }

        if (event.key === "ArrowRight") {
            showNextPhoto();
        }
    }
);

/* START APPLICATION */

checkAuthentication();