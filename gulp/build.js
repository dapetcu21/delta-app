'use strict';

var gulp = require('gulp');

var config = require('./_config.js');
var paths = config.paths;
var $ = config.plugins;

var source = require('vinyl-source-stream');
var browserify = require('browserify');
var istanbul = require('browserify-istanbul');

gulp.task('clean', function () {
  return gulp.src(paths.tmp, { read: false })
    .pipe($.rimraf());
});

gulp.task('clean:dist', function () {
  return gulp.src(paths.dist, { read: false })
    .pipe($.rimraf());
});

gulp.task('index.html', function () {
  return gulp.src(paths.app + '/index.jade')
    .pipe($.jade({
      pretty: true
    }))
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('jade', function () {
  return gulp.src(paths.app + '/*.html')
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('js', function () {
  var bundleStream = browserify(paths.app + '/js/main.js')
    .transform(istanbul)
    .bundle();

  return bundleStream
    .pipe(source(paths.app + '/js/main.js'))
    .pipe($.rename('main.js'))
    .pipe(gulp.dest(paths.tmp + '/js/'));
});

gulp.task('js:no-istanbul', function () {
  var bundleStream = browserify(paths.app + '/js/main.js')
    .bundle()
    .on('error', config.handleError);

  return bundleStream
    .pipe(source(paths.app + '/js/main.js'))
    .pipe($.rename('main.js'))
    .pipe(gulp.dest(paths.tmp + '/js/'));
});

gulp.task('css', function () {
  return gulp.src(paths.app + '/css/famous.css')
    .pipe(gulp.dest(paths.tmp + '/css/'));
});

gulp.task('assets', function() {
  return gulp.src(paths.app + '/assets/**/*')
     .pipe(gulp.dest(paths.tmp + '/assets/'));
});

gulp.task('build', ['index.html', 'js', 'css', 'assets']);

gulp.task('prebuild:dist', ['index.html', 'js:no-istanbul', 'css', 'assets'], function () {
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var htmlFilter = $.filter('**/*.html');
  var assets = $.useref.assets();

  return gulp.src(paths.tmp + '/index.html')
    .pipe(assets)

    .pipe(jsFilter)
    .pipe($.uglify())
    .pipe(jsFilter.restore())

    .pipe(cssFilter)
    .pipe(cssFilter.restore())

    .pipe(assets.restore())
    .pipe($.useref())

    .pipe(htmlFilter)
    .pipe($.minifyHtml())
    .pipe(htmlFilter.restore())
    
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build:dist', ['prebuild:dist'], function(){
  return gulp.src(paths.dist + '/**/*')
    .pipe(gulp.dest(paths.dist));
});

