const express=require("express");
const router=express.Router();
const likes_controller=require("../controllers/likes_controller");


router.get("/toggle/",likes_controller.toggleLike);



module.exports=router;