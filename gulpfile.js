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
    var proxy = require('proxy-middleware');
    var url = require('url');
    var proxyOptions = url.parse('http://i2.api.weibo.com/2');
    proxyOptions.route = '/api';
    browserSync({
        server: {
            baseDir: [__dirname, paths.build],
            middleware: [proxy(proxyOptions)]
        },
        port: 9000
    });
});

gulp.task('connect', function () {
    var connect = require('gulp-connect');
    connect.server({
        root: [__dirname, paths.build],
        port: '8089',
        // livereload: true,
        middleware: function () {
            var proxy = require('proxy-middleware');
            var url = require('url');
            var proxyOptions = url.parse('http://i2.api.weibo.com/2');
            proxyOptions.route = '/api';
            return [proxy(proxyOptions)];
        }
    });
});

gulp.task('default', ['html', 'browserify', 'server', 'watch']);
// gulp.task('default', ['html', 'browserify', 'connect']);