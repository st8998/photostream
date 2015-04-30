import { filter, groupBy, chain, map, findIndex, debounce, find } from 'lodash'

import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default'

import Pic from 'pic'

import { writer } from 'transit'

let { max } = Math

export default /*@ngInject*/ function(picsService) {
  return {
    restrict: 'E',

    template: require('fs').readFileSync('./dest/public/js/directives/photostream.html', 'utf-8'),

    link: function(scope, el, attrs) {
      let $window = $(window)

      let collectionWatcher
      let folder = location.pathname.substring(1)

      scope.$watch(()=> folder, ()=> {
        if (collectionWatcher) collectionWatcher()

        // DATA LOADING
        collectionWatcher = scope.$watch(
          ()=> picsService.all(folder),
          (promise)=> {
            promise.then(function(pics) {
              scope.dayGroups = chain(pics)
                .each((pic, i)=> pic.pos = i)
                .groupBy((pic)=> pic.date.format())
                .values()
                .value()

              scope.galleryPics = pics

              scope.$digest()
            })
          }
        )
      })

      scope.loadMore = function() {
        return picsService.loadMore(folder)
      }


      // HISTORY API
      scope.updateState = debounce(function(currentDay, dayGroups) {
        let pics = chain(dayGroups).filter((dayPics)=> dayPics[0].date.format() >= currentDay).flatten().value()
        history.replaceState({pics: {[folder]: writer.write(pics)}}, currentDay, `?${currentDay}`)
      }, 500)


      // GALLERY
      scope.open = function(pic, e) {
        let gallery = new PhotoSwipe(
          el.find('.pswp').get(0),
          PhotoSwipeUI,
          scope.galleryPics,
          {
            index: findIndex(scope.galleryPics, (p)=> p.fileName == pic.fileName),
            history: false,
            showHideOpacity: true,
            getThumbBoundsFn: function() {
              let card = $(e.currentTarget)
              return {x: card.offset().left, y: card.offset().top, w: card.width()}
            }
          })

        gallery.listen('gettingData', function(index, pic) {
          let viewSize = max(gallery.viewportSize.x, gallery.viewportSize.y)

          let size = find(Pic.sizes, (size)=> size >= viewSize) || Pic.sizes[Pic.sizes.length-1]

          pic.src = pic.url({resize: [size]});
          [pic.w, pic.h] = pic.width > pic.height ? [size, size*pic.height/pic.width] : [size*pic.width/pic.height, size]
        })

        gallery.init()
      }


      // MARKUP
      function setContainerSize() {
        el.find('.cards').css({width: $window.width() + 4})
      }
      $window.on('resize', setContainerSize)
    }
  }
}