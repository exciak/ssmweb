var upgradeMode = "";
var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];
var updateHistory = false;
var total = 0;
setInterval("doRefresh()", 60000);//1000为1秒钟
var exchangeRecordInterval;

function doRefresh(){
    total = 0;
    $(".obtain").each(function(){
        getSingleNum(this.id);
    });
    getOriginNum($(".origin").attr("id"));
}

//动态刷新源到中心库的抽取数据量
function getOriginNum(id){
    $.get("/" + proName + "/job/jobdatatranstotal",
    {
        exchangeId:id
    },
    function(data, status) {
        if(data.result != "success"){
            dmallError(data.result);
        }else{
            var htmlStr = "";
            if(data.totalInputLines != "" && data.totalInputLines != null) {
                htmlStr += data.totalInputLines+"行"+'<br>';
            }
            $("#"+id).html(htmlStr);
        }
    },"json"
    );
}

//动态刷新中心库到源抽取数据量
function getSingleNum(id){
    $.get("/" + proName + "/job/jobdatatranstotal",
    {
        exchangeId:id
    },
    function(data,status){
        if(data.result != "success"){
            dmallError(data.result);
        }else{
            var htmlStr = "";
            if(data.totalInputLines != "" && data.totalInputLines != null) {
                htmlStr += data.totalInputLines+"行"+'<br>';
            }
            if(data.state == "APPLYING"){
                htmlStr += '待获取申请';
            } else if(data.state == "OBTAINAUTHORIZING"){
                htmlStr += '待获取权签';
            } else if(data.state == "OBTAINPREPARING"){
                htmlStr += '待交换准备';
            } else if(data.state == "SUPPLYAUOTHRIZING"){
                htmlStr += '待供应权签';
            } else if(data.state == "ADMINPREPARING"){
                htmlStr += '管理员准备';
            } else if(data.state == "EXCHANGING"){
                //htmlStr += '数据传输';
                if(data.tranState == "READY"){
                    htmlStr += '准备就绪';
                } else if(data.tranState == "RUNNING"){
                    htmlStr += '正在运行';
                } else if(data.tranState == "FAILED"){
                    htmlStr += '传输失败';
                } else if(data.tranState == "STOP"){
                    htmlStr += '已停止';
                } else if(data.tranState == "FINISH"){
                    htmlStr += '运行完成';
                } else if(data.tranState == "SCHEDULE"){
                    htmlStr += '正在调度';
                } else if(data.tranState == ""){
                    if(data.hasJobId == true){
                        htmlStr += '<div class="alert-warning">获取状态失败</div>';
                    } else{
                        htmlStr += '<div class="alert-warning">启动传输任务失败</div>';
                    }
                } else{
                    htmlStr += '未知';
                }
            } else if(data.state == "INUSE"){
                htmlStr += '数据使用';
            } else if(data.state == "END"){
                htmlStr += '已结束';
            } else if(data.state == "TERMINATED"){
                htmlStr += '已终止';
            } else if(data.state == "FINISH"){
                htmlStr += '已完成';
            }
            $("#"+id).html(htmlStr);
            if($("#totalNum").length > 0){
                if(data.totalInputLines != "" && data.totalInputLines != null) {
                    total += parseInt(data.totalInputLines);
                }
                if(total != null && total != "") {
                    $("#totalNum").html(total + "行");
                }
            }
        }
    },"json"
    );
}

function exchangeRecord(obj, exchangeId){
    $('#exchangeId').val(exchangeId);
    $('#jobId').val(jobId);
    $('#exchangeRecordModal').modal({backdrop: 'static', keyboard: false});

    getJobStatistics(1);
    getJobStatus();

    exchangeRecordInterval = setInterval(refreshByTime, 10000);
}

function refreshByTime() {
    if (!$('#exchangeRecordModal').is(":hidden")) {
        getJobStatistics(1);
        getJobStatus();
    } else {
        clearInterval(exchangeRecordInterval);
    }
}

function getJobStatistics(pageNumber) {
    var exchangeId = $("#exchangeId").val();
    if (exchangeId == null) {
        return;
    }
    if (pageNumber < 1) {
        pageNumber = 1;
    }

    $("#jobStatisticsBrief").hide();
    $("#jobStatisticsTable tbody").empty();
    $("#jobStatisticsTable").append('<tr class="text-center"><td class="text-center">加载中...</td></tr>');

    $.get("/" + proName + "/job/jobstatistics",
        {
            exchangeId: exchangeId,
            pageNumber: pageNumber
        },
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                $("#jobStatisticsTable tbody").empty();
                for (var j = 0; j < data.jobStatisticsHistories.length; j++) {
                    var history = data.jobStatisticsHistories[j];
                    if(history.result == "Failed"){
                        var errorReason = history.errorReason;
                        if (null == errorReason) {
                            errorReason = "NA";
                        }
                        $("#jobStatisticsTable").append('<tr class="text-center"> ' +
                        '                   <td class="text-center">' + history.startTime + '</td>' +
                        '                   <td class="text-center">' + history.stopTime + '</td>' +
                        '                   <td class="text-center" title="'+ errorReason +'">' + history.result + '</td>' +
                        '                   <td class="text-center">' + history.trans[0].inputLines + '</td>' +
                        '                   <td class="text-center">' + history.trans[0].outputLines + '</td>' +
                        '                   </tr>');
                    } else{
                        $("#jobStatisticsTable").append('<tr class="text-center"> ' +
                        '                   <td class="text-center">' + history.startTime + '</td>' +
                        '                   <td class="text-center">' + history.stopTime + '</td>' +
                        '                   <td class="text-center">' + history.result + '</td>' +
                        '                   <td class="text-center">' + history.trans[0].inputLines + '</td>' +
                        '                   <td class="text-center">' + history.trans[0].outputLines + '</td>' +
                        '                   </tr>');
                    }

                }

                $("#successTimes").text(data.successTimes);
                $("#failedTimes").text(data.failedTimes);
                $("#totalTimes").text(data.totalTimes);
                $("#jobStatisticsBrief").show();

                var totalPage = parseInt((parseInt(data.totalTimes) + 9) / 10);

                var html = simplePagination(pageNumber, totalPage, 'getJobStatistics');
                $('#simplePagination').html(html);
                html = fullPagination(pageNumber, totalPage, 'getJobStatistics');
                $('#fullPagination').html(html);
            } else {
                $("#jobStatisticsTable tbody").empty();
                $("#jobStatisticsTable").append('<tr class="text-center"><td class="text-center">暂无记录。</td></tr>');
            }
        },
        "json");
}

function getJobStatus() {
    $.get("/" + proName + "/job/jobstatus",
        {
            exchangeId: $("#exchangeId").val()
        },
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                if (data.status == "RUNNING") {
                    $("#jobRunStatistics").show();
                    getJobRunStatistics(1);
                    updateHistory = true;
                } else {
                    $("#jobRunStatistics").hide();
                    if (updateHistory == true) {
                        getJobStatistics(1);
                        updateHistory = false;
                    }
                }
            }
        },
        "json");
}

function getJobRunStatistics(pageNumber) {
    var exchangeId = $("#exchangeId").val();
    if (exchangeId == null) {
        return;
    }
    if (pageNumber < 1) {
        pageNumber = 1;
    }

    $.get("/" + proName + "/job/jobrunstatistics",
        {
            exchangeId: exchangeId,
            pageNumber: pageNumber
        },
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                $("#jobRunStatisticsTable tbody").empty();
                for (var j = 0; j < data.trans.length; j++) {
                    var trans = data.trans[0];
                    for (var k = 0; k < trans.steps.length; k++) {
                        var step = trans.steps[k];
                        $("#jobRunStatisticsTable").append('<tr class="text-center"> ' +
                        '                   <td class="text-center">' + step.startTime + '</td>' +
                        '                   <td class="text-center">' + step.inputLines + '</td>' +
                        '                   <td class="text-center">' + step.outputLines + '</td>' +
                        '                   <td class="text-center">' + step.errors + '</td>' +
                        '                   </tr>');
                    }
                }
            } else {
                $("#jobRunStatisticsTable tbody").empty();
                $("#jobRunStatisticsTable").append('<tr class="text-center"><td class="text-center">暂无记录。</td></tr>');
            }
        },
        "json");
}

$(function () {
    $("[data-toggle='popover']").popover();
});