const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserIntro = new Schema({
	uid: {
		type: String,
	},
	intro: {
		type: String,
	},
})
module.exports = mongoose.model("UserIntro",UserIntro)

