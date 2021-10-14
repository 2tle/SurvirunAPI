const express = require('express')
const app = express()
const config = require('./config.js')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const logMiddleware = require('./middlewares/log')
const url = require('url')
const timeout = require('express-timeout-handler')
const moment = require('moment-timezone')
const httpError = require('./middlewares/httpError')
const compression = require('compression');

/**/
/**/



const opt = {
	timeout: 10000,
	onTimeout:(req, res) => {
	console.log('[TimeOut]')
    res.status(503).json({error: 'Timeout'});
  },
  onDelayedResponse: (req, method, args, requestTime) => {
    console.log(`Attempted to call ${method} after timeout`);
  },
  disable: ['write', 'setHeaders', 'send', 'json', 'end']
}

mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose
	.connect(config.mongodb)
	.then(res => {
		console.log('mongodb connected');
	})
	.catch(e => {
		console.error(e);
	});
app.use(timeout.handler(opt))
app.use(compression())
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/apiDoc');
app.use(express.static('public'));
app.use(bodyParser.json({
	limit : "50mb"
}));
app.use(bodyParser.urlencoded({ limit : "50mb",extended: true }));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
	res.header('Access-Control-Allow-Headers', 'content-type, x-access-token');
	next();
});

app.set('jwt-secret', config.secret);

app.get('/',logMiddleware.consoleLog , (req, res) => {
	const d = {
		status: 200
	}
	res.status(200).json(d);
});

app.get('/easter',(req,res) => {
	return res.status(200).json({
		easter1: "7Lac66Cl7ISg67Cw6rCAIOyggOulvCDqtLTroa3tnpnri4jri6Qu",
		easter2: "7J207KCV7J24IOyXv+ydtOuCmCDrk5zshLjsmpQ=",
		easter3: ""
	})
})

app.use('/api', require('./routes/api'));


app.use(httpError.pageNotFoundError)
//app.use(httpError.respondInternalError)
const server = app.listen(config.port || 3000, () => {
	console.log('server is now running');
});

