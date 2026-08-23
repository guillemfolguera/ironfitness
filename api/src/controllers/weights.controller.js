const Weight = require("../lib/models/weight.model");

module.exports.list = async (req, res, next) => {
  try {
    const weights = await Weight.find({ owner: req.user._id });
    res.json(weights);
  } catch (error) {
    next(error);
  }
};

module.exports.create = async (req, res, next) => {
  try {
    const { date, weight } = req.body;
    const weightEntry = await Weight.create({
      date,
      weight,
      owner: req.user._id,
    });

    res.status(201).json(weightEntry);
  } catch (error) {
    next(error);
  }
};

module.exports.remove = async (req, res, next) => {
  try {
    const weight = await Weight.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!weight) {
      return res.status(404).json({ message: "Weight not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
