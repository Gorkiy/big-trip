const allTypes = {
  'taxi': {
    name: `Taxi`,
    icon: `🚕`
  },
  'bus': {
    name: `Bus`,
    icon: `🚌`
  },
  'train': {
    name: `Train`,
    icon: `🚂`
  },
  'ship': {
    name: `Ship`,
    icon: `🛳`
  },
  'transport': {
    name: `Transport`,
    icon: `🚊`
  },
  'drive': {
    name: `Drive`,
    icon: `🚗`
  },
  'flight': {
    name: `Flight`,
    icon: `✈️`
  },
  'check-in': {
    name: `Check-in`,
    icon: `🏨`
  },
  'sightseeing': {
    name: `Sightseeing`,
    icon: `🏛`
  },
  'restaurant': {
    name: `Restaurant`,
    icon: `🍴`
  },
};

class ModelPoint {
  constructor(data) {
    this.id = data[`id`];
    this.city = data[`destination`][`name`];
    this.type = allTypes[data[`type`]].name;
    this.typeIcon = allTypes[data[`type`]].icon;
    this.description = data[`destination`][`description`];
    this.picture = data[`destination`][`pictures`];
    this.price = data[`base_price`];
    this.offers = data[`offers`];
    this.day = this._formatNewDate(data[`date_from`]).tripDay;
    this.month = this._formatNewDate(data[`date_from`]).tripMonth + ` ` + this._formatNewDate(data[`date_from`]).tripYear;
    this.uniqueDay = this._formatNewDate(data[`date_from`]).uniqueDay;
    this.date = new Date(data[`date_from`]);
    this.dateDue = new Date(data[`date_to`]);
    this.time = this._getTime(this.date, this.dateDue);
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRAW() {
    // return {
    //   'id': this.id,
    //   'title': this.title,
    //   'due_date': this.dueDate,
    //   'tags': [...this.tags.values()],
    //   'picture': this.picture,
    //   'repeating_days': this.repeatingDays,
    //   'color': this.color,
    //   'is_favorite': this.isFavorite,
    //   'is_done': this.isDone,
    // };
  }

  _formatNewDate(ms) {
    let date = new Date(ms);
    // console.log(date);
    const monthNames = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `June`,
      `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

    return {
      tripYear: (`` + date.getFullYear()).substr(-2),
      tripMonth: monthNames[date.getMonth()],
      tripDay: date.getDate().toString(),
      uniqueDay: `` + date.getDate() + (date.getMonth() + 1) + date.getFullYear(),
    };
  }

  _getTime(date, dateDue) {
    const diffMs = dateDue - date;
    const diffHrs = Math.floor(diffMs / 3600000);
    // const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (hours < 10) {
      hours = `0` + hours;
    }
    if (minutes < 10) {
      minutes = `0` + minutes;
    }

    let dueHours = dateDue.getHours();
    let dueMinutes = dateDue.getMinutes();
    if (dueHours < 10) {
      dueHours = `0` + dueHours;
    }
    if (dueMinutes < 10) {
      dueMinutes += `0`;
    }

    return {
      from: hours + `:` + minutes,
      due: dueHours + `:` + dueMinutes,
      duration: diffHrs + `H ` + diffMins
    };
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }
}

export default ModelPoint;
