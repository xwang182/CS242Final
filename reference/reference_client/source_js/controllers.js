var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('UsersController', ['$scope', 'UserData'  , function($scope, UserData) {
    $scope.users = [];
    var setUsers = function(response){
        if(response.message === "OK"){
            $scope.users=response.data;
        }
        else{
            alert(response.message);
        }
    };
    UserData.getUsers().then(setUsers);



    var refresh = function(response){
        if(response.message === "OK"){
            UserData.getUsers().then(setUsers);
        }
        else{
            alert(response.message);
        }
    };


    $scope.deleteUser = function(userId){
        UserData.deleteUser(userId).then(refresh);
    }

}]);


mp4Controllers.controller('AddUserController', ['$scope',  'UserData'  , function($scope ,UserData) {
    $scope.name="";
    $scope.email="";

    var showSubmit = function(response){
        if(response.message === "OK"){
            $("#message").html("User has successfully added");
            $scope.name="";
            $scope.email="";
        }
        else{
            $("#message").html(response.message);
            $scope.email="";
        }

    };
    $scope.submit=function(){
        if($scope.name === "" || $scope.email ==="" ){
            alert("User name or email can not be empty");
            return;
        }
        var userData = {
            name : $scope.name,
            email: $scope.email
        };
        UserData.addUser(userData).then(showSubmit);
    };



}]);


mp4Controllers.controller('OneUserController', ['$scope', '$routeParams', 'UserData' ,'TaskData' , function($scope, $routeParams ,UserData,TaskData) {
    $scope.userId = $routeParams.userId;
    $scope.user = {};
    $scope.tasks=[];
    $scope.completeTasks = [];

    var inHeight = $(".inButton").height();
    $("#outDiv").height(inHeight);

    var setTask = function(response){
        if(response.message === "OK"){
            $scope.tasks.push(response.data);
        }
        else{
            alert(response.message);
        }
    };


    var setUser = function(response){
        if(response.message === "OK"){
            $scope.user=response.data;
            var taskList=$scope.user.pendingTasks;
            for(var Index = 0 ;Index <taskList.length ; Index++){
                TaskData.getOneTask(taskList[Index]).then(setTask);
            }
        }
        else{
            alert(response.message);
        }
    };
    UserData.getOneUser($scope.userId).then(setUser);


    var refresh = function(response){
        if(response.message === "OK"){
            $scope.tasks=[];
            $scope.completeTasks = [];
            UserData.getOneUser($scope.userId).then(setUser);
        }
        else{
            alert(response.message);
        }
    };

    $scope.complete=function(taskId,index){

        var task= $scope.tasks[index];

        var taskName=task.name;
        var taskDescription=task.description;
        var taskDeadline=task.deadline;
        var taskCompleted=true;
        var taskAssignedUser=task.assignedUser;
        var taskAssignedUserName=task.assignedUserName;

        var taskData = {
            name             : taskName,
            description      : taskDescription,
            deadline         : taskDeadline,
            completed        : taskCompleted,
            assignedUser     : taskAssignedUser,
            assignedUserName : taskAssignedUserName
        };
        TaskData.changeTask(taskId,taskData).then(refresh);
    };

    var setCompleteTask = function(response){
          if(response.message === "OK"){
              $scope.completeTasks = response.data;
          }
          else{
              alert(response.message);
          }

    };
    $scope.loadCompleteTask=function(){
        if($scope.completeTasks.length === 0){
            TaskData.getUserTasks($scope.userId).then(setCompleteTask);
        }
        else{
            $scope.completeTasks = [];
        }


    }




}]);


mp4Controllers.controller('TasksController', ['$scope', 'TaskData' , function($scope, TaskData) {
    $scope.tasks = [];
    $scope.taskType="pending";
    $scope.everyPage = 10;
    $scope.pageNum = 0;
    $scope.sortByValue = "";
    $scope.sortByOrder = "";

    var setTasks = function(response){
        if(response.message === "OK"){
            $scope.tasks=response.data;
            if($scope.tasks.length===0 && $scope.pageNum >0){
                $scope.pageNum = $scope.pageNum - 1 ;
                alert("This is the last page, can not go to next page anymore");
            }
          }
          else{
              alert(response.message);
          }
    };
    $scope.getTask = function(){
        TaskData.getTasks($scope.pageNum,$scope.everyPage,$scope.taskType,$scope.sortByValue,$scope.sortByOrder).then(setTasks);
    };
    $scope.getTask();

    $scope.prevPage = function(){
        if($scope.pageNum > 0){
            $scope.pageNum = $scope.pageNum -1 ;
        }
        else{
            alert("This is the first page, can not go to previous page anymore");
        }
    };

    $scope.nextPage = function(){
        if($scope.tasks.length===$scope.everyPage){
            $scope.pageNum = $scope.pageNum + 1 ;
        }
        else{
            alert("This is the last page, can not go to next page anymore");
        }

    };

    $scope.changeType = function(){
        $scope.pageNum = 0;
        TaskData.getTasks($scope.pageNum,$scope.everyPage,$scope.taskType,$scope.sortByValue,$scope.sortByOrder).then(setTasks);
    };

    $scope.$watch('pageNum',$scope.getTask,true);
    $scope.$watch('taskType',$scope.changeType,true);
    $scope.$watch('sortByValue',$scope.changeType,true);
    $scope.$watch('sortByOrder',$scope.changeType,true);


    $scope.deleteTask = function(taskId){
        TaskData.deleteTask(taskId).then($scope.getTask);

    };

}]);


mp4Controllers.controller('AddTaskController', ['$scope',  'TaskData' ,'UserData' , function($scope ,TaskData, UserData) {
    $scope.name="";
    $scope.description="";
    $scope.deadline = "";
    $scope.completed = false;

    $scope.AssignUser={};
    $scope.users = [];
    var setUsers = function(response){
        if(response.message === "OK"){
            $scope.users = response.data;
          }
          else{
              alert(response.message);
          }
    };
    UserData.getUsers().then(setUsers);


    var showSubmit = function(response){
         if(response.message === "OK"){
             $scope.name="";
             $scope.description="";
             $scope.deadline = "";
             $scope.completed = false;
             $scope.AssignUser={};
             $("#message").html("Task has successfully added");
          }
          else{
              alert(response.message);
          }
    };
    $scope.submit=function(){
        if($scope.name ==="" || $scope.deadline ===""){
            alert("Task name of deadline can not be empty");
            return;
        }
        var deadlineDate = new Date($scope.deadline).toISOString();
        var taskData = {
            name             : $scope.name,
            description      : $scope.description,
            deadline         : deadlineDate,
            completed        : $scope.completed,
            assignedUser     : $scope.AssignUser._id,
            assignedUserName : $scope.AssignUser.name
        };
        TaskData.addTask(taskData).then(showSubmit);
    };


}]);


mp4Controllers.controller('OneTaskController', ['$scope', '$routeParams', 'TaskData'  , function($scope, $routeParams ,TaskData) {
    $scope.taskId = $routeParams.taskId;
    $scope.task = {};
    var setTask = function(response){
        if(response.message === "OK"){
            $scope.task=response.data;
            if($scope.task.assignedUser === "unassigned"){
                $("#userPage").hide();
            }
        }
        else{
            alert(response.message);
        }
    };
    TaskData.getOneTask($scope.taskId).then(setTask);


    var reverse = function(response){
        if(response.message === "OK"){
            $scope.task.completed = !$scope.task.completed;
        }
        else{
            alert(response.message);
        }
    };
    $scope.completionChange=function(){
        var taskCompleted = !$scope.task.completed;
        var taskData = {
            name             : $scope.task.name,
            description      : $scope.task.description,
            deadline         : $scope.task.deadline,
            completed        : taskCompleted,
            assignedUser     : $scope.task.assignedUser,
            assignedUserName : $scope.task.assignedUserName
        };
        TaskData.changeTask($scope.taskId,taskData).then(reverse);
    };
}]);



mp4Controllers.controller('EditTaskController', ['$scope', '$routeParams' , 'TaskData' ,'UserData' , function($scope ,$routeParams,TaskData , UserData) {
    $scope.taskId = $routeParams.taskId;
    $scope.task ={};

    $scope.AssignUser = {};
    $scope.users = [];
    var setUsers = function(response){
        if(response.message === "OK"){
            $scope.users = response.data;
            for(var index = 0;index<$scope.users.length;index++){
                if(response.data[index]._id === $scope.task.assignedUser){
                    $scope.AssignUser = response.data[index];
                    break;
                }
            }
        }
        else{
            alert(response.message);
        }
    };

    var setTask = function(response){
        if(response.message === "OK"){
            $scope.task=response.data;
            $scope.deadline = $scope.task.deadline;
            var date = new Date($scope.deadline);
            $scope.deadline = date.toString();

            UserData.getUsers().then(setUsers);
        }
        else{
            alert(response.message);
        }
    };
    TaskData.getOneTask($scope.taskId).then(setTask);

    var refresh = function(response){
        if(response.message === "OK"){
            $("#message").html("Task has successfully edited");
        }
        else{
            alert(response.message);
        }
    };
    $scope.edit=function(){

        if($scope.task.name ==="" || $scope.deadline ===""){
            alert("Task name of deadline can not be empty");
            return;
        }
        var deadlineDate = new Date($scope.deadline).toISOString();
        var taskData = {
            name             : $scope.task.name,
            description      : $scope.task.description,
            deadline         : deadlineDate,
            completed        : $scope.task.completed,
            assignedUser     : $scope.AssignUser._id,
            assignedUserName : $scope.AssignUser.name
        };
        TaskData.changeTask($scope.taskId,taskData).then(refresh);
    };

}]);





mp4Controllers.controller('SettingsController', ['$scope' , 'UserData','TaskData' , function($scope, UserData,TaskData) {
    $scope.url = UserData.getURL();
    $scope.setUrl = function(){
        UserData.setting($scope.url);
        TaskData.setting($scope.url);
        $scope.displayText = "URL is set";
    };

}]);
