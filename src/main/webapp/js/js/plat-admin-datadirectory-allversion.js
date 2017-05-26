function conpareDiretory() {
    var len = $("#dataTable tr").length;
    var selectLen = 0;
    var ids = "";
    for(var i = 0;i < len;i++){
        if($("#dataTable tr").eq(i).find("td").eq(0).find("input").prop("checked")){
            selectLen++;
            var id = $("#dataTable tr").eq(i).find("td").eq(0).find("input").val();
            if(ids == ""){
                ids =ids+id;
            }else{
                ids = ids+","+id;
            }
        }
    }
    $(".notifications ").empty();
    if(selectLen == 0){
        dmallError("请先选择数据目录再进行比较");
    }else if(selectLen !=2){
        dmallError("请选择两个数据目录进行比较");
    }else{
        location.href = rootPath+"/directory/datadirectory/compare?datadirectoryids="+ids;
    }
}