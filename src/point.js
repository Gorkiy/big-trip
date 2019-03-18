import Component from './component.js';

class Point extends Component {
  constructor(data) {
    super();
    this._city = data.city;
    this._type = data.type;
    this._typeIcon = data.typeIcon;
    this._description = data.description;
    this._picture = data.picture;
    this._price = data.price;
    this._offers = data.offers;
    this._day = data.day;
    this._month = data.month;
    this._uniqueDay = data.uniqueDay;
    this._time = data.time;
    this._onEdit = null;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
  }

  createListeners() {
    this._element.addEventListener(`click`, this._onEditButtonClick);
  }

  removeListeners() {
    this._element.removeEventListener(`click`, this._onEditButtonClick);
  }

  _onEditButtonClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  update(data) {
    this._city = data.city;
    this._type = data.type;
    this._typeIcon = data.typeIcon;
    this._price = data.price;
    this._offers = data.offers;
    this._time = data.time;
  }

  get template() {
    return `
    <article class="trip-point">
      <i class="trip-icon">${this._typeIcon}</i>
      <h3 class="trip-point__title">${this._type} to ${this._city}</h3>
      <p class="trip-point__schedule">
        <span class="trip-point__timetable">${this._time.from}&nbsp;&mdash; ${this._time.due}</span>
        <span class="trip-point__duration">${this._time.duration}</span>
      </p>
      <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
      <ul class="trip-point__offers">
        ${ this._offers.map((offer) =>
    `<li>
            <button class="trip-point__offer">${offer}</button>
          </li>`
  ).join(``).trim()
}
      </ul>
    </article>`.trim();
  }
}

export default Point;
