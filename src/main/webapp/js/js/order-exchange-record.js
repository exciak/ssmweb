/**
 * Created by xunzhi on 2015/7/13.
 */

$(document).ready(function () {
    if (document.getElementById("exchangeId")){
        getJobStatistics(1);
        getJobStatus();
        setInterval(getJobStatus, 5000);
    }
});

var updateHistory = false;

function getJobStatistics(pageNumber) {
    var jobId = $("#jobId").val();
    if (jobId == null) {
        return;
    }
    if (pageNumber < 1) {
        pageNumber = 1;
    }
    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    var proName = arr[1];
    $.get("/" + proName + "/job/jobstatistics",
        {
            exchangeId: $("#exchangeId").val(),
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

function getJobRunStatistics(pageNumber) {
    var jobId = $("#jobId").val();
    if (jobId == null) {
        return;
    }
    if (pageNumber < 1) {
        pageNumber = 1;
    }
    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    var proName = arr[1];
    $.get("/" + proName +"/job/jobrunstatistics",
        {
            exchangeId: $("#exchangeId").val(),
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

function getJobStatus() {
    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    var proName = arr[1];
    $.get("/" + proName +"/job/jobstatus",
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