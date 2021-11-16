module.exports.google=function(req,res){

    return res.redirect("/");
}
module.exports.googleCallback=function(req,res){
    req.flash("success","Logged in successfully");
    return res.redirect("/");
}