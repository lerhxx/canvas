let gulp = require('gulp');
let stylus = require('gulp-stylus');
let compass = require('gulp-compass');
let argv = require('yargs').argv;
let babel = require('gulp-babel');
let browserSync = require('browser-sync').create();
let nib = require('nib');
let imgmin = require('gulp-imagemin');

let sourcePath = '/src';
let distPath = '/dist';
let filePath = {
    css: {
        src: function() {return mod + sourcePath + '/stylus/**/*.styl'},
        dest: function() {return mod + distPath + '/css'}
    },
    img: {
        src: function() {return mod + sourcePath + '/img/**/*.{png,jpg.jpeg,gif,webp}'},
        dest: function() {return mod + distPath + '/img'}
    },
    js: {
        src: function() {return mod + sourcePath + '/js/**/*.js'},
        dest: function() {return mod + distPath + '/js'}
    }
}
let mod;

gulp.task('compass', function() {
    mod = filePath.resetPath(argv.s);
    gulp.src(filePath.css.src())
        .pipe(compass({
            
        }))
})
gulp.task('stylus', function() {
    return gulp.src(filePath.css.src())
        .pipe(stylus({
            compress: true,
            use: nib()
        }))
        .pipe(gulp.dest(filePath.css.dest()))
        .pipe(browserSync.stream())
})

gulp.task('stylus:watch', ['stylus'], function() {
    browserSync.reload();
})


gulp.task('babel', function() {
    mod = argv.m;
    return gulp.src(filePath.js.src())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(filePath.js.dest()));
})

gulp.task('babel:watch', ['babel'], function() {
    browserSync.reload()
})

gulp.task('img', function() {
    mod = argv.m;
    return gulp.src(filePath.img.src())
        .pipe(imgmin([
            imgmin.jpegtran({progressize: true}),
            imgmin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest(filePath.img.dest()));
})


gulp.task('server', ['stylus', 'babel'],function() {
    mod = argv.m;
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
    gulp.watch(filePath.css.src(), ['stylus:watch']);
    gulp.watch(filePath.js.src(), ['babel:watch']);
    gulp.watch(`${mod}/*.html`).on('change', browserSync.reload);
})