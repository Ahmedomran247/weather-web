
let timeEl = document.getElementById("time");
let dataEl = document.getElementById("data");
let currentweatheriteamsEl = document.getElementById("current-weather-iteams");
let timezone = document.getElementById("time-zone");
let conutryEL = document.getElementById("conutry");
let weatherforecastEL = document.getElementById("weather-forecast");
let currenttempEL = document.getElementById("current-temp");

let api = {
    base: "http://api.weatherapi.com/v1",
    key: "59290286b7ed41c5b47114821241010",
};

let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

setInterval(() => {
    let time = new Date();
    let month = time.getMonth();
    let date = time.getDate();
    let day = time.getDay();
    let hour = time.getHours();
    let hoursin12Hrformat = hour >= 13 ? hour % 12 : hour;
    let minutes = time.getMinutes();
    let ampm = hour >= 12 ? 'PM' : 'AM';
    timeEl.innerHTML = (hoursin12Hrformat < 10 ? "0" + hoursin12Hrformat : hoursin12Hrformat) + 
        ':' + (minutes < 10 ? "0" + minutes : minutes) + 
        `<span class="fs-2" id="Am-Pm">${ampm}</span>`;
    dataEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];
}, 1000);

// دالة لجلب بيانات الطقس
let getWeatherData = (city) => {
    fetch(`${api.base}/forecast.json?key=${api.key}&q=${city}&days=3`)
    .then((res) => res.json())
    .then((result) => {
        console.log(result);
        displayWeather(result);
    })
    .catch((error) => {
        console.error("Error fetching weather data: ", error);
    });
};

let displayWeather = (data) => {
    let { location, current, forecast } = data;

    timezone.innerHTML = location.tz_id;
    conutryEL.innerHTML = location.name + ', ' + location.country;

    currentweatheriteamsEl.innerHTML = `
        <div class="humidity">Humidity - ${current.humidity}%</div>
        <div class="wind-speed">Wind Speed - ${current.wind_kph} kph</div>
    `;

    let todayForecast = forecast.forecastday[0].day;
    
    currenttempEL.innerHTML = `
        <div class="today-weather d-flex align-items-center justify-content-center text-center">
            <div>
                <div class="day rounded m-2">${days[new Date(current.last_updated).getDay()]}</div>
                <img src="http:${current.condition.icon}" alt="weather-icon" class="w-icon">
                <div class="temp"> ${current.temp_c}&#176; C</div>
                <div class="temp">Day Forecast - ${todayForecast.maxtemp_c}&#176; C</div>
            </div>
        </div>
    `;

    weatherforecastEL.innerHTML = '';
    forecast.forecastday.forEach((dayForecast) => {
        let day = new Date(dayForecast.date).getDay();
        weatherforecastEL.innerHTML += `
            <div class="weather-forecost-item col-md-3">
                <div class="day">${days[day]}</div>
                <img src="http:${dayForecast.day.condition.icon}" alt="weather-icon" class="w-icon">
                <div class="temp">Night - ${dayForecast.day.mintemp_c}&#176; C</div>
                <div class="temp">Day Forecast - ${dayForecast.day.maxtemp_c}&#176; C</div>
            </div>
        `;
    });
};

document.getElementById("search-city").addEventListener("input", () => {
    let city = document.getElementById("search-city").value;
    if (city) {
        getWeatherData(city);
    }
});
