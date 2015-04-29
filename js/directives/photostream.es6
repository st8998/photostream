import { filter, groupBy, chain, map, findIndex, debounce } from 'lodash'

import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default'

import { writer } from 'transit'

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

              scope.galleryPics = chain(pics)
                .map((pic)=> ({fileName: pic.fileName, w: 1280, h: 1280*pic.height/pic.width, src: pic.url({resize: [1280]})}))
                .value()

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