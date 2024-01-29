const express = require('express'); 
const shipping = require('../Controller/shippingController');


const router = express();


router.post('/', [  shipping.addshipping]);
router.get('/', [  shipping.getshipping]);
router.put('/:id',[ shipping.updateshipping]);
router.delete('/:id',[  shipping.Deleteshipping]);

module.exports = router;