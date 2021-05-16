var CarsModel = require('../models/CarsModel.js');

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

            var data = [];
            data.cars = Cars;
            return res.render('car/displayCars', data);
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

    /**
     * CarsController.create()
     */
    create: function (req, res) {
        var Cars = new CarsModel({
			numberOfCars : req.body.numberOfCars,
			averageSpeed : req.body.averageSpeed,
			location : req.body.location,
			imageSource : req.body.imageSource
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
