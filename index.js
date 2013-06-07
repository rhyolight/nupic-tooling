#!/usr/bin/node

var fs = require('fs'),
    url = require('url'),
    connect = require('connect'),
    request = require('request'),
    oathHandlers = require('./oauth'),
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
    .use('/oauth_callback', oauthHandlers.catcher)
    .use('/travis', travisHandler)
    .use('/', oauthHandlers.pitcher)
    .listen(3031);
