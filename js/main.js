const d = document,
  locationBtn = d.querySelector(".aside__container-location"),
  weatherContainer = d.querySelector(".aside__weather"),
  weatherGrid = d.querySelector(".article");

let query;
const API_LINK = "https://api.openweathermap.org/",
  DEFAULT_CURRENT_WEATHER = `${API_LINK}data/2.5/weather?q=London&units=metric&appid=47215c95b17bd7ea41ea062f704ea884`,
  DEFAULT_FORECAST = `${API_LINK}data/2.5/forecast?q=London&units=metric&appid=47215c95b17bd7ea41ea062f704ea884`;

const getDays = (day) => {
  const daysOfWeek = ['Sun','Mon','Tues','Wed','Thur','Fri','Sat'];
  return currentDay = daysOfWeek[day.getDay()];
}

const getMonth = (month) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return currentMonth = months[month.getMonth()];
}

async function getWeather(currentWeatherURL, forecastURL) {
    const loaderSpinner = d.createElement("div");
    loaderSpinner.setAttribute('style', 'border: 4px solid rgba(0, 0, 0, .2); width: 60px; height: 60px; border-radius: 50%; border-left-color: #fff; animation: spin 1s linear infinite');
    weatherContainer.appendChild(loaderSpinner);
    try {
      
      let currWeatherFetch = await fetch(currentWeatherURL),
        forecastFetch = await fetch(forecastURL),
        [currWeatherRes, forecastRes] = await Promise.all([currWeatherFetch, forecastFetch]),
        currWeatherJson = await currWeatherRes.json(),
        forecastJson = await forecastRes.json();
        
        const forecastFormatted = forecastJson.list.filter(forecast => forecast.dt_txt.includes("00:00:00")),
        currentDate = new Date(currWeatherJson.dt * 1000),
        nextDaysDate = forecastFormatted.map(date => new Date(date.dt_txt)),
        currentDay = getDays(currentDate),
        currentMonth = getMonth(currentDate);
        
        console.log(currWeatherJson, forecastFormatted);
        
        weatherContainer.removeChild(loaderSpinner);
        weatherContainer.innerHTML += `
        <div class="aside__weather-container-img">
        <img src="http://openweathermap.org/img/wn/${currWeatherJson.weather[0].icon}@2x.png" class="aside__weather-img"/>
        </div>
        <h2 class="aside__weather-temp">${Math.round(currWeatherJson.main.temp)}<span class="aside__weather-metric">ºC</span></h2>
        <h3 class="aside__weather-main">${currWeatherJson.weather[0].main}</h3>
        <p class="aside__weather-date"><span>Today</span><span>•</span><span>${currentDay}, ${currentDate.getDate()} ${currentMonth}</span></p>
        <div class="aside__weather-location"><span class="material-icons">location_on</span> ${currWeatherJson.name}</div>
        `;
        
      } catch (err) {
        const error = err.statusText || "An error occurred while loading the data";
        weatherContainer.removeChild(loaderSpinner);
        weatherContainer.innerHTML += `<p class="aside__weather-error">Error: ${err.status}, ${error}<p>`;
    }
}

d.addEventListener("DOMContentLoaded", getWeather(DEFAULT_CURRENT_WEATHER, DEFAULT_FORECAST));
