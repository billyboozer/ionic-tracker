// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

// var fb = null;

angular.module('altecpoc', ['ionic', 'altecpoc.controllers', 'altecpoc.services', 'altecpoc.directives', 'ng-cordova', 'firebase' ])

.run(function($ionicPlatform, $state, Auth) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // Login Route
  .state('login',{
      url:'/login',
      templateUrl:'templates/login.html',
      controller: 'LoginCtrl',
      resolve: {  "currentAuth": ["Auth", function (Auth) { Auth.$waitForAuth(); }] }
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    resolve: {  "currentAuth": ["Auth", function (Auth) { Auth.$requireAuth(); }] }
  })

  // Each tab has its own nav history stack:

  .state('tab.locations', {
      url: '/locations',
      views: {
        'tab-locations': {
          templateUrl: 'templates/tab-locations.html',
          controller: 'LocationsCtrl'
        }
      }
    })
    .state('tab.location-detail', {
      url: '/location/:locationId',
      views: {
        'tab-locations': {
          templateUrl: 'templates/location-detail.html',
          controller: 'LocationDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    },
    resolve: {  "currentAuth": ["Auth", function (Auth) { Auth.$requireAuth(); }] }
  })

  .state('tab.gps', {
    url: '/gps',
    views: {
      'tab-gps': {
        templateUrl: 'templates/tab-gps.html',
        controller: 'GpsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
