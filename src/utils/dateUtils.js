export const getDaysInMonth = (year, month) =>
  new Date(year, month + 1, 0).getDate();

export const getFirstDayOfMonth = (year, month) =>
  new Date(year, month, 1).getDay();

export const formatDateKey = (year, month, day) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export const getRangeKey = (year, month, start, end) =>
  end
    ? `${formatDateKey(year, month, start)}_${formatDateKey(year, month, end)}`
    : formatDateKey(year, month, start);

export const getDaysUntil = (year, month, day) => {
  const target = new Date(year, month, day);
  target.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
};