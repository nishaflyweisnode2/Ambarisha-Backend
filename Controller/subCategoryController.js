const Subcategory = require("../Models/subCategoryModel");
require('dotenv').config();
const Category = require("../Models/categoryModel");

const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: 'dlt5xcqdy',
  api_key: '547824799327855',
  api_secret: 'xmmE0tZmGzBQEH04tNXFUyLYT7k'
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});
const upload = multer({ storage: storage });

exports.createSubcategory = async (req, res) => {
    try {
        let findSubcategory = await Subcategory.findOne({ name: req.params.name });
        console.log(req.body.name)
        if (findSubcategory) {
          res.status(409).json({ message: "Subcategory already exit.", status: 404, data: {} });
        } else {
          upload.single("image")(req, res, async (err) => {
            if (err) { return res.status(400).json({ msg: err.message }); }
            const fileUrl = req.file ? req.file.path : "";
            const data = { name: req.body.name,categoryId:req.body.categoryId, image: fileUrl };
            const subcategory = await Subcategory.create(data);
            res.status(200).json({ message: "Subcategory add successfully.", status: 200, data: subcategory });
          })
        }
    
      } catch (error) {
        res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
      }
    };
exports.getSubcategories = async (req, res) => {
  const subcategories = await Subcategory.find({}).populate('categoryId');
  res.status(201).json({ success: true, subcategories, });
};
exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategory.findById(id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory Not Found", status: 404, data: {} });
    }

    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const fileUrl = req.file ? req.file.path : subcategory.image;
      subcategory.image = fileUrl;
      subcategory.name = req.body.name || subcategory.name;
      subcategory.categoryId = req.body.categoryId || subcategory.categoryId;

      const updatedSubcategory = await subcategory.save();
      res.status(200).json({ message: "Updated Successfully", data: updatedSubcategory });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
exports.removeSubcategory = async (req, res) => {
  const { id } = req.params;
  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    res.status(404).json({ message: "Subcategory Not Found", status: 404, data: {} });
  } else {
    await Subcategory.findByIdAndDelete(subcategory._id);
    res.status(200).json({ message: "Subcategory Deleted Successfully !" });
  }
};
exports.getsubofCat = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const { categoryId } = req.params;

    // Find subcategories that have the specified categoryId
    const subcategories = await Subcategory.find({ categoryId }).populate('categoryId');

    if (!subcategories) {
      return res.status(404).json({ message: 'Subcategories not found for this category' });
    }

    return res.status(200).json({ subcategories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};