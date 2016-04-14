var mongoose = require('mongoose');

var schema = {
	userName   :  String,
    xLocation  :  Number,
    yLocation  :  Number,
    digNow: Boolean,
    turn: Boolean
};

var User = mongoose.model("User",schema);

module.exports = User;
