import {makeFilterData} from './make-filter.js';
import TripDay from './trip-day.js';
import Filter from './filter.js';
import PointEdit from './point-edit.js';
import {chart, typeToChartLabel} from './stats.js';
import {provider} from './api.js';

const tripPoints = document.querySelector(`.trip-points`);
const mainFilter = document.querySelector(`.trip-filter`);
const tableButton = document.querySelector(`.view-switch__item:nth-child(1)`);
const statsButton = document.querySelector(`.view-switch__item:nth-child(2)`);
const main = document.querySelector(`.main`);
const statistic = document.querySelector(`.statistic`);
// const newEventButton = document.querySelector(`.trip-controls__new-event`);
const timeIntSort = document.querySelector(`.trip-sorting__item--time`);
const defaultSort = document.querySelector(`.trip-sorting__item--event`);
const priceSort = document.querySelector(`.trip-sorting__item--price`);
let descendingTime;
let descendingPrice;
let totalPrice = 0;

const init = (pointsData) => {
  tripPoints.innerHTML = ``;
  getPointFullPrice(pointsData);
  sortPointsByDay(pointsData);
  renderPoints(pointsByDay);
  renderTripDates(pointsByDay);
};

// newEventButton.addEventListener(`click`, (evt) => {
//   evt.preventDefault();
//   const dummyData = {
//     ...
//   }
//
//   const point = new Point(dummyData);
//   const pointEdit = new PointEdit(dummyData);
//   pointEdit.render();
//   ...
// });

defaultSort.addEventListener(`click`, () => {
  provider.getPoints()
    .then((pointsData) => {
      init(pointsData);
    });
});

timeIntSort.addEventListener(`click`, () => {
  descendingTime = !descendingTime;
  provider.getPoints()
    .then((pointsData) => {
      tripPoints.innerHTML = ``;
      getPointFullPrice(pointsData);
      sortByTime(pointsData, descendingTime);
      sortPointsByDay(pointsData);
      renderPoints(pointsByDay);
    });
});

priceSort.addEventListener(`click`, () => {
  descendingPrice = !descendingPrice;
  provider.getPoints()
    .then((pointsData) => {
      tripPoints.innerHTML = ``;
      getPointFullPrice(pointsData);
      sortByPrice(pointsData, descendingPrice);
      sortPointsByDay(pointsData);
      renderPoints(pointsByDay);
    });
});

statsButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tableButton.classList.toggle(`view-switch__item--active`);
  statsButton.classList.toggle(`view-switch__item--active`);
  main.classList.toggle(`visually-hidden`);
  statistic.classList.toggle(`visually-hidden`);
  renderCharts();
});

tableButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tableButton.classList.toggle(`view-switch__item--active`);
  statsButton.classList.toggle(`view-switch__item--active`);
  main.classList.toggle(`visually-hidden`);
  statistic.classList.toggle(`visually-hidden`);
});

let pointsByDay = new Map();
export let points = [];
let filtersRawData = [
  makeFilterData(`everything`, `filter-everything`, true),
  makeFilterData(`future`, `filter-future`),
  makeFilterData(`past`, `filter-past`),
];
const chartData = {
  transportLabels: [],
  transportFreq: [],
  transportChartHeight: 0,
  typeLabels: [],
  cost: [],
  moneyChartHeight: 0,
};

// Сортировка точек по дням
const sortPointsByDay = (data) => {
  pointsByDay.clear();
  data.sort((a, b) => a.uniqueDay - b.uniqueDay);

  for (let point of data) {
    if (!pointsByDay.has(point.uniqueDay)) {
      pointsByDay.set(point.uniqueDay, [point]);
    } else {
      pointsByDay.get(point.uniqueDay).push(point);
    }
  }
};

// Отрисовка точек из отсортированной по дням базы точек
const renderPoints = (data) => {
  data.forEach((dayPoints) => {
    let day = new TripDay(dayPoints);
    tripPoints.appendChild(day.render());

    day.onDelete = () => {
      provider.getPoints()
      .then((remainPoints) => {
        init(remainPoints);
      });
    };
    day.onSubmit = () => {
      provider.getPoints()
      .then((allPoints) => {
        init(allPoints);
      });
    };
  });
};

// Сортировки таблицы точек
const sortByTime = (data, descending = true) => {
  if (descending) {
    return data.sort((a, b) => a.time.timeDiffMs - b.time.timeDiffMs);
  } else {
    return data.sort((a, b) => b.time.timeDiffMs - a.time.timeDiffMs);
  }
};

const sortByPrice = (data, descending = true) => {
  if (descending) {
    return data.sort((a, b) => a.fullPrice - b.fullPrice);
  } else {
    return data.sort((a, b) => b.fullPrice - a.fullPrice);
  }
};

// Сортируем задачи под фильтры
const filterPoints = (data, filterName) => {
  switch (filterName) {
    case `filter-everything`:
      return data;
    case `filter-future`:
      return data.filter((it) => it.date > Date.now());
    case `filter-past`:
      return data.filter((it) => it.date < Date.now());
  }
  return data;
};

function renderFilters(filtersData) {
  filtersData.forEach((rawFilter) => {
    let filter = new Filter(rawFilter);
    mainFilter.appendChild(filter.render());

    filter.onFilter = () => {
      const filterName = filter._id;
      provider.getPoints()
      .then((allPoints) => {
        const filteredPoints = filterPoints(allPoints, filterName);
        tripPoints.innerHTML = ``;
        sortPointsByDay(filteredPoints);
        renderPoints(pointsByDay);
      });
    };
  });
}
// Генерируем данные для чартов
const transportTypes = new Set([`Taxi`, `Flight`, `Ship`, `Drive`, `Bus`, `Train`]);

const getChartsData = (data) => {
  const transportOnlyPoints = data.filter((point) => transportTypes.has(point.type));
  const transporsData = new Map();
  const costData = new Map();
  let label = ``;
  const BAR_HEIGHT = 55;

  transportOnlyPoints.map((point) => {
    label = typeToChartLabel(point.type);
    if (!transporsData.has(label)) {
      transporsData.set(label, 1);
    } else {
      transporsData.set(label, transporsData.get(label) + 1);
    }
  });

  data.map((point) => {
    label = typeToChartLabel(point.type);
    if (!costData.has(label)) {
      costData.set(label, point.price);
    } else {
      costData.set(label, costData.get(label) + point.price);
    }
  });

  chartData.transportLabels = [...transporsData.keys()];
  chartData.transportFreq = [...transporsData.values()];
  chartData.typeLabels = [...costData.keys()];
  chartData.cost = [...costData.values()];

  chartData.transportChartHeight = BAR_HEIGHT * chartData.transportLabels.length;
  chartData.moneyChartHeight = BAR_HEIGHT * chartData.typeLabels.length;
};

const renderCharts = () => {

  const transChartCanvas = document.querySelector(`.statistic__transport`);
  const moneyChartCanvas = document.querySelector(`.statistic__money`);

  if (chart.transportChart !== null) {
    chart.transportChart.destroy();
  }
  if (chart.moneyChart !== null) {
    chart.moneyChart.destroy();
  }

  provider.getPoints()
    .then((pointsToChart) => {
      getChartsData(pointsToChart);
      moneyChartCanvas.height = chartData.moneyChartHeight;
      transChartCanvas.height = chartData.transportChartHeight;
      chart.generateTransportChart(transChartCanvas, chartData.transportLabels, chartData.transportFreq);
      chart.generateMoneyChart(moneyChartCanvas, chartData.typeLabels, chartData.cost);
    });
};

// Пересчет цен с офферами на лету
const getPointFullPrice = (pointsData) => {
  totalPrice = 0;
  pointsData.forEach((point) => {
    let basePrice = +point.price;
    const fullPrice = point.offers.reduce((sum, current) => {
      if (current.accepted) {
        return sum + current.price;
      } else {
        return sum;
      }
    }, basePrice);
    totalPrice += fullPrice;
    point.fullPrice = fullPrice;
  });
  document.querySelector(`.trip__total-cost`).innerText = `€ ${totalPrice}`; // Не обновляется по сабмиту формы
};

const renderTripDates = (pointsData) => {
  let firstPoint = null;
  let lastPoint = null;
  let result;
  let pointsArr = Array.from(pointsData.values());

  if (pointsArr.length === 0) {
    result = ``;
  } else if (pointsArr.length === 1) {
    firstPoint = pointsArr[0][0];
    lastPoint = pointsArr[0][0];
  } else {
    firstPoint = pointsArr[0][0];
    lastPoint = pointsArr[pointsArr.length - 1][0];
  }

  const firstMonth = firstPoint.month.slice(0, 3);
  const lastMonth = lastPoint.month.slice(0, 3);

  if (firstMonth !== lastMonth) {
    result = firstMonth + ` ` + firstPoint.day + ` — ` + lastMonth + ` ` + lastPoint.day;
  } else {
    result = firstMonth + ` ` + firstPoint.day + ` — ` + lastPoint.day;
  }
  document.querySelector(`.trip__dates`).innerText = result;
};

// Render
renderFilters(filtersRawData);

let msg = document.createElement(`div`);
msg.innerHTML = `Loading route...`;
msg.classList.add(`trip-points__message`);
tripPoints.appendChild(msg);

Promise.all([provider.getPoints(), provider.getDestinations(), provider.getOffers()])
  .then(([pointsData, destinations, offers]) => {
    // console.log(pointsData);
    tripPoints.removeChild(msg);
    PointEdit.setDestinations(destinations);
    PointEdit.setAllOffers(offers);
    init(pointsData);
  })
  .catch(() => {
    msg.innerHTML = `Something went wrong while loading your route info. Check your connection or try again later`;
  });
