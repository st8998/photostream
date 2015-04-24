import Pic from 'pic'
import { map, partialRight } from 'lodash'
import { reader } from 'transit'

export default /*@ngInject*/ function() {
  let picsPromise

  return {
    all: function() {
      return picsPromise = picsPromise || picsPromise || fetch('/pics')
          .then(function(res) {
            if (res.status >= 200 && res.status < 300) {
              return Promise.resolve(res)
            } else {
              return Promise.reject(new Error(res.statusText))
            }
          })
          .then((res)=> res.text())
          .then((text)=> {
            return reader.read(text)
          })
          .then(partialRight(map, Pic.fromJson))
    }
  }
}