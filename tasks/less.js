var gulp = require('gulp')

var less = require('gulp-less')
var rev = require('gulp-rev')

var changed = require('gulp-changed')

var DEST = './dest/public/css'

module.exports = function() {
  return gulp.src('./css/app.less')
    .pipe(changed(DEST, {extension: '.css'}))
    .pipe(less())
    .on('error', function(err) {
      console.error(err)
      this.emit('end')
    })
    .pipe(rev())
    .pipe(gulp.dest(DEST))
    .pipe(rev.manifest('dest/.rev-manifest', {base: process.cwd() + '/dest', merge: true})).pipe(gulp.dest('./dest/'))
}