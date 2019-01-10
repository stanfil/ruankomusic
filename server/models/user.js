let mongoose = require('mongoose')
let Schema = mongoose.Schema
let UserSchema = new Schema(
  {
    nickname: String,
    email: String,
    password: String,
    likeSL: String,
    collectSLs: Array,
    createSLs: Array,
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('User', UserSchema)
