const User = require('../../../../models/user')
const Friend = require("../../../../models/Friend")
const Profile = require('../../../../models/Profile')
const CheckModule = require('../../../../module/check.js')
const errorMiddleware = require("../../../../middlewares/error")
const config = require('../../../../config.js')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const crypto = require('crypto')

var Queue = []

exports.addQueue = (req,res) => {
	const getUserId = () => {
		return User.findOne({_id: res.locals._id}).exec()
	}
	const addQueue = (user) => {
		if(!user) throw new Error("2")
		Queue.push({
			uid: user._id,
			lat: req.query.lat,
			lng: req.query.lng
		})
		return res.status(200).json({
			result: true
		})
	}

	try {
		getUserId().then(addQueue).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
}

//exports.

