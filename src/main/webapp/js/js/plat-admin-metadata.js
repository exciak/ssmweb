/**
 * Created by DD on 2016/5/19.
 */

$(document).ready(function(){
//打开添加类目弹出框
    $("#addDataStandard").click(function(){
        emptyModal("addDataStandardModal");
        $('#addDataStandardModal').modal({backdrop: 'static', keyboard: false});
        $.get("../metadata/category",{},
            function (data, status) {
                if (data.result == "success" && status == "success") {
                    $("#dataStandardList").empty();
                    if (!data.metadataCategory) {
                        dmallError("没有获取到数据元类目信息");
                    } else {
                        var baseOption = new Option("请选择","");
                        $("#dataStandardList").append(baseOption);
                        for (var i = 0; i < data.metadataCategory.length; i++) {
                            var table = data.metadataCategory[i];
                            var newOption = new Option(table.title, table.code);
                            $("#dataStandardList").append(newOption);
                        }
                    }
                } else {
                    dmallError(data.result);
                }
            },
            "json"
        );
    });
    //提交修改
    $("#commitBtn").click(function(){
        var url = "";
        var data = {};
        var code=$("#dataStandardList option:selected").val();
        var name=$("#dataStandardList option:selected").text();
        if(!checkSelect()) {
            return false;
        }
        if(!checkOnly()){
            return false;
        }


        $("#commitBtn").attr('disabled', true);
        url = "../metadata/metadata_category";
        data.metadataCategoryCode = code;
        data.metadataCategoryName = name;
        $.post(url, data,
            function (data, status) {
                if (data.result != "success") {
                    dmallError(data.result);
                    $("#commitBtn").attr('disabled', false);
                } else {
                    location.href = window.location.href;
                }
            },
            "json");
    });
    ////////////只用传id
    //删除类目
    $("#delBtn").click(function(){
        var id = $("#delDataStandardModal").data("id");
        $.post("../metadata/delete",
            {
                id:id
            },
            function (data, status) {
                if (data.result != "success") {
                    dmallError(data.result);
                } else {
                    location.href = window.location.href;
                }
            },
            "json");
    });
    $("#dataStandardList").focus(function(){
        $("#dataStandardList").removeClass("border-red");
        $("#emptyDataStandard").addClass("hidden");
        $("#errorDataStandard").addClass("hidden");
    })
});
//选择不能为空
function checkSelect() {

    if ($("#dataStandardList option:selected").val() == ""||$("#dataStandardList option:selected").val() == null) {
        $("#dataStandardList").addClass("border-red");
        $("#emptyDataStandard").removeClass("hidden");
        $("#emptyDataStandard").css("display", "block");
        return false;
    } else {
        $("#dataStandardList").removeClass("border-red");
        $("#emptyDataStandard").addClass("hidden");
        return true;
    }
}
//选择类目不能重复
function checkOnly(){
    var option = $("#dataStandardList option:selected").val();
    var listTable=document.getElementById('listTable');
    var trs = listTable.rows;
    for(var i = 1; i < trs.length; i++){
        var tds = trs[i].cells;
            if(tds[0].innerHTML == option){
                $("#dataStandardList").addClass("border-red");
                $("#errorDataStandard").removeClass("hidden");
                $("#errorDataStandard").css("display", "block");
                return false;
            }
    }
    $("#dataStandardList").removeClass("border-red");
    $("#errorDataStandard").addClass("hidden");
    return true;
}
//删除类目
////参数为类目id
function delDataStandard(id){
    $('#delDataStandardModal').modal({backdrop: 'static', keyboard: false});
    $('#delDataStandardModal').data("id",id);
}
