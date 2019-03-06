import {renderFilter} from './make-filter.js';
import {makeTripPoint} from './make-trip-point.js';
import Point from './point.js';
import PointEdit from './point-edit.js';
import TripDay from './trip-day.js';

const tripPoints = document.querySelector(`.trip-points`);
let pointsByDay = new Map();
let points = [];

function renderTripPoints(amount) {
  for (let i = 0; i < amount; i++) {
    let point = new Point(makeTripPoint());
    let pointEdit = new PointEdit(makeTripPoint());
    points.push(point);
    pointEdit.render();

    // tripPoints.appendChild(pointEdit.render());
    point.onEdit = () => {
      pointEdit.render();
      tripPoints.replaceChild(pointEdit.element, point.element);
      point.unrender();
    };

    pointEdit.onSubmit = () => {
      point.render();
      tripPoints.replaceChild(point.element, pointEdit.element);
      pointEdit.unrender();
    };


    if (!pointsByDay.has(point.date.uniqueDay)) {
      pointsByDay.set(point.date.uniqueDay, [point]);
    } else {
      pointsByDay.get(point.date.uniqueDay).push(point);
    }
  }

  const pointsByDaySorted = new Map([...pointsByDay.entries()].sort());
  pointsByDaySorted.forEach((dayPoints) => {
    let day = new TripDay(dayPoints);
    // Весь рендер теперь делает эта строчка
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
    renderTripPoints(randomAmount);
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
renderTripPoints(7);
renderFilters();
