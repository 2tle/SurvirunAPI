const router = require('express').Router()
const controller = require('./auth.controller.js')
const authMiddleware = require('../../../../middlewares/authorization.js')
const multer = require('multer')
const upload = multer({dest: 'images/',limits: { fileSize: 5 * 1024 * 1024 }})

router.get('/by-username/:username/exists', controller.usernameExists)
router.get('/by-email/:email/exists', controller.emailExists)
router.get('/by-username/:username', authMiddleware.verifyToken ,controller.getUserByUsername)
router.get('/by-email/:email', authMiddleware.verifyToken ,controller.getUserByEmail)
router.post('/new', controller.createNewUser)
router.post('/local', controller.createToken)
router.post('/profile',authMiddleware.verifyToken,upload.single('img'),controller.uploadProfileImage)

module.exports = router