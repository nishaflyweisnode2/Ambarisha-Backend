const Apartment = require("../Models/apartmentModel");
require('dotenv').config();
const City = require('../Models/cityModel');
const TowerBlock = require('../Models/blockTowerModel');

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
    let findZone = await Apartment.findOne({ name: req.body.name });
    console.log(req.body.name)
    if (findZone) {
      res.status(409).json({ message: "Apartment already exit.", status: 404, data: {} });
    } else {
      upload.single("image")(req, res, async (err) => {
        if (err) { return res.status(400).json({ msg: err.message }); }
        const fileUrl = req.file ? req.file.path : "";
        const data = { city: req.body.city, name: req.body.name, status: req.body.status, image: fileUrl };

        if (req.body.city) {
          const city = await City.findById(req.body.city);
          if (!city) {
            return res.status(404).json({ message: 'City not found' });
          }
        }
        const apartment = await Apartment.create(data);
        res.status(200).json({ message: "Apartment add successfully.", status: 200, data: apartment });
      })
    }

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};

exports.getApartment = async (req, res) => {
  try {
    const apartment = await Apartment.find({});
    res.status(201).json({ success: true, apartment, });
  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};

exports.getApartmentByCityId = async (req, res) => {
  try {
    const { cityId } = req.params;

    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({ status: 404, message: 'City not found' });
    }
    const apartment = await Apartment.find({ city: cityId });

    return res.status(201).json({ status: 200, data: apartment, });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};

exports.updateApartment = async (req, res) => {
  try {
    const { id } = req.params;
    const apartment = await Apartment.findById(id);

    if (!apartment) {
      return res.status(404).json({ message: "Apartment Not Found", status: 404, data: {} });
    }

    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ msg: err.message });
      }

      if (req.body.city) {
        const city = await City.findById(req.body.city);
        if (!city) {
          return res.status(404).json({ status: 404, message: 'City not found' });
        }
      }

      const fileUrl = req.file ? req.file.path : "";
      apartment.image = fileUrl || apartment.image;
      apartment.city = req.body.city || apartment.city;
      apartment.name = req.body.name || apartment.name;
      apartment.status = req.body.status || apartment.status;

      let update = await apartment.save();
      res.status(200).json({ message: "Updated Successfully", data: update });
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};

exports.removeApartment = async (req, res) => {
  try {
    const { id } = req.params;
    const apartment = await Apartment.findById(id);
    if (!apartment) {
      res.status(404).json({ message: "Apartment Not Found", status: 404, data: {} });
    } else {
      await Apartment.findByIdAndDelete(apartment._id);
      res.status(200).json({ message: "Apartment Deleted Successfully !" });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};


exports.createTowerBlock = async (req, res) => {
  try {
    let findTower = await TowerBlock.findOne({ name: req.body.name });
    if (findTower) {
      return res.status(409).json({ message: "Tower already exists.", status: 409, data: {} });
    } else {
      if (!req.body.apartment) {
        return res.status(400).json({ message: 'Apartment ID is required' });
      }

      const apartment = await Apartment.findById(req.body.apartment);
      if (!apartment) {
        return res.status(404).json({ message: 'Apartment not found' });
      }

      const towerData = {
        apartment: req.body.apartment,
        name: req.body.name,
        status: req.body.status,
        city: apartment.city
      };

      const tower = await TowerBlock.create(towerData);
      res.status(201).json({ message: "Tower added successfully.", status: 201, data: tower });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error", data: error.message });
  }
};

exports.getTowerBlock = async (req, res) => {
  try {
    const apartment = await TowerBlock.find({});
    res.status(201).json({ success: true, apartment, });
  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};

exports.getTowerBlockByCityId = async (req, res) => {
  try {
    const { cityId } = req.params;

    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({ status: 404, message: 'City not found' });
    }
    const apartment = await TowerBlock.find({ city: cityId });

    return res.status(201).json({ status: 200, data: apartment, });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};

exports.getTowerBlockByApartmentId = async (req, res) => {
  try {
    const { apartmentId } = req.params;

    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return res.status(404).json({ status: 404, message: 'Apartment not found' });
    }
    const tower = await TowerBlock.find({ apartment: apartmentId });

    return res.status(201).json({ status: 200, data: tower, });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};

exports.updateTowerBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const tower = await TowerBlock.findById(id);

    if (!tower) {
      return res.status(404).json({ message: "Tower Not Found", status: 404, data: {} });
    }

    if (req.body.apartment) {
      const apartment = await Apartment.findById(req.body.apartment);
      if (!apartment) {
        return res.status(404).json({ status: 404, message: 'Apartment not found' });
      }
    }

    tower.apartment = req.body.apartment || tower.apartment;
    tower.city = req.body.apartment.city || tower.city;
    tower.name = req.body.name || tower.name;
    tower.status = req.body.status || tower.status;

    const updatedTower = await tower.save();

    res.status(200).json({ message: "Updated Successfully", data: updatedTower });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error", data: error.message });
  }
};


exports.removeTowerBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const apartment = await Apartment.findById(id);
    if (!apartment) {
      res.status(404).json({ message: "Apartment Not Found", status: 404, data: {} });
    } else {
      await Apartment.findByIdAndDelete(apartment._id);
      res.status(200).json({ message: "Apartment Deleted Successfully !" });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};