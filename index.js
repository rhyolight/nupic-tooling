var connect = require('connect'),
    gh = require('./githubClient'),
    travis = require('./travis'),
    TRAVIS_TOKEN = process.env.TRAVIS_TOKEN,
    GH_USERNAME = process.env.GH_USERNAME,
    GH_API_KEY = process.env.GH_API_KEY,
    GH_ORG = 'numenta',
    GH_REPO = 'nupic',
    githubClient;

if (! TRAVIS_TOKEN || ! GH_USERNAME || ! GH_API_KEY) {
    console.error('You must set the following environment variables:\n' +
        '\t- TRAVIS_TOKEN\n' +
        '\t- GH_USERNAME\n' +
        '\t- GH_API_KEY');
    process.exit(-1);
}

githubClient = new gh.GithubClient(GH_USERNAME, GH_API_KEY, GH_ORG, GH_REPO);

connect()
    .use(connect.logger('dev'))
    .use(connect.bodyParser())
    .use('/travis', travis(TRAVIS_TOKEN, githubClient))
    .listen(8081);
