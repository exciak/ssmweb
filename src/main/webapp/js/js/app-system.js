/**
 * Created by miaomz on 2017/3/1.
 */
var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];
var rootPath = "http://" + window.location.host + "/" + proName;
/* 修改和删除操作的索引值 */
var dbOpRowIndex = 0;
var curPageNumber = 0;
var preventDefaultFlag = false;

$(document).ready(function () {
    var $clear = $("#btn_clear");

    /* 需要注意清空绑定关联值 */
    $clear.click(function () {
        $("#appNo").val('');
        $("#appName").val('');
        $("#startTime").val('');
        $("#endTime").val('');
    });
});

function deleteBulkData(obj,pageNumber){
    curPageNumber = pageNumber;
    $('#deleteBulkModal').modal({backdrop: 'static', keyboard: false});
}

function deleteData(obj, id, pageNumber){
    dbOpRowIndex = id;
    curPageNumber = pageNumber;
    $('#deleteModal').modal({backdrop: 'static', keyboard: false});
}

// //打开删除模态框
// $("#btn_commitIsLinkedInfo").click(function () {
//     $('#deleteModal').modal({backdrop: 'static', keyboard: false});
// });

//提交删除信息
$("#btn_commitDeleteInfo").click(function () {
    $.post(rootPath+"/appsystems/delete/"+dbOpRowIndex,
        function (data, status) {
            if (data.result == "success") {

                location.href = "../dmall/appsystems?" + "&appNo=" + $("#appHiddenNo").attr("value")
                    + "&appName=" + $("#appHiddenName").attr("value")
                    + "&startTime=" + $("#startHiddenTime").attr("value")
                    + "&endTime=" + $("#endHiddenTime").attr("value");
                    // + "&pageNumber=" + curPageNumber;
            } else {
                dmallError(data.result);
            }
        },
        "json");
});

//上报应用
function reportAppSystems() {

    var ids="";
    var len = $("#dataTable tr").length;
    for(var i=0;i<len;i++){
        var v = ",";
        if($("#dataTable tr").eq(i).find("td").eq(0).find("input").prop("checked")){
            if(i==len-1){
                v = "";
            }
            ids =ids+$("#dataTable tr").eq(i).find("td").eq(0).find("input").val()+v;
        }
    }
    if(ids=="," || ids==""){

        dmallError("请先选择要上报的应用系统");
        return false;
    }
    console.log(ids);
    $.get(rootPath+"appsystems/appSystemSender",
        {
            ids: ids,
        },
        function (data, status) {
            if (data.result == "success") {
                // location.href =
            } else {
                dmallError(data.result);
            }

        },
        "json");
}
