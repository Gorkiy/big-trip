const Provider = class {
  constructor({api, store}) {
    this._api = api;
    this._store = store;
  }

  updatePoint({id, data}) {
    return this._api.updatePoint({id, data})
      .then((point) => {
        this._store.setItem({key: point.id, item: point.toRAW()});
        return point;
      });
  }

  createPoint({point}) {
    return this._api.createPoint({point})
      .then((point) => {
        this._store.setItem({key: point.id, item: point.toRAW()});
        return point;
      });
  }

  deletePoint({id}) {
  return this._api.deletePoint({id})
    .then(() => {
      this._store.removeItem({key: id});
    });
}

  getPoints() {
    return this._api.getPoints()
      .then((points) => {
        points.map((it) => this._store.setItem({key: it.id, item: it.toRAW()}));
        return points;
      });
  }

  getDestinations() {
    return this._api.getDestinations()
      .then((destinations) => destinations);
  }

  getOffers() {
    return this._api.getOffers()
      .then((offers) => offers);
  }

};

export default Provider;
