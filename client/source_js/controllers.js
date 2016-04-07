var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('UsersController', ['$scope', 'UserData'  , function($scope, UserData) {
    $scope.users;
    var setUsers = function(data){
        $scope.users=data;
        console.log($scope.users);
    };
    UserData.getUsers().then(setUsers);

}]);


