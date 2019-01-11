let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ListSchema = new Schema(
  {
    title: String,
    creatorem: String,
    creator: String,
    collectnum: Number,
    songs: Array,
    disc: String,
    img_url: String,
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('List', ListSchema)
