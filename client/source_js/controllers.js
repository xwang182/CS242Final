var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('MapController', ['$scope', 'MapData'  , function($scope, MapData) {
    $scope.maps;
    var setMap = function(data){
        $scope.maps=data;
        console.log($scope.maps);
    };
    MapData.getMap().then(setMap);

}]);


mp4Controllers.controller('UserController', ['$scope', 'UserData'  , function($scope, UserData) {
    $scope.users;
    var setUser = function(data){
        $scope.users=data;
        console.log($scope.users);
    };
    UserData.getUser().then(setUser);

}]);


