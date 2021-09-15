const httpStatus = require('http-status-codes');
 
exports.pageNotFoundError = (req, res) => {
	console.log(req.method,req.originalUrl)
    return res.status(404).json({error: 'API not Found'});
}

exports.respondInternalError = (errors, req, res, next) => {
	console.log(req.method,req.originalUrl)
	console.log(errors.stack)
    return res.status(500).json({error: errors.stack})
};