import { filter, groupBy, chain, map, findIndex } from 'lodash'

import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default'

export default /*@ngInject*/ function(picsService) {
  return {
    restrict: 'E',

    template: require('fs').readFileSync('./dest/public/js/directives/photostream.html', 'utf-8'),

    link: function(scope, el, attrs) {
      let $window = $(window)
      let photoSwipeEl = el.find('.pswp').get(0)

      picsService.all('photos').then(function(pics) {
        scope.dayGroups = chain(pics)
          .each((pic, i)=> pic.pos = i)
          .groupBy((pic)=> pic.date.format('YYYY-MM-DD'))
          .values()
          .value()

        scope.galleryPics = chain(pics)
          .map((pic)=> ({fileName: pic.fileName, w: 1280, h: 1280*pic.height/pic.width, src: pic.url({resize: [1280]})}))
          .value()

        scope.$digest()
      })

      scope.open = function(pic, e) {
        let gallery = new PhotoSwipe(
          photoSwipeEl,
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

      function setContainerSize() {
        el.find('.cards').css({width: $window.width() + 4})
      }
      $window.on('resize', setContainerSize)
    }
  }
}