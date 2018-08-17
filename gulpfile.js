const gulp = require('gulp');
const rename = require('gulp-rename');
const server = require('browser-sync').create();
const postcss = require('gulp-postcss');
const atImport = require("postcss-import")
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const del = require('del');

del.sync('./dist');

function reload(done) {
    server.reload();
    done();
}

function serve(done) {
    server.init({
        server: './dist',
        host: '0.0.0.0',
        port: 8888,
        cors: true,
    });
    done();
}

gulp.task('html', () => gulp.src('./src/*.html').pipe(gulp.dest('./dist')));

gulp.task('scss', () => {
    const plugins = [
    	atImport(),
        autoprefixer({
        	browsers: ['> 5%', 'ie >= 9', 'ff >= 28', 'Chrome >= 21'],
        	cascade: false
        }),
        // cssnano()
    ];
    return gulp.src(['./src/scss/*.scss', '!_*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./dist'))
        .pipe(rename({ suffix: ".min" }))
        .pipe(cleanCSS({
            advanced: false,
            keepBreaks: true,
            keepSpecialComments: '*',
            level: { 1: { specialComments: false }}
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('webserver', gulp.series(serve));

gulp.task('watch:html', () => gulp.watch('./src/*.html', gulp.series('html', reload)));

gulp.task('watch:scss', () => gulp.watch('./src/scss/**/*.scss', gulp.series('scss', reload)));

gulp.task('watch', gulp.parallel([
    'watch:html',
    'watch:scss'
]));

gulp.task('dev', 
	gulp.series([
		'html',
		'scss',
		gulp.parallel([
	        'watch',
	        'webserver'
    	])
	])
);

gulp.task('default', gulp.parallel('dev'));