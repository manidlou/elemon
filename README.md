#elemon

[![npm version][npm-image]][npm-url] 

`elemon` is a tiny module that tries to provide a simple and yet efficient live-reload tool for developing electron applications. You just need to pass the `app` and `BrowserWindows` and the name of the files that are associated with them as a parameter to the `elemon` function **after** your app is `ready`. Please check out the example below to see how you can easily use `elemon` to watch your app and cleanly reload it upon any changes. If the changed
file is the main app file, then it `relaunch` the app and `exit` the current instance. If the changed file is a file that is associated with a browser window, then that window will only be reloaded.

In fact, setting up a clean live-reload tool for developing an elenctron application is super simple by using the [Electron-api](https://github.com/electron/electron/tree/master/docs). The api already comes with whatever you need; just add a watcher (like [chokidar](https://github.com/paulmillr/chokidar) or whatever watcher you like) and you are all set.

####Install

Please use `npm install --save-dev elemon`.

####API

**elemon(appOpts, windowsOpts)**

`appOpts`: Object

each option object has:

 * `app` ([app](https://github.com/electron/electron/blob/master/docs/api/app.md) object) _the main app object_
 * `res` (String) _main app file name_

`windowsOpts`: Array of objects

each option object has:

 * `bw` ([BrowserWindow](https://github.com/electron/electron/blob/master/docs/api/browser-window.md) object) _a browser window object_
 * `res` (Array of Strings) _array of any file name that is somehow associated with this browser window_

####Example

Suppose it is ,a very simplified, app file structure:

```
example_proj
  |
  |__view
  |     |__reg.html
  |     |__login.html
  |     |__reg_handler.js
  |     |__login_handler.js
  |
  |__stylesheets
  |     |__style.css
  |
  |__app.js

```
then, in the main process file where usually app and browser windows are created:

*app.js*

```javascript

const electron = require('electron');
const {app, BrowserWindow} = electron;
const elemon = require('elemon');

const reg_index = `file://${__dirname}/view/reg.html`;
const login_index = `file://${__dirname}/view/login.html`;
var reg_win = null;
var login_win = null;

function create_wins() {

  reg_win = new BrowserWindow({
    width: 600,
    height: 400,
    ...
  });

  login_win = new BrowserWindow({
    width: 600,
    height: 400,
    ...
  });
}

... other usual stuff ...

app.on('ready', () => {
  create_wins();

  // this is all that you have to add to your main app script
  var app_opts = {app: app, res: 'app.js'};
  var win_opts = [{bw: reg_win, res: ['reg.html', 'reg_handler.js', 'style.css']}
                , {bw: login_win, res: ['login.html', 'login_handler.js', 'style.css']}];
  elemon(app_opts, win_opts);
});

```

That's it. Have fun writing your [electron](https://github.com/electron/electron) applications.

[npm-image]: https://img.shields.io/npm/v/elemon.svg?maxAge=2592000?style=flat-square
[npm-url]: https://npmjs.org/package/elemon
