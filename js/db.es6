import fs from 'fs'
import loki from 'lokijs'

import Pic from './pic'
import readdir from 'recursive-readdir'
import moment from 'moment'
import es from 'event-stream'
import config from './config'
import chokidar from 'chokidar'
import sizeOf from 'image-size'

import { chain, assign, noop } from 'lodash'

function initDB(db) {
  return new Promise(function(resolve, reject) {
    if (fs.existsSync(db.filename)) {
      db.loadDatabase({
        pics: {
          proto: Pic,
          inflate: function(src, dst) {
            assign(dst, src)
            dst.date = moment(src.date)
          }
        }
      }, function() {
        resolve(db)
      })
    } else {
      db.addCollection('pics', {})
      resolve(db)
    }
  })
}

function sync(fn) {
  let queue = []
  let inAction = false

  function next() {
    inAction = false

    if (queue.length) {
      inAction = true
      fn.apply(this, queue.shift())
    }
  }

  return function(...args) {
    queue.push([next].concat(args))
    if (!inAction) next()
  }
}

export const pics = new Promise(function(resolve, reject) {
  initDB(new loki(config.db.name, config.db)).then(function(db) {
    let collection = db.getCollection('pics', {indices: ['fileName']})

    function applyDate(pic) {
      let match
      if (match = pic.fileName.match(/(\d{12})-.*\.jpg/)) {
        pic.date = moment(match[1], 'YYYYMMDDHHmm')
      } else if (match = pic.fileName.match(/(\d{8})-.*\.jpg/)) {
        pic.date = moment(match[1], 'YYYYMMDD')
      } else {
        pic.date = fs.statSync(pic.path()).ctime
      }

      pic.timestamp = pic.date.valueOf()
    }

    function applyDims(pic) {
      assign(pic, sizeOf(pic.path()))
    }

    // add/remove/change watcher
    let watcher = chokidar.watch(Pic.rootDir + '**/*')

    watcher.on('add', sync(function(next, path) {
      let pic = new Pic({fileName: path.substring(Pic.rootDir.length)})

      if (!path.match(/(jpg|png|gif)$/)) return next()
      if (collection.findOne({fileName: pic.fileName})) return next()

      try {
        applyDate(pic, noop)
        applyDims(pic, noop)

        collection.insert(pic)
      } catch(e) {
        console.error(e)
      }
      finally {
        next()
      }
    }))

    watcher.on('unlink', function(path) {
      let pic = new Pic({fileName: path.substring(Pic.rootDir.length)})
      collection.removeWhere({fileName: pic.fileName})

      db.saveDatabase()
    })

    watcher.on('ready', function() {
      resolve(collection)
    })
  })
})



