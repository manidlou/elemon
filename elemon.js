#!/usr/bin/env node

/*!
 * elemon.js
 * This software is released under the MIT license:
 * 
 * Copyright (c) <2016> <Mawni Maghsoudlou>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * elemon is a tiny module that monitors an electron application and
 * automatically reloads the application upon any changes.
 */

'use strict';

const watch = require('node-watch');
const spawn = require('child_process').spawn;
const ELEC_BIN = './node_modules/.bin/electron';

var elec_proc = spawn(ELEC_BIN, ['.'], {detached: true});

elec_proc.stderr.on('data', function(data) {
  console.log('|\n--> elemon error: ', data);
  process.exit(0);
});

elec_proc.on('error', function(err) {
  console.log('|\n--> elemon error: something went wrong -> ', err);
  process.exit(0);
});

watch(process.cwd(), function(file) {
  elec_proc.stderr.on('data', function(data) {
    console.log('|\n--> elemon error: ', data);
    process.exit(0);
  });
  elec_proc.on('error', function(err) {
    console.log('|\n--> elemon error: something went wrong -> ', err);
    process.exit(0);
  });
  elec_proc.stdin.end();
  process.kill(-elec_proc.pid);
  elec_proc = spawn(ELEC_BIN, ['.'], {detached: true});
  console.log('|\n--> elemon: electron reloaded due to [' + file + ']');
});

