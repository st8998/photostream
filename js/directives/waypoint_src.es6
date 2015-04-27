import 'waypoints/lib/jquery.waypoints'

export default /*@ngInject*/ function() {
  return {
    restrict: 'A',
    scope: false,

    link: function(scope, el, attrs) {
      el.css({opacity: 0})

      new Waypoint({
        element: el,
        offset: function() {
          return Waypoint.viewportHeight() + 300
        },
        handler: function() {
          el.prop('src', attrs['mWaypointSrc'])

          let img = el.get(0)
          if (img.complete || img.naturalWidth+img.naturalWidth > 0) {
            el.css({opacity: 1})
          } else {
            el.one('load', function() { el.css({opacity: 1, transition: 'opacity .3s'}) })
          }

          this.destroy()
        }
      })
    }
  }
}