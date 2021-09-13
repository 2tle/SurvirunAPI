exports.consoleLog = (req,res,next) => {
  try {
    console.log(req.method,req.originalUrl)
    next()
  } catch(err) {
    console.error(err)
    return res.status(500).json({error: err.message})
  } 
}