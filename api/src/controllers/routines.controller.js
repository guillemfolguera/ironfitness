const Routine = require("../lib/models/routine.model");

const dayNames = {
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Mi\u00e9rcoles",
  Thursday: "Jueves",
  Friday: "Viernes",
  Saturday: "S\u00e1bado",
  Sunday: "Domingo",
  Miercoles: "Mi\u00e9rcoles",
  Sabado: "S\u00e1bado",
};

function startOfNaturalWeek(value) {
  const date = parseDate(value);
  date.setUTCHours(0, 0, 0, 0);

  const weekday = date.getUTCDay();
  const diff = weekday === 0 ? -6 : 1 - weekday;
  date.setUTCDate(date.getUTCDate() + diff);

  return date;
}

function parseDate(value) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  return new Date(value);
}

function normalizeDayName(day) {
  return dayNames[day] || day;
}

function normalizeDays(days = []) {
  return days.map((day) => ({
    ...day,
    day: normalizeDayName(day.day),
  }));
}

function normalizeRoutineDays(routine) {
  routine.days.forEach((day) => {
    day.day = normalizeDayName(day.day);
  });
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
      week: parseDate(week),
      days: normalizeDays(days),
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

    day.trainingType = req.body.trainingType;
    day.duration = req.body.duration;
    day.details = req.body.details;
    normalizeRoutineDays(routine);

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
    normalizeRoutineDays(routine);

    await routine.save();

    res.status(200).json(day);
  } catch (error) {
    next(error);
  }
};
