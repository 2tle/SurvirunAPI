const User = require('../../../../models/user')
const Posts = require('../../../../models/posts')
const Exercise = require("../../../../models/Exercise")
const ExerciseImage = require("../../../../models/ExerciseImg")
const config = require('../../../../config.js')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const moment = require('moment-timezone')
const multer = require('multer')
const upload = {
	limits: {fileSize: 5*1024*1024}
}

/**
 * @api {get} /api/v1/exercise Request to get today exercise data
 * @apiName GetTodayExercise
 * @apiGroup Exercise
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token user's jwt token
 * @apiSuccess {String} date user's today exercise
 * @apiSuccess {Number} calorie user's today exercise: calorie
 * @apiSuccess {Number} km user's today exercise: running km
 * @apiSuccess {Number} time user's today exercise: time (second)
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
		"calorie":10
		"km":0.045,
		"time": 4312,
		"date":"2021-09-13"	
 *	}
 */
exports.getExerciseData = (req, res) => { //today
	const currentTimeToStr = moment().tz("Asia/Seoul").format("YYYY-MM-DD")
	const getData = () => {

		return Exercise.findOne({ uid: res.locals._id, date: currentTimeToStr },{_id:0,uid:0,__v:0})
	}
	const send = (data) => {
		if (data != null) {
			res.status(200).json(data)
		}
		else {
			const exercise = new Exercise({ uid: res.locals._id, calorie: 0, km: 0, time: 0, date: currentTimeToStr })
			exercise.save()
			res.status(200).json({
				"calorie": 0,
				"km": 0,
				"time": 0,
				"date": currentTimeToStr
			})
		}
	}

	try {
		getData().then(send)
	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: err.message })
	}

}
/**
 * @api {patch} /api/v1/exercise Request to update User's Exercise data
 * @apiName UpdateTodayExercise
 * @apiGroup Exercise
 * @apiHeader {String} x-access-token user's jwt token
 * @apiBody {Number} calorie user's today exercise: calorie
 * @apiBody {Number} km user's today exercise: running km
 * @apiBody {Number} time user's today exercise: time (second)
 * @apiSuccess {String} date user's today exercise
 * @apiSuccess {Number} calorie user's today exercise: calorie
 * @apiSuccess {Number} km user's today exercise: running km
 * @apiSuccess {Number} time user's today exercise: time (second)
 * @apiVersion 1.0.0
 * @apiErrorExample {json} Not Found email:
 *	HTTP/1.1 500 Internal Server Error
 * 	{ 
 *		error: "something error msg" 
 *	}
 * @apiErrorExample {json} Token Expired:
 *	HTTP/1.1 419
 * 	{
 *		"error": "Token Expired"
 *	}
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 *	{
		"calorie":10
		"km":0.045,
		"time": 4312,
		"date":"2021-09-13"	
 *	}
 */
exports.updateExerciseData = (req, res) => {
	const currentTimeToStr = moment().tz("Asia/Seoul").format("YYYY-MM-DD")
	const { calorie, km, time } = req.body;
	const update = () => {

		//console.log(currentTimeToStr)
		/*const q = Exercise.updateOne({uid: res.locals._id, date:currentTimeToStr},{$inc: {calorie:c, km:k, time:t}, $set: {uid: res.locals._id, date:currentTimeToStr}},{upsert: true})
		return Exercise.find({uid: res.locals._id, date:currentTimeToStr}).exec() */
		return Exercise.findOne({ uid: res.locals._id, date: currentTimeToStr }).exec()
		//console.log(tt)



	}

	const check = (ck) => {
		console.log(ck == null ? 1 : 2)
		if (ck == null) {
			//parseInt(calorie),parseFloat(km),parseInt(time)
			const e = new Exercise({ uid: res.locals._id, date: currentTimeToStr, calorie: parseInt(calorie), km: parseFloat(km), time: parseInt(time) })
			return e.save()
			//return Exercise.findOne({uid: res.locals._id, date:currentTimeToStr}).exec()
		} else {
			return Exercise.update({ uid: res.locals._id, date: currentTimeToStr }, { "$inc": { 'calorie': parseInt(calorie), 'km': parseFloat(km), 'time': parseInt(time) } }).exec()

		}
	}
	const tct = (exx) => {
		return Exercise.findOne({ uid: res.locals._id, date: currentTimeToStr },{_id:0,uid:0,__v:0})
	}

	const send = (ex) => {
		return res.status(200).json(ex)
	}

	try {
		console.log(calorie, km, time)
		update().then(check).then(tct).then(send)
	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: err.message })
	}
}

/**
 * @api {get} /api/v1/exercise/list Request to get exercise data before 7days
 * @apiName GetExerciseList
 * @apiGroup Exercise
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token user's jwt token
 * @apiSuccess {List} exerciseHistory user's today exercise
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
		"exerciseHistory": [
			{
				"calorie":10
				"km":0.045,
				"time": 4312,
				"date":"2021-09-13"	
			},
			{
				"calorie":10
				"km":0.045,
				"time": 4312,
				"date":"2021-09-12"	
			},
			...
		]
 *	}
 */
exports.getExerList = (req,res) => {
	
	const getData = () => {
		return Exercise.find({ uid: res.locals._id },{_id:0, uid: 0,__v:0}).sort({ "date": -1 }).limit(7).exec()
	}
	const send = (d) => {
		return res.status(200).json({exerciseHistory: d})
	}

	try {
		getData().then(send)
	} catch(err) {
		consol.error(err)
		return res.status(500).json({error: err.message})
	}
} 

/**
 * @api {post} /api/v1/exercise/img Request to upload exercise image
 * @apiName UploadExerciseImage
 * @apiDescription Must USE Header :: Content-Type :  multipart/form-data
 * @apiGroup Exercise
 * @apiVersion 1.0.0
 * @apiBody {Image} img Image File
 * @apiHeader {String} x-access-token user's jwt token
 * @apiSuccess {Boolean} result true
 * @apiErrorExample {json} Something Error:
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
		"result" : true
 *	}
 */
exports.uploadMyExPhoto = (req ,res) => { 
	const currentDateToStr = moment().tz("Asia/Seoul").format("YYYY-MM-DD")
	const currentTimeToStr = moment().tz('Asia/Seoul').format("HH:mm:ss") 

	const uploadImg = () => {
		const imgbuffer = req.file.buffer;
		if(imgbuffer.truncated) {
			return res.status(413).json({error: "Payload Too Large"})
		}
			
		const img = new ExerciseImage({
			uid: res.locals._id,
			date: currentDateToStr,
			time: currentTimeToStr,
			img: imgbuffer
		})
		return img.save()

	}

	const send = (t) => {
		return res.status(200).json({result: true})
	}

	try {
		//console.log(body)
		if(req.file.buffer == "") {
			return res.status(400).json({error: "Data must not be null"})
		}
		uploadImg().then(send)
	} catch(e) {
		console.error(e)
		return res.status(500).json({error: e.message})
	} 
}


/**
 * @api {get} /api/v1/exercise/img Request to get exercise images
 * @apiName GetExerciseImages
 * @apiGroup Exercise
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token user's jwt token
 * @apiQuery {String} date YYYY-MM-DD or "" 
 * @apiSuccess {List} exerciseImages List Image
 * @apiErrorExample {json} Something Error:
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
		"exerciseImages" : [
			{
				"date" : "2021-09-16",
				"time" : "22:01:13",
				"img" : {
					type : "Buffer",
					data : Buffer(ex: [123,0,1,0,0,...])
				}
			},
			...
		]
 *	}
 */
exports.getImages = (req,res) => {
	const getData = () => {
		if(req.query.date != "") {
			return ExerciseImage.find({uid: res.locals._id, date: req.query.date },{_id:0,uid:0,__v:0}).exec()
		}	
		else {
			return ExerciseImage.find({uid: res.locals._id },{_id:0,uid:0,__v:0}).exec()
		}
	}
	const send = (data) => {
		return res.status(200).json({
			exerciseImages : data
		})
	}

	try {
		getData().then(send)
	} catch(e) {
		console.error(e)
		return res.status(500).json({error: e.message})
	}
}

