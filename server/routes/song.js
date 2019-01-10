let express = require('express')
let app = express()
let router = express.Router()
let Song = require('../models/song')

router.get('/search', (req, res) => {
  let { label, page } = req.query
  page = parseInt(page)
  Song.find({ $or: [
    { title: { $regex: `.*${label}.*`}},
    { album: { $regex: `.*${label}.*`}},
    { singers: { $regex: `.*${label}.*`}}
  ]},
  "-id",
  {
    skip: 10*(page-1),
    limit: 10,
  },
   (err, songs) => {
    if(err) return console.log(err)
    Song.count({ $or: [
      { title: { $regex: `.*${label}.*`}},
      { album: { $regex: `.*${label}.*`}},
      { singers: { $regex: `.*${label}.*`}}
    ]}, (err, count) => {
      if(err) return console.log(err)
      return res.json({
        all: count,
        page: page,
        songs,
      })
    })
  })
})


module.exports = router
