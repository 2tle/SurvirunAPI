const User = require('../../../../models/user')
const Exercise = require('../../../../models/Exercise')
const config = require('../../../../config.js')
const path = require('path')

const jwt = require('jsonwebtoken')

const multer = require('multer')

const crypto = require('crypto')

/**
 * @api {get} /api/v1/auth/by-username/:username/exists Request to check who has username
 * @apiName CheckUserWhohasUsername
 * @apiGroup User
 * @apiParam {String} username username
 * @apiSuccess {Boolean} exists If someone already had username, return true. If nobody had username, return false.
 * @apiSuccessExample {json} Nobody uses username:
 *     HTTP/1.1 200 OK
 *     {
 *       "exists": false
 *     }
 * @apiSuccessExample {json} Someone uses username:
 *     HTTP/1.1 200 OK
 *     {
 *       "exists": true
 *     }
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
 * @apiParam {String} email email
 * @apiSuccess {Boolean} exists If someone already had email, return true. If nobody had email, return false.
 * @apiSuccessExample {json} Nobody uses email:
 *     HTTP/1.1 200 OK
 *     {
 *       "exists": false
 *     }
 * @apiSuccessExample {json} Someone uses email:
 *     HTTP/1.1 200 OK
 *     {
 *       "exists": true
 *     }
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
 * @apiHeader {String} x-access-token user's jwt token
 * @apiParam {String} username username
 * @apiSuccess {User} user UserData
 * @apiErrorExample {json} Not Found username:
 *     HTTP/1.1 404 Not Found
 *     {
 *     	 user: null
 *     }
 * @apiSuccessExample {json} Success:
 *     HTTP/1.1 200 OK
 *     {
 *       user: {
    		"_id": "3cda3912...",
    		"email": "test@test.com",
    		"username": "testUsername",
			"exerciseHistory": [
				{
					"calorie":10
					"km":0.045,
					"time": 4312,
					"date":"20210913"
				},
				...
			]

  		}
 *     }
 */
exports.getUserByUsername = (req, res) => {
  

  const getUser = (username) => {
    return User.find({ username: username }).exec()
  }

  const check = (user) => {
    if (!user.length) return res.status(404).json({ user: null })
    else return user
  }

  const dataProcess = (user) => {
    const userJson = {
      "_id": user[0]._id,
      "email": user[0].email,
      "username": user[0].username
    }

    return res.status(200).json(userJson)
  }

  try {
    const username = req.params.username
    if (!username) return res.status(400).json({ error: "username must not be null" })
    getUser(username).then(check).then(dataProcess)
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ error: err.message })
  }
}







/**
 * @api {get} /api/v1/auth/by-email/:email Request to get user by email
 * @apiName GetUserByEmail
 * @apiGroup User
 * @apiHeader {String} x-access-token user's jwt token
 * @apiParam {String} email email
 * @apiSuccess {User} user UserData
 * @apiErrorExample {json} Not Found email:
 *     HTTP/1.1 404 Not Found
 *     {
 *     	 user: null
 *     }
 * @apiSuccessExample {json} Success:
 *     HTTP/1.1 200 OK
 *     {
 *       user: {
    		"_id": "3cda3912...",
    		"email": "test@test.com",
    		"username": "testUsername",
			"exerciseHistory": [
				{
					"calorie":10
					"km":0.045,
					"time": 4312,
					"date":"20210913"
				},
				...
			]

  		}
 *     }
 */
exports.getUserByEmail = (req, res) => {
  

  const getUser = (email) => {
    return User.find({ email: email }).exec()
  }

  const check = (user) => {
    if (!user.length) return res.status(404).json({ user: null })
    else return user
  }

  const dataProcess = (user) => {
    const userJson = {
      "_id": user[0]._id,
      "email": user[0].email,
      "username": user[0].username
    }

    return res.status(200).json(userJson)
  }

  try {
    const email = req.params.email
    if (!email) return res.status(400).json({ error: "email must not be null" })
    getUser(email).then(check).then(dataProcess)
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ error: err.message })
  }
}







/**
 * @api {post} /api/v1/auth/new Request to create new user
 * @apiName CreateNewUser
 * @apiGroup User
 * @apiBody {String} username
 * @apiBody {String} email
 * @apiBody {String} password 
 * @apiSuccess {String} token user's jwt token
 * @apiErrorExample {json} Not Found email:
 *     HTTP/1.1 400 Bad Request
 *     { 
 * 			error: "Data must not be null" 
 *     }
 * @apiSuccessExample {json} Success:
 *     HTTP/1.1 200 OK
 *     {
 *       "token":"eyJwe..."
 *     }
 */
exports.createNewUser = (req, res) => {

  const createUser = (email, username, password) => {
    const newUser = new User({ email: email, username: username, password: password })
	const currentTime = new Date()
	const currentTimeToStr = currentTime.getFullYear() + currentTime.getMonth() + currentTime.getDate();
    const exercise = new Exercise({uid: newUser._id, calorie: 0, km :0,time:0, date: currentTimeToStr})
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
    if (email == "" || username == "" || req.body.password == "") {
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
 * @api {post} /api/v1/auth/new Request to login
 * @apiName Login
 * @apiGroup User
 * @apiBody {String} email
 * @apiBody {String} password 
 * @apiSuccess {String} token user's jwt token
 * @apiErrorExample {json} Not Found email:
 *     HTTP/1.1 400 Bad Request
 *     { 
 * 			error: "Data must not be null" 
 *     }
 * @apiSuccessExample {json} Success:
 *     HTTP/1.1 200 OK
 *     {
 *       "token":"eyJwe..."
 *     }
 */

exports.createToken = (req, res) => {
  
  const getUser = (email, password) => {
    return User.findOne({ email: email, password: password }).exec()
  }


  const createToken = (user) => {
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
    if (req.body.email == "" || req.body.password == "") {
      return res.status(400).json({ error: "Data must not be null" })
    }
    const email = req.body.email;
    const password = crypto.createHash('sha512').update(req.body.password).digest('base64')
    getUser(email, password).then(createToken)
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ error: err.message})
  }
}


// deprecated.. maybe?
exports.uploadProfileImage = (req, res) => {
  try {
    const upload = multer({
      storage: multer.diskStorage({
        destination: function (req1, file, cb) {
          cb(null, 'images/');
        },
        filename: function (req1, file, cb) {
          cb(null, res.locals._id+ path.extname(file.originalname));
        }
      })
    });
    return res.status(200).json({
      location: "/images/"+res.locals._id+".png"
    })
    
  } catch (e){
    console.error(e.message)
    return res.status(500).json({ error: e.message })
  }
}