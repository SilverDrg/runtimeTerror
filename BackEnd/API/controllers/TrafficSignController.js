var TrafficsignModel = require('../models/TrafficSignModel.js');
var TrafficsignimagesModel = require('../models/TrafficSignImagesModel.js');

/**
 * trafficSignController.js
 *
 * @description :: Server-side logic for managing trafficSigns.
 */
module.exports = {

    /**
     * trafficSignController.list()
     */
    list: function (req, res) {
        TrafficsignModel.find().populate('location').populate('image').exec(function (err, trafficSigns) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting trafficSign.',
                    error: err
                });
            }
            // var data = [];
            // data.trafficsigns = trafficSigns;
            // console.log(trafficSigns);
            return res.status(201).json(trafficSigns);
        });
    },

    displayAdd: function(req, res) {
        return res.render('trafficsign/addTrafficSign');
    },

    /**
     * trafficSignController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        TrafficsignModel.findOne({_id: id}, function (err, trafficSign) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting trafficSign.',
                    error: err
                });
            }

            if (!trafficSign) {
                return res.status(404).json({
                    message: 'No such trafficSign'
                });
            }

            return res.json(trafficSign);
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

        TrafficsignModel.findOne({location : closestLocation._id}, function (err, trafficSign) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting trafficSign.',
                    error: err
                });
            }

            if (!Cars) {
                return res.status(404).json({
                    message: 'No such trafficSign'
                });
            }

            return res.json(trafficSign.symbol);  
        }).populate('location').exec();
    },

    /**
     * trafficSignController.create()
     */
    create: function (req, res) {
        var trafficSign = new TrafficsignModel({
			symbol : req.body.symbol,
			location : req.body.location,
            image : ""
        });

        TrafficsignimagesModel.findOne({name: trafficSign.symbol}, function (err, TrafficSignImages) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting TrafficSignImages.',
                    error: err
                });
            }

            if (!TrafficSignImages) {
                return res.status(404).json({
                    message: 'No such TrafficSignImages'
                });
            }

            trafficSign.image = TrafficSignImages._id;

            trafficSign.save(function (err, trafficSign) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating trafficSign',
                        error: err
                    });
                }
    
                return res.status(201).json(trafficSign);
            });

        });
    },

    createFromImage: function (req, res) {
        console.log(req);
        var trafficSign = new TrafficsignModel({
			symbol : req.python,
			location : req.location_id,
			image: ""
        });

        TrafficsignimagesModel.findOne({name: trafficSign.symbol}, function (err, TrafficSignImages) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting TrafficSignImages.',
                    error: err
                });
            }

            if (!TrafficSignImages) {
                return res.status(404).json({
                    message: 'No such TrafficSignImages'
                });
            }

            trafficSign.image = TrafficSignImages._id;

            trafficSign.save(function (err, trafficSign) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating trafficSign',
                        error: err
                    });
                }
    
                return res.status(201).json(trafficSign);
            });

        });
    },

    /**
     * trafficSignController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        TrafficsignModel.findOne({_id: id}, function (err, trafficSign) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting trafficSign',
                    error: err
                });
            }

            if (!trafficSign) {
                return res.status(404).json({
                    message: 'No such trafficSign'
                });
            }

            trafficSign.symbol = req.body.symbol ? req.body.symbol : trafficSign.symbol;
			trafficSign.location = req.body.location ? req.body.location : trafficSign.location;
			
            trafficSign.save(function (err, trafficSign) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating trafficSign.',
                        error: err
                    });
                }

                return res.json(trafficSign);
            });
        });
    },

    /**
     * trafficSignController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        TrafficsignModel.findByIdAndRemove(id, function (err, trafficSign) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the trafficSign.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};