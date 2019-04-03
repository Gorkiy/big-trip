export const types = {
  'Taxi': `🚕`,
  'Bus': `🚌`,
  'Train': `🚂`,
  'Ship': `🛳️`,
  // 'Transport': `🚊`,
  'Drive': `🚗`,
  'Flight': `✈️`,
  'Check-in': `🏨`,
  'Sightseeing': `🏛`,
  // 'Restaurant': `🍴`,
};
let id = 0;
const generateNewId = () => id++;

const getRandomInt = (maxNum) => Math.floor(Math.random() * maxNum);

const getRandomType = (typesObj) => {
  const typeEntries = Object.entries(typesObj);
  return typeEntries[getRandomInt(typeEntries.length)];
};

const getRandomOffers = (offersArr) => {
  let result = [];
  for (let i = 0; i < getRandomInt(3); i++) {
    let offer = offersArr[getRandomInt(offersArr.length)];
    if (!result.includes(offer)) {
      result.push(offer);
    } else {
      i--;
    }
  }
  return result;
};

export const formatDate = (date) => {
  const monthNames = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `June`,
    `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

  return {
    tripYear: (`` + date.getFullYear()).substr(-2),
    tripMonth: monthNames[date.getMonth()],
    tripDay: date.getDate().toString(),
    uniqueDay: `` + date.getDate() + (date.getMonth() + 1) + date.getFullYear(),
  };
};

export const getTime = (date, dateDue) => {
  const interval = {
    from: ``,
    due: ``,
    duration: ``,
    timeDiffMs: ``
  };

  const diffMs = dateDue - date;
  const diffHrs = Math.floor(diffMs / 3600000) % 24;
  const diffDays = Math.floor(diffMs / 86400000);
  // const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
  const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

  let days = diffDays;
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

  if (diffMs < 86400000) {
    interval.duration = diffHrs + `H ` + diffMins;
  } else {
    interval.duration = days + `D ` + diffHrs + `H ` + diffMins;
  }

  interval.from = hours + `:` + minutes;
  interval.due = dueHours + `:` + dueMinutes;
  interval.timeDiffMs = diffMs;

  return interval;
};
