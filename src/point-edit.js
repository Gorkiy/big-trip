import Component from './component.js';
import {types, getTime} from './make-trip-point.js';
import flatpickr from 'flatpickr';

class PointEdit extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    // this._destinations = [];
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
    this._date = data.date;
    this._dateDue = data.dateDue;
    this._onSubmit = null;
    this._onDelete = null;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onChangeType = this._onChangeType.bind(this);
  }

  _processForm(formData) {
    const entry = {
      city: ``,
      type: ``,
      time: this._time,
      price: ``,
    };

    const pointEditMapper = PointEdit.createMapper(entry);
    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (pointEditMapper[property]) {
        pointEditMapper[property](value);
      }
    }

    entry.typeIcon = types[entry.type];
    return entry;
  }

  static createMapper(target) {
    return {
      'destination': (value) => {
        target.city = value;
      },
      'travel-way': (value) => {
        target.type = value[0].toUpperCase() + value.slice(1);
      },
      'time': (value) => {
        const fromDue = value.split(` — `);
        target.time.from = fromDue[0];
        target.time.due = fromDue[1];
      },
      'price': (value) => {
        target.price = value;
      },
    };
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`.point > form`));
    const newData = this._processForm(formData);
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }
    this.update(newData);
  }

  _onDeleteButtonClick() {
    if (typeof this._onDelete === `function`) {
      this._onDelete();
    }
  }

  _onChangeType(evt) {
    const selection = evt.target.closest(`.travel-way__select-input`);
    if (selection) {
      let typeName = selection.value;
      this._type = typeName[0].toUpperCase() + typeName.slice(1);
      this._typeIcon = types[this._type];
      this._partialUpdate();
    }
  }

  _setTime() {
    const dateStart = this._element.querySelector(`.point__time input[name="date-start"]`);
    const dateEnd = this._element.querySelector(`.point__time input[name="date-end"]`);

    flatpickr(dateStart, {
      'defaultDate': [this._date],
      'enableTime': true,
      'time_24hr': true,
      'dateFormat': `H:i`,
      'onChange': (selectedDates) => {
        this._date = selectedDates[0];
        if (this._date && this._dateDue) {
          this._time = getTime(this._date, this._dateDue);
        }
      },
    });

    flatpickr(dateEnd, {
      'defaultDate': [this._dateDue],
      'enableTime': true,
      'time_24hr': true,
      'dateFormat': `H:i`,
      'onChange': (selectedDates) => {
        this._dateDue = selectedDates[0];
        if (this._date && this._dateDue) {
          this._time = getTime(this._date, this._dateDue);
        }
      },
    });
  }

  createListeners() {
    this._element.addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.travel-way__select`)
    .addEventListener(`click`, this._onChangeType);
    this._element.querySelector(`.point__button--delete`)
      .addEventListener(`click`, this._onDeleteButtonClick);
    this._setTime();
  }

  removeListeners() {
    this._element.removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.travel-way__select`)
    .addEventListener(`click`, this._onChangeType);
    this._element.querySelector(`.point__button--delete`)
      .removeEventListener(`click`, this._onDeleteButtonClick);
  }

  _partialUpdate() {
    this.removeListeners();
    const oldElement = this._element;
    this.render();
    oldElement.parentNode.replaceChild(this._element, oldElement);
  }

  update(data) {
    this._city = data.city;
    this._type = data.type;
    this._typeIcon = data.typeIcon;
    this._description = data.description;
    this._price = data.price;
    this._time = data.time;
    this._date = data.date;
    this._dateDue = data.dateDue;
  }

  _generateOfferId(offerTitle) {
    return offerTitle.toLowerCase().split(` `).join(`-`);
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  static setDestinations(data) {
    this._destinations = data;
  }

  get template() {
    return `
    <article class="point">
      <form action="" method="get">
        <header class="point__header">
          <label class="point__date">
            choose day
            <input class="point__input" type="text" placeholder="${this.date.month}" name="day">
          </label>

          <div class="travel-way">
            <label class="travel-way__label" for="travel-way__toggle">${this._typeIcon}</label>

            <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

            <div class="travel-way__select">
              <div class="travel-way__select-group">
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi" ${this._type === `Taxi` && `checked`}>
                <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus" ${this._type === `Bus` && `checked`}>
                <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train" ${this._type === `Train` && `checked`}>
                <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="flight" ${this._type === `Flight` && `checked`}>
                <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-ship" name="travel-way" value="ship" ${this._type === `Ship` && `checked`}>
                <label class="travel-way__select-label" for="travel-way-ship">🛳 ship</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-drive" name="travel-way" value="drive" ${this._type === `Drive` && `checked`}>
                <label class="travel-way__select-label" for="travel-way-drive">🚗 drive</label>
              </div>

              <div class="travel-way__select-group">
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="check-in" ${this._type === `Check-in` && `checked`}>
                <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travel-way" value="sightseeing" ${this._type === `Sightseeing` && `checked`}>
                <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
              </div>
            </div>
          </div>

          <div class="point__destination-wrap">
            <label class="point__destination-label" for="destination">${this._type} to</label>
            <input class="point__destination-input" list="destination-select" id="destination" value="${this._city}" name="destination">
            <datalist id="destination-select">
            ${ PointEdit._destinations.map((dest) =>
              `<option value="${dest.name}"></option>`
                ).join(``).trim()
              }
            </datalist>
          </div>

          <label class="point__time">
            choose time
            <input class="point__input" type="text" value="${this._time.from}" name="date-start" placeholder="19:00">
            <input class="point__input" type="text" value="${this._time.due}" name="date-end" placeholder="21:00">
          </label>

          <label class="point__price">
            write price
            <span class="point__price-currency">€</span>
            <input class="point__input" type="text" value="${this._price}" name="price">
          </label>

          <div class="point__buttons">
            <button class="point__button point__button--save" type="submit">Save</button>
            <button class="point__button point__button--delete" type="reset">Delete</button>
          </div>

          <div class="paint__favorite-wrap">
            <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite">
            <label class="point__favorite" for="favorite">favorite</label>
          </div>
        </header>

        <section class="point__details">
          <section class="point__offers">
            <h3 class="point__details-title">offers</h3>
            <div class="point__offers-wrap">
            ${ this._offers.map((offer) =>
              `<input class="point__offers-input visually-hidden" type="checkbox" id="${this._generateOfferId(offer.title)}" name="offer" value="${this._generateOfferId(offer.title)}" ${offer.accepted && `checked`}>
              <label for="${this._generateOfferId(offer.title)}" class="point__offers-label">
                <span class="point__offer-service">${offer.title || ``}</span> + €<span class="point__offer-price">${offer.price}</span>
              </label>`
                ).join(``).trim()
              }

          </section>
          <section class="point__destination">
            <h3 class="point__details-title">Destination</h3>
            <p class="point__destination-text">${this._description || ``}</p>
            <div class="point__destination-images">
            ${ this._picture.map((pic) =>
              `<img src="${pic.src}" alt="${pic.description}" class="point__destination-image">`
              ).join(``).trim()
            }
            </div>
          </section>
          <input type="hidden" class="point__total-price" name="total-price" value="">
        </section>
      </form>
    </article>`.trim();
  }
}

export default PointEdit;
