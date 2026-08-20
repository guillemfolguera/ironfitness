const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const weeklyRoutineSchema = new Schema(
  {
    week: {
      type: Date,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    days: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          required: true,
        },
        trainingType: {
          type: String,
        },
        duration: {
          type: Number,
          min: 0,
        },
        details: {
          type: String,
        },
        status: {
          type: String,
          enum: ["pending", "completed", "missed"],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Routine = mongoose.model("Routine", weeklyRoutineSchema)
module.exports = Routine