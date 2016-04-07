var mongoose = require('mongoose');

var schema = {
	xLocation :  Number,
	yLocation :  Number,
    revealed  :  Boolean,
    xTreasure :  Number,
    yTreasure :  Number
};

var Map = mongoose.model("Map",schema);

module.exports = Map;
