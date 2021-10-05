const
  gulp = require('gulp'),
  $ = require('gulp-load-plugins')();

gulp.task('fonts', function () {
  return gulp.src('app/fonts/*')
    .pipe(gulp.dest('public/fonts'));
});