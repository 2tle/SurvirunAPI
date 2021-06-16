const User = require('../../../../models/user')
/* 
[GET] /api/v1/auth/{username}/exists
{
  exists: true
}
유저가 존재하면 200코드 및 true 반환,
존재하지 않으면 404코드 및 false 반환
*/

exports.usernameExists = (req,res) => {
  const username = req.params.username
  try {
    if(!username) return res.status(400).json({error: "username must not be null"})
    let user = User.findOne({username})
    if(!user) return res.status(404).json({exists: false})
    else return res.status(200).json({exists: true})
  } catch(err) {
    console.error(err.message)
    return res.status(500).json({error: "Internal Server Error"})
  }
}