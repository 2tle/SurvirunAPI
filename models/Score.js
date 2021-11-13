const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Score = new Schema({
	uid: {
		type: String,
		required: true,
		unique: true
	},
	score: {
		type: Number,
	},
})
module.exports = mongoose.model("Score",Score)