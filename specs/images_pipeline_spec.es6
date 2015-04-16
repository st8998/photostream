let assert = require('chai').assert
let express = require('express')
let request = require('supertest')

let Pic = require('../js/pic')
let imagesPipeline = require('../js/images_pipeline')

describe('Images Pipeline', function() {
  let pic
  let trans
  let app = express()
  app.use('/-/images', imagesPipeline)

  beforeEach(function() {
    trans = {resize: [100,100], sharpen: []}
    pic = new Pic({fileName: 'test.jpg', trans: trans})
  })

  it('returns image for proper hash requests', function(end) {
    request(app).get('/-/images/' + pic.encode()).expect(200).end(end)
  })

  it('returns 404 for missed images', function(end) {
    pic.fileName = 'no_such_file.jpg'
    request(app).get('/-/images/' + pic.encode()).expect(404).end(end)
  })

  it('returns 400 for corrupted or missed hash', function(end) {
    request(app).get('/-/images/' + 'some-shitty-hash').expect(400).end(end)
  })
})