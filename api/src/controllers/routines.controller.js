const Routine = require("../lib/models/routine.model");

function startOfNaturalWeek(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);

  const weekday = date.getDay();
  const diff = weekday === 0 ? -6 : 1 - weekday;
  date.setDate(date.getDate() + diff);

  return date;
}

module.exports.list = async (req, res, next) => {
  try {
    const routines = await Routine.find({ owner: req.user._id });
    res.json(routines);
  } catch (error) {
    next(error);
  }
};

module.exports.create = async (req, res, next) => {
  try {
    const { week, days } = req.body;
    const routine = await Routine.create({
      week: startOfNaturalWeek(week),
      days,
      owner: req.user._id,
    });

    res.status(201).json(routine);
  } catch (error) {
    next(error);
  }
};

module.exports.dayDetail = async (req, res, next) => {
  try {
    const routine = await Routine.findOne({
      _id: req.params.routineId,
      owner: req.user._id,
    });

    if (!routine) {
      return res.status(404).json({ message: "Routine not found" });
    }

    const day = routine.days.id(req.params.dayId);

    if (!day) {
      return res.status(404).json({ message: "Training day not found" });
    }

    res.status(200).json(day);
  } catch (error) {
    next(error);
  }
};

module.exports.dayUpdate = async (req, res, next) => {
  try {
    const routine = await Routine.findOne({
      _id: req.params.routineId,
      owner: req.user._id,
    });

    if (!routine) {
      return res.status(404).json({ message: "Routine not found" });
    }

    const day = routine.days.id(req.params.dayId);

    if (!day) {
      return res.status(404).json({ message: "Training day not found" });
    }

    day.day = req.body.day;
    day.trainingType = req.body.trainingType;
    day.duration = req.body.duration;
    day.details = req.body.details;
    day.status = req.body.status;

    await routine.save();

    res.status(200).json(day);
  } catch (error) {
    next(error);
  }
};

module.exports.dayDelete = async (req, res, next) => {
  try {
    const routine = await Routine.findOne({
      _id: req.params.routineId,
      owner: req.user._id,
    });

    if (!routine) {
      return res.status(404).json({ message: "Routine not found" });
    }

    const day = routine.days.id(req.params.dayId);

    if (!day) {
      return res.status(404).json({ message: "Training day not found" });
    }

    day.deleteOne();

    await routine.save();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports.dayStatus = async (req, res, next) => {
  try {
    const routine = await Routine.findOne({
      _id: req.params.routineId,
      owner: req.user._id,
    });

    if (!routine) {
      return res.status(404).json({ message: "Routine not found" });
    }

    const day = routine.days.id(req.params.dayId);

    if (!day) {
      return res.status(404).json({ message: "Training day not found" });
    }

    day.status = req.body.status;

    await routine.save();

    res.status(200).json(day);
  } catch (error) {
    next(error);
  }
};
