const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const daySuffix = { 1: "st", 2: "nd", 3: "rd" };

export const getDayName = (date) => (date ? dayNames[date.getDay()] : "");

export const getMonthName = (date) => (date ? monthNames[date.getMonth()] : "");

export function getDayWithSuffix(date) {
  if (!date) return;
  const dayNum = date.getDay();
  const suffix = daySuffix[dayNum.toString().slice(-1)] || "th";
  return dayNum + suffix;
}
