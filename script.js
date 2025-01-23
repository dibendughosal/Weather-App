const userTab= document.querySelector('[data-userWeather]');
const searchTab= document.querySelector('[data-searchWeather]');
const userContainer = document.getElementsByClassName("weather-container");
const grantLocationCotainer = document.querySelector('.grantLocation-Container');
const searchForm = document.querySelector('[data-searchForm]');
const loadingScreen = document.querySelector('.loading-Container');
const userInfoContainer = document.querySelector('.user-info-container');


let currentTab = userTab;
let API_KEY = 'eafe3cf2bf49511c600613013d24b490';
currentTab.classList.add("current-tab");


function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove('current-tab');
        currentTab = clickedTab;
        currentTab.classList.add('current-tab'); 

        if(!searchForm.classList.contains('active')){
            userInfoContainer.classList.remove('active');
            grantLocationCotainer.classList.remove('active');
            searchForm.classList.add('active');
        }
        else{
            searchForm.classList.remove('active');
            userInfoContainer.classList.remove('active');
            getfromSessionStorage();
        }
    }
}
userTab.addEventListener('click',() => {
    switchTab(userTab);
});
searchTab.addEventListener('click',() => {
    switchTab(searchTab);
});
// check  if cordinates are already present in session storage.
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem('user-coordinates');
    if(!localCoordinates){
        // if local coordinates is not found
        grantLocationCotainer.classList.add('active');
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    //make grant access container invisible
    grantLocationCotainer.classList.remove('active');
    // make loader visible
    loadingScreen.classList.add('active');

    // API Call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    } catch (error) {
        loadingScreen.classList.remove('active')
    }
}

function renderWeatherInfo(weatherInfo){
    // Fetch the Element
    const cityName = document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector("[data-countryIcon]");
    const weatherDesc = document.querySelector('[data-weatherDesc]');
    const weatherIcon = document.querySelector('[data-weatherIcon]');
    const temp = document.querySelector('[data-temp]');
    const windspeed = document.querySelector('[data-windSpeed]');
    const humidity = document.querySelector('[data-humidity]');
    const cloudiness = document.querySelector('[data-cloudiness]')

    
}