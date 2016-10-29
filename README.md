#elemon

[![travis build][travis-image]][travis-url] [![npm version][npm-image]][npm-url] 

`elemon` is a [node.js](https://nodejs.org) tiny module that tries to provide the simplest and yet the most efficient live-reload tool for developing electron applications. You just need to pass the `app` and `BrowserWindows` and the name of the files that are associated with them as a parameter to `elemeon` function **after** your app is `ready`. Please check out the example below to see how you can easily use `elemon` to cleanly watch your app and reload it upon any changes. If the changed
file is the main app file, then it `relaunch` the app and `exit` the current instance. If the changed file is a file that is associated with a browser window, then that window will only be reloaded.

In fact, setting up a clean live-reload tool for developing an elenctron application is super simple by using the [Electron-api](https://github.com/electron/electron/tree/master/docs). The api already comes with whatever you need; just add a watcher (like [chokidar](https://github.com/paulmillr/chokidar) or whatever watcher you like) and you are all set.

####Install

Please use `npm install --save-dev elemon`.

####How to use

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

then, in the main process file where usually app and browser windows are created,

*app.js*

```javascript

'use strict';
const electron = require('electron');
const {app, BrowserWindow, dialog, ipcMain} = electron;
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

  reg_win.loadURL(reg_index);
  reg_win.on('closed', () => {
    reg_win = null;
  });

  login_win = new BrowserWindow({
    width: 600,
    height: 400,
    ...
  });

  login_win.loadURL(login_index);
  login_win.on('closed', () => {
    login_win = null;
    app.quit();
  });
}

app.on('ready', () => {
  create_wins();
  
  // this is all that you have to add to your main app script
  elemon({id: app, res: 'app.js'}, [{id: reg_win, res: ['reg.html', 'reg_handler.js', 'style.css']}, {id: login_win, res: ['login.html', 'login_handler.js', 'style.css']}]);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

... and all other usual stuff ...

```

That's it. Have fun writing your [electron](https://github.com/electron/electron) applications.

[travis-image]: https://img.shields.io/travis/mawni/elemon/master.svg
[travis-url]: https://travis-ci.org/mawni/elemon
[npm-image]: https://img.shields.io/npm/v/elemon.svg?maxAge=2592000
[npm-url]: https://npmjs.org/package/elemon
[downloads-image]: https://img.shields.io/npm/dm/elemon.svg?maxAge=2592000
[downloads-url]: https://npmjs.org/package/elemon
