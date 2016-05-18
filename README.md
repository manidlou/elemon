#elemon

[![npm version][npm-image]][npm-url] 

elemon is a tiny [node.js](https://nodejs.org) module that monitors an [electron](https://github.com/electron/electron) application and automatically reloads the running application upon any changes. It simply means, instead of you typing `./node_modules/.bin/electron .` or `npm start` each time that you want to run your application during development, you let `elemon` do it for you. So, it can easily be used as a light and practical dynamic-reload (live-reload) tool for developing [electron](https://github.com/electron/electron) applications.
####Install
Please use `npm install --save-dev elemon`. Also, you can use `npm install -g elemon`. The only difference between them is related to how you want to call `elemon` binary. Please read below to see what it means.

**Notice**: It is naturally presumed that [electron-prebuilt](https://github.com/electron-userland/electron-prebuilt) already installed locally and is located in `/yourproj/node_modules/.bin/electron` since `elemon` uses that binary to spawn your application. So, if you haven't installed it yet, please first use `npm install --save-dev electron-prebuilt`, then install `elemon`.

####How to use
In order to use `elemon` locally, when you normally run your local `electron` binary by using either `./node_modules/.bin/electron .` or supplying it in package.json and running `npm start`, instead, just run locally installed `elemon` by running `node node_modules/.bin/elemon` from your project's directory.

`elemon` runs your [electron](https://github.com/electron/electron) application and watches the project directory. Upon any changes, it kills the group of all processes that are associated with spawned `electron` process and automatically reloads the application. So, you can immediately see the result of the changes that you just made.

If `elemon` is installed globally, navigate to your project directory and run `elemon`, instead of running `node node_modules/.bin/elemon`.

*Important Notice: For any reasons, if you want to quit your running `electron` application immediately, please don't close the app by just clicking on the close button. Instead, terminate (Ctrl-C) the running `elemon` process and your running application will be terminated accordingly.*

That's it. Have fun writing your [electron](https://github.com/electron/electron) application.


[travis-image]: https://img.shields.io/travis/mawni/elemon/master.svg
[travis-url]: https://travis-ci.org/mawni/elemon
[npm-image]: https://img.shields.io/npm/v/elemon.svg?maxAge=2592000
[npm-url]: https://npmjs.org/package/elemon
[downloads-image]: https://img.shields.io/npm/dm/elemon.svg?maxAge=2592000
[downloads-url]: https://npmjs.org/package/elemon
