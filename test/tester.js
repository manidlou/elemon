'use strict';

const chok = require('chokidar');
const running = require('is-running');
const path = require('path');
const fs = require('fs');
const cp_exec = require('child_process').exec;
const expect = require('chai').expect;
const elemon_server = path.resolve('..', '/elemon.js');
const elemon_terminate_func = require('../elemon-client.js');

describe("run the test app and set up the watcher", function() {
  var elemon_proc_script = 'node ' + elemon_server + ' electron test/testapp';
  var main_script = '/testapp/app.js';
  var main_win = '/testapp/view/windows/main-win/mainwin.html';
  var second_win = '/testapp/view/windows/second-win/secwin.html';
  var second_win_controller = '/testapp/view/windows/second-win/secwin-controller.js';
  var elemon_proc = cp_exec(elemon_proc_script, {detached: true});
  var opts = {
    ignored: [/[\/\\]\./, 'node_modules'],
    persistent: true
  };
  var watcher = chok.watch('.', opts);
  it("after changing the main window file (mainwin.html), should reload only the main window", function(done) {
    fs.appendFileSync(path.join(__dirname, main_win), '\n<p>test text appended to main window file</p>\n', 'utf8');
    watcher.on('change', function(file) {
      expect(path.basename(file)).to.equal(path.basename(main_win))
        .and.not.equal(path.basename(second_win))
        .and.not.equal(path.basename(main_script));
    }); 
    done();
  });

  it("after changing the second window file (secwin.html), should reload only the second window", function(done) {
    fs.appendFileSync(path.join(__dirname, second_win), '\n<p>test text appended to second window file</p>\n', 'utf8');
    watcher.on('change', function(file) {
      expect(path.basename(file)).to.equal(path.basename(second_win))
        .and.not.equal(path.basename(main_win))
        .and.not.equal(path.basename(main_script));
    });
    done();
  });

  it("after changing the second window controller (secwin-controller.js), should reload only the second window", function(done) {
    fs.appendFileSync(path.join(__dirname, second_win_controller), '\n//test text appended to second window controller file\n', 'utf8');
    watcher.on('change', function(file) {
      expect(path.basename(file)).to.equal(path.basename(second_win))
        .and.not.equal(path.basename(main_win))
        .and.not.equal(path.basename(main_script));
    });
    done();
  });

  it("after changing the main app file (app.js), should reload the entire app", function(done) {
    fs.appendFileSync(path.join(__dirname, main_script), '\n//test text appended to main app file\n', 'utf8');
    watcher.on('change', function(file) {
      expect(path.basename(file)).to.equal(path.basename(main_script))
        .and.equal(path.basename(main_win))
        .and.equal(path.basename(second_win));
    });

    if (running(elemon_proc.pid)) {
      elemon_proc.stdin.end();
      elemon_proc.kill('SIGTERM');
      elemon_proc.on('exit', function() {
        done();
      });
    } else {
      elemon_proc.stdin.end();
      done();
    }
  });
});

describe('test elemon terminate process function', function() {
  var elemon_proc_script = 'node ' + elemon_server + ' electron test/testapp';
  var elemon_proc = cp_exec(elemon_proc_script, {detached: true});
  it ('after terminating, process pid should equal to false', function(done) {
    elemon_terminate_func.terminate(elemon_proc, function(err) {
      if (err === null) {
        expect(running(elemon_proc.pid)).to.equal(false);
      }
    });
    if (running(elemon_proc.pid)) {
      elemon_proc.stdin.end();
      elemon_proc.kill('SIGTERM');
      elemon_proc.on('exit', function() {
        done();
      });
    } else {
      done();
    }
  });
});

describe("if bad argument like null argument provided for electron bin", function() {
  var elemon_proc_script_bad_arg = 'node ' + elemon_server + ' electron';
  it("should catch the bad argument error", function(done) {
    var elemon_proc = cp_exec(elemon_proc_script_bad_arg, {detached: true});
    elemon_proc.on('error', function() {
      expect(elemon_proc).to.throw(Error);
    });
    done();
  });
});

