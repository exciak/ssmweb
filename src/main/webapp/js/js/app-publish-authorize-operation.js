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

    // 审核不同意操作
    $("#disagree_btn").click(function () {
        if ($authorize_reason.val() === "") {
            $authorizereason_prompt.removeClass("hidden");
            $authorize_reason.addClass("errorC");
        } else {
            $authorizereason_prompt.addClass("hidden");
            $authorize_reason.removeClass("errorC");

            $("#modelContext").text("不同意");
            $("#modelBody").text("确认审核不同意？");
            $("#disagreeTerminate_confirm").data("action", "disagree");
            $("#disagreeTerminateConfirm_modal").modal({backdrop: 'static', keyboard: false});
        }
    });

    //终止流程操作
    $("#terminate_btn").click(function () {
        if ($authorize_reason.val() === "") {
            $authorizereason_prompt.removeClass("hidden");
            $authorize_reason.addClass("errorC");
        } else {
            $authorizereason_prompt.addClass("hidden");
            $authorize_reason.removeClass("errorC");

            $("#modelContext").text("终止流程");
            $("#modelBody").text("确认终止流程？");
            $("#disagreeTerminate_confirm").data("action", "terminate");
            $("#disagreeTerminateConfirm_modal").modal({backdrop: 'static', keyboard: false});
        }
    });

    //确认操作
    $("#disagreeTerminate_confirm").click(function(){
        var flag = $("#disagreeTerminate_confirm").data("action");

        if(flag == "disagree"){
            $.post("operation",
                {
                    id: $("#currOrderId").val(),
                    reason: $authorize_reason.val(),
                    comment: "Disagree"
                },
                function (data, status) {
                    if (data.result != "success") {
                        dmallError(data.result);
                        $("#agree_btn").attr('disabled', false);
                        $("#disagree_btn").attr('disabled', false);
                        $("#terminate_btn").attr('disabled', false);
                    } else {
                        window.location.href = "../publish";
                    }
                },
                "json");
        } else if(flag == "terminate"){
            $("#agree_btn").attr('disabled', true);
            $("#disagree_btn").attr('disabled', true);
            $("#terminate_btn").attr('disabled', true);
            $.post("operation",
                {
                    id: $("#currOrderId").val(),
                    reason: $authorize_reason.val(),
                    comment: "Terminate"
                },
                function (data, status) {
                    if (data.result != "success") {
                        dmallError(data.result);
                        $("#agree_btn").attr('disabled', false);
                        $("#disagree_btn").attr('disabled', false);
                        $("#terminate_btn").attr('disabled', false);
                    } else {
                        window.location.href = "../publish";
                    }
                },
                "json");
        }
    });

    // 审核同意
    $("#agree_btn").click(function () {
        $authorizereason_prompt.addClass("hidden");
        $authorize_reason.removeClass("errorC");
        $("#agree_btn").attr('disabled', true);
        $("#disagree_btn").attr('disabled', true);
        $("#terminate_btn").attr('disabled', true);

        $.post("operation",
            {
                id: $("#currOrderId").val(),
                reason: $authorize_reason.val(),
                comment: "Agree"
            },
            function (data, status) {
                if (data.result != "success") {
                    dmallError(data.result);
                    $("#agree_btn").attr('disabled', false);
                    $("#disagree_btn").attr('disabled', false);
                    $("#terminate_btn").attr('disabled', false);
                } else {
                    window.location.href = "../publish";
                }
            },
            "json");
    });

})