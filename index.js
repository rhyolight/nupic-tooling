#!/usr/bin/node

var fs = require('fs'),
    connect = require('connect'),
    oauthHandlers = require('./oauth'),
    gh = require('./githubClient'),
    accessToken,
    githubClient;

var fakeTravisPayload = {
  "id": 1,
  "number": 1,
  "status": null,
  "started_at": null,
  "finished_at": null,
  "status_message": "Passed",
  "commit": "62aae5f70ceee39123ef",
  "branch": "master",
  "message": "the commit message",
  "compare_url": "https: //github.com/svenfuchs/minimal/compare/master...develop",
  "committed_at": "2011-11-11T11: 11: 11Z",
  "committer_name": "Sven Fuchs",
  "committer_email": "svenfuchs@artweb-design.de",
  "author_name": "Sven Fuchs",
  "author_email": "svenfuchs@artweb-design.de",
  "repository": {
    "id": 1,
    "name": "minimal",
    "owner_name": "svenfuchs",
    "url": "http: //github.com/svenfuchs/minimal"
   },
  "matrix": [
    {
      "id": 2,
      "repository_id": 1,
      "number": "1.1",
      "state": "created",
      "started_at": null,
      "finished_at": null,
      "config": {
        "notifications": {
          "webhooks": ["http: //evome.fr/notifications", "http: //example.com/"]
        }
      },
      "status": null,
      "log": "",
      "result": null,
      "parent_id": 1,
      "commit": "62aae5f70ceee39123ef",
      "branch": "master",
      "message": "the commit message",
      "committed_at": "2011-11-11T11: 11: 11Z",
      "committer_name": "Sven Fuchs",
      "committer_email": "svenfuchs@artweb-design.de",
      "author_name": "Sven Fuchs",
      "author_email": "svenfuchs@artweb-design.de",
      "compare_url": "https: //github.com/svenfuchs/minimal/compare/master...develop"
    }
  ]
};

function buildSucceeded(body) {
    console.log(body.payload);
    var payload = JSON.parse(body.payload);
    console.log(payload.status_message);
    console.log(payload.build_url);
    console.log(payload.branch);
    return (payload.status_message == 'Passed' && payload.branch == 'dev-master')
}

function isValidTravisRequest(req) {
    return true;
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
    console.log('Using + ' accessToken + ' for github API.');
    if (buildSucceeded(req.body)) {
        githubClient.mergeBranch('dev-master', 'master', function(err) {

        });
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
    .listen(3031);
