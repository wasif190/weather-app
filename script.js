const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');

const userContainer = document.querySelector('.weather-container');
const grantAccessContainer = document.querySelector('.grant-location-container');
const searchForm = document.querySelector('[ data-searchForm]');
const loadingScreen = document.querySelector('.loading-container');
const userInfoContainer = document.querySelector('.user-info-container');
const notFound = document.querySelector('.not-found');


// Initially variables need
let currentTab = userTab;
const API_KEY = 'd1845658f92b31c64bd94f06f7188c9c';
currentTab.classList.add('current-tab');
getfromSessionStorage();

function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove('current-tab');
        currentTab = clickedTab;
        currentTab.classList.add('current-tab');

        // Koi bhi element agr visible hai to definitly usme active wala class hoga, 
        // Agr nahi hai to wo unvisible hoga 
        // To searchForm agr active class contains nahi krta hai (means agr visible nahi hai) 
        // To ... Search form wale me hi jana tha 
        if (!searchForm.classList.contains('active')) {
            // Kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove('active');
            searchForm.classList.add('active');
        } else {
            // Main phle search wale tab pr tha, ab your weather tab visible krna hai
            searchForm.classList.remove('active');
            userInfoContainer.classList.remove('active');
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener('click', () => switchTab(userTab) );
searchTab.addEventListener('click', () => switchTab(searchTab) );

// Check If Coordinates are Already Present In Session Storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem('user-coordinates');

    if (!localCoordinates) {
        grantAccessContainer.classList.add('active');
    } else {
        const coordinates = JSON.parse(localCoordinates); // Convert json string to json object
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // Remove notFound
    notFound.classList.remove('active');
    // Make Grant Container Invisible
    grantAccessContainer.classList.remove('active');
    // Make Loader Visible
    loadingScreen.classList.add('active');

    // API Call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    } catch (error) {
        console.error('Error fetching user weather info:', error);
        notFound.classList.add('active');
    }
}

function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherdDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    
    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else {
        // Show an alert for no geolocation support available
        alert('Geolocation not support')
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem('user-coordinates', JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessBtn = document.querySelector('[data-grantAccess]');

grantAccessBtn.addEventListener('click', getLocation);

const searchInput = document.querySelector('[data-searchInput]');

searchForm.addEventListener('click', (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName === '') return
    else {
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add('active');
    notFound.classList.remove('active');
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');

        if (response.ok) {
            renderWeatherInfo(data);
        } else {
            // If the response is not okay, show the 'No Found!' message
            renderNotFoundError();
        }
    } catch (error) {
        // Handle other errors, such as network issues
        console.error('Error fetching search weather info:', error);
        renderNotFoundError();
    }
}

function renderNotFoundError() {
    loadingScreen.classList.remove('active');
    userInfoContainer.classList.remove('active');
    notFound.classList.add('active');
}


const closeBtn = document.querySelector('.close-btn');

closeBtn.addEventListener('click', () => {
    searchInput.value = '';
});


