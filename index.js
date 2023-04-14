const Koa = require('koa');
const compress = require('koa-compress');
const bodyParser = require('koa-body');
const mongoose = require('mongoose');
const cookieParser = require('koa-cookie-parser');
// const token = require('./lib/JWT_Token');

require('dotenv').config()

const app = new Koa();


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

module.exports = app;
