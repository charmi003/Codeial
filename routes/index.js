const express=require("express");
const router=express.Router();
const home_controller=require("../controllers/home_controller");


console.log("Router loaded!!");

router.get("/",home_controller.home);

router.use("/users",require("./users.js"));

router.use("/posts",require("./posts"));

router.use("/comments",require("./comments"));

router.use("/auth",require("./auth"));

router.use("/forgotPassword",require("./forgot_password"));

router.use("/api",require("./api/index.js"));

router.use("/likes",require("./likes"));

router.use("/friends",require("./friends"));


module.exports=router;