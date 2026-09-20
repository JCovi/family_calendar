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
const eventTitle = document.getElementById("eventTitle");
const eventTime = document.getElementById("eventTime");
const eventLocation = document.getElementById("eventLocation");
const eventNotes = document.getElementById("eventNotes");

const eventsList = document.getElementById("eventsList");

let currentDate = new Date();
let selectedDate = null;

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

        const title = document.createElement("h4");
        title.textContent = event.title;

        eventCard.appendChild(title);

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

async function openDayView(dateString) {
    selectedDate = dateString;

    dayViewDate.textContent =
        formatDayViewDate(dateString);

    eventForm.classList.add("hidden");
    eventForm.reset();

    monthView.classList.add("hidden");
    dayView.classList.remove("hidden");

    await loadEventsForDay();
}

function closeDayView() {
    dayView.classList.add("hidden");
    monthView.classList.remove("hidden");
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
    eventForm.reset();
    eventForm.classList.remove("hidden");
    eventTitle.focus();
});

cancelEventButton.addEventListener("click", () => {
    eventForm.reset();
    eventForm.classList.add("hidden");
});

eventForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const newEvent = {
        title: eventTitle.value.trim(),
        date: selectedDate,
        startTime: eventTime.value,
        location: eventLocation.value.trim(),
        notes: eventNotes.value.trim()
    };

    try {
        const response = await fetch("/api/events", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(newEvent)
        });

        if (!response.ok) {
            throw new Error("Failed to create event.");
        }

        eventForm.reset();
        eventForm.classList.add("hidden");

        await loadEventsForDay();
    } catch (error) {
        console.error(error);

        alert("The event could not be saved.");
    }
});

buildYearSelector();
renderCalendar();