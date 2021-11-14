const User = require('../../../../models/user')
const Posts = require('../../../../models/posts')
const Exercise = require("../../../../models/Exercise")
const ExerciseImage = require("../../../../models/ExerciseImg")
const Score = require('../../../../models/Score')
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
 * @api {get} /api/v1/exercise 오늘의 운동 데이터 가져오기
 * @apiName GetTodayExercise
 * @apiGroup 운동
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자의 토큰
 * @apiSuccess {String} date 오늘 날짜
 * @apiSuccess {Number} calorie 사용자의 소모한 칼로리
 * @apiSuccess {Number} km 사용자의 달린 거리
 * @apiSuccess {Number} time 사용자의 달린 시간(초)
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
		calorie:10
		km:0.045,
		time: 4312,
		date:"2021-09-13"	
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
			return res.status(200).json({
				"calorie": 0,
				"km": 0,
				"time": 0,
				"date": currentTimeToStr
			})
		}
	}
	try {
		getData().then(send)
	} catch(e) {
		throw new Error(e.message)
	}
	
	

}
/**
 * @api {patch} /api/v1/exercise 운동 데이터 업데이트
 * @apiName UpdateTodayExercise
 * @apiGroup 운동
 * @apiHeader {String} x-access-token 사용자의 토큰
 * @apiBody {Number} calorie 사용자의 소모한 칼로리
 * @apiBody {Number} km 사용자의 달린 거리
 * @apiBody {Number} time 사용자의 달린 시간(초)
 * @apiSuccess {String} date 오늘 날짜
 * @apiSuccess {Number} calorie 사용자의 오늘 소모한 칼로리
 * @apiSuccess {Number} km 사용자의 오늘 달린 거리
 * @apiSuccess {Number} time 사용자의 오늘 달린 시간(초)
 * @apiVersion 1.0.0
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
		calorie:10
		km:0.045,
		time: 4312,
		date:"2021-09-13"	
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

	try {
		update().then(check).then(tct).then(send)
	} catch(e) {
		throw new Exception(e.message)
	}
	
	
}

/**
 * @api {get} /api/v1/exercise/list 최대 1주일 까지의 운동 기록 가져오기
 * @apiName GetExerciseList
 * @apiGroup 운동
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자의 토큰
 * @apiSuccess {List} exerciseHistory 운동기록 리스트
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
		exerciseHistory: [
			{
				calorie:10
				km:0.045,
				time: 4312,
				date:"2021-09-13"	
			},
			{
				calorie:10
				km:0.045,
				time: 4312,
				date:"2021-09-12"	
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
	try {
		getData().then(send)
	} catch(e) {
		throw new Error(e.message)
	}
	
	
} 

/**
 * @api {post} /api/v1/exercise/img 운동 이미지 업로드
 * @apiName UploadExerciseImage
 * @apiGroup 운동
 * @apiVersion 1.0.0
 * @apiBody {File} image Image File
 * @apiHeader {String} Content-Type multipart/form-data
 * @apiHeader {String} x-access-token 사용자의 토큰
 * @apiSuccess {Boolean} result 결과 true 또는 false
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
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

	try {
		if(req.file.buffer == "") {
			res.status(400)
			throw new Error("1")
		}	
		zip1();
		uploadImg().then(send)
	} catch(e) {
		throw new Error(e.message)
	}

	
	
}




/**
 * @api {get} /api/v1/exercise/img 운동 이미지 가져오기
 * @apiName GetExerciseImages
 * @apiGroup 운동
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자의 토큰
 * @apiQuery {String} date 가져올 날짜 YYYY-MM-DD 또는 빈값(전체) 
 * @apiQuery {String} resType 반환타입 url 또는 buffer
 * @apiSuccess {List} exerciseImages 이미지 리스트
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공 - 반환타입 buffer:
 *	HTTP/1.1 200 OK
 *	{
		exerciseImages : [
			{
				date: "2021-09-16",
				time: "22:01:13",
				img: {
					type : "Buffer",
					data : Buffer(ex: [123,0,1,0,0,...])
				}
			},
			...
		]
 *	}
	@apiSuccessExample {json} 성공 - 반환타입 url:
 *	HTTP/1.1 200 OK
 *	{
		exerciseImages : [
			{
				date : "2021-09-16",
				time : "22:01:13",
				_id : "uuid" 
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
	try {
		getData().then(send)
	} catch(e) {
		throw new Error(e.message)
	}
	
	
}




/**
 * @api {patch} /api/v1/exercise/score 사용자의 점수 업데이트
 * @apiName PatchScore
 * @apiGroup 운동
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자의 토큰
 * @apiQuery {Number} score 사용자의 점수
 * @apiSuccess {Number} score 사용자의 가장 높은 점수
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
		score: 150
 *	}
 */
exports.patchScore = (req,res,next) => {
	const patch = (score) => {
		return Score.updateOne({uid: res.locals._id}, {$max: {score:score},$setOnInsert: {uid: res.locals._id}},{upsert: true}).exec()
	}
	const request = (t) => {
		return Score.findOne({uid: res.locals._id}).exec()
	}
	const send = (result) => {
		return res.status(200).json({score: result.score})
	}
	try {
		if(!req.query.score) {
			res.status(400)
			throw new Error("1")
		}
		else {
			patch(req.query.score).then(request).then(send)
		}
	} catch(e) {
		throw new Error(e.message)
	}
}



