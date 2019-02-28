import {renderFilter} from './make-filter.js';
import {renderTripPoint, tripPoint} from './make-trip-point.js';

let pointsByDay = new Map();

const tripPoints = document.querySelector(`.trip-points`);
let points = [];

function renderTripPoints(amount) {
  let result = ``;
  for (let i = 0; i < amount; i++) {
    let point = tripPoint();
    points.push(point);

    if (!pointsByDay.has(point.uniqueDay)) {
      pointsByDay.set(point.uniqueDay, [point]);
    } else {
      let updateValues = pointsByDay.get(point.uniqueDay);
      updateValues.push(point);
      pointsByDay.set(point.uniqueDay, updateValues);
    }
  }

  pointsByDay.forEach((day) => {
    let point = day[0];
    result += `
    <section class="trip-day">
      <article class="trip-day__info">
        <span class="trip-day__caption">Day</span>
        <p class="trip-day__number">${point.day}</p>
        <h2 class="trip-day__title">${point.month}</h2>
      </article>
      <div class="trip-day__items">
        ${day.map((curPoint) => renderTripPoint(curPoint)).join(``)}
      </div>
    </section>`;
  });
  tripPoints.innerHTML = result;
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
