const logger=require("morgan");
const rfs=require("rotating-file-stream");
const fs=require("fs");
const path=require("path");

const logDirectory=path.join(__dirname,"../production_logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);   //creating the log directory if it doesn't exist

const accessLogStream=rfs.createStream("access.log",{
    interval:"1d",
    path:logDirectory
})



const development={
    name:"development",
    port:2000,
    assets_path:"./assets",
    chat_server_port:5000,
    session_cookie_secret_key:"HzgczLQFB4Sv8NXnziJE0vOCOTk0Lc9Z",
    mongoDB_url:'mongodb+srv://charmi:charmi003@beach-resort.wnheq.mongodb.net/Codeial?retryWrites=true&w=majority',
    smtp:{   
        service:"gmail",
        host:"smtp.gmail.com",
        port:587,  //TLS
        secure:false,
        auth: {
            user: "RealTimePizzaa@gmail.com", // generated ethereal user
            pass: "realtimepizza123" // generated ethereal password
        }
    },
    google_clientID:"53841800284-skmjhnnm5hbn049e64rc77qleoh952nr.apps.googleusercontent.com",
    google_clientSecret:"yHQ7lwFuXCCFGvTW-wmW7Mea",
    google_callbackURL:"http://localhost:2000/auth/google/callback",
    morgan:{
        mode:"dev",
        options:{ stream:accessLogStream }
    }

}



const production={
    name:"production",
    port:process.env.codeial_port,
    assets_path:process.env.codeial_assets_path,
    chat_server_port:process.env.codeial_chat_server_port,
    session_cookie_secret_key:process.env.codeial_session_cookie_secret_key,
    mongoDB_url:process.env.codeial_mongoDB_url,
    smtp:{   
        service:"gmail",
        host:"smtp.gmail.com",
        port:587,  //TLS
        secure:false,
        auth: {
            user: process.env.codeial_smtp_auth_user, // generated ethereal user
            pass: process.env.codeial_smtp_auth_pass // generated ethereal password
        }
    },
    google_clientID:process.env.codeial_google_clientID,
    google_clientSecret:process.env.codeial_google_clientSecret,
    google_callbackURL:process.env.codeial_google_callbackURL,
    morgan:{
        mode:"combined",
        options:{ stream:accessLogStream }
    }

}

module.exports= (process.env.codeial_environment==undefined)? development : production;

  
