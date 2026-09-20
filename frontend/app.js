const monthView = document.getElementById("monthView");
const dayView = document.getElementById("dayView");

const monthName = document.getElementById("monthName");
const yearSelect = document.getElementById("yearSelect");
const calendarGrid = document.getElementById("calendarGrid");

const previousMonthButton = document.getElementById("previousMonth");
const nextMonthButton = document.getElementById("nextMonth");

const backToCalendarButton = document.getElementById("backToCalendar");
const dayViewDate = document.getElementById("dayViewDate");

const addEventButton = document.getElementById("addEventButton");
const cancelEventButton = document.getElementById("cancelEventButton");

const eventForm = document.getElementById("eventForm");
const eventFormHeading = document.getElementById("eventFormHeading");
const saveEventButton = document.getElementById("saveEventButton");

const eventTitle = document.getElementById("eventTitle");
const eventTime = document.getElementById("eventTime");
const eventLocation = document.getElementById("eventLocation");
const eventNotes = document.getElementById("eventNotes");

const eventsList = document.getElementById("eventsList");

let currentDate = new Date();
let selectedDate = null;
let editingEventId = null;

function buildYearSelector() {
    const currentYear = new Date().getFullYear();

    for (
        let year = currentYear - 100;
        year <= currentYear + 50;
        year++
    ) {
        const option = document.createElement("option");

        option.value = year;
        option.textContent = year;

        yearSelect.appendChild(option);
    }
}

function formatDate(year, month, day) {
    const formattedMonth = String(month + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");

    return `${year}-${formattedMonth}-${formattedDay}`;
}

function formatMonth(year, month) {
    const formattedMonth = String(month + 1).padStart(2, "0");

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
    const [year, month, day] = dateString
        .split("-")
        .map(Number);

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}

function formatEventTime(time) {
    if (!time) {
        return "";
    }

    const [hourString, minute] = time.split(":");

    let hour = Number(hourString);

    const period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    if (hour === 0) {
        hour = 12;
    }

    return `${hour}:${minute} ${period}`;
}

function resetEventForm() {
    editingEventId = null;

    eventForm.reset();

    eventFormHeading.textContent = "Add Event";
    saveEventButton.textContent = "Save Event";

    eventForm.classList.add("hidden");
}

function openAddEventForm() {
    editingEventId = null;

    eventForm.reset();

    eventFormHeading.textContent = "Add Event";
    saveEventButton.textContent = "Save Event";

    eventForm.classList.remove("hidden");

    eventTitle.focus();
}

function openEditEventForm(event) {
    editingEventId = event._id;

    eventTitle.value = event.title || "";
    eventTime.value = event.startTime || "";
    eventLocation.value = event.location || "";
    eventNotes.value = event.notes || "";

    eventFormHeading.textContent = "Edit Event";
    saveEventButton.textContent = "Save Changes";

    eventForm.classList.remove("hidden");

    eventForm.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

    eventTitle.focus();
}

async function loadEventsForDay() {
    eventsList.innerHTML = `
        <p class="empty-message">Loading events...</p>
    `;

    try {
        const response = await fetch(
            `/api/events?date=${selectedDate}`
        );

        if (!response.ok) {
            throw new Error("Failed to load events.");
        }

        const events = await response.json();

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
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthString = formatMonth(year, month);

    try {
        const response = await fetch(
            `/api/events?month=${monthString}`
        );

        if (!response.ok) {
            throw new Error("Failed to load month events.");
        }

        const events = await response.json();

        const eventCounts = {};

        events.forEach((event) => {
            if (!eventCounts[event.date]) {
                eventCounts[event.date] = 0;
            }

            eventCounts[event.date]++;
        });

        Object.entries(eventCounts).forEach(
            ([date, count]) => {
                const dayElement = calendarGrid.querySelector(
                    `[data-date="${date}"]`
                );

                if (!dayElement) {
                    return;
                }

                const indicator =
                    document.createElement("div");

                indicator.classList.add("event-indicator");

                const icon =
                    document.createElement("span");

                icon.classList.add("event-indicator-icon");
                icon.textContent = "📅";

                const text =
                    document.createElement("span");

                text.textContent =
                    `${count} ${count === 1 ? "event" : "events"}`;

                indicator.appendChild(icon);
                indicator.appendChild(text);

                dayElement.appendChild(indicator);
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
        const eventCard = document.createElement("div");

        eventCard.classList.add("event-card");

        const cardHeader = document.createElement("div");

        cardHeader.classList.add("event-card-header");

        const title = document.createElement("h4");

        title.textContent = event.title;

        const actions = document.createElement("div");

        actions.classList.add("event-actions");

        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.classList.add("edit-button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            openEditEventForm(event);
        });

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.classList.add("delete-button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", async () => {
            await deleteEvent(event);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        cardHeader.appendChild(title);
        cardHeader.appendChild(actions);

        eventCard.appendChild(cardHeader);

        if (event.startTime) {
            const time = document.createElement("p");

            time.classList.add("event-detail");

            time.textContent =
                `Time: ${formatEventTime(event.startTime)}`;

            eventCard.appendChild(time);
        }

        if (event.location) {
            const location = document.createElement("p");

            location.classList.add("event-detail");

            location.textContent =
                `Location: ${event.location}`;

            eventCard.appendChild(location);
        }

        if (event.notes) {
            const notes = document.createElement("p");

            notes.classList.add("event-detail");

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

        if (!response.ok) {
            throw new Error("Failed to delete event.");
        }

        if (editingEventId === event._id) {
            resetEventForm();
        }

        await loadEventsForDay();
    } catch (error) {
        console.error(error);

        alert("The event could not be deleted.");
    }
}

async function openDayView(dateString) {
    selectedDate = dateString;

    dayViewDate.textContent =
        formatDayViewDate(dateString);

    resetEventForm();

    monthView.classList.add("hidden");
    dayView.classList.remove("hidden");

    await loadEventsForDay();
}

function closeDayView() {
    resetEventForm();

    dayView.classList.add("hidden");
    monthView.classList.remove("hidden");

    // Refresh indicators in case events were added,
    // edited, or deleted while the Day View was open.
    renderCalendar();
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const displayMonth =
        currentDate.toLocaleString("default", {
            month: "long"
        });

    monthName.textContent = displayMonth;
    yearSelect.value = year;

    calendarGrid.innerHTML = "";

    const firstDayOfMonth =
        new Date(year, month, 1).getDay();

    const daysInMonth =
        new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay =
            document.createElement("div");

        emptyDay.classList.add(
            "calendar-day",
            "empty-day"
        );

        calendarGrid.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement =
            document.createElement("div");

        dayElement.classList.add("calendar-day");

        const dateString =
            formatDate(year, month, day);

        dayElement.dataset.date = dateString;

        if (isToday(year, month, day)) {
            dayElement.classList.add("today");
        }

        const dayNumber =
            document.createElement("span");

        dayNumber.classList.add("day-number");
        dayNumber.textContent = day;

        dayElement.appendChild(dayNumber);

        dayElement.addEventListener("click", () => {
            openDayView(dateString);
        });

        calendarGrid.appendChild(dayElement);
    }

    const totalCells =
        firstDayOfMonth + daysInMonth;

    const remainingCells =
        (7 - (totalCells % 7)) % 7;

    for (let i = 0; i < remainingCells; i++) {
        const emptyDay =
            document.createElement("div");

        emptyDay.classList.add(
            "calendar-day",
            "empty-day"
        );

        calendarGrid.appendChild(emptyDay);
    }

    loadMonthEventIndicators();
}

previousMonthButton.addEventListener("click", () => {
    currentDate.setMonth(
        currentDate.getMonth() - 1
    );

    renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
    currentDate.setMonth(
        currentDate.getMonth() + 1
    );

    renderCalendar();
});

yearSelect.addEventListener("change", () => {
    currentDate.setFullYear(
        Number(yearSelect.value)
    );

    renderCalendar();
});

backToCalendarButton.addEventListener("click", () => {
    closeDayView();
});

addEventButton.addEventListener("click", () => {
    openAddEventForm();
});

cancelEventButton.addEventListener("click", () => {
    resetEventForm();
});

eventForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const eventData = {
        title: eventTitle.value.trim(),
        date: selectedDate,
        startTime: eventTime.value,
        location: eventLocation.value.trim(),
        notes: eventNotes.value.trim()
    };

    try {
        let response;

        if (editingEventId) {
            response = await fetch(
                `/api/events/${editingEventId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(eventData)
                }
            );
        } else {
            response = await fetch(
                "/api/events",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(eventData)
                }
            );
        }

        if (!response.ok) {
            throw new Error("Failed to save event.");
        }

        resetEventForm();

        await loadEventsForDay();
    } catch (error) {
        console.error(error);

        alert("The event could not be saved.");
    }
});

buildYearSelector();
renderCalendar();