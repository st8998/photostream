export default function($rootScope) {
  return {
    restrict: 'A',

    template: require('fs').readFileSync('./dest/public/js/directives/some.html', 'utf-8'),

    link: function(scope, el, attrs) {

    }
  }
}