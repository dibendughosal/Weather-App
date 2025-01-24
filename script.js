const userTab= document.querySelector('[data-userWeather]');
const searchTab= document.querySelector('[data-searchWeather]');
const userContainer = document.querySelector(".weather-container");
const grantLocationContainer = document.querySelector('.grantLocation-Container');
const searchForm = document.querySelector('[data-searchForm]');
const loadingScreen = document.querySelector('.loading-Container');
const userInfoContainer = document.querySelector('.user-info-container');
const apiErrorContainer = document.querySelector(".api-error-container");
const apiErrorImg = document.querySelector("[data-notFoundImg]");
const apiErrorMessage = document.querySelector("[data-apiErrorText]");
const apiErrorBtn = document.querySelector("[data-apiErrorBtn]");
const messageText = document.querySelector("[data-messageText]");

let currentTab = userTab;
let API_KEY = 'eafe3cf2bf49511c600613013d24b490';
currentTab.classList.add("current-tab");


function switchTab(clickedTab){
    apiErrorContainer.classList.remove("active");
    if(clickedTab != currentTab){
        currentTab.classList.remove('current-tab');
        currentTab = clickedTab;
        currentTab.classList.add('current-tab'); 

        if(!searchForm.classList.contains('active')){
            userInfoContainer.classList.remove('active');
            grantLocationContainer.classList.remove('active');
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
        grantLocationContainer.classList.add('active');
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        messageText.innerText = "You denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        messageText.innerText = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        messageText.innerText = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        messageText.innerText = "An unknown error occurred.";
        break;
    }
  }

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    //make grant access container invisible
    grantLocationContainer.classList.remove('active');
    // make loader visible
    loadingScreen.classList.add('active');

    // API Call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    } catch (error) {
        loadingScreen.classList.remove('active')
    }
}
// rendering the content on the webp
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

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handleLocationError)
    }
}
function handleLocationError() {
    grantLocationContainer.innerHTML = `<p class="error-message">Location access denied. Please search for a city manually.</p>`;
}
function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessBtn = document.querySelector('[data-grantAccess]');
grantAccessBtn.addEventListener('click', getLocation);

const searchInput = document.querySelector('[data-searchInput]');
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let cityName = searchInput.value.trim();

    if(cityName === ""){
        alert("Please enter a valid city name.");
        return;
    }
    fetchUserWeatherCity(cityName);
})

async function fetchUserWeatherCity(city){
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantLocationContainer.classList.remove('active');
    apiErrorContainer.classList.remove("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        if (!data.sys) {
            throw data;
          }
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    } catch (error) {
        // console.log("Error Found", error);
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        apiErrorMessage.innerText = `${error?.message}`;
        apiErrorBtn.style.display = "none"; 
        
    }
}