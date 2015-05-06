import { chain, findIndex, debounce, find, template, each } from 'lodash'

import moment from 'moment'
import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default'

import Pic from 'pic'

import { writer } from 'transit'

let { max } = Math

export default /*@ngInject*/ function(picsService, $compile) {
  let cardTmpl = template('<li class="card <%= enlargeClass %>"><img class="foreground" m-waypoint-src="<%= src %>" /><img class="background" src="/static/1x1.gif" /></li>')
  let dateCardTmpl = template('<li class="card <%= weekDay %>"><div class="date"><h1><%= main %></h1><h2><%= sub %></h2></div><img class="background" src="/static/1x1.gif" /></li>')


  return {
    restrict: 'E',

    template: require('fs').readFileSync('./dest/public/js/directives/photostream.html', 'utf-8'),

    link: function(scope, el, attrs) {
      let $window = $(window)


      // DATA LOADING
      let collectionWatcher
      let folder = location.pathname.substring(1)
      scope.$watch(()=> folder, ()=> {
        if (collectionWatcher) collectionWatcher()

        collectionWatcher = scope.$watch(
          ()=> picsService.all(folder),
          (promise)=> {
            promise.then(function(pics) {
              scope.rawPics = pics
              scope.$digest()
            })
          }
        )
      })

      scope.loadMore = function() {
        return picsService.loadMore(folder)
      }


      // RENDERING
      let cards = el.find('.cards')

      cards.on('click', '.card .foreground', (e)=> scope.open($('.card .foreground').index($(e.currentTarget)), e))

      scope.$watchCollection('rawPics', function(pics, oldPics) {
        if (pics && pics.length) {
          let lastDay = oldPics && oldPics[oldPics.length-1].date.format()

          let fragment = ''

          chain(pics)
            .drop(oldPics && oldPics.length || 0)
            .each((pic, i)=> pic.pos = i)
            .groupBy((pic)=> pic.date.format())
            .each((pics, day)=> {
              let mDay = moment(day)
              if (day != lastDay)
                fragment += dateCardTmpl({weekDay: mDay.format('ddd').toLowerCase(), main: mDay.date(), sub: mDay.format('MMMM / YYYY')})

              each(pics, (pic, i)=> {
                let enlargeClass = i == 5 ? 'x2 x2-left' : i == 9 ? 'x2 x2-right' : ''
                let size = i == 5 || i == 9 ? 600 : 300
                fragment += cardTmpl({src: pic.url({resize: [size, size], sharpen: []}), enlargeClass: enlargeClass})
              })
            })
            .value()

          fragment += '<li m-waypoint-more="loadMore()" />'

          cards.append($compile(fragment)(scope))
        }
      })

      // HISTORY API
      scope.updateState = debounce(function(currentDay, dayGroups) {
        let pics = chain(dayGroups).filter((dayPics)=> dayPics[0].date.format() >= currentDay).flatten().value()
        history.replaceState({pics: {[folder]: writer.write(pics)}}, currentDay, `?${currentDay}`)
      }, 500)


      // GALLERY
      scope.open = function(index, e) {
        let gallery = new PhotoSwipe(
          el.find('.pswp').get(0),
          PhotoSwipeUI,
          scope.rawPics,
          {
            barsSize: {top: 0, bottom: 0},
            index: index,
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

          pic.src = pic.url({resize: pic.width > pic.height ? [size, null] : [null, size]});
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