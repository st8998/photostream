import angular from 'angular'
import { map } from 'lodash'

import 'whatwg-fetch'

let app = angular.module('app', [])


app.run(function($rootScope) {
  $rootScope.data = 'JOPPA DRILLER'
})


// directives goes here
app.directive('photostream', require('directives/photostream'))


// services goes here
app.factory('picsService', require('services/pics_service'))