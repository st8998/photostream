import Pic from 'pic'
import { map, partialRight, memoize } from 'lodash'
import { reader } from 'transit'

export default /*@ngInject*/ function() {
  return {
    all: memoize(function(folder = '') {
      return fetch('/pics/' + folder)
        .then(function(res) {
          if (res.status >= 200 && res.status < 300) {
            return Promise.resolve(res)
          } else {
            return Promise.reject(new Error(res.statusText))
          }
        })
        .then((res)=> res.text())
        .then(reader.read.bind(reader))
        .then(partialRight(map, Pic.fromJson))
    })
  }
}