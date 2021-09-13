const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },

})

module.exports = mongoose.model("user",User)