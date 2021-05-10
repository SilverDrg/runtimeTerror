var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var CarsSchema = new Schema({
	'numberOfCars' : Number,
	'averageSpeed' : Number,
	'location' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'GPS'
	},
	'imageSource' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Camera'
	}
});

module.exports = mongoose.model('Cars', CarsSchema);
