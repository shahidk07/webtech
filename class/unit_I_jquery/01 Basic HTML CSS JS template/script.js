// console.clear();
// console.info("Hello World! from script.js");
// var bn = document.getElementById("btn");
// bn.addEventListener("click",function(){alert("button clicked")
    // var ptag =document.querySelectorAll("p");
    // ptag[0].style.color="magenta";
// })
// $('#btn').on("click",function()
// {
//     alert(button.innerhtml");
//     $("p").eq(0).css("color","red");
//     $("btn").
// })

$('button').on("click",buttononevent)
function buttononevent(){
    var buttoncontent =this.innerHTML;
    alert(`${buttoncontent} is clicked `);
}