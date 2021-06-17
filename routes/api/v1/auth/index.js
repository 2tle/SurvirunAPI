const router = require('express').Router()
const controller = require('./auth.controller.js')
const authMiddleware = require('../../../../middlewares/authorization.js')

router.get('/by-username/:username/exists', controller.usernameExists)
router.get('/by-email/:email/exists', controller.emailExists)
router.get('/by-username/:username', authMiddleware.verifyToken ,controller.getUserByUsername)
router.get('/by-email/:email', authMiddleware.verifyToken ,controller.getUserByEmail)
router.post('/new', controller.createNewUser)
router.post('/local', controller.createToken)

module.exports = router