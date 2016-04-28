var mp4Services = angular.module('mp4Services', []);
mp4Services.factory('MapData', function($http){
    $http.defaults.headers.post["Content-Type"] = "application/json";
    var baseURL = "http://http://162.243.29.34/:4000/api/map/";
    var getMap = function(){
        return $http.get(baseURL)
            .then(function(response){
                return response.data;
            })
    };
    return{
        getMap   : getMap
    }
});

mp4Services.factory('UserData', function($http){
    $http.defaults.headers.post["Content-Type"] = "application/json";
    var baseURL = "http://http://162.243.29.34/:4000/api/user/";
    var getUser = function(){
        return $http.get(baseURL)
            .then(function(response){
                return response.data;
            })
    };
     var postUser = function(userId, data){
        return $http.put(baseURL + userId, data)
            .then(function(response){
                return response.data;
            })
    };
    
    return{
        getUser   : getUser,
        postUser  : postUser
    }

});
