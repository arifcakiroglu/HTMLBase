var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var sourcemaps  = require("gulp-sourcemaps");
var fileinclude = require("gulp-file-include");

// File Paths
var CSS_PATH = { src: "./src/sass/*.scss", dist: "./dist/css/"};
var JS_PATH = { src: "./src/js/*.js", dist: "./dist/js/"};
var HTML_PATH = { src: "./src/*.html", dist: "./dist/html/*.html"};
var INCLUDES_PATH = "./src/includes/**/*.html";
var JQUERY_PATH = "node_modules/jquery/dist/jquery.min.js";

// Error Handling
var gulp_src = gulp.src;
gulp.src = function() {
  return gulp_src.apply(gulp, arguments)
    .pipe(plumber(function(error) {
      // Output an error message
      gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
      // emit the end event, to properly end the task
      this.emit('end');
    })
  );
};

// Styles
gulp.task('styles', function() {
  return gulp.src(CSS_PATH["src"])
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(sourcemaps.init())
    .pipe(gulp.dest(CSS_PATH["dist"]))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(concat("main.css", {newLine: ""}))
    .pipe(gulp.dest(CSS_PATH["dist"]))
    .pipe(browserSync.reload({ stream: true }))
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src([JS_PATH["src"], JQUERY_PATH])
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(JS_PATH["dist"]));
});

// File Include
gulp.task('fileinclude', function() {
  return gulp.src(HTML_PATH["src"])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: 'src/includes'
    }))
    .pipe(gulp.dest('dist'));
});

// BrowserSync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist/'
    },
    open: false,
    browser: "Google Chrome",
    notify: true,
    notify: {
        styles: {
            top: 'auto',
            bottom: '0',
            borderRadius: '4px 0 0 0',
            opacity: .9
        }
    },
    snippetOptions: {
      rule: {
        match: /<\/body>/i,
        fn: function (snippet, match) {
          return snippet + match;
        }
      }
    }
  })
})

// Watch task
gulp.task('watch', ['fileinclude', 'browserSync'], function() {
  gulp.watch(CSS_PATH["src"], ['styles']);
  gulp.watch(JS_PATH["src"], ['scripts']);
  gulp.watch(INCLUDES_PATH, ['fileinclude']);
  gulp.watch([HTML_PATH["src"], HTML_PATH["src"]], browserSync.reload);
});

gulp.task('default', ['fileinclude', 'styles', 'scripts', 'browserSync', 'watch' ]);
