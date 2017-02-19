const gulp = require('gulp');
const tsc = require('gulp-typescript');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const tsProject = tsc.createProject('tsconfig.json');
const gulp_tslint = require('gulp-tslint');
const connect = require('gulp-connect');
//--- Configurations Constants ---

var paths = {
    sourceRoot : "./app/",
    webroot: "./deploy/",
    node_modules: "./node_modules/",
    typescript_in: "./app/scripts/",
    typescript_out: "./deploy/output"
};
paths.allTypeScript = paths.typescript_in + "**/*.ts";
paths.modulesDestination = paths.webroot + "vendors/";

//--- Task ---

gulp.task("clean", function (callback) {
    var typeScriptGenFiles = [
        paths.typescript_out + "/**/*.js",
        paths.typescript_out + "/**/*.js.map"
    ];

    del(typeScriptGenFiles, callback);
});

gulp.task("purge", function (callback) {
    del(paths.webroot + "**", callback);
});

gulp.task("copy", function () {
    var modulesToMove = {
        //"bootstrap": "bootstrap/dist/**/*.{js,map,css,ttf,svg,woff,eot}",
        "jquery": "jquery/dist/jquery*.{js,map}",
        "lodash": "lodash/lodash*.{js,map}",
        "requirejs": "requirejs/*.{js,map}"
    }

    for (var destinationDir in modulesToMove) {
        gulp.src(paths.node_modules + modulesToMove[destinationDir])
            .pipe(gulp.dest(paths.modulesDestination + destinationDir));
    }

    gulp.src("./app/index.html").pipe(gulp.dest(paths.webroot));
});


gulp.task("build", function () {
    var compilationResults = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
    compilationResults.dts.pipe(gulp.dest(paths.typescript_out));
    return compilationResults.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.typescript_out));
});

gulp.task("buildall", ["clean", "copy", "build"], function (callback) {
    callback();
});


gulp.task("tslint", () => {
    return gulp.src(['**/*.ts', '!**/*.d.ts', '!node_modules/**'])
        .pipe(gulp_tslint())
        .pipe(gulp_tslint.report());
});

gulp.task("buildsinglefile", () => {
    const arguments = process.argv;
    const pathWithFileNameToCompile = arguments[7];
    const pathWithoutFileNameForOutput = arguments[5].replace(arguments[3], ".").replace("\\src\\", "\\output\\");

    const step1 = gulp.src(pathWithFileNameToCompile)
        .pipe(sourcemaps.init())
        .pipe(tsc({
            "target": "es6",
            "module": "amd"
        }))

    step1.pipe(gulp.dest(pathWithoutFileNameForOutput));

    step1.dts.pipe(gulp.dest(pathWithoutFileNameForOutput));
    return step1.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(pathWithoutFileNameForOutput));
});

gulp.task('htmlreload', function () {
  gulp.src(paths.sourceRoot + '*.html')
    .pipe(connect.reload());
});

gulp.task('tsreload', function () {
  gulp.src(paths.typescript_in + '*.ts')
    .pipe(connect.reload());
});


gulp.task('watch', function (callback) {
    gulp.watch(paths.typescript_in + '*.ts', ['build', 'tsreload']);
    gulp.watch(paths.sourceRoot + '*.html', ['copy', 'htmlreload']); // Fast watch, no need to compile TS, just move the html into deploy
    callback();
});



gulp.task('server', function() {
  connect.server({
    root: 'deploy',
    livereload: true,
    port: 8080
  });
});

gulp.task('go', ["buildall", "server", "watch"], function() {

});