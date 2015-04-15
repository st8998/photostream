var gulp = require('gulp')

var mocha = require('gulp-mocha')

require('babel/register')

module.exports = function() {
  return gulp.src('./specs/*.es6', {read: false})
    .pipe(mocha({reporter: 'spec'}))
}