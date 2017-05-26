/**
 * Created by Administrator on 2015/8/13.
 */

var submenuValue;

$(document).ready(function () {
    submenuValue = $("#subType").val();

    $("#openAllAuthorize").attr("href", "publish?subType=" + "ALL");
    $("#openAllAuthorize").click (function () {
        submenuValue = "ALL";
    });

    $("#openAuthorizing").attr("href", "publish?subType=" + "AUTHORIZING");
    $("#openAuthorizing").click (function () {
        submenuValue = "AUTHORIZING";
    });

    $("#openAuthorized").attr("href", "publish?subType=" + "AUTHORIZED");
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
});
