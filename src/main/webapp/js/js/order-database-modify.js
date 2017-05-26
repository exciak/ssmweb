var preventDefaultFlag = false;
var pathname = window.location.pathname;
var arr = pathname.split("/");
var prjName = arr[1];
$(document).ready(function () {
    /* 需要注意清空绑定关联值 */
    $("#selectTypeModify").change(function () {
        //$("#dbDetail").html("数据类型：" + dbType);
        selectModifyChange();
    });
});

//测试修改信息
$("#btn_detectModifyInfo").click(function () {
    var project_db = "";
    var accessID = "";
    var accessKey = "";
    var hostname = "";
    var port = "";
    var type = $("#selectTypeModify").children('option:selected').val();
    var gateuuid = $("#selectDxtModify").data("gateuuid");
    var is_sync = "ASYNC";
    var tableUser = "";
    var tableUserPassword = "";
    var hasDBA = true;
    var pubUser = "";
    var pubUserPassword = "";
    var subUser = "";
    var subUserPassword = "";

    preventDefaultFlag=false;
    modifyCheckAll(type);
    if(preventDefaultFlag==true)
    {
        return;
    }
    $("#btn_detectModifyInfo").attr('disabled',true);
    $("#btn_commitModifyInfo").attr('disabled',true);
    var y = document.getElementById("btn_detectModifyInfo");
    y.innerHTML = "测试中...";

    var index = $("#inputModifyID").attr("value");
    var name = $("#inputModifyName").attr("value");
    var description = $("#inputModifyDescription").attr("value");

    if (type == "ODPS"){
        project_db = $("#inputModifyProject").attr("value");
        accessID = $("#inputModifyAccessID").attr("value");
        accessKey = $("#inputModifyAccessKey").attr("value");
        hostname = $("#selectEndPointModify").children('option:selected').val() + "";
    } else if(type == "Oracle_CDC"){
        hostname = $("#inputModifyInstance").attr("value");
        port = $("#inputModifyPort").attr("value");
        project_db = $("#inputModifyDbName").attr("value");
        tableUser = $("#tableUser").attr("value");
        tableUserPassword = $("#tableUserPassword").attr("value");
        if ($("#isSync").attr("checked") == "checked") {
            is_sync = "SYNC";
        }
        if ($("#hasDBA").attr("checked") == "checked") {
            hasDBA = true;
            accessID = $("#oraclecdcUser").attr("value");
            accessKey = $("#oraclecdcPasswd").attr("value");
        } else {
            hasDBA = false;
            pubUser = $("#pubUser").attr("value");
            pubUserPassword = $("#pubUserPassword").attr("value");
            subUser = $("#subUser").attr("value");
            subUserPassword = $("#subUserPassword").attr("value");
        }

    } else {
        hostname = $("#inputModifyInstance").attr("value");
        port = $("#inputModifyPort").attr("value");
        project_db = $("#inputModifyDbName").attr("value");
        accessID = $("#inputModifyUser").attr("value");
        accessKey = $("#inputModifyPassword").attr("value");
    }

    $.post("/" + prjName +"/dbaccess/modify_detect",
        {
            index:index,
            name: name,
            description: description,
            type: type,
            gateuuid: gateuuid,
            project_db: project_db,
            port:port,
            hostname: hostname,
            accessID: accessID,
            accessKey: accessKey,
            is_sync:is_sync,
            tableUser: tableUser,
            tableUserPassword: tableUserPassword,
            hasDBA: hasDBA,
            pubUser: pubUser,
            pubUserPassword: pubUserPassword,
            subUser: subUser,
            subUserPassword: subUserPassword
        },
        function (data, status) {
            if(data.result == "success"){
                dmallNotify(data.message);
            }else{
                dmallError(data.message);
            }
            $("#btn_detectModifyInfo").attr('disabled',false);
            $("#btn_commitModifyInfo").attr('disabled',false);
            var y = document.getElementById("btn_detectModifyInfo");
            y.innerHTML = "测试";
        },
        "json");
});

//提交修改信息
$("#btn_commitModifyInfo").click(function () {
    var project_db = "";
    var accessID = "";
    var accessKey = "";
    var hostname = "";
    var port = "";
    var enableOption = false;
    var type = $("#selectTypeModify").children('option:selected').val();
    var gateuuid = $("#selectDxtModify").data("gateuuid");
    var is_sync = "ASYNC";
    var tableUser = "";
    var tableUserPassword = "";
    var hasDBA = true;
    var pubUser = "";
    var pubUserPassword = "";
    var subUser = "";
    var subUserPassword = "";

    preventDefaultFlag=false;
    modifyCheckAll(type);
    if(preventDefaultFlag==true)
    {
        return ;
    }
    $("#btn_commitModifyInfo").attr("disabled",true);
    var index = $("#inputModifyID").attr("value");
    var name = $("#inputModifyName").attr("value");
    var description = $("#inputModifyDescription").attr("value");

    if (type == "ODPS"){
        project_db = $("#inputModifyProject").attr("value");
        accessID = $("#inputModifyAccessID").attr("value");
        accessKey = $("#inputModifyAccessKey").attr("value");
        hostname = $("#selectEndPointModify").children('option:selected').val() + "";
    } else if(type == "Oracle_CDC"){
        hostname = $("#inputModifyInstance").attr("value");
        port = $("#inputModifyPort").attr("value");
        project_db = $("#inputModifyDbName").attr("value");
        tableUser = $("#tableUser").attr("value");
        tableUserPassword = $("#tableUserPassword").attr("value");
        if ($("#isSync").attr("checked") == "checked") {
            is_sync = "SYNC";
        }
        if ($("#hasDBA").attr("checked") == "checked") {
            hasDBA = true;
            accessID = $("#oraclecdcUser").attr("value");
            accessKey = $("#oraclecdcPasswd").attr("value");
        } else {
            hasDBA = false;
            pubUser = $("#pubUser").attr("value");
            pubUserPassword = $("#pubUserPassword").attr("value");
            subUser = $("#subUser").attr("value");
            subUserPassword = $("#subUserPassword").attr("value");
        }
    } else {
        hostname = $("#inputModifyInstance").attr("value");
        port = $("#inputModifyPort").attr("value");
        project_db = $("#inputModifyDbName").attr("value");
        accessID = $("#inputModifyUser").attr("value");
        accessKey = $("#inputModifyPassword").attr("value");
    }

    if (type == "MySQL" || type == "ADS") {
        if ($("#inputEnableOption").attr("checked") == "checked") {
            enableOption = true;
        }
    }
    var action = $("#dbAction").val();
    $.post("/" + prjName +"/dbaccess/modify",
        {
            index:index,
            name: name,
            description: description,
            type: type,
            gateuuid: gateuuid,
            project_db: project_db,
            port:port,
            hostname: hostname,
            accessID: accessID,
            accessKey: accessKey,
            enableOption: enableOption,
            is_sync:is_sync,
            tableUser: tableUser,
            tableUserPassword: tableUserPassword,
            hasDBA: hasDBA,
            pubUser: pubUser,
            pubUserPassword: pubUserPassword,
            subUser: subUser,
            subUserPassword: subUserPassword,
            action:action
        },
        function (data, status) {
            if(data.result == "success"){
                location.href = "dbaccess";
            } else {
                dmallError(data.result);
                $("#btn_commitModifyInfo").attr("disabled",false);
            }
            /* 关闭模态框example */
            /*$('#example').modal('toggle');*/
            //location.href = dbaccessUrl + dbaccessFilter();
        },
        "json");
});

//打开选择DXT网关modal
$("#selectDxtModifyBtn").click(function(){
    freshDxtList(1);
    $("#addDxtModifyModal").modal({backdrop: 'static', keyboard: false});
});
function freshDxtList(page){
    $.get("/" + prjName +"/dxtgate/dept_dxtgates",
        {
            pageNumber: page
        },
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                var $listAll = $('#list-all');
                $listAll.empty();
                for (var i = 0; i < data.gates.length; i++) {
                    var dxt = data.gates[i];
                    var dbName = dxt.name + "(host：" + dxt.host + ")";
                    var newOption = "<option value='" + dxt.gateuuid + "'>" + dbName + "</option>";
                    $listAll.append(newOption);
                }
                $("#totalPage").html(data.totalPages);
                $("#currentPage").html(data.pageNumber);
            } else {
                dmallError("获取数据传输网关列表失败");
            }
        },
        "json"
    );
}
$("#previouspage").click(
    function () {
        if (parseInt($("#currentPage").text()) > 1) {
            freshDxtList(parseInt($("#currentPage").text()) - 1);
        }
    });

$("#nextpage").click(
    function () {
        if (parseInt($("#currentPage").text()) < parseInt($("#totalPage").text())) {
            freshDxtList(parseInt($("#currentPage").text()) + 1);
        }
    });
//提交网关选择
$("#btn_commit").click(function(){
    $("#list-all option:selected").each(function () {
        var $dbSrcList = $("#selectDxtModify");
        $dbSrcList.attr("value", "");
        $dbSrcList.val($(this).get(0).text);
        $dbSrcList.data("gateuuid", $(this).get(0).value);
    });
});
function selectModifyChange(){
    var type = $("#selectTypeModify").children('option:selected').val();
    //var dbType = $("#dbSrcList").children('option:selected').attr("text");
    if (type == "ODPS") {
        $("#rdsModifyPara").hide();
        $("#opdsModifyPara").show();
        $("#enableOptionPara").hide();
        $("#isSyncDiv").hide();
        emptyModal("opdsModifyPara");
    } else if (type == "MySQL" || type == "ADS") {
        $("#rdsModifyPara").show();
        $("#opdsModifyPara").hide();
        $("#enableOptionPara").show();
        $("#isSyncDiv").hide();
        //$("#inputModifyUser").parent().siblings("label").html("<span class='required'>*</span>用户名：");
        //$("#inputModifyPassword").parent().siblings("label").html("密码：");
        $("#inputModifyUserDiv").show();
        $("#inputModifyPasswordDiv").show();
        $("#oraclecdcCreatePara").hide();
        emptyModal("rdsModifyPara");
    } else if(type == "Oracle_CDC"){
        //$("#inputModifyUser").parent().siblings("label").html("<span class='required'>*</span>管理员用户名：");
        //$("#inputModifyPassword").parent().siblings("label").html("管理员密码：");
        $("#rdsModifyPara").show();
        $("#opdsModifyPara").hide();
        $("#inputModifyUserDiv").hide();
        $("#inputModifyPasswordDiv").hide();
        $("#oraclecdcCreatePara").show();
        $("#enableOptionPara").hide();
        $("#isSyncDiv").show();
        if ($("#hasDBA").attr("checked") == "checked") {
            $("#oraclecdcUserDiv").show();
            $("#oraclecdcPasswdDiv").show();
            $("#pubUserDiv").hide();
            $("#pubUserPasswordDiv").hide();
            $("#subUserDiv").hide();
            $("#subUserPasswordDiv").hide();
        } else {
            $("#oraclecdcUserDiv").hide();
            $("#oraclecdcPasswdDiv").hide();
            $("#pubUserDiv").show();
            $("#pubUserPasswordDiv").show();
            $("#subUserDiv").show();
            $("#subUserPasswordDiv").show();
        }

        emptyModal("rdsModifyPara");
        $("#isSync").attr("checked","checked");
    } else{
        $("#rdsModifyPara").show();
        $("#opdsModifyPara").hide();
        $("#enableOptionPara").hide();
        $("#isSyncDiv").hide();
        $("#inputModifyUserDiv").show();
        $("#inputModifyPasswordDiv").show();
        $("#oraclecdcCreatePara").hide();
        //$("#inputModifyUser").parent().siblings("label").html("<span class='required'>*</span>用户名：");
        //$("#inputModifyPassword").parent().siblings("label").html("密码：");
        emptyModal("rdsModifyPara");
    }
};

function modifyCheckAll(type){
    checkName();
    checkDxtGate();

    if(type == "ODPS"){
        checkProject();
        checkAccessID();
        checkAccessKey();
    } else if (type == "Oracle_CDC") {
        checkInstance();
        checkDbName();
        checkPort();

        checkTableUser();
        if ($("#hasDBA").attr("checked") == "checked") {
            checkOraclecdcUser();
        } else {
            checkPubUser();
            checkSubUser();
        }
    } else{
        checkInstance();
        checkDbName();
        checkPort();
        checkUser();
    }
}
function checkDxtGate(){
    if($("#selectDxtModify").length > 0){
        var string = $("#selectDxtModify").val();
        if(string == "") {
            $("#selectDxtModify").addClass("border-red");
            $(".errorDxt").html("*请选择数据传输网关");
            $(".errorDxt").css("display", "block");
            preventDefaultFlag = true;
        }
    }
}
$("#selectDxtModify").focus(function () {
    $("#selectDxtModify").removeClass("border-red");
    $(".errorDxt").hide();
});

/*名称栏获取焦距*/
$("#inputModifyName").focus(function () {
    var string = $("#inputModifyName").val();
    var ret = inputCheckName(string);
    if(!ret)
    {
        $("#inputModifyName").removeClass("border-red");
        $(".error1").hide();
    }
});

/*名称栏失去焦距*/
$("#inputModifyName").blur(function(){
    checkName();
});
function checkName(){
    var string = $("#inputModifyName").val();
    var ret = inputCheckName(string);
    if(!ret)
    {
        $("#inputModifyName").addClass("border-red");
        $(".error1").html("*请输入数据库名称，由中文、字母、数字、下划线组成，1-64个字符");
        $(".error1").css("display", "block");
        preventDefaultFlag = true;
    }
};

/*Project栏获取焦距*/
$("#inputModifyProject").focus(function () {
    if( $("#inputModifyProject").val()=="")
    {
        $("#inputModifyProject").removeClass("border-red");
        $(".error3").hide();
    }
});

/*Project栏失去焦距*/
$("#inputModifyProject").blur(function(){
    checkProject();
});
function checkProject(){
    if( $("#inputModifyProject").val()=="")
    {
        $("#inputModifyProject").addClass("border-red");
        $(".error3").html("*请输入project名称");
        $(".error3").css("display", "block");
        preventDefaultFlag = true;
    }
};

/*AccessID栏获取焦距*/
$("#inputModifyAccessID").focus(function () {
    if( $("#inputModifyAccessID").val()=="")
    {
        $("#inputModifyAccessID").removeClass("border-red");
        $(".error4").hide();
    }
});

/*AccessID栏失去焦距*/
$("#inputModifyAccessID").blur(function(){
    checkAccessID();
});
function checkAccessID(){
    if( $("#inputModifyAccessID").val()=="")
    {
        $("#inputModifyAccessID").addClass("border-red");
        $(".error4").html("*请输入AccessID");
        $(".error4").css("display", "block");
        preventDefaultFlag = true;
    }
};

/*AccessKey栏获取焦距*/
$("#inputModifyAccessKey").focus(function () {
    if( $("#inputModifyAccessKey").val()=="")
    {
        $("#inputModifyAccessKey").removeClass("border-red");
        $(".error5").hide();
    }
});

/*AccessKey栏失去焦距*/
$("#inputModifyAccessKey").blur(function(){
    checkAccessKey();
});
function checkAccessKey(){
    if( $("#inputModifyAccessKey").val()=="")
    {
        $("#inputModifyAccessKey").addClass("border-red");
        $(".error5").html("*请输入AccessKey");
        $(".error5").css("display", "block");
        preventDefaultFlag = true;
    }
};

/*服务器主机名称/地址栏获取焦距*/
$("#inputModifyInstance").focus(function () {
    if( $("#inputModifyInstance").val()=="")
    {
        $("#inputModifyInstance").removeClass("border-red");
        $(".error6").hide();
    }
});

/*服务器主机名称/地址栏失去焦距*/
$("#inputModifyInstance").blur(function(){
    checkInstance();
});
function checkInstance(){
    if( $("#inputModifyInstance").val()=="")
    {
        $("#inputModifyInstance").addClass("border-red");
        $(".error6").html("*请输入服务器主机名称/地址");
        $(".error6").css("display", "block");
        preventDefaultFlag = true;
    }
};

/*TCP/IP端口栏获取焦距*/
$("#inputModifyPort").focus(function () {
    if( $("#inputModifyPort").val()=="")
    {
        $("#inputModifyPort").removeClass("border-red");
        $(".error7").hide();
    }
});

/*TCP/IP端口栏失去焦距*/
$("#inputModifyPort").blur(function(){
    checkPort();
});
function checkPort(){
    if( $("#inputModifyPort").val()=="")
    {
        $("#inputModifyPort").addClass("border-red");
        $(".error7").html("*请输入TCP/IP端口");
        $(".error7").css("display", "block");
        preventDefaultFlag = true;
    }
};

/*数据库名栏获取焦距*/
$("#inputModifyDbName").focus(function () {
    if( $("#inputModifyDbName").val()=="")
    {
        $("#inputModifyDbName").removeClass("border-red");
        $(".error8").hide();
    }
});

/*数据库名栏失去焦距*/
$("#inputModifyDbName").blur(function(){
    checkDbName();
});
function checkDbName(){
    if( $("#inputModifyDbName").val()=="")
    {
        $("#inputModifyDbName").addClass("border-red");
        $(".error8").html("*请输入数据库名称");
        $(".error8").css("display", "block");
        preventDefaultFlag = true;
    }
};

/*用户名栏获取焦距*/
$("#inputModifyUser").focus(function () {
    if( $("#inputModifyUser").val()=="")
    {
        $("#inputModifyUser").removeClass("border-red");
        $(".error9").hide();
    }
});

/*数据库名栏失去焦距*/
$("#inputModifyUser").blur(function(){
    checkUser();
});
function checkUser(){
    if( $("#inputModifyUser").val()=="")
    {
        $("#inputModifyUser").addClass("border-red");
        $(".error9").html("*请输入用户名");
        $(".error9").css("display", "block");
        preventDefaultFlag = true;
    }
};
/*表用户栏获取焦点*/
$("#tableUser").focus(function () {
    if( $("#tableUser").val()=="")
    {
        $("#tableUser").removeClass("border-red");
        $(".error12").hide();
    }
});

/*表用户失去焦点*/
$("#tableUser").blur(function(){
    checkTableUser();
});
function checkTableUser(){
    if( $("#tableUser").val()=="") {
        $("#tableUser").addClass("border-red");
        $(".error12").html("*请输入表用户");
        $(".error12").css("display", "block");
        preventDefaultFlag = true;
    }
};
/*管理员用户栏获取焦点*/
$("#oraclecdcUser").focus(function () {
    if ($("#oraclecdcUser").val() == "") {
        $("#oraclecdcUser").removeClass("border-red");
        $(".error14").hide();
    }
});

/*管理员用户栏失去焦距*/
$("#oraclecdcUser").blur(function () {
    checkOraclecdcUser();
});
function checkOraclecdcUser() {
    if ($("#oraclecdcUser").val() == "") {
        $("#oraclecdcUser").addClass("border-red");
        $(".error14").html("*请输入管理员用户");
        $(".error14").css("display", "block");
        preventDefaultFlag = true;
    }
};
/*发布者用户栏获取焦点*/
$("#pubUser").focus(function () {
    if ($("#pubUser").val() == "") {
        $("#pubUser").removeClass("border-red");
        $(".error16").hide();
    }
});

/*发布者用户栏失去焦距*/
$("#pubUser").blur(function () {
    checkPubUser();
});
function checkPubUser() {
    if ($("#pubUser").val() == "") {
        $("#pubUser").addClass("border-red");
        $(".error16").html("*请输入发布者用户");
        $(".error16").css("display", "block");
        preventDefaultFlag = true;
    }
};
/*订阅者用户栏获取焦点*/
$("#subUser").focus(function () {
    if ($("#subUser").val() == "") {
        $("#subUser").removeClass("border-red");
        $(".error18").hide();
    }
});

/*订阅者用户栏失去焦距*/
$("#subUser").blur(function () {
    checkSubUser();
});
function checkSubUser() {
    if ($("#subUser").val() == "") {
        $("#subUser").addClass("border-red");
        $(".error18").html("*请输入订阅者用户");
        $(".error18").css("display", "block");
        preventDefaultFlag = true;
    }
};
$("#hasDBA").click(function () {
    if ($("#hasDBA").attr("checked") == "checked") {
        $("#oraclecdcUserDiv").show();
        $("#oraclecdcPasswdDiv").show();
        $("#pubUserDiv").hide();
        $("#pubUserPasswordDiv").hide();
        $("#subUserDiv").hide();
        $("#subUserPasswordDiv").hide();
    } else {
        $("#oraclecdcUserDiv").hide();
        $("#oraclecdcPasswdDiv").hide();
        $("#pubUserDiv").show();
        $("#pubUserPasswordDiv").show();
        $("#subUserDiv").show();
        $("#subUserPasswordDiv").show();
    }
});
