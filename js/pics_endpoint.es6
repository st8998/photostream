let fs = require('fs')
let stream = require('stream')
let es = require('event-stream')
let router = require('express').Router()
let sharp = require('sharp')

let {each} = require('lodash')

let Pic = require('./pic')


router.get('/', function(req, res) {
  if (!req.accepts('application/json')) return res.status(406).end()

  res.type('json')

  fs.readdir(Pic.rootDir, function(err, files) {
    es.readArray(files)
      .pipe(es.map((data, cb)=> {
        let pic = new Pic({fileName: data})

        sharp(pic.path()).metadata((err, metadata)=> {
          pic.width = metadata.width
          pic.height = metadata.height

          cb(null, JSON.stringify(pic.asJson()))
        })

      }))
      .pipe(es.join(','))
      .pipe(es.map((data, cb)=> cb(null, `[${data}]`)))
      .pipe(res)
  })
})

module.exports = router