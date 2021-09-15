const User = require('../../../../models/user')
const Friend = require("../../../../models/Friend")
const config = require('../../../../config.js')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const crypto = require('crypto')



/**
 * @api {get} /api/v1/friend/list Request to get user's friend list
 * @apiName GetFriendList
 * @apiGroup Friend
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token user's jwt token
 * @apiSuccess {List} friends friends list
 * @apiErrorExample {json} Token Expired:
 *	HTTP/1.1 419
 *	{
 *		"error": "Token Expired"
 *	}
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 *	{
 *		"friends": [
 *			{username: "Lux"},
 * 			{username: "Ashe"},
 * 			...
 *		]
			
 *	}
 */
exports.getFriendsList = (req,res) => {
	const getList = () => {
		return Friend.findOne({uid: res.locals._id}).exec()
	}
	
	const getUserList = async (listdata) => {
		//const t = Object.values(listdata.friends.filter)
		//console.log(listdata)

		//var list = []
		
		for(const [index,value] of listdata.friends.entries()) {
			const g = await User.findOne({_id:value.uid})
			list.push({"username":g.username})
		} 
		return res.status(200).json({
			friends: list
		})
		/*
		return User.find({_id: {'$in' : listdata.friends}},{_id:0,__v:0,email:0,password:0}).exec() */
		
		
		
	} /*
	const send = (listArr) => {
		return res.status(200).json({
			friends: listArr
		})
	} */
	try {
		getList().then(getUserList)//.then(send)
	} catch(err) {
		//console.error(err)
		return res.status(500).json({error: err.message})
	}
}
/**
 * @api {post} /api/v1/friend Request to add user's friend
 * @apiName AddFriendList
 * @apiGroup Friend
 * @apiHeader {String} x-access-token user's jwt token
 * @apiBody {String} username friend's username
 * @apiVersion 1.0.0
 * @apiSuccess {Boolean} result true or false
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 * 	{
		"result": true
	}
 * @apiErrorExample {json} Token Expired:
 *	HTTP/1.1 419
 *	{
 *		"error": "Token Expired"
 *	}
 */
exports.addFriend = (req,res) => {
	const getAnotherUser = () => {
		return User.findOne({username: req.body.username}).exec()
	}
	const addMyList = (another) => {
		return Friend.updateOne({
			uid: res.locals._id
		},{
			'$addToSet': {
				friends: {
					uid: another._id
				}
			}
		})
	} 
	const addAnother = (another) => {
		return Friend.updateOne({
			uid: another._id
		},{
			'$addToSet': {
				friends: {
					uid: res.locals._id
				}
			}
		})
	}
	const send = (data) => {
		return res.status(200).json({result: true})
	}
	try {
		if(req.body.username=="") {
			return res.status(400).json({error: "Data must not be null"})
		}
		getAnotherUser().then(addMyList).then(getAnotherUser).then(addAnother).then(send)
	}catch(err) {
		console.error(err)
		return res.status(500).json({error: err.message})
	}
}
/**
 * @api {delete} /api/v1/friend Request to remove user's friend
 * @apiName RemoveFriendList
 * @apiGroup Friend
 * @apiHeader {String} x-access-token user's jwt token
 * @apiBody {String} username friend's username
 * @apiSuccess {Boolean} result true or false
 * @apiVersion 1.0.0
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 * 	{
		"result": true
	}
 * @apiErrorExample {json} Token Expired:
 *	HTTP/1.1 419
 *	{
 *		"error": "Token Expired"
 *	}
 */
exports.removeFriend = (req, res) => {
	const getAnotherUser = () => {
		return User.findOne({username: req.body.username}).exec()
	}
	const addMyList = (another) => {
		return Friend.updateOne({
			uid: res.locals._id
		},{
			'$pull': {
				friends: {
					uid: another._id
				}
			}
		})
	} 
	const addAnother = (another) => {
		return Friend.updateOne({
			uid: another._id
		},{
			'$pull': {
				friends: {
					uid: res.locals._id
				}
			}
		})
	}
	const send = (data) => {
		return res.status(200).json({result: true})
	}
	try {
		if(req.body.username=="") {
			return res.status(400).json({error: "Data must not be null"})
		}
		getAnotherUser().then(addMyList).then(getAnotherUser).then(addAnother).then(send)
	}catch(err) {
		console.error(err)
		return res.status(500).json({error: err.message})
	}
}