//variable to count the completedtasks
var checkcount = 0;

//sortvalue is used to receive the value selected in select-option and is passed on Function Call
function sortList(sortvalue) {
    const $listItems = $('#list .checkbox[data-time]');


    //In Array.prototype.sort() we pass two consecutive elements from the array(listItems.get()) because sorting algorithm works by comparing values
    //in this if the result is negative means A came before B then sort() method arranges A before B
    const sortedItems = $listItems.get().sort(function (a, b) {
        const timeA = parseInt($(a).data('time'));
        const timeB = parseInt($(b).data('time'));

        if (sortvalue === "time-oldest") {
            return timeA - timeB;

        }
        else if (sortvalue === "time-newest") {
            return timeB - timeA;
        }
        return 0;
    });

    $.each(sortedItems, function (index, item) {
        $("#append").before(item);
    })
};

//creating a function to display the checked tasks
function displaytasks() {
    const checkeditems = JSON.parse(localStorage.getItem('completedtasks')) || [];
    $("#clist").empty();//clear old lists
    checkeditems.forEach(function (task) {
        $("#clist").append(`<li>${task}</li>`);
    });
}




$(document).ready(function () {
    $("#append").on("click", function ()
    //we use before() iinstead of append because new items would appear after the append label
    //and if you use prepend the newitem will go on top
    {

        const clicktime = new Date().getTime();
        console.log(clicktime)
        $("#append").before(
            `
    <div class="checkbox" data-time="${clicktime}">
        <input type="checkbox" name="">
        <input class="task" type="text" placeholder="Enter item">
        <button class="remove">&times</button>
    </div>
`
        );
    });

    $("#select").on("change", function () {
        sortList($(this).val());
    })



    //Initialize the function
    displaytasks();



    //using event delegation for  new added items
    $(document).on("click", ".remove", function () {
        $(this).parent(".checkbox").remove()
    })


    //checkbox handling
    $(document).on("change", ".checkbox input[type='checkbox']", function () {
        var tasktext = $(this).siblings(".task").val().trim();
        if ($(this).is(":checked")) {
            checkcount += 1;
            $(this).parent(".checkbox").remove();



            //store checked items only when text is non-empty
            const checkeditems = JSON.parse(localStorage.getItem('completedtasks')) || [];
            checkeditems.push(tasktext);
            localStorage.setItem("completedtasks", JSON.stringify(checkeditems));
            console.log(checkcount + " task have been completed");
            $("#display h3").html(checkcount + " task/s completed")
            displaytasks();
        }

    });



    $("#clearall").click(function () {
        localStorage.clear();
        location.reload();
    })



});


