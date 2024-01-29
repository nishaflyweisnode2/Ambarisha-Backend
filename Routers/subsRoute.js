const express = require('express'); 
const subs = require('../Controller/subsController');


const router = express();


router.post('/', [  subs.addsubs]);
router.get('/', [  subs.getsubs]);
router.put('/:id',[ subs.updatesubs]);
router.delete('/:id',[  subs.Deletesubs]);

module.exports = router;