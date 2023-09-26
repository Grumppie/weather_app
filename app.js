// State
let currCity = "London";
let units = "metric";

// Selectors
const selectors = {
    city: ".weather__city",
    datetime: ".weather__datetime",
    forecast: ".weather__forecast",
    temperature: ".weather__temperature",
    icon: ".weather__icon",
    minmax: ".weather__minmax",
    realfeel: ".weather__realfeel",
    humidity: ".weather__humidity",
    wind: ".weather__wind",
    pressure: ".weather__pressure",
    search: ".weather__search",
    searchForm: ".weather__searchform",
    unitCelsius: ".weather_unit_celsius",
    unitFahrenheit: ".weather_unit_fahrenheit",
};

const elements = {};
for (const key in selectors) {
    elements[key] = document.querySelector(selectors[key]);
}

// Event Listeners
elements.search.addEventListener("submit", (e) => {
    e.preventDefault();
    currCity = elements.searchForm.value;
    getWeather();
    elements.searchForm.value = "";
});

elements.unitCelsius.addEventListener("click", () => {
    if (units !== "metric") {
        units = "metric";
        getWeather();
    }
});

elements.unitFahrenheit.addEventListener("click", () => {
    if (units !== "imperial") {
        units = "imperial";
        getWeather();
    }
});

// Helper Functions
function convertTimeStamp(timestamp) {
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

function convertCountryCode(country) {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(country);
}

function getWeather() {
    const API_KEY = "94236490bdcfedabdb66ef6ebdc775df";
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`
    )
        .then((res) => res.json())
        .then((data) => {
            const {
                name,
                sys: { country },
                dt,
                weather,
                main,
                wind,
            } = data;

            elements.city.innerHTML = `${name}, ${convertCountryCode(country)}`;
            elements.datetime.innerHTML = convertTimeStamp(dt);
            elements.forecast.innerHTML = `<p>${weather[0].main}`;
            elements.temperature.innerHTML = `${main.temp.toFixed()}&#176`;
            elements.icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather[0].icon}@4x.png" />`;
            elements.minmax.innerHTML = `<p>Min: ${main.temp_min.toFixed()}&#176</p><p>Max: ${main.temp_max.toFixed()}&#176</p>`;
            elements.realfeel.innerHTML = `${main.feels_like.toFixed()}&#176`;
            elements.humidity.innerHTML = `${main.humidity}%`;
            elements.wind.innerHTML = `${wind.speed} ${units === "imperial" ? "mph" : "m/s"
                }`;
            elements.pressure.innerHTML = `${main.pressure} hPa`;
        });
}

// Initial weather retrieval
window.addEventListener("load", getWeather);
