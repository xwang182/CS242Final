var Map = require('../models/map');

var map = {
    getMap: function(req, res){
        Map.find().exec(function(err,data){
            if (err)
                res.send(err);
            res.json(data);
        });
    },
    create: function(req, res){
        var map=new Map();
        map.xLocation=req.body.xLocation;
        map.yLocation=req.body.yLocation;
        map.revealed=req.body.revealed;
        map.xTreasure=req.body.xTreasure;
        map.yTreasure=req.body.yTreasure;
        map.save(function(err,data){
            if (err)
                res.send(err);
            res.json(data);
        })
    }
};

// Return the object
module.exports = map;
