///////////////////////////////////
// Required
///////////////////////////////////
var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	plumber = require('gulp-plumber'),
	compass = require('gulp-compass'),
	autoprefixer = require('gulp-autoprefixer'),
	//browserSync = require('browser-sync'),
	//reloadBrowser = browserSync.reload,
	browserSync = require('browser-sync').create();
	del = require('del');
	rename = require('gulp-rename');

///////////////////////////////////
// Scripts Task
///////////////////////////////////
gulp.task('scripts', function() {
	//console.log("Gulp Task Runner Started !");
	gulp.src(['app/js/**/*.js', '!app/js/**/*.min.js'])
	.pipe(plumber())
	.pipe(rename({suffix:'.min'}))
	.pipe(uglify())
	.pipe(gulp.dest('app/js/min'))
	//.pipe(reloadBrowser({stream:true}));
	.pipe(browserSync.stream());
});

///////////////////////////////////
// Compass/SASS Tasks
///////////////////////////////////
gulp.task('compass_task', function() {
	gulp.src('app/scss/**/*.scss')
		.pipe(plumber())
		.pipe(compass({
			config_file: './config.rb',
			css: 'app/css',
			sass: 'app/scss'
		}))
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest('app/css'))
		//.pipe(reloadBrowser({stream:true}));
		.pipe(browserSync.stream());
});

///////////////////////////////////
// HTMl Tasks
///////////////////////////////////
gulp.task('html_task', function() {
	gulp.src('app/**/*.html')
	//.pipe(reloadBrowser({stream:true}));
	.pipe(browserSync.stream());	
});


///////////////////////////////////
// Browser Sync Tasks
///////////////////////////////////
gulp.task('browserSync_task', function() {
	/*
	browserSync({
		server:{
			baseDir:"./app/"
		}
	});
	*/
	browserSync.init({
        server: {
            baseDir: "./app/"
        }
    });
    /*
    browserSync.init({
        proxy: "yourlocal.dev"
    });
    */
});


///////////////////////////////////
// Watch Tasks
///////////////////////////////////
gulp.task('watch_task', function() {
	gulp.watch(['app/js/**/*.js', '!app/js/**/*.min.js'],['scripts']);
	gulp.watch('app/scss/**/*.scss',['compass_task']);
	gulp.watch('app/**/*.html',['html_task']);
});

///////////////////////////////////
// Default Task
///////////////////////////////////
gulp.task('default', ['scripts', 'compass_task', 'html_task', 'browserSync_task', 'watch_task']);


///////////////////////////////////
// Build Tasks
///////////////////////////////////

// CLean out all files and folders from build folder
gulp.task('build:cleanFolder', function() {
	del([
		'build/**'
	]);
});

// Task to create build directory for all files
gulp.task('build:copy', ['build:cleanFolder'], function() {
	return gulp.src('app/**/*')
	.pipe(gulp.dest('build/'));
});

// Task to remove unwanted build files
// List all files and directories here that we dont want to include
gulp.task('build:remove', ['build:copy'], function(cb) {
	del([
			'build/scss/',
			'build/js/!(min)',			
			'build/js/min/!(*.min.js)'			
		], cb);
})


gulp.task('buildApp', ['build:copy', 'build:remove']);

// Task to run build server for testing final app
gulp.task('build:serve', function() {	
	browserSync.init({
		server:{
			baseDir:"./build/"
		}
	});		
});