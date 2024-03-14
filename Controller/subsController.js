const Subs = require("../Models/subsModel");


exports.getsubs = async (req, res) => {
  try {
    const data = await Subs.find().populate('productId planId');

    if (data.length === 0) {
      return res.status(404).json({ status: 404, message: 'not found', });
    }
    console.log(data);
    return res.status(200).json({
      status: 200,
      subs: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ mesage: err.mesage });
  }
};

exports.getsubsById = async (req, res) => {
  try {
    const id = req.params.id;
    const subscription = await Subs.findById(id).populate('productId planId');
    if (!subscription) {
      return res.status(404).json({ status: 404, message: 'Subscription not found' });
    }
    res.status(200).json({
      status: 200,
      data: subscription,
    });
  } catch (err) {
    res.status(400).send({ mesage: err.mesage });
  }
};

exports.Deletesubs = async (req, res) => {
  try {
    const id = req.params.id;
    await Subs.deleteOne({ _id: id });
    res.status(200).send({ message: "subs deleted " });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
};
