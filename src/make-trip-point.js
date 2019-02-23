const types = {
  taxi: `🚕`,
  plane: `✈️`,
  car:`🚗`,
  hotel:`🏨`
}

export function renderTripPoint(type, destination, start, end, duration, price, offers) {
  const typeIcon = types[type];

  return `
  <article class="trip-point">
    <i class="trip-icon">${typeIcon}</i>
    <h3 class="trip-point__title">${type} to ${destination}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${start}&nbsp;&mdash; ${end}</span>
      <span class="trip-point__duration">${duration}</span>
    </p>
    <p class="trip-point__price">&euro;&nbsp;${price}</p>
    <ul class="trip-point__offers">
      ${ offers.map(offer =>
        `<li>
          <button class="trip-point__offer">${offer}</button>
        </li>`
      ).join(``)
      }
    </ul>
  </article>`;
}
