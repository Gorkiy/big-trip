import Component from './component.js';

class Filter extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._id = data.id;
    this._state.isChecked = data.isChecked;
    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  static makeFilterData(title, id, isChecked = false) {
    return {
      title,
      id,
      isChecked
    };
  }

  createListeners() {
    this._element.querySelector(`.trip-filter__item`)
      .addEventListener(`click`, this._onFilterClick);
  }

  removeListeners() {
    this._element.querySelector(`.trip-filter__item`)
      .removeEventListener(`click`, this._onFilterClick);
  }

  _onFilterClick() {
    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  createElement(template) { // Костыль. Переопределяем, чтобы инпут с лейблом были в одном родителе
    const newElement = document.createElement(`div`);
    newElement.classList.add(`trip-filter__container`);
    newElement.innerHTML = template;
    return newElement;
  }

  get template() {
    return `
    <input type="radio" id="${this._id}" name="filter" value="${this._title}" ${ this._state.isChecked && `checked` }>
    <label class="trip-filter__item" for="${this._id}">${this._title}</label>`.trim();
  }
}

export default Filter;
