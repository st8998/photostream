import 'waypoints/lib/jquery.waypoints'

export default /*@ngInject*/ function($timeout) {
  return {
    restrict: 'A',
    scope: false,

    compile: function(el, attrs) {
      let dirName = this.name

      return function(scope, el, attrs) {
        el.css({opacity: 0})

        // wait until all dom manipulations finished
        $timeout(function() {
          let top = el.offset().top + 600 < $(window).scrollTop()

          new Waypoint({
            element: el,
            offset: top ? -600 : ()=> 2*Waypoint.viewportHeight(),
            handler: function(direction) {
              if (direction == "up" || !top) {
                console.log('LOAD PIC', direction, top)
                el.prop('src', attrs[dirName])

                let img = el.get(0)
                if (img.complete || img.naturalWidth+img.naturalWidth > 0) {
                  el.css({opacity: 1})
                } else {
                  el.one('load', function() { el.css({opacity: 1, transition: 'opacity .3s'}) })
                }

                this.destroy()
              }
            }
          })
        }, 0)
      }
    }
  }
}