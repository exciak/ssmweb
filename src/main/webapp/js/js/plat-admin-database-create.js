/**
 * Created by Administrator on 2015/7/2.
 */
/* 修改和删除操作的索引值 */
var dbOpRowIndex = 0;
var curPageNumber = 0;
var dbaccessUrl = "../dbaccess";
var preventDefaultFlag = false;

var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];

$(document).ready(function () {

    $("#selectTypeCreate").change(function () {
        //$("#dbDetail").html("数据类型：" + dbType);
        selectCreateChange();
    });
});

//提交测试信息
$("#btn_detectCreateInfo").click(function () {
    var type = "PLUS&COMMON";
    var is_sync = "ASYNC";
    var tableUser = "";
    var tableUserPassword = "";
    var hasDBA = true;
    var pubUser = "";
    var pubUserPassword = "";
    var subUser = "";
    var subUserPassword = "";
    var name = $("#inputName").val();

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

    var hostname = $("#inputRdsInstance").attr("value");
    var project_db = $("#inputRdsdbName").attr("value");
    var accessID = $("#inputRdsUser").attr("value");
    var accessKey = $("#inputRdsPasswd").attr("value");
    var port = $("#inputRdsPort").attr("value");

    $.post("/" + proName + "/dbaccess/create_detect",
        {
            name: name,
            type: type,
            //gateuuid: gateuuid,
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
    var enableOption = false;
    var createPLUS = false;
    var is_sync = "ASYNC";
    var tableUser = "";
    var tableUserPassword = "";
    var hasDBA = true;
    var pubUser = "";
    var pubUserPassword = "";
    var subUser = "";
    var subUserPassword = "";
    var type = "PLUS&COMMON";
    var destOrgId = $("#destDept").data("departmentid");
    var name = $("#inputName").val();

    preventDefaultFlag = false;
    createCheckAll(type);
    if(preventDefaultFlag == true)
    {
        return ;
    }
    $("#btn_commitCreateInfo").attr('disabled',true);
    var hostname = $("#inputRdsInstance").attr("value");
    var project_db = $("#inputRdsdbName").attr("value");
    var accessID = $("#inputRdsUser").attr("value");
    var accessKey = $("#inputRdsPasswd").attr("value");
    var port = $("#inputRdsPort").attr("value");

    if ($("#inputEnableOption").attr("checked") == "checked") {
        enableOption = true;
    }

    if($("#inputCreatePLUS").attr("checked") == "checked") {
        createPLUS = true;
    }

    $.post("/" + proName + "/dbaccess/create",
        {
            name: name,
            type: type,
            //gateuuid: gateuuid,
            hostname: hostname,
            port:port,
            project_db:project_db,
            accessID: accessID,
            accessKey: accessKey,
            enableOption: enableOption,
            createPLUS: createPLUS,
            is_sync:is_sync,
            tableUser: tableUser,
            tableUserPassword: tableUserPassword,
            hasDBA: hasDBA,
            pubUser: pubUser,
            pubUserPassword: pubUserPassword,
            subUser: subUser,
            subUserPassword: subUserPassword,
            destOrgId: destOrgId,
            action: "ROLE_PLAT_DBA"
        },
        function (data, status) {
            if (data.result == "success") {
                location.href = "../database";
            } else {
                $("#btn_commitCreateInfo").attr('disabled',false);
                dmallError(data.result);
            }
            //location.href = dbaccessUrl + dbaccessFilter();
        },
        "json");
});

function createCheckAll(type){
    checkName();
    if(type == "0") {
        $("#selectTypeCreate").addClass("border-red");
        preventDefaultFlag = true;
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
