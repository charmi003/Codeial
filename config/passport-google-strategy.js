const passport=require("passport");
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const env=require("./environment");

//crypto for generating random passwords ..if a user signs up using google
const crypto=require("crypto");  

const User=require("../models/user");

passport.use(new GoogleStrategy({
    clientID:env.google_clientID,
    clientSecret:env.google_clientSecret,
    callbackURL:env.google_callbackURL

},async function(accessToken,refreshToken,profile,done){ 
    //refreshToken is used to generate another accessToken if the existing one expires
    // console.log(profile);
    //console.log(accessToken);
    try{
        let user=await User.findOne({Email:profile.emails[0].value});
        if(user)   //if found,set this user as req.user
            return done(null,user);
        else
        {
            //if not found,create the user
            let new_user=new User({
                Name:profile.displayName,
                Email:profile.emails[0].value,
                Password:crypto.randomBytes(20).toString("hex")
            });
            let new_user_created=await new_user.save();
            return done(null,user);
        }
        
    }catch(err){
        req.flash("error",err);
        return done(err);
    }
    
})
)


passport.setAuthenticatedUser=function(req,res,next){

    //whenever a user is signed in, the user's info is stored in req.user from the session cookie,
    //we are just sending this to the locals for the views

    //in manual auth, we used to get it everytime but now it's encrypted
    if(req.isAuthenticated)
         res.locals.user=req.user;
    return next();
 }


module.exports=passport;