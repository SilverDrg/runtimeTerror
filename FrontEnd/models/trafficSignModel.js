var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var trafficSignSchema = new Schema({
	'symbol' : String,
	'location' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'GPS'
	}
});

module.exports = mongoose.model('trafficSign', trafficSignSchema);
