const ExerciseImg = require('../../../../models/ExerciseImg')
const Profile = require('../../../../models/Profile')
const CheckModule = require('../../../../module/check')
 
exports.sendImg = (req,res) => {
	const typeToSendImg = () => {
		switch(req.query.reqType) {
			case "profile":
				if(!CheckModule.isEmpty(req.query.id))
					return Profile.findOne({_id: req.query.id}).exec()
				else {
					res.status(400)
					throw new Error("1")
				}
				break;
			case "exercise":
				if(!CheckModule.isEmpty(req.query.id))
					return ExerciseImg.findOne({_id: req.query.id}).exec()
				else {
					res.status(400)
					throw new Error("1")
				}
				break;
			default:
				res.status(400)
				throw new Error("1")
				break;
		}
	}

	const bufToImg = (data) => {
		//console.log(data)
		return res.header('Content-Type','image/jpeg').status(200).send(data.img)

	}
	typeToSendImg().then(bufToImg)
	
} 