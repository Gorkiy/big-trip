import {renderFilter} from './make-filter.js';
import {renderTripPoint} from './make-trip-point.js';

const dayPoints = document.querySelector(`.trip-day__items`);

function renderTripPoints(amount) {
  let result = ``;
  const tripPoint = renderTripPoint(`taxi`, `Airport`, `10:00`, `11:00`, `1H 30M`, 20, [
    `Order UBER +&euro;&nbsp;20`,
    `Upgrade to business +&euro;&nbsp;20`
  ]);
  for (let i = 0; i < amount; i++) {
    result += tripPoint;
  }
  dayPoints.innerHTML = result;
}

function toggleFilter(event) {
  let clickedFilter = event.target.closest(`.trip-filter__item`);
  if (clickedFilter) {
    dayPoints.innerHTML = ``;
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
