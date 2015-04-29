import 'waypoints/lib/jquery.waypoints'

export default /*@ngInject*/ function() {
  return {
    restrict: 'A',
    scope: false,
    compile: function(el, attrs) {
      let callbackStr = attrs[this.name]

      return function(scope, el, attrs) {
        new Waypoint({
          element: el,
          handler: function() {
            scope.$eval(callbackStr)
          }
        })
      }
    }
  }
}