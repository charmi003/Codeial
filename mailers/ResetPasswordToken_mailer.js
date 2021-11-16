const nodemailer=require("../config/nodemailer");

module.exports.resetToken=async function(token){

    let htmlString=nodemailer.renderTemplate({token:token},"/resetpasswordLink.ejs");
    try{
        let info=await nodemailer.transporter.sendMail({
            from:"charmimehta003@gmail.com",
            to:token.User.Email,
            subject:"Reset Password Link",
            html:htmlString
        })
        console.log(info);

    }catch(err){
        console.log(err);
        return;
    }
    
}