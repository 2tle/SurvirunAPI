const router = require('express').Router()
const controller = require('./posts.controller.js')
const authMiddleware = require('../../../../middlewares/authorization.js')
const logMiddleware = require('../../../../middlewares/log.js')

router.get('/', logMiddleware.consoleLog ,authMiddleware.verifyToken, controller.getPost)
router.post('/', logMiddleware.consoleLog ,authMiddleware.verifyToken, controller.createPost)
router.delete('/:id',logMiddleware.consoleLog ,authMiddleware.verifyToken, controller.deletePost)
//id= post's Id, 
router.post('/likes/:id',logMiddleware.consoleLog ,authMiddleware.verifyToken, controller.addLikes)
router.delete('/likes/:id', logMiddleware.consoleLog ,authMiddleware.verifyToken, controller.minusLikes)
//id= post's id
router.get('/comment/:id',logMiddleware.consoleLog,authMiddleware.verifyToken, controller.getComment)
//router.post('/comment/:id', logMiddleware.consoleLog, authMiddleware.verifyToken, controller.addComment)



module.exports = router