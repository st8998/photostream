var gulp = require('gulp')

var less = require('gulp-less')
var rev = require('gulp-rev')

module.exports = function() {
  return gulp.src('./css/app.less')
    .pipe(less())
    .pipe(rev())
    .pipe(gulp.dest('./dest/public/css'))
    .pipe(rev.manifest('dest/.rev-manifest', {base: process.cwd() + '/dest', merge: true})).pipe(gulp.dest('./dest/'))
}