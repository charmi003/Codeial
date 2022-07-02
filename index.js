const express=require("express");
const env=require("./config/environment");
console.log(env.name);
// const port=env.port;
const path=require("path");
const customMiddleWares=require("./config/middleware");


//Firing the express app
const app=express(); 
require("./config/view_helpers")(app);

//Connecting to the database
const db=require("./config/mongoose");

//For authentication using passport js
//For using session cookie, we need express-session
const session=require("express-session");
const passport=require("passport");
const passportLocal=require("./config/passport-local-strategy");
const passportGoogle=require("./config/passport-google-strategy");
const MongoDbStore = require('connect-mongo');

//flash messages
const flash=require("connect-flash");


//for chatting engine..set up the chat server to be used with socket.io
//app won't be accepted as it's an express server ..therefore creating an http server to be used with socket.io
const chatServer=require("http").Server(app);
const chatSockets=require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(env.chat_server_port);
console.log(`Chat server is listening on port ${env.chat_server_port}!!`);


//Middleware to encode the form data
app.use(express.urlencoded());


//Cookies
const cookieParser=require("cookie-parser");
app.use(cookieParser());

//Middleware to access the static files
app.use(express.static(env.assets_path));


// Make the uploads path available to the browser
app.use("/uploads",express.static("./uploads"));


/*Using layout*/
const expressLayouts=require("express-ejs-layouts");
app.use(expressLayouts);

//Extract styles and scripts from the sub-pages into the layout
app.set("layout extractStyles",true);
app.set("layout extractScripts",true);



//set up the view engine
app.set("view engine","ejs");
app.set("views","./views");



//Middleware that takes the session cookie and encrypts it
app.use(session({
    name:"codeial",
    //TODO  Change the secret before deployment in production mode
    secret:env.session_cookie_secret_key,    //secret key is used for encryption
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store: MongoDbStore.create({           //using mongoDbStore to store the session cookie in the DB
        mongoUrl: env.mongoDB_url
    })

}));


//ask the app to use passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);  //Middleware to transfer the user's info to the locals for views


//flash messages  (after the session since it uses session cookie)
//flash messages are stored in the session cookie
app.use(flash());
app.use(customMiddleWares.setFlash);


//production logs
const logger=require("morgan");
app.use(logger(env.morgan.mode,env.morgan.options));

app.use("/",require("./routes/index"));   //using the express router



app.listen(process.env.PORT || 2000,function(err){
    if(err)
    {
        console.log(`Error: ${err}`)   //This is known as interpolation , use backticks and to include a variable use ${varname}
        return;
    }
    console.log(`Codeial is running absolutely fine on port: ${port}`);
})








/* Paths
    main folder
        ->folder1
            ->folder2
        ->folder3
    
    currently we are inside some file in folder1


    file.jpg    //file is in the same folder
    ./file.jpg  //file is in the same folder
    /folder2/file.jpg   //there is a folder names folder2 inside this current folder and the file is inside it
    ../folder3/file.jpg   // ../ takes you to dir one level above the current dir..so you will go to main folder and inside there is folder3 and inside it there is file


*/





