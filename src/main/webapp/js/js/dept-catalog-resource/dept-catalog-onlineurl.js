/**
 * Created by 如川 on 2016/3/17.
 */

ExtraCatalog.regGetData(Module.ONLINEURL, onlineUrlGetData);

ExtraCatalog.regInit(Module.ONLINEURL, onlineUrlInit);

ExtraCatalog.regRender(Module.ONLINEURL, onlineUrlRender);

ExtraCatalog.regCheck(Module.ONLINEURL, onlineUrlCheck);

function onlineUrlGetData(){
    return getOnlineUrlData();
}

function onlineUrlInit(bool) {
    if(bool)
        return initOnlineUrl();
    else
        return emptyOnlineUrl();
}

function onlineUrlRender(extraParams) {
    return renderOnlineUrl(extraParams);
}

function  onlineUrlCheck() {
    /*检查在线资源链接地址输入框*/
    return checkUrlValue();
}

$(document).ready()
{
    var resourceTypeCode = "ONLINEURL";


    /*检查在线资源链接地址输入框*/
    $("#url").focus(function () {
        if ($("#url").val() == "") {
            $("#url").removeClass("errorC");
            $(".errorUrl").hide();
        }
    });

    /* 失去焦点*/
    $("#url").blur(function () {
        checkUrlValue();
    });


    function checkUrlValue() {
            var onlineUrl = $("#url").val();
            if (onlineUrl == "") {
                $("#url").addClass("errorC");
                $(".errorUrl").html("*请输入在线资源链接地址");
                $(".errorUrl").css("display", "block");
                return true;
            } else if (!normalUrlRegExp(onlineUrl)) {
                $("#url").addClass("errorC");
                $(".errorUrl").html("*请输入正确格式的url,http(s)://域名(ip)(端口号)(路径)");
                $(".errorUrl").css("display", "block");
                return true;
            }else {
                $("#url").removeClass("errorC");
                $(".errorUrl").hide();
                return false;
            }
    };

    function getOnlineUrlData() {
        var resourceParamType = "URL";
        var urlParams = {
            resourceParamType: resourceParamType,
            url: $("#url").val()
        };
        return urlParams;
    };

    function renderOnlineUrl(extraParams) {
        $("#url").val(extraParams.url);
    };


    function initOnlineUrl() {
        //$("#url").val($("#url").val());
    };

    function emptyOnlineUrl() {
        //$("#url").val("");
    };
};