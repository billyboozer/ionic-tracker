angular.module('altecpoc.controllers', [])

.controller('LoginCtrl', function($scope, $firebaseAuth, $location) {
  $scope.login = function(username, password) {
    var fbAuth = $firebaseAuth(fb);
    fbAuth.$authWithPassword({
      email: username,
      password: password
    }).then(function(authData) {
      $location.path("/tab/locations");
    }).catch(function(error) {
      console.error("ERROR: " + error);
    });
  }

  $scope.register = function(username, password) {
    var fbAuth = $firebaseAuth(fb);
    fbAuth.$createUser(username, password).then(function() {
      return fbAuth.$authWithPassword({
        email: username,
        password: password
      });
    }).then(function(authData) {
      $location.path("/tab/locations");
    }).catch(function(error) {
      console.error("ERROR " + error);
    });
  }

  $scope.google = function(){
    fb.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        $location.path("/tab/locations");
      }
    });
  }

  $scope.logout = function() {
    fb.unauth();
  };
})

.controller('LocationsCtrl', function($scope) {
})

.controller('LocationDetailCtrl', function($scope, $stateParams) {
  // $scope.location = Locations.get($stateParams.locationId);
})

.controller('GpsCtrl', function($scope, $ionicLoading) {

  var pathCoords = [];

  function onSuccess(pos) {
    console.log('hello', pos);
    myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    $scope.map.setCenter(myLatlng);

    pathCoords.push(myLatlng);

    console.log(pathCoords.length);

    var path = new google.maps.Polyline({
      path: pathCoords,
      geodesic: true,
      strokeColor: '#ffc900',
      strokeOpacity: 1.0,
      strokeWeight: 4
    });

    path.setMap($scope.map);
    // var pinIcon = new google.maps.MarkerImage(
    //   "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FFFF00",
    //   null, /* size is determined at runtime */
    //   null, /* origin is 0,0 */
    //   null, /* anchor is bottom center of the scaled image */
    //   new google.maps.Size(10, 20)
    // );
    // var marker = new google.maps.Marker({
    //   position: myLatlng,
    //   map: $scope.map,
    //   icon: pinIcon
    // });
  }

  function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
  }

  var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 10000 });

  $scope.mapCreated = function(map) {
    $scope.map = map;
  };

  $scope.centerOnMe = function () {
    navigator.geolocation.clearWatch(watchID);
    console.log("Centering");
    if (!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
      myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      $scope.map.setCenter(myLatlng);
      var marker = new google.maps.Marker({
        position: myLatlng,
        map: $scope.map
      });
      $ionicLoading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };
})

.controller('AccountCtrl', function($scope) {
});
