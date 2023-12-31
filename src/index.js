function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `      <div class="card-group w-80 p-3 text-center grid gap-0 column-gap-3">
`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `  <div class="card object-fit-sm-contain border rounded">
          <div class="card-body">
            <h5 class="card-title">${formatDay(forecastDay.dt)}</h5>
          <img class="fs-1 text-center" id="icon" src="https://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"></img>
          </div>
          <div class="card-footer">
            <small class="text-muted" id="forecastTemperature" >${Math.round(
              forecastDay.temp.max
            )}º</small>
          </div>
        </div> `;

      let forecastCelsiusTemp = forecastDay.temp.max;
      let fahrenheitLink = document.querySelector("#fahrenheit-link");
      fahrenheitLink.addEventListener("click", convertForecastToFahrenheit);

      let celsiusLink = document.querySelector("#celsius-link");
      celsiusLink.addEventListener("click", convertForecastToCelsius);

      function convertForecastToFahrenheit(event) {
        event.preventDefault();
        let forecastTemperatureElement = document.querySelector(
          "#forecastTemperature"
        );
        let forecastFahrenheitTemperature = (forecastCelsiusTemp * 9) / 5 + 32;
        forecastTemperatureElement.innerHTML = Math.round(
          forecastFahrenheitTemperature
        );
      }

      function convertForecastToCelsius(event) {
        event.preventDefault();
        let forecastTemperatureElement = document.querySelector(
          "#forecastTemperature"
        );
        forecastTemperatureElement.innerHTML = Math.round(forecastCelsiusTemp);
      }
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coords) {
  let apiKey = "cabdbda40038ba7d1165b953b1c7bd6c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeatherCondition(response) {
  let temperatureElement = document.querySelector("#temperature");
  let celsiusTemperature = response.data.main.temp;

  document.querySelector("#city").innerHTML = response.data.name;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#daytime").innerHTML = formatDate(
    response.data.dt * 1000
  );
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );

  let fahrenheitLink = document.querySelector("#fahrenheit-link");
  fahrenheitLink.addEventListener("click", convertToFahrenheit);

  let celsiusLink = document.querySelector("#celsius-link");
  celsiusLink.addEventListener("click", convertToCelsius);

  function convertToFahrenheit(event) {
    event.preventDefault();
    let temperatureElement = document.querySelector("#temperature");
    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");
    let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
    temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  }

  function convertToCelsius(event) {
    event.preventDefault();
    celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");
    let temperatureElement = document.querySelector("#temperature");
    temperatureElement.innerHTML = Math.round(celsiusTemperature);
  }
  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "cabdbda40038ba7d1165b953b1c7bd6c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#input-city").value;
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "cabdbda40038ba7d1165b953b1c7bd6c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let searchForm = document.querySelector("#formCity");
searchForm.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#my-location");
currentLocationButton.addEventListener("click", getCurrentLocation);

searchCity("Toronto");
