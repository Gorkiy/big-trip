import ModelPoint from './model-point.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};


const API = class {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: `points`})
      .then(toJSON)
      .then(ModelPoint.parsePoints)
      .catch((err) => {
        console.log(`get points error ${err}`)
      });
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(toJSON)
      // .then(ModelPoint.parsePoints)
      .catch((err) => {
        console.log(`get points error ${err}`)
      });
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(toJSON)
      // .then(ModelPoint.parsePoints)
      .catch((err) => {
        console.log(`get points error ${err}`)
      });
  }

  createPoint({point}) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelPoint.parsePoint);
  }

  updatePoints({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelPoint.parsePoint);
  }

  deletePoint({id}) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        console.error(`fetch error: ${err}`);
        throw err;
      });
  }
};

export default API;
