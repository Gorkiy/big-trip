class TripDay {
  constructor(data) {
    this._points = data;
    this._day = data[0].date.day;
    this._month = data[0].date.month;
    this._uniqueDay = data[0].date.uniqueDay;
    this._time = data[0].date.time;
    this._element = null;
  }

  _createElement(template) {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = template;
    return newElement.firstChild;
  }

  render() {
    this._element = this._createElement(this.template);
    const dayItems = this._element.querySelector(`.trip-day__items`);
    this._points.map((curPoint) => {
      curPoint.render();
      dayItems.appendChild(curPoint.element);
    });
    return this._element;
  }

  unrender() {
    this._element = null;
  }

  get element() {
    return this._element;
  }

  get template() {
    return `
    <section class="trip-day">
      <article class="trip-day__info">
        <span class="trip-day__caption">Day</span>
        <p class="trip-day__number">${this._day}</p>
        <h2 class="trip-day__title">${this._month}</h2>
      </article>
      <div class="trip-day__items">
      </div>
    </section>`.trim();
  }
}

export default TripDay;
