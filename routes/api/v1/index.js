const router = require('express').Router()

router.use("/auth", require("./auth"))
router.use("/posts", require("./posts"))
router.use("/exercise",require("./exercise"))

module.exports = router