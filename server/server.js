// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();

//replace this with your Mongolab URL
mongoose.connect('mongodb://cs242:cs242@ds015690.mlab.com:15690/cs242');

// Create our Express application
var app = express();

var server = require('http').createServer(app);



// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "DELETE");
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// All our routes will start with /api
app.use('/api', router);


//Define routes here

var map = require('./api/map');
router.get('/map', map.getMap);
router.post('/map', map.create);

var user = require('./api/user');
router.get('/user', user.getUser);
router.put('/user/:id', user.replace);
router.post('/user', user.create);


var io = require('socket.io')(server);
io.on('connection', function(socket){
  socket.on('event', function(data){
      console.log("from client");

      socket.broadcast.emit('back', {
      username: "name",
      numUsers: 2
    });
  });

  socket.on('treasurePosition', function(data){
      console.log("randomPosition");

      socket.broadcast.emit('treasureBack',{treasurePosition : data});
  });

  socket.on('userMove', function(data){
      var User = require('./models/user');
      User.findByIdAndUpdate(data[0]._id, {
            $set: {
                xLocation   :data[0].xLocation,
                yLocation   :data[0].yLocation,
                turn        : !data[0].turn
            }
        },
        function (err, data){});
      User.findByIdAndUpdate(data[1]._id, {
            $set: {
                xLocation   :data[1].xLocation,
                yLocation   :data[1].yLocation,
                turn        : !data[1].turn
            }
        },
        function (err, data){});
      io.sockets.emit('serverBack', {users : data} );
  });

});


// Start the server
//app.listen(port);

server.listen(port);
console.log('Server running on port ' + port);