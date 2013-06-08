var connect = require('connect'),
    oauthHandlers = require('./oauth'),
    gh = require('./githubClient'),
    travis = require('./travis'),
    // github API token from oauth
    accessToken,
    githubClient;

connect()
    .use(connect.logger('dev'))
    .use(connect.bodyParser())
    .use('/oauth_callback', oauthHandlers.catcher(function(token) {
        accessToken = token;
        githubClient = new gh.GithubClient(accessToken);
    }))
    .use('/travis', travis(githubClient))
    .use('/', oauthHandlers.pitcher)
    .listen(8081);
