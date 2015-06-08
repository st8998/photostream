let { reduce } = require('lodash')
let express = require('express')
let sharp = require('sharp')

let fs = require('fs')
let ms = require('ms')

let Pic = require('./pic')

let router = express.Router()

import { crc32 } from 'crc'

process.env.UV_THREADPOOL_SIZE = 1
sharp.concurrency(1)
sharp.cache(0, 0)

router.get('/:hash', function(req, res) {
  try {
    let pic = Pic.decode(req.params.hash)

    res.set('Cache-Control', `public, max-age=${ms('1 year')}`)
    res.set('etag', crc32(req.params.hash))

    if (req.fresh) return res.status(304).end()

    reduce(
      pic.trans,
      (pipeline, attrs, method)=> pipeline[method].apply(pipeline, attrs),
      sharp(pic.path()).withMetadata().quality(100))
      .on('error', (err)=> res.status(404).end())
      .pipe(res)

  } catch(e) {
    res.status(400).end()
  }
})

module.exports = router