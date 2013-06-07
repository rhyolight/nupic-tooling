#!/usr/bin/node

var fs = require('fs'),
    connect = require('connect'),
    oauthHandlers = require('./oauth'),
    gh = require('./githubClient'),
    accessToken,
    githubClient;

function buildSucceeded(body) {
    console.log(body.id + ' ' + body.status_message + ' on ' + body.branch);
    console.log(body.build_url);
    return (body.status_message == 'Passed' && body.branch == 'dev-master')
}

function isValidTravisRequest(req) {
    return true;
}

function travisHandler(req, res) {
    if (! isValidTravisRequest(req)) {
        console.warn('Received invalid request on travis webhook!');
        return res.end();
    }
    // if (! githubClient) {
    //     console.warn('Travis webhook received, but github oauth is invalid.');
    //     return res.end();
    // }
    console.log('Using ' + accessToken + ' for github API.');
    if (buildSucceeded(req.body)) {
        console.log('build succeeded');
        // githubClient.mergeBranch('dev-master', 'master', function(err) {

        // });
    } else {
        console.warn('build failed');
    }
    res.end();
};

connect()
    .use(connect.logger('dev'))
    .use(connect.bodyParser())
    .use('/oauth_callback', oauthHandlers.catcher(function(token) {
        accessToken = token;
        githubClient = new gh.GithubClient(accessToken);
    }))
    .use('/travis', travisHandler)
    .use('/', oauthHandlers.pitcher)
    .listen(8081);
