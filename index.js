#!/usr/bin/node

var fs = require('fs'),
	url = require('url'),
    connect = require('connect'),
    request = require('request'),
    
	oauthHtml = fs.readFileSync('resources/oauth.html', 'utf-8'),

    CLIENT_ID = process.env.GH_BASIC_CLIENT_ID,
    CLIENT_SECRET = process.env.GH_BASIC_SECRET_ID,
	oauthRequestUrl = 'https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID,
	accessToken,

    oauthPitcher, oauthCatcher,
    travisHandler;

oauthHtml = oauthHtml.replace('{{client_id}}', CLIENT_ID);

oauthPitcher = function(req, res, next) {
    if (req.url != '/') {
        return next();
    }
    res.end(oauthHtml);
};

oauthCatcher = function(req, res, next) {
    // ignore all URLs that don't start /oauth_callback
    if (req.url.substr(0,15) != '/oauth_callback') {
        return next();
    }
    var sessionCode = url.parse(req.url, true).query.code;
	console.log('session code: ' + sessionCode);
    request.post(
        {
            url: 'https://github.com/login/oauth/access_token', 
			json: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: sessionCode
            }
        }, 
        function(err, oauthRes, body) {
            accessToken = body.access_token;
            console.log('access token: ' + accessToken);
            res.end();
        }
    );
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
    .use(oauthPitcher)
    .use(oauthCatcher)
    .use(travisHandler)
    .listen(3031);

