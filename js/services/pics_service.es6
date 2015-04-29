import Pic from 'pic'
import { map, partialRight, partial, wrap, each, chain } from 'lodash'
import { reader, writer } from 'transit'

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

function updateState(folder, pics) {
  history.replaceState({pics: {[folder]: writer.write(pics)}}, '', location.pathname)
  return pics
}

export default /*@ngInject*/ function() {
  let folders = {}

  if (history.state && history.state.pics) {
    console.log('RESTORE STATE')
    each(history.state.pics, (pics, folder)=> folders[folder] = Promise.resolve(reader.read(pics)))
  }


  return {
    all: wrap(function(folder = '') {
      return fetchTransit('/pics/' + folder).then(partial(updateState, folder))
    }, function(func, folder) {
      return folders[folder] = folders[folder] || func(folder)
    }),

    loadMore: function(folder = '') {
      return new Promise((resolve)=> {
        folders[folder] = this.all(folder).then((pics)=> {
          if (!pics.length)
            return resolve(false) && folders[folder]

          return fetchTransit(`/pics/${folder}?from=${pics[pics.length-1].date.valueOf()}`)
            .then((newPics)=> {
              resolve(newPics.length != 0)
              return pics.concat(newPics)
            }).then(partial(updateState, folder))
        })
      })
    }
  }
}