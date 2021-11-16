//earlier, signing in means authenticate and then store the user in the session info
//now, we want to explicitly create a json web token on sign in

const User=require("../../../models/user");
const jwt=require("jsonwebtoken");

/*Get the signIn form data*/
module.exports.createSession=function(req,res){
    req.flash("success","Logged in successfully");
    return res.redirect("/");
}
