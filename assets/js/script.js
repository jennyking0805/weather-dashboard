$(document).ready(() => {

    const apiKey = "2f5fcea3e931369adf1e874bca968965";
    
    var savedCities;
    var lastCitySearched;
    var cities = [];
    
    if (localStorage.getItem("cities")) {
        savedCities = JSON.parse(localStorage.getItem("cities"));
       
        for (var i = 0; i < savedCities.length; i++) {
            lastCitySearched = savedCities.length - 1;
            var lastCity = savedCities[lastCitySearched];
        }
    } else {
        cities;
    }
   
    renderLastCity();

$("#search-city").on("click", function (event) {
    
    event.preventDefault();
    var city = $("#city-input").val();

    var weatherURL1 =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&appid=" +
        apiKey;

    $.ajax({
        url: weatherURL1,
        method: "GET",
    }).then(function (response) {
        lat = response.coord.lat;
        lon = response.coord.lon;

        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));

        var cityList = $("<li>");
            cityList.addClass("list-group-item city-item");
            cityList.text(response.name);
            cityList.attr("lat", response.coord.lat);
            cityList.attr("lon", response.coord.lon);
            $("#city-list").prepend(cityList);

        cityList.on("click", function () {
            lat = $(this).attr("lat");
            lon = $(this).attr("lon");
            renderCityName(response);
            renderCityInfo(lat, lon);
        });
        renderCityName(response);
        renderCityInfo(lat, lon);
    });
});

function renderLastCity() {
    $("#city-list").clear;
    var weatherURL2 =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        lastCity +
        "&appid=" +
        apiKey;

    $.ajax({
        url: weatherURL2,
        method: "GET",
    }).then(function (response) {
        lat = response.coord.lat;
        lon = response.coord.lon;

        renderCityName(response);
        renderCityInfo(lat, lon);
    });
}

function renderCityName(response) {

    var currentDate = moment().format("L");
    $(".card-title").text(`${response.name} (${currentDate})`);
    
    var weatherIcon = $("<img>");
    var iconCode = response.weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
    weatherIcon.attr("src", iconUrl);
    $(".card-title").append(weatherIcon);
}

function renderCityInfo(lat, lon) {
    var weatherURL3 =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=imperial&appid=" +
        apiKey;

    $.ajax({
        url: weatherURL3,
        method: "GET",
    }).then(function (response) {

        $("#temperature").text(`Temp: ${response.current.temp} \xB0F`);
        $("#humidity").text(`Humidity: ${response.current.humidity}%`);
        $("#wind-speed").text(`Wind Speed: ${response.current.wind_speed} MPH`);
        $("#uv-index").text(`UV Index: `);

        var uviSpan = $("<span>");
        uviSpan.text(`${response.current.uvi}`);
        
        var uvi = response.current.uvi;
        if (uvi <= 3) {
            uviSpan.addClass("badge badge-success");
        } else if (uvi <= 5) {
            uviSpan.addClass("badge badge-warning");
        }  else if (uvi <= 9) {
            uviSpan.addClass("badge badge-danger");
        }
        $("#uv-index").append(uviSpan);

       
        cityForecast(response);
    });
}

function cityForecast(response) {
    $("#forecast").empty();
   var days = response.daily;

    days.slice(1, 6).map((day) => {
        var dayCard = $("<div>");
        
        dayCard.addClass("card");
        dayCard.css("background-color", "#2b4bff");
        dayCard.css("font-size", "16px");

        var dayCardBody = $("<div>");
        dayCardBody.addClass("card-body");
        dayCard.append(dayCardBody);

        var dayCardName = $("<h6>");
        dayCardName.addClass("card-title");
        
        var datestamp = moment.unix(day.dt);
        var forecastDate = datestamp.format("L");
        dayCardName.text(forecastDate);
        dayCardBody.append(dayCardName);

        var weatherIcon = $("<img>");
        var iconCode = day.weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
        weatherIcon.attr("src", iconUrl);
        dayCardBody.append(weatherIcon);

        var dayTemp = $("<p>");
        dayTemp.text(`Temp: ${day.temp.max} \xB0F`);
        dayCardBody.append(dayTemp);

        var dayHumidity = $("<p>");
        dayHumidity.text(`Humidity: ${day.humidity}%`);
        dayCardBody.append(dayHumidity);

        $("#forecast").append(dayCard);
    });
}

});