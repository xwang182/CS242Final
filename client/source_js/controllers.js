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
    $scope.person;

    $scope.resetGame = function(){
        $scope.user1.xLocation = 0;
        $scope.user1.yLocation = 0;
        $scope.user2.xLocation = 9;
        $scope.user2.yLocation = 9;
        UserData.postUser($scope.user1._id,$scope.user1).then(setUsers);
        UserData.postUser($scope.user2._id,$scope.user2).then(setUsers);

    };
    // $scope.showTurn;

    // $scope.changeTurn = function(){
    //     // if($scope.user1.turn === true && $scope.user1.userName === $scope.person){
    //     //     $scope.showTurn = true;
    //     //     return;
    //     // }
    //     // if($scope.user2.turn === true && $scope.user2.userName === $scope.person){
    //     //     $scope.showTurn = true;
    //     //     return;
    //     // }
    //     // $scope.showTurn = false;
    //     alert($scope.showTurn);
    // }

    var gamePlay = false;

    var myUsername;


    var socket = io('http://162.243.29.34:4000');


      /*
     The code below creates the random position of the treasure
     Param: rows,cols
     */
    var randomPosition = function(rows, cols)
    {
        var x=Math.floor(Math.random() * cols) + 1;
        var y=Math.floor(Math.random() * rows) + 1;
        return [x, y];
    };


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
        $( divID1).css({
            'background-image': 'url("../images/u1.gif")',
            'background-size' : '100%',
            'background-repeat': 'no-repeat'
            });

        var divID2 = "#" + $scope.user2.xLocation.toString() + "-" + $scope.user2.yLocation.toString();
        $( divID2).css({
            'background-image': 'url("../images/u2.gif")',
            'background-size' : '100%',
            'background-repeat': 'no-repeat'
            });
        


    };
    var setUserNew = function(data){
        UserData.getUser().then(setUsers);
    };


    var setUser1 = function(data){
        $scope.user2.xLocation = 9;
        $scope.user2.yLocation = 9;
        UserData.postUser($scope.user2._id,$scope.user2).then(setUserNew);

    };

    var resetUser = function(data){

        $scope.userGet=data;
        $scope.user1 = $scope.userGet[0];
        $scope.user2 = $scope.userGet[1];

        $scope.user1.xLocation = 0;
        $scope.user1.yLocation = 0;
        UserData.postUser($scope.user1._id,$scope.user1).then(setUser1);
    };

    $scope.startGame = function(){
        $scope.person = prompt("Please enter your username", "username");
        if($scope.person === "u1"){
            $( "#p").css({
            'height' : '30px',
            'width'  : '30px',
            'background-image': 'url("../images/u2.gif")',
            'background-size' : '100%',
            'background-repeat': 'no-repeat'
            });
            // $scope.showTurn = $scope.user1.turn;


        }
        if($scope.person === "u2"){
            $( "#p").css({
            'height' : '30px',
            'width'  : '30px',
            'background-image': 'url("../images/u1.gif")',
            'background-size' : '100%',
            'background-repeat': 'no-repeat'
            });
            // $scope.showTurn = $scope.user2.turn;
        }

        

        if($scope.person !== null){
            myUsername =$scope.person;
            gamePlay = true;
            var socket = io('http://162.243.29.34:4000');
            // console.log(randomPosition($scope.rows,$scope.cols));
            // console.log()
            socket.emit('treasurePosition', randomPosition($scope.rows,$scope.cols));
        
            UserData.getUser().then(resetUser);
        }

    };

    
    var setMap = function(data){
        var newPosition = data[data.length-1];
        $scope.xTreasure = newPosition[0];
        $scope.yTreasure = newPosition[1];
        console.log("treasure position:");
        console.log($scope.xTreasure);
        console.log($scope.yTreasure);

    };

    $scope.contGame = function(){
        $scope.person = prompt("Please enter your username", "username");
        if($scope.person === "u1"){
            $( "#p").css({
            'height' : '30px',
            'width'  : '30px',
            'background-image': 'url("../images/u2.gif")',
            'background-size' : '100%',
            'background-repeat': 'no-repeat'
            });


        }
        if($scope.person === "u2"){
            $( "#p").css({
            'height' : '30px',
            'width'  : '30px',
            'background-image': 'url("../images/u1.gif")',
            'background-size' : '100%',
            'background-repeat': 'no-repeat'
            });
        }

        

        if($scope.person !== null){
            myUsername =$scope.person;
            gamePlay = true;
            // var socket = io('http://localhost:4000');
            // console.log(randomPosition($scope.rows,$scope.cols));
            // socket.emit('treasurePosition', randomPosition($scope.rows,$scope.cols));
            MapData.getMap().then(setMap);
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

        return 9;
    };






    /*
     The code below handles the user dig action
     Param: users
     */

    var dig = function(user,usersBack){
        var oneDug = {};
        var x=user["xLocation"];
        var y=user["yLocation"];
        oneDug["xLocation"] = x;
        oneDug["yLocation"] = y;
        $scope.dug.push(oneDug);
        $scope.map[x][y]["dug"] = true;


        var underground=checkUnderground(x,y);
        var divID = "#" + x.toString() + "-" + y.toString();
        var _sBg = $(divID).css('background-image');
        switch(underground) {
            case 0:
                $( divID).css({
                    'background-image':  'url("../images/W.png"),' + _sBg ,
                    'background-size' : '100%',
                    'background-repeat': 'no-repeat'
                });
                break;
            case 1:
                $( divID).css({
                    'background-image':  'url("../images/E.png"),' + _sBg ,
                    'background-size' : '100%',
                    'background-repeat': 'no-repeat'
                });
                break;
            case 2:
                $( divID).css({
                    'background-image':  'url("../images/treasure.png"),' + _sBg ,
                    'background-size' : '100%',
                    'background-repeat': 'no-repeat'
                });
                if ($scope.user1.turn === true) {
                    alert($scope.user1.userName + " find the treasure!");
                }
                else {
                    alert($scope.user2.userName + " find the treasure!");
                }
                gamePlay = false;

                break;
            case 3:
                $( divID).css({
                    'background-image':  'url("../images/SW.png"),' + _sBg ,
                    'background-size' : '100%',
                    'background-repeat': 'no-repeat'
                });
                break;
            case 4:
                $( divID).css({
                    'background-image':  'url("../images/SE.png"),' + _sBg ,
                    'background-size' : '100%',
                    'background-repeat': 'no-repeat'
                });
                break;
            case 5:
                $( divID).css({
                    'background-image':  'url("../images/S.png"),' + _sBg ,
                    'background-size' : '100%',
                    'background-repeat': 'no-repeat'
                });
                break;
            case 6:
                $( divID).css({
                    'background-image':  'url("../images/NW.png"),' + _sBg ,
                    'background-size' : '100%',
                    'background-repeat': 'no-repeat'
                });
                break;
            case 7:
                $( divID).css({
                    'background-image':  'url("../images/NE.png"),' + _sBg ,
                    'background-size' : '100%',
                    'background-repeat': 'no-repeat'
                });
                break;
            case 8:
                $( divID).css({
                    'background-image':  'url("../images/N.png"),' + _sBg ,
                    'background-size' : '100%',
                    'background-repeat': 'no-repeat'
                });
                break;
        }


        var user1Save = usersBack[2];
        var user2Save = usersBack[3];



        $scope.userGet=usersBack;
        $scope.user1 = usersBack[0];
        $scope.user2 = usersBack[1];


        $scope.user1.digNow = false;
        $scope.user2.digNow = false;

        $scope.user1.turn = !$scope.user1.turn;
        $scope.user2.turn = !$scope.user2.turn;
    };


    /*
     The code below handles the user move action
     Param: users,newX,newY
     */

    var move = function(user,newX,newY){
        console.log("the user moves");
        user["xLocation"]=newX;
        user["yLocation"]=newY;
//        console.log($scope.xTreasure);
//        console.log($scope.yTreasure);
    };

    /*
     The code below updates user info between two clients
     */

    var updateUsers = function(usersBack){
        var user1Save = usersBack[2];
        var user2Save = usersBack[3];

        $scope.userGet=usersBack;
        $scope.user1 = usersBack[0];
        $scope.user2 = usersBack[1];

        if(user1Save.xLocation !== $scope.user1.xLocation || user1Save.yLocation !== $scope.user1.yLocation){
            var divID1 = "#" + user1Save.xLocation.toString() + "-" + user1Save.yLocation.toString();
            $( divID1).css({
                'background-image': '',
                'background-size' : '100%',
                'background-repeat': 'no-repeat'
            });
            divID1 = "#" + $scope.user1.xLocation.toString() + "-" + $scope.user1.yLocation.toString();
            $( divID1).css({
                'background-image': 'url("../images/u1.gif")',
                'background-size' : '100%',
                'background-repeat': 'no-repeat'
            });
        }
        else{
            var divID2 = "#" + user2Save.xLocation.toString() + "-" + user2Save.yLocation.toString();
            $( divID2).css({
                'background-image': '',
                'background-size' : '100%',
                'background-repeat': 'no-repeat'
            });
            divID2 = "#" + $scope.user2.xLocation.toString() + "-" + $scope.user2.yLocation.toString();
            $( divID2).css({
                'background-image': 'url("../images/u2.gif")',
                'background-size' : '100%',
                'background-repeat': 'no-repeat'
            });
        }

        $scope.user1.digNow = false;
        $scope.user2.digNow = false;

        $scope.user1.turn = !$scope.user1.turn;
        $scope.user2.turn = !$scope.user2.turn;

    };

    /*
     The code below controls the users action
     */

    var update= function(usersBack){
        $scope.showTurn = !$scope.showTurn;

        if(usersBack[0].turn ===true){
            if(usersBack[0].digNow ===true){
                dig(usersBack[0],usersBack);
            }
            else{
                move($scope.user1,usersBack[0].xLocation,usersBack[0].yLocation);
                updateUsers(usersBack);

            }
        }
        else{
            if(usersBack[1].digNow ===true){
                dig(usersBack[1],usersBack);
            }
            else{
                move($scope.user2,usersBack[1].xLocation,usersBack[1].yLocation);
                updateUsers(usersBack);

            }
        }
    };


    socket.on('serverBack', function (data){
        update(data.users);

    });

//    $scope.$watch("showTurn", $scope.changeTurn, true);
    socket.on('treasureBack', function (data){
        $scope.xTreasure=data.treasurePosition[0];
        $scope.yTreasure=data.treasurePosition[1];
    });


    /*
     The code below handles the condition when user click the div on the html
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
//        console.log(x,y);
        var divID1 = "#" + $scope.user1.xLocation.toString() + "-" + $scope.user1.yLocation.toString();
        $( divID1 ).css( "border", "1px solid black" );
        $( divID1 ).html("");
//        console.log(divID1);
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
// $scope.showTurn = !$scope.showTurn;
    };



}]);


mp4Controllers.controller('UserController', ['$scope', 'UserData'  , function($scope, UserData) {
    $scope.users;
    var setUser = function(data){
        $scope.users=data;
    };
    UserData.getUser().then(setUser);


    var socket = io('http://162.243.29.34:4000');

    socket.emit('event', {message:233});

    socket.on('back', function (data) {

  });


}]);
