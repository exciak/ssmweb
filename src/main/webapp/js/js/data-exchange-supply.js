/**
 * Created by Administrator on 2015/7/2.
 */

var curId;

$(document).ready(function () {
    var $terminate_reason = $("#terminate_reason");
    var $terminatereason_prompt = $("#terminatereason_prompt");

    $terminate_reason.focus(function () {
        $terminatereason_prompt.addClass("hidden");
        $terminate_reason.removeClass("errorC");
    });

    $("#chooseResource").click(function () {
        $("#addResourceTitle").text("请选择资源形态分类");
        openResource();
    });

    $("#terminateSupplyBtn").click(function(){
        if ($terminate_reason.val() === ""){
            $terminatereason_prompt.removeClass("hidden");
            $terminate_reason.addClass("errorC");
        } else {
            $terminatereason_prompt.addClass("hidden");
            $terminate_reason.removeClass("errorC");

            $.post("supply/terminate",
                {
                    exchangeId : curId,
                    reason: $terminate_reason.val()
                },
                function(data, status){
                    if (data.result != "success"){
                        dmallError(data.result);
                    } else{
                        window.location.href = location.href;
                    }
                },
                "json");
        }
    });
});

function terminateSupply(obj, id){
    curId = id;
    $("#terminatereason_prompt").addClass("hidden");
    $("#terminate_reason").removeClass("errorC");
    $('#terminateSupplyModal').modal({backdrop: 'static', keyboard: false});
}