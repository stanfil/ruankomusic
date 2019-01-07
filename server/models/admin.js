let mongoose = require('mongoose')
let Schema = mongoose.Schema
let AdminSchema = new Schema(
  {
    username: {type: String, unique: true},
    password: {type: String},
    online: {type: Boolean},
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Admin', AdminSchema)
