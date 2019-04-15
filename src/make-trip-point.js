export const types = {
  'Taxi': `🚕`,
  'Bus': `🚌`,
  'Train': `🚂`,
  'Ship': `🛳️`,
  'Drive': `🚗`,
  'Flight': `✈️`,
  'Check-in': `🏨`,
  'Sightseeing': `🏛`,
};

export const formatNewDate = (ms) => {
  const date = new Date(ms);
  const monthNames = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `June`,
    `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

  const monthNumber = date.getMonth() + 1;
  const month = monthNumber < 10 ? `0` + monthNumber : monthNumber.toString();
  const day = date.getDate() < 10 ? `0` + date.getDate() : date.getDate().toString();

  return {
    tripYear: (`` + date.getFullYear()).substr(-2),
    tripMonth: monthNames[date.getMonth()],
    tripDay: date.getDate().toString(),
    uniqueDay: `` + date.getDate() + (date.getMonth() + 1) + date.getFullYear(),
    flatpickrFormat: date.getFullYear() + `-` + month + `-` + day,
  };
};

export const getTime = (date, dateDue) => {
  const interval = {
    from: ``,
    due: ``,
    duration: ``,
    timeDifferenceMs: ``
  };

  const differenceMs = dateDue - date;
  const differenceHours = Math.floor(differenceMs / 3600000) % 24;
  const differenceDays = Math.floor(differenceMs / 86400000);
  const differenceMins = Math.round(((differenceMs % 86400000) % 3600000) / 60000);

  let days = differenceDays;
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (hours < 10) {
    hours = `0` + hours;
  }
  if (minutes < 10) {
    minutes = `0` + minutes;
  }
  if (days < 10) {
    days = `0` + days;
  }

  let dueHours = dateDue.getHours();
  let dueMinutes = dateDue.getMinutes();
  if (dueHours < 10) {
    dueHours = `0` + dueHours;
  }
  if (dueMinutes < 10) {
    dueMinutes += `0`;
  }
  interval.duration = (differenceMs < 86400000) ? (differenceHours + `H ` + differenceMins) : (days + `D ` + differenceHours + `H ` + differenceMins);

  interval.from = hours + `:` + minutes;
  interval.due = dueHours + `:` + dueMinutes;
  interval.timeDifferenceMs = differenceMs;

  return interval;
};
