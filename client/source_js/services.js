var mp4Services = angular.module('mp4Services', []);
mp4Services.factory('UserData', function($http){
    $http.defaults.headers.post["Content-Type"] = "application/json";
    var baseURL = "http://localhost:4000/api/users/";
    var getUsers = function(){
        return $http.get(baseURL)
            .then(function(response){
                return response.data;
            })
    };
    var deleteUser = function(userId){
        console.log("in client delete");
        return $http.delete(baseURL + userId)
            .then(function(response){
                return response.data;
            })
    };
    return{
        getUsers   : getUsers,
        deleteUser : deleteUser,
        addUser    : addUser,
        getOneUser : getOneUser
    }
});
