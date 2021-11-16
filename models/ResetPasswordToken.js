const mongoose=require("mongoose");

const ResetPasswordTokenSchema=new mongoose.Schema({
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    AccessId:{
        type:String,
        required:true
    },
    IsValid:{
        type:Boolean
    }
},{
    timestamps:true
})


const ResetPasswordToken=mongoose.model("ResetPasswordToken",ResetPasswordTokenSchema);

module.exports=ResetPasswordToken;