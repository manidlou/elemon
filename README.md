#elemon

[![travis build][travis-image]][travis-url] [![npm version][npm-image]][npm-url] 

`elemon` is a [node.js](https://nodejs.org) module that tries to cleanly monitor an [electron](https://github.com/electron/electron) application and automatically reloads the app upon any changes. It sets up an static server using [node-static](https://github.com/cloudhead/node-static) and [socket.io](https://github.com/socketio/socket.io) in order to have the ability to spawn the electron main process and cleanly terminate the process upon changes in the main script file and reloads the app. Notice it only terminates and reloads the entire app (main process) if the main script file is the one that you changed. For all files other than the main app file, it only reloads the corresponding browser window that is associated with the changed file (just notice the appdata in the example down below). So, it can easily be used as a practical live-reload tool for developing [electron](https://github.com/electron/electron) application.
####Install
Please use `npm install --save-dev elemon`. Also, you can use `npm install -g elemon`. The only difference between them is related to how you want to call `elemon` binary. Please read *how to use* section to see what it means.

**Notice**: Naturally, it is presumed that [electron-prebuilt](https://github.com/electron-userland/electron-prebuilt) already installed locally and is located in `/yourproj/node_modules/.bin/electron` since `elemon` uses that binary to spawn your application. So, if you haven't installed it yet, please first use `npm install --save-dev electron-prebuilt`, then install `elemon`.

####How to use
If `elemon` is installed locally, while you are in your project's directory, simply run `node ./node_modules/.bin/elemon`. If it is installed globally, in your project directory run `elemon`, instead of running `node node_modules/.bin/elemon`.


*Important Notice: For any reasons, if you want to quit your running `electron` application immediately, please don't close the app by just clicking on the close button. Instead, terminate (Ctrl-C) the running `elemon` process and your running application will be terminated accordingly.*

If you want to use `elemon`, you just need to pass a few reasonable data to the local server. It needs the following data:

**1. The main script (main app) file name** (exp: `app.js`)

**2. The id of every browser window in your application**

**3. The name (only filename is enough, no need the file's path) of all resources (js, css, and other files) that are associated with the specific browser window**

####Example

Suppose it is the app file structure,
```
yourproj
  |__view
  |     |__windows
  |     |   |__main-win
  |     |   |	 |__mainwin.html
  |     |   |
  |     |   |__second-win
  |     |      |__secwin.html
  |     |      |__secwin-controller.js
  |     |
  |     |__style
  |         |__photon.min.css
  |
  |__app.js
```

then, in the main process file where usually app and browser windows are created,

*app.js*
```javascript
'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const elemon_client = require('./elemon-client.js');
const g_wins = [];

function create_wins() {
  main_win = new BrowserWindow({
    width: 800,
    height: 600
  });
  main_win.loadURL('file://' + __dirname + '/view/windows/main-win/mainwin.html');
  
  second_win = new BrowserWindow({
    width: 500,
    height: 300
  });
  second_win.loadURL('file://' + __dirname + '/view/windows/second-win/secwin.html');
  
  // ... and all other usual stuff
  
  // keep the reference to the all browser windows for live-reload
  g_wins.push(main_win);
  g_wins.push(second_win);
}

app.on('ready', function() {
  create_wins();
  
  elemon_client.socket.emit('appdata', {
    main_script: 'app.js',
    browserWindows: [{
      id: main_win.id,
      resources: ['mainwin.html', 'photon.min.css']
    }, {
      id: second_win.id,
      resources: ['secwin.html', 'secwin-controller.js', 'photon.min.css']
    }]
  });
});

elemon_client.socket.on('reload', function(data) {
  elemon_client.reload(g_wins, data);
});
```
####api
*(better api docs is going the be added soon!)*

`elemon-client` is a [socket.io-client](https://github.com/socketio/socket.io-client) and is exposed as you install `elemon`. By default, it listens to the port `process.env.PORT || 19024`. It supports the following events:

**Event**: 'appdata'

emit the `appdata` event with the app required data for live-reload to the server.

**Event**: 'reload'

on `reload` event, reload app

```javascript
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const elemon_client = require('./elemon-client.js');
const g_wins = [];

// we use the previous example data

var yourAppData = {
  main_script: 'app.js',
  browserWindows: [{
    id: main_win.id,
    resources: ['mainwin.html', 'photon.min.css']
  }, {
    id: second_win.id,
    resources: ['secwin.html', 'secwin-controller.js', 'photon.min.css']
  }]
};

clientSocket.emit('appdata', yourAppData);

elemon_client.socket.on('reload', function(data) {
  elemon_client.reload(g_wins, data);
});
```
That's it. Have fun writing your [electron](https://github.com/electron/electron) applications.

[travis-image]: https://img.shields.io/travis/mawni/elemon/master.svg
[travis-url]: https://travis-ci.org/mawni/elemon
[npm-image]: https://img.shields.io/npm/v/elemon.svg?maxAge=2592000
[npm-url]: https://npmjs.org/package/elemon
[downloads-image]: https://img.shields.io/npm/dm/elemon.svg?maxAge=2592000
[downloads-url]: https://npmjs.org/package/elemon
