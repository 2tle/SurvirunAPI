const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Friend = new Schema({
	uid: {
	  type: String,
	  required: true,
  	},
	friends: [String],
})

module.exports = mongoose.model("friend",Friend)