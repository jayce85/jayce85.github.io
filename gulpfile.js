'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');

// Load plugins
var $ = require('gulp-load-plugins')();
var connect = require('gulp-connect');

// Scripts
gulp.task('scripts', function() {
    return gulp.src('assets/coffee/**/*.coffee')
        .pipe($.coffee({ bare: true }).on('error', gutil.log))
        .pipe($.uglify({ outSourceMap: true }))
        .pipe(gulp.dest('public/js'))
        .pipe($.size());
});

// Styles
gulp.task('styles', function() {
    return gulp.src('assets/scss/**/*.scss')
        .pipe($.rubySass({
            style: 'compressed',
            // sourcemap: true,
            compass: true,
            loadPath: ['public/bower_components']
        }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('public/css'))
        .pipe($.size());
});

// Images
gulp.task('images', function() {
    return gulp.src('images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('images'))
        .pipe($.size());
});

// Clean
gulp.task('clean', function() {
    return gulp.src([
        'public/css',
        'public/js'
        ], { read: false })
        .pipe($.clean());
});

// Connect
gulp.task('connect', connect.server({
    root: ['_site'],
    port: 9000,
    livereload: true
}));

// Watch
gulp.task('watch', ['connect'], function () {

    // Watch for changes in `public` folder
    gulp.watch([
        'public/css/**/*.css',
        'public/js/**/*.js',
        'images/**/*'
    ], function(event) {
        return gulp.src(event.path)
            .pipe($.wait(1500))
            .pipe(connect.reload());
    });

    // Watch .scss files
    gulp.watch('assets/scss/**/*.scss', ['styles']);

    // Watch .coffee, .js and .hbs files
    gulp.watch('assets/coffee/**/*.coffee', ['scripts']);

    // Watch image files
    gulp.watch('images/**/*', ['images']);
});

// Build
gulp.task('build', ['styles', 'scripts', 'images']);

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
