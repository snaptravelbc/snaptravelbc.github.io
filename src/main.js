
let timeAtDestinationMins = 60;

// ----------------------------- // 

function startup() {
    let data = fetchData(); // should contain the data struct

    //let card = createLocationCard("Sunny", "15 degrees", true, "Bunsen Lake", 20, "11km", 20, "11km", new Date((new Date()).getTime() + 20*60000));
    var travel = document.getElementById("travel-box");
    var food = document.getElementById("food-box");


    //travel.innerHTML += card;
    //travel.innerHTML += card;
   // travel.innerHTML += card;
    //food.innerHTML += card;


}

function fetchData() {
    
}

//console.log(createLocationCardS("Sunny", "15 degrees", true, "Bunsen Lake", 20, "40km", 20, "40km", new Time()));
function createLocationCard(weather, temperature, isBus, destination, timeToDestinationMins, distanceToDestination, timeToHomeMins, distanceToHome) {
    let totalTime = timeToDestinationMins + timeAtDestinationMins + timeToHomeMins;
    
    var today = new Date();
    //var time = today.getHours() + ":" + today.getMinutes()

    let outstr = "";

    outstr += "<div class=\"location-card\" style=\"margin-bottom: 16px;\">";
    outstr += "<p style=\"float: right; font-size: 18px;\"><b>" + (isBus ? "(bus)" : "(walking)") + "</b></p>";

    outstr += "<p style=\"font-size: 18px;\">" + destination + " — <span style=\"color: orange\">ETA: " + timeToDestinationMins + "</span> (" + distanceToDestination + ")</p>";
    //outstr += "<p style=\"float: right; font-size: 18px;\"><b>Leave in " + ((Math.abs(leaveAt - today) / 1000) / 60) + "m</b></p>"; // TODO: this
    outstr += "<p style=\"font-size: 18px;\">" + weather + " | " + temperature +  "</p>";

    outstr += "</div>";
    
    return outstr;
}

// ---------------------------- //

var currentLoc = {lng: 0, lat: 0};
function showPosition(position) {
    currentLoc = {lat: position.coords.latitude, lng: position.coords.longitude};
    map.setCenter(currentLoc);
    getNearbyPlaces();
    console.log(currentLoc.lat, currentLoc.lng);
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
        // navigator.geolocation.watchPosition(showPosition, showError, {maximumAge: 2000, timeout: 5000, enableHighAccuracy: true});
        navigator.geolocation.getCurrentPosition(showPosition, showError, {maximumAge: 2000, timeout: 5000, enableHighAccuracy: true});
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

// console.log(createLocationCard("Sunny", "15 degrees", true, "Bunsen Lake", 20, "11km", 20, "11km", new Date((new Date()).getTime() + 20*60000)));

//set map options
var myLatLng = {
  lat: currentLoc.lat,
  lng: currentLoc.lng
}
var mapOptions = {
  center: myLatLng,
  zoom: 7,
  mapTypeId: google.maps.MapTypeId.ROADMAP
}
var bounds = new google.maps.LatLngBounds();

//create map
// var map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
var map = new google.maps.Map(document.getElementById('googleMap'), {
  center: myLatLng,
  zoom: 11
})

/**
* Direction service object
*/
var directionsService = new google.maps.DirectionsService()

/**
* Render the direction  objetc
*/
var directionsDisplay = new google.maps.DirectionsRenderer()

/**
* Display the directions on the map by bindng the directions service to the map service
*/
directionsDisplay.setMap(map)

/**
* Calculation of distance between origin to destinanyion
*
*/
var distanceOutput = [];
function calculateDistance(origin, destination, index) {
  /**
   * Creating a new request
   */
  var request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
      unitSystem: google.maps.UnitSystem.IMPERIAL
  }

  

  /**
   * Pass the created request to the route method
   */

  directionsService.route(request, function (result, status) {
    directionsDisplay.setDirections({
      routes: []
  })
      if (status == google.maps.DirectionsStatus.OK) {
          console.log('CHECKING RESULT')
          console.log(result)

          /**
           * Get distance and time then display on the map
           */
          // const output = document.querySelector('travel-box')
          var distance = result.routes[0].legs[0].distance.text;
          var time = result.routes[0].legs[0].duration.text;
          var result_dist = {
            distance: distance,
            time: time
          }
          // output.innerHTML =
          //     "<p class='alert-success'>From: " +
          //     document.getElementById('origin').value +
          //     '</br>' +
          //     'To: ' +
          //     document.getElementById('destination').value +
          //     '</br>' +
          //     "Driving distance <i class='fas fa-road'></i> : " +
          //     result.routes[0].legs[0].distance.text +
          //     '</br>' +
          //     " Duration <i class='fas fa-clock'></i> : " +
          //     result.routes[0].legs[0].duration.text +
          //     '.</p>'
          
          /**
           * Display the obtained route
           */
          directionsDisplay.setDirections(result)
          //console.log(result_dist);
          distanceOutput[index] = (result_dist);
      } else {
          /**
           * Eliminate route from the map
           */
          directionsDisplay.setDirections({
              routes: []
          })

          /**
           * Centre the map to my current location
           */
          // map.setCenter(currentLoc)

          /**
           * show error message in case there is any
           */
          // output.innerHTML =
          //     "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>"
      }
  })
}

function getNearbyPlaces() {
  let request = {
      location: currentLoc,
      radius: '10000',
      keyword: ['restaurant', 'park', 'theatres', 'malls'],
  }

  service = new google.maps.places.PlacesService(map)
  service.nearbySearch(request, nearbyCallback)
}

// Handle the results (up to 20) of the Nearby Search
function nearbyCallback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMarkers(results)
      console.log("NEARBY SEARCH RESULT")
      console.log(results)
  }
}

function displayLocation(latitude,longitude){
  var request = new XMLHttpRequest();

  var method = 'GET';
  var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true';
  var async = true;

  request.open(method, url, async);
  request.onreadystatechange = function(){
    if(request.readyState == 4 && request.status == 200){
      var data = JSON.parse(request.responseText);
      var address = data.results[0];
      console.log("PLACE NAME")
      console(address.formatted_address);
    }
  };
  request.send();
};

var tmpPlaces = null;

/* TODO: Step 3C, Generate markers for search results */
// Set markers at the location of each place result
function createMarkers(places) {
  distanceOutput = [];
  let i = 0;
  // const placesList = document.getElementById("places");
  for (const place of places) {
      if (place.geometry && place.geometry.location) {
      distanceOutput.push(null);
          const image = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25),
          };
  
          new google.maps.Marker({
              map,
              icon: image,
              title: place.name,
              position: place.geometry.location,
          });
  
          const li = document.createElement("li");
  
          li.textContent = place.name;
          // placesList.appendChild(li);
  
          li.addEventListener("click", () => {
              map.setCenter(place.geometry.location);
          });
          bounds.extend(place.geometry.location);

          // displayLocation(currentLoc.lat, currentLoc.lng);
          console.log(currentLoc, place.name);
          var details = calculateDistance(currentLoc, place.name, i);
          console.log(details);

            i++;
        }
    }
    console.log("IN LOO 2 P");

    tmpPlaces = places;
  do_function();

  map.fitBounds(bounds)
}

function do_function() {
let i = 0;
console.log("IN LOO 1 P");

    for (const place of tmpPlaces) {
      if (place.geometry && place.geometry.location) {
        let details = distanceOutput[i];
        if (details == null) {
          setTimeout(do_function, 100);
          return;
        }
        console.log("IN LOOP");
         let card = createLocationCard("Sunny", "40", "false", place.name, details.time, details.distance, details.time, details.distance);
    let travel = document.getElementById("travel-box");
    let food = document.getElementById("food-box");

    travel.innerHTML += card;
        
        i++;
      }
    }
}