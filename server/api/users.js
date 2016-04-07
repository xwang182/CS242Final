var User = require('../models/user');

var user = {

//    options

  getAll: function(req, res){
      User.find().exec(function(err,data){
          if (err)
              res.send(err);
          res.json(data);
      });
  }


};

// Return the object
module.exports = user;
