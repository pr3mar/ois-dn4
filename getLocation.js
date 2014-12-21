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
    var markers = [];
    //var data = [];
    var string = [];
    var info = [];

    lat = position.coords.latitude;
    lon = position.coords.longitude;
    //console.log(lat, lon);
    //console.log(map);
    //var defaultLatLang = new google.maps.LatLng(46.057184, 14.506865);
    var myLatLang = new google.maps.LatLng(lat, lon);
    var min_lekarna = calculateDistance(myLatLang );
    var contentStringMyLocation = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="thirdHeading" class="thirdHeading">Your location</h1>'+
        '<div id="bodyContent">'+
        '<p><b>You are currently here!</b></p>'+
        '</div>'+
        '</div>';
    var contentStringPharmacy = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="thirdHeading" class="thirdHeading">'+min_lekarna.lekarna+'</h1>'+
        '<div id="bodyContent">'+
        '<p><b>'+min_lekarna.telefon+'</b></p>'+
        '<p><b>'+min_lekarna.odpiralni_cas+'</b></p>'+
        '<p><b>'+min_lekarna.naslov+'</b></p>'+
        '</div>'+
        '</div>';
    string.push(contentStringMyLocation);
    string.push(contentStringPharmacy);

    var infowindowMyLocation = new google.maps.InfoWindow({
        content: contentStringMyLocation,
        maxWidth: 200
    });
    var infowindowPharmacy = new google.maps.InfoWindow({
        content: contentStringPharmacy,
        maxWidth: 200
    });
    info.push(infowindowMyLocation);
    info.push(infowindowPharmacy);
    markers.push(new google.maps.Marker({
        position: myLatLang,
        map:map,
        title:'Hello!',
        animation:google.maps.Animation.DROP
    }));
    markers.push(new google.maps.Marker({
        position: new google.maps.LatLng(min_lekarna.lat,min_lekarna.lng),
        map:map,
        title:min_lekarna.lekarna,
        animation:google.maps.Animation.DROP
    }));
    markers[0].setMap(map);
    markers[1].setMap(map);
    google.maps.event.addListener(markers[0], 'click', function() {
        if (markers[0].getAnimation() != null) {
            markers[0].setAnimation(null);
        } else {
            markers[0].setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){ markers[0].setAnimation(null); }, 1500);
        }
        info[0].open(map,markers[0]);
    });
    google.maps.event.addListener(markers[1], 'click', function() {
        if (markers[1].getAnimation() != null) {
            markers[1].setAnimation(null);
        } else {
            markers[1].setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){ markers[1].setAnimation(null); }, 1500);
        }
        info[1].open(map,markers[1]);
    });
}

function calculateDistance(myLatLang) {

    var min = Number.MAX_VALUE;
    var min_lekarna = lekarne[0];
    lekarne.forEach(function (element){
        var currPharm = new google.maps.LatLng(element.lat, element.lng);
        var dist = google.maps.geometry.spherical.computeDistanceBetween(myLatLang, currPharm );
        if(min > dist) {
            min = dist;
            min_lekarna = element;
        }
    });
    //alert(dist);
    min = Math.ceil(min);
    return min_lekarna;
    //$("#error").append("<p>distance: <strong>" + min + "</strong></p>");
    //$("#error").append("<p><strong>" + myLatLang.toString() + "</strong></p>");
    //$("#error").append("<p><strong>" + min_lekarna.lekarna + "</strong></p>");
    //$("#error").append("<p><strong>" + defaultLatLang.toString() + "</strong></p>");
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
    //var myLatLang = new google.maps.LatLng(46.057184, 14.506865);
    //getLocation();
    getLocation();
}

function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
    //script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDG1IAlHePQfpdRiRkWlDzAja6q2_BTF1M'
    'callback=initialize';
    //document.body.appendChild(script);

    initialize();
}

window.onload = loadScript;
//google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addDomListener(window, "resize", function() {
    $("#map-canvas").width($("#getH").width());
    $("#map-canvas").height($("#getH").height());
    resizeGraphs();
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center);
});

/*$(document).ready(function(){
    getLocation();
})*/