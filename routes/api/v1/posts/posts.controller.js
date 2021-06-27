const User = require('../../../../models/user')
const Posts = require('../../../../models/posts')
const config = require('../../../../config.js')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const crypto = require('crypto')


/* 
[GET] /api/v1/posts
{
  posts: [{
    _id: "",
    uid: "",
    title: "",
    text: "",
    created: "",
    likes: [],
    comments: []

  },...]
}
*/
exports.getPost = (req,res) => {
  const getPost = (req,res) => {
    return Posts.find().exec()
  }
  const check = (posts) => {
    if(!posts.length) return res.status(404).json({posts: null})
    else return posts
  }
  const post = (posts) => {
    return res.status(200).json({posts: posts})
  }
  try {
    console.log('/api/v1/posts called')
    getPost().then(check).then(post)
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({error: "Internal Server Error"})
  }

}

exports.createPost = (req,res) => {

  const uploadPost = () => {
    const newPost = new Posts({uid: res.locals._id, title: req.body.title, text: req.body.text, created: moment().format('YYYY-MM-DD') , likes: [], comments: [], options: []})
    return newPost.save()
  }

  const returnResult = (post) => {
    return res.status(200).json(post)
  }

  try {
    console.log('/api/v1/posts called')
    if( !req.body.title || !req.body.text) {
      return res.status(400).json({error: "Data must not be null"})
    }
    uploadPost().then(returnResult)
  } catch(err) {
    console.error(err)
    return res.status(500).json({error: "Internal Server Error"})
  }
}

exports.addLikes = (req,res) => {
  const getPost = () => {
    return Posts.findOne({_id: req.params.id}).exec()
  }
  const updatePost = (post) => {
    console.log(res.locals._id)
    console.log(post.likes)
    var arr = post.likes;
    arr.push(res.locals._id)
    return Posts.updateOne({_id: req.params.id}, { $set: { likes:arr} }).exec()
  }
  const returnResult = (post) => {
    return res.status(200).json({result: true})
  }
  try {
    getPost().then(updatePost).then(returnResult)
  } catch (err) {
    console.error(err)
    return res.status(500).json({error: "Internal Server Error"})
  }
}

exports.minusLikes = (req,res) => {
  const getPost = () => {
    return Posts.findOne({_id: req.params.id}).exec()
  }
  const updatePost = (post) => {
    console.log(res.locals._id)
    console.log(post.likes)
    var arr = post.likes;
    arr.push(res.locals._id)
    return Posts.updateOne({_id: req.params.id}, { $set: { likes:arr} }).exec()
  }
  const returnResult = (post) => {
    return res.status(200).json({result: true})
  }
  try {
    getPost().then(updatePost).then(returnResult)
  } catch (err) {
    console.error(err)
    return res.status(500).json({error: "Internal Server Error"})
  }
}

exports.addComment = (req,res) => {

}

exports.removeComment = (req,res) => {
  
}