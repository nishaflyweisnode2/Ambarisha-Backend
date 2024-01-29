const Apartment = require("../Models/apartmentModel");
require('dotenv').config();

const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ 
    cloud_name: 'dtijhcmaa', 
    api_key: '624644714628939', 
    api_secret: 'tU52wM1-XoaFD2NrHbPrkiVKZvY' 
  });
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});
const upload = multer({ storage: storage });

exports.createApartment = async (req, res) => {
    try {
        let findZone = await Apartment.findOne({ name: req.params.name });
        console.log(req.body.name)
        if (findZone) {
          res.status(409).json({ message: "Apartment already exit.", status: 404, data: {} });
        } else {
          upload.single("image")(req, res, async (err) => {
            if (err) { return res.status(400).json({ msg: err.message }); }
            const fileUrl = req.file ? req.file.path : "";
            const data = { name: req.body.name,image: fileUrl };
            const apartment = await Apartment.create(data);
            res.status(200).json({ message: "Apartment add successfully.", status: 200, data: apartment });
          })
        }
    
      } catch (error) {
        res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
      }
    };
exports.getApartment = async (req, res) => {
  const apartment = await Apartment.find({});
  res.status(201).json({ success: true, apartment, });
};
exports.updateApartment = async (req, res) => {
  const { id } = req.params;
  const apartment = await Apartment.findById(id);
  if (!Apartment) {
    res.status(404).json({ message: "Apartment Not Found", status: 404, data: {} });
  }
  upload.single("image")(req, res, async (err) => {
    if (err) { return res.status(400).json({ msg: err.message }); }
    const fileUrl = req.file ? req.file.path : "";
    apartment.image = fileUrl || apartment.image;
    apartment.name = req.body.name;
    let update = await apartment.save();
    res.status(200).json({ message: "Updated Successfully", data: update });
  })
};
exports.removeApartment = async (req, res) => {
  const { id } = req.params;
  const apartment = await Apartment.findById(id);
  if (!apartment) {
    res.status(404).json({ message: "Apartment Not Found", status: 404, data: {} });
  } else {
    await Apartment.findByIdAndDelete(apartment._id);
    res.status(200).json({ message: "Apartment Deleted Successfully !" });
  }
};