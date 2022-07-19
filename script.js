window.addEventListener("DOMContentLoaded", async () => {
  const app = {
    data: {
      celsius: "",
      fahr: "",
      summary: "",
      location: "",
      type: "",
      useCelsius: true,
      weatherSuccess: false
    },
    HTMLElements: {
      temperature: document.querySelector(".temp"),
      summary: document.querySelector(".summary"),
      location: document.querySelector(".location"),
      icon: document.querySelector(".icon-div"),
    },
    displayUI() {
      this.HTMLElements.temperature.innerText = this.data.useCelsius ? this.data.celsius : this.data.fahr;
      this.HTMLElements.summary.innerText = this.data.summary;
      this.HTMLElements.location.innerText = this.data.location;
    },
    displayIcon() {
      const { icon } = this.HTMLElements;
      switch (this.data.type.toLowerCase()) {
        case "thunderstorm":
          icon.innerHTML = '<div class="icon thunder-storm"><div class="cloud"></div><div class="lightning"><div class="bolt"></div><div class="bolt"></div></div></div>';
          break;
        case "drizzle":
          icon.innerHTML = '<div class="icon sun-shower"><div class="cloud"></div><div class="sun"><div class="rays"></div></div><div class="rain"></div></div>';
          break;
        case "rain":
          icon.innerHTML = '<div class="icon rainy"><div class="cloud"></div><div class="rain"></div></div>';
          break;
        case "snow":
          icon.innerHTML = '<div class="icon flurries"><div class="cloud"></div><div class="snow"><div class="flake"></div><div class="flake"></div></div></div>';
          break;
        case "atmosphere":
          icon.innerHTML = '<div class="icon sunny"><div class="sun"><div class="rays"></div></div></div>';
          break;
        case "clear":
          icon.innerHTML = '<div class="icon sunny"><div class="sun"><div class="rays"></div></div></div>';
          break;
        case "clouds":
          icon.innerHTML = '<div class="icon cloudy"><div class="cloud"></div><div class="cloud"></div></div>';
          break;
        default:
          icon.innerHTML = "<div>Something went wrong</div>";
      }
    },
    changeFormat() {
      if (!this.data.weatherSuccess) return;
      
      this.data.useCelsius = this.data.useCelsius ? false : true;
      if (this.data.useCelsius) {
        document.querySelector(".fahrenheit").style.color = "grey";
        document.querySelector(".celsius").style.color = "white";
      } else {
        document.querySelector(".fahrenheit").style.color = "white";
        document.querySelector(".celsius").style.color = "grey";
      }
      this.displayUI();
    },
    async fetchWeather(latitude, longitude) {
      const base = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&` + `lon=${longitude}&appid=6d055e39ee237af35ca066f35474e9df`;

      const response = await fetch(base);
      const data = await response.json();

      this.data.celsius = Math.floor(data.main.temp - 273) + "°C";
      this.data.fahr = Math.floor((data.main.temp - 273) * 1.8 + 32) + "°F";
      this.data.location = `${data.name}, ${data.sys.country}`;
      this.data.summary = data.weather[0].description;
      this.data.type = data.weather[0].main;

      this.displayUI();
      this.displayIcon();

      this.data.weatherSuccess = true;
    },
  };

  document.querySelector(".toggle").addEventListener("click", app.changeFormat.bind(app));

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
