// Gulp.js configuration
var
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  assets = require('postcss-assets'),
  autoprefixer = require('autoprefixer'),
  mqpacker = require('css-mqpacker'),
  cssnano = require('cssnano'),
  ts = require('gulp-typescript'),
  // modules
  gulp = require('gulp'),

  // development mode?
  devBuild = (process.env.NODE_ENV !== 'production'),

  // folders
  folder = {
    src: 'src/',
    dist: 'dist/'
  }

  // CSS processing
gulp.task('css', function() {

  var postCssOpts = [
  assets({ loadPaths: ['images/'] }),
  autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
  mqpacker
  ];

  if (!devBuild) {
    postCssOpts.push(cssnano);
  }

  return gulp.src(folder.src + 'scss/main.scss')
    .pipe(sass({
      outputStyle: 'nested',
      imagePath: 'images/',
      precision: 3,
      errLogToConsole: true
    }))
    .pipe(postcss(postCssOpts))
    .pipe(gulp.dest(folder.dist + 'css/'));

});

// TypeScript compiling
gulp.task('ts', function () {
    return gulp.src(folder.src + 'ts/script.ts')
        .pipe(ts({
            noImplicitAny: true,
            outFile: 'script.js'
        }))
        .pipe(gulp.dest(folder.dist + 'js/'));
});

// watch for changes
gulp.task('watch', function() {

  // css changes
  gulp.watch(folder.src + 'scss/main.scss', ['css']);
    // ts changes
  gulp.watch(folder.src + 'ts/script.ts', ['ts']);

});

// run all tasks
gulp.task('default', ['css','ts','watch']);