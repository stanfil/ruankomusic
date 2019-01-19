let express = require('express')
let app = express()
let router = express.Router()
let User = require('../models/user')
let List = require('../models/list')

router.post('/signup', (req, res) => {
  let { email, password, nickname } = req.body
  let list = new List({
    title: `${nickname}喜欢的歌曲`,
    creator: nickname,
    creatorem: email,
    collectnum: 0,
    songs: [],
    disc: `快来看看 ${nickname} 喜欢哪些歌曲吧~`,
    img_url: '',
  })
  list.save((err, list) => {
    if(err) {
      return console.log(err)
    }
    let user = new User({
      nickname,
      email,
      password,
      likeSL: list._id,
      collectSLs: [],
      createSLs: [],
    })
    user.save((err, list) => {
      if(err) return console.log(err)
      return res.send("注册成功")
    })
  })
})

router.get('/emexist', (req, res) => {
  let email = req.query.email
  User.findOne({email}, (err, user) => {
    if(err) return console.log(err)
    if(!user) return res.json({
      emexist: false
    })
    return res.json({
      emexist: true
    })
  })
})

router.post('/login', (req, res) => {
  let { email, password } = req.body
  User.findOne({email, password}, (err, user) => {
    if(err) return console.log(err)
    if(!user) {
      return res.status(403).send('邮箱或密码不正确')
    }
    return res.json({
      message:'登录成功',
      user:{
        email:user.email,
        nickname: user.nickname
      }
    })
  })
})

router.post('/changeinfo', (req, res) => {
  let { email, nickname, password } = req.body
  User.findOne({email}, (err, user) => {
    if(err) return console.log(err)
    if(!user) return res.status(403).send('用户不存在')
    user.nickname = nickname
    if(password!==''){
      user.password = password
    }
    user.save(err => {
      if(err) return console.log(err)
      return res.send('修改成功')
    })
  })
})

router.post('/likesong', (req, res)=> {
  let {email, mid} = req.body
  User.findOne({email}, (err, user)=>{
    if(err) return console.log(err)
    List.findOne({_id: user.likeSL}, (err, list)=>{
      if(err) console.log(err)
      list.songs.push(mid)
      list.save(err => {
        if(err) return console.log(err)
        return res.send("成功添加喜欢歌曲")
      })
    })
  })
})

router.post('/collectlist', (req, res)=>{
  let {email, _id} = req.body
  User.findOne({email}, (err, user)=>{
    if(err) return console.log(err)
    user.collectSLs.push(_id)
    user.save((err, user)=>{
      if(err) return console.log(err)
      return res.send("成功收藏歌单")
    })
  })
})

router.get('/getcreatelists', (req, res)=> {
  let {email}= req.query
  User.findOne({email},(err, user)=>{
      if(err) return console.log(err)
      if(!user) return res.json([])
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
module.exports = router
