/**
 * Created by Administrator on 2015/7/2.
 */
/* 修改和删除操作的索引值 */
var dbOpRowIndex = 0;
var curPageNumber = 0;
var preventDefaultFlag = false;
var pathname = window.location.pathname;
var arr = pathname.split("/");
var prjName = arr[1];

$(document).ready(function () {
    $("#selectTypeCreate").change(function () {
        //$("#dbDetail").html("数据类型：" + dbType);
        selectCreateChange();
    });
    freshDxtList(1);
});
//提交测试信息
$("#btn_detectCreateInfo").click(function () {
    var project_db = "";
    var accessID = "";
    var accessKey = "";
    var hostname = "";
    var port = "";
    var type = $("#selectTypeCreate").children('option:selected').val();
    var gateuuid = $("#selectDxtGate").data("gateuuid");
    var is_sync = "ASYNC";
    var tableUser = "";
    var tableUserPassword = "";
    var hasDBA = true;
    var pubUser = "";
    var pubUserPassword = "";
    var subUser = "";
    var subUserPassword = "";

    preventDefaultFlag = false;
    createCheckAll(type);
    if(preventDefaultFlag == true)
    {
        return ;
    }

    $("#btn_detectCreateInfo").attr('disabled',true);
    $("#btn_commitCreateInfo").attr('disabled',true);
    var y = document.getElementById("btn_detectCreateInfo");
    y.innerHTML = "测试中...";

    var name = $("#inputName").attr("value") + "";
    var description = $("#inputDescription").attr("value") + "";

    if (type == "ODPS"){
        project_db = $("#inputProject").attr("value");
        accessID = $("#inputAccessID").attr("value");
        accessKey = $("#inputAccessKey").attr("value");
        hostname = $("#selectEndPointCreate").children('option:selected').val();
    }else if(type == "Oracle_CDC"){
        hostname = $("#inputRdsInstance").attr("value");
        project_db = $("#inputRdsdbName").attr("value");
        port = $("#inputRdsPort").attr("value");
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
        hostname = $("#inputRdsInstance").attr("value");
        project_db = $("#inputRdsdbName").attr("value");
        accessID = $("#inputRdsUser").attr("value");
        accessKey = $("#inputRdsPasswd").attr("value");
        port = $("#inputRdsPort").attr("value");
    }

    $.post("/" + prjName + "/dbaccess/create_detect",
        {
            name: name,
            description:description,
            type: type,
            gateuuid: gateuuid,
            hostname: hostname,
            port:port,
            project_db:project_db,
            accessID: accessID,
            accessKey: accessKey,
            is_sync:is_sync,
            tableUser: tableUser,
            tableUserPassword : tableUserPassword,
            hasDBA : hasDBA,
            pubUser : pubUser,
            pubUserPassword : pubUserPassword,
            subUser : subUser,
            subUserPassword : subUserPassword
        },
        function (data, status) {
            if(data.result == "success"){
                dmallNotify(data.message);
            }else{
                dmallError(data.message);
            }
            $("#btn_detectCreateInfo").attr('disabled',false);
            $("#btn_commitCreateInfo").attr('disabled',false);
            var y = document.getElementById("btn_detectCreateInfo");
            y.innerHTML = "测试";
        },
        "json");
});

//提交创建信息
$("#btn_commitCreateInfo").click(function () {
    var project_db = "";
    var accessID = "";
    var accessKey = "";
    var hostname = "";
    var port = "";
    var enableOption = false;
    var is_sync = "ASYNC";
    var tableUser = "";
    var tableUserPassword = "";
    var hasDBA = true;
    var pubUser = "";
    var pubUserPassword = "";
    var subUser = "";
    var subUserPassword = "";

    var type = $("#selectTypeCreate").children('option:selected').val();
    var gateuuid = $("#selectDxtGate").data("gateuuid");
    preventDefaultFlag = false;
    createCheckAll(type);
    if(preventDefaultFlag == true)
    {
        return ;
    }
    $("#btn_commitCreateInfo").attr('disabled',true);
    var name = $("#inputName").attr("value") + "";
    var description = $("#inputDescription").attr("value") + "";

    if (type == "ODPS"){
        project_db = $("#inputProject").attr("value");
        accessID = $("#inputAccessID").attr("value");
        accessKey = $("#inputAccessKey").attr("value");
        hostname = $("#selectEndPointCreate").children('option:selected').val();
    } else if(type == "Oracle_CDC"){
        hostname = $("#inputRdsInstance").attr("value");
        project_db = $("#inputRdsdbName").attr("value");
        port = $("#inputRdsPort").attr("value");
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
        hostname = $("#inputRdsInstance").attr("value");
        project_db = $("#inputRdsdbName").attr("value");
        accessID = $("#inputRdsUser").attr("value");
        accessKey = $("#inputRdsPasswd").attr("value");
        port = $("#inputRdsPort").attr("value");
    }

    if (type == "MySQL" || type == "ADS") {
        if ($("#inputEnableOption").attr("checked") == "checked") {
            enableOption = true;
        }
    }
    var action = $("#dbAction").val();
    $.post("/" + prjName + "/dbaccess/create",
        {
            name: name,
            description:description,
            type: type,
            gateuuid: gateuuid,
            hostname: hostname,
            port:port,
            project_db:project_db,
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
            if (data.result == "success") {
                location.href = "dbaccess";
            } else {
                $("#btn_commitCreateInfo").attr('disabled',false);
                dmallError(data.result);
            }
            //location.href = dbaccessUrl + dbaccessFilter();
        },
        "json");
});

//打开选择DXT网关modal
$("#selectDxtGateBtn").click(function(){

    $("#addDxtGateModal").modal({backdrop: 'static', keyboard: false});
});
function freshDxtList(page){
    $.get("/" + prjName + "/dxtgate/dept_dxtgates",
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
                if(data.gates.length == 1){
                    var dxt = data.gates[0];
                    var $dbSrcList = $("#selectDxtGate");
                    $dbSrcList.attr("value", "");
                    $dbSrcList.val(dxt.name + "(host：" + dxt.host + ")");
                    $dbSrcList.data("gateuuid", dxt.gateuuid);
                    $("#selectDxtGateBtn").hide();
                }
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
        var $dbSrcList = $("#selectDxtGate");
        $dbSrcList.attr("value", "");
        $dbSrcList.val($(this).get(0).text);
        $dbSrcList.data("gateuuid", $(this).get(0).value);
    });
});

function selectCreateChange(){
    var type = $("#selectTypeCreate").children('option:selected').val();
    //var dbType = $("#dbSrcList").children('option:selected').attr("text");
    if(type != "0") {
        $("#selectTypeCreate").removeClass("border-red");
        //$(".error11").hide();
    }
    if (type == "0") {
        $("#selectTypeCreate").addClass("border-red");
        //$(".error11").html("*请选择数据库类型");
        //$(".error11").css("display", "block");
        $("#rdsCreatePara").hide();
        $("#opdsCreatePara").hide();
        $("#enableOptionPara").hide();
        $("#isSyncDiv").hide();
    } else if (type == "ODPS") {
        $("#rdsCreatePara").hide();
        $("#opdsCreatePara").show();
        $("#enableOptionPara").hide();
        $("#isSyncDiv").hide();
        emptyModal("opdsCreatePara");
    } else if (type == "MySQL" || type == "ADS") {
        $("#opdsCreatePara").hide();
        $("#rdsCreatePara").show();
        //$("#inputRdsUser").parent().siblings("label").html("<span class='required'>*</span>用户名：");
        //$("#inputRdsPasswd").parent().siblings("label").html("密码：");
        $("#enableOptionPara").show();
        $("#isSyncDiv").hide();
        $("#inputRdsUserDiv").show();
        $("#inputRdsPasswdDiv").show();
        $("#oraclecdcCreatePara").hide();
        emptyModal("rdsCreatePara");
    } else if(type == "Oracle_CDC"){
        //$("#inputRdsUser").parent().siblings("label").html("<span class='required'>*</span>管理员用户名：");
        //$("#inputRdsPasswd").parent().siblings("label").html("管理员密码：");
        $("#rdsCreatePara").show();
        $("#opdsCreatePara").hide();
        $("#inputRdsUserDiv").hide();
        $("#inputRdsPasswdDiv").hide();
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

        emptyModal("rdsCreatePara");
    }else {
        $("#opdsCreatePara").hide();
        $("#rdsCreatePara").show();
        //$("#inputRdsUser").parent().siblings("label").html("<span class='required'>*</span>用户名：");
        //$("#inputRdsPasswd").parent().siblings("label").html("密码：");
        $("#enableOptionPara").hide();
        $("#isSyncDiv").hide();
        $("#inputRdsUserDiv").show();
        $("#inputRdsPasswdDiv").show();
        $("#oraclecdcCreatePara").hide();

        emptyModal("rdsCreatePara");
    }
};

function createCheckAll(type){
    checkName();
    checkDxtGate();
    if(type == "0") {
        $("#selectTypeCreate").addClass("border-red");
        preventDefaultFlag = true;
    }
    else if(type == "ODPS"){
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
        checkPassword();
    }
}
/*名称栏获取焦距*/
$("#inputName").focus(function () {
    var string = $("#inputName").val();
    var ret = inputCheckName(string);
    if(!ret)
    {
        $("#inputName").removeClass("border-red");
        $(".error1").hide();
    }
});

/*名称栏失去焦距*/
$("#inputName").blur(function(){
    checkName();
});
function checkName(){
    var string = $("#inputName").val();
    var ret = inputCheckName(string);
    if(!ret)
    {
        $("#inputName").addClass("border-red");
        $(".error1").html("*请输入数据库名称，由中文、字母、数字、下划线组成，1-64个字符");
        $(".error1").css("display", "block");
        preventDefaultFlag = true;
    }
};
function checkDxtGate(){
    if($("#selectDxtGate").length > 0){
        var string = $("#selectDxtGate").val();
        if(string == "") {
            $("#selectDxtGate").addClass("border-red");
            $(".errorDxt").html("*请选择数据传输网关");
            $(".errorDxt").css("display", "block");
            preventDefaultFlag = true;
        }
    }
}
$("#selectDxtGate").focus(function () {
    $("#selectDxtGate").removeClass("border-red");
    $(".errorDxt").hide();

});

/*Project栏获取焦距*/
$("#inputProject").focus(function () {
    if( $("#inputProject").val()=="")
    {
        $("#inputProject").removeClass("border-red");
        $(".error3").hide();
    }
});

/*Project栏失去焦距*/
$("#inputProject").blur(function(){
    checkProject();
});
function checkProject(){
    if( $("#inputProject").val()=="")
    {
        $("#inputProject").addClass("border-red");
        $(".error3").html("*请输入project名称");
        $(".error3").css("display", "block");
        preventDefaultFlag = true;
    }
};

/*AccessID栏获取焦距*/
$("#inputAccessID").focus(function () {
    if( $("#inputAccessID").val()=="")
    {
        $("#inputAccessID").removeClass("border-red");
        $(".error4").hide();
    }
});

/*AccessID栏失去焦距*/
$("#inputAccessID").blur(function(){
    checkAccessID();
});
function checkAccessID(){
    if( $("#inputAccessID").val()=="")
    {
        $("#inputAccessID").addClass("border-red");
        $(".error4").html("*请输入AccessID");
        $(".error4").css("display", "block");
        preventDefaultFlag = true;
    }
};

/*AccessKey栏获取焦距*/
$("#inputAccessKey").focus(function () {
    if( $("#inputAccessKey").val()=="")
    {
        $("#inputAccessKey").removeClass("border-red");
        $(".error5").hide();
    }
});

/*AccessKey栏失去焦距*/
$("#inputAccessKey").blur(function(){
    checkAccessKey();
});
function checkAccessKey(){
    if( $("#inputAccessKey").val()=="")
    {
        $("#inputAccessKey").addClass("border-red");
        $(".error5").html("*请输入AccessKey");
        $(".error5").css("display", "block");
        preventDefaultFlag = true;
    }
};

/*服务器主机名称/地址栏获取焦距*/
$("#inputRdsInstance").focus(function () {
    if( $("#inputRdsInstance").val()=="")
    {
        $("#inputRdsInstance").removeClass("border-red");
        $(".error6").hide();
    }
});

/*服务器主机名称/地址栏失去焦距*/
$("#inputRdsInstance").blur(function(){
    checkInstance();
});
function checkInstance(){
    if( $("#inputRdsInstance").val()=="")
    {
        $("#inputRdsInstance").addClass("border-red");
        $(".error6").html("*请输入服务器主机名称/地址");
        $(".error6").css("display", "block");
        preventDefaultFlag = true;
    }
};

/*TCP/IP端口栏获取焦距*/
$("#inputRdsPort").focus(function () {
    $("#inputRdsPort").removeClass("border-red");
    $(".error7").hide();
});

/*TCP/IP端口栏失去焦距*/
$("#inputRdsPort").blur(function(){
    checkPort();
});
function checkPort(){
    var port = $("#inputRdsPort").val();
    if( port == "") {
        $("#inputRdsPort").addClass("border-red");
        $(".error7").html("*请输入TCP/IP端口");
        $(".error7").css("display", "block");
        preventDefaultFlag = true;
    }
    var ret = checkTcpIpPort(port);
    if(!ret) {
        $("#inputRdsPort").addClass("border-red");
        $(".error7").html("*TCP/IP端口取值范围为1至65535");
        $(".error7").css("display", "block");
        preventDefaultFlag = true;
    }

};

/*数据库名栏获取焦距*/
$("#inputRdsdbName").focus(function () {
    if( $("#inputRdsdbName").val()=="")
    {
        $("#inputRdsdbName").removeClass("border-red");
        $(".error8").hide();
    }
});

/*数据库名栏失去焦距*/
$("#inputRdsdbName").blur(function(){
    checkDbName();
});
function checkDbName(){
    if( $("#inputRdsdbName").val()=="")
    {
        $("#inputRdsdbName").addClass("border-red");
        $(".error8").html("*请输入数据库名称");
        $(".error8").css("display", "block");
        preventDefaultFlag = true;
    }
};

/*用户名栏获取焦距*/
$("#inputRdsUser").focus(function () {
    if( $("#inputRdsUser").val()=="")
    {
        $("#inputRdsUser").removeClass("border-red");
        $(".error9").hide();
    }
});

/*数据库名栏失去焦距*/
$("#inputRdsUser").blur(function(){
    checkUser();
});
function checkUser(){
    if( $("#inputRdsUser").val()=="")
    {
        $("#inputRdsUser").addClass("border-red");
        $(".error9").html("*请输入用户名");
        $(".error9").css("display", "block");
        preventDefaultFlag = true;
    }
};

/*密码栏获取焦距*/
$("#inputRdsPasswd").focus(function () {
    $("#inputRdsPasswd").removeClass("border-red");
    $(".error10").hide();
});


/*数据库名栏失去焦距*/
$("#inputRdsPasswd").blur(function(){
    checkPassword();
});
function checkPassword(){
    var passwdRegExp = /^([!-~]{0,50}|Encrypted [0-9A-Za-z]*)$/;
    var passwd = $("#inputRdsPasswd").val();

    if(!passwdRegExp.test(passwd)) {
        $("#inputRdsPasswd").addClass("border-red");
        $(".error10").html("*密码不能包含特殊符号，长度在50字符以下，可以为空");
        $(".error10").css("display", "block");
        preventDefaultFlag = true;
    };
};
/*表用户栏获取焦点*/
$("#tableUser").focus(function () {
    if( $("#tableUser").val()=="")
    {
        $("#tableUser").removeClass("border-red");
        $(".error12").hide();
    }
});

/*数据库名栏失去焦距*/
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
$("#hasDBA").click(function() {
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
