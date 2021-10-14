const ExerciseImg = require('../../../../models/ExerciseImg')
const Profile = require('../../../../models/Profile')
const CheckModule = require('../../../../module/check')
 
exports.sendImg = (req,res) => {
	const typeToSendImg = () => {
		switch(req.query.reqType) {
			case "profile":
				if(!CheckModule.isEmpty(req.query.id))
					return Profile.findOne({_id: req.query.id}).exec()
				else return res.status(400).json({error: "Data must not be null"})
				break;
			case "exercise":
				if(!CheckModule.isEmpty(req.query.id))
					return ExerciseImg.findOne({_id: req.query.id}).exec()
				else return res.status(400).json({error: "Data must not be null"})
				break;
			default:
				return res.status(400).json({error: "Data must not be null"})
				break;
		}
	}

	const bufToImg = (data) => {
		//console.log(data)
		return res.header('Content-Type','image/jpeg').status(200).send(data.img)

	}

	try {
		typeToSendImg().then(bufToImg)
	} catch(err) {
		console.error(err)
		return res.status(500).json({error: err.message})
	}
} 