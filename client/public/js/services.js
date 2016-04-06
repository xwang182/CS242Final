var mp4Services=angular.module("mp4Services",[]);mp4Services.factory("UserData",function($http){$http.defaults.headers.post["Content-Type"]="application/json";var baseURL="http://localhost:4000/api/users/",baseURLQuery="http://localhost:4000/api/users",getUsers=function(){var usersURL=baseURLQuery+"?select={'name': 1,'email':1}";return $http.get(usersURL).then(function(response){return response.data})},deleteUser=function(userId){return console.log("in client delete"),$http["delete"](baseURL+userId).then(function(response){return response.data})},addUser=function(addData){return $http.post(baseURL,addData).then(function(response){return response.data})},getOneUser=function(userId){return $http.get(baseURL+userId).then(function(response){return response.data})};return{getUsers:getUsers,deleteUser:deleteUser,addUser:addUser,getOneUser:getOneUser}}),mp4Services.factory("TaskData",function($http){$http.defaults.headers.post["Content-Type"]="application/json";var baseURL="http://localhost:4000/api/tasks/",baseURLQuery="http://localhost:4000/api/tasks",getTasks=function(pageNum,everyPage,taskType){var limitNum=everyPage,skipNum=pageNum*limitNum;limitNum=limitNum.toString(),skipNum=skipNum.toString();var selectQuery="?select={'name': 1,'assignedUserName':1}",pageQuery="&skip="+skipNum+"&limit="+limitNum,typeQuery="";"all"===taskType?typeQuery="":"completed"===taskType?typeQuery="&where={'completed': true}":"pending"===taskType&&(typeQuery="&where={'completed': false}");var tasksURL=baseURLQuery+selectQuery+pageQuery+typeQuery;return $http.get(tasksURL).then(function(response){return response.data})},deleteTask=function(taskId){return $http["delete"](baseURL+taskId).then(function(response){return response.data})},addTask=function(addData){return $http.post(baseURL,addData).then(function(response){return response.data})},getOneTask=function(taskId){return $http.get(baseURL+taskId).then(function(response){return response.data})};return{getTasks:getTasks,deleteTask:deleteTask,addTask:addTask,getOneTask:getOneTask}});