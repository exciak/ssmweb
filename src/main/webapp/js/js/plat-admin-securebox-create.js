/**
 * Created by Administrator on 2015/7/2.
 */
/* 修改和删除操作的索引值 */

preventDefaultFlag=false;

$(document).ready(function () {

});
$("#sureBox").click(function(){
    if($("#sureBox").prop("checked")){
        $("#btn_commitCreateInfo").attr("disabled",false);
    }else{
        $("#btn_commitCreateInfo").attr("disabled",true);
    }
});
//提交测试信息
$("#btn_detectCreateInfo").click(function () {
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
    var description = $("#inputDescription").attr("value") + "";
    var type = $("#selectTypeCreate").children('option:selected').val();
    var orgId = $("#provideDeptId").val();
    var endpointId = $("#selectEndPointCreate").children('option:selected').val();
    var baseProjectName =$("#inputBaseProject").attr("value");
    var project= $("#inputProject").attr("value");
    var owner = $("#inputOwner").attr("value");
    var accessId = $("#inputAccessID").attr("value");
    var accessKey = $("#inputAccessKey").attr("value");

    $.post("securebox_detect",
        {
            name: name,
            description:description,
            type:type,
            orgId:orgId,
            endpointId: endpointId,
            project:project,
            baseProjectName:baseProjectName,
            owner:owner,
            accessId: accessId,
            accessKey: accessKey
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
    preventDefaultFlag = false;
    createCheckAll();
    if(preventDefaultFlag == true) {
        return ;
    }
    $("#btn_commitCreateInfo").attr("disabled",true);
    var name = $("#inputName").attr("value") + "";
    var description = $("#inputDescription").attr("value") + "";
    var type = $("#selectTypeCreate").children('option:selected').val();
    var orgId = $("#provideDeptId").val();
    var endpointId = $("#selectEndPointCreate").children('option:selected').val();
    var baseProjectName =$("#inputBaseProject").attr("value");
    var project= $("#inputProject").attr("value");
    var owner = $("#inputOwner").attr("value");
    var accessId = $("#inputAccessID").attr("value");
    var accessKey = $("#inputAccessKey").attr("value");

    $.post("securebox_create",
        {
            name: name,
            description:description,
            type:type,
            orgId:orgId,
            endpointId: endpointId,
            project:project,
            baseProjectName:baseProjectName,
            owner:owner,
            accessId: accessId,
            accessKey: accessKey
        },
        function (data, status) {
            if (data.result == "success") {
                location.href = "securebox";
            } else {
                $("#btn_commitCreateInfo").attr("disabled",false);
                dmallError(data.result);
            }
        },
        "json");
});

function createCheckAll(){
    checkName();
    checkBaseProject();
    checkProject();
    checkAccessID();
    checkAccessKey();
    checkOwner();
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

/*名称栏获取焦距*/
$("#inputOwner").focus(function () {
    var string = $("#inputOwner").val();
    if(string == "") {
        $("#inputOwner").removeClass("border-red");
        $(".error6").hide();
    }
});

/*名称栏失去焦距*/
$("#inputOwner").blur(function(){
    checkOwner();
});
function checkOwner(){
    var string = $("#inputOwner").val();
    if(string == "") {
        $("#inputOwner").addClass("border-red");
        $(".error6").html("*请输入Owner 账号");
        $(".error6").css("display", "block");
        preventDefaultFlag = true;
    }
};

/*Tunnel End Point栏获取焦距*/
$("#inputTunnelPort").focus(function () {
    if( $("#inputTunnelPort").val()=="")
    {
        $("#inputTunnelPort").removeClass("border-red");
        $(".error2").hide();
    }
});

/*Tunnel End Point栏失去焦距*/
$("#inputTunnelPort").blur(function(){
    checkTunnelEndPoint();
});
function checkTunnelEndPoint(){
    if( $("#inputTunnelPort").val()=="")
    {
        $("#inputTunnelPort").addClass("border-red");
        $(".error2").html("*请输入Tunnel End Point");
        $(".error2").css("display", "block");
        preventDefaultFlag = true;
    }
};


/*Base Project栏获取焦距*/
$("#inputBaseProject").focus(function () {
    if( $("#inputBaseProject").val()=="")
    {
        $("#inputBaseProject").removeClass("border-red");
        $(".error7").hide();
    }
});

/*Base Project栏失去焦距*/
$("#inputBaseProject").blur(function(){
    checkBaseProject();
});
function checkBaseProject(){
    if( $("#inputBaseProject").val()=="")
    {
        $("#inputBaseProject").addClass("border-red");
        $(".error7").html("*请输入Base项目名称");
        $(".error7").css("display", "block");
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

//数据资源提供单位
var $provideDeptName = $('#provideDeptName');
var provideDeptId = $('#provideDeptId').val();
var provideDeptName = $provideDeptName.val();
$('#chooseProvideDept').click(function () {
    $provideDeptName.removeClass("errorC");
    $('.errorProvideDept').hide();
    openProvideDept();
});

function openProvideDept() {
    //打开模态框
    $('#addProvideDept').modal({backdrop: 'static', keyboard: false});
    /*数据资源提供单位*/
    getProvideDeptList();
}

//获取数据资源提供单位
var pageNum = 1;
var pageSize = 7;
var pages = 0;
var $provideDeptTree;
function getProvideDeptList() {
    $.get(rootPath + "/department/tree", {},
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                $provideDeptTree = $('#list-provideDept').treeview({
                    data: data.department_list,
                    onNodeSelected: function (event, node) {
                        var $provideDeptList = $("#provideDeptName");
                        $provideDeptList.data("provideDeptId", node.id);
                        $provideDeptList.data("provideDeptName", node.text);
                    }
                });
                // var list = $('#list-provideDept').children().children();
                // pages =Math.ceil(list.length/pageSize);
                // for (var i=0; i < list.length; i++){
                //     for (var j=0; j<pages; j++){
                //
                //     }
                // }
            } else {
                dmallError("获取数据资源提供单位列表失败");
            }
        },
        "json"
    );
}
//数据资源提供单位提交
$("#provideDept_btn_commit").click(function () {
    provideDeptId = $provideDeptName.data('provideDeptId');
    provideDeptName = $provideDeptName.data('provideDeptName');
    $("#provideDeptId").val(provideDeptId);
    $("#provideDeptName").val(provideDeptName);
});
//数据资源提供单位验证
function checkProvideDeptNameValue() {
    if($('#provideDeptName').val()){
        return false;
    }else {
        checkNotBlank($('#provideDeptName'),$('.errorProvideDept'),'*请选择数据资源提供单位');
        return true;
    }
}
//非空验证
function checkNotBlank($select,$errorClass,errorMsg){
    var str = $select.val();
    if (str == "") {
        $select.addClass("errorC");
        $errorClass.html(errorMsg);
        $errorClass.css("display", "block");
        return true;
    } else {
        $select.removeClass("errorC");
        $errorClass.hide();
        return false;
    }
}
