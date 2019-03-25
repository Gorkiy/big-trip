import {makeFilterData} from './make-filter.js';
import {makeTripPoint} from './make-trip-point.js';
import TripDay from './trip-day.js';
import Filter from './filter.js';
import {chart, typeToChartLabel} from './stats.js';

const tripPoints = document.querySelector(`.trip-points`);
const mainFilter = document.querySelector(`.trip-filter`);
const tableButton = document.querySelector(`.view-switch__item:nth-child(1)`);
const statsButton = document.querySelector(`.view-switch__item:nth-child(2)`);
const main = document.querySelector(`.main`);
const statistic = document.querySelector(`.statistic`);

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

// Генерация входящих данных с массивом объектов-точек
const getPoints = (amount) => {
  let result = [];
  for (let i = 0; i < amount; i++) {
    let pointData = makeTripPoint();
    result.push(pointData);
  }
  return result;
};

// Сортировка точек по дням
const sortPointsByDay = (data) => {
  pointsByDay.clear();
  for (let point of data) {
    if (!pointsByDay.has(point.uniqueDay)) {
      pointsByDay.set(point.uniqueDay, [point]);
    } else {
      pointsByDay.get(point.uniqueDay).push(point);
    }
  }
  pointsByDay = new Map([...pointsByDay.entries()].sort());
};

// Отрисовка точек из отсортированной по дням базы точек
const renderPoints = (data) => {
  data.forEach((dayPoints) => {
    let day = new TripDay(dayPoints);
    tripPoints.appendChild(day.render());

    day.onDelete = () => {
      const pointsIndex = points.findIndex((point) => point.id === day._recentlyDeletedId);
      points.splice(pointsIndex, 1);
    };
  });
};
// Сортируем задачи под фильтры
const filterTasks = (data, filterName) => {
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
      const filteredTasks = filterTasks(points, filterName);
      tripPoints.innerHTML = ``;
      sortPointsByDay(filteredTasks);
      renderPoints(pointsByDay);
    };
  });
}
// Генерируем данные для чартов
const getChartsData = (data) => {
  const transportOnlyPoints = data.filter((point) => {
    return point.type === `Taxi` || point.type === `Flight` || point.type === `Ship` || point.type === `Drive`;
  });
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
  if (chart.transportChart !== null) {
    chart.transportChart.destroy();
  }
  if (chart.moneyChart !== null) {
    chart.moneyChart.destroy();
  }

  getChartsData(points);
  chart.generateTransportChart(document.querySelector(`.statistic__transport`), chartData.transportLabels, chartData.transportFreq);
  chart.generateMoneyChart(document.querySelector(`.statistic__money`), chartData.typeLabels, chartData.cost);
  chart.moneyChart.height = chartData.moneyChartHeight;
  chart.transportChart.height = chartData.transportChartHeight;
};

// Temp render
points = getPoints(7);
sortPointsByDay(points);
renderPoints(pointsByDay);
renderFilters(filtersRawData);
