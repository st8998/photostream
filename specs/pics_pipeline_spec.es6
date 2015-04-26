let assert = require('chai').assert
let express = require('express')
let request = require('supertest')
let sharp = require('sharp')

let Pic = require('../js/pic')

let app = express()
app.use('/-/pics', require('../js/pics_pipeline'))

function binaryParser(res, callback) {
  res.setEncoding('binary')
  res.data = ''
  res.on('data', function(chunk) {
    res.data += chunk
  });
  res.on('end', function() {
    callback(null, new Buffer(res.data, 'binary'))
  })
}

describe('Images Pipeline', function() {
  let pic
  let trans

  beforeEach(function() {
    trans = {resize: [100, 100], sharpen: []}
    pic = new Pic({fileName: 'test/test.jpg'})
  })

  it('returns 200 for proper hash requests', function(end) {
    request(app).get('/-/pics/' + pic.encode(trans)).expect(200).end(end)
  })

  it('returns transformed image for proper hash requests', function(end) {
    request(app)
      .get('/-/pics/' + pic.encode(trans))
      .expect(200)
      .parse(binaryParser)
      .end((err, res)=> {
        sharp(res.body).metadata((err, metadata)=> {
          assert.equal(metadata.width, trans.resize[0])
          assert.equal(metadata.height, trans.resize[1])

          end()
        })
      })
  })

  it('returns 404 for missed images', function(end) {
    pic.fileName = 'no_such_file.jpg'
    request(app).get('/-/pics/' + pic.encode(trans)).expect(404).end(end)
  })

  it('returns 400 for corrupted or missed hash', function(end) {
    request(app).get('/-/pics/' + 'some-shitty-hash').expect(400).end(end)
  })
})