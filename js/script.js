/*
Assignment 3: API
Due Date: 2023/12/06
Student Name: Matthew Antonis
Student Number: 200373088
*/

// Event listener for DOMContentLoaded to ensure the DOM is fully loaded before executing any scripts
document.addEventListener('DOMContentLoaded', () => {
    // Setting the text content of the student-info element
    document.getElementById('student-info').textContent = 'Student ID: 200373088, Name: Matthew Antonis';

    // Adding an event listener for the form submission
    const form = document.getElementById('city-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Preventing the default form submission behavior
        const city = document.getElementById('city-input').value; // Retrieving the city entered by the user
        getWeather(city); // Calling the getWeather function with the entered city
    });
});

// Function to fetch weather data for a given city
function getWeather(city) {
    const apiKey = 'b1f13cbf0670d2088b8b1c2d6ca63259'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`; // Constructing the API request URL

    // Fetching weather data from the OpenWeatherMap API
    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // Throwing an error if the response is not successful
        }
        return response.json(); // Parsing the JSON response
    })
    .then(data => {
        displayWeather(data); // Displaying the weather data
        displayTime(data.timezone); // Displaying the local time based on the timezone
    })
    .catch(error => {
        console.error('Error:', error); // Logging any errors to the console
        document.getElementById('weather').textContent = 'Error fetching data. Please try again.'; // Displaying an error message to the user
    });
}

// Function to display weather data
function displayWeather(data) {
    const weatherDiv = document.getElementById('weather');
    const iconUrl = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`; // Getting the weather icon URL

    // Calculating local sunrise and sunset times
    const sunriseTime = new Date((data.sys.sunrise + data.timezone) * 1000);
    const sunsetTime = new Date((data.sys.sunset + data.timezone) * 1000);

    // Setting the inner HTML of the weather div to display the weather information
    weatherDiv.innerHTML = `
        <h1>Weather in ${data.name}</h1>
        <img src="${iconUrl}" alt="Weather Icon">
        <p>Temperature: ${convertKelvinToCelsius(data.main.temp)}°C</p>
        <p>Min Temperature: ${convertKelvinToCelsius(data.main.temp_min)}°C</p>
        <p>Max Temperature: ${convertKelvinToCelsius(data.main.temp_max)}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Sunrise: ${sunriseTime.toLocaleTimeString()}</p>
        <p>Sunset: ${sunsetTime.toLocaleTimeString()}</p>`;
}

// Helper function to convert temperature from Kelvin to Celsius
function convertKelvinToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(2);
}

// Function to display the local time based on timezone offset
function displayTime(timezoneOffsetInSeconds) {
    // Obtaining the current UTC time
    const nowUtc = new Date();

    // Calculating the local time in milliseconds
    const localTimeInMilliseconds = nowUtc.getTime() + nowUtc.getTimezoneOffset() * 60000 + timezoneOffsetInSeconds * 1000;

    // Creating a new Date object for the local time
    const localTime = new Date(localTimeInMilliseconds);

    // Displaying the local time in the time div
    const timeDiv = document.getElementById('time');
    timeDiv.innerHTML = `<p>Local Time: ${localTime.toLocaleTimeString()}</p>`;
}
