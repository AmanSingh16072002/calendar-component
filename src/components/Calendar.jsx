import { useState, useCallback } from "react";
import { getDaysInMonth, getFirstDayOfMonth, formatDateKey } from "../utils/dateUtils";
import { useLocalStorage } from "../hooks/useLocalStorage";
import NotesPanel from "./NotesPanel";
import EventModal from "./EventModal";
import CountdownBanner from "./CountdownBanner";

const MONTH_DATA = [
  { image: "https://picsum.photos/id/winter/800/600",  quote: "Start fresh. New year, new focus." },
  { image: "https://picsum.photos/id/145/800/600",  quote: "Stay consistent. Small steps matter." },
  { image: "https://picsum.photos/id/152/800/600", quote: "Push harder. You're closer than you think." }, 
  { image: "https://picsum.photos/id/110/800/600",  quote: "Focus on today. Make it count." },
  { image: "https://picsum.photos/id/116/800/600",  quote: "Discipline beats motivation." },
  { image: "https://picsum.photos/id/137/800/600",  quote: "Keep showing up. That's the key." },
  { image: "https://picsum.photos/id/167/800/600",  quote: "You're building your future today." },
  { image: "https://picsum.photos/id/240/800/600",  quote: "Stay patient. Growth takes time." },
  { image: "https://picsum.photos/id/247/800/600",  quote: "Focus > distraction. Choose wisely." },
  { image: "https://picsum.photos/id/257/800/600",  quote: "Finish what you started." },
  { image: "https://picsum.photos/id/292/800/600",  quote: "Consistency creates confidence." },
  { image: "https://picsum.photos/id/310/800/600",  quote: "End strong. Reflect and grow." },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [theme, setTheme] = useLocalStorage("cal-theme", "light");
  const [events, setEvents] = useLocalStorage("cal-events", {});
  const [modal, setModal] = useState(null); // { day } | null

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const { image, quote } = MONTH_DATA[month];

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // ── DATE CLICK: only range selection, no modal ──
  const handleDateClick = useCallback((day) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else {
      if (day < startDate) {
        setEndDate(startDate);
        setStartDate(day);
      } else if (day === startDate) {
        setStartDate(null);
      } else {
        setEndDate(day);
      }
    }
  }, [startDate, endDate]);

  // ── RIGHT CLICK / LONG PRESS: opens modal ──
  const handleContextMenu = useCallback((e, day) => {
    e.preventDefault();
    setModal({ day });
  }, []);

  const handleSaveEvent = useCallback(({ label, isCountdown }) => {
    const key = formatDateKey(year, month, modal.day);
    setEvents((prev) => ({ ...prev, [key]: { label, isCountdown } }));
    setModal(null);
  }, [modal, year, month, setEvents]);

  const handleDeleteEvent = useCallback(() => {
  const key = formatDateKey(year, month, modal.day);
  setEvents((prev) => {
    const updated = { ...prev };
    delete updated[key];
    return updated;
  });
  setModal(null);
}, [modal, year, month, setEvents]);

  const goToPrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const monthName = currentMonth.toLocaleString("default", { month: "long" });

  // ── BUILD GRID ──
  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`e-${i}`} className="day-cell empty" />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const key = formatDateKey(year, month, d);
    const event = events[key];
    const isToday = isCurrentMonth && d === todayDate;
    const isStart = startDate === d;
    const isEnd = endDate === d;
    const inRange = startDate && endDate && d > startDate && d < endDate;
    const dayIndex = (firstDay + d - 1) % 7;
    const isSunday = dayIndex === 0;

    cells.push(
      <div
        key={d}
        className={[
          "day-cell",
          isToday ? "is-today" : "",
          isStart ? "is-start" : "",
          isEnd ? "is-end" : "",
          inRange ? "in-range" : "",
          isSunday ? "is-sunday" : "",
          event ? "has-event" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => handleDateClick(d)}
        onContextMenu={(e) => handleContextMenu(e, d)}
        title="Right-click to add event"
        role="button"
        aria-label={`${monthName} ${d}${event ? `, ${event.label}` : ""}`}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleDateClick(d)}
      >
        <span className="day-number">{d}</span>
        {isToday && <span className="today-dot" />}
        {event && <span className="event-chip">{event.label}</span>}
      </div>
    );
  }

  return (
    <div className={`cal-root ${theme}`}>
      <div className="cal-wrapper">

        {/* ── IMAGE PANEL ── */}
        <aside className="cal-image-panel">
          <img src={image} alt={`${monthName} visual`} className="cal-hero-img" />
          <div className="cal-quote-overlay">
            <p className="cal-quote">{quote}</p>
          </div>
          <div className="cal-month-badge">{monthName}</div>
        </aside>

        {/* ── MAIN PANEL ── */}
        <main className="cal-main">

          {/* Header */}
          <div className="cal-header">
            <button
              className="nav-btn"
              onClick={goToPrevMonth}
              aria-label="Previous month"
            >
              ←
            </button>
            <h2 className="cal-title">
              {monthName} <span className="cal-year">{year}</span>
            </h2>
            <div className="cal-header-right">
              <button
                className="theme-btn"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                aria-label="Toggle theme"
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>
              <button
                className="nav-btn"
                onClick={goToNextMonth}
                aria-label="Next month"
              >
                →
              </button>
            </div>
          </div>

          {/* Countdown banner */}
          {Object.keys(events).length > 0 && (
          <CountdownBanner events={events} />
        )}

          {/* Weekdays */}
          <div className="cal-weekdays">
            {WEEKDAYS.map((d) => (
              <div key={d} className={`weekday-label ${d === "Sun" ? "is-sunday" : ""}`}>
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="cal-grid">{cells}</div>

          {/* Right-click hint */}
          <p className="cal-hint">
            Click to select range · Right-click a date to add an event
          </p>

          {/* Notes */}
          <NotesPanel
            startDate={startDate}
            endDate={endDate}
            month={month}
            year={year}
          />
        </main>
      </div>

      {/* Modal */}
      {modal && (
        <EventModal
          day={modal.day}
          month={month}
          year={year}
          existingLabel={events[formatDateKey(year, month, modal.day)]?.label}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default Calendar;