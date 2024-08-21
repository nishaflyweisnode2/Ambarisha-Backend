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
// if (process.env.NODE_ENV == "production") {
//   console.log = function () { };
// }
app.get("/", (req, res) => {
    res.send("Hello Ambarisha Project");
});

app.use('/invoices', express.static(path.join(__dirname, 'Controller', 'invoices')));


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
const city = require("./Routers/cityRoutes");
const userSubscription = require("./Routers/userSubscriptionRoute");
const userMembership = require("./Routers/userMemberShipRoute");



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
app.use("/api/v1", city);
app.use("/api/v1/user", userSubscription);
app.use("/api/v1/user", userMembership);




const multer = require('multer');
const XLSX = require('xlsx');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const QRCode = require('qrcode');

const tmpDir = '/tmp';

app.use('/stickers', express.static(tmpDir));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tmpDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.post('/upload-excel', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        const workbook = XLSX.readFile(req.file.path);
        const sheet_name_list = workbook.SheetNames;
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        const canvasWidth = 500;
        const canvasHeight = 300;

        const createSticker = async (data, index) => {
            const canvas = createCanvas(canvasWidth, canvasHeight);
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            ctx.fillStyle = '#000000';
            ctx.font = 'bold 20px Arial';

            ctx.fillText(`HUB Name: ${data['HUB Name'] || data['HUB  Name'] || 'HUB Name'}`, 20, 50);
            ctx.fillText(`Company: ${data['Company name'] || 'Company Name'}`, 20, 90);
            ctx.fillText(`Fssai No: ${data['Fssai Number'] || 'Fssai Number'}`, 20, 130);
            ctx.fillText(`Product: ${data['Product Name'] || data['Product Name '] || 'Product Name'}`, 20, 170);
            ctx.fillText(`SKU No: ${data['SKU Number'] || 'SKU Number'}`, 20, 210);
            ctx.fillText(`Weight: ${data['Weight'] || 'Weight'}`, 20, 250);

            const qrCodeData = `HUB Name: ${data['HUB Name']}, Company Name: ${data['Company name']}, Product: ${data['Product Name']}`;
            const qrCodeImage = await QRCode.toDataURL(qrCodeData);

            const qrImg = await loadImage(qrCodeImage);
            ctx.drawImage(qrImg, 350, 50, 100, 100);

            const buffer = canvas.toBuffer('image/png');
            const stickerPath = path.join(tmpDir, `sticker_${index + 1}.png`);
            fs.writeFileSync(stickerPath, buffer);
            return stickerPath;
        };

        const stickerPaths = await Promise.all(worksheet.map((row, index) => createSticker(row, index)));

        const stickerUrls = stickerPaths.map(stickerPath => {
            return `${req.protocol}://${req.get('host')}/stickers/${path.basename(stickerPath)}`;
        });

        res.status(200).json({
            message: 'Stickers created successfully',
            stickers: stickerUrls
        });

        fs.unlinkSync(req.file.path);
    } catch (error) {
        console.error('Error processing the file:', error);
        res.status(500).json({ message: 'Error processing the file', error: error.message });
    }
});


mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);

mongoose.connect(process.env.DB_URL, /*{ useNewUrlParser: false, useUnifiedTopology: false, }*/).then((data) => {
    console.log(`Ambarisha Basket Mongodb Connected With Server: ${data.connection.host}`);
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}!`);
});

module.exports = app;
module.exports.handler = serverless(app);