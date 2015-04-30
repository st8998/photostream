import 'waypoints/lib/jquery.waypoints'
import { debounce } from 'lodash'

export default /*@ngInject*/ function($timeout) {
  return {
    restrict: 'A',
    scope: false,

    compile: function(el, attrs) {
      let dirName = this.name

      return function(scope, el, attrs) {
        // wait until all dom manipulations finished
        $timeout(function() {
          let waypoint = new Waypoint({
            element: el,
            enabled: true,
            offset: function() {
              return Waypoint.viewportHeight() + 300
            },
            handler: function() {
              console.log('LOAD MORE')
              el.remove()
              scope.$apply(()=> scope.$eval(attrs[dirName]))
            }
          })

          el.on('$destroy', ()=> waypoint.destroy())
        }, 0)
      }
    }
  }
}
