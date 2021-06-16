const app = require('express')()
const config = require('./config.js')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.Promise = global.Promise
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

mongoose.connect(config.mongodb).then((res) => {
  console.log("mongodb connected")
}).catch((e) => {
  console.error(e)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use((req,res,next) => {
  res.header('Access-Control-Allow-Origin','*')
  res.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, PATCH')
  res.header('Access-Control-Allow-Headers','content-type, x-access-token')
  next()
})

app.set('jwt-secret', config.secret)

app.get('/', (req,res) => {
  res.status(200).json({status: 200})
})

app.use('/api', require('./routes/api'))

app.listen(config.port || 3000, () => {
  console.log("server is now running")
})