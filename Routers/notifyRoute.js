const express = require('express');
const notify = require('../Controller/notifyController')


const router = express();
// const authJwt = require("../middleware/authJwt");
// const auth = require("../middleware/authSeller");

router.post('/', notify.AddNotification);
router.get('/', notify.GetAllNotification);

router.get('/get/:id',notify.GetBYNotifyID);
router.delete('/delete/:id', notify.deleteNotification);


module.exports = router;