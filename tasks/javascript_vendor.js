var gulp = require('gulp')

var browserify = require('browserify')

var source = require('vinyl-source-stream')
var buffer = require('gulp-buffer')
var rev = require('gulp-rev')

var bundler = browserify()

// remove vendor libs from app bundle
Object.keys(require('../package.json').dependencies).forEach(function(dep) { bundler.require(dep) })

module.exports = function() {
  return bundler.bundle()
    .pipe(source('vendor.js'))
    .pipe(buffer()).pipe(rev())
    .pipe(gulp.dest('./dest/js/'))
    .pipe(rev.manifest('dest/.rev-manifest', {base: process.cwd() + '/dest', merge: true})).pipe(gulp.dest('./dest/'))
}