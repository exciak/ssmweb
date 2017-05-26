
var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];

function importOnClick(){

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

}

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
        $("#errorInfo").empty();
        var excelFileImportResponse = data.excelFileImportResponse;
        var errorSheet = excelFileImportResponse.errorSheet;
        var dataTotal = excelFileImportResponse.dataTotal;
        var successDataTotal = excelFileImportResponse.successDataTotal;
        var failedCheckResponses = excelFileImportResponse.failedCheckResponses;

        if (errorSheet != null && errorSheet != "") {
            $("#batchInfo").append('&nbsp;&nbsp;&nbsp;&nbsp;' + errorSheet + ', 导入失败');
        } else {
            $("#batchInfo").append('&nbsp;&nbsp;&nbsp;&nbsp;共导入数据资源信息 ' + dataTotal + ' 条，成功 '  + successDataTotal + ' 条，失败 ' + (dataTotal - successDataTotal) + ' 条。<br>&nbsp;&nbsp;&nbsp;&nbsp;');
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

function myUpload(option){
    var fdMyFile = new FormData(),
        xhr = new XMLHttpRequest(),
        input;
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
        //console.log(fdMyFile);
        xhr.open('post', option.url);
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

$('#closeModel').click(function () {
    location.href = "/" + proName +"/dept/content/draft/catalogs";
});
