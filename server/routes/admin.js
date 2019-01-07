let express = require('express')
let app = express()
let router = express.Router()
let Admin = require('../models/admin')

router.post('/signup', (req, res) => {
  let admin = new Admin()
  admin.username = req.body.username
  admin.password = req.body.password
  admin.online = false
  console.log(req.body.username, req.body.password)
  admin.save(err => {
    if(err) {
      return console.log(err)
    }
    return res.json({
      isSuccess: 0
    })
  })
})

router.post('/login', (req, res) => {
  let {username, password} = req.body
  console.log(req.body.username, req.body.password)
  Admin.findOne({username, password}, (err, admin) => {
    if(err) return console.log(err)
    // console.log('找到用户为：',admin)
    if(!admin) {
      return res.status(403).json({error: "账号或密码错误"})
    }
    admin.online = true
    admin.save( err => {
      if(err) return console.log(err)
      return res.json({
        message: "login success",
        user: username
      })
    })
  })
})

router.get('/logout', (req, res) => {
  let { username } = req.query
  console.log('logout:', username)
  Admin.findOne({username}, (err, admin) => {
    if(err) return console.log(err)
    if(!admin) {
      return res.status(403).json({error: '管理员不存在'})
    }
    admin.online = false
    admin.save( err => {
      if(err) return console.log(err)
      return res.send('logout success')
    })
  })

})


module.exports = router
