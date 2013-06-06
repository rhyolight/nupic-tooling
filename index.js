#!/usr/bin/node

var app,
	connect = require('connect'),
	travisHandler;

travisHandler = function(req, res, next) {
	// ignore all URLs that don't start /travis
	if (req.url.substr(0,7) != '/travis') {
		return next();
	}
	console.log(req.body);
	res.end();
};

app = connect()
	.use(connect.logger('dev'))
	.use(connect.bodyParser())
	.use(travisHandler)
	.listen(3031);
