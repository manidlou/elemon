'use strict'

const path = require('path')
const chok = require('chokidar')

function elemon (ref) {
  const watchOpts = {
    ignored: [/(^|[/\\])\../, 'node_modules', '.git'],
    persistent: true
  }
  const watcher = chok.watch('.', watchOpts)
  watcher.on('change', f => {
    if (ref.app && ref.mainFile && ref.mainFile === f) {
      ref.app.relaunch()
      ref.app.exit(0)
    } else {
      if (ref.bws && ref.bws.length > 0) {
        ref.bws.forEach(win => {
          if (win.bw && win.res && (win.res.indexOf(path.basename(f)) > -1 || win.res.length === 0)) {
            win.bw.reload()
          }
        })
      }
    }
  })
}

module.exports = elemon
