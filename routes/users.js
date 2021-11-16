const express=require("express");
const router=express.Router();
const passport=require("passport");

const User=require("../models/user");

const users_controller=require("../controllers/users_controller");

router.get("/profile/:user_id",passport.checkAuthentication,users_controller.profile);

router.get("/signUp",passport.checkNotAuthenticated,users_controller.signUp);

router.get("/signIn",passport.checkNotAuthenticated,users_controller.signIn);

router.post("/create",users_controller.create);


//use passport as amiddleware to authenticate
router.post("/createSession",passport.authenticate("local",{
    failureRedirect:"/users/signIn"
}),users_controller.createSession)


router.get("/signOut",users_controller.destorySession);


router.post("/update/:user_id",users_controller.update);   //middleware since the form for udate is a multi-part form


module.exports=router;