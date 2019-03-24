import Component from './component.js';
import {types, getTime} from './make-trip-point.js';
import flatpickr from 'flatpickr';

class PointEdit extends Component {
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
    // console.log([...formData.entries()]);
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
    flatpickr(this._element.querySelector(`.point__time > .point__input`), {
      mode: `range`,
      // dateFormat: `d-m`,
      defaultDate: [this._date, this._dateDue],
      enableTime: true,
      dateFormat: `H:i`,
      locale: {rangeSeparator: ` — `},
      onChange(selectedDates) {
        this._date = selectedDates[0];
        this._dateDue = selectedDates[1];
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

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
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
              <option value="airport"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
              <option value="hotel"></option>
            </datalist>
          </div>

          <label class="point__time">
            choose time
            <input class="point__input" type="text" value="" name="time" placeholder="00:00 — 00:00">
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
              <input class="point__offers-input visually-hidden" type="checkbox" id="add-luggage" name="offer" value="add-luggage">
              <label for="add-luggage" class="point__offers-label">
                <span class="point__offer-service">Add luggage</span> + €<span class="point__offer-price">30</span>
              </label>

              <input class="point__offers-input visually-hidden" type="checkbox" id="switch-to-comfort-class" name="offer" value="switch-to-comfort-class">
              <label for="switch-to-comfort-class" class="point__offers-label">
                <span class="point__offer-service">Switch to comfort class</span> + €<span class="point__offer-price">100</span>
              </label>

              <input class="point__offers-input visually-hidden" type="checkbox" id="add-meal" name="offer" value="add-meal">
              <label for="add-meal" class="point__offers-label">
                <span class="point__offer-service">Add meal </span> + €<span class="point__offer-price">15</span>
              </label>

              <input class="point__offers-input visually-hidden" type="checkbox" id="choose-seats" name="offer" value="choose-seats">
              <label for="choose-seats" class="point__offers-label">
                <span class="point__offer-service">Choose seats</span> + €<span class="point__offer-price">5</span>
              </label>
            </div>

          </section>
          <section class="point__destination">
            <h3 class="point__details-title">Destination</h3>
            <p class="point__destination-text">Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.</p>
            <div class="point__destination-images">
              <img src="http://picsum.photos/330/140?r=123" alt="picture from place" class="point__destination-image">
              <img src="http://picsum.photos/300/200?r=1234" alt="picture from place" class="point__destination-image">
              <img src="http://picsum.photos/300/100?r=12345" alt="picture from place" class="point__destination-image">
              <img src="http://picsum.photos/200/300?r=123456" alt="picture from place" class="point__destination-image">
              <img src="http://picsum.photos/100/300?r=1234567" alt="picture from place" class="point__destination-image">
            </div>
          </section>
          <input type="hidden" class="point__total-price" name="total-price" value="">
        </section>
      </form>
    </article>`.trim();
  }
}

export default PointEdit;
