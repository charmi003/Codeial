const Comment=require("../models/comment");
const Post=require("../models/post");
const Like=require("../models/like");


/*Action for creating a new comment*/
module.exports.create=async function(req,res){
    try
    {
        let new_comment=new Comment({
            Content:req.body.Content,
            User:req.user._id,
            Post:req.body.post_id
        })
    
        let new_comment_created=await new_comment.save();
    
        //store the id of this new_comment into the Comments array for the post with id=req.query.post_id
        await Post.findByIdAndUpdate(req.body.post_id,{ $push:{Comments:new_comment_created._id} });

        await new_comment_created.populate("User").execPopulate();   //populate doesn't work without callback

        // req.flash("success","Comment added");
         
        if(req.xhr)
        {
            return res.status(200).json({
                comment:new_comment_created,
                message:"Comment created",
                flash:{
                    "success":"Comment added"
                }
            })
        }

        return res.redirect("/");
    }
    catch(err)
    {
        req.flash("error",err);
        return res.redirect("back");
    }
}



/*Action for deleting a comment*/
module.exports.destroy=async function(req,res)
{
    let comment_id=req.params.comment_id;
    try
    {
        let comment_found=await Comment.findById(comment_id).populate("Post");

        if(comment_found.User==req.user.id || comment_found.Post.User==req.user.id)     //allow deleting the comment
        {  
            //first delete the comment id from the comments array of the post on which this comment
            // was made
            await Post.findByIdAndUpdate(comment_found.Post._id,{ $pull:{Comments:comment_found._id} });
                
            //delete the likes associated with this comment
            await Like.deleteMany( {_id:{$in:comment_found.Likes} } );


            await comment_found.remove();     //delete the comment 

            // req.flash("success","Comment deleted");

            if(req.xhr)
            {
                return res.status(200).json({
                    comment_id:comment_found._id,
                    message:"Comment deleted!",
                    flash:{
                        "success":"Comment deleted"
                    }
                })
            }
            return res.redirect("back");
        }
        else
        {
            req.flash("error","Unauthorized action");
            return res.redirect("back");
        }
    }
    catch(err)
    {
        req.flash("error",err);
        return res.redirect("back");
    }
}