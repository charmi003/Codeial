const mongoose=require("mongoose");
const multer=require("multer");
const path=require("path");


const userSchema=new mongoose.Schema({
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true
    },
    Name:{
        type:String,
        required:true
    },
    Posts:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
        }
    ],
    Avatar:{
        type:String,  //store the path to the image..image is gonna be there in uploads/users/avatars
    },
    Friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Friendship"
    }]

},{
    timestamps:true
});




//2 options for storage .. 1) Local storage  2)Remote storage(cloud or bucket)
//here we are choosing local storage
//storage tells the multer where and how to save our files
//The static Date.now() method returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC....using so that file name will always be unique
//cb is callback

const maxSize=1000*1024;  //1000KB
let fileStorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {    
      cb(null, "./uploads/users/avatars/");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})


const fileFilter = (req,file,cb) => {
    if(file.mimetype === "image/jpg"  || file.mimetype ==="image/jpeg"  || file.mimetype ===  "image/png" || file.mimetype === "image/gif" || file.mimetype === "image/svg"){
        cb(null, true);
   }
   else{
      return cb(new Error("Invalid file type!"),false);
      
    }
}
   
//exporting the multer (multer is a middleware)  so that it can be used
userSchema.statics.uploadedAvatar=multer({
    storage: fileStorageEngine,
    fileFilter:fileFilter,
    limits:{
        fileSize:maxSize
    }
}).single("Avatar");
//argument to single() is the file.fieldname


const User=mongoose.model("User",userSchema);

module.exports=User;