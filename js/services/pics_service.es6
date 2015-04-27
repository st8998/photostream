import Pic from 'pic'
import { map, partialRight, wrap } from 'lodash'
import { reader } from 'transit'

function fetchTransit() {
  return fetch.apply(this, arguments)
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
}

export default /*@ngInject*/ function() {
  let folders = {}

  return {
    all: wrap(function(folder = '') {
      return fetchTransit('/pics/' + folder)
    }, function(func, folder) {
      return folders[folder] = folders[folder] || func(folder)
    }),

    loadMore: function(folder = '') {
      return new Promise((resolve)=> {
        folders[folder] = this.all(folder).then((pics)=> {
          return fetchTransit(`/pics/${folder}?from=${pics[pics.length-1].date.valueOf()}`)
            .then((newPics)=> {
              resolve(newPics.length != 0)
              return pics.concat(newPics)
            })
        })
      })
    }
  }
}