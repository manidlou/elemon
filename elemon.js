'use strict';
const chok = require('chokidar');
const path = require('path');

function elemon(main, wins) {
  var watch_opts = {
    ignored: [/[\/\\]\./, 'node_modules', '.git'],
    persistent: true
  };
  var watcher = chok.watch('.', watch_opts);
  watcher.on('change', (f) => {
    if (main.app && main.res && main.res === f) {
      main.app.relaunch();
      main.app.exit(0);
    } else {
      if (wins && Array.isArray(wins) && wins.length > 0) {
        wins.forEach((win) => {
          if (win.bw && win.res && Array.isArray(win.res) && win.res.indexOf(path.basename(f)) !== -1) {
            win.bw.reload();
          }
        });
      }
    }
  });
}

module.exports = elemon;
