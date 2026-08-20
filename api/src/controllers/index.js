const { Router } = require("express");
const meals = require("./meals.controller");
const meals = require("./routines.controller");
const meals = require("./users.controller");
const meals = require("./weights.controller");


const router = Router();

// Events CRUD
router.get("/meals", meals.list);
router.post("/meals", meals.create);

module.exports = router