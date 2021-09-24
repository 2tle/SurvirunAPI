const router = require('express').Router()

router.use("/auth", require("./auth"))
//router.use("/posts", require("./posts"))
router.use("/exercise",require("./exercise"))
router.use("/friend",require("./friend"))
router.use("/image",require("./image"))

module.exports = router