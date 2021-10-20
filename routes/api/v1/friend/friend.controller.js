const User = require('../../../../models/user')
const Friend = require("../../../../models/Friend")
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
 *		"error": "Token Expired"
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
exports.getFriendsList = (req,res) => {
	const getList = () => {
		return Friend.findOne({uid: res.locals._id}).exec()
	}
	
	const getUserList = (listdata) => {
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
	try {
		getList().then(getUserList).then(send)
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
 *		"error": "Token Expired"
 *	}
 */

	

exports.addFriend = (req,res) => {

	let anotherUid = "";

	const getAnotherUser = () => {
		console.log(req.query.reqType)
		switch(req.query.reqType) {
			case "username":
				if(!CheckModule.isEmpty(req.query.username)) 
					return User.findOne({username: req.query.username}).exec()
				else 
					throw new Error("Data Must Not Be Null")
				break;
			case "email":
				console.log("just test pos1")
			default:
				if(!CheckModule.isEmpty(req.query.email)) 
					return User.findOne({email: req.query.email}).exec()
				else throw new Error("Data Must Not Be Null")
				break;
		}
			
	}
	const addMyList = (another) => {
		anotherUid = another._id;
		console.log("just test pos2" + anotherUid)
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
	try {
		//console.log("123"+req.query);
		console.log("!231"+req.query.email);
		
		getAnotherUser().then(addMyList).then(addAnother).then(send)
	}catch(err) {
		console.error(err)
		return res.status(500).json({error: err.message})
	}
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
 *		"error": "Token Expired"
 *	}
 */
exports.removeFriend = (req, res) => {
	let anotherUid = "";
	
	const getAnotherUser = () => {
		switch(req.query.reqType) {
			case "username":
				if(!CheckModule.isEmpty(req.query.username)) 
					return User.findOne({username: req.query.username}).exec()
				else return res.status(400).json({error: "Data must not be null"})
				break;
			case "email":
			default:
				if(!CheckModule.isEmpty(req.query.email)) 
					return User.findOne({email: req.query.email}).exec()
				else return res.status(400).json({error: "Data must not be null"})
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
	try {
		getAnotherUser().then(removeMyList).then(removeAnother).then(send)
	}catch(err) {
		console.error(err)
		return res.status(500).json({error: err.message})
	}
}