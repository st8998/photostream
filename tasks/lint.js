var gulp = require('gulp')
var eslint = require('gulp-eslint')
var args = require('yargs').argv

var rules = {
  'semi': 0,
  'quotes': 0,
  'curly': [2, 'multi']
}

var ecmaFeatures = {
  modules: true,
  blockBindings: true
}

module.exports = function(end) {
  if (args['nolint']) return end()

  return gulp.src(['./js/**/*.es6', './js/**/*.js'])
    .pipe(eslint({parser: 'esprima', rules: rules, env: {es6: true, node: true}, ecmaFeatures: ecmaFeatures}))
    .pipe(eslint.format())
}