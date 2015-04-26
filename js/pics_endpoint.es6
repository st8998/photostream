let fs = require('fs')
let stream = require('stream')
let es = require('event-stream')
let router = require('express').Router()
let sharp = require('sharp')
let readdir = require('recursive-readdir')
let through = require('through2')
let moment = require('moment')

let writer = require('./transit').writer

import Pic from './pic'
import { chain } from 'lodash'

function joinArray() {
  let arr = []

  return es.through(
    arr.push.bind(arr),
    function () {
      this.emit('data', arr)
      this.emit('end')
    }
  )
}

function readDate(pic) {
  let match
  if (match = pic.fileName.match(/(\d{12})-.*\.jpg/)) {
    return moment(match[1], 'YYYYMMDDHHmm')
  } else {
    return fs.statSync(pic.path()).ctime
  }
}

router.get('/', function(req, res) {
  if (!req.accepts('application/transit+json')) return res.status(406).end()

  res.type('application/transit+json')

  readdir(Pic.rootDir, function(err, files) {

    let pics = chain(files)
      .filter((fileName)=> fileName.match(/(jpg|png|gif)$/))
      .map((fileName)=> new Pic({fileName: fileName.substring(Pic.rootDir.length, 1000)}))
      .each((pic)=> pic.date = readDate(pic))
      .sortBy('fileName')
      .reverse()

    es.readArray(pics.value())
      .pipe(es.map((pic, cb)=> {
        sharp(pic.path()).metadata((err, metadata)=> {
          pic.width = metadata.width
          pic.height = metadata.height

          cb(null, pic)
        })
      }))
      .pipe(joinArray())
      .pipe(through.obj(function(arr, enc, cb) {
        this.push(writer.write(arr))
        cb()
      }))
      .pipe(res)
  })
})

module.exports = router