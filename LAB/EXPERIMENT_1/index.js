//DISABLE RIGHT CLICK 
$(function(){
    $("button").on('click',function(){
        $("body").on('contextmenu',function(z)
    {
        z.preventDefault()
    })

    })
});
//CLICK IMAGE TO SCROLL TO TOP
$(function(){
    $("#scrolltopimg").on('click',function(){
    $("body ,html").animate({scrollTop:0},500);
 })});
 

 //CHANGE PARAGRAPH COLOR ON MOUSEOVER
 $("p").hover(function(){
    $("#one").css({"color":"red","cursor":"pointer"});
},
function(){
$(this).css("color","")
})
//show/hide message on button click
$("#sh").on('click',function()
{

    if($("#out").is(':hidden'))
    {   $("#out").show();
        $("#sh").text("HIDE MESSAGE")
    }
    else{
        $("#out").hide();
        $("#sh").text("SHOW MESSAGE")
    }
})