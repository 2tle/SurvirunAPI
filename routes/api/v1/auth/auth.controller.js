const User = require('../../../../models/user')
const Exercise = require('../../../../models/Exercise')
const Friend = require('../../../../models/Friend')
const Profile = require('../../../../models/Profile')
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
 */
exports.usernameExists = (req, res) => {

	const getUser = (username) => {
		return User.find({ username: username }).exec()
	}

	const check = (user) => {
		if (!user.length) return res.status(200).json({ exists: false })
		else return res.status(200).json({ exists: true })
	}

	try {
		const username = req.params.username
		if (!username) return res.status(400).json({ error: "username must not be null" })
		getUser(username).then(check)
	} catch (err) {
		console.error(err.message)
		return res.status(500).json({ error: "Internal Server Error" })
	}
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
exports.emailExists = (req, res) => {


	const getUser = (email) => {
		return User.find({ email: email }).exec()
	}

	const check = (user) => {
		if (!user.length) return res.status(200).json({ exists: false })
		else return res.status(200).json({ exists: true })
	}

	try {
		const email = req.params.email
		if (!email) return res.status(400).json({ error: "email must not be null" })
		getUser(email).then(check)
	} catch (err) {
		console.error(err.message)
		return res.status(500).json({ error: err.message })
	}
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
 *      user: {
    		"_id": "3cda3912...",
    		"email": "test@test.com",
    		"username": "testUsername",
			"exerciseHistory": [
				{
					"calorie":10
					"km":0.045,
					"time": 4312,
					"date":"2021-09-13"
				},
				...
			]

  		}
 *	}
 */
exports.getUserByUsername = (req, res) => {

	var id1 = ''
	var email1 = ''
	var username1 = ''


	const getUser = (username) => {
		return User.find({ username: username }).exec()
	}

	const check = (user) => {
		if (!user.length) return res.status(404).json({ user: null })
		else return user
	}

	const dataProcess = (user) => {
		id1 = user[0]._id
		email1 = user[0].email
		username1 = user[0].username
		return Exercise.find({ uid: user[0]._id }, { _id: 0, uid: 0, __v: 0 }).sort({ "date": -1 }).limit(7).exec()

	}


	const send = (d) => {
		const userJson = {
			"_id": id1,
			"email": email1,
			"username": username1,
			"exerciseHistory": d
		}
		return res.status(200).json(userJson)
	}

	try {
		const username = decodeURI(req.params.username)

		if (!username) return res.status(400).json({ error: "email must not be null" })
		getUser(username).then(check).then(dataProcess).then(send)
	} catch (err) {
		console.error(err.message)
		return res.status(500).json({ error: err.message })
	}
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
 * 		user: {
    		"_id": "3cda3912...",
    		"email": "test@test.com",
    		"username": "testUsername",
			"exerciseHistory": [
				{
					"calorie":10
					"km":0.045,
					"time": 4312,
					"date":"2021-09-13"
				},
				...
			]

  		}
 * 	}
 */
exports.getUserByEmail = (req, res) => {
	var id1 = ''
	var email1 = ''
	var username1 = ''


	const getUser = (email) => {
		return User.find({ email: email }).exec()
	}

	const check = (user) => {
		if (!user.length) return res.status(404).json({ user: null })
		else return user
	}

	const dataProcess = (user) => {
		id1 = user[0]._id
		email1 = user[0].email
		username1 = user[0].username
		return Exercise.find({ uid: user[0]._id }, { _id: 0, uid: 0, __v: 0 }).sort({ "date": -1 }).limit(7).exec()

	}


	const send = (d) => {
		const userJson = {
			"_id": id1,
			"email": email1,
			"username": username1,
			"exerciseHistory": d
		}
		return res.status(200).json(userJson)
	}

	try {
		const email = decodeURI(req.params.email)

		if (!email) return res.status(400).json({ error: "email must not be null" })
		getUser(email).then(check).then(dataProcess).then(send)
	} catch (err) {
		console.error(err.message)
		return res.status(500).json({ error: err.message })
	}
}







/**
 * @api {post} /api/v1/auth/new Request to create new user
 * @apiName CreateNewUser
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * @apiBody {String} username
 * @apiBody {String} email
 * @apiBody {String} password 
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
exports.createNewUser = (req, res) => {

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

	try {
		const { email, username } = req.body;
		if (email == "" || req.body.password == "") {
			return res.status(400).json({ error: "Data must not be null" })
		}
		const password = crypto.createHash('sha512').update(req.body.password).digest('base64')
		createUser(email, username, password).then(createToken)
	} catch (err) {
		console.error(err.message)
		return res.status(500).json({ error: err.message })
	}

}

/**
 * @api {post} /api/v1/auth/local Request to login
 * @apiName Login
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * @apiBody {String} email
 * @apiBody {String} password 
 * @apiSuccess {String} token user's jwt token
 * @apiErrorExample {json} Not Found email:
 *	HTTP/1.1 400 Bad Request
 *	{ 
 *		error: "Data must not be null" 
 *	}
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 *	{
 *		"token":"eyJwe..."
 *	}
 * @apiErrorExample {json} Token Expired:
 *	HTTP/1.1 419
 *	{
 *		"error": "Token Expired"
 *	}
 */

exports.createToken = (req, res) => {

	const getUser = (email, password) => {
		return User.findOne({ email: email, password: password }).exec()
	}


	const createToken = (user) => {
		if (user != null) {
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
		} else {
			res.status(404).json({
				error: "Not Found User"
			})
		}

	}

	try {
		if (req.body.email == "" || req.body.password == "") {
			return res.status(400).json({ error: "Data must not be null" })
		}
		const email = req.body.email;
		const password = crypto.createHash('sha512').update(req.body.password).digest('base64')
		getUser(email, password).then(createToken)
	} catch (err) {
		console.error(err.message)
		return res.status(500).json({ error: err.message })
	}
}


/**
 * @api {post} /api/v1/auth/profile Request to update user's profile
 * @apiName UploadProfileImage
 * @apiDescription Must USE Header :: Content-Type :  multipart/form-data
 * @apiGroup User
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
exports.uploadProfileImage = (req, res) => {
	const findOne = () => {
		return Profile.findOne({ uid: res.locals._id }).exec()
	}
	const uploadImg = (findOne) => {
		const imgbuffer = req.file.buffer;
		if (imgbuffer.truncated) {
			return res.status(413).json({ error: "Payload Too Large" })
		}
		if (!findOne) {
			const img = new Profile({
				uid: res.locals._id,
				img: imgbuffer
			})
			return img.save()
		} else {
			return Profile.update({ uid: res.locals._id }, { img: imgbuffer }).exec()
		}


	}

	const send = (t) => {
		return res.status(200).json({ result: true })
	}

	try {
		//console.log(body)
		if (req.file.buffer == "") {
			return res.status(400).json({ error: "Data must not be null" })
		}
		findOne().then(uploadImg).then(send)
	} catch (e) {
		console.error(e)
		return res.status(500).json({ error: e.message })
	}
}

/**
 * @api {get} /api/v1/auth/profile Request to get user's profile image
 * @apiName GetProfileImage
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token user's jwt token
 * @apiQuery {String} username (Optional) if you want to other user's image, input it.
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
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 *	{
		"img" : {
					type : "Buffer",
					data : Buffer(ex: [123,0,1,0,0,...])
			}
			
		]
 *	}
 */
exports.getProfileImg =(req,res) => {
	const getData = () => {
		if(!req.query.username) {
			return User.findOne({_id: res.locals._id},{_id:1}).exec()
		} else {
			return User.findOne({username: req.query.username},{_id:1}).exec()
		}
	}
	const getImg = (user) => {
		return Profile.findOne({uid: user._id},{img:1,_id:0}).exec()
	}
	const send = (dt) => {
		return res.status(200).json({
			img: dt.img
		})
	}
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
exports.updateUsername = (req, res) => {
	const update = (username) => {
		return User.updateOne({ _id: res.locals._id }, { $set: { username: username } }).exec()
	}
	const send = (t) => {
		return res.status(200).json({ result: true })
	}
	try {
		if (req.params.username == "") {
			return res.status(400).json({ error: "Data must not be null" })
		}
		update(req.params.username).then(send)
	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: err.message })
	}
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
exports.updatePassword = (req, res) => {
	const update = () => {
		const cpassword = crypto.createHash('sha512').update(req.body.changePassword).digest('base64')
		return User.updateOne({ _id: res.locals._id }, { password: cpassword }).exec()

	}
	const send = (r) => {
		return res.status(200).json({ result: true })
	}
	try {
		update().then(send)
	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: err.message })
	}
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
exports.deleteUser = (req, res) => {
	const getUser = (pw) => {
		return User.findOne({ _id: res.locals._id, password: pw }).exec()
	}
	const delUser = (t) => {
		if (t != null) return User.deleteOne({ _id: res.locals._id }).exec()
		else return res.status(500).json({ error: "Not Found User" })
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
	try {
		if (req.body.password == "") {
			return res.status(400).json({ error: "Data must not be null" })
		}
		const pw = crypto.createHash('sha512').update(req.body.password).digest('base64')
		getUser(pw).then(delUser).then(delExercise).then(delMyFriend).then(delFriendOthers).then(send)
	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: err.message })
	}
}


