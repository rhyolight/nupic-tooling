var GitHubApi = require("github"),
    GithubClient;

function GithubClient(user, apiKey, org, repo) {
    this.accessToken = accessToken;
    this.org = org;
    this.repo = repo;
    this.github = new GitHubApi({
        version: "3.0.0",
        timeout: 5000
    });
    console.log('GithubClient created for user ' + user);
    this.github.authenticate({
        type: "basic",
        username: user,
        password: apiKey
    });
}

GithubClient.prototype.merge = function(head, base, callback) {
    console.log('merging ' + head + ' into ' + base + '...');
    this.github.repos.merge({
        user: this.org,
        repo: this.repo,
        base: base,
        head: head
    }, function(err, data) {
        console.log(err);
        console.log(data);
        callback(err);
    });
};

module.exports.GithubClient = GithubClient;