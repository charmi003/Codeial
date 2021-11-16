/*optimizing the assets ==>  compressing(minimizing) the files and also adding a hash to avoid caching by the browser*/

/* minify-->no spaces,no newlines...renaming some things..*/

const gulp=require("gulp");
const del=require("del");
const imagemin=require("gulp-imagemin");

//compressing the css files
const cssnano=require("gulp-cssnano");

//rev-->revisioning or renaming...rename the css files by adding a hash alongside
//so if it's home.css it will be changed to home-abcxyz.css
//so whenever the asset files are sent, they will have a new name so that the browser will accept them as new assets instead of using the cached ones 
const rev=require("gulp-rev");


//with gulp,we create tasks


/*Task for minfying the CSS */
gulp.task("css",(done)=>{
    console.log("Minifying the css...");

    gulp.src("./assets/**/*.css")
    .pipe(cssnano())   //compress
    .pipe(rev())       //rename
    .pipe(gulp.dest("./public/assets"))
    .pipe(rev.manifest('public/manifest/css-rev-manifest.json',{
        cwd:"public",
        merge:true,
    }))
    .pipe(gulp.dest("public"))

    done();
})




/*manifest file will store the map...original file name: renamed file name*/


// ("./assets/**/*.css")  ** menas look into all folders and subfolders inside assets and then in those folders or subfolders look for any file ending with .css 


const uglify=require("gulp-uglify-es").default;
/*Task for minfying the JS */
gulp.task("js",(done)=>{
    console.log("Minifying the js...");

    gulp.src("./assets/**/*.js")
    .pipe(uglify())   //compress
    .pipe(rev())       //rename
    .pipe(gulp.dest("./public/assets"))
    .pipe(rev.manifest('public/manifest/js-rev-manifest.json',{
        cwd:"public",
        merge:true,
    }))
    .pipe(gulp.dest("public"))

    done();
})


/*For imagemin to work, i had to run this script node node_modules/optipng-bin/lib/install.js*/
gulp.task('images', function (done) {
    console.log('compressing images...');
    gulp
      .src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
      .pipe(imagemin())
      .pipe(rev())
      .pipe(gulp.dest('./public/assets'))
      .pipe(
        rev.manifest('public/manifest/images-rev-manifest.json',{
          cwd: 'public',
          merge: true,
        })
      )
      .pipe(gulp.dest('public'));
    done();
  });


/*merging the diff manifest files into a single file*/
  const merge=require("gulp-merge-json");
  gulp.task('merge-manifest',(done)=>{
    gulp.src("./public/manifest/*")
    .pipe(merge({
      fileName:'rev-manifest.json'
    }))
    .pipe(gulp.dest("./public/assets"))

    done();
  })


//empty the public/assets directory..so whenever you build, clear the previous stuff and build from sratch
gulp.task("clean",function(done){
    del.sync("./public/assets");
    del.sync("./public/manifest");
    done();
})



gulp.task("build",gulp.series("clean","css","js","images"),function(done){
    console.log("Builing assets..");
})





/*to run a task, command-->  gulp taskname */