const router = require('express').Router()
const controller = require('./friend.controller.js')
const authMiddleware = require('../../../../middlewares/authorization.js')
const logMiddleware = require('../../../../middlewares/log.js')
const errorMiddleware = require('../../../../middlewares/error.js')
const multer = require('multer')
const upload = multer({dest: 'images/',limits: { fileSize: 5 * 1024 * 1024 }})
router.get('/list',logMiddleware.consoleLog, authMiddleware.verifyToken, controller.getFriendsList)
router.post('/',logMiddleware.consoleLog,authMiddleware.verifyToken,controller.addFriend)
router.patch('/',logMiddleware.consoleLog, authMiddleware.verifyToken, controller.removeFriend)
router.get('/check',logMiddleware.consoleLog, authMiddleware.verifyToken, controller.isFriend)


module.exports = router