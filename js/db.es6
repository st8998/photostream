import fs from 'fs'
import loki from 'lokijs'

import Pic from './pic'
import sharp from 'sharp'
import readdir from 'recursive-readdir'
import moment from 'moment'
import es from 'event-stream'

import { chain, assign } from 'lodash'

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


export const pics = new Promise(function(resolve, reject) {
  initDB(new loki('photostream')).then(function(db) {
    let collection = db.getCollection('pics', {})

    function applyDate(pic, cb) {
      let match
      if (match = pic.fileName.match(/(\d{12})-.*\.jpg/)) {
        pic.date = moment(match[1], 'YYYYMMDDHHmm')
      } else if (match = pic.fileName.match(/(\d{8})-.*\.jpg/)) {
        pic.date = moment(match[1], 'YYYYMMDD')
      } else {
        pic.date = fs.statSync(pic.path()).ctime
      }

      pic.timestamp = pic.date.valueOf()
      cb(null, pic)
    }

    function applyDims(pic, cb) {
      sharp(pic.path()).metadata((err, metadata)=> {
        if (err) return cb()

        pic.width = metadata.width
        pic.height = metadata.height

        cb(null, pic)
      })
    }

    function filterScanned(pic, cb) {
      if (collection.findOne({fileName: pic.fileName})) {
        cb()
      } else {
        cb(null, pic)
      }
    }

    readdir(Pic.rootDir, function(err, files) {
      let pics = chain(files)
        .filter((fileName)=> fileName.match(/(jpg|png|gif)$/))
        .map((fileName)=> new Pic({fileName: fileName.substring(Pic.rootDir.length, 1000)}))

      es.readArray(pics.value())
        .pipe(es.map(filterScanned))
        .pipe(es.map(applyDate))
        .pipe(es.map(applyDims))
        .on('data', function(pic) {
          collection.insert(pic)
        })
        .on('end', function() {
          db.saveDatabase()
          resolve(collection)
        })
    })
  })
})



