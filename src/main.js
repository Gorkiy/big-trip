import {makeFilterData} from './make-filter.js';
import {makeTripPoint} from './make-trip-point.js';
import TripDay from './trip-day.js';
import Filter from './filter.js';

const tripPoints = document.querySelector(`.trip-points`);
const mainFilter = document.querySelector(`.trip-filter`);
let pointsByDay = new Map();
export let points = [];
let filtersRawData = [
  makeFilterData(`everything`, `filter-everything`, true),
  makeFilterData(`future`, `filter-future`),
  makeFilterData(`past`, `filter-past`),
];

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

const filterTasks = (data, filterName) => {
  switch (filterName) {
    case `filter-everything`:
      return data;
    case `filter-future`:
      return data.filter((it) => it.dateThen > Date.now());
    case `filter-past`:
      return data.filter((it) => it.dateThen < Date.now());
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

// Temp render
points = getPoints(7);
sortPointsByDay(points);
renderPoints(pointsByDay);
renderFilters(filtersRawData);
