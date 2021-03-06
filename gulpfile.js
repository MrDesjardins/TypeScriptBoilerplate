const gulp = require('gulp');
const tsc = require('gulp-typescript');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const tsProject = tsc.createProject('tsconfig.json');
const gulp_tslint = require('gulp-tslint');
const connect = require('gulp-connect');
const changed = require('gulp-cached');

//--------------- Configurations Constants ------------

const server_port = 8080;
var paths = {
    sourceRoot : "./app/",
    webroot: "./deploy/",
    node_modules: "./node_modules/",
};

paths.modulesDestination = paths.webroot + "vendors/";
paths.typescript_in = paths.sourceRoot + "scripts/";
paths.typescript_out = paths.webroot + "output"
paths.allTypeScript = paths.typescript_in + "**/*.ts";

//------------------------ Tasks ------------------------

gulp.task("clean", (callback) => {
    var typeScriptGenFiles = [
        paths.typescript_out + "/**/*.js",
        paths.typescript_out + "/**/*.js.map"
    ];

    del(typeScriptGenFiles, callback);
});

gulp.task("purge", (callback) => {
    del(paths.webroot + "**", callback);
});

gulp.task("copy", () => {
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

gulp.task("build", () => {
    var compilationResults = gulp.src(paths.typescript_in+"**/*.ts")
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

gulp.task('htmlreload', () => {
  gulp.src(paths.sourceRoot + '*.html')
    .pipe(connect.reload());
});

gulp.task('tsreload', () => {
  gulp.src(paths.typescript_in + '*.ts')
    .pipe(connect.reload());
});

gulp.task('watch', (callback) => {
    gulp.watch(paths.allTypeScript).on("change", function(file) {
        var compilationResults = gulp.src(paths.allTypeScript)
            .pipe(changed(paths.typescript_out))
            .pipe(sourcemaps.init())
            .pipe(tsProject())
        compilationResults.dts.pipe(gulp.dest(paths.typescript_out));
        compilationResults.js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(paths.typescript_out))
            .pipe(connect.reload());
    });
    gulp.watch(paths.sourceRoot + '*.html', ['copy', 'htmlreload']); // Fast watch, no need to compile TS, just move the html into deploy
    callback();
});

gulp.task('server', () => {
  connect.server({
    root: paths.webroot,
    livereload: true,
    port: server_port
  });
});

gulp.task('go', ["buildall", "server", "watch"], () => {

});