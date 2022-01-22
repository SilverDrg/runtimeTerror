const { render } = require('../app.js');
const CameraModel = require('../models/CameraModel.js');
const GPSModel = require('../models/GPSModel.js');
const gpsController = require('../controllers/GPSController.js');
const CarsController = require('../controllers/CarsController.js');
const trafficSignController = require('../controllers/TrafficSignController.js');
const { resolve } = require('path');
const TrafficSignController = require('../controllers/TrafficSignController.js');
const { request } = require('http');
const axios = require('axios');

const tasks = [];

function doNext() {
    const task = tasks[0];
    if (!task || task.active) return;

    task.active = true;

    new Promise((resolve) => {
        try {
            task.process(resolve);
        } catch (ex) {
            console.error(ex);
            resolve(null);
        }
    }).then((result) => {
        task.resolve(result);

        tasks.shift();
        console.log('Tasks remaining: ' + tasks.length);
        doNext();
    });
}

function add(process) {
    return new Promise((resolve) => {
        tasks.push({
            process,
            resolve,
        });

        doNext();
    });
}

/**
 * CameraController.js
 *
 * @description :: Server-side logic for managing Cameras.
 */
module.exports = {

    /**
     * CameraController.list()
     */
    list: function (req, res) {
        CameraModel.find(function (err, Cameras) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Camera.',
                    error: err
                });
            }
            var data = [];
            data.cameras = Cameras
            return res.status(201).json(Cameras);
        });
    },

    displayAdd: function (req, res) {
        return res.render('camera/addCamera');
    },

    /**
     * CameraController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        CameraModel.findOne({
            _id: id
        }, function (err, Camera) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Camera.',
                    error: err
                });
            }

            if (!Camera) {
                return res.status(404).json({
                    message: 'No such Camera'
                });
            }

            return res.status(201).json(Camera);
        });
    },

    /**
     * CameraController.create()
     */
    create: function (req, res) {
        console.log(req.body);
        console.log(req.file);

        var Location = new GPSModel({
            latitude: 46.5575,
            longditude: 15.645556
        });

        Location.save(function (err, Location) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Camera',
                    error: err
                });
            }

            var Camera = new CameraModel({
                src: 'images/' + req.file.filename
            });
    
            Camera.save(function (err, Camera) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating Camera',
                        error: err
                    });
                }
    
                // Process data for license plates
                let sendData = {};
                sendData.image_id = Camera._id;
                sendData.location_id = Location._id;

                // Process data for Cars
                // Add process to queue
                add(function (resolve) {
                    axios.post('http://tensor:8000/countcars?image_url=' + Camera.src)
                        .then(res => {
                            sendData.python = res.data.toString();
                            CarsController.createFromImage(sendData);
                            resolve();
                        })
                        .catch(error => {
                            console.error(error)
                            resolve();
                        });
                });

                // Process data for Traffic signs
                let trafficSignData = {};
                trafficSignData.image_id = Camera._id;
                trafficSignData.location_id = Location._id;
                // Add process to queue
                add(function (resolve) {
                    axios.post('http://tensor:8000/detectsign?image_url=' + Camera.src)
                        .then(res => {
                            trafficSignData.python = res.data.toString();
                            TrafficSignController.createFromImage(trafficSignData);
                            resolve();
                        })
                        .catch(error => {
                            console.error(error)
                            resolve();
                        });
                });
            });
        })
    },

    createMobile: function (req, res) {
        console.log(req.body);
        console.log(req.file);

        var Location = new GPSModel({
            latitude: req.body.latitude,
            longditude: req.body.longditude
        });

        Location.save(function (err, Location) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Camera',
                    error: err
                });
            }

            var Camera = new CameraModel({
                src: 'images/' + req.file.filename
            });
    
            Camera.save(function (err, Camera) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating Camera',
                        error: err
                    });
                }
    
                // Process data for license plates
                let sendData = {};
                sendData.image_id = Camera._id;
                sendData.location_id = Location._id;

                // Process data for Cars
                // Add process to queue
                add(function (resolve) {
                    axios.post('http://tensor:8000/countcars?image_url=' + Camera.src)
                        .then(res => {
                            sendData.python = res.data.toString();
                            CarsController.createFromImage(sendData);
                            resolve();
                        })
                        .catch(error => {
                            console.error(error)
                            resolve();
                        });
                });

                // Process data for Traffic signs
                let trafficSignData = {};
                trafficSignData.image_id = Camera._id;
                trafficSignData.location_id = Location._id;
                // Add process to queue
                add(function (resolve) {
                    axios.post('http://tensor:8000/detectsign?image_url=' + Camera.src)
                        .then(res => {
                            trafficSignData.python = res.data.toString();
                            TrafficSignController.createFromImage(trafficSignData);
                            resolve();
                        })
                        .catch(error => {
                            console.error(error)
                            resolve();
                        });
                });
            });
        })
    },

    createCam: function (req, res) {
        console.log(req.body);
        var Camera = new CameraModel({
            src: req.body.filepath,
            link: req.body.link
        });

        Camera.save(function (err, Camera) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Camera',
                    error: err
                });
            }

            let sendData = {};
            sendData.image_id = Camera._id;
            sendData.location_id = req.body.location_id;
            add(function (resolve) {
                axios.post('http://tensor:8000/countcars?image_url=' + Camera.src)
                        .then(res => {
                            sendData.python = res.data.toString();
                            CarsController.createFromImage(sendData);
                            resolve();
                        })
                        .catch(error => {
                            console.error(error)
                            resolve();
                        });
            });
        });
    },

    /**
     * CameraController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        CameraModel.findOne({
            _id: id
        }, function (err, Camera) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Camera',
                    error: err
                });
            }

            if (!Camera) {
                return res.status(404).json({
                    message: 'No such Camera'
                });
            }

            Camera.src = req.body.src ? req.body.src : Camera.src;

            Camera.save(function (err, Camera) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Camera.',
                        error: err
                    });
                }

                return res.json(Camera);
            });
        });
    },

    /**
     * CameraController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        CameraModel.findByIdAndRemove(id, function (err, Camera) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Camera.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};