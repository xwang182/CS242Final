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
                  if (err){
                      res.status(500).json({"message":err.message,"data":{} });
                      return;
                  }
                  res.status(200).json({"message":"OK","data":data });
              });
          }
          else{
              User.find(where).skip(skipBy).limit(limitBy).count().exec(function(err,data){
                  if (err){
                      res.status(500).json({"message":err.message,"data":{} });
                      return;
                  }
                  res.status(200).json({"message":"OK","data":data });
              });
          }

      }
      else{
          User.find(where).select(selectBy).sort(sortBy).skip(skipBy).limit(limitBy).exec(function(err,data){
              if (err){
                  res.status(500).json({"message":err.message,"data":{} });
                  return;
              }
              res.status(200).json({"message":"OK","data":data });
          });
      }

  },


  create: function(req, res){

    var user = new User();
    user.name=req.body.name;
    user.email=req.body.email;
    user.pendingTasks=[];
    user.dateCreated=new Date();

    User.find( { email: user.email } ).exec(function(err,data){
        if (err){
            res.status(500).json({"message":err.message,"data":{} });
            return;
        }
        if(data.length !== 0){
            res.status(500).json({"message":"User has already created with this email","data":{} });
        }
        else{
            user.save(function(err,data){
                if (err){
                    res.status(500).json({"message":err.message,"data":{} });
                    return;
                }
                res.status(201).json({"message":"OK","data":data });
            });
        }

    });


  } ,



  options: function(req, res){
      res.writeHead(200);
      res.end();
  },


  getOne: function(req, res){
      User.findById(req.params.id,function(err,data){
          if(req.params.id === "unassigned"){
              res.status(404).json({"message":"User not found","data":{} });
              return;
          }
          if (err){
              res.status(500).json({"message":err.message,"data":{} });
              return;
          }
          if(data === null){
              res.status(404).json({"message":"User not found","data":{} });
              return;
          }
          res.status(200).json({"message":"OK","data":data });
      });
  },

  replace: function(req, res){
      if(typeof(req.body.pendingTasks) === "string" ){
          req.body.pendingTasks = [req.body.pendingTasks];
      }
      User.findByIdAndUpdate(req.params.id, {
              $set: {
                  name          : req.body.name,
                  email         : req.body.email,
                  pendingTasks  : req.body.pendingTasks,
                  dateCreated   : new Date()
              }
          },
          function(err,data){
              if (err){
                  res.status(500).json({"message":err.message,"data":{} });
                  return;
              }
              else{
                  if(data === null){
                      res.status(404).json({"message":"User not found","data":{} });
                      return;
                  }
                  for(var task0 = 0;  task0< data.pendingTasks.length;task0++){
                      Task.findByIdAndUpdate(data.pendingTasks[task0], {
                              $set: {
                                  assignedUser     :  "unassigned",
                                  assignedUserName :  "unassigned"
                              }
                          },
                          function(err,data2){
                              if (err){
                                  console.log(1);
                                  console.log(err);
                                  return;
                              }
                              if(data2 === null){
                                  console.log("No task with this user");
                                  return;
                              }
                          });
                  }
                  for(var task = 0;  task< req.body.pendingTasks.length;task++){
                      Task.findByIdAndUpdate(req.body.pendingTasks[task], {
                              $set: {
                                  completed        :  false,
                                  assignedUser     :  req.params.id,
                                  assignedUserName :  req.body.name
                              }
                          },
                          function(err,data2){
                              if (err){
                                  console.log(2);
                                  console.log(err);
                                  return;
                              }
                              if(data2 === null){
                                  console.log("No task with this user");
                                  return;
                              }
                          });
                  }
              }
              res.status(200).json({"message":"OK","data":data });
          }
      );
  },

  deleteOne: function(req, res){
      User.findByIdAndRemove(req.params.id,function(err,data){
          if (err){
              res.status(500).json({"message":err.message,"data":{} });
              return;
          }
          else{
              if(data === null){
                  res.status(404).json({"message":"User not found","data":{} });
                  return;
              }
              for(var taskIndex = 0;  taskIndex< data.pendingTasks.length; taskIndex++){
                  Task.findByIdAndUpdate(data.pendingTasks[taskIndex], {
                          $set: {
                              assignedUser     :  "unassigned",
                              assignedUserName :  "unassigned"
                          }
                      },
                      function(err,data2){
                          if (err){
                              console.log(3);
                              console.log(err);
                              return;
                          }
                          if(data2 === null){
                              console.log("No task with this user");
                              return;
                          }
                      });
              }

              var where = { completed:true,assignedUser:req.params.id };
              Task.find(where).exec(function(err,data2){
                  if (err){
                      res.status(500).json({"message":err.message,"data":{} });
                      return;
                  }
                  for(var index =0;index<data2.length;index++){
                       Task.findByIdAndUpdate(data2[index]._id, {
                          $set: {
                              assignedUser     :  "unassigned",
                              assignedUserName :  "unassigned"
                          }
                      },
                      function(err,data3){
                          if (err){
                              console.log(3);
                              console.log(err);
                              return;
                          }
                          if(data3 === null){
                              console.log("No task with this user");
                              return;
                          }
                      });
                  }
              });

          }
          res.status(200).json({"message":"OK","data":data });
      });
  }

};

// Return the object
module.exports = user;
