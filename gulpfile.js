var gulp = require('gulp'),
  less = require('gulp-less'),
  del = require('del');

var stylePath = './www/style/';

gulp.task('cleanCss', function(cb) {
  del([stylePath + 'style.css'], cb);
});

gulp.task('less', ['cleanCss'], function() {
  try {
    gulp.src(stylePath + 'style.less')
      .pipe(less())
      .pipe(gulp.dest(stylePath));
  } catch (e) {
    console.log("catched");
  }
});

gulp.task('watch', function() {
  gulp.watch(stylePath + 'style.less', ['less']);
});