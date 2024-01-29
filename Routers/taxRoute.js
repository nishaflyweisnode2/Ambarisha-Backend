const express = require('express'); 
const tax = require('../Controller/taxController');


const router = express();


router.post('/', [  tax.addtax]);
router.get('/', [  tax.gettax]);
router.put('/:id',[ tax.updatetax]);
router.delete('/:id',[  tax.Deletetax]);

module.exports = router;