var mongoose = require('mongoose');

var schema = {
	name          :  String,
	email         :  String,
    pendingTasks  :  [String],
    dateCreated   :  Date
};

var User = mongoose.model("User",schema);

module.exports = User;
