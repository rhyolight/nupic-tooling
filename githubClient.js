var request = require('request'),
    GithubClient;

function GithubClient(accessToken) {
    this.accessToken = accessToken;
}

GithubClient.prototype.mergeBranch = function(from, to, callback) {
    
};

module.exports.GithubClient = GithubClient;