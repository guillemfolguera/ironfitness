const Meal = require("../lib/models/meal.model");

module.exports.list = async (req, res, next) => {
    const meals = await Meal.find();
    res.json(meals);
}

module.exports.create = async (req, res, next) => {
    const meal = await Meal.create(req.body);
    res.status(201).json(meal);
}