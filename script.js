let lon;
let lat;
let temperature = document.querySelector(".temp");
let summary = document.querySelector(".summary");
let loc = document.querySelector(".location");
let icondiv = document.querySelector(".icon-div");

window.addEventListener("load", () => {
    if (navigator.permissions) {
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
            if (result.state === "granted") loc.innerText = "Fetching...";
            else if (result.state === "prompt") loc.innerText = "We need access to your location to show the weather in your area.";
            else if (result.state === "denied") loc.innerText = "Permission for location is denied.";
        });
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;
          
            const base = "https://fcc-weather-api.glitch.me/api/current?" + `lat=${lat}&lon=${lon}`;

            fetch(base)
                .then((response) => response.json())
                .then((data) => {
                    temperature.textContent = Math.floor(data.main.temp) + "°C";
                    summary.textContent = data.weather[0].description;
                    loc.textContent = `${data.name}, ${data.sys.country}`;

                    switch (data.weather[0].main) {
                        case "Thunderstorm":
                            icondiv.innerHTML = '<div class="icon thunder-storm"><div class="cloud"></div><div class="lightning"><div class="bolt"></div><div class="bolt"></div></div></div>';
                            break;
                        case "Drizzle":
                            icondiv.innerHTML = '<div class="icon sun-shower"><div class="cloud"></div><div class="sun"><div class="rays"></div></div><div class="rain"></div></div>';
                            break;
                        case "Rain":
                            icondiv.innerHTML = '<div class="icon rainy"><div class="cloud"></div><div class="rain"></div></div>';
                            break;
                        case "Snow":
                            icondiv.innerHTML = '<div class="icon flurries"><div class="cloud"></div><div class="snow"><div class="flake"></div><div class="flake"></div></div></div>';
                            break;
                        case "Atmosphere":
                            icondiv.innerHTML = '<div class="icon sunny"><div class="sun"><div class="rays"></div></div></div>';
                            break;
                        case "Clear":
                            icondiv.innerHTML = '<div class="icon sunny"><div class="sun"><div class="rays"></div></div></div>';
                            break;
                        case "Clouds":
                            icondiv.innerHTML = '<div class="icon cloudy"><div class="cloud"></div><div class="cloud"></div></div>';
                            break;
                        default:
                            icondiv.innerHTML = "<div>Something went wrong</div>";
                    }
                });
        });
    } else {
        loc.innerText = "Geolocation seems unavailable";
    }
});
