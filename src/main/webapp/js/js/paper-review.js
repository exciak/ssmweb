
$(document).ready(function(){
    $("#btn_clear").click(function(){
        $("#inputFilterName").attr("value", "");
        $("#startTime").attr("value", "");
        $("#endTime").attr("value", "");
    });

    var submenuValue = $("#subType").val();
    $("#openAll").attr("href", "paper");

    $("#openSubmit").attr("href", "paper?subType=APPLYING");

    if (submenuValue == "APPLYING") {
        $("#openAll").removeClass("a-selected");
        $("#openSubmit").addClass("a-selected");
    } else {
        $("#openAll").addClass("a-selected");
        $("#openSubmit").removeClass("a-selected");
    }
});