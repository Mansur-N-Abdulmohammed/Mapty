'use strict';
// let map;
// let zooom;
// let marker;

// function initMap() {
//   map = new google.maps.Map(document.getElementById('map'), {
//     center: { lat: lat, lng: lng },
//     zoom: zooom,
//   });

//   map.addListener('click', function (event) {
//     const clickedLocation = event.latLng;

//     if (marker) {
//       marker.setPosition(clickedLocation);
//     } else {
//       marker = new google.maps.Marker({
//         position: clickedLocation,
//         map: map,
//       });
//     }
//   });
// }

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');

const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let measure;
let type;
let map;
let inputs;

const showTheForm = function () {
  // containerWorkouts.insertAdjacentElement('afterbegin', form);
  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      '';
  inputType.selectedIndex = 0;
  form.classList.remove('hidden');
  inputDistance.focus();
};

const hideTheForm = function () {
  form.classList.add('hidden');
};

const setMarker = function () {
  const { lat, lng } = measure;
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup('running-popup', {
      autoClose: false,
      closeOnClick: false,
      className: `${inputType.value.toLowerCase()}`,
      maxWidth: 500,
      minWidth: 200,
    })
    .openPopup();
};

const insertWorkout = function () {
  // to get the time
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString(navigator.language, { month: 'long' });

  // to insert the html workout
  console.log(type);
  if (type === `running`) {
    containerWorkouts.insertAdjacentHTML(
      'afterbegin',
      `
      <li class="workout workout--running" data-id="1234567890">
      <h2 class="workout__title">Running on ${month} ${day}</h2>
      <div class="workout__details">
      <span class="workout__icon">🏃‍♂️</span>
      <span class="workout__value">${+inputDistance.value}</span>
      <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${+inputDuration.value}</span>
      <span class="workout__unit">min</span>
      </div>
      <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${+inputDistance.value}</span>
      <span class="workout__unit">min/km</span>
      </div>
      <div class="workout__details">
      <span class="workout__icon">🦶🏼</span>
      <span class="workout__value">${+inputCadence.value}</span>
      <span class="workout__unit">spm</span>
      </div>
      </li>`,
    );
  } else {
    containerWorkouts.insertAdjacentHTML(
      'afterbegin',
      ` <li class="workout workout--cycling" data-id="1234567891">
        <h2 class="workout__title">Cycling on April 5</h2>
        <div class="workout__details">
          <span class="workout__icon">🚴‍♀️</span>
          <span class="workout__value">${+inputDistance.value}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${+inputDuration.value}</span>
          <span class="workout__unit">min</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${+inputDistance.value / 3.6}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${+inputElevation.value}</span>
          <span class="workout__unit">m</span>
        </div>
      </li> `,
    );
  }
  setMarker();
  hideTheForm();
};

navigator.geolocation.getCurrentPosition(
  function (e) {
    const { longitude, latitude } = e.coords;
    map = L.map('map').setView([latitude, longitude], 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    map.on('click', function (e) {
      measure = e.latlng;
      showTheForm();
    });
  },
  function () {
    alert(`we couldnt get your current position`);
  },
);

form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (inputType.value.toLowerCase() === 'running') {
    // console.log(`its Running`);
    inputs = [inputDistance.value, inputDuration.value, inputCadence.value];
    type = `running`;
  } else {
    // console.log(`its Cycling`);
    inputs = [inputDistance.value, inputDuration.value, inputElevation.value];
    type = `cycling`;
  }
  const filled = inputs.every(e => {
    return e.trim() !== '' && Number.isFinite(+e);
  });

  if (filled) {
    insertWorkout();
  } else {
    console.log('Please enter numbers in all fields');
  }
});

inputType.addEventListener('change', function (e) {
  e.preventDefault();
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
});
