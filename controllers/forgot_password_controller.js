const User=require("../models/user");
const ResetPasswordToken=require("../models/ResetPasswordToken");
const crypto=require("crypto");
const ResetPasswordToken_mailer=require("../mailers/ResetPasswordToken_mailer");



//display the email form
module.exports.EmailForm=function(req,res){
    res.render("email_form",{
        title:"Codeial"
    });

}
//mail the reset link
module.exports.ResetLink=async function(req,res){

    try{
        let user=await User.findOne({Email:req.body.Email});  

        //if no user exists with this email
        if(!user){
            req.flash("error","Email doesn't exist!");
            return res.redirect("/users/signUp");
        }

        //if the user exists

        let token=new ResetPasswordToken({
            User:user._id,
            AccessId:crypto.randomBytes(15).toString("hex"),
            IsValid:true
        })

        let token_created=await token.save();  //saving the token in the DB

        await token_created.populate("User","Name Email").execPopulate();

        ResetPasswordToken_mailer.resetToken(token_created);

        req.flash("success","Reset password link sent to the given email id");
        return res.redirect("/users/signIn");

    }catch(err){
        req.flash("error",err);
        return res.redirect("back");
    }
   
}



//display the password form
module.exports.PasswordForm=async function(req,res){

    try{
        let token=await ResetPasswordToken.findOne({AccessId:req.query.accessId});

        if(!token){
            req.flash("error","Invalid Link");
            return res.redirect("/users/signIn");
        }
        else if(token){

            if(!token.IsValid){
                return res.end("Your token has expired");
            }
            else
            {
                return res.render("password_form",{
                    title:"Codeial",
                    accessId:req.query.accessId
                })
            }
        }

    }catch(err){
        req.flash("error",err);
        return res.redirect("back");

    }
}


//update the new password
module.exports.update=async function(req,res){

    if(req.body.Password!=req.body.ConfirmPassword)
    {
        req.flash("error","Passwords don't match");
        return res.redirect("back");
    }
    else
    {
        try{
            let token=await ResetPasswordToken.findOne({AccessId:req.body.accessId});

            //token will exists since before displaying the password form the chekc id there and then it is apssed in a hidden way to this ..so 

            await User.findByIdAndUpdate(token.User,{
                Password:req.body.Password
            })

            await token.remove();

            req.flash("success","Password updated successfully!!");
            return res.redirect("/users/signIn");

        }
        catch(err)
        {
            req.flash("error",err);
            return res.redirect("back");
        }
    }
}