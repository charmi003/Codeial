//AJAX by default sends a XMLHttpRequest (xhr)




//using local storage because ..if we reach the home page via back button, the things added by AJAX don't show up as they are not remembered in the history..so storing it in the local storage

/*If the user reaches the page via back button, the content added previouly to the DOM by AJAX shoulb be there..so refresh the page so that all the content is there*/
var perfEntries = performance.getEntriesByType("navigation");
for (var i = 0; i < perfEntries.length; i++) {
    if(perfEntries[i].type === "back_forward"){ // if user has reach the page via the back button...
        $("body").html(localStorage.content);
    }
}




/*Creating a pot using AJAX*/
let createPost=function(){
    let newPostForm=$("#new-post-form");
    
    newPostForm.submit(function(event){
        event.preventDefault();
        $.ajax({
            method:"post",
            url:"/posts/create",
            data:newPostForm.serialize(),  //convert the form data to json
            success:function(data)
            {
                let newPost=addPostToDom(data.post);
                $("#posts-container").prepend(newPost);
        
                deletePost($(" a[href^='/posts/destroy']",newPost));
                toggleLike($(' .like',newPost));
                createComment();
                

                localStorage.content=$("body").html();
                displayFlashMessage(data.flash.success);

            },
            error:function(err)
            {
                console.log(err.responseText);
            }
        })
        $(this).trigger("reset");
    })


}

createPost();


let addPostToDom=function(post)
{
    return $(`<div class="post-box" id=${post._id}>

    <p>${post.Content}</p>
    <small>${post.User.Name}</small><br><br>

    <div class="like-info">
        <a href="/likes/toggle/?p_id=${post._id}&p_type=Post">
            <i class="far fa-heart like"></i>
        </a>
        <span><span class="like-count">${post.Likes.length}</span> Likes</span>
    </div>
    
    <br><br>
    <div class="post-comment-form">
        <form action="/comments/create" method="post" id="comment-form">
            <textarea name="Content" id="Content" rows=2 cols=25 maxlength=250 required placeholder="Add a comment..."></textarea>
            <input type="hidden" name="post_id" value=${post._id} >
            <button type="submit"> Comment </button>
        </form>
    </div>
    <ul>
    </ul>
   

        <button class="delete-post" id=${post._id}><a href="/posts/destroy/${post._id}">Delete post</a></button>
</div>
`)

}





/*Deleting a post using AJAX*/
let deletePost=function(deleteTag){

    $(deleteTag).click(function(event){
        event.preventDefault();

        let link=$(deleteTag).attr("href");

        $.ajax({
            method:"GET",
            url:link,
            success:function(data){
                let postToBeDeleted=$(`.post-box#${data.post_id}`);
                postToBeDeleted.remove();

                localStorage.content=$("body").html();
                displayFlashMessage(data.flash.success);

            },
            error:function(err){
                console.log(err.responseText);
            }
        })

    })
 
}

$(".delete-post a").toArray().forEach(function(tag){
    deletePost(tag);
})






/*Creating a comment dynamically using AJAX */

 let createComment=function(){
    
    let commentForm=$("#comment-form");
    commentForm.submit(function(event){
        event.preventDefault();

        $.ajax({
            method:"POST",
            url:"/comments/create",
            data:commentForm.serialize(),
            success:function(data){
                let commentToBeAdded=addCommentToDom(data.comment);
                $(event.target).closest(".post-box").children("ul").prepend(commentToBeAdded);

                deleteComment($(' a[href^="/comments/destroy"]',commentToBeAdded));
                toggleLike($(' .like',commentToBeAdded))

                localStorage.content=$("body").html();
                displayFlashMessage(data.flash.success);
                
            },
            error:function(err){
                console.log(err.responseText);
            }
        })

        $(this).trigger("reset");
    })
 }


 createComment();

 let addCommentToDom=function(comment){
     
    return $(`<li class="comment-box" id=${comment._id}>
     <p>${comment.User.Name} --> &nbsp; ${comment.Content}</p>&nbsp;&nbsp;<br>

     <div class="like-info">
        <a href="/likes/toggle/?p_id=${comment._id}&p_type=Comment"></a>
            <i class="far fa-heart like"></i>
        </a>
        <span><span class="like-count">${comment.Likes.length}</span> Likes</span>
    </div>
    <br>

     <button class="delete-comment" id=${comment._id} >
        <a href="/comments/destroy/${comment._id}">Delete this comment</a>
    </button>
   </li>`)
 }

 
 


 /*Deleting a comment using AJAX*/
 let deleteComment=function(deleteTag){

    $(deleteTag).click(function(event){    //dont use (event)=>{}  since arrow fns don't have this
        event.preventDefault();
        let link=$(deleteTag).attr("href");
        
        $.ajax({
            method:"GET",
            url:link,
            success:function(data){
                let commentToBeDeleted=$(`.comment-box#${data.comment_id}`);
                commentToBeDeleted.remove();

                localStorage.content=$("body").html();
                displayFlashMessage(data.flash.success);
   
            },
            error:function(err){
                console.log(err.responseText);
            }
        })
   
    })
 }

 $(".delete-comment a").toArray().forEach(function(tag){
    deleteComment(tag);
})



 //flash messages
 

 let displayFlashMessage=function(success_msg)
 {  
    if(success_msg)
    {
        new Noty({
        text: success_msg,
        type:"success",
        theme:"relax",
        timeout:400,
        animation:{
            open:"animate__animated animate__headShake",
            close:"animate__animated animate__headShake"
        }
        }).show();
    }

 }
        



        // if(success_msg)
        // {
        //     swal({
        //         title:"",
        //         text: success_msg,
        //         icon: "success",
        //         // timer: 1500,
        //         // buttons:false
        //     });
        // }
        // else if(error_msg)
        // {
        //     swal({
        //         title:"",
        //         text: error_msg,
        //         icon: "error",
        //         // timer: 2000,
        //         // buttons:false
        //     });

        // }






//toggle like using ajax call

let toggleLike=function(likeEle)
{
    $(likeEle).click(function(event){
        event.preventDefault();
        let link=$(event.target).closest(".like-info").children("a").attr("href");

        if(!link)
            return;
    
        $.ajax({
            method:"get",
            url:link,
            success:function(data){
              $(event.target).toggleClass("far fas");

              let curr=$(event.target).closest(".like-info").find("span.like-count").html();
              if(data.isDeleted)
              {
                  curr--;

              }else{
                  curr++;
              }

              $(event.target).closest(".like-info").find("span.like-count").html(curr);

            },
            error:function(err){
                console.log(err.responseText);
            }
        })
    })

}
let arr=$(".like");
for(let i=0;i<arr.length;i++)
{
    toggleLike(arr[i]);
}

    