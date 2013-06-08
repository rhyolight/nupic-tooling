var GitHubApi = require("github"),
    GithubClient;

function GithubClient(accessToken) {
    this.accessToken = accessToken;
    this.github = new GitHubApi({
        version: "3.0.0",
        timeout: 5000
    });
    console.log('GithubClient created with access token ' + accessToken);
    console.log('Verifying access token...');
    this.github.authenticate({
        type: "oauth",
        token: accessToken
    });
}

GithubClient.prototype.mergeDevIntoMaster = function(callback) {
    console.log('merging test-branch-2 into test-branch-1...');
    this.github.repos.merge({
        user: 'numenta',
        repo: 'nupic',
        base: 'test-branch-1',
        head: 'test-branch-2'
    }, function(err, data) {
        console.log(err);
        console.log(data);
        callback(err);
    });
};

module.exports.GithubClient = GithubClient;