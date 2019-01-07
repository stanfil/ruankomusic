let express = require('express')
let app = express()
let router = express.Router()
let Song = require('../models/song')
let fs = require('fs')
let multer = require('multer')

// const checkAdmin = (username) => {
//   Admin.findOne({username}, (err, admin) => {
//     if(err) return console.log(err)
//     if(!admin || !admin.online) return false
//     return true
//   })
// }

router.post('/deleteSong', (req, res) => {
  const { mid } = req.body
  Song.deleteOne({mid}, (err) => {
    if(err) return console.log(err)
    fs.rename(`E:\\Songs\\${mid}.m4a`, `E:\\deletedSongs\\${mid}.m4a`, (err) => {
      if(err) return console.log(err)
    })
    return res.send("删除成功")
  })
})

router.post('/addSong', (req, res) => {
  let song = new Song({
    ...(req.body),
    DAOP: 0,
    AOP: 0,
    downloadnum: 0
  })
  song.save(err => {
    if(err) return console.log(err)
    return res.send("添加成功")
  })
})


router.post('/addMusicFile', multer({ dest: 'tmp/'}).single('music'), (req, res) => {
  let des_file = `E:\\Songs\\${req.file.originalname}`
  fs.readFile(req.file.path, (err, data) => {
    if(err) throw err
    fs.writeFile(des_file, data, (err) => {
      if(err) throw err
      res.send("歌曲文件上传成功")
    })
    fs.unlink(req.file.path, (err) => {
      if(err) throw err
    })
  })
})



router.post('/updateSong', (req, res) => {
  Song.findOne({mid: req.body.mid}, (err, song) => {
    if(err) return console.log(err)
    if(!song) {
      return res.status(403).send("歌曲不存在")
    }
    song.title = req.body.title
    song.album = req.body.album
    song.singers = req.body.singers
    song.interval = req.body.interval
    song.time_public = req.body.time_public
    song.type = req.body.type
    song.lyric = req.body.lyric
    song.img_url = req.body.img_url
    song.save(err => {
      if(err) return console.log(err)
      return res.send("修改成功")
    })
  })
})


module.exports = router
