var gulp = require('gulp')
var cache = require('gulp-cache')
var through = require('through2')
var args = require('yargs').argv

var revReplace = require('gulp-rev-replace')

var slim = require('gulp-slim')

module.exports = function() {
  var manifest = gulp.src("./dest/.rev-manifest")

  return gulp.src('./pages/**/*.slim')
    .pipe(cache(slim({pretty: !args['minify'], options: "attr_list_delims={'[' => ']'}"})))
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest('./dest'))
}