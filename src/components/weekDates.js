// weekDates.js

const weekDates = {
  1: {
    availableFrom: new Date("2024-07-20T00:00:00Z"), // Tuesday
    viewableFrom: new Date("2024-07-21T20:00:00Z"), // Thursday 8:00 PM
  },
  2: {
    availableFrom: new Date("2024-07-22T00:00:00Z"),
    viewableFrom: new Date("2024-07-29T20:00:00Z"),
  },
  3: {
    availableFrom: new Date("2024-09-17T00:00:00Z"),
    viewableFrom: new Date("2024-09-19T20:00:00Z"),
  },
  4: {
    availableFrom: new Date("2024-09-24T00:00:00Z"),
    viewableFrom: new Date("2024-09-26T20:00:00Z"),
  },
  5: {
    availableFrom: new Date("2024-10-01T00:00:00Z"),
    viewableFrom: new Date("2024-10-03T20:00:00Z"),
  },
  6: {
    availableFrom: new Date("2024-10-08T00:00:00Z"),
    viewableFrom: new Date("2024-10-10T20:00:00Z"),
  },
  7: {
    availableFrom: new Date("2024-10-15T00:00:00Z"),
    viewableFrom: new Date("2024-10-17T20:00:00Z"),
  },
  8: {
    availableFrom: new Date("2024-10-22T00:00:00Z"),
    viewableFrom: new Date("2024-10-24T20:00:00Z"),
  },
  9: {
    availableFrom: new Date("2024-10-29T00:00:00Z"),
    viewableFrom: new Date("2024-10-31T20:00:00Z"),
  },
  10: {
    availableFrom: new Date("2024-11-05T00:00:00Z"),
    viewableFrom: new Date("2024-11-07T20:00:00Z"),
  },
  11: {
    availableFrom: new Date("2024-11-12T00:00:00Z"),
    viewableFrom: new Date("2024-11-14T20:00:00Z"),
  },
  12: {
    availableFrom: new Date("2024-11-25T00:00:00Z"), // Monday (after Thanksgiving)
    viewableFrom: new Date("2024-11-27T20:00:00Z"), // Wednesday 8:00 PM
  },
  13: {
    availableFrom: new Date("2024-12-03T00:00:00Z"),
    viewableFrom: new Date("2024-12-05T20:00:00Z"),
  },
  14: {
    availableFrom: new Date("2024-12-10T00:00:00Z"),
    viewableFrom: new Date("2024-12-12T20:00:00Z"),
  },
  15: {
    availableFrom: new Date("2024-12-17T00:00:00Z"),
    viewableFrom: new Date("2024-12-19T20:00:00Z"),
  },
  16: {
    availableFrom: new Date("2024-12-24T00:00:00Z"),
    viewableFrom: new Date("2024-12-26T20:00:00Z"),
  },
  17: {
    availableFrom: new Date("2024-12-31T00:00:00Z"),
    viewableFrom: new Date("2025-01-02T20:00:00Z"),
  },
  18: {
    availableFrom: new Date("2025-01-04T00:00:00Z"), // Saturday
    viewableFrom: new Date("2025-01-06T20:00:00Z"), // Monday 8:00 PM (assuming final games on Sunday)
  },
};

export const isWeekAvailable = (weekNumber) => {
  const today = new Date();
  const weekDate = weekDates[weekNumber];
  console.log(
    `Today: ${today}, Week ${weekNumber} available from: ${weekDate?.availableFrom}`
  );
  return weekDate && today >= weekDate.availableFrom;
};

export const isWeekViewable = (weekNumber) => {
  const today = new Date();
  const weekDate = weekDates[weekNumber];
  return weekDate && today >= weekDate.viewableFrom;
};

export const getLatestAvailableWeek = () => {
  const today = new Date();
  let latestWeek = 1;

  for (const [week, dates] of Object.entries(weekDates)) {
    if (today >= dates.availableFrom) {
      latestWeek = parseInt(week);
    } else {
      break;
    }
  }

  return latestWeek;
};

export default weekDates;