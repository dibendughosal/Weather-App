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
    }
}
userTab.addEventListener('click',() => {
    switchTab(userTab);
});
searchTab.addEventListener('click',() => {
    switchTab(searchTab);
});