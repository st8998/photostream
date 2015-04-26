var gulp = require('gulp')
var del = require('del')
var es = require('event-stream')

var sass = require('gulp-sass')
var rev = require('gulp-rev')

var changed = require('gulp-changed')
var concat = require('gulp-concat')

var DEST = './dest/public/css'

var args = require('yargs').argv

function minify() {
  return args['minify'] ?
    require('gulp-minify-css')() :
    require('gulp-util').noop()
}

module.exports = function() {
  del('./dest/public/css/app*')

  gulp.src([
    './node_modules/photoswipe/dist/default-skin/default-skin.png',
    './node_modules/photoswipe/dist/default-skin/default-skin.svg',
    './node_modules/photoswipe/dist/default-skin/preloader.gif'
  ]).pipe(gulp.dest(DEST))

  var scss = gulp.src('./css/app.scss')
    .pipe(changed(DEST, {extension: '.css'}))
    .pipe(sass({
      includePaths: [
        require('node-bourbon').includePaths,
        require('node-neat').includePaths
      ]
    }))
    .on('error', function(err) {
      console.error(err)
      this.emit('end')
    })

  var css = gulp.src('./css/*.css')
  var photoswipe = gulp.src('./node_modules/photoswipe/dist/**/*.css')

  return es.merge(scss, css, photoswipe)
    .pipe(concat('app.css'))
    .pipe(minify())
    .pipe(rev())
    .pipe(gulp.dest(DEST))
    .pipe(rev.manifest('dest/.rev-manifest', {base: process.cwd() + '/dest', merge: true})).pipe(gulp.dest('./dest/'))
}