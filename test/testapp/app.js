'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const elemon = require('../../elemon-client.js');

var main_win = null;
var second_win = null;
var wins = [];

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function create_wins() {
  main_win = new BrowserWindow({
    width: 800,
    height: 600
  });

  main_win.loadURL('file://' + __dirname + '/view/windows/main-win/mainwin.html');
  main_win.webContents.openDevTools();
  main_win.on('closed', function() {
    main_win = null;
  });
  
  second_win = new BrowserWindow({
  	width: 500,
  	height: 300
	});
	
	second_win.loadURL('file://' + __dirname + '/view/windows/second-win/secwin.html');
  second_win.webContents.openDevTools();
  second_win.on('closed', function() {
    second_win = null;
  });
  
	wins.push(main_win);
	wins.push(second_win);
}

app.on('activate', function() {
  if (main_win === null) {
    create_wins();
  }
});

app.on('ready', function() {
  create_wins();
  
  elemon.socket.emit('appdata', {
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

elemon.socket.on('reload', function(data) {
	elemon.reload(wins, data);
});

process.on('uncaughtException', function(err) {
	console.log('uncaught exception found:', err);
});

