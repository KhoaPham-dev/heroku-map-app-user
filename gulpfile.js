var gulp = require('gulp');
var concat = require('gulp-concat');
var cssMin = require('gulp-css');
var terserJS = require('gulp-terser-js');

gulp.task('pack-js', function () {    
    return gulp.src(['./script/*.js'])
        .pipe(concat('bundle.js'))
        .pipe(terserJS())
        .pipe(gulp.dest('./bundle/'));
});
 
gulp.task('pack-css', function () {    
    return gulp.src(['./css/style.css'])
        .pipe(concat('style.min.css'))
        .pipe(cssMin())
        .pipe(gulp.dest('./css'));
});
 
gulp.task('default', gulp.series('pack-css', 'pack-js'));