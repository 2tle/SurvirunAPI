const User = require('../../../../models/user')
const ExerciseGoal = require("../../../../models/ExerciseGoal")
const Exercise = require('../../../../models/Exercise')
const CheckModule = require('../../../../module/check.js')
const config = require('../../../../config.js')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const crypto = require('crypto')




/**
 * @api {get} /api/v1/goal/compare 운동 목표 달성 여부 가져오기
 * @apiName GetGoalRatio
 * @apiGroup 운동/목표
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자의 토큰
 * @apiSuccess {Number} calorie 소모한 칼로리 비율
 * @apiSuccess {Number} km 달린 거리 비율
 * @apiSuccess {Number} time 운동한 시간 비율
 * 
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
		calorie: 0.32313
		km: 1.311,
		time: 0.91111
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
		const json = {
			calorie: data.calorie / parseFloat(calorieGoal),
			km: data.km / parseFloat(kmGoal),
			time: data.time / parseFloat(timeGoal)
		}
		return res.status(200).json(json)
	}

	try {
		getGoal(res.locals._id).then(getExerciseDT).then(sendData)
	} catch(e) {
		throw new Error(e.message)
	}
	
}

/**
 * @api {get} /api/v1/goal 운동 목표 가져오기
 * @apiName GetMyGoal
 * @apiGroup 운동/목표
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자의 토큰
 * @apiSuccess {Number} calorie 목표 칼로리
 * @apiSuccess {Number} km 목표 거리
 * @apiSuccess {Number} time 목표 시간
 * 
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
		calorie: 3241,
		km: 5.311,
		time: 1231,
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
	try {
		getGoal(res.locals._id).then(sendData)
	} catch(e) {
		throw new Error(e.message)
	}
	
}

/**
 * @api {patch} /api/v1/goal 운동 목표 업데이트
 * @apiName PatchMyGoal
 * @apiGroup 운동/목표
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자의 토큰
 * @apiBody {Number} calorie 사용자의 목표 칼로리
 * @apiBody {Number} km 사용자의 목표 거리
 * @apiBody {Number} time 사용자의 목표 시간(초)
 * @apiSuccess {Number} calorie 업데이트 된 사용자의 목표 칼로리 
 * @apiSuccess {Number} km 업데이트 된 사용자의 목표 거리
 * @apiSuccess {Number} time 업데이트 된 사용자의 목표 시간(초)
 * 
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
		calorie: 3241,
		km: 5.311,
		time: 1231,
 *	}
 */
exports.patchMyGoal = (req,res,next) => {
	const patchGoal = (id, cal, km, time) => {
		return ExerciseGoal.updateOne({uid:id},{calorie: cal, km: km, time: time},{upsert:true})
	}

	const send = (dummy) => {
		if(!dummy) {
			return res.status(200).json({result: false})
		} else {
			return res.status(200).json({result: true})
		}
		
	} 
	try {
		patchGoal(res.locals._id, req.body.calorie, req.body.km, req.body.time).then(send)
	} catch(e) {
		throw new Error(e.message)
	}

}
