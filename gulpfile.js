'use strict';
var babel = require('gulp-babel');
var babelify = require('babelify');

var gulp = require('gulp'),
    stripDebug = require('gulp-strip-debug'),
    gulpif = require('gulp-if'),
    $ = require('gulp-load-plugins')(),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    connect = $.connectMulti,
    wiredep = require('wiredep').stream,
    devServer = connect(),
    proServer = connect();

gulp.task('connect-dev', devServer.server({
    root: ['src'],
    host: '172.28.128.3',
    port: 8989,
    livereload: true
}));

gulp.task('connect-pro', proServer.server({
    root: ['dist'],
    port: 9090,
    livereload: true
}));

gulp.task('clean', function() {
    return gulp.src(['dist'], {read: false})
            .pipe($.rimraf());
});

gulp.task('lint', function() {
    return gulp.src(['src/app/*.js', 'src/app/**/*.js'])
            .pipe($.jshint('.jshintrc'))
            .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('robots', function() {
    gulp.src('src/robots.txt')
        .pipe(gulp.dest('dist/'));
});

gulp.task('static', function() {
    gulp.src('src/static/*')
        .pipe(gulp.dest('dist/static/'));
});

gulp.task('config', function() {
    gulp.src('src/config/*')
        .pipe(gulp.dest('dist/config/'));
});

gulp.task('fonts', function() {
    gulp.src('src/bower_components/bootstrap/dist/fonts/*')
        .pipe(gulp.dest('dist/assets/fonts'));

    gulp.src('src/bower_components/flat-ui/dist/fonts/lato/*')
        .pipe(gulp.dest('dist/assets/fonts/lato'));

    gulp.src('src/assets/fonts/skinny/*')
        .pipe(gulp.dest('dist/assets/fonts/skinny'));

});

gulp.task('images', function() {
    gulp.src('src/assets/images/*')
        .pipe(gulp.dest('dist/assets/images'));
});

gulp.task('styles', ['compass'], function() {
    gulp.src('src/assets/styles/*.css')
        .pipe(gulp.dest('dist/assets/styles'));
});

gulp.task('compass', function() {
    return gulp.src('src/assets/sass/*.scss')
        .pipe($.compass({
            sass: 'src/assets/sass',
            css: 'src/assets/styles'
        }))
        .pipe($.minifyCss())
        .pipe(gulp.dest('src/assets/styles'))
});

gulp.task('base', ['robots', 'static', 'config', 'fonts', 'images', 'styles']);

gulp.task('scripts', ['lint'], function() {
    console.log('task : scripts lint');
    var bundler = browserify({
        entries: ['./src/app/app.jsx'],
        transform: [babelify],
        extensions: ['.jsx'],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    });

    gulp.src('src/scripts/fbase.js')
        .pipe(gulp.dest('dist/scripts'));

    var watcher = watchify(bundler);
    return watcher
        .on('prebundle', function(bundler) {
            bundler.require('react');
        })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./dist/scripts/'));
});

gulp.task('html', ['base', 'scripts'], function() {
    console.log('task: html');
    var assets = $.useref.assets();
    return gulp.src('src/*.html')
            .pipe(assets)
            .pipe(gulpif('*.css', $.minifyCss()))
            .pipe(assets.restore())
            .pipe($.useref())
            .pipe(gulp.dest('dist'))
            .pipe($.size());
});

gulp.task('compress', ['html'], function() {
    console.log('task: compress');
    gulp.src(['dist/scripts/app.js', 'dist/scripts/vendor.js','dist/scripts/fbase.js'])
        .pipe(stripDebug())
        .pipe($.uglify())
        .pipe(gulp.dest('dist/scripts/'));
});

gulp.task('wiredep', function() {
    gulp.src('src/*.html')
        .pipe(wiredep({
            directory: 'src/bower_components',
            ignorePath: 'src/'
        }))
        .pipe(gulp.dest('src'));
});

gulp.task('browserify', function() {
    console.log('task: browserify');
    var bundler = browserify({
        entries: ['./src/app/app.jsx'],
        transform:  [babelify],
        extensions: ['.jsx'],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    });
    console.log('watchify bundler');
    var watcher = watchify(bundler.transform(babelify, {presets: ['es2015', 'react']}));
    return watcher
        .on('prebundle', function(bundler) {
            console.log('wacther prebundle');
            bundler.require('react');
        })
        .on('update', function() {
            console.log('update bundle');
            var updateStart = Date.now();
            console.log('Updating!');
            watcher.bundle()
                .pipe(source('app.js'))
                .pipe(gulp.dest('./src/scripts/'));
            console.log('Updated!', (Date.now()-updateStart)+'ms');
        })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./src/scripts/'));
});

gulp.task('refresh', ['browserify'], function() {
    gulp.src('src/scripts/app.js')
        .pipe(devServer.reload());
});

gulp.task('watch', ['connect-dev'], function() {
    console.log('task : connect-dev');
    gulp.watch([
        'src/*.html',
        'src/assets/styles/*.css',
        'src/assets/images/*',
        'src/app/*.js',
        'src/app/**/*.js'
    ], function(event) {
        console.log('event.path :'+ event.path);
        return gulp.src(event.path)
                .pipe(devServer.reload());
    });

    gulp.watch(['src/assets/sass/*.scss'], ['compass']);
    gulp.watch(['src/app/*.js', 'src/app/**/*.js'], ['refresh']);
    gulp.watch('bower.json', ['wiredep']);
});

gulp.task('dev', ['browserify'], function() {
    gulp.start('watch');
});

gulp.task('build', ['compress'], function() {
    console.log('task: compress');
    gulp.start('connect-pro');
});

gulp.task('pro', ['clean'], function() {
    gulp.start('build');
});

gulp.task('deploy', ['compress'], function() {
    gulp.doneCallback = function(err) {
        process.exit(err ? 1:0);
    }
});

gulp.task('default', function () {
    return gulp.src('src/scripts/app.js')
        .pipe(babel())
        .pipe(gulp.dest('dist-tes'));
});
