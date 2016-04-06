var User = require('../models/user');
var Task = require('../models/task');

// Wrap all the methods in an object

var user = {

//    options

  getAll: function(req, res){
      User.find().exec(function(err,data){
          if (err)
              res.send(err);
          res.json(data);
      });

  },




  getOne: function(req, res){
      User.findById(req.params.id,function(err,data){
          if (err)
              res.send(err);
          res.json(data);
      });
  },

};

// Return the object
module.exports = user;
