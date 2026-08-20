const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const weightEntrySchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Weight = mongoose.model("Weight", weightEntrySchema)
module.exports = Weight
