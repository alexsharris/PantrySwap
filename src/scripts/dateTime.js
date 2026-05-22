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

// gets the name of a given date (monday, tuesday, wednesday etc.)
export const getDayName = (date) => (date ? dayNames[date.getDay()] : "");

// gets the month of a given date
export const getMonthName = (date) => (date ? monthNames[date.getMonth()] : "");

// gets the suffix of a given day (eg. 1st, 2nd, 3rd, etc.)
export function getDayWithSuffix(date) {
  if (!date) return;
  const dayNum = date.getDay();
  const suffix = daySuffix[dayNum.toString().slice(-1)] || "th";
  return dayNum + suffix;
}
