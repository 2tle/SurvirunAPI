const User = require('../../../../models/user')
const Posts = require('../../../../models/posts')
const Exercise = require("../../../../models/Exercise")
const config = require('../../../../config.js')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const crypto = require('crypto')

exports.getExerciseData = (req, res) => { //today
  const getData = () => {
	const currentTime = new Date()
	const currentTimeToStr = currentTime.getFullYear() + currentTime.getMonth() + currentTime.getDate();
    return Exercise.findOne({uid:res.locals._id, date: currentTimeToStr})
  }
  const send = (data) => {
	if(date!= null) {
		res.status(200).json(data)
	}
    else {
		const exercise = new Exercise({uid: newUser._id, calorie: 0, km :0,time:0, date: currentTimeToStr})
		res.status(200).json(exercise.save())	
	}
  }
 
  try {
    getData().then(send)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }

}

exports.updateExerciseData = (req,res) => {

}

exports.getExerciseDataForUUID = (req,res) => {
  
}