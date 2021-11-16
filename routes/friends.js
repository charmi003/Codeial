const express=require("express");
const router=express.Router();
const friends_controller=require("../controllers/friends_controller");

router.get("/add/",friends_controller.addFriend);

router.get("/remove/",friends_controller.removeFriend);

module.exports=router;