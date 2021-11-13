const User = require('../../../../models/user')
const Friend = require("../../../../models/Friend")
const Profile = require('../../../../models/Profile')
const CheckModule = require('../../../../module/check.js')
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
 * @apiQuery {String} resType responseType: email or username, default is email
 * @apiSuccess {List} friends friends list
 * @apiErrorExample {json} Token Expired:
 *	HTTP/1.1 419
 *	{
	 	"code": 5,
 *		"message": "Token Expired"
 *	}
 * @apiSuccessExample {json} Success, resType is username:
 *	HTTP/1.1 200 OK
 *	{
 *		"friends": [
 *			{username: "Lux"},
 * 			{username: "Ashe"},
 * 			...
 *		]
			
 *	}
 * @apiSuccessExample {json} Success, resType is email:
 *	HTTP/1.1 200 OK
 *	{
 *		"friends": [
 *			{email: "java@isnotgood.com"},
 * 			{email: "kotlin@isbest.io"},
 * 			...
 *		]
			
 *	}
 */
exports.getFriendsList = (req,res,next) => {
	const getList = () => {
		return Friend.findOne({uid: res.locals._id}).exec()
	}
	
	const getUserList = (listdata) => {
		//console.log(req)
		switch(req.query.resType) {
			case "username":
				return User.find({_id: {'$in' : listdata.friends}},{_id:0,__v:0,email:0,password:0}).exec()
				break;
			case "email":
			default:
				return User.find({_id: {'$in' : listdata.friends}},{_id:0,__v:0,username:0,password:0}).exec()
				break;

		}
	}
	const send = (listArr) => {
		return res.status(200).json({
			friends: listArr
		})
	}
	
	getList().then(getUserList).then(send)
	
}

exports.getFriendListRoom = (req,res,next) => {
	let frList;
	let proList;
	const getList = () => {
		return Friend.findOne({uid: res.locals._id}).exec()
	}
	const getProfileList = (listdata) => {
		frList = listdata.friends
		return Profile.find({uid: {'$in' : frList}},{_id: 1}).exec()
	}
	const getUserList = (listdata) => {
		proList = listdata

		return User.find({_id: {'$in' : frList}},{_id:0,email:1, username:1}).exec()
		
	}

	const send = (user) => {
		return res.status(200).json({
			users: user,
			profiles: proList
		})
	}

	getList().then(getProfileList).then(getUserList).then(send)

	

}





/**
 * @api {post} /api/v1/friend Request to add user's friend
 * @apiName AddFriendList
 * @apiGroup Friend
 * @apiHeader {String} x-access-token user's jwt token
 * @apiQuery {String} reqType email or username
 * @apiQuery {String} username if you want to add friend as friend's username
 * @apiQuery {String} email if you want to add friend as friend's email
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
	 	"code" : 5,
 *		"message": "Token Expired"
 *	}
 */

	

exports.addFriend = (req,res) => {

	let anotherUid = "";

	const getAnotherUser = () => {
		//console.log(req.query.reqType)
		switch(req.query.reqType) {
			case "username":
				if(!CheckModule.isEmpty(req.query.username)) 
					return User.findOne({username: req.query.username}).exec()
				else {
					res.status(400)
					throw new Error("Data Must Not Be Null")
				}
					
				break;
			case "email":
			default:
				if(!CheckModule.isEmpty(req.query.email)) 
					return User.findOne({email: req.query.email}).exec()
				else {
					res.status(400)
					throw new Error("Data Must Not Be Null")
				}
				break;
		}
			
	}
	const addMyList = (another) => {
		anotherUid = another._id;
		return Friend.updateOne({
			uid: res.locals._id
		},{
			'$addToSet': {
				friends:anotherUid
			}
		}).exec()
	} 
	const addAnother = (another) => {
		return Friend.updateOne({
			uid: anotherUid
		},{
			'$addToSet': {
				friends: res.locals._id
			}
		}).exec()
	}
	const send = (data) => {
		return res.status(200).json({result: true})
	}
	getAnotherUser().then(addMyList).then(addAnother).then(send)
	
}
/**
 * @api {patch} /api/v1/friend Request to remove user's friend
 * @apiName RemoveFriendList
 * @apiGroup Friend
 * @apiHeader {String} x-access-token user's jwt token
 * @apiQuery {String} reqType email or username
 * @apiQuery {String} username if you want to add friend as friend's username
 * @apiQuery {String} email if you want to add friend as friend's email
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
	 	"code": 5
 *		"message": "Token Expired"
 *	}
 */
exports.removeFriend = (req,res,next) => {
	let anotherUid = "";
	
	const getAnotherUser = () => {
		switch(req.query.reqType) {
			case "username":
				if(!CheckModule.isEmpty(req.query.username)) 
					return User.findOne({username: req.query.username}).exec()
				else {
					res.status(400)
					throw new Error("Data Must Not Be Null")
				}
				break;
			case "email":
			default:
				if(!CheckModule.isEmpty(req.query.email)) 
					return User.findOne({email: req.query.email}).exec()
				else {
					res.status(400)
					throw new Error("Data Must Not Be Null")
				}
				break;
		}
	}
	const removeMyList = (another) => {
		anotherUid = another._id;
		return Friend.updateOne({
			uid: res.locals._id
		},{
			'$pull': {
				friends: anotherUid
				
			}
		})
	} 
	const removeAnother = (another) => {
		return Friend.updateOne({
			uid: anotherUid
		},{
			'$pull': {
				friends: res.locals._id
			}
		})
	}
	const send = (data) => {
		return res.status(200).json({result: true})
	}
	
	getAnotherUser().then(removeMyList).then(removeAnother).then(send)
	
}

/**
 * @api {get} /api/v1/friend/check Request to check isFriend?
 * @apiName GetIsFriend
 * @apiGroup Friend
 * @apiHeader {String} x-access-token user's jwt token
 * @apiQuery {String} reqType email or username
 * @apiQuery {String} username if you want to add friend as friend's username
 * @apiQuery {String} email if you want to add friend as friend's email
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
exports.isFriend = (req,res,next) => {
	const getAnotherUser = () => {
		switch(req.query.reqType) {
			case "username":
				if(CheckModule.isEmpty(req.query.username)) {
					res.status(400)
					throw new Error("1")
				} else {
					return User.findOne({username: req.query.username}).exec()
				}
				break;
			case "email":
			default:
				if(CheckModule.isEmpty(req.query.email)) {
					res.status(400)
					throw new Error("1")
				} else {
					return User.findOne({email: req.query.email}).exec()
				}
				break;
		}
	}

	const findFriend = (user) => {
		if(!user) {
			res.status(400)
			throw new Error("2")
		}
		else return Friend.findOne({uid: user._id})
	}

	const isContain = (friend) => {
		if(res.locals._id in friend.friends) {
			return res.status(200).json({
				result: true
			})
		}
		else {
			return res.status(200).json({
				result: false
			})
		}
	}

	getAnotherUser().then(findFriend).then(isContain)
}