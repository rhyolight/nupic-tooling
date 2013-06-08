var fs = require('fs'),
    crypto = require('crypto'),
    ghUser = 'numenta',
    ghRepo = 'nupic',
    // used to authenticate Travis requests
    TRAVIS_TOKEN = process.env.TRAVIS_TOKEN,
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
    if (buildSucceeded(req.body) && req.body.branch == 'test-branch-2') {
        console.log('build succeeded on test-branch-2');
            githubClient.mergeDevIntoMaster(function(err) {
                if (! err) {
                    console.log('✔ merge complete!');
                } else {
                    console.warn('✘ merge failure!');
                    console.error(err);
                }
            });
    } else {
        console.warn('No merge for you! Either the build failed, or this was not test-branch-2.');
    }
    res.end();
};

module.exports = function(ghClient) {
    githubClient = ghClient;
    return travisHandler;
};