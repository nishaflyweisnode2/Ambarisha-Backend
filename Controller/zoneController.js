const Zone = require("../Models/zoneModel");
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

exports.createZone = async (req, res) => {
    try {
        let findZone = await Zone.findOne({ name: req.params.name });
        console.log(req.body.name)
        if (findZone) {
          res.status(409).json({ message: "Zone already exit.", status: 404, data: {} });
        } else {
          upload.single("image")(req, res, async (err) => {
            if (err) { return res.status(400).json({ msg: err.message }); }
            const fileUrl = req.file ? req.file.path : "";
            const data = { name: req.body.name,categoryId:req.body.categoryId, image: fileUrl };
            const zone = await Zone.create(data);
            res.status(200).json({ message: "Zone add successfully.", status: 200, data: zone });
          })
        }
    
      } catch (error) {
        res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
      }
    };
exports.getZone = async (req, res) => {
  const zone = await Zone.find({});
  res.status(201).json({ success: true, zone, });
};
exports.updateZone = async (req, res) => {
  const { id } = req.params;
  const zone = await Zone.findById(id);
  if (!Zone) {
    res.status(404).json({ message: "Zone Not Found", status: 404, data: {} });
  }
  upload.single("image")(req, res, async (err) => {
    if (err) { return res.status(400).json({ msg: err.message }); }
    const fileUrl = req.file ? req.file.path : "";
    zone.image = fileUrl || zone.image;
    zone.name = req.body.name;
    let update = await zone.save();
    res.status(200).json({ message: "Updated Successfully", data: update });
  })
};
exports.removeZone = async (req, res) => {
  const { id } = req.params;
  const zone = await Zone.findById(id);
  if (!zone) {
    res.status(404).json({ message: "Zone Not Found", status: 404, data: {} });
  } else {
    await Zone.findByIdAndDelete(zone._id);
    res.status(200).json({ message: "Zone Deleted Successfully !" });
  }
};