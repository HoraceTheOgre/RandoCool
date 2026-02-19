class VueWeather {
    constructor() {
        this.html = document.getElementById("html-vue-meteo").innerHTML;
    }

    display() {
        document.body.innerHTML = this.html;
        

       document.getElementById("btn-retour-meteo").addEventListener("click", () => {
            window.location.hash = "#accueil"; 
        });

        this.getLocalisation();
    }

    getLocalisation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    this.fetchWeather(lat, lon);
                },
                (error) => {
                    alert("GPS requis pour la météo locale.");
                    // Fallback to Quebec City if GPS fails
                    this.fetchWeather(46.8139, -71.2080);
                }
            );
        }
    }

    fetchWeather(lat, lon) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,wind_gusts_10m&daily=sunrise,sunset,uv_index_max&timezone=auto`;

        fetch(url)
            .then(response => response.json())
            .then(data => this.renderData(data))
            .catch(err => console.error("Erreur Météo:", err));
    }

    renderData(data) {
        const current = data.current;
        const daily = data.daily;

        document.getElementById("weather-temp").innerText = Math.round(current.temperature_2m) + "°C";
        document.getElementById("weather-wind").innerText = Math.round(current.wind_gusts_10m);
        document.getElementById("weather-uv").innerText = daily.uv_index_max[0];

        const code = current.weather_code;
        let desc = "Nuageux";
        let icon = "☁️";

        if (code === 0) { desc = "Ensoleillé"; icon = "☀️"; }
        else if (code <= 3) { desc = "Variable"; icon = "⛅"; }
        else if (code <= 67) { desc = "Pluie"; icon = "🌧️"; }
        else if (code <= 77) { desc = "Neige"; icon = "❄️"; }
        else { desc = "Orage"; icon = "⛈️"; }

        document.getElementById("weather-icon").innerText = icon;
        document.getElementById("weather-desc").innerText = desc;

        const sunsetString = daily.sunset[0];
        const sunsetDate = new Date(sunsetString);
        const now = new Date();

        const hours = sunsetDate.getHours().toString().padStart(2, '0');
        const minutes = sunsetDate.getMinutes().toString().padStart(2, '0');
        document.getElementById("sunset-time").innerText = `${hours}:${minutes}`;

        const diffMs = sunsetDate - now;
        if (diffMs > 0) {
            const diffHrs = Math.floor(diffMs / 3600000);
            const diffMins = Math.floor((diffMs % 3600000) / 60000);
            document.getElementById("daylight-left").innerText = `${diffHrs}h ${diffMins}m`;
            document.getElementById("daylight-left").style.color = "#4ade80"; // Green
        } else {
            document.getElementById("daylight-left").innerText = "Il fait noir !";
            document.getElementById("daylight-left").style.color = "#ef4444"; // Red
        }
    }
}
