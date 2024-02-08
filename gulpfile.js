const gulp = require('gulp');
const less = require('gulp-less');
const del = require('del'); 
const patch = { //константа будет хранить в себе пути. src-откуда; dest-куда
    styles:{
        src: 'src/styles/**/*.less', 
        // /**/- любая вложенность файла
        //*.less- звездочка означает имя файла
        
        
        dest: 'dist/css/' //каталог заполняется файлами после компиляции, постоянно будет очищаться и заполняться новыми файлами при компиляции
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        // /**/- любая вложенность файла
        //*.js- звездочка означает имя файла
        
        dest: 'dist/js/' //каталог заполняется файлами после компиляции, постоянно будет очищаться и заполняться новыми файлами при компиляции
    }
}
const rename = require('gulp-rename');
const clean_css = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

//------------------------функция для очистки каталога(ЗАПУСТИТЬ ПЕРВОЙ)------------------

function clean() {
    return del(['dist'])
}

//------------------------функция для обработки стилейs--------------------------------

function styles() {
    return gulp.src(patch.styles.src)
    
    //pipe- действие, которое будет выполняться при компиляции 
    .pipe(less()) //компиляция и преобразование в css
    .pipe(clean_css()) //выполнит минификацию кода(удалит пробелы, знаки и отступы)
    .pipe(rename({ //переименовываем файл,добавляя суффикс min
        basename: 'style',
        suffix: '.min',
    }))
    .pipe(gulp.dest(patch.styles.dest)); //минифицированный файл перемешается в dist
}

//------------------------функция для обработки скриптов--------------------------------

function scripts() {
    return gulp.src(patch.scripts.src, { //передаем объект
        sourcemaps: true,
    })
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('index.min.js'))
        .pipe(gulp.dest(patch.scripts.dest)) //куда будет записываться файл
}

//------------------------функция для автоматизации--------------------------------

function watch(){
    gulp.watch(patch.styles.src, styles) //в скобках записываются файлы, за изменениями которых нужно следить 
    gulp.watch(patch.scripts.src, scripts) //отслеживание изменения скриптов
}





exports.clean = clean; //экспортируем задачу из функции clean
exports.styles = styles; 
exports.watch = watch;
exports.scripts = scripts;

exports.build = gulp.series(clean, styles, scripts)
//series позволяет выполнять задачи последовательно, одна за другой

exports.build = gulp.series(clean, gulp.parallel(styles, scripts)) //parallel- 2 эти задачи будут выполняться одновременно

exports.default = gulp.series(clean, gulp.parallel(styles, scripts), watch) //сработает если просто прописать gulp в терминале- т.е сначала выполнится действие clean, потом одновременно styles и scripts, потом watch