const Cart = require("../Models/cartModel");
const Product = require("../Models/productModel");
const Coupon = require("../Models/couponModel");
const User = require("../Models/userModel");
const Address = require("../Models/addressModel");
const UserMembership = require('../Models/userMemberShipModel');
const Membership = require('../Models/memberShipModel');

const Tax = require("../Models/taxModel");
const Shipping = require("../Models/shippingModel");
const cron = require('node-cron');
const schedule = require('node-schedule');

const userSubscription = require('../Models/userSubscriptionModel');
const Plan = require('../Models/planModel');

// const Cart = require("../Models/cartModel");
const Order = require("../Models/orderModel");

// const job = schedule.scheduleJob('*/10 * * * * *', async () => {
//   try {
//     console.log("Function In Cron Job Started");

//     // Find all carts with an existing order
//     const cartsWithOrder = await Cart.find({ 'products.productId': { $exists: true } });

//     // Process each cart with an order
//     for (const cart of cartsWithOrder) {
//       // Extract relevant information from the cart
//       const userId = cart.userId;
//       const products = cart.products;
//       const frequency = cart.frequency;
//       const dayOfWeek = cart.dayOfWeek;
//       const specificDates = cart.specificDates;
//       const startDate = cart.startDate;
//       const endDate = cart.endDate;

//       // Calculate total amount for the order
//       const totalAmount = products.reduce((total, product) => {
//         return total + product.quantity * product.price;
//       }, 0);

//       // Check if the user's wallet has enough funds
//       const user = await User.findById(userId);
//       if (!user || user.wallet < totalAmount) {
//         console.log(`Not enough funds in the wallet for user ${userId}. Skipping order placement.`);
//         continue; // Skip to the next cart if the wallet balance is insufficient
//       }

//       // Create a new order using the extracted information
//       const newOrder = new Order({
//         user: userId,
//         products: products.map(product => ({
//           productId: product.productId,
//           quantity: product.quantity,
//           price: product.price,
//         })),
//         totalAmount: totalAmount.toFixed(2), // Assuming totalAmount is a string field
//         frequency,
//         dayOfWeek,
//         specificDates,
//         startDate,
//         endDate,
//       });

//       // Deduct the total amount from the user's wallet
//       user.wallet -= totalAmount;
//       await user.save();

//       // Save the new order
//       await newOrder.save();

//       // Optional: Clear the products in the user's cart
//       // cart.products = [];
//       // await cart.save();

//       console.log(`Order placed for user ${userId}. Total amount deducted: ${totalAmount}`);
//     }

//     console.log('Daily job completed successfully.');
//   } catch (error) {
//     console.error('Error in daily job:', error);
//   }
// });





exports.AddCart1 = async (req, res) => {
  try {
    const { products, frequency, dayOfWeek, specificDates, startDate, endDate } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (cart) {
      for (const product of products) {
        const { productId, quantity } = product;
        const dbProduct = await Product.findById(productId);

        if (!dbProduct) {
          return res.status(400).json({ error: "Invalid product ID" });
        }

        const existingProduct = cart.products.find(
          (cartProduct) => cartProduct.productId.toString() === productId
        );

        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          const productPrice = dbProduct.discountActive ? dbProduct.originalPrice : dbProduct.discountPrice;
          console.log("productPrice", productPrice);
          cart.products.push({
            productId,
            quantity,
            price: productPrice,
          });
        }
        console.log("isDiscountActive:", dbProduct.discountActive);
        console.log("originalPrice:", dbProduct.originalPrice);
        console.log("discountPrice:", dbProduct.discountPrice);
      }

      cart.frequency = frequency;
      cart.dayOfWeek = dayOfWeek;
      cart.specificDates = specificDates;
      cart.startDate = startDate;
      cart.endDate = endDate;
    } else {
      const cartProducts = [];

      for (const product of products) {
        const { productId, quantity } = product;
        const dbProduct = await Product.findById(productId);
        if (!dbProduct) {
          return res.status(400).json({ error: "Invalid product ID" });
        }

        const productPrice = dbProduct.discountActive ? dbProduct.originalPrice : dbProduct.discountPrice;
        console.log("productPrice:", productPrice);

        cartProducts.push({
          productId,
          quantity,
          price: productPrice,
        });
        console.log("isDiscountActive:", dbProduct.discountActive);
        console.log("originalPrice:", dbProduct.originalPrice);
        console.log("discountPrice:", dbProduct.discountPrice);
      }

      cart = new Cart({
        userId,
        products: cartProducts,
        frequency,
        dayOfWeek,
        specificDates,
        startDate,
        endDate,
      });
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create or update cart" });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: 404, message: "Product not found" });
    }

    const price = product.isDiscountActive ? product.discountPrice : product.originalPrice;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const existingProduct = cart.products.find(item => item.productId.equals(productId));

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ productId, price, quantity });
    }

    const subTotalAmount = cart.products.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    cart.subtotal = subTotalAmount;
    cart.totalAmount = subTotalAmount;

    await cart.save();

    return res.status(201).json({ status: 201, message: 'Product added to cart successfully', data: cart });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return res.status(500).json({ status: 500, error: 'Internal server error' });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const cart = await Cart.findOne({ userId }).populate('products.productId', /*'name price images'*/).populate('address membership userMembership subscription uerrSubscription plan');

    if (!cart) {
      return res.status(404).json({ status: 404, message: "Cart not found" });
    }

    res.status(200).json({ status: 200, message: "Cart retrieved successfully", data: cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ status: 500, error: 'Internal server error' });
  }
};

exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: 404, message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ status: 404, message: "Cart not found" });
    }

    const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === productId);
    if (existingProductIndex === -1) {
      return res.status(404).json({ status: 404, message: "Product not found in the cart" });
    }

    const price = product.isDiscountActive ? product.discountPrice : product.originalPrice;

    cart.products[existingProductIndex].quantity = quantity;
    cart.products[existingProductIndex].subtotal = quantity * price;

    const subTotalAmount = cart.products.reduce((acc, curr) => acc + curr.subtotal, 0);
    cart.subtotal = subTotalAmount;
    cart.totalAmount = subTotalAmount;

    await cart.save();

    return res.status(200).json({ status: 200, message: "Cart item quantity updated successfully", data: cart });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return res.status(500).json({ status: 500, error: 'Internal server error' });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: 404, message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ status: 404, message: "Cart not found" });
    }

    const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === productId);
    if (existingProductIndex === -1) {
      return res.status(404).json({ status: 404, message: "Product not found in the cart" });
    }

    cart.products.splice(existingProductIndex, 1);

    const subTotalAmount = cart.products.reduce((acc, curr) => acc + curr.subtotal, 0);
    cart.subtotal = subTotalAmount;
    cart.totalAmount = subTotalAmount;

    if (cart.products.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      return res.status(200).json({ status: 200, message: "Cart deleted successfully" });
    }

    await cart.save();

    return res.status(200).json({ status: 200, message: "Product removed from cart successfully", data: cart });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    return res.status(500).json({ status: 500, error: 'Internal server error' });
  }
};

exports.removeAllcart = async (req, res) => {
  try {
    // Find the cart for the user
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Set the total amount to zero and remove all products from the cart
    cart.totalAmount = 0;
    cart.couponCode = "";
    cart.frequency = "";
    cart.endDate = "";
    cart.startDate = "";
    cart.frequency = "";

    cart.totalAmount = 0;

    cart.products = [];

    // Save the updated cart
    await cart.save();

    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ status: 404, message: "Cart not found" });
    }

    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
      return res.status(404).json({ status: 404, message: "Coupon not found" });
    }

    cart.subtotal -= coupon.discount;
    cart.couponCode = coupon.code;
    cart.couponDiscount = coupon.discount;
    cart.totalAmount = cart.subtotal;

    await cart.save();

    return res.status(200).json({ status: 200, message: "Coupon applied successfully", data: cart });
  } catch (error) {
    console.error('Error applying coupon:', error);
    return res.status(500).json({ status: 500, error: 'Internal server error' });
  }
};

exports.removeCoupon = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ status: 404, message: "Cart not found" });
    }

    cart.subtotal += cart.couponDiscount;
    cart.couponCode = "";
    cart.couponDiscount = 0;
    cart.totalAmount = cart.subtotal;

    await cart.save();

    return res.status(200).json({ status: 200, message: "Coupon removed successfully", data: cart });
  } catch (error) {
    console.error('Error removing coupon:', error);
    return res.status(500).json({ status: 500, error: 'Internal server error' });
  }
};

exports.updateCartAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ status: 404, message: "Cart not found" });
    }

    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ status: 404, message: "Address not found" });
    }

    cart.address = addressId;
    await cart.save();

    return res.status(200).json({ status: 200, message: "Address updated in the cart successfully", data: cart });
  } catch (error) {
    console.error('Error updating address in the cart:', error);
    return res.status(500).json({ status: 500, error: 'Internal server error' });
  }
};

exports.addMembershipToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userMembershipId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ status: 404, message: "Cart not found" });
    }

    const membership = await UserMembership.findById(userMembershipId);
    if (!membership) {
      return res.status(404).json({ status: 404, message: "Membership not found" });
    }

    cart.membership = membership.membershipId;
    cart.userMembership = userMembershipId;
    await cart.save();

    return res.status(200).json({ status: 200, message: "Membership added to the cart successfully", data: cart });
  } catch (error) {
    console.error('Error adding membership to the cart:', error);
    return res.status(500).json({ status: 500, error: 'Internal server error' });
  }
};

exports.addSubscriptionToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userSubscriptionId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ status: 404, message: "Cart not found" });
    }

    const subscription = await userSubscription.findById(userSubscriptionId);
    if (!subscription) {
      return res.status(404).json({ status: 404, message: "Subscription not found" });
    }

    cart.uerrSubscription = userSubscriptionId;
    cart.subscription = subscription.subId;
    cart.plan = subscription.planId;
    await cart.save();

    return res.status(200).json({ status: 200, message: "Subscription added to the cart successfully", data: cart });
  } catch (error) {
    console.error('Error adding subscription to the cart:', error);
    return res.status(500).json({ status: 500, error: 'Internal server error' });
  }
};