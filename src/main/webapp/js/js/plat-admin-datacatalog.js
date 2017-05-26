/**
* Created by Administrator on 2015/7/2.
*/
/* 修改和删除操作的索引值 */
var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];
var rootPath = "http://" + window.location.host + "/" + proName;


var dbOpRowIndex = 0;
var curPageNumber = 0;
var preventDefaultFlag = false;
var preventDefaultFlag2 = false;
var id=$("#directoryId").val();

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
    $("#directoryNo").val("");
    $("#directoryName").val("");
    $("#directoryStartTime").val("");
    $("#directoryEndTime").val("");
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

// function createData(){
//     location.href = "../directory/datadirectory"
// }

function deleteBulkData(obj,pageNumber){
curPageNumber = pageNumber;
$('#deleteBulkModal').modal({backdrop: 'static', keyboard: false});
}

// function deleteData(obj, id, pageNumber){
//     dbOpRowIndex = id;
//     curPageNumber = pageNumber;
//     $.get(rootPath + "/dept/content/checkDirectory", {
//             id:dbOpRowIndex
//         },
//         function (data) {
//             if (data.result == "true") {
//                 console.log("in");
//                 $('#deleteModal1').modal({backdrop: 'static', keyboard: false});
//                 $("#btn_commitDeleteInfo1").click(function () {
//                     $.post("../directory/datadirectory/delete/"+dbOpRowIndex,
//                         function (data, status) {
//                             if (data.result == "success") {
//                                 location.href =  "http://" + window.location.host + "/dmall/" +"plat_admin/datadirectorys" + "?directoryNo=" + $("#directoryNo").attr("value")
//                                     + "&directoryName=" + $("#directoryName").attr("value") +"&startTime=" + $("#directoryStartTime").attr("value")+ "&endTime=" + $("#directoryEndTime").attr("value");
//                             } else {
//                                 dmallError(data.result);
//                             }
//                         },
//                         "json");
//                 })
//             } else {
//                 $('#deleteModal').modal({backdrop: 'static', keyboard: false});
//             }
//         },
//         "json"
//     );
//
//     // $('#deleteModal').modal({backdrop: 'static', keyboard: false});
// }
function deleteData(obj, id, pageNumber) {
    dbOpRowIndex = id;
    curPageNumber = pageNumber;
    $.get(rootPath + "/dept/content/checkDirectory", {
            id:id
        },
        function (data) {
            if (data.result == "false") {
                $('#deleteModal').modal({backdrop: 'static', keyboard: false});
            }else {
                $(".notifications ").empty();
                dmallError("删除失败：数据目录已与数据编目关联");
            }
    })

}

$("#btn_commitDeleteInfo").click(function () {
    var len = $("#dataTable tr").length;
    var pageNum = $("#pageNum").val();
    if(len == 1 && pageNum != 1){
        pageNum = pageNum-1;
    }
    $.post("../directory/datadirectory/delete/" + dbOpRowIndex,
        function (data, status) {
            if (data.result == "success") {
                location.href = "http://" + window.location.host + "/dmall/" + "plat_admin/datadirectorys" + "?directoryNo=" + $("#directoryNo").attr("value")
                    + "&directoryName=" + $("#directoryName").attr("value") + "&startTime=" + $("#directoryStartTime").attr("value") + "&endTime=" + $("#directoryEndTime").attr("value")
                    + "&pageNumber=" + pageNum;
            } else {
                $(".notifications").empty();
                dmallError(data.result);
            }
        },
        "json");

})





function modifyData(obj, id, pageNumber){
    var tds=$(obj).parent().parent().find('td');
    dbOpRowIndex = id;
    location.href = "../directory/datadirectory/"+id;

// curPageNumber = pageNumber;
//
// $('#itemNo').val(tds.eq(0).text());
// $('#itemName').val(tds.eq(1).text());
// $('#industryCode').val(tds.eq(4).text());
// $('#businessCode').val(tds.eq(5).text());
// $('#data1stCode').val(tds.eq(6).text());
// $('#data2ndCode').val(tds.eq(7).text());
// $('#dataDetailCode').val(tds.eq(8).text());
// $('#dataPropertyCode').val(tds.eq(9).text());
// $('#dataDesc').val(tds.eq(2).text());
//
// /* js给模态框传值方法，赋值模态框属性，前台对应代码<button id="btn_commitModifyInfo" type="button" data-id=$val['id'] >提交</button> */
// /*$('#btn_commitModifyInfo').attr('data-id', id);*/
//
// /*    $('#modifyModal').modal('show');*/
// $("input").removeClass("border-red");
// $("#modifyModal .text-danger").hide();
// $('#modifyModal').modal({backdrop: 'static', keyboard: false});
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



