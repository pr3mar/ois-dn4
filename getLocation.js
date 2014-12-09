/**
 * Created by Марко on 09.12.2014.
 */
var lat, lon;
var map;

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        $('#locationDemo').append("<div class=\"napaka\">update your fucking browser.</div>");
    }
}
function showPosition(position) {
    //$('#locationDemo').append("<div class=\"\">" + position.coords.latitude + " " + position.coords.longitude + "</div>");
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    //console.log(lat, lon);
    //console.log(map);
    var myLatLang = new google.maps.LatLng(lat, lon);
    var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="thirdHeading" class="thirdHeading">Your location</h1>'+
        '<div id="bodyContent">'+
        '<p><b>You are currently here!</b></p>'+
        '</div>'+
        '</div>';
    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 200
    });

    marker = new google.maps.Marker({
        position: myLatLang,
        map:map,
        title:'Hello!',
        animation:google.maps.Animation.DROP
    });
    marker.setMap(map);

    google.maps.event.addListener(marker, 'click', function() {
        if (marker.getAnimation() != null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){ marker.setAnimation(null); }, 1500);
        }
        infowindow.open(map,marker);
    });
}

function showError(err) {
    switch (err.code) {
        case err.PERMISSION_DENIED:
            $("#error").append("<p>permission denied</p>");
            break;
        case err.POSITION_UNAVAILABLE:
            $("#error").append("<p>location unavailable</p>");
            break;
        case err.TIMEOUT:
            $("#error").append("<p>timeout</p>");
            break;
        case err.UNKNOWN_ERR:
            $("#error").append("<p>what the hell did you do??</p>");
            break;
    }
}

function initialize() {
    var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(46.057184, 14.506865)
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var myLatLang = new google.maps.LatLng(46.057184, 14.506865);
    //getLocation();
    getLocation();
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