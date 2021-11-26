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
    const spinner = d.createElement("div");
    spinner.setAttribute('style', 'border: 4px solid rgba(0, 0, 0, .2); width: 60px; height: 60px; border-radius: 50%; border-left-color: #fff; animation: spin 1s linear infinite');
    weatherContainer.appendChild(spinner);


    let weatherRes = await fetch(url),
    weatherJson = await weatherRes.json();
    console.log(weatherJson);
    
    if(!weatherRes.ok) throw {status: weatherRes.status, statusText: weatherRes.statusText}
    
    let [weatherToday, ...weatherNextDays] = weatherJson.consolidated_weather;
    console.log(weatherToday);
    
    weatherContainer.innerHTML = `
      <img src="https://www.metaweather.com/static/img/weather/${
        weatherToday.weather_state_abbr
      }.svg" alt="weatherImg" class="aside__weather-image">
      <h1 class="aside__weather-temp">
        ${Math.trunc(weatherToday.the_temp)}<span class="aside__weather-span">ºC</span>
      </h1>
      <h2>${weatherToday.weather_state_name}</h2>
      <div class="aside__weather-container">
        <span>Today</span>
        <span>•</span>
        <span></span>
      </div>
    `;
  } catch (err) {
    const error = err.statusText || "An error occurred while loading the data";
    weatherContainer.innerHTML = `<p class="aside__weather-error">Error: ${err.status}, ${error}<p>`;
  }
}

d.addEventListener(
  "DOMContentLoaded",
  getWeather(DEFAULT_URL)
);
