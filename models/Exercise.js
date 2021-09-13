const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Exercise = new Schema({
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
  date: {
	type: String,
  },

})
module.exports = mongoose.model("exercise",Exercise)