/**
 * Created by Administrator on 2015/8/13.
 */

$(document).ready(function () {
    var $authorizereason_prompt = $("#authorizereason_prompt");
    var $authorize_reason = $("#authorize_reason");

    $authorize_reason.focus(function () {
        $authorizereason_prompt.addClass("hidden");
        $authorize_reason.removeClass("errorC");
    });

    //审核不同意，弹出确认对话框
    $("#notagree_btn").click(function () {

        //不同意权签意见不能为空
        if ($authorize_reason.val() === "") {
            $authorizereason_prompt.removeClass("hidden");
            $authorize_reason.addClass("errorC");
        } else {
            $authorizereason_prompt.addClass("hidden");
            $authorize_reason.removeClass("errorC");
	    
	    $('#disagreeModal').modal({backdrop: 'static', keyboard: false});
        }
    });

    // 审核同意
    $("#agree_btn").click(function () {
        $authorizereason_prompt.addClass("hidden");
        $authorize_reason.removeClass("errorC");

        $.post("operation",
            {
                orderId: $("#currOrderId").val(),
                reason: $authorize_reason.val(),
                comment: "Agree"
            },
            function (data, status) {
                if (data.result != "success") {
                    dmallError(data.result);
                } else {
                    window.location.href = "../obtain?subType=" + "ALL";
                }
            },
            "json");
    });

    $("#terminate_btn").click(function () {
        if ($authorize_reason.val() === "") {
            $authorizereason_prompt.removeClass("hidden");
            $authorize_reason.addClass("errorC");
        } else {
            $authorizereason_prompt.addClass("hidden");
            $authorize_reason.removeClass("errorC");
            $("#terminateConfirm_modal").modal({backdrop: 'static', keyboard: false});
        }
    });

    // 终止交换
    $("#terminate_confirm").click(function () {
        $.post("operation",
            {
                orderId: $("#currOrderId").val(),
                reason: $authorize_reason.val(),
                comment: "Terminate"
            },
            function (data, status) {
                if (data.result != "success") {
                    dmallError(data.result);
                } else {
                    window.location.href = "../obtain?subType=" + "ALL";
                }
            },
            "json");
    });

    //确认终止
    $("#sureDisagreeModalBtn").click(function(){
        $.post("operation",
            {
                orderId: $("#currOrderId").val(),
                reason: $authorize_reason.val(),
                comment: "Terminate"
            },
            function (data, status) {
                if (data.result != "success") {
                    dmallError(data.result);
                } else {
                    window.location.href = "../obtain?subType=" + "ALL";
                }
            },
            "json");
    });

})