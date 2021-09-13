const User = require('../../../../models/user')
const Posts = require('../../../../models/posts')
const Exercise = require("../../../../models/Exercise")
const config = require('../../../../config.js')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const crypto = require('crypto')


/**
 * @api {get} /api/v1/exercise Request to get today exercise data
 * @apiName GetTodayExercise
 * @apiGroup Exercise
 * @apiHeader {String} x-access-token user's jwt token
 * @apiSuccess {Exercise} exerciseHistory user's today exercise
 * @apiErrorExample {json} Not Found email:
 *	HTTP/1.1 500 Internal Server Error
 *	{ 
 * 		error: "something error msg" 
 *	}
 * @apiErrorExample {json} Token Expired:
 *	HTTP/1.1 419
 *	{
 *		"error": "Token Expired"
 * 	}
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 *	{
		"calorie":10
		"km":0.045,
		"time": 4312,
		"date":"2021-09-13"	
 *	}
 */
exports.getExerciseData = (req, res) => { //today
  const getData = () => {
	const currentTime = new Date()
	const currentTimeToStr = currentTime.getFullYear() +'-' + (currentTime.getMonth()+1) +'-'+ currentTime.getDate();
    return Exercise.findOne({uid:res.locals._id, date: currentTimeToStr})
  }
  const send = (data) => {
	if(data!= null) {
		const d = {
			"calorie": data.calorie,
			"km": data.km,
			"time": data.time,
			"date": data.date
		}
		res.status(200).json(d)
	}
    else {
		const exercise = new Exercise({uid: newUser._id, calorie: 0, km :0,time:0, date: currentTimeToStr})
		exercise.save()
		const d = {
			"calorie": 0,
			"km": 0,
			"time":0,
			"date":currentTimeToStr
		}
		res.status(200).json(d)	
	}
  }
 
  try {
    getData().then(send)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }

}
/**
 * @api {patch} /api/v1/exercise Request to update User's Exercise data
 * @apiName UpdateTodayExercise
 * @apiGroup Exercise
 * @apiHeader {String} x-access-token user's jwt token
 * @apiBody {Number} calorie user's today exercise: calorie
 * @apiBody {Number} km user's today exercise: running km
 * @apiBody {Number} time user's today exercise: time (second)
 * @apiSuccess {String} date user's today exercise
 * @apiSuccess {Number} calorie user's today exercise: calorie
 * @apiSuccess {Number} km user's today exercise: running km
 * @apiSuccess {Number} time user's today exercise: time (second)
 * @apiErrorExample {json} Not Found email:
 *	HTTP/1.1 500 Internal Server Error
 * 	{ 
 *		error: "something error msg" 
 *	}
 * @apiErrorExample {json} Token Expired:
 *	HTTP/1.1 419
 * 	{
 *		"error": "Token Expired"
 *	}
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 *	{
		"calorie":10
		"km":0.045,
		"time": 4312,
		"date":"2021-09-13"	
 *	}
 */
exports.updateExerciseData = (req,res) => {
	const currentTime = new Date()
	const currentTimeToStr = currentTime.getFullYear() +'-' + (currentTime.getMonth()+1) +'-'+ currentTime.getDate();
	const {calorie, km, time} = req.body;
	const update = () => {
		
		//console.log(currentTimeToStr)
		/*const q = Exercise.updateOne({uid: res.locals._id, date:currentTimeToStr},{$inc: {calorie:c, km:k, time:t}, $set: {uid: res.locals._id, date:currentTimeToStr}},{upsert: true})
		return Exercise.find({uid: res.locals._id, date:currentTimeToStr}).exec() */
		return Exercise.findOne({uid: res.locals._id, date:currentTimeToStr}).exec()
		//console.log(tt)
		
		
		
	}

	const check = (ck) => {
		console.log(ck==null?1:2)
		if(ck==null) {
			//parseInt(calorie),parseFloat(km),parseInt(time)
			const e = new Exercise({uid: res.locals._id, date:currentTimeToStr, calorie: parseInt(calorie), km :parseFloat(km),time:parseInt(time)})
			return e.save()
			//return Exercise.findOne({uid: res.locals._id, date:currentTimeToStr}).exec()
		} else {
			return Exercise.update({uid: res.locals._id, date:currentTimeToStr},{"$inc": {'calorie':parseInt(calorie), 'km':parseFloat(km), 'time':parseInt(time)}}).exec()
			
		}
	}
	const tct = (exx) => {
		return Exercise.findOne({uid: res.locals._id, date:currentTimeToStr})
	}

	const send = (ex) => {
		console.log(ex)
		const d = {
			"calorie": ex.calorie,
			"km": ex.km,
			"time": ex.time,
			"date": ex.date
		}
		return res.status(200).json(d)
	}

	try{
		console.log(calorie, km,time)
		update().then(check).then(tct).then(send)
	} catch(err) {
		console.error(err)
    	return res.status(500).json({ error: err.message })
	}
}
