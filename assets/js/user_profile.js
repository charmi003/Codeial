//avatar on profile page

let imgInp=$("form#user-profile-update-form #Avatar");
let ImgTag=$("#avatar-img");

//preview on choosing a file
imgInp.on("change",function(event){
    if(event.target.files.length>0)
    {
        var preview_src=URL.createObjectURL(event.target.files[0]);
        ImgTag.attr("height","200px");
        ImgTag.attr("width","200px");
        ImgTag.attr("src",preview_src);
    }  
    $("#default_avatar").hide();
})


//if user already has an avatar..src is already set..just set the height and width
if(ImgTag.attr("src")){

    ImgTag.attr("height","200px");
    ImgTag.attr("width","200px");

}

