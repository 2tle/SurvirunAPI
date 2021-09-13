const express = require('express');
const app = express();
const config = require('./config.js');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logMiddleware = require('./middlewares/log')
const url = require('url');

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

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/apiDoc');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
	res.header('Access-Control-Allow-Headers', 'content-type, x-access-token');
	next();
});

app.set('jwt-secret', config.secret);

app.get('/',logMiddleware.consoleLog , (req, res) => {
	res.status(200).json({ status: 200, baseUrl: req.hostname });
});

//app.get('/DOCUMENT',  express.static(__dirname + '/apiDoc'));


app.use('/api', require('./routes/api'));


app.listen(config.port || 3000, () => {
	console.log('server is now running');
});

