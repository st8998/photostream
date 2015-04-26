var gulp = require('gulp')
var del = require('del')

module.exports = function() {
  del('./dest/public/static')

  return gulp.src('./static/**/*')
    .pipe(gulp.dest('./dest/public/static'))
}