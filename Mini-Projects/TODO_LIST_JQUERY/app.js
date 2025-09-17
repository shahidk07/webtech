$(document).ready(function(){
    $("#append").on("click",function()
    //we use before() iinstead of append because new items would appear after the append label
    //and if you use prepend the newitem will go on top
    {
        $("#append").before(
            `
            <div class="checkbox">
                <input type="checkbox" name="">
                <input class="task" type="text" placeholder="Enter item">
                <button class="remove">&times</button>
            </div>
        ` 
        );
    });

    //creating a function to display the checked tasks
    function displaytasks(){
        const checkeditems =JSON.parse(localStorage.getItem('completedtasks')) ||[];
        $("#clist").empty();//clear old lists
        checkeditems.forEach(function(task){
            $("#clist").append(`<li>${task}</li>`);
        });
    }

    //Initialize the function
    displaytasks();

    //using event delegation for  new added items
    $(document).on("click",".remove",function(){
        $(this).parent(".checkbox").remove();
    })

    //checkbox handling
    var checkcount=0;
    $(document).on("change",".checkbox input[type='checkbox']",function(){
        var tasktext=$(this).siblings(".task").val().trim();

        if($(this).is(":checked")){
            checkcount +=1;
            var tasktext=$(this).siblings(".task").val().trim();
            $(this).parent(".checkbox").remove();
        
            //store checked items only when text is non-empty
       const checkeditems = JSON.parse(localStorage.getItem('completedtasks'))||[];
       checkeditems.push(tasktext);
       localStorage.setItem("completedtasks",JSON.stringify(checkeditems));
       console.log(checkcount + " task have been completed");
       $("#display h3").html(checkcount + " task/s completed")
       displaytasks();
         }

    });

    //clear Button removes everything from local storage
    $("#clearall").click(function(){
        localStorage.clear();
        location.reload();
    })
})