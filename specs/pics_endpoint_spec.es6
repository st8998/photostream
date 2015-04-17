let assert = require('chai').assert
let express = require('express')
let request = require('supertest')
let sharp = require('sharp')

let Pic = require('../js/pic')

let app = express()
app.use('/', require('../js/pics_endpoint'))

describe('Pics Endpoint', function() {
  it('returns proper headers for json requests', function(end) {
    request(app).get('/').set('Accept', 'application/json').expect(200, end)
  })
  it('returns 406 for not json requests', function(end) {
    request(app).get('/').set('Accept', 'text/html').expect(406, end)
  })
})