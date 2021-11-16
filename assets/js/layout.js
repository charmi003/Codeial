var perfEntries = performance.getEntriesByType("navigation");
for (var i = 0; i < perfEntries.length; i++) {
    if(perfEntries[i].type === "back_forward"){ // if user has reach the page via the back button...
        //...delete the contents of the flash container
        $("#flash-success-message").attr("val","")
        $("#flash-error-message").attr("val",""); 
    }
}
let success_msg=$("#flash-success-message").attr("val");
let error_msg=$("#flash-error-message").attr("val");

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
else if(error_msg)
{
    new Noty({
    text: error_msg,
    type:"error",
    theme:"relax",
    timeout:400,
    animation:{
        open:"animate__animated animate__headShake",
        close:"animate__animated animate__headShake"
    }

    }).show();
}


/*show and hide passwords*/

$(".fa-eye").click(function(event){
    $(event.target).closest(".p").children("input").attr("type","password");
    $(event.target).closest(".p").children(".fa-eye-slash").show();
    $(event.target).closest(".p").children(".fa-eye").hide();
})

$(".fa-eye-slash").click(function(event){
    $(event.target).closest(".p").children("input").attr("type","text");
    $(event.target).closest(".p").children(".fa-eye").show();
    $(event.target).closest(".p").children(".fa-eye-slash").hide();
})
