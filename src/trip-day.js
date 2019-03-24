import Point from './point.js';
import PointEdit from './point-edit.js';

class TripDay {
  constructor(data) {
    this._pointsData = data;
    this._points = [];
    this._day = data[0].day;
    this._month = data[0].month;
    this._uniqueDay = data[0].uniqueDay;
    this._dayElements = ``;
    this._recentlyDeletedId = null;
    this._element = null;
    this._onDelete = null;

  }

  _createElement(template) {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = template;
    return newElement.firstChild;
  }

  render() {
    this._element = this._createElement(this.template);
    this._dayElements = this._element.querySelector(`.trip-day__items`);
    this.build();

    this._points.map((curPoint) => {
      this._dayElements.appendChild(curPoint.element);
    });
    return this._element;
  }

  build() {
    this._pointsData.forEach((pointData, i) => {
      let point = new Point(pointData);
      let pointEdit = new PointEdit(pointData);
      point.render();
      pointEdit.render();

      this._points.push(point);

      point.onEdit = () => {
        pointEdit.render();
        this._dayElements.replaceChild(pointEdit.element, point.element);
        point.unrender();
      };

      pointEdit.onSubmit = (newObject) => {
        pointData.city = newObject.city;
        pointData.type = newObject.type;
        pointData.typeIcon = newObject.typeIcon;
        pointData.description = newObject.description;
        pointData.price = newObject.price;
        pointData.time = newObject.time;

        point.update(pointData);
        point.render();
        this._dayElements.replaceChild(point.element, pointEdit.element);
        pointEdit.unrender();
      };

      pointEdit.onDelete = () => {
        this._recentlyDeletedId = this._pointsData[i].id;
        this._points[i] = null;
        // this._pointsData[i] = null;
        pointEdit.unrender();
        if (this._points.every((element) => element === null)) {
          this._element.remove();
        }
        this._onDelete();
      };
    });
  }

  unrender() {
    this._element = null;
  }

  set onDelete(fn) {
    this._onDelete = fn;
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
