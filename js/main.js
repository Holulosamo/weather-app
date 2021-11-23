const d = document,
  locationBtn = d.querySelector(".aside__container-location"),
  weatherContainer = d.querySelector(".aside__weather"),
  weatherGrid = d.querySelector(".article");

let query;
const API_LINK = "https://www.metaweather.com/";
const SEARCH_URL = `${API_LINK}api/location/search/?query=${query}`, 
      DEFAULT_URL = `${API_LINK}api/location/44418/`;

async function getWeather(url) {
  try {
    let weatherRes = await fetch(url),
      weatherJson = await weatherRes.json();
    console.log(weatherJson);

    if(!weatherRes.ok) throw {status: weatherRes.status, statusText: weatherRes.statusText}

    let [weather0, ...weatherRest] = weatherJson.consolidated_weather;
    console.log(weather0);

    weatherContainer.innerHTML = `
      <img src="https://www.metaweather.com/static/img/weather/${weather0.weather_state_abbr}.svg" alt="weatherImg" class="aside__weather-image">
      
    `;
  } catch (error) {
    console.log(error);
  }
}

d.addEventListener(
  "DOMContentLoaded",
  getWeather(DEFAULT_URL)
);
