#elemon

[![npm](https://img.shields.io/npm/v/elemon.svg?maxAge=2592000?style=flat-square)](https://www.npmjs.com/package/elemon)

`elemon` is a tiny module that tries to provide a simple and yet efficient live-reload tool for developing [Electron](https://github.com/electron/electron) applications. You just need to pass the `app` and `BrowserWindows` and the name of the files that are associated with them as a parameter to the `elemon` function **after** your app is `ready`. Please check out the example below to see how you can easily use it to watch your app and cleanly reload it upon any changes. If the changed
file is the main app file, then it `relaunch` the app and `exit` the current instance. If the changed file is a file that is associated with a browser window, then that window will only be reloaded.

In fact, setting up a clean live-reload tool for developing an elenctron application is super simple by using the [Electron API](https://github.com/electron/electron/tree/master/docs). The api already comes with whatever you need; just add a watcher (like [chokidar](https://github.com/paulmillr/chokidar) or whatever watcher you like) and you are all set.

####Install

Please use `npm i elemon --save-dev`.

####Usage

**elemon(refs)**

`refs`: `{Object}` object that takes references to app and browser windows objects and resources
  - `app` `{Object}` main [app](https://github.com/electron/electron/blob/master/docs/api/app.md) object
  - `mainFile`: `{String}` main file name
  - `bws` `{Array<Object>}` array of browser window objects and their resources `[{bw:, res: []}]`
    - `bw` `{Object}` [BrowserWindow](https://github.com/electron/electron/blob/master/docs/api/browser-window.md) object
    - `res` `{Array<String>}` array of any file name that is somehow associated with this browser window
    - _if you want to watch all files in dir, or if you want the `bw` to be reloaded on any changes and not necessarily changes on specific file(s), leave the `res` as empty `[]`._

####Example

Suppose it is the app file structure:

```
example_proj
  |
  |__views
  |    |__win1-index.html
  |    |__win2-index.html
  |    |__win1.js
  |    |__win2.js
  |
  |__stylesheets
  |    |__style.css
  |
  |__main.js

```
then, in the main process file where usually app and browser windows are created:

*main.js*

```js

const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const elemon = require('elemon')

var win1, win2

function createWindows () {
  win1 = new BrowserWindow({width: 800, height: 600})
  win1.loadURL(url.format({
    pathname: path.join(__dirname, 'views', 'win1-index.html'),
    protocol: 'file:',
    slashes: true
  }))
  win1.on('closed', () => {
    win1 = null
  })
  win2 = new BrowserWindow({width: 800, height: 600})
  win2.loadURL(url.format({
    pathname: path.join(__dirname, 'views', 'win2-index.html'),
    protocol: 'file:',
    slashes: true
  }))
  win2.on('closed', () => {
    win2 = null
  })
}

// ... and other usual stuff ... //

app.on('ready', () => {
  createWindows()

  // this is all that you have to add to your main app script.
  // run your app normally with electron, then it will be reloaded
  // based on how you define references here
  elemon({
    app: app,
    mainFile: 'main.js',
    bws: [
      {bw: win1, res: ['win1-index.html', 'win1.js', 'style.css']},
      {bw: win2, res: ['win2-index.html', 'win2.js', 'style.css']}
    ]
  })
})
```

That's it. Have fun writing your [Electron](https://github.com/electron/electron) applications.

