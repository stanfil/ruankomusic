let express = require('express')
let app = express()
let router = express.Router()
let User = require('../models/user')
let List = require('../models/list')

router.post('/createlist', (req, res) => {
  let {title, creator, creatorem, disc} = req.body
  let list = new List({
    title,
    creator,
    creatorem,
    collectnum: 0,
    songs: [],
    disc
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

module.exports = router
