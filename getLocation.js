/**
 * Created by Марко on 09.12.2014.
 */
function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        $('#locationDemo').append("<div class=\"napaka\">update your fucking browser.</div>")
    }

}

function showPosition(position) {
    $('#locationDemo').append("<div class=\"\">" + position.coords.latitude + " " + position.coords.longitude + "</div>");
}

function initialize() {
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(-34.397, 150.644)
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
}

function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
    'callback=initialize';
    document.body.appendChild(script);
}

window.onload = loadScript;
/*$(document).ready(function(){
    getLocation();
})*/