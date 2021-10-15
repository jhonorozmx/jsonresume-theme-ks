const
  gulp = require('gulp'),
  fs = require('fs'),
  $ = require('gulp-load-plugins')();

const resume = () => {
  // if (!fs.existsSync('resume.json')) {

  // generates resume with custom information.
  // fs.createReadStream('resume-sample.json').pipe(fs.createWriteStream('resume.json'));

  // generates a template with json format.
  fs.createReadStream('resume-template.json').pipe(fs.createWriteStream('resume.json'));
  // }

  return gulp.src('public/**/*').pipe($.size({
    title: 'build',
    gzip: true
  }));
}

gulp.task('resume', resume);
