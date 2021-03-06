// Required Plugins
var gulp          = require('gulp');
var autoprefixer  = require('gulp-autoprefixer');
var browserSync   = require('browser-sync');
var cache         = require('gulp-cache');
var concat        = require('gulp-concat');
var htmlmin       = require('gulp-htmlmin');
var imagemin      = require('gulp-imagemin');
var cleanCSS      = require('gulp-clean-css');
var plumber       = require('gulp-plumber');
var reload        = browserSync.reload;
var rename        = require('gulp-rename');
var sass          = require('gulp-sass');
var uglify        = require('gulp-uglify');
var sourcemaps    = require('gulp-sourcemaps');
var babel         = require('gulp-babel');

// JS Task
// gulp.task('js-bundle', function () {
//   return gulp.src('src/assets/js/**/*.js')
//     .pipe(plumber())
//     .pipe(babel())
//     .pipe(gulp.dest('dist/assets/js'))
// });

gulp.task('js-minify', function () {
    return gulp.src('src/assets/js/*.js')
        .pipe(plumber())
        .pipe(babel())
        .pipe(sourcemaps.init())
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(reload({stream:true}));
});

gulp.task('js-img-gallery', function () {
    return gulp.src('src/assets/js/blueimp-gallery.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(reload({stream:true}));
});

// gulp.task('js', ['js-minify']);

// Css Task
gulp.task('css', function () {
    return gulp.src('src/assets/css/*.css')
        .pipe(plumber())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(reload({stream:true}));
});

// Sass Task
gulp.task('sass', function () {
    return gulp.src('src/assets/scss/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(reload({stream:true}));
});

// HTML Task
gulp.task('html', function() {
    return gulp.src('src/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'))
        .pipe(reload({stream:true}));
});

// Img Task
gulp.task('img', function() {
    return gulp.src('src/assets/img/**/*')
        .pipe(cache(imagemin({progressive: true})))
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(reload({stream:true}));
});

gulp.task('move-fonts', function() {
    return gulp.src([
        'src/assets/font/**/*'
        ])
        .pipe(gulp.dest('dist/assets/font'));
})

// Browser-Sync Task
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './dist/'
        }
    });
});

// Watch Task
gulp.task('live',  ['browser-sync'], function() {
    // Watch scss, js, img, html files
    gulp.watch('src/assets/scss/**/*.scss', ['sass']);
    gulp.watch('src/assets/css/**/*.css', ['css']);
    gulp.watch('src/assets/js/**/*.js', ['js-minify']);
    gulp.watch('src/assets/js/**/blueimp-gallery.js', ['js-img-gallery']);
    gulp.watch('src/assets/img/**/*', ['img']);
    gulp.watch('src/**/*.html', ['html']);
});

// Default Task
gulp.task('default', function() {
    gulp.start('sass', 'css', 'js-minify', 'js-img-gallery', 'img', 'html', 'move-fonts');
});
