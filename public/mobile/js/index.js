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
var database = firebase.database();
var HubRef = database.ref("Hub");
var DATA = [];

//If user use mobile device.
if(!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
  window.location = "../index.html"
}

// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 13.880788, lng: 100.467057},
    zoom: 13,
    disableDefaultUI: true,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];

  //Initial map from firebase.
  HubRef.orderByValue().once("value", function(snapshot) {
    snapshot.forEach(function(data) {
      var d = getDistance(new google.maps.LatLng( data.val().lat, data.val().lng) , map.getCenter())/1000;
      var distanceFloat = parseFloat(d).toFixed(2);
      DATA.push(data);
      var promotion = "";
      var promotionHtml = `ร้านนี้ยังไม่มีโปรโมชั่น`;
      if(data.val().promotion != "")
      {
        promotion =
        `
        <div class="tags has-addons">
        <span class="tag is-danger">มีโปรโมชั่น</span>
        <a class="tag is-danger"><i class="fa fa-tags" aria-hidden="true"></i></a>
        </div>
        `;

        promotionHtml = data.val().promotion;
      }

      var services = [];
      services[1]  = data.val().service1;
      services[2]  = data.val().service2;
      services[3]  = data.val().service3;
      services[4]  = data.val().service4;
      services[5]  = data.val().service5;
      services[6]  = data.val().service6;
      services[7]  = data.val().service7;
      services[8]  = data.val().service8;
      services[9]  = data.val().service9;
      services[10] = data.val().service10;
      services[11] = data.val().service11;
      for(j=1;j<=10;j++)
      {
        if(j == 1)
        {
          services[j]  = (`${services[j]}`);
          break;
        }
        if(services[j] != "")
        {
          services[j]  = (` , ${services[j]}`);
        }
      }
      services = services.join("");
      var str = String(services);

      var name = data.val().name;
      var logo = data.val().logo;
      var picture1 = data.val().picture1;
      var address = "เลขที่" +  data.val().number +
      "หมู่ที่"+ data.val().villageno  +
      "ซอย"+data.val().lane +
      "ถนน"+ data.val().street +
      "ตำบล"+ data.val().subdistrict +
      "อำเภอ"+ data.val().district +
      "จังหวัด+" + data.val().province +
      "รหัสไปรษณีย์"+ data.val().postcode +
      ", เบอร์โทร"+ data.val().phone ;

      $('#listing').append(`
        <article class="media" onclick="listingDetail('${name}','${logo}','${picture1}','${address}','${promotionHtml}','${services}')">
        <figure class="media-left">
        <p class="image is-64x64">
        <img src="${data.val().logo}">
        </p>
        </figure>
        <div class="media-content">
        <div class="content">
        <p>
        <strong>${data.val().name}</strong><br>
        <small>ระยะทาง: ${distanceFloat} กม.</small>
        ${promotion}
        </p>
        </div>
        </div>
        `);

        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(data.val().lat,data.val().lng),
          map: map,
          animation: google.maps.Animation.DROP
        });

        marker.addListener('click', function() {
          listingDetail(name,logo,picture1,address,promotionHtml,services);
        });
      });
    }).then(function(result) {

      map.addListener('bounds_changed', function() {
        var D = [];
        for(i=0;i<DATA.length;i++)
        {
          var d = getDistance(new google.maps.LatLng( DATA[i].val().lat, DATA[i].val().lng) , map.getCenter())/1000;
          var distanceFloat = parseFloat(d).toFixed(2);
          D.push(distanceFloat);
        }
        sortWithIndeces(D);
        D = D.sortIndices.join("");

        $('#listing').html(``);
        for(i=0;i<D.length;i++)
        {
          var promotion = "";
         var promotionHtml = `ร้านนี้ยังไม่มีโปรโมชั่น`;
         if(DATA[D[i]].val().promotion != "")
         {
           promotion =
           `
           <div class="tags has-addons">
           <span class="tag is-danger">มีโปรโมชั่น</span>
           <a class="tag is-danger"><i class="fa fa-tags" aria-hidden="true"></i></a>
           </div>
           `;

           promotionHtml = DATA[D[i]].val().promotion;
         }

         var services = [];
         services[1]  = DATA[D[i]].val().service1;
         services[2]  = DATA[D[i]].val().service2;
         services[3]  = DATA[D[i]].val().service3;
         services[4]  = DATA[D[i]].val().service4;
         services[5]  = DATA[D[i]].val().service5;
         services[6]  = DATA[D[i]].val().service6;
         services[7]  = DATA[D[i]].val().service7;
         services[8]  = DATA[D[i]].val().service8;
         services[9]  = DATA[D[i]].val().service9;
         services[10] = DATA[D[i]].val().service10;
         services[11] = DATA[D[i]].val().service11;
         for(j=1;j<=11;j++)
         {
           if(j == 1)
           {
             services[j]  = (`${services[j]}`);
             break;
           }
           if(services[j] != "")
           {
             services[j]  = (` , ${services[j]}`);
           }
         }
         services = services.join("");
         var str = String(services);

         var name = DATA[D[i]].val().name;
         var logo = DATA[D[i]].val().logo;
         var picture1 = DATA[D[i]].val().picture1;
         var address = "เลขที่" +  DATA[D[i]].val().number +
         "หมู่ที่"+ DATA[D[i]].val().villageno  +
         "ซอย"+DATA[D[i]].val().lane +
         "ถนน"+ DATA[D[i]].val().street +
         "ตำบล"+ DATA[D[i]].val().subdistrict +
         "อำเภอ"+ DATA[D[i]].val().district +
         "จังหวัด+" + DATA[D[i]].val().province +
         "รหัสไปรษณีย์"+ DATA[D[i]].val().postcode +
         ", เบอร์โทร"+ DATA[D[i]].val().phone ;

         $('#listing').append(`
           <article class="media" onclick="listingDetail('${name}','${logo}','${picture1}','${address}','${promotionHtml}','${services}')">
           <figure class="media-left">
           <p class="image is-64x64">
           <img src="${DATA[D[i]].val().logo}">
           </p>
           </figure>
           <div class="media-content">
           <div class="content">
           <p>
           <strong>${DATA[D[i]].val().name}</strong><br>
           <small>ระยะทาง: ${distanceFloat} กม.</small>
           ${promotion}
           </p>
           </div>
           </div>
           `);
        }
      });

    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
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


  function listingDetail(name,logo,picture1,address,promotionHtml,services){
    $(".placeListing").css("height", "70vh");
    $("#listing").css("display", "none");
    $("#listingDetail").css("display", "block");
    $("#HeaderListing").css("display", "none")

    $('#listingDetail').html(
      `
      <a class="button is-black" onclick="back()">ย้อนกลับ</a><br><br>
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <img src="${logo}" alt="${name}">
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">${name}</p>
        </div>
      </div>
      <div class="card-image">
        <figure class="image is-4by3">
          <img src="${picture1}" alt="${name}">
        </figure>
      </div>
      <br>

      <div class="content">
        <p>
          <strong>ที่อยู่</strong>
          <br>
        ${address}
        </p>
        <br>
        <strong>บริการที่เปิด</strong>
        <p>
          ${services}
        </p>
        <br>
        <strong>โปรโมชั่น</strong>
        <p>
          ${promotionHtml}
        </p>
        </div>
      `);
  }

  function back(){
    $("#listing").css("display", "block");
    $("#listingDetail").css("display", "none");
    $(".placeListing").css("height", "30vh");
    $("#HeaderListing").css("display", "block")
  }

  var getDistance = function(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.lat() - p1.lat());
    var dLong = rad(p2.lng() - p1.lng());
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
  }

  var rad = function(x) {
    return x * Math.PI / 180;
  }

  function sortWithIndeces(toSort) {
    for (var i = 0; i < toSort.length; i++) {
      toSort[i] = [toSort[i], i];
    }
    toSort.sort(function(left, right) {
      if (left[0] === right[0]) {
        return 0;
      }
      else {
        return (left[0] < right[0]) ? -1 : 1;
      }
    });
    toSort.sortIndices = [];
    for (var j = 0; j < toSort.length; j++) {
      toSort.sortIndices.push(toSort[j][1]);
      toSort[j] = toSort[j][0];
    }
    return toSort;
  }
