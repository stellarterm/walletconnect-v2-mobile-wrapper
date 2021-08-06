const gulp = require('gulp');
const del = require('del');
const inline = require('gulp-inline-source');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');



gulp.task('clean', async () => del.sync('dist'))

gulp.task('html', () => gulp.src('src/index.html')
      .pipe(gulp.dest('dist'))
)

gulp.task('js-build', () => browserify({
  entries: ['src/index.js', "node_modules/@walletconnect/client/dist/esm/index.js"],
  extensions: ['.js'],
  insertGlobals: true,
  transform: [babelify.configure({ presets: ['@babel/preset-env'] })],
})
  .bundle()
  .pipe(source('index.js'))
  .pipe(gulp.dest('./dist/scripts'))
);

gulp.task('inline-script', () => gulp.src('dist/index.html')
  .pipe(inline({ compress: false }))
  .pipe(gulp.dest('dist'))
)

gulp.task('default', gulp.series('clean', 'html', 'js-build', 'inline-script'))
