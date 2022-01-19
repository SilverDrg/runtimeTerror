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

        var GpsLatitude = GpsModel.findOne({latitude: { $near: latitude }}, function (err, GpsLatitude) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting GPS latitude.',
                    error: err
                });
            }

            if (!GpsLatitude) {
                return res.status(404).json({
                    message: 'No such GPS latitude'
                });
            }
        });

        var GpsLongditude = GpsModel.findOne({longditude: { $near: longditude }}, function (err, GpsLongditude) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting GPS longditude.',
                    error: err
                });
            }

            if (!GpsLongditude) {
                return res.status(404).json({
                    message: 'No such GPS longditude'
                });
            }
        });

        //dist = sqrt((x2-x1)^2 + (y2-y1)^2)
        var distance1 = Math.sqrt(Math.pow(GpsLatitude.latitude - latitude, 2) + Math.pow(GpsLatitude.longditude - longditude, 2));
        var distance2 = Math.sqrt(Math.pow(GpsLongditude.latitude - latitude, 2) + Math.pow(GpsLongditude.longditude - longditude, 2));

        if (distance1 < distance2) {
            closestLocation = GpsLatitude;
        } else {
            closestLocation = GpsLongditude;
        }

        CarsModel.findOne({location : closestLocation._id}, function (err, Cars) {
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
        }).populate('location').exec();
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
