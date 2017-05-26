/**
 * Created by Administrator on 2015/7/2.
 */
/* 修改和删除操作的索引值 */
var dbOpRowIndex = 0;
var curPageNumber = 0;
var odpsOwnerUrl = "odps_owner";

function odpsOwnerFilter() {
    return ("?name=" + $("#inputFilterName").attr("value")
    + "&type=" + $("#selectFilterType").children('option:selected').val()
    + "&pageNumber=" + curPageNumber + "");
}

$(document).ready(function () {
    var $inputFilterName = $("#inputFilterName");
    var $selectFilterType = $("#selectFilterType");
    var $clear = $("#btn_clear");

    $clear.click(function () {
        $inputFilterName.val("");
        $selectFilterType.val("ALL");
    });
});

function deleteBulkData(obj,pageNumber){
    curPageNumber = pageNumber;
    $('#deleteBulkModal').modal({backdrop: 'static', keyboard: false});
}

function detectConnect(obj, index){
    $("#testText"+index).text("测试中...");
    $("#testOper"+index).removeAttr('onclick');

    $.post("../odps_owner/detect",
        {
            index:index
        },
        function (data, status) {
            if(data.result == "success"){
                dmallNotify(data.message);
            }else{
                dmallError(data.message);
            }
            $("#testText"+index).text("测试");
            $("#testOper"+index).attr('onclick', 'detectConnect(this, '+index+');');
        },
        "json");
}
//提交删除信息
$("#btn_commitDeleteODPSOwner").click(function () {
    var id = $("#deleteODPSOwnerModal").data("delODPSOwnerId");
    $.post("../odps_owner/delete",
        {
            index:id
        },
        function (data, status) {
            if (status == "success" && (data.result == "success")) {
                /*alert("创建成功");*/
                location.href = odpsOwnerUrl + odpsOwnerFilter();
            } else {
                dmallError(data.result);
                /*alert("创建失败");*/
            }

            /* 关闭模态框example */
            /*$('#example').modal('toggle');*/
        },
        "json");
});

//删除数据源
function deleteOdpsOwner(id){
    $("#deleteODPSOwnerModal").modal({backdrop:"static", keyboard: false});
    $("#deleteODPSOwnerModal").data("delODPSOwnerId",id);
}

