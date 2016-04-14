var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('MapController', ['$scope', 'MapData' ,'UserData' , function($scope, MapData, UserData) {
    $scope.map;
    $scope.mapGet;
    $scope.userGet;
    $scope.xTreasure = 1;
    $scope.yTreasure = 1;
    $scope.dug = [];
    $scope.rows = 4;
    $scope.cols = 4;
    $scope.user1;
    $scope.user2;


    var socket = io('http://localhost:4000');


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







    //var setMap = function(data){
    //    $scope.mapGet=data;
    //    //console.log($scope.maps);
    //    var mapCell = {};
    //    $scope.maps;
    //    $scope.maps[mapGet.xLocation][mapGet.yLocation]=mapCell;
    //
    //};
    //MapData.getMap().then(setMap);




    var setUsers = function(data){
        $scope.userGet=data;
        $scope.user1 = $scope.userGet[0];
        $scope.user2 = $scope.userGet[1];

        var divID1 = "#" + $scope.user1.xLocation.toString() + "-" + $scope.user1.yLocation.toString();
        $( divID1 ).css( "border", "3px solid blue" );
        $( divID1 ).html("1");
        var divID2 = "#" + $scope.user2.xLocation.toString() + "-" + $scope.user2.yLocation.toString();
        $( divID2 ).css( "border", "3px solid blue" );
        $( divID2 ).html("2");
    };


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



    UserData.getUser().then(setUsers);



    var dig = function(user){
        var oneDug = {};
        var x=user["xLocation"];
        var y=user["yLocation"];
        oneDug["xLocation"] = x;
        oneDug["yLocation"] = y;
        $scope.dug.push(oneDug);
        $scope.map[x][y]["dug"] = true;

        var divID = "#" + x.toString() + "-" + y.toString();
        $( divID ).css( "background-color", "red" );

    };

    var move = function(user,newX,newY){
        console.log("the user moves");
//        user["xLocation"]=newX;
//        user["yLocation"]=newY;
    };

    var updateUsers = function(usersBack){
        var user1Save = usersBack[2];
        var user2Save = usersBack[3];

        var divID1 = "#" + user1Save.xLocation.toString() + "-" + user1Save.yLocation.toString();
        $( divID1 ).css( "border", "1px solid black" );
        $( divID1 ).html("");
        console.log(divID1);
        var divID2 = "#" + user2Save.xLocation.toString() + "-" + user2Save.yLocation.toString();
        $( divID2 ).css( "border", "1px solid black" );
        $( divID2 ).html("");


        $scope.userGet=usersBack;
        $scope.user1 = usersBack[0];
        $scope.user2 = usersBack[1];

        var divID1 = "#" + $scope.user1.xLocation.toString() + "-" + $scope.user1.yLocation.toString();
        $( divID1 ).css( "border", "3px solid blue" );
        $( divID1 ).html("1");
        var divID2 = "#" + $scope.user2.xLocation.toString() + "-" + $scope.user2.yLocation.toString();
        $( divID2 ).css( "border", "3px solid blue" );
        $( divID2 ).html("2");


        $scope.user1.digNow = false;
        $scope.user2.digNow = false;

        $scope.user1.turn = !$scope.user1.turn;
        $scope.user2.turn = !$scope.user2.turn;
    };


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

    $scope.clickDiv =function(x,y){
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
