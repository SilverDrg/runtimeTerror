var express = require('express');
var router = express.Router();
var CameraController = require('../controllers/CameraController.js');

/*
 * GET
 */
router.get('/', CameraController.list);
router.get('/add', CameraController.displayAdd);

/*
 * GET
 */
router.get('/:id', CameraController.show);

/*
 * POST
 */
router.post('/', CameraController.create);

/*
 * PUT
 */
router.put('/:id', CameraController.update);

/*
 * DELETE
 */
router.delete('/:id', CameraController.remove);

module.exports = router;
