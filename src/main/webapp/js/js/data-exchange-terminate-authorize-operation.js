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

    $("#agree_btn").click(function () {
        $("#agree_btn").attr("disabled",true);
        $("#disAgree_btn").attr("disabled",true);
        $authorizereason_prompt.addClass("hidden");
        $authorize_reason.removeClass("errorC");

        $.post("operation",
            {
                exchangeId: $("#currOrderId").val(),
                reason: $authorize_reason.val(),
                comment: "Agree"
            },
            function (data, status) {
                if (data.result != "success") {
                    $("#agree_btn").attr("disabled",false);
                    $("#disAgree_btn").attr("disabled",false);
                    dmallError(data.result);
                } else {
                    window.location.href = "../authorize?subType=" + "ALL";
                }
            },
            "json");

    });

    $("#disAgree_btn").click(function () {
        $authorizereason_prompt.addClass("hidden");
        $authorize_reason.removeClass("errorC");

        if ($authorize_reason.val() === "") {
            $authorizereason_prompt.removeClass("hidden");
            $authorize_reason.addClass("errorC");
        } else {
            $authorizereason_prompt.addClass("hidden");
            $authorize_reason.removeClass("errorC");
            $('#agreeModal').modal({backdrop: 'static', keyboard: false});
        }
    });

    $("#sureAgreeModalBtn").click(function(){
        $("#agree_btn").attr("disabled",true);
        $("#sureAgreeModalBtn").attr("disabled",true);
        $("#disAgree_btn").attr("disabled",true);
        $.post("operation",
            {
                exchangeId: $("#currOrderId").val(),
                reason: $authorize_reason.val(),
                comment: "Disagree"
            },
            function (data, status) {
                if (data.result != "success") {
                    $("#agree_btn").attr("disabled",false);
                    $("#disAgree_btn").attr("disabled",false);
                    $("#sureAgreeModalBtn").attr("disabled",false);
                    dmallError(data.result);
                } else {
                    window.location.href = "../authorize?subType=" + "ALL";
                }
            },
            "json");
    });
})