# 📅 Student Grind Calendar

A polished, interactive wall calendar built with **React + Vite**, designed specifically for students who are grinding toward goals — JEE, placements, deadlines, or anything worth counting down to.

Built as a frontend engineering challenge for [TakeUForward](https://takeuforward.org).

---

## ✨ Features

### Core
- **Wall Calendar Aesthetic** — Side-by-side layout with a full-height hero image panel that changes every month, paired with a motivational quote overlay
- **Day Range Selector** — Click any date to set a start, click another to complete the range. Clear visual states for start, end, and in-between days
- **Integrated Notes** — Notes tied to specific dates or date ranges, persisted in `localStorage`. Includes save confirmation and clear option
- **Fully Responsive** — Desktop: side-by-side image + calendar panel. Mobile: stacked vertically, fully touch-friendly

### Beyond the Baseline
- **12 Monthly Images + Quotes** — Each month has a unique high-res nature image paired with a student-focused motivational quote. Intentionally curated to match the mood of each month
- **Event Modal** — Right-click any date to open a clean modal for adding event labels. Supports preset chips (Exam, Interview, Deadline etc.), keyboard navigation (Enter to save, Escape to close), and click-outside to dismiss. **No `window.prompt()` — ever**
- **Exam Countdown Banner** — When adding an event, opt-in to countdown tracking. A persistent banner shows how many days remain to your next tracked event — across all months, not just the current view
- **Dark Mode** — Full dark theme toggle, persisted in `localStorage`
- **Today Indicator** — Current date highlighted with a distinct border and dot
- **Sunday Highlighting** — Sundays visually distinguished in red throughout the grid and header
- **Accessible** — All interactive elements have `aria-label`, keyboard navigation support, and proper `role` attributes

---

## 🧠 Technical Decisions

### `useLocalStorage` Hook
Instead of scattering `localStorage.getItem/setItem` calls across components, all persistence goes through a single `useLocalStorage(key, initialValue)` hook. This ensures consistent serialization, handles SSR-safe lazy initialization, and makes the storage layer easy to swap out later.

### Click vs Right-Click Separation
Left click = range selection only. Right click = event modal. This clean separation means you can never accidentally trigger a modal while selecting a range — a UX decision that came from thinking about how a student actually uses this daily.

### Key Format
All date keys use zero-padded ISO-style format (`YYYY-MM-DD`). The old approach (`2026-3-5`) was a subtle collision bug waiting to happen. Range notes use `YYYY-MM-DD_YYYY-MM-DD` as a composite key.

### Countdown is Global
The countdown banner reads all saved events across all months — not just the currently viewed month. So if your JEE exam is in January and you're browsing August, the countdown still shows.

### No Backend
All data — notes, events, theme preference — lives in `localStorage`. No backend, no API, no database. Exactly as the spec intended.

---

## 🗂 Project Structure

```
src/
├── components/
│   ├── Calendar.jsx        # Main calendar component, grid logic, state
│   ├── NotesPanel.jsx      # Date-specific notes with localStorage persistence
│   ├── EventModal.jsx      # Right-click modal for adding event labels
│   └── CountdownBanner.jsx # Global countdown display for tracked events
├── hooks/
│   └── useLocalStorage.js  # Reusable localStorage hook
├── utils/
│   └── dateUtils.js        # Pure date utility functions
├── styles/
│   └── calendar.css        # All styles, CSS custom properties, responsive rules
└── App.jsx
```

---

## 🚀 Running Locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/calendar-component.git
cd calendar-component

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🖥 Usage

| Action | Result |
|--------|--------|
| Click a date | Set range start |
| Click another date | Complete range |
| Right-click a date | Open event modal |
| Check "Track countdown" in modal | Shows days remaining in banner |
| Click 🌙 / ☀️ | Toggle dark/light mode |
| Click Notes textarea after selecting a date | Write and save a note for that date/range |

---

## 🌐 Live Demo

[View on Vercel →](https://YOUR_VERCEL_URL.vercel.app)

---

## 🛠 Built With

- [React](https://react.dev) + [Vite](https://vitejs.dev)
- Plain CSS with custom properties (no UI library)
- [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) + [DM Sans](https://fonts.google.com/specimen/DM+Sans) — Google Fonts
- [Picsum Photos](https://picsum.photos) for hero images

---

## 👤 Author

**Aman Singh**  
[GitHub](https://github.com/AmanSingh16072002) · [LinkedIn](https://linkedin.com/in/aman-singh-56a1931a0)