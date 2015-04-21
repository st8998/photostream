var gulp = require('gulp')

var browserify = require('browserify')

var source = require('vinyl-source-stream')
var buffer = require('gulp-buffer')
var rev = require('gulp-rev')
var del = require('del')

var bundler = browserify()

// remove vendor libs from app bundle
require('../package.json').vendor.forEach(function(dep) { bundler.require(dep) })

module.exports = function() {
  del('./dest/js/vendor*')

  return bundler.bundle()
    .pipe(source('vendor.js'))
    .pipe(buffer()).pipe(rev())
    .pipe(gulp.dest('./dest/public/js/'))
    .pipe(rev.manifest('dest/.rev-manifest', {base: process.cwd() + '/dest', merge: true})).pipe(gulp.dest('./dest/'))
}