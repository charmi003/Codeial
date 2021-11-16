const mongoose=require("mongoose");

const friendshipSchema=new mongoose.Schema({

    //the user who has sent the request
    From_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    //the user who has accepted the request
    To_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
})


const Friendship=mongoose.model("Friendship",friendshipSchema);

module.exports=Friendship;