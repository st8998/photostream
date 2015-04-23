var gulp = require('gulp')
var args = require('yargs').argv

var browserify = require('browserify')

var source = require('vinyl-source-stream')
var buffer = require('gulp-buffer')
var rev = require('gulp-rev')
var del = require('del')
var uglify = require('gulp-uglify')
var util = require('gulp-util')

var bundler = browserify({debug: !args['minify']})

function minify() {
  return args['minify'] ?
    uglify() :
    util.noop()
}

// remove vendor libs from app bundle
require('../package.json').vendor.forEach(function(dep) { bundler.require(dep) })

module.exports = function() {
  del('./dest/public/js/vendor*')

  return bundler.bundle()
    .pipe(source('vendor.js'))
    .pipe(buffer())
    .pipe(minify())
    .pipe(rev())
    .pipe(gulp.dest('./dest/public/js/'))
    .pipe(rev.manifest('dest/.rev-manifest', {base: process.cwd() + '/dest', merge: true})).pipe(gulp.dest('./dest/'))
}