import { getDaysUntil } from "../utils/dateUtils";

const CountdownBanner = ({ events }) => {
  // Build list of all countdown events across ALL months
  const countdownEvents = Object.entries(events)
    .filter(([, v]) => v?.isCountdown && v?.label)
    .map(([key, v]) => {
      // key format: "YYYY-MM-DD"
      // handle both single-date "YYYY-MM-DD" and range "YYYY-MM-DD_YYYY-MM-DD"
      const baseKey = key.split("_")[0];
      const [y, m, d] = baseKey.split("-").map(Number);

      // month is 0-indexed in getDaysUntil
      const daysLeft = getDaysUntil(y, m - 1, d);

      return {
        label: v.label,
        daysLeft,
        key,
      };
    })
    .filter((e) => e.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  if (!countdownEvents.length) return null;

  const next = countdownEvents[0];

  return (
    <div className="countdown-banner">
      <span className="countdown-icon">⏳</span>
      <div className="countdown-text">
        <strong>{next.label}</strong>
        {next.daysLeft === 0 ? (
          <span className="countdown-day">Today is the day! 🔥</span>
        ) : next.daysLeft === 1 ? (
          <span className="countdown-day">Tomorrow! Stay sharp 💪</span>
        ) : (
          <span className="countdown-day">{next.daysLeft} days to go</span>
        )}
      </div>
      {countdownEvents.length > 1 && (
        <span className="countdown-more">
          +{countdownEvents.length - 1} more
        </span>
      )}
    </div>
  );
};

export default CountdownBanner;