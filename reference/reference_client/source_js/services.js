var mp4Services = angular.module('mp4Services', []);

mp4Services.value('settingURL', 'http://localhost:4000/api/');


mp4Services.factory('UserData', function($http,settingURL){
    $http.defaults.headers.post["Content-Type"] = "application/json";
    var baseURL = "http://localhost:4000/api/users/";
    var baseURLQuery = "http://localhost:4000/api/users";

    var setting = function(newSetting){
        settingURL = newSetting;
        baseURL = newSetting + "users/";
        baseURLQuery = newSetting + "users";
    };
    var getURL = function(){
        return settingURL;
    };
    var getUsers = function(){
        var usersURL = baseURLQuery + "?select={'name': 1,'email':1}";
        return $http.get(usersURL)
            .then(function(response){
                return response.data;
            })
    };
    var deleteUser = function(userId){
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
        getURL     : getURL,
        setting    : setting,
        getUsers   : getUsers,
        deleteUser : deleteUser,
        addUser    : addUser,
        getOneUser : getOneUser
    }
});

mp4Services.factory('TaskData', function($http,settingURL) {
    $http.defaults.headers.post["Content-Type"] = "application/json";
    var baseURL = "http://localhost:4000/api/tasks/";
    var baseURLQuery = "http://localhost:4000/api/tasks";

    var setting = function(newSetting){
        settingURL = newSetting;
        baseURL = newSetting + "tasks/";
        baseURLQuery = newSetting + "tasks";
    };
    var getTasks= function(pageNum,everyPage,taskType,taskSort,sortOrder){
        var limitNum=everyPage;
        var skipNum = pageNum * limitNum;
        limitNum = limitNum.toString();
        skipNum = skipNum.toString();
        var selectQuery= "?select={'name': 1,'assignedUserName':1,'completed':1}";
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
        var sortQuery="";
        if(taskSort === "name" && sortOrder ==="1"){
            sortQuery="&sort={ 'name' : 1 }";
        }else if(taskSort === "name" && sortOrder ==="-1"){
            sortQuery="&sort={ 'name' : -1 }";
        }else if(taskSort === "assignedUserName" && sortOrder ==="1"){
            sortQuery="&sort={ 'assignedUserName' : 1 }";
        }else if(taskSort === "assignedUserName" && sortOrder ==="-1"){
            sortQuery="&sort={ 'assignedUserName' : -1 }";
        }else if(taskSort === "dateCreated" && sortOrder ==="1"){
            sortQuery="&sort={ 'dateCreated' : 1 }";
        }else if(taskSort === "dateCreated" && sortOrder ==="-1"){
            sortQuery="&sort={ 'dateCreated' : -1 }";
        }else if(taskSort === "deadline" && sortOrder ==="1"){
            sortQuery="&sort={ 'deadline' : 1 }";
        }else if(taskSort === "deadline" && sortOrder ==="-1"){
            sortQuery="&sort={ 'deadline' : -1 }";
        }

        var tasksURL = baseURLQuery + selectQuery + pageQuery + typeQuery + sortQuery;

        return $http.get(tasksURL)
            .then(function(response){
                return response.data;
            })
    };
    var getUserTasks = function(userId){
        var selectQuery= "?where={'completed':true,'assignedUser':'"+ userId + "'}";
        var userTasksURL = baseURLQuery + selectQuery;
        return $http.get(userTasksURL)
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
    var changeTask = function(taskId,newTask){
        return $http.put(baseURL + taskId,newTask)
            .then(function(response){
                return response.data;
            })
    };
    return {
        setting      : setting,
        getTasks     : getTasks,
        getUserTasks : getUserTasks,
        deleteTask   : deleteTask,
        addTask      : addTask,
        getOneTask   : getOneTask,
        changeTask   : changeTask

    }
});
