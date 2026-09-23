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


/* AUTHENTICATION */

function showLoginScreen() {
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
    }

    renderCalendar();
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

async function openDayView(dateString) {
    selectedDate = dateString;

    dayViewDate.textContent =
        formatDayViewDate(dateString);

    resetEventForm();
    resetBirthdayForm();

    photoUploadStatus.textContent = "";
    photoUploadStatus.className =
        "photo-upload-status hidden";

    monthView.classList.add("hidden");
    dayView.classList.remove("hidden");

    await Promise.all([
    loadEventsForDay(),
    loadBirthdaysForDay(),
    loadPhotosForDay()
]);

}

function closeDayView() {
    resetEventForm();

    dayView.classList.add("hidden");
    monthView.classList.remove("hidden");

    renderCalendar();
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

async function openPhotoArchive() {
    monthView.classList.add("hidden");
    dayView.classList.add("hidden");

    photoArchiveView.classList.remove(
        "hidden"
    );

    await loadPhotoArchive();
}

function closePhotoArchive() {
    photoArchiveView.classList.add(
        "hidden"
    );

    monthView.classList.remove("hidden");

    renderCalendar();
}

photosButton.addEventListener(
    "click",
    openPhotoArchive
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