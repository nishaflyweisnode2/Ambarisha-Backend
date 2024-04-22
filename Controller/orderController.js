const User = require("../Models/userModel");
const Order = require("../Models/orderModel");
const Cart = require("../Models/cartModel");
// const PDFDocument = require('pdfkit');
const PDFDocument = require("pdfkit-table");
const fs = require('fs');
const path = require('path');
var multer = require("multer");
const cron = require('node-cron');
const schedule = require('node-schedule');
const doc = new PDFDocument({ autoFirstPage: true, margin: 10, size: 'A4' });
const nodemailer = require('nodemailer')
const cloudinary = require('cloudinary').v2;
const os = require('os');
const Address = require("../Models/addressModel");
const Apartment = require("../Models/apartmentModel");
require('dotenv').config();
const City = require('../Models/cityModel');
const TowerBlock = require('../Models/blockTowerModel');



// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});





const generateInvoicePDF = (order, user) => {
  const PDFDocument = require('pdfkit');
  const fs = require('fs');
  const path = require('path');

  const invoicesDirectory = path.join(__dirname, 'invoices');
  console.log("invoicesDirectory", invoicesDirectory);
  if (!fs.existsSync(invoicesDirectory)) {
    fs.mkdirSync(invoicesDirectory);
  }

  const invoicePath = path.join(invoicesDirectory, `invoice-${order._id}.pdf`);
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(invoicePath);

  doc.pipe(stream);

  // Title
  doc.fontSize(16).text(`Invoice for Order ${order._id}`, { align: 'center' });
  doc.moveDown();

  // User details
  doc.fontSize(14).text(`User: ${user.name}`, { align: 'left' });
  doc.text(`Email: ${user.email}`, { align: 'left' });
  doc.moveDown();

  // Order details
  doc.fontSize(14).text('Order Details:', { underline: true });
  doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'left' });
  doc.text(`Total Amount: $${order.totalAmount}`, { align: 'left' });
  doc.moveDown();

  // Products
  doc.fontSize(14).text('Products:', { underline: true });
  order.products.forEach((product, index) => {
    doc.text(`${index + 1}. ${product.productId.name}: Quantity: ${product.quantity}, Price: $${product.price}`, { align: 'left' });
  });
  doc.moveDown();

  doc.end();

  return invoicePath;
};

const generateInvoicePDF1 = async (order, user) => {
  if (order) {
    // console.log("order***", order);
    console.log("order.products***", order.products);
    let product = order.products;
    console.log("product***", product);

    const allAddress = await Address.find({ user: user._id }).populate("user").populate("apartment").populate("block");
    console.log("allAddress", allAddress);
    let line_items = [];
    let name, obj2;
    if (order.products && order.products.length > 0) {
      let findOrder = await Order.findOne({ _id: order });
      console.log("findOrder***", findOrder);
      order.products.forEach(product => {

        if (findOrder) {
          name = findOrder._id;
          obj2 = {
            BikeNmae: name,
            ProductName: product.productId.name,
            ProductUnit: product.productId.unit,
            Quantity: product.productId.quantity,
            Description: product.productId.description,
            status: order.status,
            paymentStatus: order.paymentStatus,
            tax: order.taxAmount,
            deliveryCharge: order.deliveryCharge,
            subtotal: order.subtotal,
            total: order.totalAmount,
          }
          line_items.push(obj2)
        }
      });
    } else {
      obj2 = {
        Name: name,
        ProductName: product.productId.name,
        ProductUnit: product.productId.unit,
        Quantity: product.productId.quantity,
        Description: product.productId.description,
        status: order.status,
        paymentStatus: order.paymentStatus,
        tax: order.taxAmount,
        deliveryCharge: order.deliveryCharge,
        subtotal: order.subtotal,
        total: order.totalAmount,
      }
      line_items.push(obj2)
    }
    console.log(obj2);
    let hr = new Date(Date.now()).getHours();
    let date = new Date(Date.now()).getDate();
    if (date < 10) {
      date = '' + 0 + parseInt(date);
    } else {
      date = parseInt(date);
    }
    let month = new Date(Date.now()).getMonth() + 1;
    if (month < 10) {
      month = '' + 0 + parseInt(month);
    } else {
      month = parseInt(month);
    }
    let year = new Date(Date.now()).getFullYear();
    let fullDate = (`${date}/${month}/${year}`).toString();
    let min = new Date(Date.now()).getMinutes();
    if (hr < 10) {
      hr = '' + 0 + parseInt(hr);
    } else {
      hr = parseInt(hr);
    }
    if (min < 10) {
      min = '' + 0 + parseInt(min);
    } else {
      min = parseInt(min);
    }

    let bsa64 = 'data:image/jpeg;base64,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'
    doc.image(`${bsa64}`, 0, 15, { width: 100 }).text('EARLY MORNING BASKET PRIVATE LIMITED', 200, 45);
    doc.moveDown();
    doc.moveDown();
    doc.text('A 67, NEW MAN ROAD NOIDA Mob:1234567890', 170, 60)
    doc.moveDown();
    let table1 = [
      ["Order: Complete", "", "", "", "", "Invoice No: ", `${order._id}`],
      [``, "", "", "", "", "Invoice Date :", `${fullDate} ${hr}:${min}`],
      [`Name:`, `${user.name || " "}`, "", "", "", "", ``],
      [`Email:`, ` ${user.email || " "}`, "", "", "", "", ``],
      [`Customer id:`, `${'BLREMB'} + ${user._id || " "}`, "", "", "", "", ``],
      [`Tel:`, `${user.mobileNumber || "XXXXX"}`, "", "", "", "", ``],
    ]
    const tableArray = {
      headers: ["INVOICE To", "", "", "", "", "", "INVOICE", ""],
      rows: table1,
    };
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.table(tableArray, { width: 550, x: 15, y: 0 }); // A4 595.28 x 841.89 (portrait) (about width sizes)
    const table = {
      headers: [
        { label: "#", property: 'Sno', width: 15, renderer: null },
        { label: "Name", property: 'Name', width: 70, renderer: null },
        { label: "ProductName", property: 'ProductName', width: 105, renderer: null },
        { label: "ProductUnit", property: 'ProductUnit', width: 70, renderer: null },
        { label: "Quantity", property: 'Quantity', width: 70, renderer: null },
        { label: "Status", property: 'status', width: 70, renderer: null },
        { label: "deliveryCharge", property: 'deliveryCharge', width: 70, renderer: null },
        {
          label: "Subtotal", property: 'subtotal', width: 70,
          renderer: (value, indexColumn, indexRow, row) => { return `${Number(value).toFixed(2)}` }
        },
        // {
        //   label: "TotalAmount", property: 'total', width: 55,
        //   renderer: (value, indexColumn, indexRow, row) => { return `${Number(value).toFixed(2)}` }
        // },
      ],
      datas: line_items,
    };
    doc.moveDown();
    doc.table(table, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(6),
      prepareRow: (row, indexColumn, indexRow, rectRow) => doc.font("Helvetica").fontSize(6),
    });

    doc.moveDown();
    let table13 = [
      ["", "", "", "", "", "TAX AMOUNT", "", "TOTAL AMOUNT"],
      ["EARLY MORNING BASKET", "PRIVATE LIMITED", "", "", "", `${order?.taxAmount}`, "", `${obj2.total}`],
    ]
    const tableArray4 = {
      headers: ["", "", "", "", "", "", "", ""],
      rows: table13,
    };
    doc.table(tableArray4, { width: 550, x: 10, y: 0 });
    doc.text('VAT NO: GB350971689    CO RegNo:1139394    AWRS NO: XVAW00000113046', 115, 690).font("Helvetica").fontSize(16);
    doc.text('THANK YOU FOR YOUR VALUE CUSTOM', 100, 710).font("Helvetica").fontSize(8);
    doc.text('GOODS WITHOUT ENGLISH INGREDIENTS SHOULD BE LABELLED ACCORDINGLY BEFORE SALE', 98, 725).font("Helvetica").fontSize(5);
    doc.text('The goods once sold will not be returnable unless agreed. Pallet must be returned or a charge will be made', 110, 735).font("Helvetica").fontSize(35);
    let pdfBuffer = await new Promise((resolve) => {
      let chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.end();
    });
    console.log("pdfBuffer", pdfBuffer);

    // const tempDir = path.join(__dirname, 'temp');
    const tempDir = '/invoices';

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    const tempFilePath = path.join(tempDir, 'document.pdf');

    fs.writeFileSync(tempFilePath, pdfBuffer);
    console.log("tempFilePath", tempFilePath);


    const cloudinaryUploadResponse = await cloudinary.uploader.upload(tempFilePath, {
      folder: 'pdfs',
      resource_type: 'raw'
    });

    fs.unlinkSync(tempFilePath);

    order.pdfLink = cloudinaryUploadResponse.secure_url;
    await order.save();
    console.log("order.pdfLink", order.pdfLink);

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        "user": "princegap001@gmail.com",
        "pass": "scjiukvmscijgvpt"
      }
    });
    var mailOptions = {
      from: "<do_not_reply@gmail.com>",
      to: `${user.email}`,
      subject: 'PDF Attachment',
      text: 'Please find the attached PDF.',
      attachments: {
        filename: 'document.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    };
    let info = await transporter.sendMail(mailOptions);
    if (info) {
      var mailOptions1 = {
        from: "<do_not_reply@gmail.com>",
        to: `princegap001@gmail.com`,
        subject: 'Booking Recived',
        text: `Booking has been Completed ${order._id}`,
      };
      let info1 = await transporter.sendMail(mailOptions1);
    }
  }
}

generateInvoicePDF1()

const createOrdersFromCartsAuto = async () => {
  try {
    console.log('Creating orders from carts...');

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    console.log("endDate", endDate);
    // let carts = await Cart.find({
    //   createdAt: { $gte: startDate, /*$lte: endDate*/ }
    // }).populate('products.productId');
    // console.log("carts", carts);

    let carts = await Cart.find({
    }).populate('products.productId');
    console.log("carts", carts);

    for (const cart of carts) {
      const { userId } = cart;
      const user = await User.findById(userId);
      console.log("cart", cart);

      if (!user) {
        console.error(`User with ID ${userId} not found`);
        continue;
      }

      if (!cart || !cart.products.length) {
        console.error(`Cart for user ${userId} is empty`);
        continue;
      }

      const existingOrder = await Order.findOne({
        user: cart.userId,
        createdAt: {
          // $gte: new Date(startDate),
          $lte: endDate
        }
      });

      if (existingOrder) {
        console.log(`Order already exists for user ${userId} on ${startDate.toDateString()}`);
        continue;
      }

      let order = new Order({
        user: cart.userId,
        address: cart.address,
        membership: cart.membership,
        userMembership: cart.userMembership,
        plan: cart.plan,
        subscription: cart.subscription,
        userSubscription: cart.userSubscription,
        products: cart.products.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: cart.subtotal,
        taxAmount: cart.taxAmount,
        deliveryCharge: cart.deliveryCharge,
        discountAmount: cart.discountAmount,
        totalAmount: cart.totalAmount,
        startDate: cart.startDate,
        endDate: cart.endDate
      });
      console.log("order", order);

      await order.save();
      await Cart.findByIdAndDelete(cart._id);

      order = await Order.findById(order._id).populate("products.productId").populate('plan subscription userSubscription userMembership membership');

      const invoicePath = generateInvoicePDF1(order, user)
      // console.log("invoicePath", invoicePath);
      // let x = (`invoice-${order._id}.pdf`);
      // console.log("x", x);

      // order.pdfLink = `/invoices/${x}`
      await order.save();

      console.log(`Order created for user ${userId}`);
    }

    console.log('Orders created from carts successfully');
  } catch (error) {
    console.error('Error creating orders from carts:', error);
  }
};

// Schedule the cron job to run every day at 12 PM
cron.schedule('0 18 * * *', () => {
  // cron.schedule('* * * * *', () => {
  console.log('Running cron job to check Order create by cart sucessfully ');
  createOrdersFromCartsAuto();
});

exports.createOrderFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const cart = await Cart.findOne({ userId }).populate('products.productId');

    if (!cart || !cart.products.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let walletAmount = user.wallet;
    console.log(walletAmount);
    console.log(cart.totalAmount);

    if (walletAmount < cart.totalAmount) {
      return res.status(400).json({ status: 400, message: "Insufficient funds in your wallet" });
    }

    let order = new Order({
      user: userId,
      address: cart.address,
      membership: cart.membership,
      userMembership: cart.userMembership,
      plan: cart.plan,
      subscription: cart.subscription,
      userSubscription: cart.userSubscription,
      products: cart.products.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: cart.subtotal,
      taxAmount: cart.taxAmount,
      deliveryCharge: cart.deliveryCharge,
      discountAmount: cart.discountAmount,
      totalAmount: cart.totalAmount,
    });

    await order.save();

    console.log('Initial wallet amount:', walletAmount);
    console.log('Cart total amount:', cart.totalAmount);

    user.wallet -= cart.totalAmount;
    await user.save();
    console.log('Updated wallet amount after deduction:', user.wallet);

    await Cart.findByIdAndDelete(cart._id);

    order = await Order.findById(order._id).populate("products.productId").populate('plan subscription userSubscription userMembership membership');

    const invoicePath = generateInvoicePDF1(order, user)
    // console.log("invoicePath", invoicePath);
    // let x = (`invoice-${order._id}.pdf`);
    // console.log("x", x);

    // order.pdfLink = `/invoices/${x}`
    await order.save();

    return res.status(201).json({ status: 201, message: "Order created successfully", data: order, /*invoiceDownloadLink: `/invoices/${x}`,*/ });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.allOrder = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.singleOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findById(orderId).populate("products.productId").populate('plan subscription userSubscription userMembership membership');

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.myOrder = async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ status: 404, message: "User not found" });
  }

  try {
    const orders = await Order.find({ user: userId }).populate({
      path: 'products.productId',
      populate: {
        path: 'category',
      },
    }).populate('plan subscription userSubscription userMembership membership');

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
