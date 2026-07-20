// =========================================
// WEATHER APP - VERSION 2.0
// =========================================

// ---------- DOM Elements ----------
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const loading = document.getElementById("loading");
const error = document.getElementById("error");

const weatherCard = document.getElementById("weatherCard");

const city = document.getElementById("city");
const dateTime = document.getElementById("dateTime");
const icon = document.getElementById("icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const country = document.getElementById("country");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const updated = document.getElementById("updated");

const historyContainer = document.getElementById("historyContainer");
const historyDiv = document.getElementById("history");

// =========================================
// ENTER YOUR NEW API KEY HERE
// =========================================

const apiKey = "05b01e6d57f44ef297e394f663802da8";

// =========================================
// EVENTS
// =========================================

searchBtn.addEventListener("click", () => {

    const cityName = cityInput.value.trim();

    if(cityName !== ""){

        getWeatherByCity(cityName);

    }

});

cityInput.addEventListener("keydown",(event)=>{

    if(event.key==="Enter"){

        searchBtn.click();

    }

});

locationBtn.addEventListener("click",()=>{

    if(!navigator.geolocation){

        showError("Geolocation is not supported.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        (position)=>{

            getWeatherByLocation(

                position.coords.latitude,

                position.coords.longitude

            );

        },

        ()=>{

            showError("Location permission denied.");

        }

    );

});

// =========================================
// FETCH WEATHER BY CITY
// =========================================

async function getWeatherByCity(cityName){

    startLoading();

    try{

        const response = await fetch(

`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`

        );

        const data = await response.json();

        if(!response.ok){

            throw new Error(data.message);

        }

        displayWeather(data);

        saveHistory(data.name);

    }

    catch(err){

        showError("City not found. Please check the spelling.");

    }

}

// =========================================
// FETCH WEATHER BY LOCATION
// =========================================

async function getWeatherByLocation(lat,lon){

    startLoading();

    try{

        const response = await fetch(

`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

        );

        const data = await response.json();

        displayWeather(data);

        saveHistory(data.name);

    }

    catch{

        showError("Unable to retrieve your location weather.");

    }

}

// =========================================
// DISPLAY WEATHER
// =========================================

function displayWeather(data){

    stopLoading();

    error.style.display="none";

    weatherCard.style.display="block";

    city.textContent=data.name;

    country.textContent=data.sys.country;

    temperature.textContent=Math.round(data.main.temp)+"°C";

    description.textContent=data.weather[0].description
    .replace(/\b\w/g,l=>l.toUpperCase());

    feelsLike.textContent=Math.round(data.main.feels_like)+"°C";

    humidity.textContent=data.main.humidity+"%";

    wind.textContent=data.wind.speed+" m/s";

    pressure.textContent=data.main.pressure+" hPa";

    visibility.textContent=(data.visibility/1000)+" km";

    sunrise.textContent=formatTime(data.sys.sunrise);

    sunset.textContent=formatTime(data.sys.sunset);

    updated.textContent="Last Updated: "+new Date().toLocaleString();

    dateTime.textContent=new Date().toLocaleString();

    icon.src=`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    changeBackground(data.weather[0].main);

    cityInput.value="";

}

// =========================================
// FORMAT TIME
// =========================================

function formatTime(unix){

    return new Date(unix*1000).toLocaleTimeString([],{

        hour:"2-digit",

        minute:"2-digit"

    });

}

// =========================================
// LOADING
// =========================================

function startLoading(){

    loading.style.display="block";

    error.style.display="none";

    weatherCard.style.display="none";

}

function stopLoading(){

    loading.style.display="none";

}

// =========================================
// ERROR
// =========================================

function showError(message){

    stopLoading();

    weatherCard.style.display="none";

    error.style.display="block";

    error.textContent="❌ "+message;

}

// =========================================
// CHANGE BACKGROUND
// =========================================

function changeBackground(weather){

    document.body.className="";

    switch(weather){

        case "Clear":
            document.body.classList.add("clear");
            break;

        case "Clouds":
            document.body.classList.add("clouds");
            break;

        case "Rain":
        case "Drizzle":
            document.body.classList.add("rain");
            break;

        case "Snow":
            document.body.classList.add("snow");
            break;

        case "Thunderstorm":
            document.body.classList.add("thunderstorm");
            break;

        case "Mist":
        case "Fog":
        case "Haze":
            document.body.classList.add("mist");
            break;

        default:
            break;

    }

}

// =========================================
// SEARCH HISTORY
// =========================================

function saveHistory(cityName){

    let history=JSON.parse(localStorage.getItem("history"))||[];

    history=history.filter(item=>item!==cityName);

    history.unshift(cityName);

    history=history.slice(0,5);

    localStorage.setItem("history",JSON.stringify(history));

    loadHistory();

}

function loadHistory(){

    const history=JSON.parse(localStorage.getItem("history"))||[];

    historyDiv.innerHTML="";

    if(history.length===0){

        historyContainer.style.display="none";

        return;

    }

    historyContainer.style.display="block";

    history.forEach(cityName=>{

        const btn=document.createElement("button");

        btn.textContent=cityName;

        btn.addEventListener("click",()=>{

            getWeatherByCity(cityName);

        });

        historyDiv.appendChild(btn);

    });

}

// =========================================
// LOAD HISTORY ON PAGE LOAD
// =========================================

loadHistory();