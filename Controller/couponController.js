const Coupon = require('../Models/couponModel')

exports.AddCoupon = async (req, res) => {
    try {
        const { couponCode, discount, startDate, endDate } = req.body;
        
        // Create the coupon
        const coupon = new Coupon({
            couponCode,
          discount,
          startDate,
          endDate
        });
    
        // Save the coupon to the database
        await coupon.save();
    
        res.status(201).json(coupon);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create coupon' });
      }
    };
    
    exports.getCoupon = async (req, res) => {
        try {
            // Find all coupons in the database
            const coupons = await Coupon.find();
        
            res.json(coupons);
          } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to get coupons' });
          }
        };
    
        exports.updateCoupon = async (req, res) => {
        const { couponId } = req.params;
        const { code,discount, startDate, endDate } = req.body;
      console.log(couponId);
        try {
          // Find the coupon in the database by its ID
          let coupon = await Coupon.findById(couponId);
      
          if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
          }
      
          // Update the coupon properties
          coupon.discount = discount;
          coupon.startDate = startDate;
          coupon.endDate = endDate;
          coupon.code = code;
      
          // Save the updated coupon
          await coupon.save();
      
          res.json(coupon);
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to update coupon' });
        }
      };
    
      exports.deleteCoupon = async (req, res) => {
        const { couponId } = req.params;

        try {
          // Find the coupon in the database by its ID and remove it
          const result = await Coupon.findByIdAndDelete(couponId);
      
          if (!result) {
            return res.status(404).json({ error: 'Coupon not found' });
          }
      
          res.json({ message: 'Coupon deleted successfully' });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to delete coupon' });
        }
      };
      
    
    
    
    
    
    
    
    
    
  
 