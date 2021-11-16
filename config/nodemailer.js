const nodemailer=require("nodemailer");
const ejs=require("ejs");
const path=require("path");
const env=require("./environment");



//transporter defines how the mails will be sent (the way communication will happen)
let transporter=nodemailer.createTransport(env.smtp);


//renderTemplate is when i want tos end an HTML email and the template is present in views/mailers
let renderTemplate=(data,relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,"../views/mailers",relativePath),
        data,
        function(err,template){
            if(err){console.log("error",err); return}
            mailHTML=template
        }

    )

    return mailHTML;
}


module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate
};





