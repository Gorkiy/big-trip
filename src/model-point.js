import {getTime, formatNewDate} from './make-trip-point';

class ModelPoint {
  constructor(data) {
    this.id = data[`id`];
    this.city = data[`destination`][`name`];
    this.type = ModelPoint.getTypeData(data[`type`]).name;
    this.typeIcon = ModelPoint.getTypeData(data[`type`]).icon;
    this.description = data[`destination`][`description`];
    this.picture = data[`destination`][`pictures`];
    this.price = data[`base_price`];
    this.offers = data[`offers`];
    this.day = formatNewDate(data[`date_from`]).tripDay;
    this.month = formatNewDate(data[`date_from`]).tripMonth + ` ` + formatNewDate(data[`date_from`]).tripYear;
    this.uniqueDay = formatNewDate(data[`date_from`]).uniqueDay;
    this.date = new Date(data[`date_from`]);
    this.dateDue = new Date(data[`date_to`]);
    this.time = getTime(this.date, this.dateDue);
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRAW() {
    return {
      'id': this.id,
      'date_from': this.date.getTime(),
      'date_to': this.dateDue.getTime(),
      'destination': {
        name: this.city,
        description: this.description,
        pictures: this.picture
      },
      'base_price': this.price,
      'is_favorite': this.isFavorite,
      'offers': this.offers,
      'type': this.type.toLowerCase(),
    };
  }

  _convertOffers(offers) {
    return offers.map((offer) => {
      return {
        name: offer.title,
        price: offer.price,
      };
    });
  }

  static getTypeData(type) {
    switch (type) {
      case `taxi`: return {
        name: `Taxi`,
        icon: `🚕`
      };
      case `bus`: return {
        name: `Bus`,
        icon: `🚌`
      };
      case `train`: return {
        name: `Train`,
        icon: `🚂`
      };
      case `ship`: return {
        name: `Ship`,
        icon: `🛳`
      };
      case `transport`: return {
        name: `Transport`,
        icon: `🚊`
      };
      case `drive`: return {
        name: `Drive`,
        icon: `🚗`
      };
      case `flight`: return {
        name: `Flight`,
        icon: `✈️`
      };
      case `check-in`: return {
        name: `Check-in`,
        icon: `🏨`
      };
      case `sightseeing`: return {
        name: `Sightseeing`,
        icon: `🏛`
      };
      case `restaurant`: return {
        name: `Restaurant`,
        icon: `🍴`
      };
      default: return `no valid type`;
    }
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }
}

export default ModelPoint;
