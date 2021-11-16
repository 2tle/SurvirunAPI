const User = require('../../../../models/user')
const Exercise = require('../../../../models/Exercise')
const Friend = require('../../../../models/Friend')
const Profile = require('../../../../models/Profile')
const UserIntro = require('../../../../models/UserIntro')
const ExerciseGoal = require('../../../../models/ExerciseGoal')
const ExerciseImg = require('../../../../models/ExerciseImg')
const CheckModule = require('../../../../module/check.js')
const Score = require('../../../../models/Score')
const errorMiddleware = require("../../../../middlewares/error")
const fs = require('fs')
const sharp = require("sharp");
const config = require('../../../../config.js')
const path = require('path')
const moment = require('moment-timezone')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const crypto = require('crypto')

/**
 * @api {get} /api/v1/auth/by-username/:username/exists 이름 사용 여부
 * @apiName CheckUserWhohasUsername
 * @apiGroup 사용자
 * @apiVersion 1.0.0
 * @apiParam {String} username 이름
 * @apiSuccess {Boolean} exists 결과 사용중이면 true 아니면 false
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공 - 사용가능:
 *	HTTP/1.1 200 OK
 *	{
 * 		exists: false
 *	}
 * @apiSuccessExample {json} 성공 - 사용중:
 *	HTTP/1.1 200 OK
 *	{
 *		exists: true
 *	}
 * 
 */
exports.usernameExists = (req, res, next) => {

	const getUser = (username) => {
		return User.find({ username: username }).exec()
	}

	const check = (user) => {
		if (!user.length) return res.status(200).json({ exists: false })
		else return res.status(200).json({ exists: true })
	}

	try {
		const username = req.params.username
		if (!username) { 
			res.status(400)
			throw new Error("1")
		}
		getUser(username).then(check).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
	
	
}

/**
 * @api {get} /api/v1/auth/by-email/:email/exists 이메일 사용 여부
 * @apiName CheckUserWhohasEmail
 * @apiGroup 사용자
 * @apiVersion 1.0.0
 * @apiParam {String} email 이메일
 * @apiSuccess {Boolean} exists 결과 사용중이면 true 아니면 false
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공 - 사용가능:
 *	HTTP/1.1 200 OK
 *	{
 * 		exists: false
 *	}
 * @apiSuccessExample {json} 성공 - 사용중:
 *	HTTP/1.1 200 OK
 *	{
 *		exists: true
 *	}
 */
exports.emailExists = (req, res, next) => {


	const getUser = (email) => {
		return User.find({ email: email }).exec()
	}

	const check = (user) => {
		if (!user.length) return res.status(200).json({ exists: false })
		else return res.status(200).json({ exists: true })
	}

	try {
		const email = req.params.email
		if (!email) {
			res.status(400)
			throw new Error("1")
		}
		getUser(email).then(check).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
	
	
}


/**
 * @api {get} /api/v1/auth/by-username/:username 이름으로 사용자 정보 가져오기
 * @apiName GetUserByUsername
 * @apiGroup 사용자
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiParam {String} username 이름
 * @apiSuccess {String} email 이메일
 * @apiSuccess {String} username 이름
 * @apiSuccess {String} intro 소개글
 * @apiSuccess {Number} score 점수
 * @apiSuccess {List} exerciseHistory 운동기록
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
 *  	email: "test@test.com",
    	username: "testUsername",
		intro: "this is my just 소개글.",
		score: 100,
		exerciseHistory: [
			{
				calorie:10
				km:0.045,
				time: 4312,
				date:"2021-09-13"
			},
			...
		]
 *	}
 */
exports.getUserByUsername = (req, res, next) => {

	let id1 = ''
	let email1 = ''
	let username1 = ''
	let imguid = ""
	let intro = ""
	let score = 0


	const getUser = (username) => {
		return User.find({ username: username }).exec()
	}

	const check = (user) => {
		if (!user.length) {
			res.status(404)
			throw new Error("2")
		}
		else return user
	}

	const dataProcess = (user) => {
		id1 = user[0]._id
		email1 = user[0].email
		username1 = user[0].username
		return Score.findOne({uid:id1}).exec()
	}

	const dP2 = (sco) => {
		if(!sco) {
			score = 0
		} else {
			score = sco.score
		}
		
		return UserIntro.find({ uid: id1}).exec()
	}

	const getIntro = (introDq) => {
		if(!introDq) {
			intro = ""
		} else {
			intro =introDq.intro
			return Exercise.find({ uid:id1}, { _id: 0, uid: 0, __v: 0 }).sort({ "date": 1 }).limit(7).exec()
		}
	}


	const send = (d) => {
		const userJson = {
			"email": email1,
			"username": username1,
			"intro": intro,
			"score": score,
			"exerciseHistory": d
		}
		return res.status(200).json(userJson)
	}

	try {
		const username = decodeURI(req.params.username)
		if (!username) {
			res.status(400)
			throw new Error("1")
		}
		getUser(username).then(check).then(dataProcess).then(dP2).then(getIntro).then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	

	
	
}







/**
 * @api {get} /api/v1/auth/by-email/:email 이메일로 사용자 정보 가져오기
 * @apiName GetUserByEmail
 * @apiGroup 사용자
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiParam {String} email 이름
 * @apiSuccess {String} email 이메일
 * @apiSuccess {String} username 이름
 * @apiSuccess {String} intro 소개글
 * @apiSuccess {Number} score 점수
 * @apiSuccess {List} exerciseHistory 운동기록
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
 *  	email: "test@test.com",
 *   	username: "testUsername",
 *		intro: "this is my just 소개글.",
 *		score: 100,
 *		exerciseHistory: [
 *			{
 *				calorie:10
 *				km:0.045,
 *				time: 4312,
 *				date:"2021-09-13"
 *			},
 *			...
 *		]
 *	}
 */
exports.getUserByEmail = (req, res, next) => {
	let id1 = ''
	let email1 = ''
	let username1 = ''
	let imguid = ""
	let intro = ""
	let score= 0

	const getUser = (email) => {
		return User.find({ email: email }).exec()
	}

	const check = (user) => {
		if (!user.length) {
			res.status(404)
			throw new Error("2")
		}
		else return user
	}

	const dataProcess = (user) => {
		id1 = user[0]._id
		email1 = user[0].email
		username1 = user[0].username
		return Score.findOne({uid:id1}).exec()
	}

	const dP2 = (sco) => {
		if(!sco) {
			score = 0
		} else {
			score = sco.score
		}
		return UserIntro.find({ uid: id1}).exec()
	}

	const getIntro = (introDq) => {
		if(!introDq) {
			//res.status(500)
			//throw new Error("10")
			intro = ""
		} else {
			intro =introDq.intro
			return Exercise.find({ uid: id1 }, { _id: 0, uid: 0, __v: 0 }).sort({ "date": 1 }).limit(7).exec()
		}
	}


	const send = (d) => {
		const userJson = {
			"email": email1,
			"username": username1,
			"intro": intro,
			"score": score,
			"exerciseHistory": d
		}
		return res.status(200).json(userJson)
	}

	try {
		const email = decodeURI(req.params.email)

		if (!email) {
			res.status(400)
			throw new Error("1")
		}
		getUser(email).then(check).then(dataProcess).then(dP2).then(getIntro).then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
	
	
}







/**
 * @api {post} /api/v1/auth/new 새 계정 생성
 * @apiName CreateNewUser
 * @apiGroup 인증
 * @apiVersion 1.0.0
 * @apiBody {String} username 생성할 이름
 * @apiBody {String} email 생성할 이메일
 * @apiBody {String} password 생성할 비밀번호
 * @apiSuccess {String} token 사용자의 토큰
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 * 	{
 * 		token:"eyJwe..."
 *	}
 */
exports.createNewUser = (req, res, next) => {

	const createUser = (email, username, password) => {
		const newUser = new User({ email: email, username: username, password: password })
		const currentTimeToStr = moment().tz("Asia/Seoul").format("YYYY-MM-DD")
		const exercise = new Exercise({ uid: newUser._id, calorie: 0, km: 0, time: 0, date: currentTimeToStr })
		const friend = new Friend({ uid: newUser._id, friends: [] })
		const ee = friend.save()
		const d = exercise.save()
		return newUser.save()
	}

	const createToken = (user) => {
		console.log(user)
		const token = jwt.sign({
			_id: user._id,
			email: user.email,
			username: user.username
		}, config.secret, {
				expiresIn: '12h',
				subject: "userinfo",
				issuer: config.hostname
			})
		return res.status(200).json({
			token: token
		})
	}

	try {
		const { email, username } = req.body;
		if (email == "" || req.body.password == "") {
			res.status(400)
			throw new Error("1")
		}
		const password = crypto.createHash('sha512').update(req.body.password).digest('base64')
		createUser(email, username, password).then(createToken).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	}catch(e){
		throw new Error(e.message)
	}
	
	
	

}

/**
 * @api {post} /api/v1/auth/local 로그인
 * @apiName Login
 * @apiGroup 인증
 * @apiVersion 1.0.0
 * @apiBody {String} email 이메일
 * @apiBody {String} password 비밀번호
 * @apiSuccess {String} token 사용자의 토큰
 * @apiSuccess {Boolean} username 이름 등록 여부
 * @apiSuccess {Boolean} profile 프로필 이미지 등록 여부
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
 *		token:"eyJwe...",
 * 		username : true,
 * 		profile : false
 *	}
 */

exports.createToken = (req, res, next) => {
	let isUserNameCreated;
	let isProfileImgUploaded;
	let token;
	let userId;
	const getUser = (email, password) => {
		return User.findOne({ email: email, password: password }).exec()
	}


	const createToken = (user) => {
		if (user != null) {
			token = jwt.sign({
				_id: user._id,
				email: user.email,
				username: user.username
			}, config.secret, {
					expiresIn: '12h',
					subject: "userinfo",
					issuer: config.hostname
				})
			userId = user._id;
			isUserNameCreated = !CheckModule.isEmpty(user.username)
			return Profile.findOne({ uid: userId })
		} else {
			res.status(404)
			throw new Error("2")	
		}
	}

	const pimgc = (pd) => {
		isProfileImgUploaded = !CheckModule.isEmpty(pd)
		return res.status(200).json({
			token: token,
			username: isUserNameCreated,
			profile: isProfileImgUploaded
		})
	}
	try {
		if (req.body.email == "" || req.body.password == "") {
			res.status(400)
			throw new Error("1")
		}
		const email = req.body.email;
		const password = crypto.createHash('sha512').update(req.body.password).digest('base64')
		getUser(email, password).then(createToken).then(pimgc).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
	
	
}


/**
 * @api {post} /api/v1/auth/profile 프로필 이미지 업로드
 * @apiName UploadProfileImage
 * @apiDescription 헤더 사용 필수 Content-Type :  multipart/form-data
 * @apiGroup 사용자
 * @apiVersion 1.0.0
 * @apiBody {File} image 이미지 파일
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiSuccess {Boolean} result 결과 true 또는 false
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
 *		result: true
 *	}
 */
exports.uploadProfileImage = (req, res, next) => {

	let imgbuffer;

	const zip1 = () => {
		return sharp(req.file.buffer)
			.withMetadata()	// 이미지의 exif데이터 유지
			.png({
				quality: 80,

			})
			.toBuffer()
	}
	const findOne = (as) => {
		imgbuffer = as
		return Profile.findOne({ uid: res.locals._id }).exec()
	}

	const uploadImg = (findOne) => {
		
		
		if (!findOne) {
			const img = new Profile({
				uid: res.locals._id,
				img: imgbuffer
			})
			return img.save()
		} else {
			return Profile.updateOne({ uid: res.locals._id }, { img: imgbuffer }).exec()
		}


	}

	const send = (t) => {
		return res.status(200).json({ result: true })
	}
	try {
		if (!req.file.buffer) {
			res.status(400)
			throw new Error("1")
		}
		
		zip1().then(findOne).then(uploadImg).then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}

/**
 * @api {post} /api/v1/auth/defaultProfile 프로필 이미지를 기본 이미지로 설정
 * @apiName SETProfileImageAsDefault
 * @apiGroup 사용자
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiSuccess {Boolean} result 결과 true 또는 false
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
		result: true
 *	}
 */
exports.defaultImgSet = (req,res,next) => {
	let imgbuffer;

	const zip = () => {
		return sharp('./images/defaultUserImg.png')
			.withMetadata()	// 이미지의 exif데이터 유지
			.png({
				quality: 80,

			})
			.toBuffer()
	}

	const findOne = (as) => {
		imgbuffer = as
		return Profile.findOne({ uid: res.locals._id }).exec()
	}

	const send= (t) => {
		return res.status(200).json({result:true})
	}

	const uploadImg = (findOne) => {
		
		if (!findOne) {
			const img = new Profile({
				uid: res.locals._id,
				img: imgbuffer
			})
			return img.save()
		} else {
			return Profile.updateOne({ uid: res.locals._id }, { img: imgbuffer }).exec()
		}

		


	}
	try {
		zip().then(findOne).then(uploadImg).then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
}



/**
 * @api {get} /api/v1/auth/profile 사용자 이미지 가져오기
 * @apiName GetProfileImage
 * @apiGroup 사용자
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiQuery {String} reqType 요청타입 email 또는 username 또는 self
 * @apiQuery {String} resType 반환타입 url 또는 buffer
 * @apiQuery {String} username (옵션) 다른 사용자의 이름
 * @apiQuery {String} email (옵션) 다른 사용자의 이메일
 * @apiSuccess {Object} img 이미지버퍼
 * @apiSuccess {String} img 이미지 고유값
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공 - 반환타입 buffer:
 *	HTTP/1.1 200 OK
 *	{
		img : {
					type : "Buffer",
					data : Buffer(ex: [123,0,1,0,0,...])
			}
			
 		}
 *	}
 *  @apiSuccessExample {json} 성공 - 반환타입 url:
 *	HTTP/1.1 200 OK
 *	{
		img : "uuid"
 *	}
 */
exports.getProfileImg = (req, res, next) => {
	const getData = () => {
		switch (req.query.reqType) {
			case "username":
				if (CheckModule.isEmpty(req.query.username)){
					res.status(400)
					throw new Error("1")
				}
				else return User.findOne({ username: req.query.username }, { _id: 1 }).exec()
				break;
			case "email":
				if (CheckModule.isEmpty(req.query.email)) {
					res.status(400)
					throw new Error("1")
				}
				else return User.findOne({ email: req.query.email }, { _id: 1 }).exec()
				break;
			default:
				return User.findOne({ _id: res.locals._id }, { _id: 1 }).exec()
				break;
		}
	}
	const getImg = (user) => {
		return Profile.findOne({ uid: user._id }, { img: 1, _id: 1 }).exec()
	}
	const send = (dt) => {
		if (CheckModule.isEmpty(dt)) {
			res.status(400)
			throw new Error("4")
		} else {
			if(req.query.resType == "url")
				return res.status(200).json({ img: dt._id })
			else {
				return res.status(200).json({ img: dt.img })
			}
		}

	}
	try {
		getData().then(getImg).then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
	
}




/**
 * @api {patch} /api/v1/auth/by-username/:username 이름 업데이트
 * @apiName UpdateUsername
 * @apiGroup 인증
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiParam {String} username 업데이트할 이름
 * @apiSuccess {Boolean} result 결과 true 또는 false
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 * 	{
		result: true
	}
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 */
exports.updateUsername = (req, res, next) => {
	const update = (username) => {
		return User.updateOne({ _id: res.locals._id }, { $set: { username: username } }).exec()
	}
	const send = (t) => {
		return res.status(200).json({ result: true })
	}
	try {
		if (req.params.username == "") {
			res.status(400)
			throw new Error("1")
		}
		update(req.params.username).then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
	
}
/**
 * @api {patch} /api/v1/auth/password 비밀번호 변경
 * @apiName UpdatePassword
 * @apiGroup 인증
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiBody {String} currentPasswrod 현재 비밀번호
 * @apiBody {String} changePassword 변경할 비밀번호
 * @apiSuccess {Boolean} result 결과 true 또는 false
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 * 	{
 *		result: true
 *	}
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 */
exports.updatePassword = (req, res, next) => {
	const iCheck = (pw) => {
		const cpw = crypto.createHash('sha512').update(pw).digest('base64')
		return User.findOne({_id:res.locals._id, password:cpw}).exec()
	}
	const update = (user) => {
		if(!user) {
			res.status(400)
			throw new Error("2")
		} else {
			const cpassword = crypto.createHash('sha512').update(req.body.changePassword).digest('base64')
			return User.updateOne({ _id: res.locals._id }, { password: cpassword }).exec()
		}
		

	}
	const send = (r) => {
		return res.status(200).json({ result: true })
	}
	try {
		if (req.body.chagnePassword == "") {
			res.status(400)
			throw new Error("1")
		}
		iCheck(req.body.currentPassword).then(update).then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
	
}
/**
 * @api {delete} /api/v1/auth/local 사용자 삭제
 * @apiName DeletePassword
 * @apiGroup 인증
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiBody {String} password 사용자의 비밀번호
 * @apiSuccess {Boolean} result 결과 true 또는 false
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 * 	{
		result: true
	}
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 */
exports.deleteUser = (req, res, next) => {
	const getUser = (pw) => {
		return User.findOne({ _id: res.locals._id, password: pw }).exec()
	}
	const delUser = (t) => {
		if (t != null) return User.deleteOne({ _id: res.locals._id }).exec()
		else {
			res.status(500)
			throw new Error("2")
		}
	}
	const delExercise = (t) => {
		return Exercise.deleteMany({ uid: res.locals._id }).exec()
	}
	const delMyFriend = (t) => {
		return Friend.deleteOne({ uid: res.locals._id }).exec()
	}
	const delUserIntro = (t) => {
		return UserIntro.deleteOne({uid: res.locals._id}).exec()
	}
	const delExerciseGoal = (t) => {
		return ExerciseGoal.deleteOne({uid: res.locals._id}).exec()
	}
	const delScore = (t) => {
		return Score.deleteOne({uid:res.locals._id}).exec()
	}
	const delProfile = (t) => {
		return Profile.deleteOne({uid: res.locals._id}).exec()
	}
	const delExerciseImg = (t) => {
		return ExerciseImg.deleteMany({uid: res.locals._id}).exec()
	}
	const delFriendOthers = (t) => {
		return Friend.updateMany({}, {
			'$pull': {
				friends: {
					uid: res.locals._id
				}
			}
		})
	}
	const send = (t) => {
		return res.status(200).json({ result: true })
	}
	try {
		if (req.body.password == "") {
			res.status(400)
			throw new Error("1")
		}
		const pw = crypto.createHash('sha512').update(req.body.password).digest('base64')
		getUser(pw).then(delUser).then(delExercise).then(delMyFriend).then(delUserIntro).then(delExerciseGoal).then(delScore).then(delProfile).then(delExerciseImg).then(delFriendOthers).then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
	
}

/**
 * @api {patch} /api/v1/auth/intro 자기소개 수정
 * @apiName PatchUserIntro
 * @apiGroup 사용자
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiBody {String} intro 자기소개
 * @apiSuccess {Boolean} result 결과 true 또는 false
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 * 	{
		result: true
	}
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 */
exports.updateUserIntro = (req,res,next) => {
	const updateQ = (intro) => {
		return UserIntro.updateOne({uid:res.locals._id},{uid: res.locals._id, intro: intro},{upsert:true})
	}

	const send = (t) => {
		return res.status(200).json({result:true})
	}
	try {
		if(CheckModule.isEmpty(req.query.intro)) {
			res.status(400)
			throw new Error("1")
		}
		updateQ(req.body.intro).then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
}


