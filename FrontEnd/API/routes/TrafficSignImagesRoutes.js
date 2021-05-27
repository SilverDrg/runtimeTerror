var express = require('express');
var router = express.Router();
var TrafficSignImagesController = require('../controllers/TrafficSignImagesController.js');

/*
 * GET
 */
router.get('/', TrafficSignImagesController.list);

/*
 * GET
 */
router.get('/:id', TrafficSignImagesController.show);

/*
 * POST
 */
router.post('/', TrafficSignImagesController.create);

/*
 * PUT
 */
router.put('/:id', TrafficSignImagesController.update);

/*
 * DELETE
 */
router.delete('/:id', TrafficSignImagesController.remove);

module.exports = router;
