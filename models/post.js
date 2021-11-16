const mongoose=require("mongoose");

const postSchema=new mongoose.Schema({
    
    Content:{
        type:String,
        required:true
    },
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    //include the array of ids of all the comments on a post
    Comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
    Likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Like"
        }
    ]


},{
    timestamps:true
})


const Post=mongoose.model("Post",postSchema);

module.exports=Post;
