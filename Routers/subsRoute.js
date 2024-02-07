const express = require('express');
const subs = require('../Controller/subsController');


const router = express();


router.get('/', [subs.getsubs]);
router.get('/:id', [subs.getsubsById]);
router.delete('/:id', [subs.Deletesubs]);

module.exports = router;