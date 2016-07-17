var gulp = require('gulp');
var rimraf = require('rimraf');
var sequence = require('run-sequence');
var $ = require('gulp-load-plugins')();

var sassPaths = [
    'bower_components/foundation-sites/scss',
    'bower_components/motion-ui/src'
];

var paths = {
    fontawesome: {
        fonts: [
            'bower_components/components-font-awesome/fonts/**.*'
        ],
        styles: [
            'bower_components/components-font-awesome/css/font-awesome.min.css'
        ]
    },
    jquery: {
        js: ['bower_components/jquery/dist/jquery.min.js']
    },
    foundation: {
        js: [
            'bower_components/foundation-sites/dist/foundation.min.js',
            'bower_components/foundation-sites/dist/plugins/*.js'
        ]
    },
    app: {
        js: [
            'client/assets/js/**.js'
        ],
        html: [
            'client/*.html'
        ],
        img: [
            'client/assets/img/**'
        ]
    },
    header: 'client/templates/global-header.html',
    footer: 'client/templates/global-footer.html'
}

gulp.task('clean', function(cb) {
  rimraf('./build', cb);
});

gulp.task('sass', function() {
    return gulp.src('client/scss/app.scss')
        .pipe($.sass({
                includePaths: sassPaths,
                outputStyle: 'compressed' // if css compressed **file size**
            })
            .on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9']
        }))
        .pipe(gulp.dest('./build/assets/css'));
});

gulp.task('default', function(cb) {
    sequence('clean', ['copy','sass'], 'server', cb)
    gulp.watch(['client/scss/**/*.scss'], ['sass']);
    gulp.watch([paths.app.html, paths.app.js, paths.app.img], ['copy']);
});

gulp.task('copy', function() {
    gulp.src(paths.fontawesome.fonts).pipe(gulp.dest('./build/assets/fonts/'));
    gulp.src(paths.fontawesome.styles).pipe(gulp.dest('./build/assets/css/'));
    gulp.src(paths.jquery.js).pipe(gulp.dest('./build/assets/js/'));
    gulp.src(paths.foundation.js).pipe(gulp.dest('./build/assets/js/'));
    gulp.src(paths.app.js).pipe(gulp.dest('./build/assets/js/'));
    gulp.src(paths.app.img).pipe(gulp.dest('./build/assets/img/'));
    gulp.src(paths.app.html)
        .pipe($.headerfooter.header(paths.header))
        .pipe($.headerfooter.footer(paths.footer))
        .pipe(gulp.dest('./build/'));
});

gulp.task('server', function() {
    gulp.src('./build')
        .pipe($.webserver({
            port: 8079,
            host: 'localhost',
            livereload: true,
            open: true
        }));
});
