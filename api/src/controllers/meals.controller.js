const Meal = require("../lib/models/meal.model");

module.exports.list = async (req, res, next) => {
  try {
    const meals = await Meal.find({ owner: req.user._id });
    res.json(meals);
  } catch (error) {
    next(error);
  }
};

module.exports.create = async (req, res, next) => {
  try {
    const { date, name, calories, protein } = req.body;
    const meal = await Meal.create({
      date,
      name,
      calories,
      protein,
      owner: req.user._id,
    });

    res.status(201).json(meal);
  } catch (error) {
    next(error);
  }
};

module.exports.remove = async (req, res, next) => {
  try {
    const meal = await Meal.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
