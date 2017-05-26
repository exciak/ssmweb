var urlType = /^((http|https):\/\/)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:([1-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?(\/\S+)*\/?$/;

$(document).ready(function(){
//打开添加网关弹出框
    $("#addGateway").click(function(){
        var isLimit = $("#isLimit").val();
        if(isLimit == "true"){
            dmallError("目前只支持一个API网关，不允许创建");
        } else {
            emptyModal("addGagewayModal");
            $(".dopUrl_error").hide();
            $("#commitBtn").data("tag","add");
            $('#addGagewayModal').modal({backdrop: 'static', keyboard: false});
            $(".dop_warn_error").hide();
        }
    });
    $("#dopUrl").blur(function() {
        var dopUrl = $("#dopUrl").val();
        checkUrl(dopUrl);
    });
    //提交修改
    $("#commitBtn").click(function(){
        var tag = $("#commitBtn").data("tag");
        var url = "";
        var data = {};
        var dopUrl = $("#dopUrl").val();
        if(!checkUrl(dopUrl)) {
            return false;
        }

        $("#commitBtn").attr('disabled', true);

        if(tag == "add"){
            url = "../gateway/create";
            data.url = dopUrl;
            data.type = "dop";
        } else {
            url = "../gateway/update";
            data.url = dopUrl;
            data.id = $("#addGagewayModal").data("id");
        }
        $.post(url, data,
            function (data, status) {
                if (data.result != "success") {
                    dmallError(data.result);
                    $("#commitBtn").attr('disabled', false);
                } else {
                    location.href = window.location.href;
                }
            },
            "json");
    });
    //删除网关
    $("#delBtn").click(function(){
        var id = $("#delGatewayModal").data("id");
        $.post("../gateway/del",
            {
                id:id
            },
            function (data, status) {
                if (data.result != "success") {
                    dmallError(data.result);
                } else {
                    location.href = window.location.href;
                }
            },
            "json");
    });
});
function checkUrl(dopUrl) {

    if (!dopUrl.match(urlType)) {
        $("#dopUrl").addClass("border-red");
        $(".dopUrl_error").html("*请输入正确格式的url,http(s)://域名(ip)(端口号)(路径)");
        $(".dopUrl_error").css("display", "block");

        return false;
    } else {
        $("#dopUrl").removeClass("border-red");
        $(".dopUrl_error").hide();
        return true;
    }
}
//打开修改网关弹出框
function editGateway(id,name){
    emptyModal("addGagewayModal");
    var dopUrl = name;
    $("#dopUrl").val(dopUrl);
    $(".dopUrl_error").hide();
    $("#commitBtn").data("tag","edit");
    $('#addGagewayModal').data("id",id);
    $('#addGagewayModal').modal({backdrop: 'static', keyboard: false});
    $(".dop_warn_error").show();
}
//删除网关

function delGateway(id){
    $('#delGatewayModal').modal({backdrop: 'static', keyboard: false});
    $('#delGatewayModal').data("id",id);
}
