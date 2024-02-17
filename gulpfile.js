import dotenv from 'dotenv';
import GulpClient from 'gulp';

// ERROR-HANDLING
import gulpPlumber from 'gulp-plumber';
import notify from 'gulp-notify';

// DIRS & FILES
import changed, { compareContents } from 'gulp-changed';
import fileSystem from 'fs';
import gulpClean from 'gulp-clean';

// HTML
import autoPrefixer from 'gulp-autoprefixer';
import fileinclude from 'gulp-file-include';
import htmlmin from 'gulp-htmlmin';
import prettier from 'gulp-prettier';

// IMAGES
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import webpCss from 'gulp-webp-css';
import webpHTML from 'gulp-webp-html';

// STYLES
import * as dartSass from 'sass';
import groupMedia from 'gulp-group-css-media-queries';
import gulpSass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob';

dotenv.config();

const mode = process.env.MODE;
const isDev = mode === 'development';
const isProd = mode === 'production';

const rootDir = './src';
const destDir = isDev ? './build' : isProd ? './dist' : './build';

const sassCompiler = gulpSass(dartSass);
const plumberConfig = { errorHandler: notify.onError() };

/**
 * Substitute @@include('./some/path/file.html') with the HTML code that is present in
 * this file.
 */
GulpClient.task('includeFiles', () => {
    const source = `${rootDir}/html/*.html`;
    const dest = `${destDir}/`;

    var gulp = GulpClient.src(source)
        .pipe(changed(dest, { hasChanged: compareContents }))
        .pipe(gulpPlumber(plumberConfig))
        .pipe(fileinclude({ prefix: '@@', basepath: '@file' }));

    if (isProd) {
        gulp = gulp
            .pipe(webpHTML())
            .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }));
    } else {
        gulp = gulp.pipe(prettier());
    }

    return gulp.pipe(GulpClient.dest(dest));
});

/**
 * Produces one .css file by combining all .scss files and storing it in the dist
 * directory.
 */
GulpClient.task('sassCompile', () => {
    const source = `${rootDir}/scss/*.scss`;
    const dest = `${destDir}/css/`;

    var gulp = GulpClient.src(source, { sourcemaps: isDev })
        .pipe(changed(dest, { hasChanged: compareContents }))
        .pipe(gulpPlumber(plumberConfig))
        .pipe(sassGlob())
        .pipe(sassCompiler({ outputStyle: 'expanded', indentWidth: 4 }));

    if (isProd) {
        gulp = gulp
            .pipe(autoPrefixer({ cascade: false })) // in time build add prefixes to new or experimental prop
            .pipe(webpCss())
            .pipe(groupMedia())
            .pipe(sassCompiler({ outputStyle: 'compressed' }));
    }

    return gulp.pipe(GulpClient.dest(dest, { sourcemaps: isDev }));
});

/**
 * Generate copies of all media files and the structure in the dist directory, and
 * decrease the weight of any pictures or icons.
 */
GulpClient.task('copyMedia', () => {
    const source = `${rootDir}/media/**/*`;
    const dest = `${destDir}/media/`;

    var gulp = GulpClient.src(source) // prettier-ignore
        .pipe(changed(dest));

    if (isProd) {
        gulp = gulp // prettier-ignore
            .pipe(webp())
            .pipe(GulpClient.src(source))
            .pipe(changed(dest));
    }

    return gulp // prettier-ignore
        .pipe(imagemin({ verbose: true }))
        .pipe(GulpClient.dest(dest));
});

/**
 * Delete directory dist.
 */
GulpClient.task('cleanDist', (done) => {
    if (!fileSystem.existsSync(`${destDir}`)) return done();

    return GulpClient.src(`${destDir}`, { read: false })
        .pipe(gulpClean()); // prettier-ignore
});

/**
 * Execute the necessary action after saving the specified file.
 */
GulpClient.task('watch', () => {
    GulpClient.watch(`${rootDir}/scss/**/*.scss`, GulpClient.parallel('sassCompile'));
    GulpClient.watch(`${rootDir}/**/*.html`, GulpClient.parallel('includeFiles'));
    GulpClient.watch(`${rootDir}/media/**/*`, GulpClient.parallel('copyMedia'));
});

/**
 * Run the required action when entering the `gulp` command in the command line.
 */
GulpClient.task('default', GulpClient.series(
    'cleanDist',
    GulpClient.parallel('includeFiles', 'sassCompile', 'copyMedia'),
    GulpClient.parallel('watch'),
)); // prettier-ignore
