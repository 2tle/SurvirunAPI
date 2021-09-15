const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ExerciseImg = new Schema({
  uid: {
	  type: String
  },
  date: {
	  type: String
  },
  time: {
	  type: String
  },
  img: { //must convert from bytearray to string(base64)
	  type: Buffer
  },
})
module.exports = mongoose.model("ExerciseImg",ExerciseImg)