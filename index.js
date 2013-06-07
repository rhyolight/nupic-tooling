var fs = require('fs'),
    crypto = require('crypto'),
    connect = require('connect'),
    oauthHandlers = require('./oauth'),
    gh = require('./githubClient'),
    // used to authenticate Travis requests
    ghUser = 'numenta',
    ghRepo = 'nupic',
    TRAVIS_TOKEN = process.env.TRAVIS_TOKEN,
    // github API token from oauth
    accessToken,
    githubClient;

function buildSucceeded(body) {
    var payload = JSON.parse(body.payload);
    console.log(payload.id + ' ' + payload.status_message + ' on ' + payload.branch);
    console.log(payload.build_url);
    return (payload.status_message == 'Passed' && payload.branch == 'dev-master')
}

function isValidTravisRequest(req) {
    if (! req.headers || ! req.headers.authorization) {
        return false;
    }
    console.log('request headers:');
    console.log(req.headers);
    console.log('Travis Authorization header:');
    console.log(req.headers.authorization);
    console.log('expected auth value:');
    var authValue = req.headers.authorization;
    var shasum = crypto.createHash('sha256');
    shasum.update(ghUser + '/' + ghRepo + TRAVIS_TOKEN);
    var expected = shasum.digest('hex');
    console.log(expected);
    return authValue == expected;
}

function travisHandler(req, res) {
    if (! isValidTravisRequest(req)) {
        console.warn('Received invalid request on travis webhook!');
        return res.end();
    }
    if (! githubClient) {
        console.warn('Travis webhook received, but github oauth is invalid.');
        return res.end();
    }
    console.log('Using ' + accessToken + ' for github API.');
    if (buildSucceeded(req.body)) {
        console.log('build succeeded');
        githubClient.mergeBranch('dev-master', 'master', function(err) {
            if (! err) {
                console.log('merge complete');
            } else {
                console.warn('merge failure!');
                console.error(err);
            }
        });
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
