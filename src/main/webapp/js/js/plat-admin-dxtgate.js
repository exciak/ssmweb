var urlType = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];
$(document).ready(function(){
//打开添加网关弹出框
    $("#addGateway").click(function(){
        var isLimit = $("#isLimit").val();
        if(isLimit == "true"){
           dmallError("目前只支持一个数据传输网关，不允许创建");
        } else {
            emptyModal("addGagewayModal");
            $(".dxtName_error").hide();
            $(".dxtHost_error").hide();
            $(".dxtUser_error").hide();
            $(".dxtPasswd_error").hide();
            $("#commitBtn").data("tag", "add");
            $("#commitBtn").data("gateuuid", "");
            $('#addGagewayModal').modal({backdrop: 'static', keyboard: false});
            $("#commitBtn").attr("disabled", true);
            $("#detectBtn").attr("disabled", true);
            $(".dop_warn_error").hide();
            getDxtData(1);
        }
    });
    function getDxtData(page){
        $.get("/" + proName + "/dxtgate/dxtgates", {
                page:page
            },
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    var $listAll = $("#dxtTable");
                    $listAll.empty();
                    for (var i = 0; i < data.gates.length; i++) {
                        var columns = data.gates[i];
                        var trHTML = '<tr><td hidden>' + columns.gateuuid + '</td>' +
                            '<td>' + columns.name + '</td>' +
                            '<td>' + columns.host + '</td>' +
                            '<td>' + columns.username + '</td></tr>';
                        $listAll.append(trHTML);
                    }
                    $("#totalPage").html(data.totalPages);
                    $("#currentPage").html(data.pageNumber);
                } else {
                    dmallError(data.result);
                }
            },
            "json");
    }
    $("#dxtTable").delegate("tr", "click", function () {
        $(this).css("background-color","#017aff");
        $(this).siblings().css("background-color","#ffffff");
        $("#commitBtn").attr("disabled",false);
        $("#detectBtn").attr("disabled",false);
        $("#commitBtn").data("gateuuid",$(this).children(0).html());
    });

    // 资源列表翻页
    $("#previouspage").click(
        function () {
            if (parseInt($("#currentPage").html()) > 1) {
                getDxtData(parseInt($("#currentPage").html()) - 1);
            }
        });

    $("#nextpage").click(
        function () {
            if (parseInt($("#currentPage").html()) < parseInt($("#totalPage").html())) {
                getDxtData(parseInt($("#currentPage").html()) + 1);
            }
        });
    $("#dxtHost").blur(function() {
        var dxtHost = $("#dxtHost").val();
        checkUrl(dxtHost);
    });

    //删除网关
    $("#delBtn").click(function(){
        var id = $("#delGatewayModal").data("id");
        $.post("/" + proName + "/dxtgate/del",
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

    //测试网关
    $("#detectBtn").click(function(){
        var gateuuid = $("#commitBtn").data("gateuuid");
        if(gateuuid == undefined){
            dmallError("请选择网关");
            return false;
        }
        $("#commitBtn").attr("disabled",true);
        $("#detectBtn").attr("disabled",true);
        detectGateway(gateuuid);
    });
});

//提交修改
function saveDxtGateway(gateType) {
    $("#commitBtn").attr('disabled', true);
    var tag = $("#commitBtn").data("tag");
    var url = "";
    var data = {};
    var dxtHost = $("#dxtHost").val();
    var name = $("#dxtName").val();
    var user = $("#dxtUser").val();
    var passwd = $("#dxtPasswd").val();
    /*  if(checkUrl(dxtHost) || checkNotBlank($("#dxtName"),$(".dxtName_error"),"*请输入名称") || checkNotBlank($("#dxtUser"),$(".dxtUser_error"),"*请输入用户名")) {
     return false;
     }*/
    /*if(tag == "add"){
     url = "../dxtgate/create";
     data.host = dxtHost;
     data.name = name;
     data.username = user;
     data.password = passwd;
     } else {
     url = "../dxtgate/update";
     data.host = dxtHost;
     data.name = name;
     data.username = user;
     data.password = passwd;
     data.id = $("#addGagewayModal").data("id");
     }*/
    $.post("/" + proName + "/dxtgate/create", {
            gateuuid: $("#commitBtn").data("gateuuid"),
            gateType: gateType
        },
        function (data, status) {
            if (data.result != "success") {
                dmallError(data.result);
                $("#commitBtn").attr('disabled', false);
            } else {
                location.href = window.location.href;
            }
        },
        "json");
};

//打开修改网关弹出框
function editGateway(id,name,host,user){
    emptyModal("addGagewayModal");
    $("#dxtName").val(name)
    $("#dxtHost").val(host);
    $("#dxtUser").val(user);
    $(".dxtName_error").hide();
    $(".dxtHost_error").hide();
    $(".dxtUser_error").hide();
    $(".dxtPasswd_error").hide();
    $("#commitBtn").data("tag","edit");
    $('#addGagewayModal').data("id",id);
    $('#addGagewayModal').modal({backdrop: 'static', keyboard: false});
    $(".dxt_warn_error").show();
}
//删除网关
function delGateway(id){
    $('#delGatewayModal').modal({backdrop: 'static', keyboard: false});
    $('#delGatewayModal').data("id",id);
}

function detectGatewayById(obj, index){
    $("#testText"+index).text("测试中...");
    $("#testOper"+index).removeAttr('onclick');

    $.post("/" + proName + "/dxtgate/detect",
        {
            gateuuid:index
        },
        function (data, status) {
            if(data.result == "success"){
                dmallNotify(data.message);
            }else{
                dmallError(data.message);
            }
            $("#testText"+index).text("测试");
            $("#testOper"+index).attr('onclick', 'detectGatewayById(this, '+index+');');
        },
        "json");
}

function detectGateway(gateuuid){
    $.post("/" + proName + "/dxtgate/create_detect",
        {
            gateuuid:gateuuid
        },
        function (data, status) {
            if(data.result == "success"){
                dmallNotify(data.message);
            }else{
                dmallError(data.message);
            }
            $("#commitBtn").attr("disabled",false);
            $("#detectBtn").attr("disabled",false);
        },
        "json");
}
