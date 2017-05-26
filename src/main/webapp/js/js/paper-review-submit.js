/**
 * Created by ss on 2016/7/26.
 */
$(document).ready(function () {
    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    var proName = arr[1];
    var $apply_reason = $("#apply_reason");
    // 审核同意
    $("#agree_btn").click(function () {
        //显示modal
        $('#agreeModal').modal({backdrop: 'static', keyboard: false});
    });

    $("#btn_commit").click(function(){
        $.post("/" +proName + "/mydata/paper/apply",
            {
                id: $("#reviewId").val(),
                reason: $apply_reason.val()
            },
            function (data, status) {
                if (data.result != "success") {
                    dmallError(data.result);
                } else {
                    window.location.href = "/" +proName +"/mydata/paper";
                }
            },
            "json");
    });
})