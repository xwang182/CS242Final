var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('MapController', ['$scope', 'MapData' ,'UserData' , function($scope, MapData, UserData) {

    $scope.map;
    $scope.mapGet;
    $scope.userGet;
    $scope.xTreasure = 1;
    $scope.yTreasure = 1;
    $scope.dug = [];
    $scope.rows = 10;
    $scope.cols = 10;
    $scope.user1;
    $scope.user2;

    var gamePlay = false;

    var myUsername;


    var socket = io('http://localhost:4000');


    /*
     The code below creates an empty map for two players
     Param: rows,cols
     */
    var createEmptyMap = function(rows,cols) {
        var arr = [];

        for (var i=0;i<rows;i++) {
            var oneRow = [];
            for (var j=0;j<cols;j++) {
                var map = {};
                map["xLocation"] = i;
                map["yLocation"] = j;
                map["xTreasure"] = $scope.xTreasure;
                map["yTreasure"] = $scope.yTreasure;
                map["dug"] = false;
                oneRow.push(map);
            }
            arr.push(oneRow);
        }

        return arr;
    };
    $scope.map = createEmptyMap($scope.rows,$scope.rows);







    /*
     The code below sets up a basic info for two users
     Param: data
     */
    var setUsers = function(data){
        $scope.userGet=data;
        $scope.user1 = $scope.userGet[0];
        $scope.user2 = $scope.userGet[1];

        var divID1 = "#" + $scope.user1.xLocation.toString() + "-" + $scope.user1.yLocation.toString();
        $( divID1 ).addClass( "u1" );
        var divID2 = "#" + $scope.user2.xLocation.toString() + "-" + $scope.user2.yLocation.toString();
        $( divID2 ).addClass( "u2" );
    };


    $scope.startGame = function(){
        var person = prompt("Please enter your username", "username");
        if(person !== null){
            myUsername =person;
            gamePlay = true;
            UserData.getUser().then(setUsers);
        }

    };
    /*
     The code below checks the condition when the user digs
     Param: xLocation, yLocation
     */

    var checkUnderground = function(xLocation,yLocation){
        var xDiff = xLocation-$scope.xTreasure;
        var yDiff = yLocation-$scope.yTreasure;
        if(xDiff === 0 && yDiff > 0){
            return 0;
        }
        if(xDiff === 0 && yDiff < 0){
            return 1;
        }
        if(xDiff === 0 && yDiff === 0){
            return 2;
        }

        if(xDiff < 0 && yDiff > 0){
            return 3;
        }
        if(xDiff < 0 && yDiff < 0){
            return 4;
        }
        if(xDiff < 0 && yDiff === 0){
            return 5;
        }

        if(xDiff > 0 && yDiff > 0){
            return 6;
        }
        if(xDiff > 0 && yDiff < 0){
            return 7;
        }

        if(xDiff > 0 && yDiff === 0){
            return 8;
        }

        return 8;
    };






    /*
     The code below handles the user dig action
     Param: users
     */

    var dig = function(user){
        var oneDug = {};
        var x=user["xLocation"];
        var y=user["yLocation"];
        oneDug["xLocation"] = x;
        oneDug["yLocation"] = y;
        $scope.dug.push(oneDug);
        $scope.map[x][y]["dug"] = true;


        var underground=checkUnderground(x,y);
        var divID = "#" + x.toString() + "-" + y.toString();
        switch(underground) {
            case 0:
                var _sBg = $(divID).css('background-image');
                $(divID).css('background-image', _sBg + ', url(../images/W.png)');
                break;
            case 1:
                var _sBg = $(divID).css('background-image');
                $(divID).css('background-image', _sBg + ', url(../images/E.png)');
                break;
            case 2:
                var _sBg = $(divID).css('background-image');
                $(divID).css('background-image', _sBg + ', url(../images/treasure.png)');
                if($scope.user1.turn === true){
                    alert($scope.user1.userName + " find the treasure!");
                }
                else{
                    alert($scope.user2.userName + " find the treasure!");
                }
                gamePlay = false;
                break;
            case 3:
                var _sBg = $(divID).css('background-image');
                $(divID).css('background-image', _sBg + ', url(../images/SW.png)');
                break;
            case 4:
                var _sBg = $(divID).css('background-image');
                $(divID).css('background-image', _sBg + ', url(../images/SE.png)');
                break;
            case 5:
                var _sBg = $(divID).css('background-image');
                $(divID).css('background-image', _sBg + ', url(../images/S.png)');
                break;
            case 6:
                var _sBg = $(divID).css('background-image');
                $(divID).css('background-image', _sBg + ', url(../images/NW.png)');
                break;
            case 7:
                var _sBg = $(divID).css('background-image');
                $(divID).css('background-image', _sBg + ', url(../images/NE.png)');
                break;
            case 8:
                var _sBg = $(divID).css('background-image');
                $(divID).css('background-image', _sBg + ', url(../images/N.png)');
                break;
            default:
                $( divID ).css( "background-color", "red" );
        }

    };


    /*
     The code below handles the user move action
     Param: users,newX,newY
     */

    var move = function(user,newX,newY){
        console.log("the user moves");
        user["xLocation"]=newX;
        user["yLocation"]=newY;
    };

    /*
     The code below updates user info between two clients
     */

    var updateUsers = function(usersBack){
        var user1Save = usersBack[2];
        var user2Save = usersBack[3];

        var divID1 = "#" + user1Save.xLocation.toString() + "-" + user1Save.yLocation.toString();
        $( divID1 ).removeClass( "u1" );
        var divID2 = "#" + user2Save.xLocation.toString() + "-" + user2Save.yLocation.toString();
        $( divID2 ).removeClass( "u2" );



        $scope.userGet=usersBack;
        $scope.user1 = usersBack[0];
        $scope.user2 = usersBack[1];

        var divID1 = "#" + $scope.user1.xLocation.toString() + "-" + $scope.user1.yLocation.toString();
        $( divID1 ).addClass( "u1" );
        var divID2 = "#" + $scope.user2.xLocation.toString() + "-" + $scope.user2.yLocation.toString();
        $( divID2 ).addClass( "u2" );


        $scope.user1.digNow = false;
        $scope.user2.digNow = false;

        $scope.user1.turn = !$scope.user1.turn;
        $scope.user2.turn = !$scope.user2.turn;
    };

    /*
     The code below controls the users action
     */

    var update= function(usersBack){
        console.log("in update");


        if(usersBack[0].turn ===true){
            if(usersBack[0].digNow ===true){
                dig(usersBack[0]);
            }
            else{
                move($scope.user1,usersBack[0].xLocation,usersBack[0].yLocation);
            }
        }
        else{
            if(usersBack[1].digNow ===true){
                dig(usersBack[1]);
            }
            else{
                move($scope.user2,usersBack[1].xLocation,usersBack[1].yLocation);
            }
        }
        updateUsers(usersBack);
    };


    socket.on('serverBack', function (data){
        console.log("get back");
        update(data.users);
    });


    /*
     The code below handles the conditon when user click the div on the html
    */

    $scope.clickDiv =function(x,y){
        if(gamePlay === false){
            alert("you haven't start the game");
            return;
        }
        var turnUserName;
        var distance;
        var block = false;
        if($scope.user1.turn === true){
            turnUserName = $scope.user1.userName;
            distance = Math.abs(x - $scope.user1.xLocation ) + Math.abs(y - $scope.user1.yLocation ) ;
            if(x === $scope.user2.xLocation && y === $scope.user2.yLocation){
                block = true;
            }
        }
        else{
            turnUserName = $scope.user2.userName;
            distance = Math.abs(x - $scope.user2.xLocation ) + Math.abs(y - $scope.user2.yLocation ) ;
            if(x === $scope.user1.xLocation && y === $scope.user1.yLocation){
                block = true;
            }
        }
        if(turnUserName !== myUsername){
            alert("It's not your turn");
            return;
        }
        if(distance > 1){
            alert("you can not move that far");
            return;
        }
        if(block === true){
            alert("you can not move there, another player blocks you");
            return;
        }
        var user1Save= {};
        user1Save.xLocation = $scope.user1.xLocation;
        user1Save.yLocation = $scope.user1.yLocation;
        var user2Save= {};
        user2Save.xLocation = $scope.user2.xLocation;
        user2Save.yLocation = $scope.user2.yLocation;
        console.log(x,y);
        var divID1 = "#" + $scope.user1.xLocation.toString() + "-" + $scope.user1.yLocation.toString();
        $( divID1 ).css( "border", "1px solid black" );
        $( divID1 ).html("");
        console.log(divID1);
        var divID2 = "#" + $scope.user2.xLocation.toString() + "-" + $scope.user2.yLocation.toString();
        $( divID2 ).css( "border", "1px solid black" );
        $( divID2 ).html("");

        if($scope.user1.turn === true){
            if(x === $scope.user1.xLocation  && y === $scope.user1.yLocation){
                $scope.user1.digNow = true;
            }
            else{
                $scope.user1.xLocation = x;
                $scope.user1.yLocation = y;
                $scope.user1.digNow = false;
            }
        }
        else{
            if(x === $scope.user2.xLocation  && y === $scope.user2.yLocation){
                $scope.user2.digNow = true;
            }
            else{
                $scope.user2.xLocation = x;
                $scope.user2.yLocation = y;
                $scope.user2.digNow = false;
            }
        }
        socket.emit('userMove', [$scope.user1 , $scope.user2,user1Save,user2Save]);

    };



}]);


mp4Controllers.controller('UserController', ['$scope', 'UserData'  , function($scope, UserData) {
    $scope.users;
    var setUser = function(data){
        $scope.users=data;
        console.log($scope.users);
    };
    UserData.getUser().then(setUser);


    var socket = io('http://localhost:4000');

    socket.emit('event', {message:233});

    socket.on('back', function (data) {
        console.log("from server");
        console.log(data);

  });


}]);
