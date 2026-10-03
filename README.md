# 📅 Family Calendar

A private, full-stack family calendar, photo archive, and interactive family web application built for my family.

Family Calendar combines shared events, recurring birthdays, private photo storage, and a family memory archive in one centralized space. It also includes interactive floating family-photo bubbles with custom physics and a fully playable **Family Pool** mini-game — because family software should be useful *and* a little fun. 🫧🎱

---

## ✨ Features

### 📆 Shared Calendar

- Interactive monthly calendar
- Previous/next month navigation
- Year selection
- Detailed Day View
- Previous/next day navigation
- Browser back/forward navigation
- Event, photo, and birthday indicators
- Responsive desktop and mobile layouts

### 📅 Events

- Create, edit, and delete family events
- Event title, date, time, location, and notes
- Move existing events between dates
- Shared across the entire family

### 🎂 Recurring Birthdays

- Add, edit, and delete birthdays
- Optional birthday notes
- Automatically recur every year
- Dedicated birthday indicators and Day View cards

### 📸 Family Photos

- Upload photos to specific calendar dates
- Add and edit captions
- View photos directly from Day View
- Browse the Family Photo Archive
- Delete photos
- Private cloud storage through Cloudflare R2

### 🫧 Interactive Family Bubbles

The main calendar includes floating family-member photo bubbles powered by a custom vanilla JavaScript physics system.

They support:

- Continuous floating movement
- Edge bouncing
- Bubble-to-bubble collisions
- Momentum transfer
- Mouse proximity repulsion
- Mouse, touch, and stylus dragging
- Throwing momentum and gradual slowdown
- Responsive sizing for mobile devices

Grab one and throw it into another. They'll actually collide. 💥

### 🎱 Family Pool

The same family-photo bubbles become pool balls in a custom-built **Family Pool mini-game**.

Select **Game** from the calendar to move all 14 family members onto a responsive pool table.

Each game includes:

- One randomly selected family member as the breaker
- A 13-person family rack
- Separate pool-specific physics
- Equal-mass ball collisions and momentum transfer
- Rail bouncing with energy loss
- Rolling friction that brings balls naturally to a stop
- Mouse, touch, and stylus throwing
- Six functional pockets
- Pocketed balls removed from active physics
- Automatic win detection
- Victory popup and automatic return to the calendar
- Complete game reset when exiting or starting again

The table also changes orientation based on the device:

- **Desktop:** landscape pool table
- **Mobile:** portrait pool table with repositioned pockets

No external game or physics engine is used. The collision, movement, rail, pocket, drag, throw, and win systems are implemented directly in vanilla JavaScript.

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API
- Pointer Events API
- History API

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- Express Session
- Connect Mongo
- Argon2
- Express Rate Limit
- Helmet
- Multer
- Sharp
- AWS SDK for JavaScript

---

## ☁️ Services & Infrastructure

| Service | Purpose |
| --- | --- |
| **MongoDB Atlas** | Events, birthdays, photo metadata, and session storage |
| **Cloudflare R2** | Private family photo and bubble-image storage |
| **Render** | Production Node.js/Express hosting |
| **GitHub** | Version control and deployment source |
| **Custom Domain** | Production access through the family domain |

### Architecture

```text
                   Browser
                      │
               HTML / CSS / JS
                      │
                      ▼
              Node.js + Express
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
    MongoDB Atlas           Cloudflare R2
          │                       │
      Events                  Family Photos
      Birthdays               Bubble Images
      Photo Metadata
      Sessions
```

The browser never receives database or R2 credentials. Private resources are accessed through the authenticated Express backend.

---

## 🔐 Authentication & Security

Family Calendar uses a **shared family password** instead of individual user accounts.

Security features include:

- Argon2 password hashing
- Server-side sessions
- MongoDB-backed session storage
- HTTP-only cookies
- Secure production cookies
- SameSite cookie protection
- Login rate limiting
- Helmet security headers
- Protected API routes
- Periodic session expiration
- Global session invalidation when the family password changes

Sessions expire after **3 days**, requiring the family password to be entered again periodically.

Sensitive credentials are stored in environment variables and are never committed to the repository.

---

## 📸 Private Photo Storage

Family photos and family-member bubble images are **not stored in the Git repository or public frontend directory**.

Instead:

1. Photos are uploaded through the Express backend.
2. Images are processed with **Sharp**.
3. Image files are stored in a private **Cloudflare R2** bucket.
4. Photo metadata is stored in **MongoDB Atlas**.
5. Authenticated API routes retrieve private images when needed.

The family-member images used by both the floating bubble system and Family Pool are retrieved through the same protected backend architecture.

---

## 📁 Project Structure

```text
family_calendar/
│
├── backend/
│   ├── config/
│   │   └── r2.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Birthday.js
│   │   ├── Event.js
│   │   └── Photo.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── birthdays.js
│   │   ├── events.js
│   │   ├── familybubbles.js
│   │   └── photos.js
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── app.js
│   ├── favicon.png
│   ├── index.html
│   └── style.css
│
├── .gitignore
└── README.md
```

---

## 💻 Local Development

### Prerequisites

- Node.js
- npm
- Git
- MongoDB Atlas database
- Cloudflare R2 bucket

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd family_calendar/backend
npm install
```

Create:

```text
backend/.env
```

with the required configuration:

```env
MONGODB_URI=
SESSION_SECRET=
FAMILY_PASSWORD_HASH=

R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_ENDPOINT=
R2_BUCKET_NAME=
```

Then start the server:

```bash
node server.js
```

The development server runs at:

```text
http://localhost:5000
```

> Never commit `.env` or production credentials.

---

## 🧠 Technical Highlights

### Custom Calendar Engine

The calendar UI, month calculations, Day View, indicators, and navigation are implemented directly in vanilla JavaScript without a frontend framework.

### Safe Date Handling

Date-only values are handled carefully to prevent UTC conversion from shifting events onto the wrong calendar day.

### Recurring Birthdays

Birthdays are stored by month and day so they automatically appear in every displayed year without creating duplicate annual events.

### Dual Physics Systems

Family Calendar now contains **two distinct custom physics systems** built around the same family-photo bubbles.

**Calendar Mode** provides:

- Continuous autonomous movement
- Bubble collisions
- Boundary bouncing
- Pointer proximity repulsion
- Dragging and throwing
- Momentum and gradual slowdown

**Family Pool Mode** provides:

- Stationary pool balls
- Rolling friction
- Equal-mass collision response
- Momentum transfer
- Rail collisions
- Energy loss
- Pocket detection
- Ball removal
- Win-state detection

Switching between modes transfers the same bubble elements between the full-screen calendar layer and the pool table while resetting the appropriate state and physics.

### Responsive Game Layout

Family Pool dynamically adapts to screen size.

Desktop devices use a traditional landscape table with corner and top/bottom center pockets. Mobile devices use a portrait table, with the middle pockets repositioned to the left and right rails.

Physics calculations use the actual rendered playing-surface dimensions rather than assuming a fixed table size.

### Pointer-Based Interaction

The bubble systems use the **Pointer Events API**, allowing the same interaction code to support:

- Mouse
- Touch
- Stylus

Thrown bubbles and pool balls retain momentum based on pointer movement before release.

### Browser History

The History API provides natural back/forward navigation between the calendar, Day View, photo archive, and game without requiring a frontend routing framework.

### Private Cloud Images

Cloudflare R2 objects remain private and are streamed through authenticated Express endpoints instead of being exposed through public object URLs.

---

## 🚀 Deployment

Production follows a Git-based deployment workflow:

```text
Local Development
        │
        ▼
      GitHub
        │
        ▼
      Render
       /    \
      ▼      ▼
 MongoDB   Cloudflare R2
  Atlas
        │
        ▼
  Custom Domain
```

Production secrets are configured as environment variables on Render rather than stored in source control.

---

## 🗺️ Project Status

**Status:** Active Development  
**Current Stage:** Final UI/UX Polish  
**Target:** v1

### Completed

- [x] Calendar engine
- [x] Event CRUD
- [x] Day View
- [x] Shared family authentication
- [x] Session security
- [x] Private photo storage
- [x] Family Photo Archive
- [x] Recurring birthdays
- [x] Browser history navigation
- [x] Responsive/mobile support
- [x] Production deployment
- [x] Custom domain
- [x] Interactive family bubbles
- [x] Custom bubble physics
- [x] Family Pool mini-game
- [x] Pool-specific physics
- [x] Responsive desktop/mobile pool layouts
- [x] Pocket and win-state system

### Remaining for v1

- [ ] Final form styling
- [ ] Photo/archive visual polish
- [ ] Photo viewer polish
- [ ] Login screen redesign
- [ ] Final desktop/mobile consistency pass
- [ ] Production regression testing
- [ ] Code cleanup and final v1 checkpoint

---

## ❤️ About the Project

Family Calendar was built around a simple idea: create one private place where my family can both **plan what's coming next and preserve what already happened**.

It's part calendar, part family photo album, part memory archive — and now, apparently, part pool hall.

It's built from scratch around the people who will actually use it.

And yes, you can grab your family members, throw them across the calendar, use one of them to break a rack of the others, and sink your entire family into pool-table pockets. 🎱😄

---

Built with ❤️ and JavaScript.