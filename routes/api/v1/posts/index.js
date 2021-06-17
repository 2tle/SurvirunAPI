const router = require('express').Router()
const controller = require('./posts.controller.js')
const authMiddleware = require('../../../../middlewares/authorization.js')

router.get('/', authMiddleware.verifyToken, controller.getPost)
router.post('/', authMiddleware.verifyToken, controller.createPost)


module.exports = router