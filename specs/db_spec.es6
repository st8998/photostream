import { assert } from 'chai'
import { pics } from '../js/db'
import Pic from '../js/pic'

pics.then(function(pics) {
  describe('db', function() {
    describe('pics', function() {
      it('just works', function() {
        let pic = new Pic({fileName: 'test.jpg'})

        pics.insert(pic)
        assert.equal(pics.findOne({id: pic.id}), pic)
      })

      it('scan root image folder for pics', function() {
        let testPic = new Pic({fileName: 'test/test.jpg'})
        assert.equal(pics.find({id: testPic.id}).length, 1)
      })

      it('returns array of pics', function() {
        assert.isArray(pics.chain().simplesort('date').data())
      })
    })
  })
})

