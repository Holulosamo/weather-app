const d = document;
const locationBtn = d.querySelector('.aside__container-location');
const weatherContainer = d.querySelector('.aside__weather');
const template = document.getElementById('weather-template').content;
const weatherFragment = document.createDocumentFragment();
const weatherGridContainer = document.querySelector('.section');

let query;
const API_LINK = 'https://api.openweathermap.org/';
const DEFAULT_CURRENT_WEATHER = `${API_LINK}data/2.5/weather?q=London&units=metric&appid=47215c95b17bd7ea41ea062f704ea884`;
const DEFAULT_FORECAST = `${API_LINK}data/2.5/forecast?q=London&units=metric&appid=47215c95b17bd7ea41ea062f704ea884`;

const createLoader = () => {
  const loaderSpinner = d.createElement('div');
  loaderSpinner.setAttribute(
    'style',
    'border: 4px solid rgba(0, 0, 0, .2); width: 60px; height: 60px; border-radius: 50%; border-left-color: #fff; animation: spin 1s linear infinite'
  );
  weatherContainer.appendChild(loaderSpinner);
}

const getDays = (day) => {
  const daysOfWeek = ['Sun','Mon','Tues','Wed','Thur','Fri','Sat'];
  return currentDay = daysOfWeek[day.getDay()];
}

const getMonth = (month) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return currentMonth = months[month.getMonth()];
}

const weatherTemplate = (response, date) => {
  const day = getDays(date);
  const month = getMonth(date);

  template.querySelector('.aside__weather-img').src = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
  template.querySelector('.aside__weather-img').alt = response.weather[0].description; 
  template.querySelector('.aside__weather-temp').innerHTML = `${Math.round(response.main.temp)}<span class='aside__weather-metric'>ºC</span>`;
  template.querySelector('.aside__weather-main').innerHTML = response.weather[0].main;
  template.querySelector('.aside__weather-date').innerHTML = `<span>Today</span><span>•</span><span>${day}, ${date.getDate()} ${month}</span>`; 
  template.querySelector('.aside__weather-location').innerHTML = `<span class='material-icons'>location_on</span> ${response.name}`;

  clone = d.importNode(template, true);
  weatherFragment.appendChild(clone);
  weatherContainer.innerHTML = '';
  weatherContainer.appendChild(weatherFragment);
}

const forecastTemplate = (forecast, currentWeather) => {    
  const templateForecastCards = `
    <article class='section__forecast'>
      ${forecast
        .map(
          (el, index) =>
            `
      <div class='section__forecast-cards'>
        <h3 class='section__forecast-day'>${
          index === 0
            ? 'Tomorrow'
            : `${getDays(new Date(el.dt_txt))}, ${new Date(
                el.dt_txt
              ).getDate()} ${getMonth(new Date(el.dt_txt))}`
        }</h3>
        <img class='section__forecast-img' src='http://openweathermap.org/img/wn/${
          el.weather[0].icon
        }@2x.png' alt='weather-icon' />
        <p class='section__forecast-measurement'><span>${Math.trunc(
          el.main.temp
        )}ºC</span><span>${Math.trunc(el.main.temp_min)}ºC</span></p>
      </div>
    `
        )
        .join('')}
    </article>
    `;

  const templateCardsHightlights = `
  <section class='section__hightlights'>
     <h2>Today's Hightlights</h2>
      <article class='hightlights__cards  hightlights__wind'>
       <h3 class='hightlights__wind-title'>Wind status</h3>
       <p class='hightlights__wind-speed'>${Math.trunc(
         currentWeather.wind.speed
       )}<span>mph</span></p>
       <div class='hightlights__icon-container'><p class='hightlights__location'><span class='hightlights__icon  material-icons'>near_me</span></p><p class=''>WSW</p></div>
      </article>
        
      <article class='hightlights__cards  hightlights__humidity'>
       <h3 class='hightlights__humidity-title'>Humidity</h3>
       <p class='hightlights__humidity-info'>${
         currentWeather.main.humidity
       }<span>%</span></p>
       <div class='hightlights__humidity-container'>
        <div class='hightlights__humidity-percentages'>
          <span class='hightlights__numbers'>0</span><span class='hightlights__numbers'>50</span><span class='hightlights__numbers'>100</span>
        </div> 
        <div class='hightlights__humidity-bar'>
          <div class='hightlights__humidity-progression'></div>
        </div>
        <span class="hightlights__percentage">%</span>
       </div>
      </article>
       
      <article class='hightlights__cards  hightlights__visibility'>
       <h3 class='hightlights__visibility-title'>Visibility</h3>
       <p class='hightlights__visibility-info'>${
         currentWeather.visibility
       }</p>
      </article>
       
      <article class='hightlights__cards  hightlights__pressure'>
        <h3>Air Pressure</h3>
        <p>${currentWeather.main.pressure}mb</p>
      <article/>
  </section>
  `;
       
  weatherGridContainer.innerHTML = '';
  weatherGridContainer.insertAdjacentHTML('afterbegin', templateForecastCards);
  weatherGridContainer.insertAdjacentHTML('beforeend', templateCardsHightlights);
  const parentWidth = document.querySelector('.hightlights__humidity-bar').offsetWidth;
  const humidityPercent = currentWeather.main.humidity;
  const barProgress = (parentWidth * humidityPercent) / 100;
  document.querySelector(".hightlights__humidity-progression").style.width = `${barProgress}px`;
}


async function getWeather(currentWeatherURL, forecastURL) {
    createLoader();
    try {    
      let currWeatherFetch = await fetch(currentWeatherURL);
      let forecastFetch = await fetch(forecastURL);
      let [currWeatherRes, forecastRes] = await Promise.all([currWeatherFetch, forecastFetch]);
      let currWeatherJson = await currWeatherRes.json();
      let forecastJson = await forecastRes.json();       
      const forecastFormatted = forecastJson.list.filter(forecast => forecast.dt_txt.includes('00:00:00'));
      const currentDate = new Date(currWeatherJson.dt * 1000);
      console.log(currWeatherJson);
      console.log(forecastFormatted);
      weatherTemplate(currWeatherJson, currentDate);
      forecastTemplate(forecastFormatted, currWeatherJson);     
    } catch (err) {
        const error = err.statusText || 'An error occurred while loading the data';
        weatherContainer.innerHTML = `<p class='aside__weather-error'>Error: ${err.status}, ${error}<p>`;
    }
}

d.addEventListener('DOMContentLoaded', getWeather(DEFAULT_CURRENT_WEATHER, DEFAULT_FORECAST));
