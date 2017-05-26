/**
 * Created by xunzhi on 2015/9/14.
 */

/* 修改和删除操作的索引值 */
var dbOpRowIndex = 0;
var curPageNumber = 0;
var secureBoxUrl = "securebox";

function secureBoxFilter() {
    return ("?name=" + $("#inputFilterName").attr("value")
    + "&org=" + $("#selectFilterOrg").children('option:selected').val()
    + "&pageNumber=" + curPageNumber + "");
}

$(document).ready(function () {
    var $selectFilterOrg = $("#selectFilterOrg");
    var $clear = $("#btn_clear");

    /* 需要注意清空绑定关联值 */
    $clear.click(function () {
        inputFilterName.value = "";
        $selectFilterOrg.val("ALL");
        /*        $("#selectFilterType option[text='全部']").attr("selected", true);
         $("#selectFilterOrg option[text='全部']").attr("selected", true);*/
        inputHiddenFilterName.value = "";
        inputHiddenFilterOrg.value = "ALL";
    });

    //提交批量删除信息
    $("#btn_commitDeleteBulkInfo").click(function(){
        var idArr = [];
        var id = $('#deleteBulkModal').data("id");
        idArr.push(id);
        $.ajax({
            url:"securebox_delete",
            type:"POST",
            data:{indexList:idArr},
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    location.href = secureBoxUrl + secureBoxFilter();
                }else {
                    dmallError(data.result);
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });
    });

});

//删除安全空间
function doDel(id,page){
    $('#deleteBulkModal').modal({backdrop: 'static', keyboard: false});
    $('#deleteBulkModal').data("id",id);
    curPageNumber = page;
}


function detectConnect(obj, index){
    $("#testButton"+index).html("测试中...");
    $("#testButton"+index).removeAttr('onclick');
    $.post("securebox_detect_byid",
        {
            id:index
        },
        function (data, status) {
            if(data.result == "success"){
                dmallNotify(data.message)
            }else{
                dmallError(data.message);
            }
            $("#testButton"+index).html("测试");
            $("#testButton"+index).attr('onclick', 'detectConnect(this, '+index+');');
        },
        "json");
}