const express=require("express");
const router=express.Router();
const auth_controller=require("../controllers/auth_controller");
const passport=require("passport");

router.get("/google",passport.authenticate('google',{
    scope: ['profile','email'],  //things we would like to fetch
    failureRedirect:"/users/signIn"
}),auth_controller.google);


router.get("/google/callback",passport.authenticate("google",{
    failureRedirect:"/users/signIn"
}),auth_controller.googleCallback)


module.exports=router;