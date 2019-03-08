import {renderFilter} from './make-filter.js';
import {makeTripPoint} from './make-trip-point.js';
import TripDay from './trip-day.js';

const tripPoints = document.querySelector(`.trip-points`);
let pointsByDay = new Map();
let points = [];

// Генерируем массив точек и рассовываем их по дням в pointsByDay
function generatePointsData(amount) {
  for (let i = 0; i < amount; i++) {
    let pointData = makeTripPoint();
    points.push(pointData);

    if (!pointsByDay.has(pointData.uniqueDay)) {
      pointsByDay.set(pointData.uniqueDay, [pointData]);
    } else {
      pointsByDay.get(pointData.uniqueDay).push(pointData);
    }
  }
  pointsByDay = new Map([...pointsByDay.entries()].sort());
}

function renderPoints() {
  pointsByDay.forEach((dayPoints) => {
    let day = new TripDay(dayPoints);
    tripPoints.appendChild(day.render());
  });

}

function toggleFilter(event) {
  let clickedFilter = event.target.closest(`.trip-filter__item`);
  if (clickedFilter) {
    points = [];
    pointsByDay.clear();
    tripPoints.innerHTML = ``;
    const randomAmount = Math.floor(Math.random() * 6) + 1;
    generatePointsData(randomAmount);
    renderPoints();

  }
}

function renderFilters() {
  let result = ``;
  result += renderFilter(`Everything`, 1);
  result += renderFilter(`Future`);
  result += renderFilter(`Past`);
  mainFilter.innerHTML = result;
}

const mainFilter = document.querySelector(`.trip-filter`);
mainFilter.addEventListener(`click`, toggleFilter);

// Temp render
generatePointsData(7);
renderPoints();
renderFilters();
