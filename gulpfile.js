var gulp = require('gulp');
var babel = require('gulp-babel');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var mocha = require('gulp-mocha');
var todo = require('gulp-todo');
var webpack = require('webpack-stream');
var request = require('sync-request');
var fs = require('fs');


gulp.task('build', ['build-client', 'build-server']);

gulp.task('test', ['lint'], function () {
    gulp.src(['test/**/*.js'])
        .pipe(mocha());
});

gulp.task('lint', function () {
    return gulp.src(['**/*.js', '!node_modules/**/*.js', '!bin/**/*.js'])
        .pipe(jshint({
            esnext: true
        }))
        .pipe(jshint.reporter('default', {verbose: true}))
        .pipe(jshint.reporter('fail'));
});

gulp.task('build-client', ['lint', 'move-client'], function () {
    return gulp.src(['src/client/js/app.js'])
        .pipe(uglify())
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(babel())
        .pipe(gulp.dest('bin/client/js/'));
});

gulp.task('move-client', function () {
    return gulp.src(['src/client/**/*.*', '!client/js/*.js'])
        .pipe(gulp.dest('./bin/client/'));
});

gulp.task('move-index-client', function () {
    return gulp.src(['src/client/index.html'])
        .pipe(gulp.dest('./bin/client/'));
});
gulp.task('move-css-client', function () {
    return gulp.src(['src/client/css/*.*'])
        .pipe(gulp.dest('./bin/client/css/'));
});

gulp.task('build-server', ['lint'], function () {
    return gulp.src(['src/server/**/*.*', 'src/server/**/*.js'])
        .pipe(babel())
        .pipe(gulp.dest('bin/server/'));
});

gulp.task('watch', ['build'], function () {
    gulp.watch(['src/client/js/*.*'], ['build-client', 'move-client']);
    gulp.watch(['src/client/css/*.*'], ['move-css-client']);
    gulp.watch(['src/client/index.html'], ['move-index-client']);
    gulp.watch(['src/server/*.*', 'src/server/**/*.js'], ['build-server']);
    gulp.start('run-only');
});

gulp.task('todo', ['lint'], function () {
    gulp.src('src/**/*.js')
        .pipe(todo())
        .pipe(gulp.dest('./'));
});

gulp.task('run', ['build'], function () {
    nodemon({
        delay: 10,
        script: './bin/server/server.js',
        ext: 'html js css'
    })
        .on('restart', function () {
            util.log('server restarted!');
        });
});

gulp.task('run-only', function () {
    nodemon({
        delay: 10,
        script: './bin/server/server.js',
        ext: 'html js css'
    })
        .on('restart', function () {
            util.log('server restarted!');
        });
});


gulp.task('default', ['run']);
