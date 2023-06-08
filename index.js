const Koa = require('koa');
const compress = require('koa-compress');
const bodyParser = require('koa-body');
const mongoose = require('mongoose');
const cookieParser = require('koa-cookie-parser');
// const token = require('./lib/JWT_Token');

require('dotenv').config()

const app = new Koa();

const server = require('http').createServer(app.callback());
const io = require('socket.io')(server, {cors: true});

app.proxy = true;
app.use(compress({ br: false }));
app.use(cookieParser({
	cookieNameList:['token'],
}));



require('./lib/service')(app);

app.use(bodyParser({
	parsedMethods: ['POST', 'PUT', 'GET', 'DELETE'],
	multipart: true,
}));

io.on('connection', (socket) => {
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('message', (msg) => {
		console.log(msg);
	});
});


require('./controller')(app);

const port = 5000;
const connect = async () => {
	try{
		await mongoose.connect(process.env.MONGODB);
		console.log("Connected to mongoDB");
	}catch(error){
		console.log("disconnected to mongoDB");
	}
}

app.listen(port, () => {
  connect();
  console.log(`connected to ${port} backend`);
});

server.listen(5001, () => {
	console.log(`connected to ${5001} socket server`);
});

module.exports = app;
