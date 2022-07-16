window.addEventListener("DOMContentLoaded", async () => {
    const app = {
        HTMLElements: {
            temperature: document.querySelector(".temp"),
            summary: document.querySelector(".summary"),
            location: document.querySelector(".location"),
            icon: document.querySelector(".icon-div"),
        },
        displayUI(temperature, summary, location) {
            this.HTMLElements.temperature.innerText = temperature;
            this.HTMLElements.summary.innerText = summary;
            this.HTMLElements.location.innerText = location;
        },
        displayIcon(type) {
            const { icon } = this.HTMLElements;
            switch (type) {
                case "Thunderstorm":
                    icon.innerHTML = '<div class="icon thunder-storm"><div class="cloud"></div><div class="lightning"><div class="bolt"></div><div class="bolt"></div></div></div>';
                    break;
                case "Drizzle":
                    icon.innerHTML = '<div class="icon sun-shower"><div class="cloud"></div><div class="sun"><div class="rays"></div></div><div class="rain"></div></div>';
                    break;
                case "Rain":
                    icon.innerHTML = '<div class="icon rainy"><div class="cloud"></div><div class="rain"></div></div>';
                    break;
                case "Snow":
                    icon.innerHTML = '<div class="icon flurries"><div class="cloud"></div><div class="snow"><div class="flake"></div><div class="flake"></div></div></div>';
                    break;
                case "Atmosphere":
                    icon.innerHTML = '<div class="icon sunny"><div class="sun"><div class="rays"></div></div></div>';
                    break;
                case "Clear":
                    icon.innerHTML = '<div class="icon sunny"><div class="sun"><div class="rays"></div></div></div>';
                    break;
                case "Clouds":
                    icon.innerHTML = '<div class="icon cloudy"><div class="cloud"></div><div class="cloud"></div></div>';
                    break;
                default:
                    icon.innerHTML = "<div>Something went wrong</div>";
            }
        },
        async fetchWeather(latitude, longitude) {
            const base = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&` + `lon=${longitude}&appid=6d055e39ee237af35ca066f35474e9df`;

            const response = await fetch(base);
            const data = await response.json();

            this.displayUI(Math.floor(data.main.temp - 273) + "°C", data.weather[0].description, `${data.name}, ${data.sys.country}`);
            this.displayIcon(data.weather[0].main);
        },
    };
    
    if ("permissions" in navigator) {
        const result = await navigator.permissions.query({ name: "geolocation" });
        if (result.state === "prompt") app.HTMLElements.location.innerText = "We need access to your location to show the weather in your area.";
        else if (result.state === "denied") app.HTMLElements.location.innerText = "Permission for location has been denied.";
    }

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;

            app.fetchWeather(latitude, longitude);
        });
    } else {
        app.HTMLElements.location.innerText = "Geolocation seems unavailable";
    }
});
