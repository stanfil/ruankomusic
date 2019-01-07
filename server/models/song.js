let mongoose = require('mongoose')
let Schema = mongoose.Schema
let SongSchema = new Schema(
  {
    mid: String,
    title: String,
    singers: Array,
    album: String,
    lyric: String,
    img_url: String,
    interval: Number,
    DAOP: Number,
    AOP: Number,
    time_public: String,
    type: String,
    downloadnum: Number,
    // comment
  }
)

module.exports = mongoose.model('Song', SongSchema)
