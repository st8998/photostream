let _ = require('lodash')
let assert = require('chai').assert

let Pic = require('../js/pic')

describe('Pic', function() {
  describe('encode/decode', function() {
    let hash
    let trans

    beforeEach(function() {
      trans = {resize: [100,100], sharpen: true}
      hash = new Pic({fileName: 'some_shitty.jpg', trans: trans}).encode()
    })

    it('encode to url string', function() {
      assert.typeOf(hash, 'string')
      assert.notEqual(hash.length, 0)
    })

    it('decodes encoded string', function() {
      assert.deepEqual(Pic.decode(hash).trans, trans)
    })
  })
})