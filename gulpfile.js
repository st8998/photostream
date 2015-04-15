var gulp = require('./tasks')(['javascript', 'javascript_vendor', 'slim', 'less', 'spec'])

var del = require('del')

gulp.task('clean', function(end) { del('./dest', end) })

gulp.task('default', ['clean', 'javascript', 'javascript_vendor', 'less'], function() {
  return gulp.start('slim')
})