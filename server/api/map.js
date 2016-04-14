var Map = require('../models/map');

var map = {
    getMap: function(req, res){
        Map.find().exec(function(err,data){
            // if (err)
            //     res.send(err);
            res.json(data);
        });
    },
    create: function(req, res){
        var map=new Map();
        map.xLocation=req.body.xLocation;
        map.yLocation=req.body.yLocation;
        map.digged=req.body.digged;
        map.xTreasure=req.body.xTreasure;
        map.yTreasure=req.body.yTreasure;
        map.save(function(err,data){
            // if (err)
                // res.send(err);
            res.json(data);
        })
    }
};

// Return the object
module.exports = map;


// digged  :  Boolean,
//     xLocation :  Number,
//     yLocation :  Number,
//     xTreasure :  Number,
//     yTreasure :  Number

// var map = require('./api/map');
// router.get('/map', map.getMap);
// router.post('/map', map.create);

// var user = require('./api/user');
// router.get('/user', user.getUser);
// router.put('/user', user.replace);
// router.post('/user', user.create);