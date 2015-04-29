import 'waypoints/lib/jquery.waypoints'

export default /*@ngInject*/ function() {
  return {
    restrict: 'A',
    scope: false,

    compile: function(el, attrs) {
      let dirName = this.name

      return function(scope, el, attrs) {
        let waypoint = new Waypoint({
          element: el,
          offset: function() {
            return Waypoint.viewportHeight() + 300
          },
          handler: function() {
            console.log('WAYPOINT MORE')
            setTimeout(()=> {
              waypoint.disable()
              scope.$apply(()=> scope.$eval(attrs[dirName])
                .then((hasMore)=> { if (hasMore) waypoint.enable()}))
            }, 0)
          }
        })

        el.on('$destroy', ()=> waypoint.destroy())
      }
    }
  }
}