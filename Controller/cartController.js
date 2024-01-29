const Cart = require("../Models/cartModel");
const Product = require("../Models/productModel");
const Coupon = require("../Models/couponModel");
const User = require("../Models/userModel");

const Tax = require("../Models/taxModel");
const Shipping = require("../Models/shippingModel");
const cron = require('node-cron');
const schedule = require('node-schedule');

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











exports.AddCart = async (req, res) => {
  try {
    const { products, frequency, dayOfWeek, specificDates, startDate, endDate } = req.body;
    const userId = req.user.id;

    // Check if a cart exists for the user
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // If cart exists, add/update the products
      for (const product of products) {
        const { productId, quantity, price } = product;
        const dbProduct = await Product.findById(productId);

        if (!dbProduct) {
          return res.status(400).json({ error: "Invalid product ID" });
        }

        const existingProduct = cart.products.find(
          (cartProduct) => cartProduct.productId.toString() === productId
        );

        if (existingProduct) {
          // If product already in cart, update the quantity or handle it as needed
          existingProduct.quantity += quantity;
        } else {
          // If product not in cart, add it
          const productPrice = dbProduct.price;
          cart.products.push({
            productId,
            quantity,
            price: productPrice,
          });
        }
      }

      // Update cart level fields
      cart.frequency = frequency;
      cart.dayOfWeek = dayOfWeek;
      cart.specificDates = specificDates;
      cart.startDate = startDate;
      cart.endDate = endDate;
    } else {
      // If cart doesn't exist, create a new one
      const cartProducts = [];

      for (const product of products) {
        const { productId, quantity, price } = product;
        const dbProduct = await Product.findById(productId);
        if (!dbProduct) {
          return res.status(400).json({ error: "Invalid product ID" });
        }

        const productPrice = dbProduct.price;

        // Add the product to the cart
        cartProducts.push({
          productId,
          quantity,
          price: productPrice,
        });
      }

      // Create a new cart
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

    // Save the cart to the database
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create or update cart" });
  }
};


exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart || cart.products.length === 0) {
      // If no products in the cart, set tax, shipping, and total to 0
      return res.json({
        cart: cart,
        totals: {
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0,
        },
      });
    }

    // Calculate subtotal
    const subtotal = cart.products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );

    // Fetch tax details
    let taxDetails = await Tax.findOne();
    let taxPercentage = taxDetails ? taxDetails.tax : 0;

    // Calculate tax amount based on percentage
    const tax = (subtotal * parseFloat(taxPercentage)) / 100;

    // Fetch shipping details
    let shippingDetails = await Shipping.findOne();
    let shipping = shippingDetails ? shippingDetails.shipping : 0;

    // Calculate total amount
    const totalAmount = subtotal + tax + parseFloat(shipping);

    res.json({
      cart,
      totals: {
        subtotal,
        tax,
        shipping,
        total: totalAmount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.increaseQuantity = async (req, res) => {
  const { productId } = req.params;

  try {
    // Find the cart for the user and populate the products
    let cart = await Cart.findOne({ userId: req.user.id }).populate(
      "products.productId"
    );

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(
      (product) => product.productId._id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // Increase the quantity by 1
    cart.products[productIndex].quantity += 1;

    // Save the updated cart
    cart = await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to increase quantity in cart" });
  }
};

exports.decreaseQuantity = async (req, res) => {
  const { productId } = req.params;

  try {
    // Find the cart for the user and populate the products
    let cart = await Cart.findOne({ userId: req.user.id }).populate(
      "products.productId"
    );

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(
      (product) => product.productId._id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // Increase the quantity by 1
    cart.products[productIndex].quantity -= 1;

    // Update the total amount by adding the price of the product
    const product = cart.products[productIndex].productId;

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Save the updated cart
    cart = await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to increase quantity in cart" });
  }
};

exports.removeSingle = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Find the cart for the user
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart
    const product = cart.products.find(
      (product) => product.productId.toString() === productId
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Fetch the product price from the Product model
    const productData = await Product.findById(productId);
    if (!productData) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Remove the product from the cart
    cart.products = cart.products.filter(
      (product) => product.productId.toString() !== productId
    );

    // Save the updated cart
    await cart.save();

    res.json({ message: "Product removed", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
  const { couponCode } = req.body;
console.log("hi");
  try {
    // Find the cart by user ID
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Fetch the coupon by the provided coupon code
    const coupon = await Coupon.findOne({ couponCode: couponCode });

    // Check if the coupon exists and is valid
    if (!coupon || coupon.expirationDate < Date.now()) {
      return res
        .status(400)
        .json({ error: "Invalid coupon code or expired coupon" });
    }

    // Apply the coupon discount to the cart
    cart.couponCode = couponCode;

    // Save the updated cart and handle validation errors
    try {
      await cart.save();
    } catch (validationError) {
      // Handle validation errors
      return res.status(400).json({ error: validationError.message });
    }

    res.json({ cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to apply coupon" });
  }
};
