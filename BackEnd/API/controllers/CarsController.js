var CarsModel = require('../models/CarsModel.js');
var GpsModel = require('../models/GPSModel.js');

/**
 * CarsController.js
 *
 * @description :: Server-side logic for managing Carss.
 */
module.exports = {

    /**
     * CarsController.list()
     */
    list: function (req, res) {
        CarsModel.find().populate('location').populate('imageSource').exec(function (err, Cars) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Cars.',
                    error: err
                });
            }

            // var data = [];
            // data.cars = Cars;
            // console.log(Cars);
            return res.status(201).json(Cars);
        });
    },

    displayAdd: function(req, res) {
        return res.render('car/addCar');
    },

    /**
     * CarsController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        CarsModel.findOne({_id: id}, function (err, Cars) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Cars.',
                    error: err
                });
            }

            if (!Cars) {
                return res.status(404).json({
                    message: 'No such Cars'
                });
            }

            return res.json(Cars);  
        });
    },

    atLocation: function (req, res) {
        var latitude = req.params.latitude;
        var longditude = req.params.longditude;
        var closestLocation;

        var bottomLeftQuadron = GpsModel.findOne({latitude: { $lte: latitude }, longditude: { $lte: longditude }}, function (err, location) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting GPS bottomLeftQuadron.',
                    error: err
                });
            }

            if (!location) {
                console.log('No such GPS bottomLeftQuadron');
            }
        });

        var bottomRightQuadron = GpsModel.findOne({latitude: { $lte: latitude }, longditude: { $gt: longditude }}, function (err, location) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting GPS bottomRightQuadron.',
                    error: err
                });
            }

            if (!location) {
                console.log('No such GPS bottomRightQuadron');
            }
        });

        var topLeftQuadron = GpsModel.findOne({latitude: { $gt: latitude }, longditude: { $lte: longditude }}, function (err, location) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting GPS topLeftQuadron.',
                    error: err
                });
            }

            if (!location) {
                console.log('No such GPS topLeftQuadron');
            }
        });

        var topRightQuadron = GpsModel.findOne({latitude: { $gt: latitude }, longditude: { $gt: longditude }}, function (err, location) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting GPS topRightQuadron.',
                    error: err
                });
            }

            if (!location) {
                console.log('No such GPS topRightQuadron');
            }
        });

        //dist = sqrt((x2-x1)^2 + (y2-y1)^2)
        var locations = [];
        locations[0] = bottomLeftQuadron;
        locations[1] = bottomRightQuadron;
        locations[2] = topLeftQuadron;
        locations[3] = topRightQuadron;

        var distances = [];
        distances[0] = Math.sqrt(Math.pow(bottomLeftQuadron.latitude - latitude, 2) + Math.pow(bottomLeftQuadron.longditude - longditude, 2));
        distances[1]  = Math.sqrt(Math.pow(bottomRightQuadron.latitude - latitude, 2) + Math.pow(bottomRightQuadron.longditude - longditude, 2));
        distances[2]  = Math.sqrt(Math.pow(topLeftQuadron.latitude - latitude, 2) + Math.pow(topLeftQuadron.longditude - longditude, 2));
        distances[3]  = Math.sqrt(Math.pow(topRightQuadron.latitude - latitude, 2) + Math.pow(topRightQuadron.longditude - longditude, 2));
        
        var nearest = 360;
        var closestLocation = null;

        for (let index = 0; index < distances.length; index++) {
            if (distances[index] != null && nearest > distances[index] && distances[index] < 0.0004) {
                nearest = distances[index];
                closestLocation = locations[index];
            }
        }

        if (closesLocation != null) {
            CarsModel.findOne({'location._id' : closestLocation._id}, function (err, Cars) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting Cars.',
                        error: err
                    });
                }

                if (!Cars) {
                    return res.status(404).json({
                        message: 'No such Cars'
                    });
                }

                return res.json(Cars.numberOfCars);  
            });
        } else {
            return res.json("None");
        }
    },

    /**
     * CarsController.create()
     */
    create: function (req, res) {
        var Cars = new CarsModel({
			numberOfCars : req.body.numberOfCars,
			averageSpeed : req.body.averageSpeed,
			location : req.body.location,
			imageSource : req.body.imageSource,
            licensePlate: req.body.licensePlate
        });

        Cars.save(function (err, Cars) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Cars',
                    error: err
                });
            }

            return res.status(201).json(Cars);
        });
    },

    createFromApp: function (req, res) {
        console.log(req);
        var Cars = new CarsModel({
			numberOfCars : req.python,
			averageSpeed : 0,
			location : req.location_id,
			imageSource : req.image_id,
            licensePlate: [ req.license_plate ]
        });

        Cars.save(function (err, Cars) {
            if (err) {
                return err;
            }
        });
    },

    createFromImage: function (req, res) {
        console.log(req);
        var Cars = new CarsModel({
			numberOfCars : req.python,
			averageSpeed : 0,
			location : req.location_id,
			imageSource : req.image_id,
            licensePlate: [ 'N/A' ]
        });

        Cars.save(function (err, Cars) {
            if (err) {
                return err;
            }
        });
    },

    /**
     * CarsController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        CarsModel.findOne({_id: id}, function (err, Cars) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Cars',
                    error: err
                });
            }

            if (!Cars) {
                return res.status(404).json({
                    message: 'No such Cars'
                });
            }

            Cars.numberOfCars = req.body.numberOfCars ? req.body.numberOfCars : Cars.numberOfCars;
			Cars.averageSpeed = req.body.averageSpeed ? req.body.averageSpeed : Cars.averageSpeed;
			Cars.location = req.body.location ? req.body.location : Cars.location;
			Cars.imageSource = req.body.imageSource ? req.body.imageSource : Cars.imageSource;
            Cars.licensePlate = req.body.licensePlate ? req.body.licensePlate : Cars.licensePlate;
			
            Cars.save(function (err, Cars) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Cars.',
                        error: err
                    });
                }

                return res.json(Cars);
            });
        });
    },

    /**
     * CarsController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        CarsModel.findByIdAndRemove(id, function (err, Cars) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Cars.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
