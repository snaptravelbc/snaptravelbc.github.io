//set map options
var myLatLng = { lat: 49.2827, lng: -123.1207 };
var mapOptions = {
    center: myLatLng,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP

};

//create map
// var map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
map = new google.maps.Map(document.getElementById("googleMap"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
});

/**
 * Direction service object
 */
var directionsService = new google.maps.DirectionsService();

/**
 * Render the direction  objetc
 */
var directionsDisplay = new google.maps.DirectionsRenderer();

/**
 * Display the directions on the map by bindng the directions service to the map service
 */
directionsDisplay.setMap(map);

/**
 * Calculation of distance between origin to destinanyion
 * 
 */

function calculateDistance(){
    /**
     * Creating a new request
     */
    var request = {
        origin: document.getElementById("origin").value,
        destination: document.getElementById("destination").value,
        travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }

    /**
     * Pass the created request to the route method
     */

     directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {

            console.log("CHECKING RESULT");
            console.log(result);

            /**
             * Get distance and time then display on the map
             */
            const output = document.querySelector('#output');
            output.innerHTML = "<p class='alert-success'>From: " + document.getElementById("origin").value + "</br>" +"To: " + document.getElementById("destination").value + "</br>"+"Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text +"</br>"+ " Duration <i class='fas fa-clock'></i> : " + result.routes[0].legs[0].duration.text + ".</p>";

            /**
             * Display the obtained route
             */
            directionsDisplay.setDirections(result);
        } else {
            /**
             * Eliminate route from the map
             */
            directionsDisplay.setDirections({ routes: [] });
            
            /**
             * Centre the map to my current location
             */
            map.setCenter(myLatLng);

            /**
             * show error message in case there is any
             */
            output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
        }
    });
}

/**
 * Add autocomplete feature for cities
 */
var options = {
    types: ['(cities)'],
    componentRestrictions: {country: "ke"}
}

var input1 = document.getElementById("origin");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);

var input2 = document.getElementById("destination");
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);
google.maps.event.removeListener(autocomplete1);
google.maps.event.removeListener(autocomplete2);