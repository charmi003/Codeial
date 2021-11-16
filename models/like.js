const mongoose=require("mongoose");

const likeSchema=new mongoose.Schema({
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    //dynamic referencing
    Parent:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        refPath:"onModel"
    },
    onModel:{
        type:String,
        required:true,
        // enum:["Post","Comment"]
    }

},{
    timestamps:true
})


const Like=mongoose.model("Like",likeSchema);
module.exports=Like;