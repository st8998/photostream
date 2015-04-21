let fs = require('fs')
let stream = require('stream')
let es = require('event-stream')
let router = require('express').Router()
let sharp = require('sharp')
let readdir = require('recursive-readdir')

let {each} = require('lodash')

let Pic = require('./pic')

let joinArray = function() {
  let arr = []

  return es.through(
    arr.push.bind(arr),
    function () {
      this.emit('data', arr)
      this.emit('end')
    }
  )
}


router.get('/', function(req, res) {
  if (!req.accepts('application/json')) return res.status(406).end()

  res.type('json')

  readdir(Pic.rootDir, function(err, files) {
    es.readArray(files)
      .pipe(es.map((fileName, cb)=> {
        let pic = new Pic({fileName: fileName.substring(Pic.rootDir.length, 1000)})

        sharp(pic.path()).metadata((err, metadata)=> {
          pic.width = metadata.width
          pic.height = metadata.height

          cb(null, pic.asJson())
        })

      }))
      .pipe(joinArray())
      .pipe(es.stringify())
      .pipe(res)
  })
})

module.exports = router