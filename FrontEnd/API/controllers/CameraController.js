const { render } = require('../app.js');
var CameraModel = require('../models/CameraModel.js');

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
            return res.json(Cameras);
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

            return res.json(Camera);
        });
    },

    /**
     * CameraController.create()
     */
    create: function (req, res) {
        var Camera = new CameraModel({
			src : req.body.src
        });

        Camera.save(function (err, Camera) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Camera',
                    error: err
                });
            }

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
