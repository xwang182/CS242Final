var mongoose = require('mongoose');

var schema = {
	name             :  String,
	description      :  String,
	deadline         :  Date,
	completed        :  Boolean,
	assignedUser     :  String,
	assignedUserName :  String,
	dateCreated      :  Date
};


var Task = mongoose.model("Task",schema);

module.exports = Task;
