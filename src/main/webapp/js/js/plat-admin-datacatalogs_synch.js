$().ready(function () {
    var ids="";
    var len = $("#dataTable tr").length;
    for(var i = 0;i < len;i++){
        var v = ",";
        if(i==len-1){
            v = "";
        }
        ids =ids+$("#dataTable tr").eq(i).find("td").eq(0).find("input").val()+v;
    }


    $.get(
        rootPath+"/directory/synchlog",
        {
            directoryIds :ids
        },
        function(data, status){
            if(data.result == "success"){
                var synchEntity = data.synchLog;
                for(var i = 0;i < len;i++){
                    var type = synchEntity[i].operationType;
                    var operationType = "";
                    if(type == "UPDATE"){
                        var operationType = "更新";
                    }else if(type == "CREATE"){
                        var operationType = "创建";
                    }else {
                        var operationType = "删除";
                    }
                    var state = synchEntity[i].operationState;
                    var operationState = "";
                    if(state == "synching"){
                        var operationState = "同步中";
                    }else {
                        var operationState = "同步结束";
                    }

                   $("#dataTable tr").eq(i).find("td").eq(5).html("操作类型:"+operationType+";<br/>"+
                   "操作状态:"+operationState+";<br/>"+
                   "操作结果:成功("+synchEntity[i].successCount+"),失败("+synchEntity[i].failCount+
                       "),同步中("+synchEntity[i].synchCount+")")
                    $("#dataTable tr").eq(i).find("td").eq(7).html(synchEntity[i].id)
                }
            }else {

            }
        },
        "json"
    );
})
function checkLog(obj) {
    var id = $(obj).parent().parent().find("td").eq(7).text();
    $.get(
        rootPath+"/directory/showSynchLogDetails",
        {
            synchLogId :id
        },
        function(data, status){
            if(data.result == "success"){
                var synchEntity = data.synchLog;
                for(var i = 0;i < len;i++){
                    var type = synchEntity[i].operationType;
                    var operationType = "";
                    if(type == "UPDATE"){
                        var operationType = "更新";
                    }else if(type == "CREATE"){
                        var operationType = "创建";
                    }else {
                        var operationType = "删除";
                    }
                    var state = synchEntity[i].operationState;
                    var operationState = "";
                    if(state == "synching"){
                        var operationState = "同步中";
                    }else {
                        var operationState = "同步结束";
                    }

                    $("#dataTable tr").eq(i).find("td").eq(5).html("操作类型:"+operationType+";<br/>"+
                        "操作状态:"+operationState+";<br/>"+
                        "操作结果:成功("+synchEntity[i].successCount+"),失败("+synchEntity[i].failCount+
                        "),同步中("+synchEntity[i].synchCount+")")
                    $("#dataTable tr").eq(i).find("td").eq(7).html(synchEntity[i].id)
                }
            }else {

            }
        },
        "json"
    );
}