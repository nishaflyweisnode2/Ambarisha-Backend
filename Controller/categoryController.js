const Category = require("../Models/categoryModel");
require('dotenv').config();
const Product = require("../Models/productModel");

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

exports.createCategory = async (req, res) => {
  try {
    let findCategory = await Category.findOne({ name: req.params.name });
    console.log(req.body.name)
    if (findCategory) {
      res.status(409).json({ message: "category already exit.", status: 404, data: {} });
    } else {
      upload.single("image")(req, res, async (err) => {
        if (err) { return res.status(400).json({ msg: err.message }); }
        const fileUrl = req.file ? req.file.path : "";
        const data = { name: req.body.name, image: fileUrl };
        const category = await Category.create(data);
        res.status(200).json({ message: "category add successfully.", status: 200, data: category });
      })
    }

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};
exports.getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.status(201).json({ success: true, categories, });
};
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    res.status(404).json({ message: "Category Not Found", status: 404, data: {} });
  }
  upload.single("image")(req, res, async (err) => {
    if (err) { return res.status(400).json({ msg: err.message }); }
    const fileUrl = req.file ? req.file.path : "";
    category.image = fileUrl || category.image;
    category.name = req.body.name;
    let update = await category.save();
    res.status(200).json({ message: "Updated Successfully", data: update });
  })
};
exports.removeCategory = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    res.status(404).json({ message: "Category Not Found", status: 404, data: {} });
  } else {
    await Category.findByIdAndDelete(category._id);
    res.status(200).json({ message: "Category Deleted Successfully !" });
  }
};

exports.addDiscount = async (req, res) => {
  const categoryId = req.params.categoryId;
  const { isDiscount, percentage } = req.body;

  try {
    // Find the category by ID
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { isDiscount, percentage },
      { new: true } // Return the updated category
    );

    // Check if the category exists
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // If the category has a discount, update product prices
    if (category.isDiscount) {
      // Find all products in the category
      const products = await Product.find({ category: categoryId });

      // Update each product's price and discountedPrice
      for (const product of products) {
        // Store the original price and discountedPrice
        const originalPrice = product.price;
        const previousDiscountedPrice = product.discountedPrice;

        // Calculate the discounted amount based on the percentage
        const discountedAmount = (originalPrice + previousDiscountedPrice) * (category.percentage / 100);

        // Calculate the discounted price
        const discountedPrice = originalPrice + previousDiscountedPrice - discountedAmount;

        // Update product prices
        product.originalPrice = originalPrice;
        product.price = discountedPrice;
        product.discountedPrice = discountedAmount;

        // Save the updated product
        await product.save();
      }
    }

    // Return the updated category
    res.json({ category });
  } catch (error) {
    console.error('Error adding discount to category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getDiscountedCategories = async (req, res) => {
  try {
    // Find categories with isDiscount set to true
    const discountedCategories = await Category.find({ isDiscount: true });

    res.json({ discountedCategories });
  } catch (error) {
    console.error('Error getting discounted categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
