const d = document,
  locationBtn = d.querySelector(".aside__container-location"),
  weatherContainer = d.querySelector(".aside__weather"),
  weatherGrid = d.querySelector(".article");

let query;
const API_LINK = "https://api.openweathermap.org/",
  DEFAULT_CURRENT_WEATHER = `${API_LINK}data/2.5/weather?q=London&appid=47215c95b17bd7ea41ea062f704ea884`,
  DEFAULT_FORECAST = `${API_LINK}data/2.5/forecast?q=London&appid=47215c95b17bd7ea41ea062f704ea884`;

async function getWeather(currentWeatherURL, forecastURL) {
  try {
    const spinner = d.createElement("div");
    spinner.setAttribute('style', 'border: 4px solid rgba(0, 0, 0, .2); width: 60px; height: 60px; border-radius: 50%; border-left-color: #fff; animation: spin 1s linear infinite');
    weatherContainer.appendChild(spinner);

    let currWeatherFetch = await fetch(currentWeatherURL),
        forecastFetch = await fetch(forecastURL),
        [currWeatherRes, forecastRes] = await Promise.all([currWeatherFetch, forecastFetch]),
        currWeatherJson = await currWeatherRes.json(),
        forecastJson = await forecastRes.json();
        
    console.log(currWeatherJson);

    const forecastFormatted = forecastJson.list.filter(forecast => forecast.dt_txt.includes("18:00:00"));

    console.log(forecastFormatted)
    
    
  } catch (err) {
    const error = err.statusText || "An error occurred while loading the data";
    weatherContainer.innerHTML = `<p class="aside__weather-error">Error: ${err.status}, ${error}<p>`;
  }
}

d.addEventListener("DOMContentLoaded", getWeather(DEFAULT_CURRENT_WEATHER, DEFAULT_FORECAST));
