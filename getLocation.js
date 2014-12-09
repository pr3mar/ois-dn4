/**
 * Created by Марко on 09.12.2014.
 */
var lat, lon;

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        $('#locationDemo').append("<div class=\"napaka\">update your fucking browser.</div>");
    }

}

function showPosition(position) {
    //$('#locationDemo').append("<div class=\"\">" + position.coords.latitude + " " + position.coords.longitude + "</div>");
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    //console.log(lat, lon);
}

function initialize(position) {
    var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(46.057184, 14.506865)
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var myLatLang = new google.maps.LatLng(46.057184, 14.506865);
    //getLocation();
    console.log(lat, lon);
    if(lat != undefined && lon != undefined) {
        myLatLang =  new google.maps.LatLng(lat, lon);
    }

    var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="secondHeading" class="secondHeading">Your location</h1>'+
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
        title:'Hello!'
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
    });
}

function loadScript() {
    getLocation();
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