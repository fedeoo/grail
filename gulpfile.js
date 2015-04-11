'use strict';

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var DEBUG = true;
var paths = {
    build: 'build'
};

gulp.task('jshint', function() {
    var jshint = require('gulp-jshint');
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('browserify', function () {
    gulp.src('src/app.js')
        .pipe(browserify({
            debug: DEBUG,
            paths: ['./node_modules','./src/']
        }))
        .on('error', function(err){
          console.log(err.message);
          this.emit('end');
        })
        .pipe(gulp.dest(paths.build));
});

gulp.task('html', function() {
    gulp.src('./src/*.html')
        .pipe(gulp.dest(paths.build));
});

gulp.task('watch', function() {
    gulp.watch(['./src/*.html'], ['html']).on('change', reload);
    gulp.watch(['./src/**/*.js'], ['jshint', 'browserify'], reload);
});

gulp.task('server', function () {
    browserSync({
        server: [__dirname, paths.build],
        port: 9000
    });
});

gulp.task('default', ['html', 'browserify', 'server', 'watch']);