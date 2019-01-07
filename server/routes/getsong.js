let express = require('express')
let app = express()
let router = express.Router()
let Song = require('../models/song')

router.get('/getSong', (req, res) => {
  let { label } = req.query
  Song.find({ $or: [
    { title: { $regex: `.*${label}.*`}},
    { album: { $regex: `.*${label}.*`}},
    { singers: { $regex: `.*${label}.*`}}
  ]},"-id -lyric", (err, songs) => {
    if(err) return console.log(err)
    return res.json({
      isSuccess: true,
      songs
    })
  })
})

module.exports = router
