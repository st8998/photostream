import { reject } from 'lodash'

export default /*@ngInject*/ function(picsService) {
  return {
    restrict: 'E',

    template: require('fs').readFileSync('./dest/public/js/directives/photostream.html', 'utf-8'),

    link: function(scope, el, attrs) {
      picsService.all().then(function(pics) {
        scope.pics = reject(pics, (pic)=> pic.fileName.match(/test/))
        scope.$digest()
      })
    }
  }
}