/**
 * Created by Administrator on 2015/8/13.
 */

$(document).ready(function () {
    var $authorizereason_prompt = $("#authorizereason_prompt");
    var $authorize_reason = $("#authorize_reason");
    var $managerList = $("#managerList");
    var $errorManagerList = $("#errorManagerList");

    $authorize_reason.focus(function () {
        $authorizereason_prompt.addClass("hidden");
        $authorize_reason.removeClass("errorC");
    });

    $managerList.focus(function () {
        $managerList.removeClass("errorC");
        $errorManagerList.addClass("hidden");
    });

    //驳回操作，弹出驳回对话框
    $("#disagree_btn").click(function () {
        if ($authorize_reason.val() === "") {
            $authorizereason_prompt.removeClass("hidden");
            $authorize_reason.addClass("errorC");
        } else {
            $authorizereason_prompt.addClass("hidden");
            $authorize_reason.removeClass("errorC");

            $("#modalContext").text("驳回");
            $("#modalBody").text("确认驳回？");
            $("#terminate_confirm").data("action", "disagree");
            $("#terminateConfirm_modal").modal({backdrop: 'static', keyboard: false});
        }
    });

    //终止流程操作，弹出对话框
    $("#terminate_btn").click(function () {
        if ($authorize_reason.val() === "") {
            $authorizereason_prompt.removeClass("hidden");
            $authorize_reason.addClass("errorC");
        } else {
            $authorizereason_prompt.addClass("hidden");
            $authorize_reason.removeClass("errorC");

            $("#modalContext").text("终止流程");
            $("#modalBody").text("确认终止流程？");
            $("#terminate_confirm").data("action", "terminate");
            $("#terminateConfirm_modal").modal({backdrop: 'static', keyboard: false});
        }
    });

    //确认操作
    $("#terminate_confirm").click(function(){
       var flag = $("#terminate_confirm").data("action");

       if(flag == "terminate") {
           $.post("operation",
               {
                   orderId: $("#CurrOrderId").val(),
                   reason: $authorize_reason.val(),
                   comment: "Terminate"
               },
               function (data, status) {
                   if (data.result != "success") {
                       dmallError(data.result);
                       $("#terminateConfirm_modal").modal("hide");
                   } else {
                       window.location.href = "../supply?subType=" + "ALL";
                   }
               },
               "json");
       } else if(flag == "disagree"){$.post("operation",
               {
                   orderId: $("#CurrOrderId").val(),
                   reason: $authorize_reason.val(),
                   comment: "Disagree"
               },
               function (data, status) {
                   if (data.result != "success") {
                       dmallError(data.result);
                   } else {
                       window.location.href = "../supply?subType=" + "ALL";
                   }
               },
               "json");
       }
    });
    $("#agree_btn").click(function () {
        $authorizereason_prompt.addClass("hidden");
        $authorize_reason.removeClass("errorC");

        $("#agree_btn").attr('disabled', true);
        $("#disagree_btn").attr('disabled', true);
        $("#terminate_btn").attr('disabled', true);

        $.post("operation",
            {
                orderId: $("#CurrOrderId").val(),
                reason: $authorize_reason.val(),
                comment: "Agree"
            },
            function (data, status) {
                $("#agree_btn").attr('disabled', false);
                $("#disagree_btn").attr('disabled', false);
                $("#terminate_btn").attr('disabled', false);

                if (data.result != "success") {
                    dmallError(data.result);
                } else {
                    window.location.href = "../supply?subType=" + "ALL";
                }
            },
            "json");
    });

});