//批量导出
//批量导出
function exportDiretory() {
    var ids="";
    var len = $("#listTable tr").length;
    var flag = false;
    for(var i=0;i<len;i++){
        var v = "";
        if($("#listTable tr").eq(i).find("td").eq(0).find("input").prop("checked")){
            if(flag){
                v = ",";
            }
            ids =ids+v+$("#listTable tr").eq(i).find("td").eq(0).find("input").val();
            flag = true;
        }
    }
    if(ids=="," || ids==""){
        dmallError("请先选择要导出的数据资源");
        return false;
    }

    document.getElementById("form1").setAttribute("action",rootPath+"/excel/export/CSCatalogs");
    document.getElementById("form1").setAttribute("method","POST");
    $("#idStr").val(ids);
    document.getElementById("form1").submit();
    return true;

}