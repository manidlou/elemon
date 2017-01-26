'use strict'
const chok = require('chokidar')
const path = require('path')

function elemon (dat) {
  var watchOpts = {
    ignored: [/(^|[/\\])\../, 'node_modules', '.git'],
    persistent: true
  }
  var watcher = chok.watch('.', watchOpts)
  watcher.on('change', (f) => {
    if (dat.app && dat.mainFile && dat.mainFile === f) {
      dat.app.relaunch()
      dat.app.exit(0)
    } else {
      if (dat.bws && Array.isArray(dat.bws) && dat.bws.length > 0) {
        dat.bws.forEach((win) => {
          if (win.bw && win.res && Array.isArray(win.res) && (win.res.indexOf(path.basename(f)) !== -1 || win.res.length === 0)) {
            win.bw.reload()
          }
        })
      }
    }
  })
}

module.exports = elemon
