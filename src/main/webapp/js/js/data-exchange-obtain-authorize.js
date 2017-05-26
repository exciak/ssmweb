/**
 * Created by Administrator on 2015/8/13.
 */

var submenuValue;

$(document).ready(function () {
    submenuValue = $("#subType").val();

    $("#openAllAuthorize").attr("href", "obtain?subType=" + "ALL");
    $("#openAllAuthorize").click (function () {
        submenuValue = "ALL";
    });

    $("#openAuthorizing").attr("href", "obtain?subType=" + "AUTHORIZING");
    $("#openAuthorizing").click (function () {
        submenuValue = "AUTHORIZING";
    });

    $("#openAuthorized").attr("href", "obtain?subType=" + "AUTHORIZED");
    $("#openAuthorized").click (function () {
        submenuValue = "AUTHORIZED";
    });

    if (submenuValue === "ALL") {
        $("#openAllAuthorize").addClass("a-selected");
        $("#openAuthorizing").removeClass("a-selected");
        $("#openAuthorized").removeClass("a-selected");
    } else if (submenuValue === "AUTHORIZING"){
        $("#openAllAuthorize").removeClass("a-selected");
        $("#openAuthorizing").addClass("a-selected");
        $("#openAuthorized").removeClass("a-selected");
    } else if (submenuValue === "AUTHORIZED"){
        $("#openAllAuthorize").removeClass("a-selected");
        $("#openAuthorizing").removeClass("a-selected");
        $("#openAuthorized").addClass("a-selected");
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
    window.location.href = "obtain/operation?orderId=" + orderId;
}

/*查看操作*/
function OpenGoodsRecord(orderId){
    window.location.href = "obtain/record?orderId=" + orderId;
}