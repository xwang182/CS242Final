var Task = require('../models/task');
var User = require('../models/user');
// Wrap all the methods in an object

var task = {

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
              Task.find(where).skip(skipBy).count().exec(function(err,data){
                  if (err)
                      res.send(err);
                  res.json(data);
              });
          }
          else{
              Task.find(where).skip(skipBy).limit(limitBy).count().exec(function(err,data){
                  if (err)
                      res.send(err);
                  res.json(data);
              });
          }

      }
      else{
          Task.find(where).select(selectBy).sort(sortBy).skip(skipBy).limit(limitBy).exec(function(err,data){
              if (err)
                  res.send(err);
              res.json(data);
          });
      }




  },

  create: function(req, res){

    var task = new Task();
    task.name=req.body.name;
    task.description=req.body.description;
    task.deadline=req.body.deadline;
    task.completed=req.body.completed;
    task.assignedUser=req.body.assignedUser;
    task.assignedUserName=req.body.assignedUserName;
    task.dateCreated=new Date();

    task.save(function(err,data){
        if (err)
            console.log(err);
        else{
            User.findByIdAndUpdate(req.body.assignedUser, {
                    $push: {
                        pendingTasks  : data._id
                    }
                },
                function(err){
                    if (err)
                        res.send(err);
                }
            );
        }
        res.send(data);
    });
  } ,



  options: function(req, res){
    res.json({ message: 'Task Hello options World!' });
  },


  getOne: function(req, res){
      Task.findById(req.params.id,function(err,data){
          if (err)
              res.send(err);
          res.json(data);
      });
  },

  replace: function(req, res){
      Task.findByIdAndUpdate(req.params.id, {
              $set: {
                  name             : req.body.name,
                  description      : req.body.description,
                  deadline         : req.body.deadline,
                  completed        : req.body.completed,
                  assignedUser     : req.body.assignedUser,
                  assignedUserName : req.body.assignedUserName,
                  dateCreated      : new Date()
              }
          },
          function(err,data){
              if (err)
                  res.send(err);
              else{
                  User.findByIdAndUpdate(data.assignedUser, {
                          $pull: {
                              pendingTasks  : data._id
                          }
                      },
                      function(err){
                          if (err)
                              res.send(err);
                      }
                  );
                  User.findByIdAndUpdate(req.body.assignedUser, {
                          $push: {
                              pendingTasks  : data._id
                          }
                      },
                      function(err){
                          if (err)
                              console.log("don't have this user in creating task");
                      }
                  );
              }
              res.json(data);
          }
      );
  },

  deleteOne: function(req, res){
      Task.findByIdAndRemove(req.params.id,function(err,data){
          if (err)
              res.send(err);
          else{
              if(data.assignedUser!=="undefined"){
                  User.findByIdAndUpdate(data.assignedUser, {
                          $pull: {
                              pendingTasks  : data._id
                          }
                      },
                      function(err){
                          if (err)
                              console.log("don't have this user in deleting task");
                      }
                  );
              }

          }
          res.json({message:'Task is deleted from the database!'});
      });
  }
};

// Return the object
module.exports = task;
