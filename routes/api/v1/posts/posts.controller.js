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
    likes: []

  },...]
}
*/
exports.getPost = (req, res) => {
  const getPost = (req, res) => {
    return Posts.find().exec()
  }
  const check = (posts) => {
    if (!posts.length) return res.status(404).json({ posts: null })
    else return posts
  }
  const post = (posts) => {
    return res.status(200).json({ posts: posts })
  }
  try {
    getPost().then(check).then(post)
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ error: err.message })
  }

}

exports.createPost = (req, res) => {

  const uploadPost = () => {
    const newPost = new Posts({ uid: res.locals._id, title: req.body.title, text: req.body.text, created: moment().format('YYYY-MM-DD'), likes: [], options: [] })
    return newPost.save()
  }

  const returnResult = (post) => {
    return res.status(200).json(post)
  }

  try {
    if (!req.body.title || !req.body.text) {
      return res.status(400).json({ error: "Data must not be null" })
    }
    uploadPost().then(returnResult)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}

exports.deletePost = (req, res) => {
  const getPost = (postid) => {
    return Posts.findOne({ _id: postid }).exec()
  }
  const checkAndDelete = (p) => {
    if (p.uid == res.locals._id) {
      return Posts.deleteOne({ _id: p._id }).exec()
    } else {
      return res.status(400).json({ error: "Not post's writer" })
    }
  }

  const sendRes = (d) => {
    if (d) {
      return res.status(200).json({ result: true })
    }
  }

  try {
    getPost(req.params.id).then(checkAndDelete).then(sendRes)
  } catch (err) {
    console.error(err)
    returnres.status(500).json({ error: err.message })
  }

}





exports.addLikes = (req, res) => {
  const getPost = () => {
    return Posts.findOne({ _id: req.params.id }).exec()
  }
  const updatePost = (post) => {
    var arr = post.likes;
    arr.push(res.locals._id)
    return Posts.updateOne({ _id: req.params.id }, { $set: { likes: arr } }).exec()
  }
  const returnResult = (post) => {
    return res.status(200).json({ result: true })
  }
  try {
    getPost().then(updatePost).then(returnResult)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}

exports.minusLikes = (req, res) => {
  const getPost = () => {
    return Posts.findOne({ _id: req.params.id }).exec()
  }
  const updatePost = (post) => {
    var arr = post.likes;
    var arr1 = arr.filter((el) => el != res.locals._id)
    return Posts.updateOne({ _id: req.params.id }, { $set: { likes: arr1 } }).exec()
  }
  const returnResult = (post) => {
    return res.status(200).json({ result: true })
  }
  try {
    getPost().then(updatePost).then(returnResult)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}

exports.getComment = (req, res) => {

}

exports.addComment = (req, res) => { // db따로
  //const   
}

exports.removeComment = (req, res) => {

}

