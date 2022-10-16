
let timeAtDestinationMins = 60;

let cors = "https://unique-shoe.glitch.me/"

// api call to get weather info from lat lng
async function userAction(lat, lng) {
  const response = await fetch(cors+'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lng+'&appid=9b4544f441703c4586ea9c71d952ea5e', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
    //console.log(data.weather[0].main)
    //document.getElementById("sky").innerHTML = data.weather[0].main
    //document.getElementById("temp").innerHTML = data.main.temp-273.15
}

// ----------------------------- // 

function startup() {
    let data = fetchData(); // should contain the data struct

    let card = createLocationCard("Sunny", "15 degrees", true, "Bunsen Lake", 20, "11km", 20, "11km", new Date((new Date()).getTime() + 20*60000));
    var travel = document.getElementById("travel-box");
    var food = document.getElementById("food-box");


    travel.innerHTML = "<h2>Travel</h2>"
    travel.innerHTML += card;
    travel.innerHTML += card;
    travel.innerHTML += card;

    food.innerHTML = "<h2>Food</h2>"
    food.innerHTML = "<div style=\"margin: auto;\"class=\"lds-ripple\"><div></div><div></div></div>";
    
    // wait...
    
    //food.innerHTML = "<p>food</p>"
    //food.innerHTML += card;
}

function fetchData() {
    
}

//console.log(createLocationCardS("Sunny", "15 degrees", true, "Bunsen Lake", 20, "40km", 20, "40km", new Time()));
function createLocationCard(weather, temperature, isBus, destination, timeToDestinationMins, distanceToDestination, timeToHomeMins, distanceToHome, leaveAt) {
    let totalTime = timeToDestinationMins + timeAtDestinationMins + timeToHomeMins;
    
    var today = new Date();
    //var time = today.getHours() + ":" + today.getMinutes()

    let outstr = "";

    outstr += "<div class=\"location-card\" style=\"margin-bottom: 16px;\">";
    outstr += "<p style=\"float: right; font-size: 18px;\"><b>" + (isBus ? "(bus)" : "(walking)") + "</b></p>";
    outstr += "<p style=\"font-size: 18px; float: left;\">" + destination + " — trip length: " + totalTime + "m — ETA: " + timeToDestinationMins + "m (" + distanceToDestination + ")</p>";
    outstr += "<p style=\"float: right; font-size: 18px;\"><b>Leave in " + ((Math.abs(leaveAt - today) / 1000) / 60) + "m</b></p>"; // TODO: this
    outstr += "<p style=\"font-size: 18px; float: left;\">" + weather + " | " + temperature +  "</p>";
    outstr += "</div>";
    
    return outstr;
}

// ---------------------------- //

var currentLoc = {lng: 0, lat: 0};
function showPosition(position) {
    currentLoc = {lat: position.coords.latitude, lng: position.coords.longitude};
}

function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.<br> On ios, go to settings, location services, and make sure it's set to 'Ask Next Time Or When I Share', with 'Precise Location' enabled");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable");
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out");
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred");
        break;
    }
}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition, showError, {maximumAge: 2000, timeout: 5000, enableHighAccuracy: true});
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

// ---------------------------- //
// event functions


// ---------------------------- //
// setup

getLocation();

startup();

console.log(createLocationCard("Sunny", "15 degrees", true, "Bunsen Lake", 20, "11km", 20, "11km", new Date((new Date()).getTime() + 20*60000)));

