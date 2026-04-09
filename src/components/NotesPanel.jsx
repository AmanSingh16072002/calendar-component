import { useState, useEffect, useMemo, useCallback } from "react";
import { getRangeKey } from "../utils/dateUtils";
import { useLocalStorage } from "../hooks/useLocalStorage";

const NotesPanel = ({ startDate, endDate, month, year }) => {
  const [allNotes, setAllNotes] = useLocalStorage("cal-notes", {});
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const key = useMemo(
    () =>
      startDate != null
        ? getRangeKey(year, month, startDate, endDate)
        : null,
    [startDate, endDate, month, year]
  );

  // load note when key changes — fixed dep array
  useEffect(() => {
    if (key) {
      setNote(allNotes[key] ?? "");
    } else {
      setNote("");
    }
    setSaved(false);
  }, [key, allNotes]);

  const handleSave = useCallback(() => {
    if (!key) return;
    setAllNotes((prev) => ({ ...prev, [key]: note }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [key, note, setAllNotes]);

  const handleDelete = useCallback(() => {
    if (!key) return;
    setAllNotes((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
    setNote("");
  }, [key, setAllNotes]);

  const formatSelectionLabel = () => {
    if (!startDate) return null;
    const opts = { day: "numeric", month: "short" };
    const start = new Date(year, month, startDate).toLocaleDateString("en-IN", opts);
    if (!endDate) return start;
    const end = new Date(year, month, endDate).toLocaleDateString("en-IN", opts);
    return `${start} → ${end}`;
  };

  const selectionLabel = formatSelectionLabel();

  return (
    <div className="notes-panel">
      <div className="notes-header">
        <h3>Notes</h3>
        {selectionLabel && (
          <span className="notes-for-label">for {selectionLabel}</span>
        )}
      </div>

      {!startDate ? (
        <p className="notes-empty-hint">
          Select a date on the calendar to add a note.
        </p>
      ) : (
        <>
          <textarea
            className="notes-textarea"
            placeholder={`Notes for ${selectionLabel}...`}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setSaved(false);
            }}
          />
          <div className="notes-actions">
            <button
              className="btn-delete"
              onClick={handleDelete}
              disabled={!allNotes[key]}
            >
              Clear
            </button>
            <button
              className={`btn-save ${saved ? "btn-saved" : ""}`}
              onClick={handleSave}
            >
              {saved ? "✓ Saved" : "Save"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotesPanel;