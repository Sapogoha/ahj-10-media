export default class Card {
  constructor(coordinates, text) {
    this.coordinates = coordinates;
    this.text = text;
    this.list = document.querySelector('.timeline__list-of-events');
    this.firstEvent = document.querySelector('.timeline__event');
  }

  add() {
    const eventEl = document.createElement('li');
    const body = document.createElement('div');
    const text = document.createElement('div');
    const time = document.createElement('div');
    const coordinates = document.createElement('div');
    const now = new Date();
    const nowDate = { year: '2-digit', month: '2-digit', day: '2-digit' };
    const nowTime = { hour: '2-digit', minute: '2-digit' };

    eventEl.classList.add('timeline__event');
    body.classList.add('event__body');
    text.classList.add('event__text');
    time.classList.add('event__time');
    coordinates.classList.add('coordinates');

    text.textContent = this.text;
    time.textContent = `${now.toLocaleString(
      'ru-RU',
      nowDate,
    )} ${now.toLocaleString('ru-RU', nowTime)} `;
    coordinates.textContent = this.coordinates;

    body.append(text, time);

    eventEl.append(body, coordinates);

    if (this.firstEvent) {
      this.firstEvent.insertAdjacentElement('beforeBegin', eventEl);
    } else {
      this.list.appendChild(eventEl);
    }
  }
}
