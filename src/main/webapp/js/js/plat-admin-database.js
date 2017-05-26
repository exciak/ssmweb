
$(document).ready(function(){
//打开添加中间库弹出框
    $("#addCenterDatabase").click(function(){

    });

    //提交修改
    $("#commitBtn").click(function(){
        var tag = $("#commitBtn").data("tag");
        var url = "";
        var data = {};
        var dopUrl = $("#dopUrl").val();
        if(!checkUrl(dopUrl)) {
            return false;
        }

        $("#commitBtn").attr('disabled', true);

        if(tag == "add"){
            url = "../gateway/create";
            data.url = dopUrl;
            data.type = "dop";
        } else {
            url = "../gateway/update";
            data.url = dopUrl;
            data.id = $("#addGagewayModal").data("id");
        }
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
    //删除网关
    $("#delCenterDatabase").click(function(){

    });
});
//删除数据源
function deleteData(id){
    $("#deleteModal").modal({backdrop:"static", keyboard: false});
    $("#deleteModal").data("delId",id);
}
