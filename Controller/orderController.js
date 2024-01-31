const User = require("../Models/userModel");
const Order = require("../Models/orderModel");
const Cart = require("../Models/cartModel");




exports.allOrder = async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find();

    // Send the orders as a JSON response
    res.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.singleOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Fetch the order by ID from the database
    const order = await Order.findById(orderId).populate("products.productId");

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Send the order as a JSON response
    res.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.myOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.find({ user: userId }).populate({
      path: 'products.productId',
      populate: {
        path: 'category',
      },
    });;

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.orderStatus = async (req, res) => {
  const orderId = req.params.orderId;
  const { newStatus } = req.body;

  try {
    const order = await Order.findOne({ _id: orderId, });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    console.log(newStatus);
    order.status = newStatus;
    await order.save();

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getAllOrdersCategories = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'products.productId',
        populate: {
          path: 'category',
        },
      });

    const allCategoryIds = orders.reduce((categoryIds, order) => {
      order.products.forEach(product => {
        if (product.productId && product.productId.category) {
          categoryIds.add(product.productId.category._id.toString());
        }
      });
      return categoryIds;
    }, new Set());

    const uniqueCategoryIds = Array.from(allCategoryIds);

    res.json({ status: 200, data: uniqueCategoryIds });
  } catch (error) {
    console.error('Error fetching category IDs from all orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const userOrders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: 200,
      data: userOrders,
    });
  } catch (error) {
    console.error('Error fetching order history:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
};
exports.onetimeAll = async (req, res) => {
  try {
    const onetimeOrders = await Order.find({ frequency: "onetime" });
    res.json({ onetimeOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch onetime orders" });
  }
};
exports.dailyAll = async (req, res) => {
  try {
    const onetimeOrders = await Order.find({ frequency: "daily" });
    res.json({ onetimeOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch onetime orders" });
  }
};
exports.weekendAll = async (req, res) => {
  try {
    const onetimeOrders = await Order.find({ frequency: "weekend" });
    res.json({ onetimeOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch onetime orders" });
  }
};
exports.weeklyAll = async (req, res) => {
  try {
    const onetimeOrders = await Order.find({ frequency: "weekly" });
    res.json({ onetimeOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch onetime orders" });
  }
};
exports.alternateAll = async (req, res) => {
  try {
    const onetimeOrders = await Order.find({ frequency: "alternate" });
    res.json({ onetimeOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch onetime orders" });
  }
};
exports.onetimeUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const onetimeOrder = await Order.findOne({ frequency: "onetime", user: userId });
    res.json({ onetimeOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch onetime orders" });
  }
};
exports.dailyUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const onetimeOrder = await Order.findOne({ frequency: "daily", user: userId });
    res.json({ onetimeOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch onetime orders" });
  }
};
exports.weeklyUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const onetimeOrder = await Order.findOne({ frequency: "weekly", user: userId });
    res.json({ onetimeOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch onetime orders" });
  }
};
exports.weekendUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const onetimeOrder = await Order.findOne({ frequency: "weekend", user: userId });
    res.json({ onetimeOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch onetime orders" });
  }
};
exports.alternateUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const onetimeOrder = await Order.findOne({ frequency: "alternate", user: userId });
    res.json({ onetimeOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch onetime orders" });
  }
};













// const placeOrderAndDeductAmount = async (userId, cartProducts) => {
//   try {
//     // Fetch the user details
//     const user = await User.findById(userId);

//     // Calculate the total amount to deduct from the wallet
//     const totalAmountToDeduct = cartProducts.reduce(
//       (total, product) => total + product.price * product.quantity,
//       0
//     );

//     // Check if the user has sufficient balance in the wallet
//     if (user.wallet >= totalAmountToDeduct) {
//       // Deduct the amount from the user's wallet
//       user.wallet -= totalAmountToDeduct;

//       // Save the updated user details
//       await user.save();

//       // Create a new order
//       const newOrder = new Order({
//         user: userId,
//         products: cartProducts,
//         totalAmount: totalAmountToDeduct,
//         // Add other order details here
//       });

//       // Save the order
//       const savedOrder = await newOrder.save();

//       console.log("Order placed successfully:", savedOrder);
//     } else {
//       console.error("Insufficient balance in the user's wallet");
//     }
//   } catch (error) {
//     console.error("Failed to place order:", error);
//   }
// };

// // Function to schedule the order placement at midnight
// const scheduleOrderPlacement = () => {
//   // Get the current time
//   const currentTime = new Date();

//   // Calculate the time remaining until midnight
//   const timeUntilMidnight =
//     new Date(
//       currentTime.getFullYear(),
//       currentTime.getMonth(),
//       currentTime.getDate() + 1, // Tomorrow
//       0,
//       0,
//       0,
//       0
//     ) - currentTime;

//   // Set a timeout to trigger the order placement at midnight
//   setTimeout(async () => {
//     try {
//       // Replace the following line with the logic to fetch user details
//       const userId = req.user.id;

//       // Fetch the user's cart details
//       const userCart = await Cart.findOne({ userId }).populate(
//         "products.productId"
//       );

//       // Check if the user has a cart and it has products
//       if (userCart && userCart.products.length > 0) {
//         const cartProducts = userCart.products;

//         // Your existing logic to place the order and deduct the amount
//         placeOrderAndDeductAmount(userId, cartProducts);

//         // Optional: Clear the user's cart after placing the order
//         // await Cart.findOneAndDelete({ userId });
//       } else {
//         console.log("User has no items in the cart.");
//       }
//     } catch (error) {
//       console.error("Error fetching user or cart details:", error);
//     }
//   }, timeUntilMidnight);
// };

// exports.midnightOrder = async (req, res) => {
//   try {
//     // Schedule the initial order placement
//     scheduleOrderPlacement();

//     // Respond with a success message
//     res.json({
//       success: true,
//       message: "Order placement scheduled at midnight",
//     });
//   } catch (error) {
//     console.error("Failed to schedule order placement:", error);
//     res.status(500).json({ error: "Failed to schedule order placement" });
//   }
// };
