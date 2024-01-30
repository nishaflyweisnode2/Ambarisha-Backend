const multer = require("multer");
require('dotenv').config()
const authConfig = require("../config/auth.config");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({ cloud_name: authConfig.cloud_name, api_key: authConfig.api_key, api_secret: authConfig.api_secret, });


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});

const upload = multer({ storage: storage });

const storage1 = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "Sajid-Bike-Backend/cityImage", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF", "jiff", "JIFF", "jfif", "JFIF", "mp4", "MP4", "webm", "WEBM"], }, });
const cityImage = multer({ storage: storage1 });


module.exports = {
  upload,
  cityImage
};
