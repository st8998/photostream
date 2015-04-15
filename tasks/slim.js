var gulp = require('gulp')

var revReplace = require('gulp-rev-replace')

var slim = require('gulp-slim')

module.exports = function() {
  var manifest = gulp.src("./dest/.rev-manifest")

  return gulp.src('./pages/**/*.slim')
    .pipe(slim({pretty: true, options: "attr_list_delims={'[' => ']'}"}))
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest('./dest'))
}