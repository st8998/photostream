import { Router } from 'express'
import { writer } from './transit'
import { pics } from './db'
import moment from 'moment'

let router = Router()

router.get('/:folder?', function(req, res) {
  if (!req.accepts('application/transit+json')) return res.status(406).end()

  res.type('application/transit+json')

  pics.then(function(pics) {
    let query = pics.chain()
            .where((pic)=> pic.fileName.indexOf(req.params.folder || '') == 0)

    if (req.query.from)
      query = query.find({'timestamp': {'$lt': parseInt(req.query.from)}})

    query = query.simplesort('date', true).limit(req.query.limit || 50)

    res.end(writer.write(query.data()))
  })

})

export default router
