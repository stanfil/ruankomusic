let express = require('express')
let app = express()
let router = express.Router()
let Song = require('../models/song')
let List = require('../models/list')
router.get('/search', (req, res) => {
  let { label, page } = req.query
  page = parseInt(page)
  Song.find({ $or: [
    { title: { $regex: `.*${label}.*`}},
    { album: { $regex: `.*${label}.*`}},
    { singers: { $regex: `.*${label}.*`}}
  ]},
  "-id -lyric",
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

router.get('/bytype', (req, res) => {
  let { type, page } = req.query
  type = (type==='RandB')?'R&B':type
  type = (type==='Rap')?' Rap/Hip Hop':type
  page = parseInt(page)
  Song.find({type},
  "-id -lyric",
  {
    sort: {
      time_public: -1
    },
    skip: 10*(page-1),
    limit: 10,
  },
   (err, songs) => {
    if(err) return console.log(err)
    Song.count({type}, (err, count) => {
      if(err) return console.log(err)
      return res.json({
        all: (count>50?50:count),
        page: page,
        songs,
      })
    })
  })
})

router.get('/boardnew', (req, res)=> {
  Song.find({},"-id -lyric",{
    sort: {
      time_public: -1,
    },
    limit: 20
  },
  (err, songs) => {
    if(err) return console.log(err)
    return res.json(songs)
  })
})

router.get('/boardhot', (req, res)=> {
  Song.find({},"-id -lyric",{
    sort: {
      AOP: -1,
    },
    limit: 20
  },
  (err, songs) => {
    if(err) return console.log(err)
    return res.json(songs)
  })
})

router.get('/boardup', (req, res)=> {
  Song.find({},"-id -lyric",{
    sort: {
      DAOP: -1,
    },
    limit: 20
  },
  (err, songs) => {
    if(err) return console.log(err)
    return res.json(songs)
  })
})

router.post('/collect', (req, res) => {
  let {mid, _id} = req.body
  List.findOne({_id}, (err, list) => {
    if(err) return console.log(err)
    if(!list) return console.log('歌单不存在');
    Song.findOne({mid}, (err, song) => {
      if(err) return console.log(err)
      if(!song) return console.log('歌曲不存在');
      list.songs.push(mid)
      list.img_url = song.img_url
      list.save(err => {
        if(err) return console.log(err)
        return res.send('收藏成功')
      })
    })
  })
})
module.exports = router
