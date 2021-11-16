const passport=require("passport");
const JWTStrategy=require("passport-jwt").Strategy;
const ExtractJWT=require("passport-jwt").ExtractJwt;

const User=require("../models/user");

let opts={
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:"codeial"
}

passport.use(new JWTStrategy(opts,function(jwtPayload,done){
    User.findById(jwtPayload._id,function(err,user){
        if(err){console.log(err); return;}
        if(user)
            return done(null,user);
        else    //no error but user not found, so authentication failed
            return done(null,false);

        })
    })
)


module.exports=passport;

