var mongoose = require('mongoose');

var schema = {
	digged  :  Boolean,
	xLocation :  Number,
	yLocation :  Number,
    xTreasure :  Number,
    yTreasure :  Number
};

var Map = mongoose.model("Map",schema);

module.exports = Map;
