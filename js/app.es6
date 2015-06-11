import moment from 'moment'
import React from 'react'
import Most from 'most'
import Events from 'events'

import { fetchTransit } from 'transit'

import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI from 'photoswipe-ui'

import Pic from 'pic'

import { find, merge, findIndex } from 'lodash'

let { max } = Math

let photostream = React.createFactory(require('components/photostream'))


// load waypoints library globally
import 'waypoints'

// polyfills
require('whatwg-fetch')
require('es6-promise').polyfill()

moment.defaultFormat = 'YYYY-MM-DD'

let emitter = new Events.EventEmitter()
let hasMore = true // UGLY shared variable

let folder = location.pathname.substring(1)

let fromGalleryEvent = function(gallery, event) {
  return Most.create(function(add) {
    gallery.listen(event, add)
  })
}

let incPicsStream = Most.create(function(add, end, error) {
  Most.fromEvent('load', emitter)
    .startWith({since: ''})
    .skipRepeatsWith(({since: since1}, {since: since2})=> since1 && since2 >= since1)
    .flatMap(({since})=>
      Most.fromPromise(
        fetchTransit(`/pics/${folder}?from=${since}`)))
    .forEach(add)
})

let picsStream = incPicsStream
  .scan((pics, loadedPics)=> pics.concat(loadedPics), [])
  .skip(1) // skip initial empty pictures event

// RENDER STREAM
picsStream.observe(function(pics) {
  React.render(photostream({pics, emitter}), document.getElementsByTagName('photostream')[0])
})

Most.combine((pics, opts)=> merge(opts, {pics}), picsStream, Most.fromEvent('gallery.open', emitter))
  .sampleWith(Most.fromEvent('gallery.open', emitter))
  .observe(function({pics, pic, from, index}) {
    let gallery = new PhotoSwipe(document.getElementsByClassName('pswp')[0], PhotoSwipeUI, pics, {
      barsSize: {top: 0, bottom: 0},
      index: findIndex(pics, {fileName: pic.fileName}),
      history: false,
      showHideOpacity: true,
      getThumbBoundsFn: ()=> from
    })

    incPicsStream.takeUntil(fromGalleryEvent(gallery, 'close').take(1)).observe(function(loadedPics) {
      Array.prototype.push.apply(gallery.items, loadedPics)
      gallery.ui.update()
    })

    gallery.listen('gettingData', function(index, pic) {
      if (gallery.getCurrentIndex()+20 > gallery.items.length) emitter.emit('load', {since: gallery.items[gallery.items.length-1].date.valueOf()})

      let viewSize = max(gallery.viewportSize.x, gallery.viewportSize.y)

      let size = find(Pic.sizes, (size)=> size >= viewSize) || Pic.sizes[Pic.sizes.length - 1]

      pic.src = pic.url({resize: pic.width > pic.height ? [size, null] : [null, size]});
      [pic.w, pic.h] = pic.width > pic.height ? [size, size * pic.height / pic.width] : [size * pic.width / pic.height, size]
    })

    gallery.init()
  })
