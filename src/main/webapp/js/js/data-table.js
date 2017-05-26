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
        $("#dataTableNo").val('');
        $("#dataTableName").val('');
        $("#startTime").val('');
        $("#endTime").val('');
    });
});

function deleteBulkData(obj,pageNumber){
    curPageNumber = pageNumber;
    $('#deleteBulkModal').modal({backdrop: 'static', keyboard: false});
}
function deleteData(obj, id, pageNumber, dataTableNo){
    dbOpRowIndex = id;
    curPageNumber = pageNumber;
    $.ajax({
        type: "GET",
        url: rootPath+"/appsystems/isLinked?preDataTableItemNo=" + dataTableNo,
        dataType: "json",
        success: function (data) {
            if (data.result = "success") {
                if (data.isUse) {
                    $('#isLinkedModal').modal({backdrop: 'static', keyboard: false});
                } else {
                    $('#deleteModal').modal({backdrop: 'static', keyboard: false});
                }
            } else {
                dmallError(data.result);
            }
        },
        error: function () {
            dmallAjaxError();
        }
    })
}

//打开删除模态框
$("#btn_commitIsLinkedInfo").click(function () {
    $('#deleteModal').modal({backdrop: 'static', keyboard: false});
});

//提交删除信息
$("#btn_commitDeleteInfo").click(function () {
    $.post(rootPath+"/appsystems/datatable/delete/"+dbOpRowIndex,
        function (data, status) {
            if (data.result == "success") {
                location.href = rootPath+"/appsystems/datatables?" + "&dataTableNo=" + $("#dataTableHiddenNo").attr("value")
                    + "&dataTableName=" + $("#dataTableHiddenName").attr("value")
                    + "&startTime=" + $("#startHiddenTime").attr("value")
                    + "&endTime=" + $("#endHiddenTime").attr("value");
                    // + "&pageNumber=" + curPageNumber;
            } else {
                dmallError(data.result);
            }
        },
        "json");
});
