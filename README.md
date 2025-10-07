
<h2>Experiment I :Basic JQuery Implementation </h2><p><strong>Name:</strong> Shahid Khan
<strong>Roll No.:</strong> 590018782
<strong>Date:</strong> 2025-09-24</p>
<h3>Aim</h3><p>To understand jQuery basics, including event handling, DOM manipulation, and animations.  </p>

<h3>Requirements</h3>
<ul>
  <li>VS Code (or any other code editor like Sublime Text, Atom)</li>
  <li>Web Browser (Google Chrome, Firefox, etc.)</li>
  <li>Basic knowledge of HTML, CSS, and JavaScript</li>
  <li>jQuery library (can be included via CDN)</li>
  <li>Internet connection (for downloading jQuery or using CDN)</li>
</ul>
<h3>Theory</h3><p>[Provide a 2-3 line brief theoretical background of the concept being tested. This shows you understand the 'why' behind the exercise.]</p>

<h3>Procedure & Observations</h3><h4>
Exercise 1:DISABLE RIGHT CLICK </h4><p><strong>Task Statement:</strong> [Paste the exact task given in the lab manual here.]</p><p><strong>Explanation:</strong> [In your own words, explain the approach you took to solve the task. What command did you use and why?]</p>

## <span style="color: #4A90E2;">index.html</span>
 
```html
 <!DOCTYPE html>
 <html lang="en">
 <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="index.css">
 </head>
 <body>
    <!-- ### **Task 1: Disable Right-Click Menu**   -->
    <button>DISABLE RIGHT CLICK
    </button>
    <img id="scrolltopimg" src="https://cdn-icons-png.flaticon.com/512/892/892692.png" alt="Scroll to Top">

    <p id="one">THIS PARAGRAPH WILL CHANGE IT'S COLOR ON MOUSEOVER</p>
    <h2 id="out">Button clicked</h2>
    <button id="sh">SHOW MESSAGE</button>
    <script src="index.js">
    </script>
 </body>
 </html>
 ```

 ## <span style="color: #4A90E2;">index.js</span>
 ```javascript
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
 ```
 ## <span style="color: #4A90E2;">index.css</span>
 ```css

 body{display: flex;justify-content: center;align-items: center;height:100vh;
    background-color: black;height:1000px;color:rgb(183, 0, 255)}
    button{height:150px;width:200px;color:red;font-weight: 900;}

    /* scroll image to get to top */
    img{
        position:fixed;
    bottom:20px;
    right:10px;
    height:100px
  }

  /* Change color on mouseover */
#one{
    position: absolute;top:30px;
}


/* show/hide message on button click */
#out{
    display: none;
    top:80px;position:absolute;
    color: brown;
}
 ```

<p><strong>Output:</strong></p><pre><code class=", language-,code-block">
![Successful Command Output](https://raw.githubusercontent.com/shahidk07/outputs/main/Screenshot%202025-09-27%20161557.png)
</code></pre>
<h3>Conclusion</h3><p>[Write a brief summary of what you accomplished in the lab and how it connects to the course concepts.]</p>

