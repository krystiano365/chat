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



const activeClients = new Set()
io.on("connection", (client)=>{
	console.log("new client connected")

	client.on("client_connected", (uid) => {
		while(activeClients.has(uid)){
			uid += "_"
		}
		client.uid = uid
		activeClients.add(client)
		io.emit("client_connected", [...activeClients])
		console.log("client connected")
	})

	client.on("set_name", (uid) => {
		if(activeClients.has(uid)){
			io.emit https://www.youtube.com/watch?v=dOSIqJWQkXM
		}
		io.emit("set_name", client.uid)
	})

	client.on("disconnect", () => {
		activeClients.delete(client.uid)
		io.emit("client_disconnected", client.uid)
		console.log("client disconnected")
	})
})





// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
//
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

