const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Posts = new Schema({
  uid: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type:String,
  },
  created: {
    type: String,
  },
  likes: [],
  options: {

  },
})

module.exports = mongoose.model("posts",Posts)