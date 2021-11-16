const router = require('express').Router()
const controller = require('./exercise.controller.js')
const authMiddleware = require('../../../../middlewares/authorization.js')
const logMiddleware = require('../../../../middlewares/log.js')
const multer = require('multer')
const errorMiddleware = require('../../../../middlewares/error.js')
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 10 * 1024 * 1024 }
})

router.get('/', logMiddleware.consoleLog, authMiddleware.verifyToken, controller.getExerciseData)
router.patch('/', logMiddleware.consoleLog, authMiddleware.verifyToken, controller.updateExerciseData)
router.get('/list', logMiddleware.consoleLog, authMiddleware.verifyToken, controller.getExerList)
router.post('/img', logMiddleware.consoleLog, authMiddleware.verifyToken, upload.single('image'), controller.uploadMyExPhoto)
router.get('/img', logMiddleware.consoleLog, authMiddleware.verifyToken, controller.getImages)
router.get('/score',logMiddleware.consoleLog, authMiddleware.verifyToken,
controller.getUsersScore)
router.patch('/score', logMiddleware.consoleLog, authMiddleware.verifyToken, controller.patchScore)
router.get('/list/global', logMiddleware.consoleLog, authMiddleware.verifyToken,
controller.getTopScore)

module.exports = router