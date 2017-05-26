/**
 * Created by Administrator on 2015/7/2.
 */
/* 修改和删除操作的索引值 */
/*var dbOpRowIndex = 0;
var curPageNumber = 0;*/
/*var dbaccessUrl = "dbaccess";*/

/*function dbaccessFilter() {
    return ("?name=" + $("#inputFilterName").attr("value")
    + "&type=" + $("#selectFilter").children('option:selected').val()
    + "&pageNumber=" + curPageNumber + "");
}*/


var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];

var preventDefaultFlag = false;
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
    var type = "PLUS&COMMON";
    //var gateuuid = $("#selectDxtModify").data("gateuuid");
    var is_sync = "ASYNC";
    var tableUser = "";
    var tableUserPassword = "";
    var hasDBA = true;
    var pubUser = "";
    var pubUserPassword = "";
    var subUser = "";
    var subUserPassword = "";

    preventDefaultFlag=false;
    modifyCheckAll();
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

    hostname = $("#inputModifyInstance").attr("value");
    port = $("#inputModifyPort").attr("value");
    project_db = $("#inputModifyDbName").attr("value");
    accessID = $("#inputModifyUser").attr("value");
    accessKey = $("#inputModifyPassword").attr("value");

    $.post("/" + proName + "/dbaccess/modify_detect",
        {
            index:index,
            name: name,
            description: description,
            type: type,
            //gateuuid: gateuuid,
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
    var enableOption = false;
    var createPLUS = false;
    var type = "PLUS&COMMON";
    //var gateuuid = $("#selectDxtModify").data("gateuuid");
    var is_sync = "ASYNC";
    var tableUser = "";
    var tableUserPassword = "";
    var hasDBA = true;
    var pubUser = "";
    var pubUserPassword = "";
    var subUser = "";
    var subUserPassword = "";
    preventDefaultFlag = false;
    modifyCheckAll();
    if(preventDefaultFlag == true)
    {
        return ;
    }
    $("#btn_commitModifyInfo").attr("disabled",true);
    var index = $("#inputModifyID").attr("value");
    var name = $("#inputModifyName").attr("value");
    var description = $("#inputModifyDescription").attr("value");
    var destOrgId = $("#selectOrgModify").data("departmentid");

    var hostname = $("#inputModifyInstance").attr("value");
    var port = $("#inputModifyPort").attr("value");
    var project_db = $("#inputModifyDbName").attr("value");
    var accessID = $("#inputModifyUser").attr("value");
    var accessKey = $("#inputModifyPassword").attr("value");

    if ($("#inputEnableOption").attr("checked") == "checked") {
        enableOption = true;
    }

    if($("#inputCreatePLUS").attr("checked") == "checked") {
        createPLUS = true;
    }

    $.post("/" + proName + "/dbaccess/modify",
        {
            index:index,
            name: name,
            description: description,
            type: type,
            //gateuuid: gateuuid,
            project_db: project_db,
            port:port,
            hostname: hostname,
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
            if(data.result == "success"){
                location.href = "../database";
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
function modifyCheckAll(){
    checkName();
    checkInstance();
    checkDbName();
    checkPort();
    checkUser();
}

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
