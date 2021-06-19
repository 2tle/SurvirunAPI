const jwt = require('jsonwebtoken')
const config = require('../config.js')

exports.verifyToken = (req, res, next) => {

  const token = req.headers['x-access-token']
  if(!token) {
    return res.status(401).json({error: "Not logged in"})
  }
  const p = new Promise(
    (resolved, reject) => {
      jwt.verify(token, config.secret, (err, decoded) => {
      if(err) {
        if(err.name === 'TokenExpiredError') {
          return res.status(419).json({error: "Token expired"})
        } else {
          return res.status(401).json({error: "Invaild token"})
        }
        
      }
        resolved(decoded)
      })
    }
  )

  try {
    p.then((decoded) => {
      req.decoded = decoded
      res.locals._id = decoded._id;
      next()
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({error: err.message})
  }
}