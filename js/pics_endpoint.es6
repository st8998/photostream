let fs = require('fs')
let stream = require('stream')
let es = require('event-stream')
let router = require('express').Router()
let sharp = require('sharp')
let readdir = require('recursive-readdir')
let through = require('through2')

let writer = require('./transit').writer

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
  if (!req.accepts('application/transit+json')) return res.status(406).end()

  res.type('application/transit+json')

  readdir(Pic.rootDir, function(err, files) {
    es.readArray(files)
      .pipe(es.map((fileName, cb)=> {
        if (fileName.match(/(jpg|png|gif)$/)) {
          let pic = new Pic({fileName: fileName.substring(Pic.rootDir.length, 1000)})

          sharp(pic.path()).metadata((err, metadata)=> {
            pic.width = metadata.width
            pic.height = metadata.height
            pic.date = fs.statSync(pic.path()).ctime

            cb(null, pic)
          })
        } else {
          cb() // drop all non image files
        }
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