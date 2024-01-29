const shipping = require("../Models/shippingModel");

exports.addshipping = async (req, res) => {
  try {
    const shippingData = await shipping.create({ shipping: req.body.shipping });
    res.status(200).json({
      data: shippingData,
      message: "  shipping Added ",
      details: shippingData,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
};

exports.getshipping = async (req, res) => {
  try {
    const data = await shipping.find();
    console.log(data);
    res.status(200).json({
      shipping: data,
    });
  } catch (err) {
    res.status(400).send({ mesage: err.mesage });
  }
};

exports.updateshipping = async (req, res) => {
  try {
    const Updatedshipping = await shipping
      .findOneAndUpdate(
        { _id: req.params.id },
        {
          shipping: req.body.shipping,
        }
      )
      .exec();
    console.log(Updatedshipping);
    res.status(200).json({
      message: "shipping Update",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      mesage: err.mesage,
    });
  }
};

exports.Deleteshipping = async (req, res) => {
  try {
    const id = req.params.id;
    await shipping.deleteOne({ _id: id });
    res.status(200).send({ message: "shipping deleted " });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
};
