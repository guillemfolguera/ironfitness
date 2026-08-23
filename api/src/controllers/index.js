const { Router } = require("express");
const meals = require("./meals.controller");
const routines = require("./routines.controller");
const users = require("./users.controller");
const weights = require("./weights.controller");
const sessions = require("./session.controller");
const router = Router();

// Middleware
router.use(sessions.cookie);

// Rutas
router.post("/signup", users.create);
router.post("/login", users.login);
router.delete("/logout", sessions.requireAuth, users.logout);
router.get("/profile", sessions.requireAuth, users.profile);
router.put("/profile", sessions.requireAuth, users.update);

router.get("/meals", sessions.requireAuth, meals.list);
router.post("/meals", sessions.requireAuth, meals.create);
router.delete("/meals/:id", sessions.requireAuth, meals.remove);

router.get("/weights", sessions.requireAuth, weights.list);
router.post("/weights", sessions.requireAuth, weights.create);
router.delete("/weights/:id", sessions.requireAuth, weights.remove);

router.get("/routines", sessions.requireAuth, routines.list);
router.post("/routines", sessions.requireAuth, routines.create);
router.get("/routines/:routineId/days/:dayId", sessions.requireAuth, routines.dayDetail);
router.put("/routines/:routineId/days/:dayId", sessions.requireAuth, routines.dayUpdate);
router.delete("/routines/:routineId/days/:dayId", sessions.requireAuth, routines.dayDelete);
router.patch("/routines/:routineId/days/:dayId", sessions.requireAuth, routines.dayStatus);

module.exports = router;
