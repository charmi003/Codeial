const mongoose=require("mongoose");

const commentSchema=new mongoose.Schema({
    Content:{
        type:String,
        required:true
    },
    //comment belongs to a user
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    Post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    Likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Like"
        }
    ]

},{
    timestamps:true
})


const Comment=mongoose.model("Comment",commentSchema);

module.exports=Comment;