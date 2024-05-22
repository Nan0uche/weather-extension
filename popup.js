const apiKey = '09dd260fcfe1e422be1a543360cee185';
const weatherInfo = document.querySelector('.weather-info');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const dateElement = document.getElementById('date');
const timeElement = document.getElementById('time');
let latitude = 0;
let longitude = 0;

function getWeather(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=fr&units=metric&appid=${apiKey}`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      locationElement.textContent = decodeURIComponent(data.name);

      const temperature = Math.floor(data.main.temp);

      const temperatureElement = document.getElementById('temperature');

      if (temperature < 10) {
        temperatureElement.classList.add('cold');
        temperatureElement.classList.remove('hot');
      } else if (temperature > 25) {
        temperatureElement.classList.add('hot');
        temperatureElement.classList.remove('cold');
      } else {
        temperatureElement.classList.remove('hot', 'cold');
      }

      temperatureElement.textContent = `${temperature}\u00B0C`;

      descriptionElement.textContent = decodeURIComponent(data.weather[0].description);

      const windSpeed = data.wind.speed;
      document.getElementById('wind-speed').textContent = `Vitesse du vent: ${windSpeed} m/s`;

      const humidity = data.main.humidity;
      document.getElementById('humidity').textContent = `Humidite: ${humidity}%`;

      const sunrise = new Date(data.sys.sunrise * 1000);
      const sunset = new Date(data.sys.sunset * 1000);
      
      const sunriseOptions = { hour: '2-digit', minute: '2-digit' };
      const sunsetOptions = { hour: '2-digit', minute: '2-digit' };
      
      document.getElementById('sunrise').textContent = `Lever du soleil: ${sunrise.toLocaleTimeString('fr-FR', sunriseOptions)}`;
      document.getElementById('sunset').textContent = `Coucher du soleil: ${sunset.toLocaleTimeString('fr-FR', sunsetOptions)}`;

      if (data.uvi !== undefined) {
        const uvIndex = data.uvi;
        document.getElementById('uv-index').textContent = `Indice UV: ${uvIndex}`;
      } else {
        document.getElementById('uv-index').textContent = `Indice UV: Indisponible`;
      }
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      weatherInfo.textContent = 'Erreur lors de la récupération des données météo.';
    });
}

function getPositionAndWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;

      const now = new Date();
      const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const timeOptions = { hour: 'numeric', minute: 'numeric' };
      dateElement.textContent = now.toLocaleDateString('fr-FR', dateOptions);
      timeElement.textContent = now.toLocaleTimeString('fr-FR', timeOptions);
    }, error => {
      switch(error.code) {
        case error.PERMISSION_DENIED:
          weatherInfo.textContent = "Permission refusée.";
          break;
        case error.POSITION_UNAVAILABLE:
          weatherInfo.textContent = "Localisation indisponible.";
          break;
        case error.TIMEOUT:
          weatherInfo.textContent = "Le temps de localisation a expiré.";
          break;
        case error.UNKNOWN_ERROR:
          weatherInfo.textContent = "Erreur inconnue.";
          break;
      }
    });
  } else {
    weatherInfo.textContent = "La géolocalisation n'est pas supportée par ce navigateur.";
  }
}
getPositionAndWeather();
getWeather(latitude, longitude);

setInterval(() => {
  getPositionAndWeather();
}, 60);

setInterval(() => {
  getWeather(latitude, longitude);
}, 60 * 5);