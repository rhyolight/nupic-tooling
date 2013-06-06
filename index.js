#!/usr/bin/node

var connect = require('connect'),
	CLIENT_ID = process.env.GH_BASIC_CLIENT_ID,
	CLIENT_SECRET = process.env.GH_BASIC_SECRET_ID,
	oauthPitcher, oauthCatcher,
	travisHandler;

oauthCatcher = function(req, res, next) {
	// ignore all URLs that don't start /oauth_callback
	if (req.url.substr(0,15) != '/oauth_callback') {
		return next();
	}
};

oauthPitcher = function(req, res, next) {
	if (req.url != '/') {
		return next();
	}
	
};

travisHandler = function(req, res, next) {
	// ignore all URLs that don't start /travis
	if (req.url.substr(0,7) != '/travis') {
		return next();
	}
	console.log(req.body);
	res.end();
};

connect()
	.use(connect.logger('dev'))
	.use(connect.bodyParser())
	.use(oauthCatcher)
	.use(oauthPitcher)
	.use(travisHandler)
	.listen(3031);
