//require the passport library
const passport=require("passport");  

//require the passport-local library that we installed and we want to use the strategy
const LocalStrategy=require("passport-local").Strategy;

//require the User
const User=require("../models/user");


//Authentication using passport
//we need to tell passport to use the local strategy
passport.use(new LocalStrategy({
    usernameField:"Email" ,   //Email key form our schema is what we have kept unique
    passwordField:"Password",
    passReqToCallback:true   //for flash messages, we need the req object
    },
    function(req,Email,Password,done)   //done=> inbuilt to passport and is automically called...it's a callback fn we can name it anyhting we want 
    {
        //find a user and establish the identity
        User.findOne({Email:Email},function(err,user){
            if(err){ 
                req.flash("error",err);
            }

            if(!user || user.Password!=Password)
            {
                req.flash("error","Invalid email/password");
                return done(null,false);   //no error but authentication failed

            }

            return done(null,user);  //authentication successful
        })


    }
))


// serializing:-put the user_id into cookie
// deserializing:-using the user_id from the cookie and finduser using that


//serializing the user to decide which key to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user._id);   //we want to store user._id in the cookie in the encrypted format
    //encryption is done automatically by passport
})




// deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done){

    User.findById(id,function(err,user){
        if(err){console.log(`Error in findign the user by id stored in the cookie  -->passport ${err}`); return done(err);}

        return done(null,user)
    })
})




/*we have done the sign in of the user (that is authenticate the user).
 Serialize the user i.e., when the user signs in, we find the id and store it in the cookie and the cookie is sent to the browser
 Now when the browser sends a request, we deserialize the user i.e., find the user by the id stored in the cookie*/

 /*done(null,....) first argument null=> no error*/



 //check if the user is authenticated
 passport.checkAuthentication=function(req,res,next){

    //if the user is authenticated
    if(req.isAuthenticated())
    {
        return next();  //pass the control to the controller's action
    }

    //if the user isn't authenticated
    return res.redirect("/users/signIn");
 }



 //check if user not authenticated
 passport.checkNotAuthenticated=function(req,res,next){

    if(req.isAuthenticated())
    {
        return res.redirect("/users/profile");
    }
    return next();
 }

 
    


 passport.setAuthenticatedUser=function(req,res,next){

    //whenever a user is signed in, the user's info is stored in req.user from the session cookie,
    //we are just sending this to the locals for the views

    //in manual auth, we used to get it everytime but now it's encrypted
    if(req.isAuthenticated)
         res.locals.user=req.user;
    return next();
 }




 //req.isAuthenticated is by default provided by the passport

 
 module.exports=passport;


//  No, passport itself does not require cookie-parser middleware. If you want session-persistent authentication then you'll need the express-session middleware, which used to require cookie-parser, but modern versions of express no longer have this requirement (the current version of express-session reads and writes cookies directly)
