const User = require('../../../../models/user')
const Exercise = require('../../../../models/Exercise')
const Friend = require('../../../../models/Friend')
const Profile = require('../../../../models/Profile')
const UserIntro = require('../../../../models/UserIntro')
const CheckModule = require('../../../../module/check.js')
const Score = require('../../../../models/Score')
const fs = require('fs')
const sharp = require("sharp");
const config = require('../../../../config.js')
const path = require('path')
const moment = require('moment-timezone')
const jwt = require('jsonwebtoken')

const multer = require('multer')

const crypto = require('crypto')

/**
 * @api {get} /api/v1/auth/by-username/:username/exists Request to check who has username
 * @apiName CheckUserWhohasUsername
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiParam {String} username username
 * @apiSuccess {Boolean} exists If someone already had username, return true. If nobody had username, return false.
 * @apiSuccessExample {json} Nobody uses username:
 *	HTTP/1.1 200 OK
 *	{
 * 		"exists": false
 *	}
 * @apiSuccessExample {json} Someone uses username:
 *	HTTP/1.1 200 OK
 *	{
 *		"exists": true
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


	
	const username = req.params.username
	if (!username) { 
		res.status(400)
		throw new Error("1")
	}
	getUser(username).then(check)
	
}

/**
 * @api {get} /api/v1/auth/by-email/:email/exists Request to check who has email
 * @apiName CheckUserWhohasEmail
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiParam {String} email email
 * @apiSuccess {Boolean} exists If someone already had email, return true. If nobody had email, return false.
 * @apiSuccessExample {json} Nobody uses email:
 *	HTTP/1.1 200 OK
 * 	{
 *		"exists": false
 *	}
 * @apiSuccessExample {json} Someone uses email:
 *	HTTP/1.1 200 OK
 *	{
 *		"exists": true
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

	
	const email = req.params.email
	if (!email) {
		res.status(400)
		throw new Error("1")
	}
	getUser(email).then(check)
	
}


/**
 * @api {get} /api/v1/auth/by-username/:username Request to get user by username
 * @apiName GetUserByUsername
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token user's jwt token
 * @apiParam {String} username username
 * @apiSuccess {User} user UserData
 * @apiErrorExample {json} Not Found username:
 * 	HTTP/1.1 404 Not Found
 * 	{
 *		user: null
 * 	}
 * @apiErrorExample {json} Token Expired:
 * 	HTTP/1.1 419
 * 	{
 *		"error": "Token Expired"
 * 	}
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 *	{
 *   
    	"_id": "3cda3912...",
    	"email": "test@test.com",
    	"username": "testUsername",
		"intro": "this is my just 소개글.",
		"score": 100,
		"exerciseHistory": [
			{
				"calorie":10
				"km":0.045,
				"time": 4312,
				"date":"2021-09-13"
			},
			...
		]
 *	}
 */
exports.getUserByUsername = (req, res, next) => {

	var id1 = ''
	var email1 = ''
	var username1 = ''
	let imguid = ""
	let intro = ""
	var score = 0


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
			"_id": id1,
			"email": email1,
			"username": username1,
			"intro": intro,
			"score": score,
			"exerciseHistory": d
		}
		return res.status(200).json(userJson)
	}


	const username = decodeURI(req.params.username)

	if (!username) {
		res.status(400)
		throw new Error("1")
	}
	getUser(username).then(check).then(dataProcess).then(dP2).then(getIntro).then(send)
	
}







/**
 * @api {get} /api/v1/auth/by-email/:email Request to get user by email
 * @apiName GetUserByEmail
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token user's jwt token
 * @apiParam {String} email email
 * @apiSuccess {User} user UserData
 * @apiErrorExample {json} Not Found email:
 *	HTTP/1.1 404 Not Found
 * 	{
 *		user: null
 *	}
 * @apiErrorExample {json} Token Expired:
 *  HTTP/1.1 419
 *  {
 *  	"error": "Token Expired"
 *  }
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 * 	{
 * 		"_id": "3cda3912...",
    	"email": "test@test.com",
   		"username": "testUsername",
		"intro": "this is my just 소개글.",
		"score": 100,
		"exerciseHistory": [
			{
				"calorie":10
				"km":0.045,
				"time": 4312,
				"date":"2021-09-13"
			},
			...
		]
 * 	}
 */
exports.getUserByEmail = (req, res, next) => {
	let id1 = ''
	let email1 = ''
	let username1 = ''
	let imguid = ""
	let intro = ""
	var score= 0

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
			"_id": id1,
			"email": email1,
			"username": username1,
			"intro": intro,
			"score": score,
			"exerciseHistory": d
		}
		return res.status(200).json(userJson)
	}

	
	const email = decodeURI(req.params.email)

	if (!email) {
		res.status(400)
		throw new Error("1")
	}
	getUser(email).then(check).then(dataProcess).then(dP2).then(getIntro).then(send)
	
	
}







/**
 * @api {post} /api/v1/auth/new Request to create new user
 * @apiName CreateNewUser
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * @apiBody {String} username user's username
 * @apiBody {String} email user's email
 * @apiBody {String} password user's password
 * @apiSuccess {String} token user's jwt token
 * @apiErrorExample {json} Not Found email:
 *	HTTP/1.1 400 Bad Request
 *	{ 
 *		error: "Data must not be null" 
 *	}
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 * 	{
 * 		"token":"eyJwe..."
 *	}
 * @apiErrorExample {json} Token Expired:
 *	HTTP/1.1 419
 *	{
 *		"error": "Token Expired"
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
		res.status(200).json({
			token: token
		})
	}

	
	const { email, username } = req.body;
	if (email == "" || req.body.password == "") {
		res.status(400)
		throw new Error("1")
	}
	const password = crypto.createHash('sha512').update(req.body.password).digest('base64')
	createUser(email, username, password).then(createToken)
	

}

/**
 * @api {post} /api/v1/auth/local Request to login
 * @apiName Login
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * @apiBody {String} email
 * @apiBody {String} password 
 * @apiSuccess {String} token user's jwt token
 * @apiSuccess {Boolean} username if user set its username T/F
 * @apiSuccess {Boolean} profile if user set its profile img T/F
 * @apiErrorExample {json} Not Found email:
 *	HTTP/1.1 400 Bad Request
 *	{ 
 *		error: "Data must not be null" 
 *	}
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 *	{
 *		"token":"eyJwe...",
 * 		"username" : true,
 * 		"profile" : false
 *	}
 * @apiErrorExample {json} Token Expired:
 *	HTTP/1.1 419
 *	{
 *		"error": "Token Expired"
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
	
	if (req.body.email == "" || req.body.password == "") {
		res.status(400)
		throw new Error("1")
	}
	const email = req.body.email;
	const password = crypto.createHash('sha512').update(req.body.password).digest('base64')
	getUser(email, password).then(createToken).then(pimgc)
	
}


/**
 * @api {post} /api/v1/auth/profile Request to update user's profile
 * @apiName UploadProfileImage
 * @apiDescription Must USE Header :: Content-Type :  multipart/form-data
 * @apiGroup User
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
exports.uploadProfileImage = (req, res, next) => {

	let imgbuffer;

	const zip = () => {
		//let t = fs.readFileSync('./defaultUserImg.png')
		return sharp('d.PNG')
			.withMetadata()	// 이미지의 exif데이터 유지
			.png({
				quality: 80,

			})
			.toBuffer().then((data) => {
				imgbuffer = data;
			})
	}

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
	const findOne = () => {
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
	if(!req.query.reqType && req.query.reqType=="image") {
		if (!req.file.buffer) {
			res.status(400)
			throw new Error("1")
		}
		zip1()
		findOne().then(uploadImg).then(send)
	} else {
		zip()
		findOne().then(uploadImg).then(send)
	}
}

/**
 * @api {post} /api/v1/auth/defaultProfile Request to update user's profile as DEFAULT IMAGE
 * @apiName SETProfileImageAsDefault
 * @apiDescription ..
 * @apiGroup User
 * @apiVersion 1.0.0
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
exports.defaultImgSet = (req,res,next) => {
	let imgbuffer;

	const zip = () => {
		//let t = fs.readFileSync('./defaultUserImg.png')
		return sharp('./images/defaultUserImg.png')
			.withMetadata()	// 이미지의 exif데이터 유지
			.png({
				quality: 80,

			})
			.toBuffer().then((data) => {
				imgbuffer = data;
			})
	}

	const findOne = () => {
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

	zip()
	findOne().then(uploadImg).then(send)
}



/**
 * @api {get} /api/v1/auth/profile Request to get user's profile image
 * @apiName GetProfileImage
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token user's jwt token
 * @apiQuery {String} reqType email or username or self
 * @apiQuery {String} resType url or buffer
 * @apiQuery {String} username (Optional) if you want to other user's image, input it.
 * @apiQuery {String} email (Optional) if you want to other user's image, input it.
 * @apiSuccess {Object} img ImageBuffer..
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
		"img" : {
					type : "Buffer",
					data : Buffer(ex: [123,0,1,0,0,...])
			}
			
 		}
 *	}
 *  @apiSuccessExample {json} Success - url:
 *	HTTP/1.1 200 OK
 *	{
		"img" : "uuid"
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

	getData().then(getImg).then(send)
	
}


/**
 * @api {get} /api/v1/auth/jwt-decode Request to decode jwt token
 * @apiName DecodeJwtToken
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token user's jwt token
 * @apiSuccess {String} _id user's id
 * @apiSuccess {String} email user's email
 * @apiSuccess {String} username user's username
 * @apiSuccess {String} iat time that created token
 * @apiSuccess {String} exp time that will expire token
 * @apiSuccess {String} iss token issur
 * @apiSuccess {String} sub token info
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 *	{
 *		"_id": "613d65b91ef2af056a355438",
 *		"email": "taljosun",
 *		"username": "commonLicense",
 *		"iat": 1631533262,
 *		"exp": 1631576462,
 *		"iss": "studyRestAPI.2tle.repl.co",
 *		"sub": "userinfo"
 *	}
 * @apiErrorExample {json} Token Expired:
 *	HTTP/1.1 419
 *	{
 *		"error": "Token Expired"
 *	}
 */


/**
 * @api {patch} /api/v1/auth/by-username/:username Request to update username
 * @apiName UpdateUsername
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token user's jwt token
 * @apiParam {String} username username that will update
 * @apiSuccess {Boolean} result true or false
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 * 	{
		"result": true
	}
 * @apiErrorExample {json} Token Expired:
 *	HTTP/1.1 419
 *	{
 *		"error": "Token Expired"
 *	}
 */
exports.updateUsername = (req, res, next) => {
	const update = (username) => {
		return User.updateOne({ _id: res.locals._id }, { $set: { username: username } }).exec()
	}
	const send = (t) => {
		return res.status(200).json({ result: true })
	}
	
	if (req.params.username == "") {
		res.status(400)
		throw new Error("1")
	}
	update(req.params.username).then(send)
	
}
/**
 * @api {patch} /api/v1/auth/password Request to update password
 * @apiName UpdatePassword
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token user's jwt token
 * @apiBody {String} changePassword changePassword
 * @apiSuccess {Boolean} result true or false
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 * 	{
		"result": true
	}
 * @apiErrorExample {json} Token Expired:
 *	HTTP/1.1 419
 *	{
 *		"error": "Token Expired"
 *	}
 */
exports.updatePassword = (req, res, next) => {
	const update = () => {
		const cpassword = crypto.createHash('sha512').update(req.body.changePassword).digest('base64')
		return User.updateOne({ _id: res.locals._id }, { password: cpassword }).exec()

	}
	const send = (r) => {
		return res.status(200).json({ result: true })
	}
	
	if (req.body.chagnePassword == "") {
		res.status(400)
		throw new Error("1")
	}
	update().then(send)
	
}
/**
 * @api {delete} /api/v1/auth/local Request to delete user
 * @apiName DeletePassword
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token user's jwt token
 * @apiBody {String} password password
 * @apiSuccess {Boolean} result true or false
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 * 	{
		"result": true
	}
 * @apiErrorExample {json} Token Expired:
 *	HTTP/1.1 419
 *	{
 *		"error": "Token Expired"
 *	}
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
		return Friend.deleteMany({ uid: res.locals._id }).exec()
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
	
	if (req.body.password == "") {
		res.status(400)
		throw new Error("1")
	}
	const pw = crypto.createHash('sha512').update(req.body.password).digest('base64')
	getUser(pw).then(delUser).then(delExercise).then(delMyFriend).then(delFriendOthers).then(send)
	
}

/**
 * @api {patch} /api/v1/auth/intro Request to patch my intro
 * @apiName PatchUserIntro
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token user's jwt token
 * @apiBody {String} intro user's intro
 * @apiSuccess {Boolean} result true or false
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 * 	{
		"result": true
	}
 * @apiErrorExample {json} Token Expired:
 *	HTTP/1.1 419
 *	{
	 	"code": 5
 *		"message": "Token Expired"
 *	}
 */
exports.updateUserIntro = (req,res,next) => {
	const updateQ = (intro) => {
		return UserIntro.updateOne({uid:res.locals._id},{uid: res.locals._id, intro: intro},{upsert:true})
	}

	const send = (t) => {
		return res.status(200).json({result:true})
	}
	if(CheckModule.isEmpty(req.query.intro)) {
		res.status(400)
		throw new Error("1")
	}
	updateQ(req.body.intro).then(send)
}


