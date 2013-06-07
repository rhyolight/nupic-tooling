var fs = require('fs'),
    url = require('url'),
    request = require('request'),
    oauthHtml = fs.readFileSync('resources/oauth.html', 'utf-8'),

    CLIENT_ID = process.env.GH_BASIC_CLIENT_ID,
    CLIENT_SECRET = process.env.GH_BASIC_SECRET_ID,
    oauthRequestUrl = 'https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID;

oauthHtml = oauthHtml.replace('{{client_id}}', CLIENT_ID);

oauthPitcher = function(req, res) {
    res.end(oauthHtml);
};

oauthCatcher = function(callback) {
    return function(req, res) {
        var sessionCode = url.parse(req.url, true).query.code;
        console.log('session code: ' + sessionCode);
        request.post(
            {
                url: 'https://github.com/login/oauth/access_token', 
                json: {
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    code: sessionCode
                }
            }, 
            function(err, oauthRes, body) {
                accessToken = body.access_token;
                console.log('received access token: ' + accessToken);
                callback(accessToken);
                res.end();
            }
        );
    };
};

module.exports = {
    pitcher: oauthPitcher,
    catcher: oauthCatcher
};
