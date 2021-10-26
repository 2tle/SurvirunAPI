const errorValue = {
	0: "OtherError",
	1: "Parameter must not be null",
	2: "User is not found",
	3: "Payload too large",
	4: "Did not set profile image yet",	
	5: "Token Expired",
	6: "Not Logged In",
	7: "Invaild Token"
	
}


exports.errorHandler = (err, req,res,next) => {
	console.error(err)
	if(!res.statusCode) return res.status(500).json({
		code: 0,
		message: err.message
	})
	else return res.json({
		code: parseInt(err.message),
		message: errorValue[err.message]
	})
}
