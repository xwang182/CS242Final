// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();

//replace this with your Mongolab URL
mongoose.connect('mongodb://xuan:50337653@ds025239.mlab.com:25239/cs498taskmanager');

// Create our Express application
var app = express();


// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "DELETE,PUT");
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

var user = require('./api/users');
router.get('/users', user.getAll);
router.post('/users', user.create);
router.options('/users', user.options);

router.get('/users/:id', user.getOne);
router.put('/users/:id', user.replace);
router.delete('/users/:id', user.deleteOne);


var task = require('./api/tasks');
router.get('/tasks', task.getAll);
router.post('/tasks', task.create);
router.options('/tasks', task.options);

router.get('/tasks/:id', task.getOne);
router.put('/tasks/:id', task.replace);
router.delete('/tasks/:id', task.deleteOne);



//End routes here

// Start the server
app.listen(port);
console.log('Server running on port ' + port);