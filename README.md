nupic-tooling
=============

Server for tooling around the development process for the NuPIC project.

## Installation

First, install nodejs and npm.

Then, install connect and request:

    npm install connect
    npm install request

## Running it

You must set the following environment variables:

    export GH_BASIC_CLIENT_ID={github_client_id}
    export GH_BASIC_SECRET_ID={github_secret_id}
    export TRAVIS_TOKEN={travis_token}

Start the server:

    node index.js

Now that you're running it, you need to kick off the OAuth with Github. Do so by pointing your browser to http://localhost:8081/, then click the link provided. The logs will show your Github access token, and you're ready to go.

## Travis Agent

Expecting Travis webhook on build success/failure at http://localhost:8081/travis. Expects an 'authentication' header as defined in [Travis docs](http://about.travis-ci.org/docs/user/notifications/#Authorization).

Upon receiving build end notice, will call Github API to merge `dev-master` into `master` as long as the Travis notification is from `dev-master`. (This part is under construction.)
