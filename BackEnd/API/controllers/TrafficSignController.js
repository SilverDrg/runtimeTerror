var TrafficsignModel = require('../models/TrafficSignModel.js');
var TrafficsignimagesModel = require('../models/TrafficSignImagesModel.js');
var GpsModel = require('../models/GPSModel.js');

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
            TrafficsignModel.findOne({'location._id' : closestLocation._id}, function (err, trafficSign) {
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

                return res.json(trafficSign.symbol);  
            });
        } else {
            return res.json("None");
        }
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
