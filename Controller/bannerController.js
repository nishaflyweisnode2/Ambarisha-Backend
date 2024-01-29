const Banner = require('../Models/bannerModel')
require('dotenv').config();


exports.AddBanner = async (req, res) => {
  try {
    let findBanner = await Banner.findOne({ name: req.body.name });

    if (findBanner) {
      return res.status(409).json({ message: "Banner already exists.", status: 404, data: {} });
    }

    const fileUrl = req.file ? req.file.path : "";
    const data = { name: req.body.name, image: fileUrl, type: req.body.type };
    const banner = await Banner.create(data);

    res.status(200).json({ message: "Banner added successfully.", status: 200, data: banner });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal server error", data: error.message });
  }
};


exports.getBanner = async (req, res) => {
    try {
      const banners = await Banner.find();
      res.status(200).json({ success: true, banners: banners });
  
    } catch (error) {
      res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
    }
  };
  
  exports.updateBanner = async (req, res) => {
    const { id } = req.params;
    const banner = await Banner.findById(id);
    console.log(banner,id);
    if (!banner) {
      res.status(404).json({ message: "Banner Not Found", status: 404, data: {} });
    }
    upload.single("image")(req, res, async (err) => {
      if (err) { return res.status(400).json({ msg: err.message }); }
      const fileUrl = req.file ? req.file.path : "";
      banner.image = fileUrl || banner.image;
      banner.name = req.body.name;
      let update = await banner.save();
      res.status(200).json({ message: "Updated Successfully", data: update });
    })
  };
  
  exports.removeBanner = async (req, res) => {
    const { id } = req.params;
    const banner = await Banner.findById(id);
    if (!banner) {
      res.status(404).json({ message: "Banner Not Found", status: 404, data: {} });
    } else {
      await Banner.findByIdAndDelete(banner._id);
      res.status(200).json({ message: "Banner Deleted Successfully !" });
    }
  };

  exports.getbannerbyType= async (req, res) => {

    try {
      const { type } = req.params;
  
      // Find banners based on the provided type
      const banners = await Banner.find({ type });
  
      res.status(200).json({ banners });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };