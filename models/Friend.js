const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userD = new Schema({
	uid: String,
})

const Friend = new Schema({
	uid: {
	  type: String,
	  required: true
  	},
	friends: [userD]
})

module.exports = mongoose.model("friend",Friend)