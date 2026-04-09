import { useState, useEffect, useRef } from "react";

const PRESET_LABELS = ["Exam", "Interview", "Deadline", "Holiday", "Birthday"];

const EventModal = ({ day, month, year, onSave, onClose, existingLabel }) => {
  const [label, setLabel] = useState(existingLabel || "");
  const [isCountdown, setIsCountdown] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // close on Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = () => {
    if (!label.trim()) return;
    onSave({ label: label.trim(), isCountdown });
  };

  const date = new Date(year, month, day);
  const formatted = date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Add event"
      >
        <div className="modal-header">
          <span className="modal-date">{formatted}</span>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <label className="modal-label-text">Event name</label>
          <input
            ref={inputRef}
            type="text"
            className="modal-input"
            placeholder="e.g. JEE Mains, DSA Interview..."
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            maxLength={40}
          />

          <div className="preset-chips">
            {PRESET_LABELS.map((p) => (
              <button
                key={p}
                className={`chip ${label === p ? "chip-active" : ""}`}
                onClick={() => setLabel(p)}
              >
                {p}
              </button>
            ))}
          </div>

          <label className="modal-checkbox-row">
            <input
              type="checkbox"
              checked={isCountdown}
              onChange={(e) => setIsCountdown(e.target.checked)}
            />
            <span>Track countdown to this date</span>
          </label>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={!label.trim()}
          >
            Save Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;