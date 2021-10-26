const User = require('../../../../models/user')
const Posts = require('../../../../models/posts')
const Exercise = require("../../../../models/Exercise")
const ExerciseImage = require("../../../../models/ExerciseImg")
const config = require('../../../../config.js')
const sharp = require("sharp");
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const moment = require('moment-timezone')
const multer = require('multer')
const upload = {
	limits: {fileSize: 15*1024*1024}
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
exports.getExerciseData = (req, res, next) => { //today
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

	
	getData().then(send)
	

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
exports.updateExerciseData = (req, res, next) => {
	const currentTimeToStr = moment().tz("Asia/Seoul").format("YYYY-MM-DD")
	const { calorie, km, time } = req.body;
	const update = () => {
		return Exercise.findOne({ uid: res.locals._id, date: currentTimeToStr }).exec()
	}

	const check = (ck) => {
		if (ck == null) {
			const e = new Exercise({ uid: res.locals._id, date: currentTimeToStr, calorie: parseInt(calorie), km: parseFloat(km), time: parseInt(time) })
			return e.save()
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

	update().then(check).then(tct).then(send)
	
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
exports.getExerList = (req, res, next)=> {
	
	const getData = () => {
		return Exercise.find({ uid: res.locals._id },{_id:0, uid: 0,__v:0}).sort({ "date": -1 }).limit(7).exec()
	}
	const send = (d) => {
		return res.status(200).json({exerciseHistory: d})
	}

	getData().then(send)
	
} 

/**
 * @api {post} /api/v1/exercise/img Request to upload exercise image
 * @apiName UploadExerciseImage
 * @apiDescription Must USE Header :: Content-Type :  multipart/form-data
 * @apiGroup Exercise
 * @apiVersion 1.0.0
 * @apiBody {File} image Image File
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
exports.uploadMyExPhoto = (req, res, next)=> { 
	const currentDateToStr = moment().tz("Asia/Seoul").format("YYYY-MM-DD")
	const currentTimeToStr = moment().tz('Asia/Seoul').format("HH:mm:ss") 

	let imgbuffer;

	const zip1 = () => {
		return sharp(req.file.buffer)
			.withMetadata()	// 이미지의 exif데이터 유지
			.png({
				quality: 80,

			})
			.toBuffer().then((data) => {
				imgbuffer = data;
			})
	}

	const uploadImg = () => {
		if(imgbuffer.truncated) {
			res.status(413)
			throw new Error("3")
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

	if(req.file.buffer == "") {
		res.status(400)
		throw new Error("1")
	}
	zip1();
	uploadImg().then(send)
	
}


/**
 * @api {get} /api/v1/exercise/img Request to get exercise images
 * @apiName GetExerciseImages
 * @apiGroup Exercise
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token user's jwt token
 * @apiQuery {String} date YYYY-MM-DD or "" 
 * @apiQuery {String} resType url or buffer
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
 * @apiSuccessExample {json} Success - buffer:
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
	@apiSuccessExample {json} Success - url:
 *	HTTP/1.1 200 OK
 *	{
		"exerciseImages" : [
			{
				"date" : "2021-09-16",
				"time" : "22:01:13",
				"_id" : "uuid" 
			},
			...
		]
 *	}
 */
exports.getImages = (req, res, next) => {
	const getData = () => {
		if(req.query.date != "") {
			if(req.query.resType == "url")
				return ExerciseImage.find({uid: res.locals._id, date: req.query.date },{_id:1,uid:0,__v:0,img:0}).exec()
			else return ExerciseImage.find({uid: res.locals._id, date: req.query.date },{_id:0,uid:0,__v:0,img:1}).exec()
		}	
		else {
			if(req.query.resType == "url")
				return ExerciseImage.find({uid: res.locals._id },{_id:1,uid:0,__v:0,img:0}).exec()
			else return ExerciseImage.find({uid: res.locals._id },{_id:0,uid:0,__v:0,img:1}).exec()
		}
	}	

	const send = (data) => {

		return res.status(200).json({
			exerciseImages : data
		})
	}

	getData().then(send)
	
}



