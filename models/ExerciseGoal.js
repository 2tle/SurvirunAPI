const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ExerciseGoal = new Schema({
  uid: {
    type: String,
    required: true,
  },
  calorie: {
    type: Number,
  },
  km: {
    type: Number,
  },
  time: {
    type: Number,
  },
})
module.exports = mongoose.model("ExerciseGoal",ExerciseGoal)