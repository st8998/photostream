var gulp = require('gulp')

var args = require('yargs').argv

var browserify = require('browserify')
var babelify = require('babelify')
var envify = require('envify')
var annotate = require('gulp-ng-annotate')

var slim = require('gulp-slim')
var source = require('vinyl-source-stream')
var buffer = require('gulp-buffer')
var rev = require('gulp-rev')
var del = require('del')
var uglify = require('gulp-uglify')
var util = require('gulp-util')

function minify() {
  return args['minify'] ?
    uglify() :
    util.noop()
}

var bundler = browserify('./js/app.es6', {
  debug: !args['minify'],
  paths: ['./node_modules', './js/'],
  extensions: ['.js', '.es6']
})

bundler
  .transform(babelify)
  .transform('brfs')
  .transform(envify)

// remove vendor libs from app bundle
require('../package.json').vendor.forEach(function(dep) { bundler.external(dep) })

module.exports = function() {
  del('./dest/public/js/bundle*')

  return bundler.bundle()
    .on('error', function(err) {
      console.error(err.message)
      this.emit('end')
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(annotate())
    .pipe(minify())
    .pipe(rev())
    .pipe(gulp.dest('./dest/public/js/'))
    .pipe(rev.manifest('dest/.rev-manifest', {base: process.cwd() + '/dest', merge: true})).pipe(gulp.dest('./dest/'))
}