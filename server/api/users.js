var User = require('../models/user');
var Task = require('../models/task');

// Wrap all the methods in an object

var user = {

//    options

  getAll: function(req, res){
      var where=eval("("+req.query.where+")");
      var selectBy=eval("("+req.query.select+")");
      var sortBy=eval("("+req.query.sort+")");
      var skipBy=parseInt(req.query.skip);
      var limitBy=parseInt(req.query.limit);
      if(req.query.count==="True" || req.query.count==="true"){
          if(req.query.skip=== undefined){
              skipBy=0;
          }

          if(req.query.limit=== undefined){
              User.find(where).skip(skipBy).count().exec(function(err,data){
                  if (err)
                      res.send(err);
                  res.json(data);
              });
          }
          else{
              User.find(where).skip(skipBy).limit(limitBy).count().exec(function(err,data){
                  if (err)
                      res.send(err);
                  res.json(data);
              });
          }

      }
      else{
          User.find(where).select(selectBy).sort(sortBy).skip(skipBy).limit(limitBy).exec(function(err,data){
              if (err)
                  res.send(err);
              res.json(data);
          });
      }

  },


  create: function(req, res){

    var user = new User();
    user.name=req.body.name;
    user.email=req.body.email;
    user.pendingTasks=[];
    user.dateCreated=new Date();

    user.save(function(err,data){
        if (err)
            console.log(err);
        res.send(data);
    });
  } ,



  options: function(req, res){
    res.json({ message: 'User Hello options World!' });
  },


  getOne: function(req, res){
      User.findById(req.params.id,function(err,data){
          if (err)
              res.send(err);
          res.json(data);
      });
  },

  replace: function(req, res){
      User.findByIdAndUpdate(req.params.id, {
              $set: {
                  name          : req.body.name,
                  email         : req.body.email,
                  pendingTasks  : req.body.pendingTasks,
                  dateCreated   : new Date()
              }
          },
          function(err,data){
              if (err)
                  res.send(err);
              else{
                  for(var task in req.body.pendingTasks){
                      Task.findByIdAndUpdate(task, {
                              $set: {
                                  assignedUserName :  req.body.name
                              }
                          },
                          function(err){
                              if (err)
                                  res.send(err);
                          });
                  }
              }
              res.json(data);
          }
      );
  },

  deleteOne: function(req, res){
      console.log("in server deleteOne");
      User.findByIdAndRemove(req.params.id,function(err,data){
          if (err)
              res.send(err);
          else{
              for(var task in data.pendingTasks){
                      Task.findByIdAndUpdate(task, {
                              $set: {
                                  assignedUser     :  "undefined",
                                  assignedUserName :  "undefined"
                              }
                          },
                          function(err){
                              if (err)
                                  res.send(err);
                          });
              }
          }
          res.json(data);
      });
  }

};

// Return the object
module.exports = user;
