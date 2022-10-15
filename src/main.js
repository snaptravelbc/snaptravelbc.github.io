
function startup() {
    let data = fetchData(); // should contain the data struct
}

function fetchData() {
    
}

// ---------------------------- //

var currentLoc = {lng: 0, lat: 0};
function showPosition(position) {
    currentLoc = {lat: position.coords.latitude, lng: position.coords.longitude};
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition, showError, {maximumAge: 0, timeout: 5000, enableHighAccuracy: true});
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}


// ---------------------------- //
// setup

getLocation();

startup();
