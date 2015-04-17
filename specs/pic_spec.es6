let _ = require('lodash')
let assert = require('chai').assert

let Pic = require('../js/pic')

describe('Pic', function() {
  it('creates instances from json', function() {
    let pic = Pic.fromJson({fileName: 'test.jpg', height: 100, width: 100})
    assert.equal(pic.fileName, 'test.jpg')
    assert.equal(pic.width, 100)
    assert.equal(pic.height, 100)
  })

  describe('encode/decode', function() {
    let hash
    let trans

    beforeEach(function() {
      trans = {resize: [100,100], sharpen: ''}
      hash = new Pic({fileName: 'test.jpg'}).encode(trans)
    })

    it('encode to url string', function() {
      assert.typeOf(hash, 'string')
      assert.notEqual(hash.length, 0)
    })

    it('decodes encoded string', function() {
      assert.deepEqual(Pic.decode(hash).trans, trans, 'trans decoding')
      assert.equal(Pic.decode(hash).fileName, 'test.jpg', 'filename decoding')
    })
  })
})