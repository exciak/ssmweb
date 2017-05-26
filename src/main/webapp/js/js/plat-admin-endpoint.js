/**
 * Created by Administrator on 2015/7/2.
 */
/* 修改和删除操作的索引值 */
var dbOpRowIndex = 0;
var curPageNumber = 0;
var preventDefaultFlag = false;
var preventDefaultFlag2 = false;

$(document).ready(function () {
    var $createButton = $("#createButton");
    var $selectAll = $("#selectAll");
    var $deleteButton = $("#deleteButton");
    var $ids = $("#allEndpointTable input[name='ids']");
    var $contentRow = $("#allEndpointTable tr:gt(0)");
    var $filter = $("#btn_filter");
    var $clear = $("#btn_clear");

    /* 需要注意清空绑定关联值 */
    $clear.click(function () {
        inputFilterName.value = "";
        inputFilterEndpoint.value = "";
    });

    $("#sureBox").click(function(){
        if($("#sureBox").prop("checked")){
            $("#btn_commitCreateInfo").attr("disabled",false);
        }else{
            $("#btn_commitCreateInfo").attr("disabled",true);
        }
    });

    $("#sureModifyBox").click(function(){
        if($("#sureModifyBox").prop("checked")){
            $("#btn_commitModifyInfo").attr("disabled",false);
        }else{
            $("#btn_commitModifyInfo").attr("disabled",true);
        }
    });
});

function createData(obj, pageNumber){
    curPageNumber = pageNumber;
    $('#createModal').modal({backdrop: 'static', keyboard: false});
    var createModal = "createModal";
    emptyModal(createModal);
}

function deleteBulkData(obj,pageNumber){
    curPageNumber = pageNumber;
    $('#deleteBulkModal').modal({backdrop: 'static', keyboard: false});
}

function deleteData(obj, id, pageNumber){
    dbOpRowIndex = id;
    curPageNumber = pageNumber;
    $('#deleteModal').modal({backdrop: 'static', keyboard: false});
}

function modifyData(obj, id, pageNumber){
    var tds=$(obj).parent().parent().find('td');

    dbOpRowIndex = id;
    curPageNumber = pageNumber;

    $('#inputModifyName').val(tds.eq(0).text());
    $('#inputModifyValue').val(tds.eq(1).text());
    $('#inputModifyTunnel').val(tds.eq(2).text());
    $('#inputModifyDescription').val(tds.eq(3).text());


    /* js给模态框传值方法，赋值模态框属性，前台对应代码<button id="btn_commitModifyInfo" type="button" data-id=$val['id'] >提交</button> */
    /*$('#btn_commitModifyInfo').attr('data-id', id);*/

/*    $('#modifyModal').modal('show');*/
    $("input").removeClass("border-red");
    $("#modifyModal .text-danger").hide();
    $('#modifyModal').modal({backdrop: 'static', keyboard: false});
}
/*群组名称栏获取焦距*/
$("#inputName").focus(function () {
    var string = $("#inputName").val();
    var ret = inputCheckName(string);
    if(!ret)
    {
        $("#inputName").removeClass("border-red");
        $(".error1").hide();
    }
});

/*endpoint名称栏失去焦距*/
function checkCreateName(){
    var string = $("#inputName").val();
    var ret = inputCheckName(string);
    if(!ret)
    {
        $("#inputName").addClass("border-red");
        $(".error1").html("*请输入End Point名称，由中文、字母、数字、下划线组成，1-64个字符");
        $(".error1").css("display", "block");
        preventDefaultFlag = true;
    }
};
$("#inputName").blur(function(){
    checkCreateName();
});
/*value获取焦距*/
$("#inputValue").focus(function () {
    if( $("#inputValue").val()=="") {
        $("#inputValue").removeClass("border-red");
        $(".error2").hide();
    }
});
/*endpoint value栏失去焦距*/
function checkCreateValue(){
    if( $("#inputValue").val()=="") {
        $("#inputValue").addClass("border-red");
        $(".error2").html("*请输入End Point取值");
        $(".error2").css("display", "block");
        preventDefaultFlag = true;
    }
};
$("#inputValue").blur(function(){
    checkCreateValue();
});

/*tunnel获取焦距*/
$("#tunnel").focus(function () {
    if( $("#tunnel").val()=="") {
        $("#tunnel").removeClass("border-red");
        $(".error5").hide();
    }
});
/*tunnel栏失去焦距*/
function checkTunnel(){
    if( $("#tunnel").val()=="") {
        $("#tunnel").addClass("border-red");
        $(".error5").html("*请输入Tunnel End Point取值");
        $(".error5").css("display", "block");
        preventDefaultFlag = true;
    }
};
$("#tunnel").blur(function(){
    checkTunnel();
});

/*tunnel获取焦距*/
$("#inputModifyTunnel").focus(function () {
    if( $("#inputModifyTunnel").val()=="") {
        $("#inputModifyTunnel").removeClass("border-red");
        $(".error6").hide();
    }
});
/*tunnel栏失去焦距*/
function checkModifyTunnel(){
    if( $("#inputModifyTunnel").val()=="") {
        $("#inputModifyTunnel").addClass("border-red");
        $(".error6").html("*请输入Tunnel End Point取值");
        $(".error6").css("display", "block");
        preventDefaultFlag2 = true;
    }
};
$("#inputModifyTunnel").blur(function(){
    checkModifyTunnel();
});
/*修改endpoint名称栏获取焦距*/
$("#inputModifyName").focus(function () {
    if( $("#inputModifyName").val()=="")
    {
        $("#inputModifyName").removeClass("border-red");
        $(".error3").hide();
    }
});

/*修改endpoint名称栏失去焦距*/
function checkModifyName(){
    var string = $("#inputModifyName").val();
    var ret = inputCheckName(string);
    if(!ret || string == "")
    {
        $("#inputModifyName").addClass("border-red");
        $(".error3").html("*请输入End Point名称，由中文、字母、数字、下划线组成，1-64个字符");
        $(".error3").css("display", "block");
        preventDefaultFlag2 = true;
    }
};
$("#inputModifyName").blur(function(){
    checkModifyName();
});

/*修改endpoint value获取焦距*/
$("#inputModifyValue").focus(function () {
    if( $("#inputModifyValue").val()=="")
    {
        $("#inputModifyValue").removeClass("border-red");
        $(".error4").hide();
    }
});

/*群组描述栏失去焦距*/
function checkModifyValue(){
    if( $("#inputModifyValue").val()=="")
    {
        $("#inputModifyValue").addClass("border-red");
        $(".error4").html("*请输入End Point取值");
        $(".error4").css("display", "block");
        preventDefaultFlag2 = true;
    }
};
$("#inputModifyValue").blur(function(){
    checkModifyValue();
});
function createCheckAll(){
    checkCreateName();
    checkCreateValue();
    checkTunnel();
}

function modifyCheckAll(){
    checkModifyName();
    checkModifyValue();
    checkModifyTunnel();
}
//提交创建信息
$("#btn_commitCreateInfo").click(function () {
    preventDefaultFlag=false;

    createCheckAll();
    if(preventDefaultFlag==true)
    {
        return false;
    }
    else {
        $("#btn_commitCreateInfo").attr('disabled', true);

        $.post("../endpoint/create",
            {
                name: $("#inputName").attr("value"),
                description: $("#inputDescription").attr("value"),
                endpoint: $("#inputValue").attr("value"),
                tunnel: $("#tunnel").attr("value")
            },
            function (data, status) {
                if (data.result == "success") {
                    location.href = "endpoint?" + "&name=" + $("#inputHiddenFilterName").attr("value")
                        + "&endpoint=" + $("#inputHiddenFilterEndpoint").attr("value")
                        + "&pageNumber=" + curPageNumber;
                } else {
                    dmallError(data.result);
                    $("#btn_commitCreateInfo").attr('disabled', false);
                }
            },
            "json");
    }
});

//提交修改信息
$("#btn_commitModifyInfo").click(function () {
    preventDefaultFlag2=false;
    modifyCheckAll();
    if(preventDefaultFlag2==true)
    {
        return false;
    }

    $("#btn_commitModifyInfo").attr('disabled',true);

    $.post("../endpoint/modify",
        {
            index:dbOpRowIndex,
            name: $("#inputModifyName").attr("value"),
            description:$("#inputModifyDescription").attr("value"),
            endpoint: $("#inputModifyValue").attr("value"),
            tunnel: $("#inputModifyTunnel").attr("value")
        },
        function (data, status) {
            if (data.result  == "success") {
                location.href = "endpoint?" + "&name=" + $("#inputHiddenFilterName").attr("value")
                + "&endpoint=" + $("#inputHiddenFilterEndpoint").attr("value")
                + "&pageNumber=" + curPageNumber;
            } else {
                dmallError(data.result);
                $("#btn_commitModifyInfo").attr('disabled',false);
            }
        },
        "json");
});

//提交删除信息
$("#btn_commitDeleteInfo").click(function () {
    $.post("../endpoint/delete",
        {
            index:dbOpRowIndex
        },
        function (data, status) {
            if (data.result == "success") {
                location.href = "endpoint?" + "&name=" + $("#inputHiddenFilterName").attr("value")
                + "&endpoint=" + $("#inputHiddenFilterEndpoint").attr("value")
                + "&pageNumber=" + curPageNumber;
            } else {
                dmallError(data.result);
            }
        },
        "json");
});
