const express = require('express'); 
const feedback = require('../Controller/feedbackController');

const authJwt = require("../middleware/authJwt");

const router = express();


router.post('/', [  authJwt.verifyToken,feedback.createFeedback]);
router.get('/', [  feedback.getFeedback]);
router.put('/:id',[ feedback.updateFeedback]);
router.delete('/:feedbackId',[  feedback.deleteFeedback]);

module.exports = router;