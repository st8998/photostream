import 'waypoints/lib/jquery.waypoints'
import { debounce } from 'lodash'

export default /*@ngInject*/ function() {
  return {
    restrict: 'A',
    scope: false,

    compile: function(el, attrs) {
      let dirName = this.name

      return function(scope, el, attrs) {
        console.log('WAYPOINT LINK')

        let waypoint = new Waypoint({
          element: el,
          enabled: false,
          offset: function() {
            return Waypoint.viewportHeight() + 300
          },
          handler: function() {
            console.log('WAYPOINT MORE')
            console.log('WAYPOINT DISABLE')

            waypoint.disable()
            scope.$apply(()=> scope.$eval(attrs[dirName])
              .then((hasMore)=> {
                if (hasMore) {
                  console.log('WAYPOINT ENABLE')
                  setTimeout(waypoint.enable.bind(waypoint), 100)
                }
              }))
          }
        })

        setTimeout(waypoint.enable.bind(waypoint), 1000)

        el.on('$destroy', ()=> waypoint.destroy())
      }
    }
  }
}