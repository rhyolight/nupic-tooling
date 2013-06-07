#!/usr/bin/node

var fs = require('fs'),
    connect = require('connect'),
    oauthHandlers = require('./oauth'),
    github = require('./githubClient'),
    
    accessToken;

function buildSucceeded(body) {
    console.log(body);
    return false;
}

function travisHandler(req, res) {
    console.log('/travis: access token: ' + accessToken);
    if (buildSucceeded(req.body)) {
        github.mergeBranch('dev-master', 'master', function() {

        });
    }
    res.end();
};

connect()
    .use(connect.logger('dev'))
    .use(connect.bodyParser())
    .use('/oauth_callback', oauthHandlers.catcher(function(token) {
		accessToken = token;
	}))
    .use('/travis', travisHandler)
    .use('/', oauthHandlers.pitcher)
    .listen(8081);
