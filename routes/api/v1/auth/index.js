const router = require('express').Router()
const controller = require('./auth.controller.js')
const authMiddleware = require('../../../../middlewares/authorization.js')
const logMiddleware = require('../../../../middlewares/log.js')
const errorMiddleware = require('../../../../middlewares/error.js')
const multer = require('multer')
const upload = multer({storage: multer.memoryStorage(),limits: { fileSize: 10 * 1024 * 1024 }})



router.get('/jwt-decode', logMiddleware.consoleLog, authMiddleware.verifyToken, authMiddleware.decodeJWTToken)
router.get('/by-username/:username/exists', logMiddleware.consoleLog ,controller.usernameExists)
router.get('/by-email/:email/exists', logMiddleware.consoleLog ,controller.emailExists)
router.get('/by-username/:username', logMiddleware.consoleLog ,authMiddleware.verifyToken ,controller.getUserByUsername)
router.get('/by-email/:email', logMiddleware.consoleLog ,authMiddleware.verifyToken ,controller.getUserByEmail)
router.post('/new', logMiddleware.consoleLog ,controller.createNewUser)
router.post('/local', logMiddleware.consoleLog ,controller.createToken)
router.post('/profile',logMiddleware.consoleLog ,authMiddleware.verifyToken,upload.single('image'),controller.uploadProfileImage)
router.get('/profile',logMiddleware.consoleLog, authMiddleware.verifyToken, controller.getProfileImg)
router.patch('/password', logMiddleware.consoleLog, authMiddleware.verifyToken, controller.updatePassword)
router.patch('/by-username/:username', logMiddleware.consoleLog, authMiddleware.verifyToken, controller.updateUsername)
router.delete('/local',logMiddleware.consoleLog, authMiddleware.verifyToken, controller.deleteUser)



module.exports = router