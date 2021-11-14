const router = require('express').Router()

router.use("/auth", require("./auth"))
router.use("/exercise",require("./exercise"))
router.use("/friend",require("./friend"))
router.use("/image",require("./image"))
router.use('/goal', require('./goal'))

module.exports = router