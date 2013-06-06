#!/usr/bin/node

var fs = require('fs'),
    connect = require('connect'),
    request = require('request'),
    
    oauthHtml = fs.readFileSync('resources/oauth.html', 'utf-8'),

    CLIENT_ID = process.env.GH_BASIC_CLIENT_ID,
    CLIENT_SECRET = process.env.GH_BASIC_SECRET_ID,

    oauthPitcher, oauthCatcher,
    travisHandler;

oauthHtml = oauthHtml.replace('{{client_id}}', CLIENT_ID);

oauthCatcher = function(req, res, next) {
    // ignore all URLs that don't start /oauth_callback
    if (req.url.substr(0,15) != '/oauth_callback') {
        return next();
    }
    var sessionCode = req.query.code;
    request.post(
        {
            url: 'https://github.com/login/oauth/access_token', 
            oauth: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: sessionCode
            }
        }, 
        function(err, oauthRes, body) {
            var accessToken = JSON.parse(body).access_token;
            console.log('access token: ' + accessToken);
            res.end();
        }
    );
};

oauthPitcher = function(req, res, next) {
    if (req.url != '/') {
        return next();
    }
    res.end(oauthHtml);
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
