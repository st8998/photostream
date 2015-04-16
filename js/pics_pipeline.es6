let {reduce} = require('lodash')
let express = require('express')
let sharp = require('sharp')

let fs = require('fs')

let Pic = require('./pic')

let picFolder = './pics/'
let router = express.Router()

router.get('/:hash', function(req, res) {
  try {
    let pic = Pic.decode(req.params.hash)

    reduce(
      pic.trans,
      (pipeline, attrs, method)=> pipeline[method].apply(pipeline, attrs),
      sharp(picFolder + pic.fileName))
      .on('error', (err)=> res.status(404).end())
      .pipe(res)

  } catch(e) {
    res.status(400).end()
  }
})

module.exports = router