import { toDate, formatInTimeZone } from "date-fns-tz";

// Set a base time zone for all your dates
const baseTimeZone = "America/New_York"; // Change this to your desired base time zone

// Get the user's time zone
const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const formatDate = (dateString) => {
  // Parse the date string as if it were in the base time zone
  const date = toDate(dateString, { timeZone: baseTimeZone });

  // Format the date in the user's time zone
  return formatInTimeZone(date, userTimeZone, "yyyy-MM-dd'T'HH:mm:ssXXX");
};

export const weekDates = {
  1: {
    availableFrom: formatDate("2024-07-20T00:00:00"), // Tuesday
    viewableFrom: formatDate("2024-07-21T20:00:00"), // Thursday 8:00 PM
  },
  2: {
    availableFrom: formatDate("2024-07-22T00:00:00"),
    viewableFrom: formatDate("2024-07-29T20:00:00"),
  },
  3: {
    availableFrom: formatDate("2024-07-30T00:00:00"),
    viewableFrom: formatDate("2024-07-31T04:20:00"),
  },
  4: {
    availableFrom: formatDate("2024-08-01T00:00:00"),
    viewableFrom: formatDate("2024-08-01T20:00:00"),
  },
  5: {
    availableFrom: formatDate("2024-10-01T00:00:00"),
    viewableFrom: formatDate("2024-10-03T20:00:00"),
  },
  6: {
    availableFrom: formatDate("2024-10-08T00:00:00"),
    viewableFrom: formatDate("2024-10-10T20:00:00"),
  },
  7: {
    availableFrom: formatDate("2024-10-15T00:00:00"),
    viewableFrom: formatDate("2024-10-17T20:00:00"),
  },
  8: {
    availableFrom: formatDate("2024-10-22T00:00:00"),
    viewableFrom: formatDate("2024-10-24T20:00:00"),
  },
  9: {
    availableFrom: formatDate("2024-10-29T00:00:00"),
    viewableFrom: formatDate("2024-10-31T20:00:00"),
  },
  10: {
    availableFrom: formatDate("2024-11-05T00:00:00"),
    viewableFrom: formatDate("2024-11-07T20:00:00"),
  },
  11: {
    availableFrom: formatDate("2024-11-12T00:00:00"),
    viewableFrom: formatDate("2024-11-14T20:00:00"),
  },
  12: {
    availableFrom: formatDate("2024-11-25T00:00:00"), // Monday (after Thanksgiving)
    viewableFrom: formatDate("2024-11-27T20:00:00"), // Wednesday 8:00 PM
  },
  13: {
    availableFrom: formatDate("2024-12-03T00:00:00"),
    viewableFrom: formatDate("2024-12-05T20:00:00"),
  },
  14: {
    availableFrom: formatDate("2024-12-10T00:00:00"),
    viewableFrom: formatDate("2024-12-12T20:00:00"),
  },
  15: {
    availableFrom: formatDate("2024-12-17T00:00:00"),
    viewableFrom: formatDate("2024-12-19T20:00:00"),
  },
  16: {
    availableFrom: formatDate("2024-12-24T00:00:00"),
    viewableFrom: formatDate("2024-12-26T20:00:00"),
  },
  17: {
    availableFrom: formatDate("2024-12-31T00:00:00"),
    viewableFrom: formatDate("2025-01-02T20:00:00"),
  },
  18: {
    availableFrom: formatDate("2025-01-04T00:00:00"), // Saturday
    viewableFrom: formatDate("2025-01-06T20:00:00"), // Monday 8:00 PM (assuming final games on Sunday)
  },
};

export const isWeekAvailable = (weekNumber) => {
  const now = new Date();
  const weekDate = weekDates[weekNumber];

  return (
    weekDate &&
    now >= toDate(weekDate.availableFrom, { timeZone: userTimeZone })
  );
};

export const isWeekViewable = (weekNumber) => {
  const now = new Date();
  const weekDate = weekDates[weekNumber];

  return (
    weekDate && now >= toDate(weekDate.viewableFrom, { timeZone: userTimeZone })
  );
};

export const getLatestAvailableWeek = () => {
  const now = new Date();
  let latestWeek = 1;

  for (const [week, dates] of Object.entries(weekDates)) {
    if (now >= toDate(dates.availableFrom, { timeZone: userTimeZone })) {
      latestWeek = parseInt(week);
    } else {
      break;
    }
  }

  return latestWeek;
};

export default weekDates;
