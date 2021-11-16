const nodemailer=require("../config/nodemailer");

module.exports.newPost=async function(post){
    let htmlString=nodemailer.renderTemplate({post:post},"/posts/new_post.ejs");

    try{
        let info=await nodemailer.transporter.sendMail({
            from:"charmimehta003@gmail.com",
            to:post.User.Email,
            subject:"New post published!",
            // html:"<h1>Yayy!! New post published...</h1>"
            html:htmlString
        })
        console.log(info);

    }catch(err){
        console.log(err);
        return;
    }

}
