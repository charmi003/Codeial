const queue=require("../config/kue");   //created a queue
const posts_mailer=require("../mailers/posts_mailer");  //imported the mailer



queue.process("emails",function(job,done){

    console.log("emails worker is processing a job!");
    console.log(job.data);

    posts_mailer.newPost(job.data.post);

    done();

})