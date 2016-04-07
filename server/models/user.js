var mongoose = require('mongoose');

var schema = {
	userName   :  String,
	userNumber :  Number,
    xLocation  :  Number,
    yLocation  :  Number
};

var User = mongoose.model("User",schema);

module.exports = User;
