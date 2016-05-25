/*!
 * elemon-client.js
 * 
 * Copyright (c) 2016 Mawni Maghsoudlou
 * Released under the MIT license
 */

/**
 * elemon-client is the client module for elemon server
 */

'use strict';

const port = process.env.PORT || 19024;
const client_socket = require('socket.io-client')('http://localhost:' + port);
const running = require('is-running');

function reload(wins, data) {
  var win_ids = data.win_ids;
  wins.forEach(function(win) {
    if (win_ids.indexOf(win.id) !== -1) {
      win.reload();
      win_ids.splice(win_ids.indexOf(win.id), 1);
    }
  });
}

function terminate_proc(spawned_proc, callback) {
  if (running(spawned_proc.pid)) {
    try {
      spawned_proc.stdin.end();
      process.kill(-spawned_proc.pid);
    } catch(err) {
      return callback(err);
    }
    return callback(null);
  } else {
    callback(null);
  }
}

module.exports = {
  socket: client_socket,
  reload: reload,
  terminate: terminate_proc
};
