# LogTenSafe: Vue.js Front-End

LogTenSafe is a website (at logtensafe.com) and a macOS application that backs
up logbook data from [LogTen Pro](https://coradine.com), in case iCloud sync
poops the bed, or some other unforeseen badness happens.

This project is the front-end for the LogTenSafe website. It's written in
TypeScript and Vue.js, and is powered by the API-only back-end (written in Ruby
on Rails).

## Installation and Development

The front-end requires a modern version of Node.js and Yarn. Simply check out
the project and run `yarn install` to install all required dependencies.

The front-end is powered by Vue-CLI. `vue-cli-service` provides the bulk of
development tasks, which are aliased as yarn commands in `package.json`. See
the `package.json` file for a list of common development commands you can use.

To run the hot-reloading development server, run `yarn serve`. To compile
JavaScript for production deploy, run `yarn build`.

Note that in order to use the development server, you will need to check out,
install, and run the back-end, including the webserver process, the Sidekiq
job processor, and the WebSockets server. An example `Procfile` that
accomplishes all this:

```
backend: cd Backend && rvm 3.0.3@logtensafe exec rails server
frontend: cd Frontend && yarn serve
jobs: cd Backend && rvm 3.0.3@logtensafe exec bundle exec sidekiq -C config/sidekiq.yml
cable: cd Backend && rvm 3.0.3@logtensafe exec ./bin/cable
mail: mailcatcher -f
```

(This Procfile assumes you are using RVM, and assumes you have checked out the
two repositories into specific folders. It also launches Mailcatcher for
testing emails sent in development.)

Unit tests are written using Mocha and Chai, and can be run with
`yarn test:unit`. End-to-end tests are written using Cypress, and require the
full development stack to be launched to run. An example `Procfile` for running
E2E tests:

```
backend: cd Backend && rvm 3.0.3@logtensafe exec rails server -e cypress -b localhost
frontend: cd Frontend && yarn run test:e2e
jobs: cd Backend && redis-cli flushall && rvm 3.0.3@logtensafe exec bundle exec sidekiq -C config/sidekiq.yml -e cypress
cable: cd Backend && rvm 3.0.3@logtensafe exec ./bin/cable -e cypress
```

Deployment is done with the `deploy.sh` script, which simply compiles the
production JavaScript code and copies it to the server.

## Architecture

All views are rendered using Vue.js. The {Layout} view is the top-level view,
and yields its content to Vue-Router, which renders one of the logged-out or
logged-in top-level views. All top-level views are in `src/views`, and their
subviews (as well as common components) are in `src/components`. Strings are
managed using Vue-i18n (although only an English localization is currently
available.)

Authorization is accomplished using JSON Web Tokens. After a successful login,
the back-end provides a JWT which the front-end uses as a bearer token for all
subsequent requests.

State management is handled by Vuex. The `session` module stores the JWT and
exposes user information. The `backups` module handles loading and creating
logbook backups.

Realtime backup updates are accomplished using WebSockets (in particular,
Action Cable). Upon first load of a backups list, Vuex creates and maintains
a WebSocket connection providing realtime updates from the back-end.

Styling is done with Bootstrap.
