let gulp = require('gulp');
let stylus = require('gulp-stylus');
let compass = require('gulp-compass');
let argv = require('yargs').argv;
let babel = require('gulp-babel');
let browserSync = require('browser-sync').create();

let sourcePath = '/src';
let distPath = '/dist';
let filePath = {
    css: {
        src: function() {return mod + sourcePath + '/css/**/*.styl'},
        dest: function() {return mod + sourcePath + '/css'}
    },
    img: {
        src: function() {return mod + sourcePath + '/imgs/**/*.{png,jpg.jpeg,gif,webp}'},
        dest: function() {return mod + sourcePath + '/imgs'}
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
    gulp.src()
})

gulp.task('stylus:watch', function() {

})

gulp.task('babel', function() {
    mod = argv.m;
    return gulp.src(filePath.js.src())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(filePath.js.dest()));
})
gulp.task('babel:watch', function() {
    mod = argv.m;
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
    gulp.watch(filePath.js.src(), ['babel']);
    gulp.watch(filePath.js.src()).on('change', browserSync.reload);
    gulp.watch(`${mod}/*.html`).on('change', browserSync.reload);
})