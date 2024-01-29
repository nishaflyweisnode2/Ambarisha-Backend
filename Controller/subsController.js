const subs = require("../Models/subsModel");

exports.addsubs = async (req, res) => {
  try {
    const subsData = await subs.create({ subs: req.body.subs });
    res.status(200).json({
      data: subsData,
      message: "  subs Added ",
      details: subsData,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
};

exports.getsubs = async (req, res) => {
  try {
    const data = await subs.find();
    console.log(data);
    res.status(200).json({
      subs: data,
    });
  } catch (err) {
    res.status(400).send({ mesage: err.mesage });
  }
};

exports.updatesubs = async (req, res) => {
  try {
    const Updatedsubs = await subs
      .findOneAndUpdate(
        { _id: req.params.id },
        {
          subs: req.body.subs,
        }
      )
      .exec();
    console.log(Updatedsubs);
    res.status(200).json({
      message: "subs Update",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      mesage: err.mesage,
    });
  }
};

exports.Deletesubs = async (req, res) => {
  try {
    const id = req.params.id;
    await subs.deleteOne({ _id: id });
    res.status(200).send({ message: "subs deleted " });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
};
