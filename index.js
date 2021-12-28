const express = require('express')
const app = express()
const http = require('http');
const config = require('./config.js')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const logMiddleware = require('./middlewares/log')
const errorMiddleware =require('./middlewares/error.js')
const authMiddleware = require('./middlewares/authorization.js')
const url = require('url')
const timeout = require('express-timeout-handler')
const moment = require('moment-timezone')
const compression = require('compression');


const User = require('./models/user')

const opt = {
	timeout: 10000,
	onTimeout:(req, res) => {
		const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress
		console.log(req.method,ip ,req.originalUrl,'[TimeOut]')
    	return res.status(503).json({error: 'Timeout'})
  },
  onDelayedResponse: (req, method, args, requestTime) => {
    console.log(`Attempted to call ${method} after timeout`)
  },
  disable: ['write', 'setHeaders', 'send', 'json', 'end']
}
app.set('port',3000)
mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

mongoose
	.connect(config.mongodb)
	.then(res => {
		console.log('mongodb connected')
	})
	.catch(e => {
		console.error(e)
	})
app.use(timeout.handler(opt))
app.use(compression())
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile)
app.use(express.static('public'))
app.use(bodyParser.json({
	limit : "50mb"
}))
app.use(bodyParser.urlencoded({ limit : "50mb",extended: true }))

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
	res.header('Access-Control-Allow-Headers', 'content-type, x-access-token')
	next()
})

app.set('jwt-secret', config.secret)

app.get('/',logMiddleware.consoleLog , (req, res) => {
	return res.status(200).json({
		status: 200
	})
})




app.use('/api', require('./routes/api'))


app.io = require('socket.io')();
var queue = [];
var roomData = [];
var roomItemData = [];
var roomNumberID = 0;
app.io.use(authMiddleware.socketVerify).on('connection',(socket) => {


	socket.on('enqueue' , (message) => {
		let queueData;
		const getUser = (id) => {
			const lll = queue.map(dt => dt.socketId)
	  		if(socket.id in lll ) { 
				console.log(socket.id + ' already enqueue')
				return;
			} else {
				return User.findOne({_id: id}).exec()
			}
			
		}
		const doing = (user) => {
			try {
				const jsonData = JSON.parse(message)
				
				queueData = {
					socketID : socket.id,
					lat: jsonData.latitude,
					lng: jsonData.longitude,
					id: socket.decoded._id,
					email: user.email,
					username: user.username

				}
			} catch(e) {
				throw new Error("12")
			}
			
			console.log(queueData)
			queue.push(queueData)
			console.log(queue)
			if(queue.length >= 3) {
				let firstUser = app.io.sockets.sockets.get(queue[0].socketID)
				let secondUser = app.io.sockets.sockets.get(queue[1].socketID)
				let thirdUser = app.io.sockets.sockets.get(queue[2].socketID)
				
				var roomNumber = roomNumberID.toString()
				roomData.push({
					roomName: roomNumber,
					users:[{email: firstUser.decoded.email,username: firstUser.decoded.username, latitude: queue[0].lat, longitude: queue[0].lng, role:1},
					{email: secondUser.decoded.email,username: secondUser.decoded.username, latitude: queue[1].lat, longitude: queue[1].lng, role:0},
					{email: thirdUser.decoded.email,username: thirdUser.decoded.username, latitude: queue[2].lat, longitude: queue[2].lng, role:0}]
				})
				console.log(`${roomNumber} room is created`)
				firstUser.join(roomNumber)
				secondUser.join(roomNumber)
				thirdUser.join(roomNumber)
				app.io.to(roomNumber).emit('roomCreated', JSON.stringify({
					data: roomData[roomNumberID]
				}))
				roomNumberID++
				queue.splice(0,3);
				//queue.splice(0,2);
			}
			
		}
		getUser(socket.decoded._id).then(doing)	
	})


	socket.on("UpdataCoordinate",function(data){
        const room_data = JSON.parse(data)
        const roomName = room_data.roomName;
    
        socket.join(`${roomName}`)
        const latitude=room_data.latitude;
        const longitude=room_data.longitude;
        const userName = socket.decoded.username;
        const UserCoordinate = {
            userName : userName,
            latitude: latitude,
            longitude : longitude
        }
        
       
       	app.io.to(`${roomName}`).emit('UpdataCoordinate',JSON.stringify(UserCoordinate))
       	function rand(min, max) {
        	return Math.floor(Math.random() * (max - min + 1)) + min;
      	}
       	var ran=rand(1,30)
        console.log(ran)
       	if(ran==30){
         //아이템 생성 
       		app.io.to(`${roomName}`).emit('makeBox',JSON.stringify({
				   roomName: `${roomName}`,
				   latitude: UserCoordinate.latitude+0.0005,
				   longitude: UserCoordinate.longitude+0.0005
			   }))   
        }
    })
     //아이템을얻었을때
    socket.on("getItem",function(data){
		const jsonData = JSON.parse(data)
        socket.to(`${jsonData.roomName}`).emit('getItem')   
        app.io.to(`${jsonData.roomName}`).emit('deletebox')   


       
     

    })
    
    //좀비를 만났을때
     socket.on("meetzombies",function(data){
        const jsonData = JSON.parse(data)
        
        socket.to(`${jsonData.roomName}`).emit('meetzombies')
      
         
        


    })

	socket.on('disconnect', function(){
	  const finder = (el) => el.socketID == socket.id
	  const index = queue.findIndex(finder)
	  if(index != -1) {
		  queue.splice(index,1);
	  }
	  console.log(queue)
      console.log('user disconnected')
    });
})

/* OLD CODE */
/*
var queue = [];
var roomData = [];
var roomItemData = [];
var roomNumberID = 0;
app.io.use(authMiddleware.socketVerify).on('connection', function(socket){
	socket.on('enqueue' , (message) => {
		let queueData;
		const getUser = (id) => {
			const lll = queue.map(dt => dt.socketId)
	  		if(socket.id in lll ) { 
				console.log(socket.id + ' already enqueue')
				return;
			} else {
				return User.findOne({_id: id}).exec()
			}
			
		}
		const doing = (user) => {
			try {
				const jsonData = JSON.parse(message)
				
				queueData = {
					socketID : socket.id,
					lat: jsonData.latitude,
					lng: jsonData.longitude,
					id: socket.decoded._id,
					email: user.email,
					username: user.username

				}
			} catch(e) {
				throw new Error("12")
			}
			
			console.log(queueData)
			queue.push(queueData)
			console.log(queue)
			if(queue.length >= 3) {
				let firstUser = app.io.sockets.sockets.get(queue[0].socketID)
				let secondUser = app.io.sockets.sockets.get(queue[1].socketID)
				let thirdUser = app.io.sockets.sockets.get(queue[2].socketID)
				
				var roomNumber = roomNumberID.toString()
				roomData.push({
					_id: roomNumber,
					users:[{ socketID: queue[0].socketID, email: firstUser.decoded.email,username: firstUser.decoded.username, lat: queue[0].lat, lng: queue[0].lng},
					{ socketID: queue[1].socketID, email: secondUser.decoded.email,username: secondUser.decoded.username, lat: queue[1].lat, lng: queue[1].lng},
					{ socketID: queue[2].socketID, email: thirdUser.decoded.email,username: thirdUser.decoded.username, lat: queue[2].lat, lng: queue[2].lng}]
				})
				console.log(`${roomNumber} room is created`)
				firstUser.join(roomNumber)
				secondUser.join(roomNumber)
				thirdUser.join(roomNumber)
				app.io.to(roomNumber).emit('roomCreated', JSON.stringify({
					roomNumber: roomNumber,
					data: roomData[roomNumberID]
				}))
				roomNumberID++
				queue.splice(0,3);
				//queue.splice(0,2);
			}
			
		}
		getUser(socket.decoded._id).then(doing)	
	})
	
	socket.on('updateLatLng', (data) => {
		const doing = () => {
			
			const jsonData = JSON.parse(data)
			
			const roomNumberInt = Number(jsonData.roomNumber)
			if(socket.id == roomData[roomNumberInt].users[0].socketID) {
				roomData[roomNumberInt].users[0].lat = jsonData.lat
				roomData[roomNumberInt].users[0].lng = jsonData.lng
			} else if(socket.id == roomData[roomNumberInt].users[1].socketID) {
				roomData[roomNumberInt].users[1].lat = jsonData.lat
				roomData[roomNumberInt].users[1].lng = jsonData.lng
			} else if(socket.id == roomData[roomNumberInt].users[2].socketID) {
				roomData[roomNumberInt].users[2]. lat = jsonData.lat
				roomData[roomNumberInt].users[2].lng = jsonData.lng
			}
		
			app.io.to(jsonData.roomNumber).emit('update', JSON.stringify({
				data: roomData[roomNumberInt]
			}))

		}
		doing()
	})

	

  socket.on('disconnect', function(){
	  const finder = (el) => el.socketID == socket.id
	  const index = queue.findIndex(finder)
	  if(index != -1) {
		  queue.splice(index,1);
	  }
	  console.log(queue)
      console.log('user disconnected')
  });
 
}); 
*/


app.use(errorMiddleware.notFound)
app.use(errorMiddleware.errorHandler)
const server = http.createServer(app)
app.io.attach(server)
server.listen(3000)
server.on('listening',() => {
	console.log("server run")
});