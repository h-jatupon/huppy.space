// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var map;
var markers = [];
function initAutocomplete() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(-33.92, 151.25),
    zoom: 2,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });


  /* Firebase Load hub */
  map.addListener('bounds_changed', function() {
    var DATA = [];
    var HubRef = database.ref("Hub");
    HubRef.orderByValue().once("value", function(snapshot) {
      snapshot.forEach(function(data) {
        var d = getDistance(new google.maps.LatLng( data.val().lat, data.val().lng) , map.getCenter())/1000;
        DATA.push([data.key , data.val() , d]);
      });
    }).then(function(result) {

      //min to max
      DATA = DATA.sort(sortFunction);

      //--------- MARKERS --------------
      $("#sideItem").html(``);
      for (var i = 0; i < 10; i++) {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(DATA[i][1].lat,DATA[i][1].lng),
          map: map,
        });
        (function(marker, i) {
          infowindow = new google.maps.InfoWindow({
            maxWidth: 600,
            content: `
            <div class="ui grid" style="overflow:hidden;" >
            <div class="seven wide column">
            <div class="ui cards square shape">
            <div class="sides">
            <div class="active first side">
            <div class="ui one cards">
            <a class="red card" style="  display: block;
            width:230px;
            height:230px;
            ">
            <div class="image">
            <img class="ui medium image" src="${DATA[i][1].picture1}" style="height: auto;
            width: auto;
            max-width: 230px;
            max-height: 230px;">
            </div>
            </a>
            </div>
            </div>
            <div class="second side">
            <div class="ui one cards">
            <a class="red card" style="  display: block;
            width:230px;
            height:230px;
            ">
            <div class="image">
            <img class="ui medium image" src="${DATA[i][1].picture2}" style="height: auto;
            width: auto;
            max-width: 230px;
            max-height: 230px;">
            </div>
            </a>
            </div>
            </div>
            <div class="third side">
            <div class="ui one cards">
            <a class="red card"  style="  display: block;
            width:230px;
            height:230px;
            ">
            <div class="image">
            <img class="ui medium image" src="${DATA[i][1].picture3}" style="height: auto;
            width: auto;
            max-width: 230px;
            max-height: 230px;">
            </div>
            </a>
            </div>
            </div>
            <div class="fourth side">
            <div class="ui one cards">
            <a class="red card" style="  display: block;
            width:230px;
            height:230px;
            ">
            <div class="image">
            <img class="ui medium image" src="${DATA[i][1].picture4}" style="height: auto;
            width: auto;
            max-width: 230px;
            max-height: 230px;">
            </div>
            </a>
            </div>
            </div>
            </div>
            </div>
            <div class="ui four cards">
            <a class="orange card" onclick="moveslide('first')">
            <div class="image">
            <img class="ui mini image" src="${DATA[i][1].picture1}">
            </div>
            </a>
            <a class="orange card" onclick="moveslide('second')">
            <div class="image">
            <img class="ui mini image" src="${DATA[i][1].picture2}">
            </div>
            </a>
            <a class="orange card" onclick="moveslide('third')">
            <div class="image">
            <img class="ui mini image" src="${DATA[i][1].picture3}">
            </div>
            </a>
            <a class="orange card" onclick="moveslide('fourth')">
            <div class="image">
            <img class="ui mini image" src="${DATA[i][1].picture4}">
            </div>
            </a>
            </div>
            </div>
            <div class="nine wide column">
            <h1 class="ui header">
            ${DATA[i][1].name}
            </h1>
            <div class="ui message">
              <div class="header">
                ที่อยู่
              </div>
              <p id="address">เลขที่ ${DATA[i][1].number}
              หมู่ที่ ${DATA[i][1].villageno}
              ซอย ${DATA[i][1].lane}
              ถนน ${DATA[i][1].street}
              ตำบล ${DATA[i][1].subdistrict}
              อำเภอ ${DATA[i][1].district}
              จังหวัด ${DATA[i][1].province}
              รหัสไปรษณีย์ ${DATA[i][1].postcode}</p>
              <button class="ui labeled icon button" onclick="copytoClipboard('address')">
                <i class="copy icon"></i>
                คัดลอกที่อยู่
              </button>
            </div>

            <div class="ui success icon message">
              <i class="check icon"></i>
              <div class="header">
                จุดรับฝากพัสดุนี้ได้รับการตรวจสอบจากบริษัทแล้ว
              </div>
            </div>

            </div>
            </div>
            `
          });
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map, marker);
          });

          var distanceFloat = parseFloat(DATA[i][2]).toFixed(2);

          markers[i] = marker;

          $("#sideItem").append(`
            <div class="item" onclick="bousetolatlng(${DATA[i][1].lat},${DATA[i][1].lng},${i})">
              <img width="70" height="70" class="ui image" src="${DATA[i][1].logo}">
              <div class="content">
                <div class="header">${DATA[i][1].name}</div>
                ${distanceFloat} กม.
              </div>
            </div>
          `);

        })(marker, i);
      }
      //--------- END MARKERS --------------

      //clear
      DATA = [];
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
  });
  /* END Firebase */



  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.

  document.getElementById('pac-button').onclick = function () {
    google.maps.event.trigger(input, 'focus')
    google.maps.event.trigger(input, 'keydown', { keyCode: 13 });
  };

  /* Previous search section when people forgot to login, it will search again after people login.*/
  var seamySearch = false;
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      if(seamySearch == true){
        mapProcessing();
        seamySearch = false;
      }
    }
  });
  /* END */

  searchBox.addListener('places_changed', function() {
    mapProcessing();
  });

  function mapProcessing(){
    var user = firebase.auth().currentUser; //check user is authenticated.
    if(user)
    {
      var places = searchBox.getPlaces();
      if (places.length == 0) {
        return;
      }

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



        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    }else {
      alert("กรุณาเข้าสู่ระบบก่อนค่ะ");
      seamySearch = true;
    }
  }
}

function sortFunction(a, b) {
  if (a[2] === b[2]) {
    return 0;
  }
  else {
    return (a[2] < b[2]) ? -1 : 1;
  }
}

var rad = function(x) {
  return x * Math.PI / 180;
};

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


function moveslide(selector){
  $('.shape')
  .shape('set next side', '.' + selector + '.side')
  .shape('flip up')
  ;
}


function copytoClipboard(id){
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($('#'+id).text()).select();
  document.execCommand("copy");
  $temp.remove();
  alert("คัดลอกที่อยู่แล้วครับ นำไปวางเป็นที่อยู่จัดส่งในเว็บที่ต้องการซื้อสินค้าได้เลยครับ");
}

function bousetolatlng(lat,lng,i){
  var user = firebase.auth().currentUser; //check user is authenticated.
  if(user)
  {
    var center = new google.maps.LatLng(lat, lng);
    map.panTo(center);
    map.setZoom(16);
    infowindow.open(map, markers[i]);
  }else{
    alert("กรุณาเข้าสู่ระบบก่อนค่ะ");
  }
}
