/**
 * Created by Administrator on 2015/7/2.
 */
/* 修改和删除操作的索引值 */
var dbOpRowIndex = 0;
var preventDefaultFlag = false;

$(document).ready(function () {


});
//提交测试信息
$("#btn_detectCreateInfo").click(function () {
    var name = "";
    var project_db = "";
    var accessID = "";
    var accessKey = "";
    var endpointLinkId ="";

    preventDefaultFlag = false;
    createCheckAll();
    if(preventDefaultFlag == true)
    {
        return ;
    }
    $("#btn_detectCreateInfo").attr('disabled',true);
    $("#btn_commitCreateInfo").attr('disabled',true);
    var y = document.getElementById("btn_detectCreateInfo");
    y.innerHTML = "测试中...";
    var name = $("#inputName").attr("value") + "";
        project_db = $("#inputProject").attr("value");
        accessID = $("#inputAccessID").attr("value");
        accessKey = $("#inputAccessKey").attr("value");
        endpointLinkId = $("#selectEndPointCreate option:selected").val();


    $.post("../odps_owner/create_detect",
        {
            name: name,
            project_db:project_db,
            accessID: accessID,
            accessKey: accessKey,
            endpointLinkId: endpointLinkId
        },
        function (data, status) {
            if ("success" == data.result) {
                dmallNotify(name + "测试成功");
            } else {
                dmallError(data.result);
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
    preventDefaultFlag = false;
    createCheckAll();
    if(preventDefaultFlag == true)
    {
        return ;
    }
    $("#btn_commitCreateInfo").attr('disabled',true);
    var name = $("#inputName").attr("value") + "";
    var description = $("#inputDescription").attr("value") + "";
    var endpointLinkId = $("#selectEndPointCreate option:selected").val();
    var project_db = $("#inputProject").attr("value");
    var accessID = $("#inputAccessID").attr("value");
    var accessKey = $("#inputAccessKey").attr("value");

    $.post("../odps_owner/create",
        {
            name: name,
            description:description,
            endpointLinkId: endpointLinkId,
            project_db:project_db,
            accessID: accessID,
            accessKey: accessKey
        },
        function (data, status) {
            if (data.result == "success") {
                location.href = "../dept_admin/odps_owner";
            } else {
                $("#btn_commitCreateInfo").attr('disabled',false);
                dmallError(data.result);
            }
        },
        "json");
});

function createCheckAll(){
    checkName();
    checkProject();
    checkAccessID();
    checkAccessKey();
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