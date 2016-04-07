var User = require('../models/user');

var user = {
    getUser: function(req, res){
        User.find().exec(function(err,data){
            if (err)
                res.send(err);
            res.json(data);
        });
    },
    create: function(req, res){
        var user=new User();
        user.userName=req.body.userName;
        user.userNumber=req.body.userNumber;
        user.xLocation=req.body.xLocation;
        user.yLocation=req.body.yLocation;
        user.save(function(err,data){
            if (err)
                res.send(err);
            res.json(data);
        })
    }
};

// Return the object
module.exports = user;
