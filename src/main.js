navigator.serviceWorker.register(`/sw.js`);

import TripDay from './trip-day.js';
import Filter from './filter.js';
import PointEdit from './point-edit.js';
import {chart, getChartsData, chartData} from './stats.js';
import {provider} from './api.js';
import ModelPoint from './model-point.js';

const tripPoints = document.querySelector(`.trip-points`);
const mainFilter = document.querySelector(`.trip-filter`);
const tableButton = document.querySelector(`.view-switch__item:nth-child(1)`);
const statsButton = document.querySelector(`.view-switch__item:nth-child(2)`);
const main = document.querySelector(`.main`);
const statistic = document.querySelector(`.statistic`);
const newEventButton = document.querySelector(`.trip-controls__new-event`);
const timeIntSort = document.querySelector(`.trip-sorting__item--time`);
const defaultSort = document.querySelector(`.trip-sorting__item--event`);
const priceSort = document.querySelector(`.trip-sorting__item--price`);

let descendingTime;
let descendingPrice;
let totalPrice = 0;

const pointsByDay = new Map();
const filtersRawData = [
  Filter.makeFilterData(`everything`, `filter-everything`, true),
  Filter.makeFilterData(`future`, `filter-future`),
  Filter.makeFilterData(`past`, `filter-past`),
];

const render = (pointsData) => {
  tripPoints.innerHTML = ``;
  getPointFullPrice(pointsData);
  sortPointsByDay(pointsData);
  renderPoints(pointsByDay);
  renderTripDates(pointsByDay);
};

newEventButton.addEventListener(`click`, () => {
  const newPoint = {
    'id': String(Date.now()),
    'date_from': new Date(),
    'date_to': new Date(),
    'destination': {
      name: ``,
      description: ``,
      pictures: []
    },
    'base_price': 0,
    'is_favorite': false,
    'offers': [],
    'type': `bus`,
  };

  const point = new ModelPoint(newPoint);
  const pointEdit = new PointEdit(point);

  pointEdit.onSubmit = (newObject) => {
    newPoint.destination = {
      name: newObject.city,
      description: newObject.description,
      pictures: newObject.picture
    };
    newPoint.type = newObject.type.toLowerCase();
    newPoint.offers = newObject.offers;
    newPoint[`is_favorite`] = newObject.isFavorite;
    newPoint[`base_price`] = newObject.price;
    newPoint[`date_from`] = newObject.date.getTime();
    newPoint[`date_to`] = newObject.dateDue.getTime();

    provider.createPoint(newPoint).then(() => {
      provider.getPoints()
        .then((pointsData) => {
          render(pointsData);
        });
    });
  };

  pointEdit.onDelete = () => {
    pointEdit.unrender();
  };

  tripPoints.insertBefore(pointEdit.render(), tripPoints.firstChild);
});

// Сортировки
defaultSort.addEventListener(`click`, () => {
  provider.getPoints()
    .then((pointsData) => {
      render(pointsData);
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

// Сортировка точек по дням
const sortPointsByDay = (data) => {
  pointsByDay.clear();
  data.sort((a, b) => a.uniqueDay - b.uniqueDay);

  for (const point of data) {
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
    const day = new TripDay(dayPoints);
    tripPoints.appendChild(day.render());

    day.onDelete = () => {
      provider.getPoints()
      .then((remainPoints) => {
        render(remainPoints);
      });
    };
    day.onSubmit = () => {
      provider.getPoints()
      .then((allPoints) => {
        render(allPoints);
      });
    };
  });
};

// Сортировки таблицы точек
const sortByTime = (data, descending = true) => {
  if (descending) {
    return data.sort((a, b) => a.time.timeDifferenceMs - b.time.timeDifferenceMs);
  } else {
    return data.sort((a, b) => b.time.timeDifferenceMs - a.time.timeDifferenceMs);
  }
};

const sortByPrice = (data, descending = true) =>
  descending ? data.sort((a, b) => a.fullPrice - b.fullPrice) : data.sort((a, b) => b.fullPrice - a.fullPrice);

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
    const filter = new Filter(rawFilter);
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
// Рендер чартов
const renderCharts = () => {
  const transChartCanvas = document.querySelector(`.statistic__transport`);
  const moneyChartCanvas = document.querySelector(`.statistic__money`);
  const timeChartCanvas = document.querySelector(`.statistic__time-spend`);

  if (chart.transportChart !== null) {
    chart.transportChart.destroy();
  }
  if (chart.moneyChart !== null) {
    chart.moneyChart.destroy();
  }
  if (chart.timeChart !== null) {
    chart.timeChart.destroy();
  }

  provider.getPoints()
    .then((pointsToChart) => {
      getChartsData(pointsToChart);
      moneyChartCanvas.height = chartData.moneyChartHeight;
      timeChartCanvas.height = chartData.moneyChartHeight;
      transChartCanvas.height = chartData.transportChartHeight;
      chart.generateTransportChart(transChartCanvas, chartData.transportLabels, chartData.transportFrequency);
      chart.generateMoneyChart(moneyChartCanvas, chartData.typeLabels, chartData.cost);
      chart.generateTimeChart(timeChartCanvas, chartData.typeLabels, chartData.timeSpend);
    });
};

// Пересчет цен с офферами на лету
const getPointFullPrice = (pointsData) => {
  totalPrice = 0;

  for (const point of pointsData) {
    const basePrice = +point.price;
    const fullPrice = point.offers.reduce((sum, current) => {
      return current.accepted ? (sum + current.price) : sum;
    }, basePrice);
    totalPrice += fullPrice;
    point.fullPrice = fullPrice;
  }

  document.querySelector(`.trip__total-cost`).innerText = `€ ${totalPrice}`;
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

  result = (firstMonth !== lastMonth) ? firstMonth + ` ` + firstPoint.day + ` — ` + lastMonth + ` ` + lastPoint.day : firstMonth + ` ` + firstPoint.day + ` — ` + lastPoint.day;
  document.querySelector(`.trip__dates`).innerText = result;
};

// Render
renderFilters(filtersRawData);

const msg = document.createElement(`div`);
msg.innerHTML = `Loading route...`;
msg.classList.add(`trip-points__message`);
tripPoints.appendChild(msg);

Promise.all([provider.getPoints(), provider.getDestinations(), provider.getOffers()])
  .then(([pointsData, destinations, offers]) => {
    tripPoints.removeChild(msg);
    PointEdit.setDestinations(destinations);
    PointEdit.setAllOffers(offers);
    render(pointsData);
  })
  .catch(() => {
    msg.innerHTML = `Something went wrong while loading your route info. Check your connection or try again later`;
  });
