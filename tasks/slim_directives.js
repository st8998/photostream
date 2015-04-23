var gulp = require('gulp')
var slim = require('gulp-slim')
var changed = require('gulp-changed')
var args = require('yargs').argv

var DEST = './dest/public/js'

module.exports = function() {
  return gulp.src('./js/**/*.slim')
    .pipe(changed(DEST, {extension: '.html'}))
    .pipe(slim({pretty: !args['minify'], options: "attr_list_delims={'[' => ']'}"}))
    .pipe(gulp.dest(DEST))
}