// Default coordinates (Colombo, Sri Lanka)
let latitude = 6.9271;
let longitude = 79.8612;

// Fetch weather data on page load
window.onload = function() {
    fetchWeather();
};

// Fetch weather data from API
function fetchWeather() {
    const locationInput = document.getElementById('location').value.trim();
    const hourlyContainer = document.getElementById('hourly-data');
    
    // Show loading state
    document.getElementById('current-temp').textContent = 'Loading...';
    document.getElementById('current-humidity').textContent = 'Humidity: --%';
    hourlyContainer.innerHTML = '<div class="loading">Loading data...</div>';
    
    // If user entered a location, try to use it (simple version)
    if (locationInput) {
        document.getElementById('current-location').textContent = locationInput;
    } else {
        document.getElementById('current-location').textContent = "Colombo, Sri Lanka";
    }
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('current-temp').textContent = 'Error';
            document.getElementById('current-humidity').textContent = 'Failed to load';
            hourlyContainer.innerHTML = '<div class="loading">Could not load weather data</div>';
        });
}

// Display weather data
function displayWeather(data) {
    // Get current time index
    const now = new Date();
    const currentHour = now.getHours();
    
    // Display current weather
    document.getElementById('current-temp').textContent = 
        `${data.hourly.temperature_2m[currentHour]}°C`;
    document.getElementById('current-humidity').textContent = 
        `Humidity: ${data.hourly.relative_humidity_2m[currentHour]}%`;
    
    // Display hourly forecast (next 12 hours)
    const hourlyContainer = document.getElementById('hourly-data');
    hourlyContainer.innerHTML = '';
    
    for (let i = 0; i < 12; i++) {
        const hourIndex = currentHour + i;
        if (hourIndex >= data.hourly.time.length) break;
        
        const hourItem = document.createElement('div');
        hourItem.className = 'hourly-item';
        
        const time = new Date(data.hourly.time[hourIndex]);
        const timeString = time.toLocaleTimeString([], {hour: '2-digit'});
        
        hourItem.innerHTML = `
            <div class="hourly-time">${timeString}</div>
            <div class="hourly-temp">${data.hourly.temperature_2m[hourIndex]}°C</div>
            <div class="hourly-humidity">${data.hourly.relative_humidity_2m[hourIndex]}%</div>
        `;
        
        hourlyContainer.appendChild(hourItem);
    }
}