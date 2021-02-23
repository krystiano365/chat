const express = require('express');
const {Server} = require('socket.io')
const lessMiddleware = require('less-middleware');
const logger = require('morgan');

const app = express();
app.use(express.static('public'));
app.use(lessMiddleware('public'));
app.use(logger('dev'));


const httpServer = app.listen(3000)
const io = new Server(httpServer)

class Message{
	constructor(owner, message, timestamp) {
		this.owner = owner;
		this.time = timestamp;
		this.message = message;
	}
}

const activeClients = new Set()
const areTyping = new Set();
let messages = []

io.on("connection", (client)=>{
	console.log("new client connected")

	client.on("client_connected", (uid) => {
		while(activeClients.has(uid)){
			uid += "_"
		}
		client.uid = uid
		activeClients.add(uid)
		io.emit("client_connected", [...activeClients])
		client.emit("initial_messages", messages)
	})
	// https://www.youtube.com/watch?v=dOSIqJWQkXM
	// client.on("set_name", (uid) => {
	// 	activeClients.delete(client.uid)
	// 	client.uid = uid
	// 	activeClients.add(uid)
	// 	io.emit("set_name", [...activeClients])
	// })
	client.on("get_my_name", () => {
		client.emit('get_my_name', client.uid)
	})

	client.on("message", (message) => {
		if(message.length <= 0){
			return
		}
		var uid = client.uid
		var newMsg = new Message(uid, message, Date.now())
		messages.push(newMsg)
		io.emit("message", newMsg)
	})

	client.on("disconnect", () => {
		activeClients.delete(client.uid)
		areTyping.delete(client.uid)
		if (activeClients.size <= 0) {
			messages = []
			activeClients.clear()
		}
		io.emit("client_disconnected", client.uid)
		console.log("client disconnected")
	})

	client.on("is_typing", (bool) => {
		if(bool){
			areTyping.add(client.uid)
		} else {
			areTyping.delete(client.uid)
		}
		io.emit("is_typing", [...areTyping])
	})
})





// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
//
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

