#!/usr/bin/env node

/*!
 * elemon.js
 * 
 * Copyright (c) 2016 Mawni Maghsoudlou
 * Released under the MIT license
 */

/**
 * elemon is a live-reload tool for developing electron application. It monitors an electron application
 * during development and automatically reloads it upon any changes.
 */

(function() {
  'use strict';

  const nodestatic = require('node-static');
  const chok = require('chokidar');
  const running = require('is-running');
  const path = require('path');
  const spawn = require('child_process').spawn;
  const static_file = new(nodestatic.Server)();
  const ELEC_BIN = process.argv[2];
  const ELEC_BIN_ARG = process.argv[3];
  const port = process.env.PORT || 19024;

  var server = require('http').createServer(function(req, res) {
    static_file.serve(req, res);
  }).listen(port, function() {
    console.log('elemon server listening on port ' + port + '..');
  });
  var io = require('socket.io')({
    transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling']
  }).listen(server);

  var watch_opts = {
    ignored: [/[\/\\]\./, 'node_modules', '.git'],
    persistent: true
  };

  function terminate_elec_proc(elec_proc, callback) {
    if (running(elec_proc.pid)) {
      try {
        elec_proc.stdin.end();
        process.kill(-elec_proc.pid);
      } catch(err) {
        return callback(err);
      }
      return callback(null);
    } else {
      callback(null);
    }
  }

  var watcher = chok.watch('.', watch_opts);
  var g_elec_proc = spawn(ELEC_BIN, [ELEC_BIN_ARG], {detached: true});

  g_elec_proc.stderr.on('data', function(data) {
    if (data !== null) {
      console.error('|\n-> elemon err:\n' + data.toString());
      console.log('|\n-> elemon err: please provide a valid argument for electron');
      terminate_elec_proc(g_elec_proc, function(err) {
        if (err !== null) {
          throw new Error('|\n-> elemon err:\n' + err);
        } else {
          console.log();
          process.exit(0);
        }
      });
    }
  });

  g_elec_proc.on('exit', function(code, sig) {
    if (sig === null && code !== null) {
      console.log('|\n-> elemon: electron app exited with code: ', code);
      terminate_elec_proc(g_elec_proc, function(err) {
        if (err !== null) {
          throw new Error('|\n-> elemon err:\n' + err);
        } else {
          console.log();
          process.exit(0);
        }
      });
    } else if (sig === null && code === null) {
      terminate_elec_proc(g_elec_proc, function(err) {
        if (err !== null) {
          throw new Error('|\n-> elemon err:\n' + err);
        } else {
          console.log();
          process.exit(0);
        }
      });
    }
  });

  process.on('SIGINT', function() {
    terminate_elec_proc(g_elec_proc, function(err) {
      if (err !== null) {
        throw new Error('|\n-> elemon err:\n' + err);
      } else {
        console.log();
        process.exit(0);
      }
    });
  });

  process.on('SIGTERM', function() {
    terminate_elec_proc(g_elec_proc, function(err) {
      if (err !== null) {
        throw new Error('|\n-> elemon err:\n' + err);
      } else {
        console.log();
        process.exit(0);
      }
    });
  });

  process.on('SIGHUP', function() {
    terminate_elec_proc(g_elec_proc, function(err) {
      if (err !== null) {
        throw new Error('|\n-> elemon err:\n' + err);
      } else {
        console.log();
        process.exit(0);
      }
    });
  });

  io.on('connection', function(socket) {
    socket.on('appdata', function(data) {
      var wins = data.browserWindows;
      var main_script = data.main_script;
      watcher.on('change', function(file) {
        var wins_to_reload = [];
        if (path.basename(file) === main_script) {
          terminate_elec_proc(g_elec_proc, function(err) {
            if (err !== null) {
              throw new Error('|\n-> elemon err:\n' + err);
            } else {
              g_elec_proc = spawn(ELEC_BIN, [ELEC_BIN_ARG], {detached: true});
            }
          });
        } else {
          wins.forEach(function(win) {
            if (win.resources.indexOf(path.basename(file)) !== -1 && wins_to_reload.indexOf(win.id) === -1) {
              wins_to_reload.push(win.id);
            }
          });
          socket.emit('reload', {
            win_ids: wins_to_reload
          });
        }
      });
    });
  });
}());

