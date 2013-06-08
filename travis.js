var fs = require('fs'),
    crypto = require('crypto'),
    ghUser = 'numenta',
    ghRepo = 'nupic',
    head = 'test-branch-2',
    // used to authenticate Travis requests
    TRAVIS_TOKEN = process.env.TRAVIS_TOKEN,
    githubClient;

function buildSucceeded(status, branch) {
    return (status == 'Passed' && branch == head)
}

function isValidTravisRequest(req) {
    if (! req.headers || ! req.headers.authorization) {
        return false;
    }
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
    var payload = JSON.parse(req.body.payload);
    console.log(payload.id + ' ' + payload.status_message + ' on ' + payload.branch);
    console.log(payload.build_url);
    console.log(payload.status_message == 'Passed');
    console.log(payload.branch == head);
    var success = buildSucceeded(payload.status_message, payload.branch);
    console.log('build success ? ' + success);
    if (success && payload.branch == head) {
        githubClient.mergeDevIntoMaster(function(err) {
            if (! err) {
                console.log('✔ merge complete!');
            } else {
                console.warn('✘ merge failure!');
                console.error(err);
            }
        });
    } else {
        console.warn('No merge was triggered.');
    }
    res.end();
};

module.exports = {
    handler: travisHandler,
    setGithubClient: function(ghClient) {
        console.log('travis received github client');
        githubClient = ghClient;
    }
};

