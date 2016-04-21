var mp4Controllers=angular.module("mp4Controllers",[]);mp4Controllers.controller("MapController",["$scope","MapData","UserData",function($scope,MapData,UserData){$scope.map,$scope.mapGet,$scope.userGet,$scope.xTreasure=1,$scope.yTreasure=1,$scope.dug=[],$scope.rows=10,$scope.cols=10,$scope.user1,$scope.user2;var myUsername,gamePlay=!1,socket=io("http://localhost:4000"),createEmptyMap=function(rows,cols){for(var arr=[],i=0;rows>i;i++){for(var oneRow=[],j=0;cols>j;j++){var map={};map.xLocation=i,map.yLocation=j,map.xTreasure=$scope.xTreasure,map.yTreasure=$scope.yTreasure,map.dug=!1,oneRow.push(map)}arr.push(oneRow)}return arr};$scope.map=createEmptyMap($scope.rows,$scope.rows);var setUsers=function(data){$scope.userGet=data,$scope.user1=$scope.userGet[0],$scope.user2=$scope.userGet[1];var divID1="#"+$scope.user1.xLocation.toString()+"-"+$scope.user1.yLocation.toString();$(divID1).css({"background-image":'url("../images/u1.gif")',"background-size":"100%","background-repeat":"no-repeat"});var divID2="#"+$scope.user2.xLocation.toString()+"-"+$scope.user2.yLocation.toString();$(divID2).css({"background-image":'url("../images/u2.gif")',"background-size":"100%","background-repeat":"no-repeat"})};$scope.startGame=function(){var person=prompt("Please enter your username","username");null!==person&&(myUsername=person,gamePlay=!0,UserData.getUser().then(setUsers))};var checkUnderground=function(xLocation,yLocation){var xDiff=xLocation-$scope.xTreasure,yDiff=yLocation-$scope.yTreasure;return 0===xDiff&&yDiff>0?0:0===xDiff&&0>yDiff?1:0===xDiff&&0===yDiff?2:0>xDiff&&yDiff>0?3:0>xDiff&&0>yDiff?4:0>xDiff&&0===yDiff?5:xDiff>0&&yDiff>0?6:xDiff>0&&0>yDiff?7:xDiff>0&&0===yDiff?8:9},dig=function(user,usersBack){var oneDug={},x=user.xLocation,y=user.yLocation;oneDug.xLocation=x,oneDug.yLocation=y,$scope.dug.push(oneDug),$scope.map[x][y].dug=!0;var underground=checkUnderground(x,y),divID="#"+x.toString()+"-"+y.toString(),_sBg=$(divID).css("background-image");switch(underground){case 0:$(divID).css({"background-image":'url("../images/W.png"),'+_sBg,"background-size":"100%","background-repeat":"no-repeat"});break;case 1:$(divID).css({"background-image":'url("../images/E.png"),'+_sBg,"background-size":"100%","background-repeat":"no-repeat"});break;case 2:$(divID).css({"background-image":'url("../images/treasure.png"),'+_sBg,"background-size":"100%","background-repeat":"no-repeat"}),$scope.user1.turn===!0?alert($scope.user1.userName+" find the treasure!"):alert($scope.user2.userName+" find the treasure!"),gamePlay=!1;break;case 3:$(divID).css({"background-image":'url("../images/SW.png"),'+_sBg,"background-size":"100%","background-repeat":"no-repeat"});break;case 4:$(divID).css({"background-image":'url("../images/SE.png"),'+_sBg,"background-size":"100%","background-repeat":"no-repeat"});break;case 5:$(divID).css({"background-image":'url("../images/S.png"),'+_sBg,"background-size":"100%","background-repeat":"no-repeat"});break;case 6:$(divID).css({"background-image":'url("../images/NW.png"),'+_sBg,"background-size":"100%","background-repeat":"no-repeat"});break;case 7:$(divID).css({"background-image":'url("../images/NE.png"),'+_sBg,"background-size":"100%","background-repeat":"no-repeat"});break;case 8:$(divID).css({"background-image":'url("../images/N.png"),'+_sBg,"background-size":"100%","background-repeat":"no-repeat"})}usersBack[2],usersBack[3];$scope.userGet=usersBack,$scope.user1=usersBack[0],$scope.user2=usersBack[1],$scope.user1.digNow=!1,$scope.user2.digNow=!1,$scope.user1.turn=!$scope.user1.turn,$scope.user2.turn=!$scope.user2.turn},move=function(user,newX,newY){console.log("the user moves"),user.xLocation=newX,user.yLocation=newY},updateUsers=function(usersBack){var user1Save=usersBack[2],user2Save=usersBack[3];if($scope.userGet=usersBack,$scope.user1=usersBack[0],$scope.user2=usersBack[1],user1Save.xLocation!==$scope.user1.xLocation||user1Save.yLocation!==$scope.user1.yLocation){var divID1="#"+user1Save.xLocation.toString()+"-"+user1Save.yLocation.toString();$(divID1).css({"background-image":"","background-size":"100%","background-repeat":"no-repeat"}),divID1="#"+$scope.user1.xLocation.toString()+"-"+$scope.user1.yLocation.toString(),$(divID1).css({"background-image":'url("../images/u1.gif")',"background-size":"100%","background-repeat":"no-repeat"})}else{var divID2="#"+user2Save.xLocation.toString()+"-"+user2Save.yLocation.toString();$(divID2).css({"background-image":"","background-size":"100%","background-repeat":"no-repeat"}),divID2="#"+$scope.user2.xLocation.toString()+"-"+$scope.user2.yLocation.toString(),$(divID2).css({"background-image":'url("../images/u2.gif")',"background-size":"100%","background-repeat":"no-repeat"})}$scope.user1.digNow=!1,$scope.user2.digNow=!1,$scope.user1.turn=!$scope.user1.turn,$scope.user2.turn=!$scope.user2.turn},update=function(usersBack){usersBack[0].turn===!0?usersBack[0].digNow===!0?dig(usersBack[0],usersBack):(move($scope.user1,usersBack[0].xLocation,usersBack[0].yLocation),updateUsers(usersBack)):usersBack[1].digNow===!0?dig(usersBack[1],usersBack):(move($scope.user2,usersBack[1].xLocation,usersBack[1].yLocation),updateUsers(usersBack))};socket.on("serverBack",function(data){update(data.users)}),$scope.clickDiv=function(x,y){if(gamePlay===!1)return void alert("you haven't start the game");var turnUserName,distance,block=!1;if($scope.user1.turn===!0?(turnUserName=$scope.user1.userName,distance=Math.abs(x-$scope.user1.xLocation)+Math.abs(y-$scope.user1.yLocation),x===$scope.user2.xLocation&&y===$scope.user2.yLocation&&(block=!0)):(turnUserName=$scope.user2.userName,distance=Math.abs(x-$scope.user2.xLocation)+Math.abs(y-$scope.user2.yLocation),x===$scope.user1.xLocation&&y===$scope.user1.yLocation&&(block=!0)),turnUserName!==myUsername)return void alert("It's not your turn");if(distance>1)return void alert("you can not move that far");if(block===!0)return void alert("you can not move there, another player blocks you");var user1Save={};user1Save.xLocation=$scope.user1.xLocation,user1Save.yLocation=$scope.user1.yLocation;var user2Save={};user2Save.xLocation=$scope.user2.xLocation,user2Save.yLocation=$scope.user2.yLocation,console.log(x,y);var divID1="#"+$scope.user1.xLocation.toString()+"-"+$scope.user1.yLocation.toString();$(divID1).css("border","1px solid black"),$(divID1).html(""),console.log(divID1);var divID2="#"+$scope.user2.xLocation.toString()+"-"+$scope.user2.yLocation.toString();$(divID2).css("border","1px solid black"),$(divID2).html(""),$scope.user1.turn===!0?x===$scope.user1.xLocation&&y===$scope.user1.yLocation?$scope.user1.digNow=!0:($scope.user1.xLocation=x,$scope.user1.yLocation=y,$scope.user1.digNow=!1):x===$scope.user2.xLocation&&y===$scope.user2.yLocation?$scope.user2.digNow=!0:($scope.user2.xLocation=x,$scope.user2.yLocation=y,$scope.user2.digNow=!1),socket.emit("userMove",[$scope.user1,$scope.user2,user1Save,user2Save])}}]),mp4Controllers.controller("UserController",["$scope","UserData",function($scope,UserData){$scope.users;var setUser=function(data){$scope.users=data};UserData.getUser().then(setUser);var socket=io("http://localhost:4000");socket.emit("event",{message:233}),socket.on("back",function(data){})}]);