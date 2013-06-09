var fs = require('fs'),
    crypto = require('crypto'),
    headBranch = 'test-branch-2'
    baseBranch = 'test-branch-1';

function shouldMerge(travisPayload) {
    return (travisPayload.status == 'Passed' 
        && travisPayload.branch == headBranch);
}

function isValidTravisRequest(req, token) {
    var authValue, shasum, expected;
    if (! req.headers || ! req.headers.authorization) {
        return false;
    }
    authValue = req.headers.authorization;
    shasum = crypto.createHash('sha256');
    shasum.update(ghUser + '/' + ghRepo + token);
    expected = shasum.digest('hex');
    return authValue == expected;
}

module.exports = function(travisToken, githubClient) {
    return function(req, res) {
        if (! isValidTravisRequest(req, travisToken)) {
            console.warn('Received invalid request on travis webhook!');
            return res.end();
        }
        var payload = JSON.parse(req.body.payload);
        console.log(payload.id + ' ' + payload.status_message + ' on ' + payload.branch);
        if (shouldMerge(payload)) {
            githubClient.merge(headBranch, baseBranch, function(err) {
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
};

