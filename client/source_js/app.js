var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/map', {
          templateUrl: 'partials/map.html',
          controller: 'MapController'
      }).
      when('/user', {
          templateUrl: 'partials/user.html',
          controller: 'UserController'
      }).
      when('/setting', {
          templateUrl: 'partials/setting.html'
      }).
      otherwise({
          redirectTo: '/map'
      });
}]);
