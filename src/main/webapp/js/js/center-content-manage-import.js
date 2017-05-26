
var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];
var rootPath = "http://" + window.location.host + "/" + proName;

var providerIdTemp = null;
$(document).ready(function(){

    var allProviderName = "所有部门";

    $('#btn-import').click(function () {
        //设置弹窗标题
        $("#importProviderTitle").text("请选择部门");
        //打开模态框
        $('#importProvider').modal({backdrop: 'static', keyboard: false});
        $.get("../../../share/department", {},
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {

                    var treeData = [{
                        id: '',
                        code: '',
                        text: allProviderName,
                        nodes: data.department_list
                    }];

                    $providerTree = $('#list-provider-import').treeview({
                        data: treeData,
                        onNodeSelected: function (event, node) {
                            if (allProviderName == node.text) {
                                providerIdTemp = null;
                            } else {
                                providerIdTemp = node.code;
                            }
                        }
                    });
                } else {
                    dmallError("获取部门列表失败");
                }
            },
            "json"
        );
    });

    $("#import_btn_commit").click(function(){

        myUpload({
            url: "/" + proName +"/excel/import/catalogs",
            maxSize: 10,
            multiple: true,
            beforeSend: function(file){

            },
            callback: function(data){
                notifyResponse(JSON.parse(data));
            },
            uploading: function(pre){
                $('#importProgressModal').modal({backdrop: 'static', keyboard: false});
                $(function(){
                    //每隔0.5秒自动调用方法，实现进度条的实时更新
                    timerId=window.setInterval(getProgress,500);
                });
            }
        });
    });
});

function notifyResponse(data) {
    getProgress();
    window.clearInterval(timerId);
    $('#progressBar').css("width", "100%");
    $('#importProgressModal').modal('hide');
    $('#progressBar').css("width", "0%");
    $('#importModal').modal({backdrop: 'static', keyboard: false});

    var result = data.result;
    if(result == "failed") {
        var message = data.message;
        $("#batchInfo").append(message);
    } else {

        $("#batchInfo").empty();
        $("#errorInfo").empty()
        var excelFileImportResponse = data.excelFileImportResponse;
        var errorSheet = excelFileImportResponse.errorSheet;
        var dataTotal = excelFileImportResponse.dataTotal;
        var successDataTotal = excelFileImportResponse.successDataTotal;
        var failedCheckResponses = excelFileImportResponse.failedCheckResponses;

        if (errorSheet != null && errorSheet != "") {
            $("#batchInfo").append('&nbsp;&nbsp;&nbsp;&nbsp;' + errorSheet + ', 导入失败');
        } else {
            $("#batchInfo").append('&nbsp;&nbsp;&nbsp;&nbsp;共导入数据资源信息 ' + dataTotal + ' 条，成功 '  + successDataTotal + ' 条，失败 ' + (dataTotal-successDataTotal) + ' 条。<br>&nbsp;&nbsp;&nbsp;&nbsp;');
            if(failedCheckResponses.length > 0) {
                $("#errorInfoDiv").show();
            }
            for(var j = 0; j < failedCheckResponses.length; j++){
                $("#errorInfo").append('<tr>'
                    + '<td>' + failedCheckResponses[j].lineNumber + '&nbsp;&nbsp;&nbsp;&nbsp;</td>'
                    + '<td>' + failedCheckResponses[j].dataNo + '&nbsp;&nbsp;&nbsp;&nbsp;</td>'
                    + '<td>' + failedCheckResponses[j].message + '</td>'
                    + '</tr>');
            }
        }
    }
}
function showAdvSearch(){
    $("#adv-search-link > i").removeClass("fa fa-angle-down");
    $("#adv-search-link > i").addClass("fa fa-angle-up");
    $("#advanced-search").show();
    $("#search-clicks").show();
    $("#simple-search-clicks").hide();
}

function myUpload(option){
    var fdMyFile = new FormData(),
        xhr = new XMLHttpRequest(),
        input;
    var organCode = providerIdTemp;

    if (isEmpty(organCode)) {
        dmallError("请先选择部门");
        return showAdvSearch();
    }

    input = document.createElement('input');
    input.setAttribute('id', 'myUploadInput');
    input.setAttribute('type', 'file');
    input.setAttribute('name', 'file');
    if(option.multiple){
        input.setAttribute('multiple', true);
    }
    document.body.appendChild(input);
    input.style.display = 'none';
    input.click();
    var fileType = ['xls', 'xlsx'];
    input.onchange = function(){
        if(!input.value){
            return false;
        }
        var type = input.value.split('.').pop();
        if(fileType.indexOf(type.toLocaleLowerCase()) == -1){
            dmallError("暂不支持该类型的文件，请重新选择!");
            return false;
        }
        for(var i=0, file; file=input.files[i++];){
            if(option.maxSize &&  file.size > option.maxSize * 1024 * 1024){
                dmallError('请上传小于'+option.maxSize+'M的文件');
                return false;
            }
        }
        if(option.beforeSend instanceof Function){
            if(option.beforeSend(input) === false){
                return false;
            }
        }
        for(var i=0, file; file=input.files[i++];){
            fdMyFile.append('excelFile', file);
        }

        xhr.open('post', option.url + "?organCode=" + organCode);
        xhr.onreadystatechange = function(){
            if(xhr.status == 200){
                if(xhr.readyState == 4){
                    if(option.callback instanceof Function){
                        option.callback(xhr.responseText);
                    }
                }
            }else{
                dmallError("上传失败！");
            }
        }
        xhr.upload.onprogress = function(event){
            var pre = Math.floor(100 * event.loaded / event.total);
            if(option.uploading instanceof Function){
                option.uploading(pre);
            }
        }
        xhr.send(fdMyFile);

    }
}

var timerId;

function getProgress() {
    $.ajax({
        type: "GET",
        url: rootPath+"/excel/import/progress",
        dataType: "json",
        contentType: 'application/json;charset=utf-8',
        success: function (data) {
            if (data.result == "success") {

                if (!data.isImport) {

                    window.clearInterval(timerId);
                }

                $('#progressBar').css("width", data.percentComplete+"%");
                $('#progress').html("导入数据资源：" + data.bytesRead +"/" + data.totalSize);

            }
        },
        error: function () {
            window.clearInterval(timerId);
            dmallAjaxError();
        }
    });

}

//不为空校验
function isEmpty(string) {
    if((string == "") || (string == null) || (string == undefined)) {
        return true;
    }

    return false;
}


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

    document.getElementById("form1").setAttribute("action",rootPath+"/excel/export/CMCatalogs");
    document.getElementById("form1").setAttribute("method","POST");
    $("#idStr").val(ids);
    document.getElementById("form1").submit();
}

$('#closeModel').click(function () {
    $('#messageModal').modal({backdrop: 'static', keyboard: false});
});