const router = require('express').Router()
const controller = require('./auth.controller.js')

router.get('/:username/exists', controller.usernameExists)

module.exports = router