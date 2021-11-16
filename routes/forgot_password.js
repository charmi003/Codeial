const express=require("express");
const router=express.Router();
const forgot_password_controller=require("../controllers/forgot_password_controller")


router.get("/emailForm",forgot_password_controller.EmailForm);

router.post("/resetLink",forgot_password_controller.ResetLink);

router.get("/resetLink/passwordForm/",forgot_password_controller.PasswordForm);

router.post("/resetLink/update",forgot_password_controller.update);

module.exports=router;