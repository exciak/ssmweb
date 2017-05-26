var pathname = window.location.pathname;
var arr = pathname.split("/");
var prjName = arr[1];
//授权
function doAuth(id){
    $("#doAuthTag"+id).text("授权中...");
    $("#doAuthTag"+id).removeAttr('onclick');
    $("#doDelTag"+id).removeAttr('onclick');
    $.post("/" + prjName + "/mydata/app/dev_data/authorize",
        {
            id:id
        },function(data,status){
            if (data.result != "success") {
                dmallError(data.result);
                $("#doAuthTag" + id).text("授权");
                $("#doAuthTag" + id).attr('onclick', 'doAuth(' + id + ');');
                $("#doDelTag" + id).attr('onclick', 'doDel(' + id + ');');
            } else {
                window.location.href = "/" + prjName+"/mydata/app/dev_datas";
            }
        }
        ,"json");
}
//取消授权
function doRevoke(id){
    $("#doRevokeTag"+id).text("取消中...");
    $("#doRevokeTag"+id).removeAttr('onclick');
    $.post("/" + prjName + "/mydata/app/dev_data/revoke",
        {
            id:id
        },function(data,status){
            if (data.result != "success") {
                dmallError(data.result);
                $("#doRevokeTag" + id).text("取消授权");
                $("#doRevokeTag" + id).attr('onclick', 'doRevoke(' + id + ');');
            } else {
                window.location.href = "/" + prjName+"/mydata/app/dev_datas";
            }
        }
        ,"json");
}
//删除
function doDel(id){
    $("#doDelTag"+id).text("删除中...");
    $("#doDelTag"+id).removeAttr('onclick');
    $("#doAuthTag"+id).removeAttr('onclick');
    $.post("/" + prjName + "/mydata/app/dev_data/delete",
        {
            id:id
        },function(data,status){
            if (data.result != "success") {
                dmallError(data.result);
                $("#doDelTag" + id).text("删除");
                $("#doDelTag" + id).attr('onclick', 'doDel(' + id + ');');
                $("#doAuthTag" + id).attr('onclick', 'doAuth(' + id + ');');
            } else {
                window.location.href = "/" + prjName+"/mydata/app/dev_datas";
            }
        }
        ,"json");
}