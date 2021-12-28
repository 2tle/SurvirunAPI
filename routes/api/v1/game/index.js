const router = require('express').Router()
const controller = require('./game.controller.js')
const authMiddleware = require('../../../../middlewares/authorization.js')
const logMiddleware = require('../../../../middlewares/log.js')
const errorMiddleware = require('../../../../middlewares/error.js')
const multer = require('multer')
const upload = multer({dest: 'images/',limits: { fileSize: 5 * 1024 * 1024 }})





module.exports = router