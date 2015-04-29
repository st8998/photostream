import 'waypoints/lib/jquery.waypoints'

export default /*@ngInject*/ function() {
  return {
    restrict: 'A',
    scope: false,

    link: function(scope, el, attrs) {
      let waypoint = new Waypoint({
        element: el,
        offset: function() {
          return Waypoint.viewportHeight() + 300
        },
        handler: function() {
          setTimeout(()=> {
            waypoint.disable()
            scope.$apply(()=> scope.$eval(attrs['mWaypointMore'])
              .then((hasMore)=> { if (hasMore) waypoint.enable()}))
          }, 0)
        }
      })

      el.on('$destroy', ()=> waypoint.destroy())
    }
  }
}