const express=require("express");
const router=express.Router();
const post_api_controller=require("../../../controllers/api/v1/post_api");

router.get("/posts",post_api_controller.index);

module.exports=router;