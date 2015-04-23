import angular from 'angular'
import { map } from 'lodash'

let app = angular.module('app', [])


app.run(function($rootScope) {
  $rootScope.data = 'JOPPA DRILLER'
})


// directives goes here
app.directive('some', require('directives/some'))


// services goes here