var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/users', {
          templateUrl: 'partials/users.html',
          controller: 'UsersController'
      }).
      otherwise({
          redirectTo: '/users'
      });
}]);
