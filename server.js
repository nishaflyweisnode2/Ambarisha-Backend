const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require("compression");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
require("dotenv").config();



app.use(compression({ threshold: 150 }));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
if (process.env.NODE_ENV == "production") {
  console.log = function () { };
}
app.get("/", (req, res) => {
  res.send("Hello Ambarisha Project");
});


// Route Imports
const user = require("./Routers/userRoute");
const banner = require("./Routers/bannerRoute");
const category = require("./Routers/categoryRoute");
const subcategory = require("./Routers/subCategoryRoute");
const product = require("./Routers/productRoute");
const coupon = require("./Routers/couponRoute");
const zone = require("./Routers/zoneRoute");
const apartment = require("./Routers/apartmentRoute");
const faq = require("./Routers/faqRoute");
const terms = require("./Routers/termsRoute");
const privacy = require("./Routers/privacyRoute");
const feedback = require("./Routers/feedbackRoute");
const cart = require("./Routers/cartRoute");
const tax = require("./Routers/taxRoute");
const shipping = require("./Routers/shippingRoute");
const order = require("./Routers/orderRoute");
const wallet = require("./Routers/walletRoute");
const subscription = require("./Routers/subsRoute");
const address = require("./Routers/addressRoute");
const notify = require("./Routers/notifyRoute");
const aboutUs = require("./Routers/aboutUsRoute");
const admin = require("./Routers/adminRoute");



app.use("/api/v1", user);
app.use("/api/v1/banner", banner);
app.use("/api/v1/category", category);
app.use("/api/v1/subcategory", subcategory);
app.use("/api/v1/product", product);
app.use("/api/v1/coupon", coupon);
app.use("/api/v1/zone", zone);
app.use("/api/v1/apartment", apartment);
app.use("/api/v1/faq", faq);
app.use("/api/v1/terms", terms);
app.use("/api/v1/privacy", privacy);
app.use("/api/v1/cart", cart);
app.use("/api/v1/feedback", feedback);
app.use("/api/v1/tax", tax);
app.use("/api/v1/shipping", shipping);
app.use("/api/v1/order", order);
app.use("/api/v1/wallet", wallet);
app.use("/api/v1/subscription", subscription);
app.use("/api/v1/address", address);
app.use("/api/v1/notify", notify);
app.use("/api/v1", aboutUs);
app.use("/api/v1", admin);




mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);

mongoose.connect(process.env.DB_URL, /*{ useNewUrlParser: false, useUnifiedTopology: false, }*/).then((data) => {
  console.log(`Ambarisha Basket Mongodb Connected With Server: ${data.connection.host}`);
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}!`);
});

module.exports = { handler: serverless(app) };
