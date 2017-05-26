/**
 * Created by ss on 2016/7/26.
 */
$(document).ready(function () {
    var submenuValue;
    submenuValue = $("#subType").val();

    $("#openAllAuthorize").attr("href", "paper?subType=" + "ALL");
    $("#openAllAuthorize").click (function () {
        submenuValue = "ALL";
    });

    $("#openAuthorizing").attr("href", "paper?subType=" + "AUTHORIZING");
    $("#openAuthorizing").click (function () {
        submenuValue = "AUTHORIZING";
    });

    if (submenuValue === "ALL") {
        $("#openAllAuthorize").addClass("a-selected");
        $("#openAuthorizing").removeClass("a-selected");
    } else if (submenuValue === "AUTHORIZING"){
        $("#openAllAuthorize").removeClass("a-selected");
        $("#openAuthorizing").addClass("a-selected");
    }

    //选择资源形态分类
    $("#chooseResource").click(function () {
        /* 设置弹窗标题 */
        $("#addResourceTitle").text("请选择资源形态分类");
        /* 打开模态框 */
        openResource();
    });
});

/*表单操作*/

/*审批操作*/
function OpenGoodsDetail(orderId){
    window.location.href = "supply/operation?orderId=" + orderId;
}

/*查看操作*/
function OpenGoodsRecord(orderId){
    window.location.href = "supply/record?orderId=" + orderId;
}