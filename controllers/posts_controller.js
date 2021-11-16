 const Post=require("../models/post");
const User = require("../models/user");
const Comment=require("../models/comment");
const postsMailer=require("../mailers/posts_mailer");
const queue=require("../config/kue");
const EmailWorker=require("../workers/email_worker");
const Like = require("../models/like");



/*Action for creating a new post*/
module.exports.create=async function(req,res)
{
    let new_post=new Post({
        Content:req.body.Content,
        User:req.user._id
    })
    try
    {
        let new_post_created=await new_post.save();

        //saving the id of this new post in the posts array of the user (who has created this post)
        let user_found=await User.findById(req.user._id);    
        user_found.Posts.push(new_post_created._id);
        await user_found.save();

        await new_post_created.populate("User","Name Email").execPopulate();    //populate doesn't work without callback


        postsMailer.newPost(new_post_created);  //this need to go into the queue
        let job= queue.create("emails",{    //job.data refers to this object
            post:new_post_created,
            function:"newPost"

        }).save(function(err){
            if(err){console.log("error in creating a quue"); return;}
            console.log(job.id);
        })
        
        
        // req.flash("success","Post published");

        if(req.xhr)  //xmlHttpRequest
        {
            return res.status(200).json({
                post:new_post_created,
                message:"Post Created!",
                flash:{
                    success:"Post published"
                }
            });

        }
        return res.redirect("/");
    }
    catch(err)
    {
        req.flash("error",err);
        return res.redirect("back");
    }
}






/*Action for deleting a post*/
module.exports.destroy=async function(req,res)
{
    let post_id=req.params.post_id;
    try
    {
        let post_found=await Post.findById(post_id);
        if(post_found.User==req.user.id)  //.id means converting the objectId into string
        {
            
            //Deleting the likes associated with the post
            await Like.deleteMany( { _id: {$in:post_found.Likes} } );

            //deleting the likes on the comments of this post
            await Like.deleteMany( {Parent:{$in:post_found.Comments}, onModel:"Comment"} )

            //Deleting the comments associated with the post
            await Comment.deleteMany( { _id:{$in:post_found.Comments} } );

            //Deleting the post from the posts array contained in user
            await User.findByIdAndUpdate(req.user._id,{ $pull:{Posts:post_id} });

            //delete the post
            post_found.remove();

            // req.flash("success","Post and the associated comments deleted");

            if(req.xhr)
            {
                return res.status(200).json({
                    post_id:req.params.post_id,
                    message:"Post deleted!",
                    flash:{
                        success:"Post and the associated comments and likes deleted"
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