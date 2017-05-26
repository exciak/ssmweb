/**
 * Created by 如川 on 2016/3/17.
 */
ExtraCatalog.regGetData(Module.COMMFILE, commGetData);
ExtraCatalog.regInit(Module.COMMFILE, commInit);
ExtraCatalog.regRender(Module.COMMFILE, commRender);
ExtraCatalog.regCheck(Module.COMMFILE, commCheck);

function commGetData(){
    return getCommData();
}

function commInit(bool) {
    if(bool)
        return initComm();
    else
        return emptyComm();
}

function commRender(catalog) {
    return renderComm(catalog);
}

function commCheck() {
    /*检查非结构化文本地址输入框*/
    return checkContentUrlValue();
}

$(document).ready()
{
    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    var proName = arr[1];
    var rootPath = "http://" + window.location.host + "/" + proName;

    /*检查非结构化文本地址输入框*/
    $("#contentUrl").focus(function () {
        if ($("#contentUrl").val() == "") {
            $("#contentUrl").removeClass("errorC");
            $(".errorContentUrl").hide();
        }
    });
    function checkContentUrlValue() {
            var contentUrl = $("#contentUrl").val();
            if (contentUrl == "") {
                $("#contentUrl").addClass("errorC");
                $(".errorContentUrl").html("*请输入文件地址");
                $(".errorContentUrl").css("display", "block");
                return true;
            }else if ( !normalUrlRegExp(contentUrl) ) {
                $("#url").addClass("errorC");
                $(".errorContentUrl").html("*请输入正确格式的url,http(s)://域名(ip)(端口号)(路径)");
                $(".errorContentUrl").css("display", "block");
                return true;
            }else {
                $("#contentUrl").removeClass("errorC");
                $(".errorContentUrl").hide();
                return false;
            }

    };
    /* 失去焦点*/
    $("#contentUrl").blur(function () {
        checkContentUrlValue();
    });

    function commFileType(resourceParamType) {
        $.get(rootPath + "/share/getResourceParamType",
            {
                resourceTypeCode: "COMMFILE"
            },
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    $("#typeCOMMFILE").empty();
                    for (var key in data.resourceParamTypes) {
                        var temp = data.resourceParamTypes[key];
                        if (key == resourceParamType) {
                            var trHTML = '<option value=' + key + ' selected>' + temp + '</a></li>';
                        } else {
                            var trHTML = '<option value=' + key + '>' + temp + '</a></li>';
                        }
                        $("#typeCOMMFILE").append(trHTML);
                    }
                } else {
                    dmallError("获取文件类型失败");
                }
            },
            "json"
        );
    };

    function getCommData() {
        var commParams = {
            resourceParamType: $("#typeCOMMFILE option:selected").val(),
            url: $("#contentUrl").val()
        }
        return commParams;
    };

    function renderComm(extraParams) {
        commFileType(extraParams.resourceParamType)
        $("#contentUrl").val(extraParams.url);
    };

    function initComm() {
        var fileType = $("#commParamType").val();
        commFileType(fileType);
    };

    function emptyComm() {
        var paramType = $("#typeCOMMFILE").val();
        commFileType(paramType);
        //$("#contentUrl").val("");
    };
}



