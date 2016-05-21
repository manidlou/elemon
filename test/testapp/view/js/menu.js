const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;
const path = require('path');

var win = new BrowserWindow({width: 400, height: 400});
win.loadURL('file://' + path.resolve('..', 'index.html'));
