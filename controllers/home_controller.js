const Post=require("../models/post");
const User=require("../models/user");

module.exports.home=async function(req,res){
    try
    {
        //populate the user of each post and also the comments associated with a post and the user inside that comment
        let posts=await Post.find({})
        .sort("-createdAt")   //sorting ..latest one first
        .populate("User")
        .populate({
            path:"Comments",
            populate:{
                path:"User Likes"
            }
        })
        .populate({
            path:"Likes"
        })
        
        //populating the friends of the current logged in user
        if(req.user)
        {
            await req.user.populate({
                path:"Friends",
                populate:"From_user To_user"
            }).execPopulate();

        }
        

        //find all the users
        let users=await User.find({});
        
        //return the response to the browser
        return res.render("home",{
            title:"Codeial",
            posts:posts,
            all_users:users
        });

    }catch(err)  //will enter this block if any error in any part inside the try block
    { 
        console.log(`Error ${err}`);
        return;
    }
    
}

