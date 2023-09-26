// state
let currCity = "Pune";
let units = "metric";
let latitude = null;
let longitude = null;

// Selectors
let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime");
let weather__forecast = document.querySelector('.weather__forecast');
let weather__temperature = document.querySelector(".weather__temperature");
let weather_unit_celsius = document.querySelector(".weather_unit_celsius");
let weather_unit_farenheit = document.querySelector(".weather_unit_farenheit");
let weather__icon = document.querySelector(".weather__icon");
let weather__minmax = document.querySelector(".weather__minmax");
let weather__realfeel = document.querySelector('.weather__realfeel');
let weather__humidity = document.querySelector('.weather__humidity');
let weather__wind = document.querySelector('.weather__wind');
let weather__pressure = document.querySelector('.weather__pressure');
let location__button = document.querySelector('.location__button');
let errorElement = document.getElementById("error");
let loader = document.getElementById("loader");

errorElement.style.display = "none";
loader.style.display = "none";

// Event Listners

location__button.addEventListener('click', e => {
    loader.style.display = "block";
    navigator.geolocation.getCurrentPosition(position => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        getWeather(latitude, longitude);
    }, error => {
        if (error.code === 1) {
            console.error("User denied access to location.");
            errorElement.style.display = "block";
            errorElement.textContent = "Please allow access to your location to get weather information. Clear the setting if denied.";
        } else {
            console.error(`Geolocation error: ${error.message}`);
        }
    });
});

document.querySelector(".weather__search").addEventListener('submit', e => {
    loader.style.display = "block";
    let search = document.querySelector(".weather__searchform");
    e.preventDefault();
    currCity = search.value;
    getWeather(currCity);
    search.value = "";
});

weather_unit_celsius.addEventListener('click', e => {
    loader.style.display = "block";
    if (units !== 'metric') {
        units = 'metric';
        if (latitude !== null) getWeather(latitude, longitude);
        else getWeather(currCity);
    }
    else {
        loader.style.display = "none";
    }
})

weather_unit_farenheit.addEventListener('click', e => {
    loader.style.display = "block";
    if (units !== 'imperial') {
        units = 'imperial';
        if (latitude !== null) getWeather(latitude, longitude);
        else getWeather(currCity);
    }
    else {
        loader.style.display = "none";
    }
})




function convertTimeStamp(timestamp, timezone) {
    const date = new Date(timestamp * 1000);
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: "Asia/Kolkata",
        hour12: true,
    };
    return date.toLocaleString("en-US", options);
}

// convert country code to name
function convertCountryCode(country) {
    let regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(country);
}

function displayWeatherData(data) {
    console.log(data);
    city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
    datetime.innerHTML = convertTimeStamp(data.dt, data.timezone);
    weather__forecast.innerHTML = `<p>${data.weather[0].main}`;
    weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176${units === "metric" ? "C" : "F"}`;
    weather__icon.innerHTML = `   <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`;
    weather__minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176${units === "metric" ? "C" : "F"}</p>`;
    weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`;
    weather__humidity.innerHTML = `${data.main.humidity}%`;
    weather__wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph" : "m/s"}`;
    weather__pressure.innerHTML = `${data.main.pressure} hPa`;
}

function getWeather(cityOrLat, lon) {

    const API_KEY = '64f60853740a1ee3ba20d0fb595c97d5';
    let url;

    if (typeof cityOrLat === 'string') {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${cityOrLat}&appid=${API_KEY}&units=${units}`;
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${cityOrLat}&lon=${lon}&appid=${API_KEY}&units=${units}`;
    }

    fetch(url)
        .then(res => {
            loader.style.display = "none";
            if (!res.ok) {
                errorElement.style.display = "block";
                errorElement.textContent = `Weather data not found. Please enter a valid location.`;
                return Promise.reject("Weather data not found.");
            }
            return res.json();
        })
        .then(data => {
            displayWeatherData(data);
        })
        .catch(error => {
            console.error(`Error fetching weather data: ${error.message}`);
        });
}

window.addEventListener('load', () => {
    getWeather(currCity);
});
