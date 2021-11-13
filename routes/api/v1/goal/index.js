const router = require('express').Router()
const controller = require('./goal.controller.js')
const authMiddleware = require('../../../../middlewares/authorization.js')
const logMiddleware = require('../../../../middlewares/log.js')
const errorMiddleware = require('../../../../middlewares/error.js')

router.get('/', logMiddleware.consoleLog,authMiddleware.verifyToken,controller.getMyGoal )
router.patch('/', logMiddleware.consoleLog,authMiddleware.verifyToken,controller.patchMyGoal)
router.get('/compare', logMiddleware.consoleLog, authMiddleware.verifyToken,controller.compareGoal)


module.exports = router