let imgInp=$("form#user-profile-update-form #Avatar"),ImgTag=$("#avatar-img");imgInp.on("change",(function(t){if(t.target.files.length>0){var a=URL.createObjectURL(t.target.files[0]);ImgTag.attr("height","200px"),ImgTag.attr("width","200px"),ImgTag.attr("src",a)}$("#default_avatar").hide()})),ImgTag.attr("src")&&(ImgTag.attr("height","200px"),ImgTag.attr("width","200px"));