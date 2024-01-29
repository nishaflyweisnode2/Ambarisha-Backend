const tax = require("../Models/taxModel");

exports.addtax = async (req, res) => {
  try {
    const taxData = await tax.create({ tax: req.body.tax });
    res.status(200).json({
      data: taxData,
      message: "  tax Added ",
      details: taxData,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
};

exports.gettax = async (req, res) => {
  try {
    const data = await tax.find();
    console.log(data);
    res.status(200).json({
      tax: data,
    });
  } catch (err) {
    res.status(400).send({ mesage: err.mesage });
  }
};

exports.updatetax = async (req, res) => {
  try {
    const Updatedtax = await tax
      .findOneAndUpdate(
        { _id: req.params.id },
        {
          tax: req.body.tax,
        }
      )
      .exec();
    console.log(Updatedtax);
    res.status(200).json({
      message: "tax Update",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      mesage: err.mesage,
    });
  }
};

exports.Deletetax = async (req, res) => {
  try {
    const id = req.params.id;
    await tax.deleteOne({ _id: id });
    res.status(200).send({ message: "tax deleted " });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
};
