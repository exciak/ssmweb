$(document).ready(function(){
    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    var proName = arr[1];
    var rootPath = "http://" + window.location.host + "/" + proName;
   
    //删除模板----提交
    $("#delBtn").click(function(){
        var id = $("#delTemplateModal").data("id");
        $.post(rootPath+"/template/del",
            {
                id:id
            },
            function(data,status){
                if (status == "success"&& (data.result == "success")) {
                    location.href = rootPath+"/plat_admin/catalogTemplate";
                    //   $("#modalHeight").css("height","300px");
                } else {
                    dmallError(data.result);
                }
            },"json" );
    });
//使用模板----提交
    $("#useBtn").click(function(){
        var id = $("#useTemplateModal").data("id");
        $.post(rootPath+"/template/active",
            {
                id:id
            },
            function(data,status){
                if (status == "success"&& (data.result == "success")) {
                    location.href = rootPath+"/plat_admin/catalogTemplate";
                } else {
                    dmallError(data.result);
                }
            },"json" );
    });
    //清除按钮事件绑定
    $('#btn_clear').click(function(){
        $('#searchName').val("");
        $('#version').val("");
    });
});
//删除模板--打开模态框
function delTemplate(id){
    $("#delTemplateModal").data("id",id);
    $("#delTemplateModal").modal({backdrop: 'static', keyboard: false});
}
//使用模板--打开模态框
function useTemplate(id,flag) {
    $("#useTemplateModal").data("id", id);
    if (flag){
        $("#useTemplateModal p").text("确定取消使用该编目模板进行编目？");
    } else{
        $("#useTemplateModal p").text("确定使用该编目模板进行编目？");
    }
    $("#useTemplateModal").modal({backdrop: 'static', keyboard: false});
}