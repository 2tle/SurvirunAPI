const User = require('../../../../models/user')
const config = require('../../../../config.js')
const path = require('path')

const jwt = require('jsonwebtoken')

const multer = require('multer')

const crypto = require('crypto')
/* 
[GET] /api/v1/auth/by-username/{username}/exists
{
  exists: true
}
유저가 존재하면 200코드 및 true 반환,
존재하지 않으면 404코드 및 false 반환
*/

exports.usernameExists = (req, res) => {
  const username = req.params.username
  console.log(`/api/v1/auth/` + username + `/exists called`)
  if (!username) return res.status(400).json({ error: "username must not be null" })

  const getUser = (username) => {
    return User.find({ username: username }).exec()
  }

  const check = (user) => {
    if (!user.length) return res.status(404).json({ exists: false })
    else return res.status(200).json({ exists: true })
  }

  try {
    getUser(username).then(check)
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

/* 
[GET] /api/v1/auth/by-email/{email}/exists
{
  exists: true
}
유저가 존재하면 200코드 및 true 반환,
존재하지 않으면 404코드 및 false 반환
*/

exports.emailExists = (req, res) => {
  const email = req.params.email
  console.log(`/api/v1/auth/by-email/` + email + `/exists called`)
  if (!email) return res.status(400).json({ error: "email must not be null" })

  const getUser = (email) => {
    return User.find({ email: email }).exec()
  }

  const check = (user) => {
    if (!user.length) return res.status(404).json({ exists: false })
    else return res.status(200).json({ exists: true })
  }

  try {
    getUser(email).then(check)
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}


/* 
[GET] /api/v1/auth/by-username/{username}
{
  user: {
    _id: "",
    email: "",
    username: ""
  }
}
유저가 존재하면 200코드 및 유저데이터 반환,
존재하지 않으면 404코드 null 반환
*/

exports.getUserByUsername = (req, res) => {
  const username = req.params.username
  console.log(`/api/v1/auth/by-username/` + username + ` called`)
  if (!username) return res.status(400).json({ error: "username must not be null" })

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
    getUser(username).then(check).then(dataProcess)
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}






/* 
[GET] /api/v1/auth/by-email/:email
{
  user: {
    _id: "",
    email: "",
    username: ""
  }
}
유저가 존재하면 200코드 및 유저데이터 반환,
존재하지 않으면 404코드 null 반환
*/

exports.getUserByEmail = (req, res) => {
  const email = req.params.email
  console.log(`/api/v1/auth/by-email/` + email + ` called`)
  if (!email) return res.status(400).json({ error: "email must not be null" })

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
    getUser(email).then(check).then(dataProcess)
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}








/* 
[POST] /api/v1/auth/new
{
  token:""
}
*/
exports.createNewUser = (req, res) => {
  const { email, username } = req.body;
  if (email == "" || username == "" || req.body.password == "") {
    return res.status(400).json({ error: "Data must not be null" })
  }
  const password = crypto.createHash('sha512').update(req.body.password).digest('base64')

  const createUser = (email, username, password) => {
    const newUser = new User({ email: email, username: username, password: password })
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
    createUser(email, username, password).then(createToken)
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ error: "Internal Server Error" })
  }

}

exports.createToken = (req, res) => {
  if (req.body.email == "" || req.body.password == "") {
    return res.status(400).json({ error: "Data must not be null" })
  }
  const email = req.body.email;
  const password = crypto.createHash('sha512').update(req.body.password).digest('base64')
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
    getUser(email, password).then(createToken)
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}



exports.uploadProfileImage = (req, res) => {
  try {
    console.log("POST /api/v1/auth/profile called")
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