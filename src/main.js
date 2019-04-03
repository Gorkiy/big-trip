import {makeFilterData} from './make-filter.js';
import TripDay from './trip-day.js';
import Filter from './filter.js';
import PointEdit from './point-edit.js';
import {chart, typeToChartLabel} from './stats.js';
import {api} from './api.js';

const tripPoints = document.querySelector(`.trip-points`);
const mainFilter = document.querySelector(`.trip-filter`);
const tableButton = document.querySelector(`.view-switch__item:nth-child(1)`);
const statsButton = document.querySelector(`.view-switch__item:nth-child(2)`);
const main = document.querySelector(`.main`);
const statistic = document.querySelector(`.statistic`);
const newEventButton = document.querySelector(`.trip-controls__new-event`);

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
  for (let point of data) {
    if (!pointsByDay.has(point.uniqueDay)) {
      pointsByDay.set(point.uniqueDay, [point]);
    } else {
      pointsByDay.get(point.uniqueDay).push(point);
    }
  }
  pointsByDay = new Map([...pointsByDay.entries()].sort((a, b) => a - b));
};

// Отрисовка точек из отсортированной по дням базы точек
const renderPoints = (data) => {
  data.forEach((dayPoints) => {
    let day = new TripDay(dayPoints);
    tripPoints.appendChild(day.render());

    day.onDelete = () => {
      api.getPoints()
      .then((remainPoints) => {
        getPointFullPrice(remainPoints);
        sortPointsByDay(remainPoints);
        renderPoints(pointsByDay);
      });
    };
  });
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
      api.getPoints()
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

  api.getPoints()
    .then((pointsToChart) => {
      getChartsData(pointsToChart);
      moneyChartCanvas.height = chartData.moneyChartHeight;
      transChartCanvas.height = chartData.transportChartHeight;
      chart.generateTransportChart(transChartCanvas, chartData.transportLabels, chartData.transportFreq);
      chart.generateMoneyChart(moneyChartCanvas, chartData.typeLabels, chartData.cost);
    });
};

const getPointFullPrice = (pointsData) => {
  pointsData.forEach((point) => {
    let basePrice = +point.price;
    const fullPrice = point.offers.reduce((sum, current) => {
      if (current.accepted) {
        return sum + current.price;
      } else {
        return sum;
      }
    }, basePrice);

    point.fullPrice = fullPrice;
  })
}

// Render
renderFilters(filtersRawData);

let msg = document.createElement(`div`);
msg.innerHTML = `Loading route...`;
msg.classList.add(`trip-points__message`);
tripPoints.appendChild(msg);

Promise.all([api.getPoints(), api.getDestinations(), api.getOffers()])
  .then(([pointsData, destinations, offers]) => {
    tripPoints.removeChild(msg);
    PointEdit.setDestinations(destinations);
    PointEdit.setAllOffers(offers);
    // console.log(pointsData);
    // console.log(offers);
    getPointFullPrice(pointsData);
    sortPointsByDay(pointsData);
    renderPoints(pointsByDay);
  })
  .catch(() => {
    msg.innerHTML = `Something went wrong while loading your route info. Check your connection or try again later`;
  });
