let assert = require('chai').assert
let express = require('express')
let request = require('supertest')
let sharp = require('sharp')

let {findIndex, each} = require('lodash')

let Pic = require('../js/pic')

let app = express()
app.use('/', require('../js/pics_endpoint'))

describe('Pics Endpoint', function() {
  it('returns proper headers for json requests', function(end) {
    request(app).get('/').set('Accept', 'application/json')
      .expect('Content-Type', 'application/json').expect(200, end)
  })

  it('returns 406 for not json requests', function(end) {
    request(app).get('/').set('Accept', 'text/html')
      .expect(406, end)
  })

  it('returns pics from sub directories', function(end) {
    request(app).get('/').set('Accept', 'application/json')
      .expect(200)
      .end((err, res)=> {
        assert.notEqual(findIndex(res.body, (attrs)=> attrs.fileName == 'test.jpg'), -1)
        assert.notEqual(findIndex(res.body, (attrs)=> attrs.fileName == 'test/test.jpg'), -1)

        end()
      })
  })
})