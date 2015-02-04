angular.module('altecpoc.controllers', [])

.controller('LoginCtrl', ['$scope', 'Auth', '$location', '$firebase', function($scope, Auth, $location, $firebase) {

  $scope.login = function(username, password) {
    Auth.$authWithPassword({
      email: username,
      password: password
    }).then(function(authData) {
      $location.path("/tab/locations");
    }).catch(function(error) {
      console.error("ERROR: " + error);
    });
  }

  $scope.register = function(username, password, firstName, lastName, company) {
    var loginInfo = {email: username, password: password};
    var profileInfo = {firstName: firstName, lastName: lastName, company: company};
    Auth.$createUser(loginInfo).then(function() {
      return Auth.$authWithPassword({
        email: username,
        password: password
      }).then(function(authData) {
        return createProfile(authData, angular.extend(loginInfo, profileInfo))
      });
    }).then(function(authData) {
      $location.path("/tab/locations");
    }).catch(function(error) {
      console.error("ERROR " + error);
    });
  }

  function createProfile(authData, user){
    var ref = new Firebase("https://altecpoc.firebaseio.com/");
    var profileRef = $firebase(ref.child('profile'));
    return profileRef.$set(authData.uid, user);
  }

  $scope.google = function(){
    Auth.$authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        $location.path("/tab/locations");
      }
    });
  }

  $scope.logout = function() {
    Auth.$unauth();
  };
}])

.controller('LocationsCtrl', function($scope) {
})

.controller('LocationDetailCtrl', function($scope, $stateParams) {
  // $scope.location = Locations.get($stateParams.locationId);
})

.controller('GpsCtrl', function($scope, $ionicLoading, Auth, $firebase) {

  function storeGisData(data){
    var ref = new Firebase("https://altecpoc.firebaseio.com/");
    var gisRef = $firebase(ref.child('gisData'));
    return gisRef.$set(Auth.$getAuth().uid, data);
  }

  var pathCoords = [];

  var markers = [];

  var foo = 0;

  function onSuccess(pos) {
    myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    $scope.map.setCenter(myLatlng);

    if(pathCoords.length == 0){
      var marker = new google.maps.Marker({
        position: myLatlng,
        map: $scope.map
      });
      markers.push(marker);
    }else{
      markers[0].setPosition(myLatlng);
    }

    pathCoords.push(myLatlng);
    storeGisData(pathCoords);

    var path = new google.maps.Polyline({
      path: pathCoords,
      geodesic: true,
      strokeColor: '#ffc900',
      strokeOpacity: 1.0,
      strokeWeight: 4
    });

    path.setMap($scope.map);

    var last_element = pathCoords[pathCoords.length - 1];
    console.log(pathCoords.length);
    console.log(last_element);

    // if (foo <= 0){
    //   var marker = new google.maps.Marker({
    //     id: 1,
    //     position: myLatlng,
    //     map: $scope.map
    //   });
    // }else{
    //   marker.setPosition(myLatlng);
    // }

    // foo++;
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

.controller('AccountCtrl', function($scope, Auth, $location) {
  var auth = Auth.$getAuth();
  $scope.currentUser = auth[auth.auth.provider].email;
});
