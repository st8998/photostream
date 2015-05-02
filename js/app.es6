import angular from 'angular'
import { map } from 'lodash'
import moment from 'moment'

// polyfills
require('whatwg-fetch')
require('es6-promise').polyfill()

moment.defaultFormat = 'YYYY-MM-DD'


let app = angular.module('app', [])


app.run(function() {
  // run hook
})


// directives goes here
app.directive('photostream', require('directives/photostream'))
app.directive('mWaypoint', require('directives/waypoint'))
app.directive('mWaypointSrc', require('directives/waypoint_src'))
app.directive('mWaypointMore', require('directives/waypoint_more'))


// services goes here
app.factory('picsService', require('services/pics_service'))