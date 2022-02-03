const source_folder = "src";
const project_folder = "dist";

let path = {
    build: {
      html: project_folder + "/",
      css : project_folder + "/css/",
      img : project_folder + "/img/",
      js : project_folder + "/js/",
   },
   src: {
     html: [source_folder + "/*.html", "!"+source_folder + "/_*.html"],
     css : source_folder + "/css/style.css",
     img : source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
     js : source_folder + "/js/fail.js",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css : source_folder + "/css/**/*.css",
    img : source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    js : source_folder + "/js/**/*.js"
 },
  clean: "./" + project_folder + "/"
}

// --------let--------
let { src, dest } = require('gulp'),
      gulp = require('gulp'),
      browsersync = require("browser-sync").create(),
      faileinclude = require("gulp-file-include"),
      htmlmin = require("gulp-htmlmin"),
      autoprefixer = require("gulp-autoprefixer"),
      clean_css = require("gulp-clean-css"),
      rename = require("gulp-rename"),
      uglify = require("gulp-uglify-es").default;



// --------function--------
function browserSync(params) {
  browsersync.init({
    server:{
      baseDir: "./" + project_folder + "/"
    },
    port: 3000,
    notify: false
  })
}
// --------html--------
function html() {
  return src(path.src.html)
    .pipe(faileinclude())
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}
// --------css--------
function css() {
  return src(path.src.css)
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
      rename({
        extname: ".min.css"
      }))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}
// --------js--------
function js() {
  return src(path.src.js)
    .pipe(faileinclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js"
      }))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}
// --------images--------
function images() {
  return src(path.src.img)
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}
// --------clean-------
function clean(params) {
}

// --------RUN(gulp svgSprite)-------
gulp.task('svgSprite', function () {
  return gulp.src([source_folder + '/iconsprite/*.svg'])
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../icons/icons.svg",
          //example: true
        }
      },
    }))
    .pipe(dest(path.build.img))
})

// --------watchFiles--------
function watchFiles(params) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}
let build = gulp.series(clean, gulp.parallel(html,css,js,images));
let watch = gulp.parallel(build, watchFiles, browserSync);

// --------exports--------
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;

exports.build = build;
exports.watch = watch;
exports.default = watch;
////////npm i////////
 
