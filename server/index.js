let express = require("express")
let app = express()
let port = require("./config").port
let mongoose = require("mongoose")
let uri = require("./config").uri
let bodyParser = require('body-parser')
let morgan = require('morgan')
let cors = require('cors')

let admin = require('./routes/admin')
let getsong = require('./routes/getsong')
let postsong = require('./routes/postsong')
let user = require('./routes/user')
let list = require('./routes/list')
let song = require('./routes/song')
//Models

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())
mongoose.connect(uri, {useNewUrlParser: true})

let db = mongoose.connection
db.on('error', (err) => console.log('database connection failed!', err))
db.once('open', () => console.log('database connection success!'))

//routes
app.use('/admin', admin)
app.use('', getsong)
app.use('', postsong)
app.use('/user', user)
app.use('/list', list)
app.use('/song', song)
app.listen(port, () => console.log(`runnning on port ${port}...`))
