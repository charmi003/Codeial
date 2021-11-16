const User=require("../models/user");
const multer=require("multer");
const fs=require("fs");
const path=require("path");
const ResetPasswordToken=require("../models/ResetPasswordToken");
const crypto=require("crypto");
const ResetPasswordToken_mailer=require("../mailers/ResetPasswordToken_mailer");



/*Rendering the profile page*/
module.exports.profile=async function(req,res){
    let user_id=req.params.user_id;
    try
    {
        let user=await User.findById(user_id);

        //populating the friends of this user
        await user.populate({
            path:"Friends",
            populate:"From_user To_user"
        }).execPopulate();

        return res.render("user_profile",{
            title:"Codeial | Profile",
            profile_user:user
        })

    }catch(err)
    {
        console.log(`Error ${err}`);
        return;
    }
}



/*Rendering the signUp page */
module.exports.signUp=function(req,res){
    return res.render("user_sign_up",{
        title:"Codeial | SignUp"
    })
}


/*Rendering the signIn page */
module.exports.signIn=function(req,res){
    return res.render("user_sign_in",{
        title:"Codeial | SignIn"
    })
}



/*Get the signUp form data */
module.exports.create=async function(req,res){
    
    //First check if the password and confirm_password are same or not, if not , redirect back ot the sign up page
    if(req.body.Password!=req.body.Confirm_password)
    {
        req.flash("error","Password and Confirm Password do not match")
        return res.redirect("back");

    }
    try
    {   
        //check if the email has already been taken
        let user=await User.findOne({ Email:req.body.Email });

        if(!user)   //Email has not been taken, so create a new user with this details
        {
            let new_user=new User(req.body);
            await new_user.save();
            req.flash("success","Signed up successfully");
            return res.redirect("/users/signIn");
            
        }
        else  //Email has already been taken
        {
            req.flash("error","Email has already been taken");
            return res.redirect("/users/signUp");
        }

    }catch(err)
    {
        req.flash("error",err);
        return res.redirect("back");
    }
}




/*Get the signIn form data*/
module.exports.createSession=function(req,res){
    req.flash("success","Logged in successfully");
    return res.redirect("/");
}



/*SignOut*/
module.exports.destorySession=function(req,res)
{
    req.logout();   //provided by default by passport
    req.flash("success","Logged out successfully");
    return res.redirect("/");
     
}



/*update the user's info*/
module.exports.update=async function(req,res)
{
    // if(req.params.user_id==req.user.id)
    // {
    //     try
    //     {
    //         await User.findByIdAndUpdate(req.params.user_id,req.body);
    //         req.flash("success","Details updated successfully")
    //         return res.redirect("/");
    //     }
    //     catch(err)
    //     {
    //         req.flash("error",err);
    //         return res.redirect("back");
    //     }
        
    // }else
    // {
    //     // res.status(401).send("Unauthorized");
    //     req.flash("error","Unauthorized action");
    //     return res.redirect("back");
    // }

    if(req.params.user_id==req.user.id)
    {
        try
        {
            let user=await User.findById(req.params.user_id);
            User.uploadedAvatar(req,res,function(err){
                console.log(req.file);
                // console.log(req.file);
                //able to accedd req.body only because of multer...normally can't do it since its a multi-part form now
                user.Name=req.body.Name;  
                user.Email=req.body.Email;

                // FILE SIZE ERROR
                if (err instanceof multer.MulterError) {
                    req.flash("error","File size exceeded!");
                    return res.redirect("back");
                }

                // INVALID FILE TYPE, message will return from fileFilter callback
                else if (err) {
                    req.flash("error","Invalid file type");
                    return res.redirect("back");
                }
        
                // SUCCESS
                if(req.file)
                {
                    if(user.Avatar)
                    {
                        //delete the previous avatar
                        fs.unlinkSync(path.join(__dirname,"..",user.Avatar)); 
                    }
                    user.Avatar="/uploads/users/avatars/"+req.file.filename;
                    
                }
                user.save();
                req.flash("success","Details updated successfully");
                return res.redirect("back");

            })
        }
        catch(err)
        {
            req.flash("error",err);
            return res.redirect("back");
        }
        
    }else
    {
        // res.status(401).send("Unauthorized");
        req.flash("error","Unauthorized action");
        return res.redirect("back");
    }
}




// So, first of all, if you want to operate with images (or other static files) with your Node.js server you need to configure static paths

// Then, let's says you configured it with path /uploads and (for example) your Node.js server running on localhost:3000 then you can access to any file in this directory by given path

// http://localhost:3000/uploads/example.jpg
// With this path you can display image on front end using img tag

// <img src="http://localhost:3000/uploads/example.jpg"/>



