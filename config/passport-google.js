//require the passport library
const passport=require("passport");

//require the passport-google-oauth library
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User=require("../models/user");

//Authentication
passport.use( 
    new GoogleStrategy({
        callbackURL:"/auth/google/redirect",
        clientID:"738604374264-mi0gjlmgv7lvoethfldiajab587drui8.apps.googleusercontent.com",
        clientSecret:"oRKWMonHTjfqkrG6YYD13r_8"

    }, (accessToken,refreshToken,profile,done)=>{
        //passport callback function
        console.log(profile);

        User.findOne({name:profile.displayName, googleId:profile.id, photo:profile._json.picture},function(err,user){
            if(err){
                console.log(`error in finding the user!! ${err.message}`);
                return done(err);
            }

            if(user)   //user has been found
            {
               return done(null,user);

            }
            else   //create a user in the DB
            {
                let new_user=new User({
                    name:profile.displayName,
                    googleId:profile.id,
                    photo:profile._json.picture
                });

                new_user.save(function(err,new_user){

                    if(err)
                    {
                        console.log(`Error in creating the new user ${err}`);
                        return done(err);
                    }
    
                    return done(null,new_user);
        
                })
            }
        })
         

    
    })
 )




 passport.serializeUser(function(user,done){
     done(null,user._id);
 })



 passport.deserializeUser(function(id,done){

    User.findOne({_id:id},function(err,user){
        if(err){console.log(`Error in findign the user by id stored in the cookie  -->passport ${err}`); return done(err);}

        return done(null,user);
    })
})



passport.setAuthenticatedUser=function(req,res,next){

    //whenever a user is signed in, the user's info is stored in req.user from the session cookie,
    //we are just sending this to the locals for the views

    //in manual auth, we used to get it everytime but now it's encrypted
    if(req.isAuthenticated)
         res.locals.user=req.user;
    return next();
 }


 passport.checkAuthenticated=function(req,res,next){
     if(req.isAuthenticated())
        return next();
     return res.redirect("/auth/login");
 }


 module.exports=passport;
