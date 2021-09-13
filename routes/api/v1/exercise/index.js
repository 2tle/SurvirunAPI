const router = require('express').Router()
const controller = require('./exercise.controller.js')
const authMiddleware = require('../../../../middlewares/authorization.js')
const logMiddleware = require('../../../../middlewares/log.js')
const multer = require('multer')
const upload = multer({dest: 'images/',limits: { fileSize: 5 * 1024 * 1024 }})

router.get('/',logMiddleware.consoleLog ,authMiddleware.verifyToken, controller.getExerciseData)

module.exports = router