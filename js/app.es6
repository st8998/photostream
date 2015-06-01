import moment from 'moment'
import React from 'react/dist/react.min'
import Rx from 'rx/dist/rx.lite'

import { fetchTransit } from 'transit'

import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default'

import Pic from 'pic'

import { find, merge, findIndex } from 'lodash'
let { max } = Math

let photostream = React.createFactory(require('components/photostream'))


// load waypoints library globally
import 'waypoints/lib/noframework.waypoints'

// polyfills
require('whatwg-fetch')
require('es6-promise').polyfill()

moment.defaultFormat = 'YYYY-MM-DD'

let bus = new Rx.Subject()
let hasMore = true // UGLY shared variable

let loadBus = bus
  .filter(({action})=> action == 'load' && hasMore)
  .distinctUntilChanged()
  .flatMap(({action, since})=>
    Rx.Observable.fromPromise(
      fetchTransit(`/pics?from=${since}`)))
  .publish()

loadBus.filter((pics)=> pics.length == 0).forEach(()=> hasMore = false)

let picsBus = loadBus.scan((pics, loadedPics)=> pics.concat(loadedPics))

// RENDER STREAM
picsBus.forEach(function(pics) {
  React.render(photostream({pics, es: bus}), document.getElementsByTagName('photostream')[0])
})

loadBus.connect()
bus.onNext({action: 'load', since: ''})


bus.filter(({action})=> action == 'open-gallery').withLatestFrom(picsBus, (opts, pics)=> merge(opts, {pics}))
  .forEach(function({pics, pic, from, index}) {
    let gallery = new PhotoSwipe(document.getElementsByClassName('pswp')[0], PhotoSwipeUI, pics, {
      barsSize: {top: 0, bottom: 0},
      index: findIndex(pics, {fileName: pic.fileName}),
      history: false,
      showHideOpacity: true,
      getThumbBoundsFn: ()=> from
    })

    let updateSubscription = loadBus.forEach(function(loadedPics) {
      Array.prototype.push.apply(gallery.items, loadedPics)
      gallery.ui.update()
    })

    gallery.listen('close', function() {
      updateSubscription.dispose()
    })

    gallery.listen('gettingData', function(index, pic) {
      if (gallery.getCurrentIndex()+20 > gallery.items.length) bus.onNext({action: 'load', since: gallery.items[gallery.items.length-1].date.valueOf()})

      let viewSize = max(gallery.viewportSize.x, gallery.viewportSize.y)

      let size = find(Pic.sizes, (size)=> size >= viewSize) || Pic.sizes[Pic.sizes.length - 1]

      pic.src = pic.url({resize: pic.width > pic.height ? [size, null] : [null, size]});
      [pic.w, pic.h] = pic.width > pic.height ? [size, size * pic.height / pic.width] : [size * pic.width / pic.height, size]
    })

    gallery.init()
  })
