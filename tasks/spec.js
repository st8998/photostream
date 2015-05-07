var gulp = require('gulp')
var del = require('del')

var mocha = require('gulp-mocha')

require('babel/register')

module.exports = function() {
  process.env.NODE_ENV = 'test'

  return gulp.src('./specs/*.es6', {read: false})
    .pipe(mocha({reporter: 'spec'}))
    .once('end', function () {
      del('test')
    })
}