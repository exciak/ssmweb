/**
 * Created by ss on 2016/7/26.
 */
$(document).ready(function () {
    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    var proName = arr[1];
    var $authorizereason_prompt = $("#authorizereason_prompt");
    var $authorize_reason = $("#authorize_reason");

    $authorize_reason.focus(function () {
        $authorizereason_prompt.addClass("hidden");
        $authorize_reason.removeClass("errorC");
    });

    // 审核不同意
    $("#disagree_btn").click(function () {
        if ($authorize_reason.val() === "") {
            $authorizereason_prompt.removeClass("hidden");
            $authorize_reason.addClass("errorC");
        } else {
            $authorizereason_prompt.addClass("hidden");
            $authorize_reason.removeClass("errorC");
            $("#agree_btn").attr('disabled', true);
            $("#disagree_btn").attr('disabled', true);
            $("#terminate_btn").attr('disabled', true);

            $.post("/" +proName + "/exchange/authorize/paper",
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
                        window.location.href = "/" +proName + "/exchange/authorize/paper";
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

        $.post("/" +proName + "/exchange/authorize/paper",
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
                    window.location.href = "/" +proName + "/exchange/authorize/paper";
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
        $.post("/" +proName + "/exchange/authorize/paper",
            {
                id: $("#currOrderId").val(),
                reason: $authorize_reason.val(),
                comment: "Terminate"
            },
            function (data, status) {
                if (data.result != "success") {
                    dmallError(data.result);
                } else {
                    window.location.href = "/" +proName + "/exchange/authorize/paper";
                }
            },
            "json");
    });
})