var GitHubApi = require("github"),
    head = 'test-branch-2',
    base = 'test-branch-1',
    GithubClient;

function GithubClient(accessToken) {
    this.accessToken = accessToken;
    this.github = new GitHubApi({
        version: "3.0.0",
        timeout: 5000
    });
    console.log('GithubClient created with access token ' + accessToken);
    this.github.authenticate({
        type: "oauth",
        token: accessToken
    });
}

GithubClient.prototype.mergeDevIntoMaster = function(callback) {
    console.log('merging ' + head + ' into ' + base + '...');
    this.github.repos.merge({
        user: 'numenta',
        repo: 'nupic',
        base: base,
        head: head
    }, function(err, data) {
        console.log(err);
        console.log(data);
        callback(err);
    });
};

module.exports.GithubClient = GithubClient;