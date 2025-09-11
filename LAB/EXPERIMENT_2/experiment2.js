$(document).ready(function() {
  // 1. Add class to an element
  $("#btn-add").click(function() {
    $("#para").addClass("highlight");
  });

  // 2. Access position of an element
  $("#btn-pos").click(function() {
    // position() gives position relative to offset parent
    const pos = $("#pos-box").position();
    // offset() gives document position
    const off = $("#pos-box").offset();
    $("#pos-output").text(`position: top=${pos.top}, left=${pos.left}  |  offset: top=${off.top.toFixed(1)}, left=${off.left.toFixed(1)}`);
  });

  // 3. Animate multiple CSS properties
  $("#btn-anim").click(function() {
    $("#anim-box").animate({
      paddingLeft: "40px",
      paddingRight: "40px",
      height: "80px"
    }, 700, function() {
      // after animation, change color via CSS class (color cannot be animated via jQuery animate without plugin)
      $(this).addClass("anim-done");
    });
  });
});