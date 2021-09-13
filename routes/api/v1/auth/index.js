const router = require('express').Router()
const controller = require('./auth.controller.js')
const authMiddleware = require('../../../../middlewares/authorization.js')
const logMiddleware = require('../../../../middlewares/log.js')
const multer = require('multer')
const upload = multer({dest: 'images/',limits: { fileSize: 5 * 1024 * 1024 }})

router.get('/by-username/:username/exists', logMiddleware.consoleLog ,controller.usernameExists)
router.get('/by-email/:email/exists', logMiddleware.consoleLog ,controller.emailExists)
router.get('/by-username/:username', logMiddleware.consoleLog ,authMiddleware.verifyToken ,controller.getUserByUsername)
router.get('/by-email/:email', logMiddleware.consoleLog ,authMiddleware.verifyToken ,controller.getUserByEmail)
router.post('/new', logMiddleware.consoleLog ,controller.createNewUser)
router.post('/local', logMiddleware.consoleLog ,controller.createToken)
router.post('/profile',logMiddleware.consoleLog ,authMiddleware.verifyToken,upload.single('img'),controller.uploadProfileImage)

module.exports = router