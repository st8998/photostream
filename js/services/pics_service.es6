import Pic from 'pic'
import { map, partialRight } from 'lodash'

export default function() {
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
          .then((res)=> res.json())
          .then(partialRight(map, Pic.fromJson))
    }
  }
}