export function renderFilter(filterName, isChecked = false) {
  filterName = filterName.toLowerCase();
  const filterState = isChecked ? `checked` : ``;

  return `
  <input type="radio" id="filter-${filterName}" name="filter" value="${filterName}" ${filterState}>
  <label class="trip-filter__item" for="filter-${filterName}">${filterName}</label>`;
}
