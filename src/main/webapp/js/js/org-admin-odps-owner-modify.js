var preventDefaultFlag = false;
//测试修改信息
$("#btn_detectModifyInfo").click(function () {
    var project_db = "";
    var accessID = "";
    var accessKey = "";
    var endpointLinkId = "";

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
    project_db = $("#inputModifyProject").attr("value");
    accessID = $("#inputModifyAccessID").attr("value");
    accessKey = $("#inputModifyAccessKey").attr("value");
    endpointLinkId = $("#selectEndPointModify option:selected").val();

    $.post("../odps_owner/modify_detect",
        {
            index:index,
            name: name,
            description: description,
            endpointLinkId: endpointLinkId,
            project_db: project_db,
            accessID: accessID,
            accessKey: accessKey
        },
        function (data, status) {
            if ("success" == data.result) {
                dmallNotify(name + "测试成功");
            } else {
                dmallError(data.result);
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
    var endpointLinkId = "";

    preventDefaultFlag=false;
    modifyCheckAll();
    if(preventDefaultFlag==true)
    {
        return ;
    }
    var index = $("#inputModifyID").attr("value");
    var name = $("#inputModifyName").attr("value");
    var description = $("#inputModifyDescription").attr("value");
    endpointLinkId = $("#selectEndPointModify option:selected").val();
    project_db = $("#inputModifyProject").attr("value");
    accessID = $("#inputModifyAccessID").attr("value");
    accessKey = $("#inputModifyAccessKey").attr("value");

    $.post("../odps_owner/modify",
        {
            index:index,
            name: name,
            description: description,
            endpointLinkId: endpointLinkId,
            project_db: project_db,
            accessID: accessID,
            accessKey: accessKey
        },
        function (data, status) {
            if(data.result == "success"){
                location.href = "../dept_admin/odps_owner";
            } else {
                dmallError(data.result);
            }
            /* 关闭模态框example */
            /*$('#example').modal('toggle');*/
            //location.href = dbaccessUrl + dbaccessFilter();
        },
        "json");
});
function modifyCheckAll(){
    checkName();
    checkProject();
    checkAccessID();
    checkAccessKey();
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
