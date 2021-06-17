const router = require('express').Router()
const controller = require('./auth.controller.js')
const authMiddleware = require('../../../../middlewares/authorization.js')

router.get('/by-username/:username/exists', controller.usernameExists)
router.get('/by-email/:email/exists', controller.emailExists)
router.get('/by-username/:username', controller.getUserByUsername)
router.post('/new', controller.createNewUser)
router.post('/local', controller.createToken)

module.exports = router