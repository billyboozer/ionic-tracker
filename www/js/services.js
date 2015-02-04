angular.module('altecpoc.services', [])

.factory("Auth", ["$firebaseAuth", function ($firebaseAuth) {
  var auth = $firebaseAuth(new Firebase("https://altecpoc.firebaseio.com/"));
  return auth;
}]);
