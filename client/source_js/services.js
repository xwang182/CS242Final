var mp4Services = angular.module('mp4Services', []);
mp4Services.factory('UserData', function($http){
    $http.defaults.headers.post["Content-Type"] = "application/json";
    var baseURL = "http://localhost:4000/api/users/";
    var baseURLQuery = "http://localhost:4000/api/users";
    var getUsers = function(){
        var usersURL = baseURLQuery + "?select={'name': 1,'email':1}";
        return $http.get(usersURL)
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
    var addUser = function(addData){
        return $http.post(baseURL ,addData)
            .then(function(response){
                return response.data;
            })
    };
    var getOneUser = function(userId){
        return $http.get(baseURL + userId)
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

mp4Services.factory('TaskData', function($http) {
    $http.defaults.headers.post["Content-Type"] = "application/json";
    var baseURL = "http://localhost:4000/api/tasks/";
    var baseURLQuery = "http://localhost:4000/api/tasks";
    var getTasks= function(pageNum,everyPage,taskType){
        var limitNum=everyPage;
        var skipNum = pageNum * limitNum;
        limitNum = limitNum.toString();
        skipNum = skipNum.toString();
        var selectQuery= "?select={'name': 1,'assignedUserName':1}";
        var pageQuery="&skip=" + skipNum +"&limit=" + limitNum;
        var typeQuery="";
        if(taskType === "all"){
            typeQuery="";
        }
        else if(taskType === "completed"){
            typeQuery="&where={'completed': true}";
        }
        else if(taskType === "pending"){
            typeQuery="&where={'completed': false}";
        }

        var tasksURL = baseURLQuery + selectQuery + pageQuery + typeQuery;

        return $http.get(tasksURL)
            .then(function(response){
                return response.data;
            })
    };
    var deleteTask= function(taskId){
        return $http.delete(baseURL + taskId)
            .then(function(response){
                return response.data;
            })
    };
    var addTask = function(addData){
        return $http.post(baseURL ,addData)
            .then(function(response){
                return response.data;
            })
    };
    var getOneTask = function(taskId){
        return $http.get(baseURL + taskId)
            .then(function(response){
                return response.data;
            })
    };
    return {
        getTasks   : getTasks,
        deleteTask : deleteTask,
        addTask    : addTask,
        getOneTask : getOneTask

    }
});
