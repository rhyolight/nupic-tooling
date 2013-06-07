var request = require('request'),
    GithubClient;

function GithubClient(accessToken) {
    this.accessToken = accessToken;
    console.log('GithubClient created with access token ' + accessToken);
}

GithubClient.prototype.mergeBranch = function(from, to, callback) {
    console.log('merging branch ' + from + ' into ' + to + '...');
    callback();
};

module.exports.GithubClient = GithubClient;