import fs from 'fs'
import loki from 'lokijs'

import Pic from './pic'
import sharp from 'sharp'
import readdir from 'recursive-readdir'
import moment from 'moment'
import es from 'event-stream'

import { chain } from 'lodash'

let db = new loki('photostream', {
  autosave: false
})


export const pics = new Promise(function(resolve, reject) {
  let collection = db.addCollection('pics', {})

  function applyDate(pic, cb) {
    let match
    if (match = pic.fileName.match(/(\d{12})-.*\.jpg/)) {
      pic.date = moment(match[1], 'YYYYMMDDHHmm')
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

  readdir(Pic.rootDir, function(err, files) {
    let pics = chain(files)
      .filter((fileName)=> fileName.match(/(jpg|png|gif)$/))
      .map((fileName)=> new Pic({fileName: fileName.substring(Pic.rootDir.length, 1000)}))

    es.readArray(pics.value())
      .pipe(es.map(applyDate))
      .pipe(es.map(applyDims))
      .on('data', function(pic) {
        collection.insert(pic)
      })
      .on('end', function() {
        resolve(collection)
      })
  })
})



