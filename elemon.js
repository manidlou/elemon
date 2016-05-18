#!/usr/bin/env node

/*!
 * elemon.js
 * 
 * Copyright (c) 2016 Mawni Maghsoudlou
 * Released under the MIT license
 */

/**
 * elemon is a tiny module that monitors an electron application and
 * automatically reloads the application upon any changes.
 */

(function() {
  'use strict';

  const watch = require('node-watch');
  const spawn = require('child_process').spawn;
  const ELEC_BIN = './node_modules/.bin/electron';

  var elec_proc = spawn(ELEC_BIN, ['.'], {detached: true});

  elec_proc.on('error', function(err) {
    console.log('|\n-> elemon error: failed to start electron main process -> ', err);
    elec_proc.stdin.end();
    process.kill(-elec_proc.pid);
    process.exit(0);
  });

  process.on('SIGINT', function() {
    elec_proc.stdin.end();
    process.kill(-elec_proc.pid);
    process.exit(0);
  });

  process.on('SIGTERM', function() {
    elec_proc.stdin.end();
    process.kill(-elec_proc.pid);
    process.exit(0);
  });

  elec_proc.stderr.on('data', function(data) {
    console.log('|\n-> elemon error: ', data);
    elec_proc.stdin.end();
    process.kill(-elec_proc.pid);
    process.exit(0);
  });

  watch(process.cwd(), function() {
    elec_proc.stdin.end();
    process.kill(-elec_proc.pid);
    elec_proc = spawn(ELEC_BIN, ['.'], {detached: true});
  });
}());
