const User=require("../models/user");
const Friendship=require("../models/friendship");


/*Action for adding a friend*/
module.exports.addFriend=async function(req,res){
    try{
        let new_friendship=new Friendship({
            From_user: req.user._id,
            To_user: req.query.second_user
        })
    
        let new_friendship_created=await new_friendship.save();
    
        let u1=await User.findByIdAndUpdate(req.user._id, { $push:{Friends:new_friendship_created} } );
        let u2=await User.findByIdAndUpdate(req.query.second_user, { $push:{Friends:new_friendship_created} } );
    
        req.flash("success","Friend Added!!")
        return res.redirect("/");
    }
    catch(err)
    {
        req.flash("error",err);
        return res.redirect("back");
    }
}



/*Action for removing a friend*/
module.exports.removeFriend=async function(req,res){
    try
    {
        let friendship_found=await Friendship.find({
            $or:[
    
                { To_user:req.user, From_user:req.query.second_user},
                { To_user:req.query.second_user, From_user:req.user}
            ]
        })
        // console.log(friendship_found) it's an array so use [0]
    
        //removing the frienship form the Friends array of both the users
        await User.findByIdAndUpdate(req.user, { $pull:{Friends:friendship_found[0]._id} } );
        await User.findByIdAndUpdate(req.query.second_user, { $pull:{Friends:friendship_found[0]._id} } );
    
        //deleting the friendship
        await Friendship.findByIdAndDelete(friendship_found[0]._id);

        req.flash("success","Friend Removed!!")
        return res.redirect("/");
    }
    catch(err)
    {
        req.flash("error",err);
        console.log(err);
        return res.redirect("back");
    }


}