const Post=require("../../../models/post");

module.exports.index=async function(req,res){
    let posts=await Post.find({})
        .sort("-createdAt")   //sorting ..latest one first
        .populate("User")
        .populate({
            path:"Comments",
            populate:{
                path:"User"
            }
    })
    return res.status(200).json({
        posts_arr:posts,
        message:"All posts!"
    })
}