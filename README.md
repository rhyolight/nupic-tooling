nupic-tooling
=============

Server for tooling around the development process for the NuPIC project.

## Installation

First, install nodejs and npm.

Then, install connect and request:

    npm install connect
    npm install request
    npm install github

## Running it

You must set the following environment variables:

    export TRAVIS_TOKEN={travis_token}
    export GH_USERNAME={github_username}
    export GH_PASSWORD={github_password}

Start the server:

    node index.js

## Travis Webhook

This server expects Travis webhook calls on build success/failure at http://localhost:8081/travis. It authenticates Travis requests using the 'authentication' header as defined in [Travis docs](http://about.travis-ci.org/docs/user/notifications/#Authorization).

Upon receiving build end notice, will call Github API to merge `dev-master` into `master` as long as the Travis notification is from `dev-master`. (This part is under construction.)

## Make sure it stays running!

So you really should make sure that your server stays running, so do this:

    sudo npm install forever -g

This will install the [`forever`](https://npmjs.org/package/forever) npm module, which will keep the process running if it fails for some reason. The best way to start it is like this:

    forever start index.js