// Initialize Firebase
var config = {
    apiKey: "AIzaSyBx9VgPDcirdmm21Is_ujENdjE-drKwtD8",
    authDomain: "hubspace-01.firebaseapp.com",
    databaseURL: "https://hubspace-01.firebaseio.com",
    projectId: "hubspace-01",
    storageBucket: "hubspace-01.appspot.com",
    messagingSenderId: "806359360193"
};
firebase.initializeApp(config);

function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 13.880788, lng: 100.467057 },
        zoom: 7,
        mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    //map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    $("#placesearchform").submit(function (e) {
        e.preventDefault();
        google.maps.event.trigger(input, 'focus')
        google.maps.event.trigger(input, 'keydown', { keyCode: 13 });
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

function openModalSupport() {
    $('.support.modal')
        .modal('show')
        ;
}

function cancelSupportModal() {
    $('.support.modal')
        .modal('hide')
        ;
}

$("#support_form").submit(function (e) {
    e.preventDefault();
    var message = $('#support_message').val();
    var phoneNumber = $('#support_phonenumber').val();

    var supportRef = firebase.database().ref('CustomerSupport/');
    var newPostRef = supportRef.push();
    newPostRef.set({
        phoneNumber: phoneNumber,
        message: message
    }).then(function (result) {
        alert("ได้รับข้อมูลเรียบร้อยแล้วค่ะ ทางทีมงานจะติดต่อกลับภายใน 24 ชม.");
        $('#support_message').val("");
        $('#support_phonenumber').val("");
        $('.support.modal')
            .modal('hide')
            ;
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
    });
});
