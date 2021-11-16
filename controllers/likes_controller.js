const Like=require("../models/like");
const Post=require("../models/post");
const Comment=require("../models/comment");


module.exports.toggleLike=async function(req,res){

    /*  /likes/toggle/?p_id="abcxyz"&p_type="Post" */

    try
    {
        let isDeleted=false;
        let parent;
         
        if(req.query.p_type=="Post")   //parent of this like is post
        {
            parent=await Post.findById(req.query.p_id);
        }
        else    //parent of this like is comment
        {
            parent=await Comment.findById(req.query.p_id);
        }

        let like_found=await Like.findOne({
            User:req.user._id,
            Parent:req.query.p_id,
            onModel:req.query.p_type              
        })
        
        if(like_found)   //like already exists...we need to remove it
        {
            //before removing the like, we need to remove it from the likes array of it's parent
            await parent.Likes.pull(like_found._id);
            await parent.save();

            await like_found.remove();
            isDeleted=true;
        }
        else   //like doesn't exist..so create one
        {
            let new_like=new Like({
                User:req.user._id,
                Parent:req.query.p_id,
                onModel:req.query.p_type
            });
            let new_like_created=await new_like.save();

            //push this like into the likes array of it's parent
            await parent.Likes.push(new_like_created._id);
            await parent.save();

        }

        if(req.xhr)
        {
            return res.status(200).json({
                message:"Like toggled!",
                isDeleted:isDeleted
            })
        }

        return res.redirect("back");


    }
    catch(err)
    {
        console.log(err);

        return res.json(500, {
            message:"Internal Server Error"
        })
    }
}