const User = require('../../../../models/user')
const ExerciseGoal = require("../../../../models/ExerciseGoal")
const Exercise = require('../../../../models/Exercise')
const CheckModule = require('../../../../module/check.js')
const config = require('../../../../config.js')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const crypto = require('crypto')




/**
 * @api {get} /api/v1/goal/compare Request to get (currentValue / goal)
 * @apiName GetGoalRatio
 * @apiGroup Exercise/Goal
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token user's jwt token
 * @apiSuccess {Number} calorie
 * @apiSuccess {Number} km
 * @apiSuccess {Number} time
 * 
 * @apiErrorExample {json} Not Found email:
 *	HTTP/1.1 500 Internal Server Error
 *	{ 
 * 		error: "something error msg" 
 *	}
 * @apiErrorExample {json} Token Expired:
 *	HTTP/1.1 419
 *	{
 *		"error": "Token Expired"
 * 	}
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 *	{
		"calorie": 0.32313
		"km": 1.311,
		"time": 0.91111
 *	}
 */
exports.compareGoal = (req,res,next) => {
	let calorieGoal = 0.0, kmGoal = 0.0, timeGoal = 0.0
	const getGoal = (id) => {
		return ExerciseGoal.findOne({uid: id}).exec()
	}
	const getExerciseDT = (goal) => {
		if(!goal) throw new Error("9")
		calorieGoal = goal.calorie
		kmGoal = goal.km
		timeGoal = goal.time
		const currentTimeToStr = moment().tz("Asia/Seoul").format("YYYY-MM-DD")
		return Exercise.findOne({uid: goal.uid, date:currentTimeToStr }).exec()
	}

	const sendData = (data) => {
		calorieGoal = (calorieGoal <= 0 ? 1 : calorieGoal)
		kmGoal = (kmGoal <= 0 ? 1 : kmGoal)
		timeGoal = (timeGoal <= 0 ? 1 : timeGoal)
		const jsont = {
			calorie: data.calorie / parseFloat(calorieGoal),
			km: data.km / parseFloat(kmGoal),
			time: data.time / parseFloat(timeGoal)
		}
		return res.status(200).json(jsont)
	}

	getGoal(res.locals._id).then(getExerciseDT).then(sendData)
}

/**
 * @api {get} /api/v1/goal Request to get My Goal
 * @apiName GetMyGoal
 * @apiGroup Exercise/Goal
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token user's jwt token
 * @apiSuccess {Number} calorie
 * @apiSuccess {Number} km
 * @apiSuccess {Number} time
 * 
 * @apiErrorExample {json} Not Found email:
 *	HTTP/1.1 500 Internal Server Error
 *	{ 
 * 		error: "something error msg" 
 *	}
 * @apiErrorExample {json} Token Expired:
 *	HTTP/1.1 419
 *	{
 *		"error": "Token Expired"
 * 	}
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 *	{
		"calorie": 3241,
		"km": 5.311,
		"time": 1231,
 *	}
 */
exports.getMyGoal = (req,res,next) => {
	const getGoal = (id) => {
		return ExerciseGoal.findOne({uid: id},{calorie:1, km:1, time:1}).exec()
	}
	const sendData = (goal) => {
		if(!goal) throw new Error("9")
		return res.status(200).json(goal)
	}

	getGoal(res.locals._id).then(sendData)
}

/**
 * @api {patch} /api/v1/goal Request to patch(update) My Goal
 * @apiName PatchMyGoal
 * @apiGroup Exercise/Goal
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token user's jwt token
 * @apiBody {Number} calorie user's goal exercise: calorie
 * @apiBody {Number} km user's goal exercise: running km
 * @apiBody {Number} time user's goal exercise: time (sec)
 * @apiSuccess {Number} calorie
 * @apiSuccess {Number} km
 * @apiSuccess {Number} time
 * 
 * @apiErrorExample {json} Not Found email:
 *	HTTP/1.1 500 Internal Server Error
 *	{ 
 * 		error: "something error msg" 
 *	}
 * @apiErrorExample {json} Token Expired:
 *	HTTP/1.1 419
 *	{
 *		"error": "Token Expired"
 * 	}
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 *	{
		"calorie": 3241,
		"km": 5.311,
		"time": 1231,
 *	}
 */
exports.patchMyGoal = (req,res,next) => {
	const patchGoal = (id, cal, km, time) => {
		return ExerciseGoal.updateOne({uid:id},{calorie: cal, km: km, time: time},{upsert:true})
	}

	const send = (dummy) => {
		return res.status(200).json({result: true})
	} 

	patchGoal(res.locals._id, req.body.calorie, req.body.km, req.body.time).then(send)

}
