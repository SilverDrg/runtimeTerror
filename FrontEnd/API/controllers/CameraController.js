const { render } = require('../app.js');
var CameraModel = require('../models/CameraModel.js');
var CarsController = require('../controllers/CarsController.js');

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

    displayAdd: function(req, res) {
        return res.render('camera/addCamera');
    },

    /**
     * CameraController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        CameraModel.findOne({_id: id}, function (err, Camera) {
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
        var Camera = new CameraModel({
			src : 'images/'+req.file.filename
        });

        Camera.save(function (err, Camera) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Camera',
                    error: err
                });
            }

            // const spawn = require("child_process").spawn;
            // const pythonProcess = spawn('python',["../../../Backend/ObjectRecognition/cars_detection.py", '--image', Camera.src]);

            // console.log('python result: ' + pythonProcess);
            return res.status(201).json(Camera);
        });
    },

    createCam: function (req, res) {
        console.log(req.body);
        var Camera = new CameraModel({
			src : req.body.filepath
        });

        Camera.save(function (err, Camera) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Camera',
                    error: err
                });
            }

            var sendData = [];
            sendData.image_id = Camera._id;
            sendData.location_id = req.body.location_id;
            const spawn = require("child_process").spawn;
            const pythonProcess = spawn('python',["../../Backend/ObjectRecognition/cars_detection.py", '--image', 'http://localhost:3001/' + Camera.src]);
            pythonProcess.stdout.on('data', function (data) {
                console.log('Pipe data from python script ...');
                sendData.python = data.toString();
                console.log('python result:');
                console.log(sendData.python);
                CarsController.createFromImage(sendData);
            });
            return res.status(201).json(Camera);
        });
    },

    /**
     * CameraController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        CameraModel.findOne({_id: id}, function (err, Camera) {
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
