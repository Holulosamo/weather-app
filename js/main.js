const d = document,
  locationBtn = d.querySelector(".aside__container-location"),
  weatherContainer = d.querySelector(".aside__weather"),
  template = d.getElementById('weather-template').content,
  fragment = d.createDocumentFragment(),
  weatherGrid = d.querySelector(".section");

console.log(template)

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

const insertHTML = (response, day, date, month) => {
  template.querySelector(".aside__weather-img").src = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
  template.querySelector(".aside__weather-img").alt = response.weather[0].description; 
  template.querySelector(".aside__weather-temp").innerHTML = `${Math.round(response.main.temp)}<span class="aside__weather-metric">ºC</span>`;
  template.querySelector(".aside__weather-main").innerHTML = response.weather[0].main;
  template.querySelector(".aside__weather-date").innerHTML = `<span>Today</span><span>•</span><span>${day}, ${date.getDate()} ${month}</span>`; 
  template.querySelector(".aside__weather-location").innerHTML = `<span class="material-icons">location_on</span> ${response.name}`;

  return clone = d.importNode(template, true);
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
        dateTimes = forecastFormatted.map(date => new Date(date.dt_txt)),
        currentDay = getDays(currentDate),
        currentMonth = getMonth(currentDate),
        gridForecast = d.createElement('article');
        
        console.log(currWeatherJson, forecastFormatted);
        
        const htmlTemplate = insertHTML(currWeatherJson, currentDay, currentDate, currentMonth);
        fragment.appendChild(htmlTemplate);

        weatherContainer.innerHTML = "";
        weatherContainer.appendChild(fragment);

        
        
        // forecastFormatted.forEach((el, index) => {
        //   weatherGrid.innerHTML = `
        //     <div class="gridForecast">
        //       <h3>${index === 0 ? 'Tomorrow' : ""}</h3>
        //     </div>
        //   `
        // })  

      } catch (err) {
        const error = err.statusText || "An error occurred while loading the data";
        weatherContainer.innerHTML = `<p class="aside__weather-error">Error: ${err.status}, ${error}<p>`;
    }
}

d.addEventListener("DOMContentLoaded", getWeather(DEFAULT_CURRENT_WEATHER, DEFAULT_FORECAST));
