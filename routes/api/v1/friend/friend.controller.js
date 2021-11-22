const User = require('../../../../models/user')
const Friend = require("../../../../models/Friend")
const Profile = require('../../../../models/Profile')
const CheckModule = require('../../../../module/check.js')
const errorMiddleware = require("../../../../middlewares/error")
const config = require('../../../../config.js')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const crypto = require('crypto')



/**
 * @api {get} /api/v1/friend/list 사용자의 친구 목록 가져오기
 * @apiName GetFriendList
 * @apiGroup 친구
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자의 토큰
 * @apiQuery {String} resType 반환타입 지정: email 또는 username
 * @apiSuccess {List} friends 친구리스트
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공, username 반환타입:
 *	HTTP/1.1 200 OK
 *	{
 *		friends: [
 *			{username: "Lux"},
 * 			{username: "Ashe"},
 * 			...
 *		]
			
 *	}
 * @apiSuccessExample {json} 성공, email 반환타입:
 *	HTTP/1.1 200 OK
 *	{
 *		friends: [
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
		getList().then(getUserList).then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
	
}
/**
 * @api {get} /api/v1/friend/roomList 사용자의 룸 전용 친구 목록 가져오기
 * @apiName GetFriendListRoom
 * @apiGroup 친구
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자의 토큰
 * @apiSuccess {List} users 친구들의 이메일 및 이름 리스트
 * @apiSuccess {List} profiles 친구들의 프로필 사진의 고유값 리슽트
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
 *		users: [
 *	 		{email: "someone@example.com", username: "Ashe"},
 *  	],
 * 		profiles: [
 * 			{_id: "profileUid1"},
 * 		]
 *	}
 */
exports.getFriendListRoom = (req,res,next) => {
	let frList;
	let proList;
	const getList = () => {
		return Friend.findOne({uid: res.locals._id}).exec()
	}
	const getProfileList = (listdata) => {
		frList = listdata.friends
		return Profile.find({uid: {'$in' : frList}},{_id: 1}).sort({uid:1}).exec()
	}
	const getUserList = (listdata) => {
		proList = listdata

		return User.find({_id: {'$in' : frList}},{_id:0,email:1, username:1}).sort({_id:1}).exec()
		
	}

	const send = (user) => {
		return res.status(200).json({
			users: user,
			profiles: proList
		})
	}
	try {
		getList().then(getProfileList).then(getUserList).then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}





/**
 * @api {post} /api/v1/friend 친구추가
 * @apiName AddFriendList
 * @apiGroup 친구
 * @apiHeader {String} x-access-token 사용자의 토큰
 * @apiQuery {String} reqType 요청타입 email 또는 username
 * @apiQuery {String} username (옵션) 요청타입이 username인 경우 추가할 상대의 닉네임 
 * @apiQuery {String} email (옵션) 요청타입이 email인 경우 추가할 상대의 이메일
 * @apiVersion 1.0.0
 * @apiSuccess {Boolean} result 결과 true 또는 false
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 * 	{
		"result": true
	}
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 */

	

exports.addFriend = (req,res) => {

	let anotherUid = "";

	const getAnotherUser = () => {
		switch(req.query.reqType) {
			case "username":
				if(!CheckModule.isEmpty(req.query.username)) 
					return User.findOne({username: req.query.username}).exec()
				else {
					res.status(400)
					throw new Error("1")
				}
					
				break;
			case "email":
			default:
				if(!CheckModule.isEmpty(req.query.email)) 
					return User.findOne({email: req.query.email}).exec()
				else {
					res.status(400)
					throw new Error("1")
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
	try {
		getAnotherUser().then(addMyList).then(addAnother).then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
	
}
/**
 * @api {patch} /api/v1/friend 친구삭제
 * @apiName RemoveFriendList
 * @apiGroup 친구
 * @apiHeader {String} x-access-token 사용자의 토큰
 * @apiQuery {String} reqType 요청타입 email 또는 username
 * @apiQuery {String} username (옵션) 요청타입이 username인 경우 추가할 상대의 닉네임 
 * @apiQuery {String} email (옵션) 요청타입이 email인 경우 추가할 상대의 이메일
 * @apiVersion 1.0.0
 * @apiSuccess {Boolean} result 결과 true 또는 false
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 * 	{
		"result": true
	}
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 */
exports.removeFriend = (req,res,next) => {
	var anotherUid = "";
	
	const getAnotherUser = () => {
		switch(req.query.reqType) {
			case "username":
				if(!CheckModule.isEmpty(req.query.username)) 
					return User.findOne({username: req.query.username}).exec()
				else {
					res.status(400)
					throw new Error("1")
				}
				break;
			case "email":
			default:
				if(!CheckModule.isEmpty(req.query.email)) 
					return User.findOne({email: req.query.email}).exec()
				else {
					res.status(400)
					throw new Error("1")
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
		}).exec()
	} 
	const removeAnother = (another) => {
		return Friend.updateOne({
			uid: anotherUid
		},{
			'$pull': {
				friends: res.locals._id
			}
		}).exec()
	}
	const send = (data) => {
		return res.status(200).json({result: true})
	}
	
	try {
		getAnotherUser().then(removeMyList).then(removeAnother).then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
	
}

/**
 * @api {get} /api/v1/friend/check 친구여부 확인
 * @apiName GetIsFriend
 * @apiGroup 친구
 * @apiHeader {String} x-access-token 사용자의 토큰
 * @apiQuery {String} reqType 요청타입 email 또는 username
 * @apiQuery {String} username (옵션) 요청타입이 username인 경우 추가할 상대의 닉네임 
 * @apiQuery {String} email (옵션) 요청타입이 email인 경우 추가할 상대의 이메일
 * @apiVersion 1.0.0
 * @apiSuccess {Boolean} result 결과 true 또는 false
 * @apiSuccessExample {json} Success:
 *	HTTP/1.1 200 OK
 * 	{
		"result": true
	}
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
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
	try {
		getAnotherUser().then(findFriend).then(isContain).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
}