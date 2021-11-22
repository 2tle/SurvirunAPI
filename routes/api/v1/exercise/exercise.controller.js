const User = require('../../../../models/user')
const Posts = require('../../../../models/posts')
const Exercise = require("../../../../models/Exercise")
const ExerciseImage = require("../../../../models/ExerciseImg")
const Score = require('../../../../models/Score')
const errorMiddleware = require("../../../../middlewares/error")
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
		getData().then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
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
			return Exercise.updateOne({ uid: res.locals._id, date: currentTimeToStr }, { "$inc": { 'calorie': parseInt(calorie), 'km': parseFloat(km), 'time': parseInt(time) } }).exec()

		}
	}
	const tct = (exx) => {
		return Exercise.findOne({ uid: res.locals._id, date: currentTimeToStr },{_id:0,uid:0,__v:0})
	}

	const send = (ex) => {
		return res.status(200).json(ex)
	}

	try {
		update().then(check).then(tct).then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Exception(e.message)
	}
	
	
}

exports.tmpgo = (req,res,next) => {
	calorie=[400,100,396,400,100,396,641];
	km=[4.3,1.2,4.21,4.31,1.2,4.21,6.5];
	time=[1900,423,1500,1800,420,1500,3600];
	date=['19','18','17','16','15','14','13'];
	for(var i = 0; i<7;i++) {
		const e = new Exercise({uid:'6197a07dbcf9f900246b2d5c',date:'2021-11-'+date[i],calorie:calorie[i],km:km[i],time:time[i]});
		e.save()
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
		return Exercise.find({ uid: res.locals._id },{_id:0, uid: 0,__v:0}).sort({ "date": 1 }).limit(7).exec()
	}
	const send = (d) => {
		return res.status(200).json({exerciseHistory: d})
	}
	try {
		getData().then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
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
		uploadImg().then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
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
		getData().then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
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
			patch(req.query.score).then(request).then(send).catch((err) => {
				errorMiddleware.promiseErrHandler(err,req,res)
			})
		}
	} catch(e) {
		throw new Error(e.message)
	}
}

/**
 * @api {get} /api/v1/exercise/score/global 점수 데이터 랭킹 가져오기
 * @apiName GetGlobalScore
 * @apiGroup 운동
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자의 토큰
 * @apiSuccess {List} users 사용자 정보 리스트
 * @apiSuccess {List} scores 사용자 점수 리스트
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
		users: [
			{"email": "someone@example.com", "username": "someone1"},
			{"email": "someone2@example.com", "username": "someone2"}
		],
		scores: [200,100]
 *	}
 */
exports.getTopScore = (req,res,next) => {
	let topId = []
	let scoreList = []
	const getScoreSorted = () => {
		return Score.find({},{_id:0 ,uid:1,score:1}).sort({score:-1}).exec()
	}
	const getIdList = (scList) => {
		return new Promise((resolve, reject) => {
			topId = scList.map(dt => dt.uid)
			scoreList = scList.map(dt => dt.score)
			resolve()
  		});

	}
	const getUserDT = () => {
		return User.find({_id: {$in: topId }},{_id:1,email:1,username:1}).exec()
	}

	const send = (t) => {
		t.sort((a,b) => {
			a1 = topId.indexOf(a._id.toString())
			b1 = topId.indexOf(b._id.toString())
			if(a1 >b1) return 1
			else if(a1<b1) return -1
			else return 0
		})
		const kk = t.map(({_doc, ...rest}) => _doc).map(({_id,...rest})=> rest)
		return res.status(200).json({
			users: kk,
			scores: scoreList
		})
	}
	try {
		getScoreSorted().then(getIdList).then(getUserDT).then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}


/**
 * @api {get} /api/v1/exercise/score 운동 점수 가져오기
 * @apiName GetScore
 * @apiGroup 운동
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자의 토큰
 * @apiQuery {String} reqType 요청타입 email 또는 username
 * @apiQuery {String} email (옵션) 이메일 요청타입이 email인 경우
 * @apiQuery {String} username (옵션) 이름 요청타입이 username인 경우
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
exports.getUsersScore = (req,res,next) => {
	const getUser = (reqType, data) => {
		switch(reqType) {
			case "email":
				return User.findOne({email:data}).exec()
				break
			case "username":
				return User.findOne({username: data}).exec()
				break
			default:
				res.status(400)
				throw new Error("1")
				break
		}	
	} 
	const getScore = (user) => {
		if(!user) {
			res.status(404)
			throw new Error("2")
		} else {
			return Score.findOne({uid: user._id}).exec()
		}
		
	}
	const sendData = (score) => {
		if(!score) {
			res.status(404)
			throw new Error("11")
		} else {
			return res.status(200).json({
				score: score.score
			})
		}
	}

	try {
		getUser(req.query.reqType, req.query.email || req.query.username).then(getScore).then(sendData).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}



