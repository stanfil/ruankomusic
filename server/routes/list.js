let express = require('express')
let app = express()
let mongoose = require('mongoose')
let router = express.Router()
let User = require('../models/user')
let List = require('../models/list')
let Song = require('../models/song')

router.post('/createlist', (req, res) => {
  let {title, creator, creatorem, disc} = req.body
  let list = new List({
    title,
    creator,
    creatorem,
    collectnum: 0,
    songs: [],
    disc,
    img_url: '',
  })
  list.save((err, list) => {
    if(err) return console.log(err)
    User.findOne({email: creatorem}, (err, user ) => {
      if(err) return console.log(err)
      if(!user) return ret.status(403).send('用户不存在')
      user.createSLs = [...(user.createSLs), list._id]
      user.save((err, user) => {
        if(err) return console.log(err)
        return res.json({
          ret_code: 0,
          createSLs: user.createSLs
        })
      })
    })
  })
})

router.get('/getlist', (req, res) => {
  let page = parseInt(req.query.page)
  List.find().sort({collectnum: -1}).skip(10*(page-1)).limit(10).exec((err, lists) => {
    if(err) return console.log(err)
    List.count((err, count)=>{
      if(err) return console.log(err)
      return res.json({
        all: count,
        page,
        lists
      })
    })
  })
})

router.get('/onelist', (req, res) => {
  let _id = req.query._id
  List.findOne({_id}, (err, list)=> {
    if(err) return console.log(err)
    let all = list.songs.map((item)=>({
      mid: item
    }))
    if(all.length===0){
      return res.json(list)
    }
    Song.find({$or: all},"-id -lyric", (err, songs)=> {
      if(err) return console.log(err)
      // console.log(list)

      return res.json({
        ...(list._doc),
        songs
      })
    })
  })
})

router.post('/updatelist', (req, res) => {
  let { _id, title, disc } = req.body
  List.findOne({_id}, (err, list) => {
    if(err) return console.log(err)
    list.title = title,
    list.disc = disc
    list.save( err => {
      if(err) return console.log(err)
      return res.send('修改成功')
    })
  })
})

router.post('/deletelist', (req, res)=>{
  let { email, _id } = req.body
  List.deleteOne({_id}, err => {
    if(err) return console.log(err)
  })
  User.findOne({email}, (err, user) => {
     if(err) return console.log(err)
     user.createSLs = user.createSLs.filter((list) => (list!==_id))
     user.save(err => {
       if(err) return console.log(err)
       return res.send("删除成功")
     })
   })
})

router.get("/likelist", (req, res)=> {
  let email = req.query.email
  User.findOne({email},(err, user)=> {
    if(err) return console.log(err)
    if(!user) return console.log(err)
    let _id = mongoose.Types.ObjectId(user.likeSL)
    console.log(_id)
    List.findOne({_id},(err, list) => {
      if(err) return console.log(err)
      // console.log(list.songs)
      let all = list.songs.map((item)=>({
        mid: item
      }))
      if(all.length===0){
        return res.json([])
      }
      Song.find({$or: all}, (err, songs)=> {
        if(err) return console.log(err)
        return res.json(songs)
      })
    })
  })
})

router.get('/collectlists', (req, res) => {
  let email = req.query.email
  User.findOne({email}, (err, user) => {
    if(err) return console.log(err)
    if(!user) return console.log(err)
    let all = user.collectSLs.map(item => ({
      _id: item
    }))
    if(all.length===0){
      return res.json([])
    }
    List.find({$or: all}, (err, lists)=> {
      if(err) return console.log(err)
      return res.json(lists)
    })
  })
})

router.get('/createlists', (req, res) => {
  let email = req.query.email
  User.findOne({email}, (err, user) => {
    if(err) return console.log(err)
    if(!user) return console.log(err)
    let all = user.createSLs.map(item => ({
      _id: item
    }))
    if(all.length===0){
      return res.json([])
    }
    List.find({$or: all}, (err, lists)=> {
      if(err) return console.log(err)
      return res.json(lists)
    })
  })
})

router.post("/playlist", (req, res)=>{
  let playlist = req.body.playlist
  let all = playlist.map(item => ({
    mid: item
  }))
  if(all.length===0){
    return res.json([])
  }
  Song.find({$or: all}, (err, songs)=> {
    if(err) return console.log(err)
    return res.json(songs)
  })
})


module.exports = router
