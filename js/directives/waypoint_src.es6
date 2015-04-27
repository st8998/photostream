import 'waypoints/lib/jquery.waypoints'

export default /*@ngInject*/ function() {
  return {
    restrict: 'A',
    scope: false,

    link: function(scope, el, attrs) {
      new Waypoint({
        element: el,
        offset: function() {
          return Waypoint.viewportHeight()
        },
        handler: function() {
          attrs.$set('src', attrs['mWaypointSrc'])
          this.destroy()
        }
      })
    }
  }
}