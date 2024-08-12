const Product = require("../Models/productModel");
const Wishlist = require("../Models/wishlistModel");
const mongoose = require("mongoose");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Category = require("../Models/categoryModel");
const Subcategory = require("../Models/subCategoryModel");
const Plan = require('../Models/planModel');
const Subs = require("../Models/subsModel");

const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: 'dvwecihog',
  api_key: '364881266278834',
  api_secret: '5_okbyciVx-7qFz7oP31uOpuv7Q'
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});
const upload = multer({ storage: storage });
// Create Product -- Admin




exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    upload.array("images")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ msg: err.message });
      }

      const uploadedImages = req.files.map((file) => file.path);

      const {
        name,
        description,
        unit,
        quantity,
        color,
        brand,
        originalPrice,
        discount,
        discountActive,
        category,
        subcategory,
        stock,
        features,
      } = req.body;

      const subCategories = await Subcategory.findById(subcategory)

      if (!subCategories) {
        return res.status(404).json({ status: 404, message: "subCategories not found" });
      }
      const categories = await Category.findById(category)
      if (!categories) {
        return res.status(404).json({ status: 404, message: "categories not found" });
      }

      let discountPrice = 0;
      if (discountActive === "true") {
        discountPrice = Number((originalPrice - (originalPrice * discount) / 100).toFixed(2));
      }

      const data = {
        name,
        description,
        unit,
        quantity,
        color,
        brand,
        originalPrice,
        discount,
        discountActive,
        discountPrice,
        category,
        subcategory,
        stock,
        features,
        images: uploadedImages,
      };

      const product = await Product.create(data);

      const plans = await Plan.find();

      for (let plan of plans) {
        const subscriptionData = {
          productId: product._id,
          planId: plan._id,
          weight: unit,
          status: false,
        };

        await Subs.create(subscriptionData);
      }

      return res.status(200).json({
        message: "Product added successfully.",
        status: 200,
        data: product,
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: error.message,
    });
  }
});
exports.productDiscount = async (req, res) => {
  const productId = req.params.productId;
  const { isDiscount, discount } = req.body;

  try {
    // Find the product by ID
    const product = await Product.findByIdAndUpdate(
      productId,
      { isDiscount, discount },
      { new: true } // Return the updated product
    );

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // If the product has a discount, update its prices
    if (product.isDiscount) {
      // Store the original price and previous discountedPrice
      const originalPrice = product.price;
      const previousDiscountedPrice = product.discountedPrice;
      console.log(originalPrice);
      console.log(previousDiscountedPrice);

      // Calculate the discounted amount based on the percentage
      const discountedAmount = (originalPrice + previousDiscountedPrice) - (product.discount);
      console.log(discountedAmount);
      // Calculate the discounted price

      const discountedPrice = originalPrice + previousDiscountedPrice - discountedAmount;

      console.log(discountedPrice);
      // Update product prices
      product.originalPrice = originalPrice;
      product.price = discountedAmount;
      product.discountedPrice = discountedPrice;

      // Save the updated product
      await product.save();
    }

    // Return the updated product
    res.json({ product });
  } catch (error) {
    console.error('Error adding discount to product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getDiscountedProducts = async (req, res) => {
  try {
    // Find products with isDiscount set to true
    const discountedProducts = await Product.find({ isDiscount: true });

    res.json({ discountedProducts });
  } catch (error) {
    console.error('Error getting discounted products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.allProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const products = await Product.find().populate('subcategory category');
    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      data: error.message,
    });
  }
});

exports.singleProduct = catchAsyncErrors(async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      data: error.message,
    });
  }
});

exports.updateProducts = catchAsyncErrors(async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ status: 404, message: 'Product not found' });
    }

    upload.array('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ status: 400, message: err.message });
      }

      try {
        const images = await Promise.all(req.files.map(async (file) => {
          return file ? file.path : '';
        }));

        let updatedFields = { ...req.body };

        if (images.length > 0) {
          updatedFields.images = images;
        }

        Object.assign(product, updatedFields);

        const plans = await Plan.find();

        for (let plan of plans) {
          let subscription = await Subs.findOne({ productId, planId: plan._id });

          if (!subscription) {
            subscription = new Subs({
              productId,
              planId: plan._id,
              weight: product.unit,
              status: false,
            });
          }

          subscription = Object.assign(subscription, { weight: product.unit });
          await subscription.save();
        }

        if (product.discountActive === true) {
          if (product.originalPrice && product.discount) {
            product.discountPrice = Number((product.originalPrice - (product.originalPrice * product.discount) / 100).toFixed(2));
          }
        } else {
          product.discountPrice = 0;
        }

        const updatedProduct = await product.save();

        return res.status(200).json({
          status: 200,
          message: 'Product updated successfully',
          data: updatedProduct,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error.message,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
});

exports.deleteProducts = catchAsyncErrors(async (req, res, next) => {

  const productId = req.params.id;

  // Check if the product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Delete the product
  const deletedProduct = await Product.findOneAndDelete({ _id: productId });

  return res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    data: product,
  });
});
exports.productbyCategory = catchAsyncErrors(async (req, res, next) => {
  const categoryId = req.params.categoryId;

  try {
    // Find all products with the specified category ID
    const products = await Product.find({ category: categoryId });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
exports.productbysubCategory = catchAsyncErrors(async (req, res, next) => {

  const subcategoryId = req.params.subcategoryId;

  try {
    // Find all products with the specified subcategory ID
    const products = await Product.find({ subcategory: subcategoryId });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
exports.updateType = catchAsyncErrors(async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const newType = req.body.type;

    // Check if the product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Update the product type
    product.type = newType;

    // Save the updated product
    await product.save();

    res.status(200).json({ success: true, message: 'Product type updated successfully', data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
exports.getProductsByType = async (req, res) => {
  const { type } = req.params;

  try {
    // Fetch products by type from the database
    const products = await Product.find({ type });

    // Send the products as a JSON response
    res.json({ products });
  } catch (error) {
    console.error('Error fetching products by type:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
//Create Wishlist

exports.createWishlist = catchAsyncErrors(async (req, res, next) => {
  const product = req.params.id;
  //console.log(user)
  let wishList = await Wishlist.findOne({ user: req.user._id });
  if (!wishList) {
    wishList = new Wishlist({
      user: req.user,
    });
  }
  wishList.products.addToSet(product);
  await wishList.save();
  res.status(200).json({
    message: "product addedd to wishlist Successfully",
  });
});

//Remove Wishlist
exports.removeFromWishlist = catchAsyncErrors(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    return next(new ErrorHander("Wishlist not found", 404));
  }
  const product = req.params.id;

  wishlist.products.pull(new mongoose.Types.ObjectId(product));

  await wishlist.save();
  res.status(200).json({
    success: true,
    message: "Removed From Wishlist",
  });
});

//My Wishlist
exports.myWishlist = catchAsyncErrors(async (req, res, next) => {
  let myList = await Wishlist.findOne({ user: req.user._id }).populate(
    "products"
  );

  if (!myList) {
    myList = await Wishlist.create({
      user: req.user._id,
    });
  }
  res.status(200).json({
    success: true,
    wishlist: myList,
  });
});

exports.getProductsByCategoryAndSubcategory = async (req, res) => {
  try {
    const { category, subcategory } = req.params;

    const products = await Product.find({ category: category, subcategory: subcategory });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for the specified category and subcategory" });
    }

    return res.status(200).json({ status: 200, message: "Products found", products });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
  }
};

exports.addProductReview = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { rating, comment } = req.body;
    const user = req.user;

    if (rating > 5) {
      return res.status(400).json({ message: 'Rating cannot exceed 5' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = {
      user: user._id,
      name: user.name,
      rating: rating,
      comment: comment
    };

    product.reviews.push(review);

    const totalReviews = product.reviews.length;
    const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    let averageRating = totalRating / totalReviews;

    averageRating = Math.min(5, averageRating);

    product.numOfReviews = totalReviews;
    product.averageRating = Math.round(averageRating);

    await product.save();

    return res.status(201).json({ message: 'Review submitted successfully', product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProductsByDemand = async (req, res) => {
  try {
    const products = await Product.find().sort({ averageRating: -1 });

    return res.status(200).json({ message: 'Products fetched successfully', products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.createProductOffer = async (req, res) => {
  try {
    const { productId, date, discountAmount } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingOfferIndex = product.dailyOffers.findIndex(offer => offer.date.toDateString() === new Date(date).toDateString());
    if (existingOfferIndex !== -1) {
      return res.status(400).json({ message: 'An offer already exists for this date' });
    }

    product.dailyOffers.push({ date, discountAmount });
    await product.save();

    return res.status(201).json({ status: 201, message: 'Offer created successfully', data: product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};

exports.getProductOffers = async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ status: 200, data: product.dailyOffers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};

exports.updateProductOffer = async (req, res) => {
  try {
    const { productId, offerId } = req.params;
    const { date, discountAmount } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const offerIndex = product.dailyOffers.findIndex(offer => offer._id.toString() === offerId);
    if (offerIndex === -1) {
      return res.status(404).json({ status: 404, message: 'Offer not found' });
    }

    product.dailyOffers[offerIndex].date = date;
    product.dailyOffers[offerIndex].discountAmount = discountAmount;

    await product.save();

    return res.status(200).json({ status: 200, message: 'Offer updated successfully', data: product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};

exports.deleteProductOffer = async (req, res) => {
  try {
    const { productId, offerId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const offerIndex = product.dailyOffers.findIndex(offer => offer._id.toString() === offerId);
    if (offerIndex === -1) {
      return res.status(404).json({ status: 404, message: 'Offer not found' });
    }

    product.dailyOffers.splice(offerIndex, 1);
    await product.save();

    return res.status(200).json({ status: 200, message: 'Offer deleted successfully', data: product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};

exports.getAllProductsWithOffers = async (req, res) => {
  try {
    const dateString = req.params.date || new Date().toISOString().split('T')[0];
    console.log(dateString);
    const targetDate = new Date(dateString);
    console.log(targetDate);

    const productsWithOffers = await Product.find({
      dailyOffers: {
        $elemMatch: {
          date: {
            $gte: targetDate,
            $lt: new Date(targetDate.getTime() + 86400000)
          }
        }
      }
    });

    res.status(200).json({
      status: 200,
      data: productsWithOffers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

exports.paginateProductSearch = async (req, res) => {
  try {
    const { search, fromDate, toDate, categoryId, subCategoryId, type, page, limit } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { "name": { $regex: req.query.search, $options: "i" }, },
        { "description": { $regex: req.query.search, $options: "i" }, },
      ]
    }
    if (type) {
      query.type = type
    }
    if (subCategoryId) {
      query.subcategory = subCategoryId
    }
    if (categoryId) {
      query.category = categoryId
    }
    if (fromDate && !toDate) {
      query.createdAt = { $gte: fromDate };
    }
    if (!fromDate && toDate) {
      query.createdAt = { $lte: toDate };
    }
    if (fromDate && toDate) {
      query.$and = [
        { createdAt: { $gte: fromDate } },
        { createdAt: { $lte: toDate } },
      ]
    }
    let options = {
      page: Number(page) || 1,
      limit: Number(limit) || 1000,
      sort: { createdAt: -1 },
      populate: ('category subcategory')
    };
    let data = await Product.paginate(query, options);
    return res.status(200).json({ status: 200, message: "Product data found.", data: data });

  } catch (err) {
    return res.status(500).send({ msg: "internal server error ", error: err.message, });
  }
};