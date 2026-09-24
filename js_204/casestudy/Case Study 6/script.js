// ==========================================
// SMART LOCATION TRACKER
// ==========================================

// Tracking variables
let watchID = null;
let currentPosition = null;
let previousPosition = null;

let totalDistance = 0;
let bestAccuracy = Infinity;

let lastApiCallPosition = null;

let geofence = null;
let geofenceCircle = null;

let locationMarker = null;
let accuracyCircle = null;
let instituteMarker = null;


// ==========================================
// SYMBIOSIS INSTITUTE
// ==========================================

// These coordinates are only used for the
// "distance from institute" feature.

const instituteLatitude = 21.1702;
const instituteLongitude = 79.0849;


// ==========================================
// HTML ELEMENTS
// ==========================================

const latitudeElement =
    document.getElementById("latitude");

const longitudeElement =
    document.getElementById("longitude");

const accuracyElement =
    document.getElementById("accuracy");

const locationNameElement =
    document.getElementById("locationName");

const movementStatusElement =
    document.getElementById("movementStatus");

const speedElement =
    document.getElementById("speed");

const distanceElement =
    document.getElementById("distance");

const trackingModeElement =
    document.getElementById("trackingMode");

const alertMessageElement =
    document.getElementById("alertMessage");

const historyListElement =
    document.getElementById("historyList");

const geofenceStatusElement =
    document.getElementById("geofenceStatus");

const radiusElement =
    document.getElementById("radius");

const emergencyResultElement =
    document.getElementById("emergencyResult");

const instituteDistanceElement =
    document.getElementById("instituteDistance");

const instituteStatusElement =
    document.getElementById("instituteStatus");


// ==========================================
// CREATE MAP
// ==========================================

const map = L.map("map").setView(
    [21.1702, 79.0849],
    14
);


// ==========================================
// OPENSTREETMAP
// ==========================================

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,

        attribution:
            "&copy; OpenStreetMap contributors"
    }
).addTo(map);


// ==========================================
// INSTITUTE MARKER
// ==========================================

instituteMarker = L.marker([
    instituteLatitude,
    instituteLongitude
]).addTo(map);

instituteMarker.bindPopup(
    "🏫 Symbiosis Institute of Technology"
);


// ==========================================
// START TRACKING
// ==========================================

document
    .getElementById("startBtn")
    .addEventListener(
        "click",
        startTracking
    );


function startTracking() {

    // Check browser support

    if (!navigator.geolocation) {

        alert(
            "Your browser does not support Geolocation."
        );

        alertMessageElement.innerText =
            "❌ Geolocation is not supported.";

        return;
    }


    // Check secure context

    if (
        location.protocol !== "https:" &&
        location.hostname !== "localhost" &&
        location.hostname !== "127.0.0.1"
    ) {

        alertMessageElement.innerText =
            "⚠️ Open this project using localhost or HTTPS.";

        return;
    }


    // Prevent duplicate tracking

    if (watchID !== null) {

        alert(
            "Tracking is already running."
        );

        return;
    }


    // Reset variables

    previousPosition = null;

    bestAccuracy = Infinity;

    lastApiCallPosition = null;


    movementStatusElement.innerText =
        "🔄 Requesting GPS...";


    trackingModeElement.innerText =
        "High Accuracy";


    alertMessageElement.innerText =
        "📡 Requesting your location...";


    console.log(
        "Starting location tracking..."
    );


    // ======================================
    // WATCH POSITION
    // ======================================

    watchID =
        navigator.geolocation.watchPosition(

            updateLocation,

            locationError,

            {

                enableHighAccuracy: true,

                maximumAge: 0,

                timeout: 30000

            }

        );

}


// ==========================================
// STOP TRACKING
// ==========================================

document
    .getElementById("stopBtn")
    .addEventListener(
        "click",
        stopTracking
    );


function stopTracking() {

    if (watchID !== null) {

        navigator.geolocation.clearWatch(
            watchID
        );

        watchID = null;


        movementStatusElement.innerText =
            "⛔ Not Tracking";


        trackingModeElement.innerText =
            "Stopped";


        alertMessageElement.innerText =
            "Location tracking stopped.";


        console.log(
            "Location tracking stopped."
        );

    } else {

        alert(
            "Tracking is not currently running."
        );

    }

}


// ==========================================
// LOCATION UPDATE
// ==========================================

function updateLocation(position) {

    console.log(
        "GPS position received:",
        position
    );


    currentPosition =
        position;


    const latitude =
        position.coords.latitude;


    const longitude =
        position.coords.longitude;


    const accuracy =
        position.coords.accuracy;


    console.log(
        "Latitude:",
        latitude
    );


    console.log(
        "Longitude:",
        longitude
    );


    console.log(
        "Accuracy:",
        accuracy
    );


    // ======================================
    // DISPLAY COORDINATES
    // ======================================

    latitudeElement.innerText =
        latitude.toFixed(6);


    longitudeElement.innerText =
        longitude.toFixed(6);


    accuracyElement.innerText =
        accuracy.toFixed(2) +
        " meters";


    // ======================================
    // ACCURACY STATUS
    // ======================================

    if (accuracy < bestAccuracy) {

        bestAccuracy =
            accuracy;

    }


    if (accuracy <= 20) {

        alertMessageElement.innerText =
            "🟢 Excellent GPS accuracy: " +
            accuracy.toFixed(0) +
            " meters.";

    }

    else if (accuracy <= 50) {

        alertMessageElement.innerText =
            "🟢 Good GPS accuracy: " +
            accuracy.toFixed(0) +
            " meters.";

    }

    else if (accuracy <= 100) {

        alertMessageElement.innerText =
            "🟡 GPS accuracy is moderate: " +
            accuracy.toFixed(0) +
            " meters.";

    }

    else {

        alertMessageElement.innerText =
            "🟠 GPS accuracy is low: " +
            accuracy.toFixed(0) +
            " meters.";

    }


    // ======================================
    // SPEED
    // ======================================

    let speed =
        position.coords.speed;


    if (
        speed !== null &&
        !isNaN(speed)
    ) {

        speed =
            speed * 3.6;

    } else {

        speed = 0;

    }


    speedElement.innerText =
        speed.toFixed(2) +
        " km/h";


    // ======================================
    // MOVEMENT
    // ======================================

    if (speed > 1) {

        movementStatusElement.innerText =
            "🟢 Moving";

    } else {

        movementStatusElement.innerText =
            "🔵 Stationary";

    }


    // ======================================
    // UPDATE MAP
    // ======================================

    updateMap(
        latitude,
        longitude,
        accuracy
    );


    // ======================================
    // DISTANCE
    // ======================================

    if (
        previousPosition !== null
    ) {

        const previousLatitude =
            previousPosition
                .coords
                .latitude;


        const previousLongitude =
            previousPosition
                .coords
                .longitude;


        const distance =
            calculateDistance(

                previousLatitude,

                previousLongitude,

                latitude,

                longitude

            );


        // Ignore GPS noise

        if (distance > 5) {

            totalDistance +=
                distance;


            distanceElement.innerText =
                formatDistance(
                    totalDistance
                );


            if (distance > 50) {

                alertMessageElement.innerText =
                    "⚠️ Location changed by " +
                    distance.toFixed(0) +
                    " meters.";

            }

        }

    }


    // ======================================
    // LOCATION HISTORY
    // ======================================

    addLocationHistory(
        latitude,
        longitude,
        accuracy
    );


    // ======================================
    // SMART TRACKING
    // ======================================

    smartTracking(
        position
    );


    // ======================================
    // GEOFENCE
    // ======================================

    checkGeofence(
        latitude,
        longitude
    );


    // ======================================
    // DISTANCE FROM INSTITUTE
    // ======================================

    calculateInstituteDistance(
        latitude,
        longitude
    );


    // ======================================
    // REVERSE GEOCODING API
    // ======================================

    getLocationName(
        latitude,
        longitude
    );


    // Save position

    previousPosition =
        position;

}


// ==========================================
// UPDATE MAP
// ==========================================

function updateMap(
    latitude,
    longitude,
    accuracy
) {

    // Create marker

    if (
        locationMarker === null
    ) {

        locationMarker =
            L.marker([
                latitude,
                longitude
            ]).addTo(map);


        locationMarker.bindPopup(
            "📍 Your Current Location"
        );


        locationMarker.openPopup();

    }

    else {

        locationMarker.setLatLng([
            latitude,
            longitude
        ]);

    }


    // Accuracy circle

    if (
        accuracyCircle === null
    ) {

        accuracyCircle =
            L.circle(

                [
                    latitude,
                    longitude
                ],

                {
                    radius:
                        accuracy
                }

            ).addTo(map);

    }

    else {

        accuracyCircle.setLatLng([
            latitude,
            longitude
        ]);


        accuracyCircle.setRadius(
            accuracy
        );

    }


    // Center map

    map.setView(
        [
            latitude,
            longitude
        ],
        17
    );

}


// ==========================================
// DISTANCE CALCULATION
// ==========================================

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const earthRadius =
        6371000;


    const latitudeDifference =
        (lat2 - lat1) *
        Math.PI /
        180;


    const longitudeDifference =
        (lon2 - lon1) *
        Math.PI /
        180;


    const latitude1 =
        lat1 *
        Math.PI /
        180;


    const latitude2 =
        lat2 *
        Math.PI /
        180;


    const a =

        Math.sin(
            latitudeDifference / 2
        ) ** 2

        +

        Math.cos(latitude1) *

        Math.cos(latitude2) *

        Math.sin(
            longitudeDifference / 2
        ) ** 2;


    const c =

        2 *
        Math.atan2(

            Math.sqrt(a),

            Math.sqrt(1 - a)

        );


    return earthRadius * c;

}


// ==========================================
// FORMAT DISTANCE
// ==========================================

function formatDistance(
    distance
) {

    if (
        distance < 1000
    ) {

        return (
            distance.toFixed(0) +
            " m"
        );

    }


    return (
        (distance / 1000)
        .toFixed(2) +
        " km"
    );

}


// ==========================================
// LOCATION HISTORY
// ==========================================

function addLocationHistory(
    latitude,
    longitude,
    accuracy
) {

    if (
        historyListElement.innerText ===
        "No location history yet."
    ) {

        historyListElement.innerHTML =
            "";

    }


    const item =
        document.createElement(
            "div"
        );


    item.className =
        "history-item";


    const time =
        new Date()
            .toLocaleTimeString();


    item.innerText =

        time +

        " → " +

        latitude.toFixed(6) +

        ", " +

        longitude.toFixed(6) +

        " | Accuracy: " +

        accuracy.toFixed(0) +

        "m";


    historyListElement.prepend(
        item
    );


    // Maximum 20 records

    while (
        historyListElement
            .children
            .length > 20
    ) {

        historyListElement
            .removeChild(
                historyListElement.lastChild
            );

    }

}


// ==========================================
// SMART TRACKING
// ==========================================

function smartTracking(
    position
) {

    const speed =
        position.coords.speed;


    if (
        speed !== null &&
        speed > 1
    ) {

        trackingModeElement.innerText =
            "High Accuracy";

    }

    else {

        trackingModeElement.innerText =
            "Normal";

    }

}


// ==========================================
// REVERSE GEOCODING API
// ==========================================

async function getLocationName(
    latitude,
    longitude
) {


    // Don't make API requests for
    // very small movements.

    if (
        lastApiCallPosition !== null
    ) {


        const distance =
            calculateDistance(

                lastApiCallPosition.latitude,

                lastApiCallPosition.longitude,

                latitude,

                longitude

            );


        if (
            distance < 100
        ) {

            return;

        }

    }


    lastApiCallPosition = {

        latitude:
            latitude,

        longitude:
            longitude

    };


    try {


        locationNameElement.innerText =
            "Getting address from API...";


        const apiURL =

            "https://nominatim.openstreetmap.org/reverse" +

            "?format=json" +

            "&lat=" +
            latitude +

            "&lon=" +
            longitude;


        const response =
            await fetch(
                apiURL
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "API request failed"
            );

        }


        const data =
            await response.json();


        if (
            data.display_name
        ) {

            locationNameElement.innerText =
                data.display_name;

        }

        else {

            locationNameElement.innerText =
                "Address not found";

        }

    }

    catch (error) {

        console.error(
            "Reverse Geocoding API Error:",
            error
        );


        locationNameElement.innerText =
            "Address API unavailable";

    }

}


// ==========================================
// DISTANCE FROM INSTITUTE
// ==========================================

function calculateInstituteDistance(
    latitude,
    longitude
) {


    const distance =
        calculateDistance(

            latitude,

            longitude,

            instituteLatitude,

            instituteLongitude

        );


    instituteDistanceElement.innerText =
        formatDistance(
            distance
        );


    if (
        distance <= 200
    ) {

        instituteStatusElement.innerText =
            "🟢 You are near the institute.";

    }

    else {

        instituteStatusElement.innerText =
            "🔵 You are away from the institute.";

    }

}


// ==========================================
// SET GEOFENCE
// ==========================================

document
    .getElementById(
        "setGeofenceBtn"
    )
    .addEventListener(
        "click",
        setGeofence
    );


function setGeofence() {


    if (
        currentPosition === null
    ) {

        alert(
            "Start tracking first."
        );

        return;

    }


    const radius =
        Number(
            radiusElement.value
        );


    if (
        radius < 10
    ) {

        alert(
            "Radius must be at least 10 meters."
        );

        return;

    }


    const latitude =
        currentPosition
            .coords
            .latitude;


    const longitude =
        currentPosition
            .coords
            .longitude;


    geofence = {

        latitude:
            latitude,

        longitude:
            longitude,

        radius:
            radius

    };


    // Remove previous circle

    if (
        geofenceCircle !== null
    ) {

        map.removeLayer(
            geofenceCircle
        );

    }


    // Draw new geofence

    geofenceCircle =
        L.circle(

            [
                latitude,
                longitude
            ],

            {
                radius:
                    radius
            }

        ).addTo(map);


    geofenceStatusElement.innerText =

        "🟢 Geofence set for " +

        radius +

        " meters.";

}


// ==========================================
// CHECK GEOFENCE
// ==========================================

function checkGeofence(
    latitude,
    longitude
) {


    if (
        geofence === null
    ) {

        return;

    }


    const distance =
        calculateDistance(

            geofence.latitude,

            geofence.longitude,

            latitude,

            longitude

        );


    if (
        distance <=
        geofence.radius
    ) {

        geofenceStatusElement.innerText =
            "🟢 You are inside the geofence.";

    }

    else {

        geofenceStatusElement.innerText =
            "🔴 You left the geofence!";

    }

}


// ==========================================
// EMERGENCY LOCATION
// ==========================================

document
    .getElementById(
        "emergencyBtn"
    )
    .addEventListener(
        "click",
        emergencyLocation
    );


function emergencyLocation() {


    if (
        currentPosition === null
    ) {

        alert(
            "Start tracking first."
        );

        return;

    }


    const latitude =
        currentPosition
            .coords
            .latitude;


    const longitude =
        currentPosition
            .coords
            .longitude;


    const mapLink =

        "https://www.google.com/maps?q=" +

        latitude +

        "," +

        longitude;


    emergencyResultElement.innerHTML =

        "Latitude: " +

        latitude.toFixed(6) +

        "<br>" +

        "Longitude: " +

        longitude.toFixed(6) +

        "<br><br>" +

        "<a href='" +

        mapLink +

        "' target='_blank'>" +

        "📍 Open Current Location in Google Maps" +

        "</a>";

}


// ==========================================
// LOCATION ERROR
// ==========================================

function locationError(
    error
) {

    console.error(
        "Geolocation error:",
        error
    );


    if (
        error.code ===
        error.PERMISSION_DENIED
    ) {

        movementStatusElement.innerText =
            "❌ Permission Denied";


        alertMessageElement.innerText =
            "❌ Location permission was denied. Click the lock icon near the browser address bar and allow Location.";

    }


    else if (
        error.code ===
        error.POSITION_UNAVAILABLE
    ) {

        movementStatusElement.innerText =
            "❌ GPS Unavailable";


        alertMessageElement.innerText =
            "❌ GPS location is unavailable. Check your device location settings.";

    }


    else if (
        error.code ===
        error.TIMEOUT
    ) {

        movementStatusElement.innerText =
            "⏳ GPS Timeout";


        alertMessageElement.innerText =
            "⏳ GPS took too long. Trying to obtain another location...";

    }


    else {

        movementStatusElement.innerText =
            "❌ Location Error";


        alertMessageElement.innerText =
            "❌ Unable to get your location.";

    }

}
