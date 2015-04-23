var gulp = require('./tasks')(['javascript_vendor', 'slim', 'slim_directives', 'less', 'spec'])

var sequence = require('run-sequence')

var del = require('del')

gulp.task('clean', function(end) { del('./dest', end) })

gulp.task('javascript', ['slim_directives'], require('./tasks/javascript'))

gulp.task('watch', function() {
  sequence('clean', ['javascript', 'javascript_vendor', 'less'], 'slim', function() {
    gulp.watch(['css/**/*.less'], ['less'])
    gulp.watch(['js/**/*.es6', 'package.json', 'js/**/*.slim'], ['javascript'])
    gulp.watch(['package.json'], ['javascript_vendor'])
    gulp.watch(['pages/**/*.slim', 'dest/.rev-manifest'], ['slim'])
  })
})

gulp.task('default', ['clean', 'javascript', 'javascript_vendor', 'less'], function() {
  return gulp.start('slim')
})