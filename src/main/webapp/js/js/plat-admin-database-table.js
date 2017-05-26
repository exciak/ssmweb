/**
 * Created by pcd on 2016/1/5.
 */

$(document).ready(function () {

    //清除按钮事件绑定
    $('#btn_clear').click(function(){
        $('#inputFilterDepartmentName').val("");
        $('#inputFilterDepartmentArea').val("");
    });
});

//删除数据源
function deleteData(obj, deptId, dbType, dbAccessId){
    $("#deleteModal").modal({backdrop:"static", keyboard: false});
    $("#deleteModal").data("deptId",deptId);
}

$("#btn_commitDeleteInfo").click(function(){
    var deptId = $("#deleteModal").data("deptId");
    $.post("database/delete",
        {
            deptId:deptId
        },
        function (data, status) {
            if(data.result == "success"){
                location.href = "database";
            } else {
                dmallError(data.result);
            }
        },
        "json");
});