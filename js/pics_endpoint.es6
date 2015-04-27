import { Router } from 'express'
import { writer } from './transit'
import { pics } from './db'

let router = Router()

router.get('/:folder?', function(req, res) {
  if (!req.accepts('application/transit+json')) return res.status(406).end()

  res.type('application/transit+json')

  pics.then(function(pics) {
    res.end(writer.write(
      pics.chain()
        .where((pic)=> pic.fileName.indexOf(req.params.folder || '') != -1)
        .simplesort('date', true)
        .data()
    ))
  })

})

export default router
