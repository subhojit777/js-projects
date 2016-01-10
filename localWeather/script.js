'use strict';

// Weather constructor.
function Weather() {
  this.apiKey = '4c76cb657261a125345a8a7ccc2ccc85';
  this.latitude = '';
  this.longitude = '';
  this.type = 'accurate';
  this.unitFormat = 'metric';

  this.weatherData = '';
  this.weatherCodes = '';

  this.body = $('body');
  this.loadingWrapper = $('.loading-wrapper');
  this.weatherWrapper = $('.weather-wrapper');
  this.weatherLocation = $('.weather-location');
  this.weatherTime = $('.weather-time');
  this.weatherIconImage = $('.weather-icon img');
  this.weatherTemperature = $('.weather-temperature');
  this.weatherMain = $('.weather-main');
  this.weatherWindData = $('.weather-wind-information .data');
  this.weatherHumidityData = $('.weather-humidity-information .data');
  this.weatherPressureData = $('.weather-pressure-information .data');
  this.weatherCloudsData = $('.weather-clouds-information .data');
  this.weatherRainInformation = $('.weather-rain-information');
  this.weatherRainData = $('.weather-rain-information .data');
  this.weatherSnowInformation = $('.weather-snow-information');
  this.weatherSnowData = $('.weather-snow-information .data');
  this.weatherTemperatureToggle = $('[name="temperature-toggle"]');
}

// Get weather location.
Weather.prototype.getCurrentLocation = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.getWeatherData();
    }.bind(this));
  }
}

// Get weather data.
Weather.prototype.getWeatherData = function() {
  var self = this;
  var options = {
    'lat': this.latitude,
    'lon': this.longitude,
    'APPID': this.apiKey,
    'type': this.type,
    'units': this.unitFormat
  };

  $.ajax({
    url: 'http://api.openweathermap.org/data/2.5/weather?' + $.param(options),
    dataType: 'json',
    success: function(data) {
      self.weatherData = data;
      self.showWeatherConditions();
    },
    error: function() {
      alert('Failed to get weather data');
    }
  });
}

// Load weather codes.
Weather.prototype.getWeatherCodes = function() {
  var self = this;

  $.getJSON('weathercodes.json', function(data) {
    self.weatherCodes = data;
  }).fail(function() {
    alert('Failed to load weather codes');
  });
}

// Show weather data.
Weather.prototype.showWeatherConditions = function() {
  var weatherId = this.weatherData.weather[0].id.toString();
  var iconSource = 'http://openweathermap.org/img/w/' + this.weatherData.weather[0].icon + '.png';

  this.loadingWrapper.addClass('hidden');
  this.weatherWrapper.removeClass('hidden');

  // Set background.
  if (weatherId.slice(0, 1) == '2') {
    this.body.css('background-image', 'url(' + this.weatherCodes['2xx'] + ')');
  }
  else if (weatherId.slice(0, 1) == '3') {
    this.body.css('background-image', 'url(' + this.weatherCodes['3xx'] + ')');
  }
  else if (weatherId.slice(0, 1) == '5') {
    this.body.css('background-image', 'url(' + this.weatherCodes['5xx'] + ')');
    this.weatherRainInformation.removeClass('hidden');
  }
  else if (weatherId.slice(0, 1) == '6') {
    this.body.css('background-image', 'url(' + this.weatherCodes['6xx'] + ')');
    this.weatherSnowInformation.removeClass('hidden');
  }
  else if (weatherId.slice(0, 2) == '80' && weatherId != '800') {
    this.body.css('background-image', 'url(' + this.weatherCodes['80x'] + ')');
  }
  else {
    this.body.css('background-image', 'url(' + this.weatherCodes[weatherId] + ')');
  }

  // Show weather information.
  this.weatherLocation.text(this.weatherData.name + ', ' + this.weatherData.sys.country);
  this.weatherIconImage.attr('src', iconSource);
  this.weatherTemperature.html(this.weatherData.main.temp + (this.unitFormat == 'metric' ? '&deg;C' : '&deg;F'));
  this.weatherMain.text(this.weatherData.weather[0].main);
  this.weatherWindData.text(this.weatherData.wind.speed + (this.unitFormat == 'metric' ? ' meter/sec ' : ' miles/hour ') + this.degreeToDirection(this.weatherData.wind.deg));
  this.weatherHumidityData.text(this.weatherData.main.humidity + '%');
  this.weatherPressureData.text(this.weatherData.main.pressure + ' hPa');
  this.weatherCloudsData.text(this.weatherData.clouds.all + '%');
  if (this.weatherData.rain) {
    this.weatherRainData.text(this.weatherData.rain['3h']);
  }
  if (this.weatherData.snow) {
    this.weatherRainData.text(this.weatherData.snow['3h']);
  }
}

// Convert wind degree to direction.
Weather.prototype.degreeToDirection = function(degree) {
  // http://stackoverflow.com/a/7490772/1233922
  var val = parseInt(((degree / 22.5) + 0.5), 10);
  var arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return arr[(val % 16)];
}

// Toggle unit format.
Weather.prototype.initBootstrapSwitch = function() {
  var self = this;

  this.weatherTemperatureToggle.bootstrapSwitch({
    state: self.unitFormat == 'metric' ? 'true' : 'false',
    size: 'normal',
    offColor: 'primary',
    onText: 'Metric',
    offText: 'Imperial',
    onSwitchChange: function(event, state) {
      if (!state) {
        // Load imperial unit data (fahrenheit).
        self.unitFormat = 'imperial';
        self.bootstrapSwitchLabel.text('Metric');
      }
      else {
        // Load metric unut data (celsius).
        self.unitFormat = 'metric';
          self.bootstrapSwitchLabel.text('Imperial');
      }

      self.body.css('background-image', '');
      self.loadingWrapper.removeClass('hidden');
      self.weatherWrapper.addClass('hidden');
      self.getWeatherData();
    }
  });
}

Weather.prototype.init = function() {
  this.getCurrentLocation();
  this.getWeatherCodes();
  this.initBootstrapSwitch();
  // Bootstrap switch is not initialized.
  this.bootstrapSwitchLabel = $('.bootstrap-switch-label');
}

$(document).ready(function() {
  var weather = new Weather();
  weather.init();
});
