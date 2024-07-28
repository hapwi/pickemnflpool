// weekDates.js
const weekDates = {
  1: new Date("2024-01-04"),
  2: new Date("2024-02-11"),
  3: new Date("2024-09-18"),
  4: new Date("2024-09-25"),
  5: new Date("2024-10-02"),
  6: new Date("2024-10-09"),
  7: new Date("2024-10-16"),
  8: new Date("2024-10-23"),
  9: new Date("2024-10-30"),
  10: new Date("2024-11-06"),
  11: new Date("2024-11-13"),
  12: new Date("2024-11-20"),
  13: new Date("2024-11-27"),
  14: new Date("2024-12-04"),
  15: new Date("2024-12-11"),
  16: new Date("2024-12-18"),
  17: new Date("2024-12-25"),
  18: new Date("2025-01-01"),
};

export const isWeekAvailable = (weekNumber) => {
  const today = new Date();
  const weekDate = weekDates[weekNumber];
  return weekDate && today >= weekDate;
};

export const getLatestAvailableWeek = () => {
  const today = new Date();
  let latestWeek = 1;

  for (const [week, date] of Object.entries(weekDates)) {
    if (today >= date) {
      latestWeek = parseInt(week);
    } else {
      break;
    }
  }

  return latestWeek;
};

export default weekDates;
