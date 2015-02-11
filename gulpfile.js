var gulp = require('gulp');
var connect = require('gulp-connect-multi')();
var replace = require('gulp-replace');
var ghpages = require('gh-pages');
var clean = require('gulp-clean');
var path = require('path');

var copy = function (){
  gulp.src([
    'bower_components/**/*',
    'demo/*',
    'src/*',
    'index.html'
    ], {
      base: './'
    })
    .pipe(gulp.dest('./.tmp/'));
}

var build = function (){
  gulp.src(['src/*'])
    .pipe(replace(/bower_components/g, '..'))
    .pipe(gulp.dest('dist/'));
}
var ignore = function (){
  gulp.src(['./.tmp/bower_components/x-carousel'])
    .pipe(clean());
}

gulp.task('server', connect.server({
  root: [__dirname],
  port: 8000,
  livereload: true
}));

gulp.task('build', ['beforebuild'],function(){
  build()
});
gulp.task('beforebuild', function(){
  copy()
  ignore()
});

gulp.task('deploy', ['beforebuild'], function () {

  ghpages.publish(path.join(__dirname, '.tmp/'), {
      clone: 'bower_components/x-carousel',
      logger: function(message) {
        console.log(message);
      }
  } , function(err) {

    console.log("");
    if(err.errno == 34){
      console.log("Error: You need run 'gulp build' before deploy your custom element in gh-pages.\n");
    } else if(typeof err.errno == "undefined"){
      console.log("Error: You need add a remote repository before deploy your custom element in gh-pages.\n");
    }

  }, true);

});