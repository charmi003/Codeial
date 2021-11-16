// var socket = io('http://localhost:5000', { transports: ['websocket', 'polling', 'flashsocket'] });

//minimise the chat box feature
$(".fa-minus-circle").click(function(event){
    if($("#chat-messages-container").css('height')=='356px')
        $("#chat-messages-container").css('height','58px');
    else
        $("#chat-messages-container").css('height','356px');

    $("#chatbox-container").toggleClass("small large");
})


class chatEngine{

    constructor(chatBoxId,userEmail,userName){
        this.chatBox=$(`#${chatBoxId}`);
        this.userEmail=userEmail;
        this.userName=userName;
        this.socket=io('http://localhost:5000', { transports: ['websocket', 'polling', 'flashsocket'] })
        
        if(this.userEmail)
        {
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self=this;

        this.socket.on("connect",function(){
            console.log("Web socket connection established!!");

            //emitting the join_room event
            self.socket.emit("join_room",{
                user_email:self.userEmail,
                user_name:self.userName,
                chat_room:"Codeial"
            })

            //receiving the user_joined event
            self.socket.on("user_joined",function(data){
                console.log(`${data.user_email} has joined the chat room ${data.chat_room}!`);
            })

        })

        //emitting the send_message event when the send button is clicked
        $("#send-message-form").on("submit",function(event){
            event.preventDefault();
            let msg=$(event.target).find("#Message").val();
            if(msg)
            {
                self.socket.emit("send_message",{
                    message:msg,
                    user_email:self.userEmail,
                    user_name:self.userName,
                    chat_room:"Codeial"
                });

                $(event.target).find("#Message").val("");
            }
        })



        //receiving the receive_message event and appending the message to the chat
        self.socket.on("receive_message",function(data){
            // console.log("Message received and appended!");

            $("#typing-status").html('');

            let messageType="other-message";
            if(self.userEmail==data.user_email)
                messageType="self-message";
            
            let newMessage=$(`<li class=${messageType}>
                <small>${data.user_name}</small><br>
                <span>${data.message}</span>
            </li>`);

            $("#chat-messages-list").append(newMessage);
            newMessage[0].scrollIntoView();     //[0] to convert jquery object to javascript object
        })


        //display typing status
        $("input[id='Message']").on("keypress",function(event){
            //emit the typing event
            self.socket.emit("typing",{
                user_email:self.userEmail,
                user_name:self.userName,
                chat_room:"Codeial"
            })
        })

        self.socket.on("typing",function(data){
            $("#typing-status").html(`${data.user_name} is typing...`);
        })
         

    }


}




/* io.connect()   this will fire the on("connection") event which is there in the backend....the backend will send the acknowlegement by emitting the connect event..so connectionHandler ..on("connect")..callback would be fired ....*/