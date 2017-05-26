/**
 * Created by Administrator on 2015/7/2.
 */
/* 修改和删除操作的索引值 */
var dbOpRowIndex = 0;
var curPageNumber = 0;
var dbaccessUrl = "dbaccess";
var pathname = window.location.pathname;
var arr = pathname.split("/");
var prjName = arr[1];

function dbaccessFilter() {
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

    $.post("/" + prjName +"/dbaccess/detect",
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

//删除数据源
function deleteData(id){
    $("#deleteModal").modal({backdrop:"static", keyboard: false});
    $("#deleteModal").data("delId",id);
}

$("#btn_commitDeleteInfo").click(function(){
    var id = $("#deleteModal").data("delId");
    $.ajax({
        url:"/" + prjName +"/dbaccess/delete",
        type:"POST",
        data:{index:id},
        dataType:"json",
        success:function(data){
            if (data.result === "success") {
                location.href = dbaccessUrl + dbaccessFilter();
            }else {
                /*var url = dbaccessUrl + dbaccessFilter();
                 dmallNotifyAndLocation(data.result, url);*/
                dmallError(data.result);
            }
        },
        error: function () {
            dmallAjaxError();
        }
    });
});
