#!/usr/bin/env node

/*!
 * elemon.js
 * 
 * Copyright (c) 2016 Mawni Maghsoudlou
 * Released under the MIT license
 */

/**
 * elemon is a live-reload tool for developing electron application.
 * It monitors an electron application during development and
 * automatically reloads it upon any changes.
 */

'use strict';

const chok = require('chokidar');
const path = require('path');

function elemon(app, wins) {
  var watch_opts = {
    ignored: [/[\/\\]\./, 'node_modules', '.git'],
    persistent: true
  };
  var watcher = chok.watch('.', watch_opts);
  watcher.on('change', (f) => {
    if (f === app.res) {
      app.id.relaunch();
      app.id.exit(0);
    } else {
      wins.forEach((win) => {
        if (win.res.indexOf(path.basename(f)) !== -1) {
          win.id.reload();
        }
      });
    }
  });
}
module.exports = elemon;
