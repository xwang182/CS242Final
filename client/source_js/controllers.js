var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('UsersController', ['$scope', 'UserData'  , function($scope, UserData) {
    $scope.users;
    var setUsers = function(data){
        $scope.users=data;
        console.log($scope.users);
    };
    UserData.getUsers().then(setUsers);

    $scope.deleteUser = function(userId){
        console.log(userId);
        UserData.deleteUser(userId).then(function(){
            UserData.getUsers().then(setUsers);
        });

    }

}]);


mp4Controllers.controller('AddUserController', ['$scope',  'UserData'  , function($scope ,UserData) {
    $scope.name="";
    $scope.email="";

    var showSubmit = function(data){
        $("#message").html("User has successfully added");
        $scope.name="";
        $scope.email="";
        console.log(data);
    };
    $scope.submit=function(){
        var userData = {
            name : $scope.name,
            email: $scope.email
        };
        UserData.addUser(userData).then(showSubmit);
    };



}]);


mp4Controllers.controller('OneUserController', ['$scope', '$routeParams', 'UserData'  , function($scope, $routeParams ,UserData) {
    $scope.userId = $routeParams.userId;
    $scope.user;
    var setUser = function(data){
        $scope.user=data;
    };
    UserData.getOneUser($scope.userId).then(setUser);

}]);


mp4Controllers.controller('TasksController', ['$scope', 'TaskData' , function($scope, TaskData) {
    $scope.tasks;
    $scope.taskType="pending";
    $scope.everyPage = 3;
    $scope.pageNum = 0;
    var setTasks = function(data){
        $scope.tasks=data;
        if($scope.tasks.length===0 && $scope.pageNum >0){
            $scope.pageNum = $scope.pageNum - 1 ;
        }
        console.log($scope.tasks);
    };
    $scope.getTask = function(){
        console.log($scope.pageNum);
        TaskData.getTasks($scope.pageNum,$scope.everyPage,$scope.taskType).then(setTasks);
    };
    $scope.getTask();

    $scope.prevPage = function(){
        if($scope.pageNum > 0){
            $scope.pageNum = $scope.pageNum -1 ;
        }
    };

    $scope.nextPage = function(){
        if($scope.tasks.length===$scope.everyPage){
            $scope.pageNum = $scope.pageNum + 1 ;
        }

    };

//    $scope.changeType = function(){
//        $scope.pageNum = 0;
//        TaskData.getTasks($scope.pageNum,$scope.everyPage,$scope.taskType).then(setTasks);
//    };

    $scope.$watch('pageNum',$scope.getTask,true);
//    $scope.$watch('taskType',$scope.changeType,true);


    $scope.deleteTask = function(taskId){
        console.log(taskId);
        TaskData.deleteTask(taskId).then(function(){
            TaskData.getTasks().then(setTasks);
        });

    };

}]);


mp4Controllers.controller('AddTaskController', ['$scope',  'TaskData'  , function($scope ,TaskData) {
    $scope.name="";
    $scope.description="";
    $scope.deadline;
    $scope.completed;
    $scope.assignedUser="";
    $scope.assignedUserName="";


    var showSubmit = function(data){
        $("#message").html("Task has successfully added");
        console.log(data);
    };
    $scope.submit=function(){
        var completedChange = Boolean($scope.completed);
        var taskData = {
            name             : $scope.name,
            description      : $scope.description,
            deadline         : $scope.deadline,
            completed        : completedChange,
            assignedUser     : $scope.assignedUser,
            assignedUserName : $scope.assignedUserName
        };
        TaskData.addTask(taskData).then(showSubmit);
    };



}]);


mp4Controllers.controller('OneTaskController', ['$scope', '$routeParams', 'TaskData'  , function($scope, $routeParams ,TaskData) {
    $scope.taskId = $routeParams.taskId;
    $scope.task;
    var setTask = function(data){
        $scope.task=data;
    };
    TaskData.getOneTask($scope.taskId).then(setTask);

}]);






mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";

  };

}]);
