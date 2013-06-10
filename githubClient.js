var GitHubApi = require("github"),
    GithubClient;

function GithubClient(user, password, org, repo) {
    var me = this;
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
        password: password
    });
    console.log('Running a quick test of the client...');
    // test the client
    this.github.repos.getForks({
        user: this.org,
        repo: this.repo
    }, function(err, forks) {
        if (err) {
            console.error('There was an issue with the github client.');
            process.exit(-1);
        }
        console.log(me.org + '/' + me.repo + ' has ' + forks.length + ' forks.');
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
        callback(err);
    });
};

module.exports.GithubClient = GithubClient;