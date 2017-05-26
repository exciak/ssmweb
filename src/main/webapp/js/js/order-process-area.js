/**
 * Created by Administrator on 2015/8/13.
 */

$(document).ready(function () {
    var $postUrl = $("#postUrl");
    var $backRoute = $("#backRoute2");
    var $commentWarning = $("#commentWarning");
    var $comment = $("#comment");

    $comment.focus(function () {
        $commentWarning.addClass("hidden");
        $comment.removeClass("errorC");
    });

    // 审核不同意
    $("#disagree_btn").click(function () {
        if ($comment.val() === "") {
            $commentWarning.removeClass("hidden");
            $comment.addClass("errorC");
        } else {
            $commentWarning.addClass("hidden");
            $comment.removeClass("errorC");
            $("#disagree_modal").modal({backdrop: 'static', keyboard: false});
        }
    });

    // 驳回流程
    $("#disagree_confirm").click(function () {
        $("#disagree_confirm").attr("disabled",true);
        $.post($postUrl.val(),
            {
                id: $("#objectId").val(),
                comment: $comment.val(),
                result: "Disagree"
            },
            function (data, status) {
                if (data.result != "success") {
                    $("#disagree_confirm").attr("disabled",false);
                    dmallError(data.result);
                } else {
                    window.location.href = $backRoute.val();
                }
            },
            "json");
    });


    // 审核同意
    $("#agree_btn").click(function () {
        $commentWarning.addClass("hidden");
        $comment.removeClass("errorC");
        var nextUserId = $("#reviewerList option:selected").val();
        var subMenu = $("#subMenu").val();
        var needNextOperator = $("#needNextOperator").val();
        if(needNextOperator == "true" && checkReviewerValue()){
            return false;
        }
        $("#agree_btn").attr("disabled",true);

        var catalogType = null;
        if($('input[name="catalogType"]').length > 0) {
            catalogType = $('input[name="catalogType"]').filter(":checked").val();
        }

        $.post($postUrl.val(),
            {
                id: $("#objectId").val(),
                comment: $comment.val(),
                result: "Agree",
                nextUserId: nextUserId,
                cancelMode: $("input[name='cancelMode']").filter(":checked").val(),
                catalogType: catalogType
            },
            function (data, status) {
                if (data.result != "success") {
                    $("#agree_btn").attr("disabled",false);
                    dmallError(data.result);
                } else {
                    window.location.href = $backRoute.val();
                }
            },
            "json");
    });

    $("#terminate_btn").click(function () {
        if ($comment.val() === "") {
            $commentWarning.removeClass("hidden");
            $comment.addClass("errorC");
        } else {
            $commentWarning.addClass("hidden");
            $comment.removeClass("errorC");
            $("#terminateConfirm_modal").modal({backdrop: 'static', keyboard: false});
        }
    });

    // 终止流程
    $("#terminate_confirm").click(function () {
        $("#terminate_confirm").attr("disabled",true);
        $.post($postUrl.val(),
            {
                id: $("#objectId").val(),
                comment: $comment.val(),
                result: "Terminate",
                cancelMode: $("input[name='cancelMode']").filter(":checked").val()
            },
            function (data, status) {
                if (data.result != "success") {
                    $("#terminate_confirm").attr("disabled",false);
                    dmallError(data.result);
                } else {
                    window.location.href = $backRoute.val();
                }
            },
            "json");
    });
    // 取消注册
    $("#cancel_btn").click(function () {
        if ($comment.val() === "") {
            $commentWarning.removeClass("hidden");
            $comment.addClass("errorC");
        } else {
            $commentWarning.addClass("hidden");
            $comment.removeClass("errorC");
            $("#cancel_modal").modal({backdrop: 'static', keyboard: false});
        }
    });
    // 取消注册流程
    $("#cancel_confirm").click(function () {
        $("#cancel_confirm").attr("disabled",true);
        $.post($postUrl.val(),
            {
                id: $("#objectId").val(),
                comment: $comment.val(),
                result: "Terminate"
            },
            function (data, status) {
                if (data.result != "success") {
                    $("#cancel_confirm").attr("disabled",false);
                    dmallError(data.result);
                } else {
                    window.location.href = $backRoute.val();
                }
            },
            "json");
    });
    $("#reviewerList").focus(function () {
        if ($("#reviewerList").children('option:selected').val() == "") {
            $("#reviewerList").removeClass("errorC");
            $(".errorReviewerList").hide();
        }
    });
    $("#reviewerList").blur(function () {
        checkReviewerValue();
    });

    function checkReviewerValue() {
        if ($("#reviewerList").children('option:selected').val() == "") {
            $("#reviewerList").addClass("errorC");
            $(".errorReviewerList").show();
            return true;
        }
    }
});