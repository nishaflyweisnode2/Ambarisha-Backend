const Zone = require("../Models/zoneModel");
require('dotenv').config();
const Category = require("../Models/categoryModel");
const Product = require("../Models/productModel");


const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: 'dtijhcmaa',
  api_key: '624644714628939',
  api_secret: 'tU52wM1-XoaFD2NrHbPrkiVKZvY'
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});
const upload = multer({ storage: storage });


exports.createZone = async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "Error uploading image.", status: 400, data: err.message });
      }

      let findZone = await Zone.findOne({ name: req.body.name, code: req.body.code });
      if (findZone) {
        return res.status(409).json({ message: "Zone already exists.", status: 409, data: {} });
      }

      const category = await Category.findById(req.body.categoryId);

      if (!category) {
        return res.status(404).json({ message: "Category not found.", status: 404, data: {} });
      }

      const product = await Product.findById(req.body.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found.", status: 404, data: {} });
      }

      const fileUrl = req.file ? req.file.path : "";
      const data = {
        name: req.body.name,
        categoryId: req.body.categoryId,
        productId: req.body.productId,
        code: req.body.code,
        type: req.body.type,
        image: fileUrl
      };

      const zone = await Zone.create(data);
      return res.status(200).json({ message: "Zone added successfully.", status: 200, data: zone });
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Internal server error.", data: error.message });
  }
};


exports.getZone = async (req, res) => {
  const zone = await Zone.find({});
  res.status(201).json({ success: true, zone, });
};

exports.updateZone = async (req, res) => {
  const { id } = req.params;
  try {
    const zone = await Zone.findById(id);
    if (!zone) {
      return res.status(404).json({ message: "Zone Not Found", status: 404, data: {} });
    }

    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const fileUrl = req.file ? req.file.path : "";
      if (req.file) zone.image = fileUrl;
      if (req.body.name) zone.name = req.body.name;
      if (req.body.categoryId) zone.categoryId = req.body.categoryId;
      if (req.body.productId) zone.productId = req.body.productId;
      if (req.body.code) zone.code = req.body.code;
      if (req.body.type) zone.type = req.body.type;

      let update;
      try {
        update = await zone.save();
      } catch (error) {
        update = await Zone.findById(id);
      }

      return res.status(200).json({ message: "Updated Successfully", data: update });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", status: 500, data: error.message });
  }
};


exports.removeZone = async (req, res) => {
  const { id } = req.params;
  const zone = await Zone.findById(id);
  if (!zone) {
    res.status(404).json({ message: "Zone Not Found", status: 404, data: {} });
  } else {
    await Zone.findByIdAndDelete(zone._id);
    res.status(200).json({ message: "Zone Deleted Successfully !" });
  }
};