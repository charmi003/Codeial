//this is setting up socket.io on server...we also need to do it on front end in order to have the web socket connection so that it's running b/w the client and the server and we can pass the data b/w the two
module.exports.chatSockets=function(chatServer){
    
    const socket=require("socket.io");
    const io=socket(chatServer);

    io.on('connection', (socket) => {
        console.log('a user connected',socket.id);

        socket.on('disconnect', () => {
          console.log('user disconnected');
        });
         
        //receiving the join_room event ..and after joining the chat room , emit the user_joined event
        socket.on("join_room",function(data){
            // console.log("Join_room event received",data);
            socket.join(data.chat_room);
            io.in(data.chat_room).emit("user_joined",data);
        })

        //receiving the send_message event and emitting the received_message event
        socket.on("send_message",function(data){
            // console.log("Message:",data.message);
            io.in(data.chat_room).emit("receive_message",data);
        })

        //receiving the typing event
        socket.on("typing",function(data){
            socket.broadcast.emit("typing",data);
            //broadcasting will emit this for all users except this current typing user
        })

    });

}