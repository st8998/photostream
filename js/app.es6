import angular from 'angular'
import { map } from 'lodash'

import 'whatwg-fetch'

let app = angular.module('app', [])


app.run(function() {
  // run hook
})


// directives goes here
app.directive('photostream', require('directives/photostream'))
app.directive('mWaypointSrc', require('directives/waypoint_src'))
app.directive('mWaypointMore', require('directives/waypoint_more'))


// services goes here
app.factory('picsService', require('services/pics_service'))