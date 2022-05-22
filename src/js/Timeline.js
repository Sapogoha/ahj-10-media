import Card from './Card';

export default class Timeline {
  constructor() {
    this.form = document.querySelector('.timeline__form');
    this.header = document.querySelector('.timeline__header');
    this.emptyEl = document.querySelector('.timeline__empty');
    this.list = document.querySelector('.timeline__list-of-events');
    this.shareButton = document.querySelector('.timeline__share-button');
    this.textarea = document.querySelector('.timeline__add-post');
    this.line = document.querySelector('.timeline__line');
    this.geolocation = document.querySelector('.geolocation');

    this.showLocationEl = this.showLocationEl.bind(this);
    this.submit = this.submit.bind(this);
    this.cancel = this.cancel.bind(this);
    this.replace = this.replace.bind(this);
    this.checkValidity = this.checkValidity.bind(this);
  }

  init() {
    this.shareButton.addEventListener('click', this.showLocationEl);
  }

  replace() {
    if (!this.emptyEl.style.display) {
      this.emptyEl.style.display = 'none';
      this.line.style.display = 'flex';
    }
  }

  showLocationEl(event) {
    event.preventDefault();
    if (this.textarea.value.trim() === '') {
      this.showError(this.form, 'Please type at least one symbol');
    } else {
      this.text = this.textarea.value;
      this.findCoordinates();
    }
  }

  showError(parent, text) {
    const errorEl = document.createElement('div');
    const errorInput = document.createElement('span');

    errorEl.classList.add('error');
    errorInput.textContent = text;
    errorEl.appendChild(errorInput);

    if (!parent.querySelector('.error')) {
      parent.appendChild(errorEl);
    }
    setTimeout(() => {
      parent.removeChild(errorEl);
    }, 2500);
  }

  findCoordinates() {
    this.checkCoords()
      .then((coords) => {
        this.textarea.value = '';
        this.replace();
        new Card(`[${coords.latitude}, ${coords.longitude}]`, this.text).add();
      })
      .catch(() => {
        this.askCoords();
      });
  }

  checkCoords() {
    if (navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({
              latitude,
              longitude,
            });
          },
          (error) => {
            reject(error);
          },
        );
      });
    }

    return new Promise((reject) => reject(new Error('This device does not support geolocation API')));
  }

  askCoords() {
    this.geolocation.classList.remove('hidden');
    this.submitButton = document.querySelector('.geolocation__submit-button');
    this.cancelButton = document.querySelector('.geolocation__cancel-button');
    this.geolocationForm = document.querySelector('.geolocation__form');
    this.coordinates = document.querySelector('.geolocation__coordinates');
    this.submitButton.addEventListener('click', this.submit);
    this.cancelButton.addEventListener('click', this.cancel);
  }

  submit(event) {
    event.preventDefault();
    this.coords = this.coordinates.value;
    if (this.checkValidity(this.coords)) {
      this.coordinates.value = '';
      this.textarea.value = '';
      this.replace();
      this.geolocation.classList.add('hidden');
      this.formatCoordinates(this.coords);
      new Card(
        `[${this.formattedCoords.latitude}, ${this.formattedCoords.longitude}]`,
        this.text,
      ).add();
    } else if (!this.checkValidity(this.coords)) {
      this.showError(
        this.geolocationForm,
        'Please follow the pattern - 00.00000, 00.00000',
      );
      this.coordinates.value = '';
    }
  }

  cancel() {
    this.coordinates.value = '';
    this.geolocation.classList.add('hidden');
  }

  checkValidity(value) {
    const reg = /^\[?-?\d{1,2}\.\d{4,5}, ?-?\d{1,2}.\d{4,5}]?/gm;
    return reg.test(String(value));
  }

  formatCoordinates(value) {
    const reg = /^\[|\]$/gm;
    const coords = String(value)
      .replace(reg, ' ')
      .split(',')
      .map((item) => item.trim());
    this.formattedCoords = {
      latitude: coords[0],
      longitude: coords[1],
    };
  }
}
