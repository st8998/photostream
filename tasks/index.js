var gulp = require('gulp')

module.exports = function(taskNames) {
  taskNames.forEach(function(taskName) {
    gulp.task(taskName, require('./' + taskName))
  })

  return gulp
}