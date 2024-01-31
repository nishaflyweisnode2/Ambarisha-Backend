const Banner = require('../Models/bannerModel')
const Offer = require('../Models/offerModel');
const Product = require('../Models/productModel');
const Category = require('../Models/categoryModel');
const Subcategory = require('../Models/subCategoryModel');
require('dotenv').config();


exports.AddBanner = async (req, res) => {
  try {
    const checkCategory = await Category.findById(req.body.category);
    if (!checkCategory) {
      return res.status(404).json({ status: 404, message: 'Category not found' });
    }

    const checkSubCategory = await Subcategory.findById(req.body.subCategory);
    if (!checkSubCategory) {
      return res.status(404).json({ status: 404, message: 'Sub Category not found' });
    }

    const checkProduct = await Product.findById(req.body.product);
    if (!checkProduct) {
      return res.status(404).json({ status: 404, message: 'Product not found' });
    }

    let findBanner = await Banner.findOne({ name: req.body.name });
    if (findBanner) {
      return res.status(409).json({ message: "Banner already exists.", status: 404, data: {} });
    }

    const fileUrl = req.file ? req.file.path : "";
    const data = { name: req.body.name, category: req.body.category, subCategory: req.body.subCategory, product: req.body.product, description: req.body.description, link: req.body.link, isActive: req.body.isActive, image: fileUrl, type: req.body.type };
    const banner = await Banner.create(data);

    res.status(200).json({ message: "Banner added successfully.", status: 200, data: banner });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal server error", data: error.message });
  }
};


exports.getBanner = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json({ status: 200, success: true, data: banners });

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: "Banner Not Found", status: 404, data: {} });
    }

    if (req.body.category) {
      const checkCategory = await Category.findById(req.body.category);
      if (!checkCategory) {
        return res.status(404).json({ status: 404, message: 'Category not found' });
      }
      banner.category = req.body.category;
    }

    if (req.body.subCategory) {
      const checkSubCategory = await Subcategory.findById(req.body.subCategory);
      if (!checkSubCategory) {
        return res.status(404).json({ status: 404, message: 'Sub Category not found' });
      }
      banner.subCategory = req.body.subCategory;
    }

    if (req.body.product) {
      const checkProduct = await Product.findById(req.body.product);
      if (!checkProduct) {
        return res.status(404).json({ status: 404, message: 'Product not found' });
      }
      banner.product = req.body.product;
    }

    if (req.file) {
      banner.image = req.file.path;
    }
    if (req.body.name) {
      banner.name = req.body.name;
    }
    if (req.body.description) {
      banner.description = req.body.description;
    }
    if (req.body.link) {
      banner.link = req.body.link;
    }
    if (req.body.isActive !== undefined) {
      banner.isActive = req.body.isActive;
    }

    let updatedBanner = await banner.save();

    return res.status(200).json({ status: 200, message: "Updated Successfully", data: updatedBanner });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Internal server error", data: error.message });
  }
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

exports.getbannerbyType = async (req, res) => {

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

exports.getBannersByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const checkCategory = await Category.findById(categoryId);
    if (!checkCategory) {
      return res.status(404).json({ status: 404, message: 'Category not found' });
    }

    const banners = await Banner.find({ category: categoryId });

    res.status(200).json({ status: 200, message: 'Banners retrieved successfully', data: banners });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
  }
};

exports.getBannersBySubCategory = async (req, res) => {
  try {
    const subCategoryId = req.params.subCategoryId;

    const checkSubCategory = await Subcategory.findById(subCategoryId);
    if (!checkSubCategory) {
      return res.status(404).json({ status: 404, message: 'Sub Category not found' });
    }

    const banners = await Banner.find({ subCategory: subCategoryId });

    res.status(200).json({ status: 200, message: 'Banners retrieved successfully', data: banners });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
  }
};

exports.getBannersByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const checkProduct = await Product.findById(productId);
    if (!checkProduct) {
      return res.status(404).json({ status: 404, message: 'Product not found' });
    }

    const banners = await Banner.find({ product: productId });

    res.status(200).json({ status: 200, message: 'Banners retrieved successfully', data: banners });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
  }
};