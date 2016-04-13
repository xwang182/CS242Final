var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services','720kb.datepicker']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/users', {
          templateUrl: 'partials/users.html',
          controller: 'UsersController'
      }).
      when('/users/addUser', {
          templateUrl : 'partials/addUser.html',
          controller: 'AddUserController'
      }).
      when('/users/:userId', {
          templateUrl : 'partials/oneUser.html',
          controller: 'OneUserController'
      }).
      when('/tasks', {
          templateUrl: 'partials/tasks.html',
          controller: 'TasksController'
      }).
      when('/tasks/addTask', {
          templateUrl : 'partials/addTask.html',
          controller: 'AddTaskController'
      }).
      when('/tasks/editTask/:taskId', {
          templateUrl : 'partials/editTask.html',
          controller: 'EditTaskController'
      }).
      when('/tasks/:taskId', {
          templateUrl : 'partials/oneTask.html',
          controller: 'OneTaskController'
      }).
      when('/settings', {
          templateUrl: 'partials/settings.html',
          controller: 'SettingsController'
      }).
      otherwise({
          redirectTo: '/users'
      });
}]);
