console.log('Hello Jee Wasif');

const API_KEY = 'd1845658f92b31c64bd94f06f7188c9c';

// Using city name
async function showWeather() {
    // let lattitude = 15.333;
    // let longitude = 75.0833;
    let city = 'goa';

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();

    console.log('Weather data: ' + data);

    renderWeatherInfo(data);

}

function renderWeatherInfo(data) {
    let newPara = document.createElement('p');
    newPara.textContent = `${data?.main?.temp.toFixed(2)}`;
    document.body.appendChild(newPara);
}

showWeather();

// Using only latitude & longitude
async function getCustomWeather() {
    let lat = 15.184;
    let lon = 12.3333;

    try {
        // remove -> q=${city} & use -> lat=${lat}&lon=${lon}
        let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        let data = await result.json();

        console.log('The random weather ', data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

getCustomWeather();

// Find Your Current Position
function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        console.log('Done')
    }
    else {
        console.log('No geoLocation Support')
    }
}

function showPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    console.log(`My Latitude ${lat}`);
    console.log(`My Longitude ${lon}`);
}

getLocation();