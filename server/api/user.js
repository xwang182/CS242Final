var User = require('../models/user');
var Map = require('../models/map');

var user = {
    getUser: function(req, res){
        // console.log("Here");

        User.find().exec(function(err,data){
            // if (err)
            //     res.send(err);
            res.json(data);
        });
    },
    create: function(req, res){
        var user=new User();
        user.userName=req.body.userName;
        user.xLocation=req.body.xLocation;
        user.yLocation=req.body.yLocation;
        user.digNow = req.body.digNow;
        user.turn = req.body.turn;
        user.save(function(err,data){
            // if (err)
                // res.send(err);
            res.json(data);
        })
    },
    replace: function(req, res){
//        console.log("Here");
        User.findByIdAndUpdate(req.params.id, {

            $set: {
                userName    :req.body.userName,
                xLocation   :req.body.xLocation,
                yLocation   :req.body.yLocation,
                digNow      : req.body.digNow,
                turn    : req.body.turn
            }
        },
        function (err, data){
//            console.log(typeof(req.body.digNow));
//            if(req.body.digNow === "true")
//            {
//                var where = {xLocation: req.body.xLocation, yLocation: req.body.yLocation}
//                Map.find(where).exec(function(err, data){
//                    // console.log("data");
//                    // console.log(data);
//                    var mapId = data[0]._id;
//                    console.log(mapId);
//                    Map.findByIdAndUpdate(mapId, {
//                        $set: {
//                            digged : true
//                        }
//                    },
//                        function(err2,data2){
//                            console.log("Change map");
//                        })
//                })
//            }
            res.json(data);
        }
        )
    }

};

// Return the object
module.exports = user;



// var schema = {
//     userName   :  String,
//     xLocation  :  Number,
//     yLocation  :  Number,
//     digNow: Boolean,
//     turn: Boolean
// };