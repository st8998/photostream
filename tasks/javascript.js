var gulp = require('gulp')

var args = require('yargs').argv

var browserify = require('browserify')
var babelify = require('babelify')

var source = require('vinyl-source-stream')
var buffer = require('gulp-buffer')
var rev = require('gulp-rev')

var bundler = browserify('./js/app.es6', {debug: args['debug']})

bundler.transform(babelify).transform('brfs')

// remove vendor libs from app bundle
require('../package.json').vendor.forEach(function(dep) { bundler.external(dep) })

module.exports = function() {
  return bundler.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer()).pipe(rev())
    .pipe(gulp.dest('./dest/js/'))
    .pipe(rev.manifest('dest/.rev-manifest', {base: process.cwd() + '/dest', merge: true})).pipe(gulp.dest('./dest/'))
}