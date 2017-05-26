/**
 * Created by lixy on 2016/1/6.
 */

var submenuValue;

$(document).ready(function(){

    submenuValue = $("#subType").val();

    $("#allQuery").attr("href", "../terminate/authorize?subType=ALL");
    $("#allQuery").click (function () {
        submenuValue = "ALL";
    });

    $("#filterQuery").attr("href", "../terminate/authorize?subType=AUTHORIZING");
    $("#filterQuery").click (function () {
        submenuValue = "AUTHORIZING";
    });

    if (submenuValue == "ALL") {
        $("#allQuery").addClass("a-selected");
        $("#filterQuery").removeClass("a-selected");
    } else if(submenuValue == "AUTHORIZING"){
        $("#allQuery").removeClass("a-selected");
        $("#filterQuery").addClass("a-selected");
    }

    var outsideTag = 1;
    var obtainDeptOutsideTag = 1;

    function getSupplyDeptList(page) {
        var url = "";
        var data = {};
        var myString = $("#supplyDeptSearch").val();

        data.departmentName = myString;
        data.pageNumber = page;
        url = "../../department/list";

        $.get(url, data,
            function (data, status) {
                if (status == "success" && (data.result == "success")) {
                    $("#supplyDeptList").empty();
                    if (data.deptList.length > 0) {
                        for (var i = 0; i < data.deptList.length; i++) {
                            var dept = data.deptList[i];
                            var trHTML = '<li class="longText" id=' + dept.id + ' title=' + dept.name + '>' + dept.name + '</li>';
                            $("#supplyDeptList").append(trHTML);
                        }
                        $("#currentPage").val(data.curPage);
                        $("#totalPage").val(data.totalPages);
                        $("#wrongMsg").hide();
                        if (data.totalPages == 1) {
                            $("#pageDiv").hide();
                        } else {
                            $("#pageDiv").show();
                        }
                    } else {
                        $("#wrongMsg").show();
                        $("#pageDiv").hide();
                    }
                } else {
                    dmallError(data.result);
                }
            },
            "json"
        );
    }

    $("#supplyDeptSearch").keyup(function () {
        getSupplyDeptList(1);
    });
    $("#supplyDeptSearch").focus(function () {
        outsideTag = 1;
        getSupplyDeptList(1);
    });
    $("supplyDeptSearch").click(function () {
        outsideTag = 1;
    });

    $("#pageDiv").click(function () {
        outsideTag = 1;
    });

    $("#inputSupplyDept").focus(function () {
        $("#inputSupplyDept").removeClass("errorC");
        $("#supplyDeptListDiv").show();
        $("#supplyDeptSearch").val("");
        $("#supplyDeptSearch").focus();
        outsideTag = 1;
    });

    $("#supplyDeptList").delegate("li", "click", function () {
        var supplyDeptId = this.id;
        var supplyDeptName = this.innerText;
        $("#inputSupplyDept").val(supplyDeptName);
        $("#inputSupplyDept").data("supplyDeptId", supplyDeptId);
        $("#inputSupplyDept").siblings("i").removeClass("hidden");
        //$("#clearIcon").removeClass("hidden");
        $("#supplyDeptId").val(supplyDeptId);
        $("#supplyDeptListDiv").hide();
        outsideTag = 1;
    });

    // 流程单号列表翻页
    $("#previousPage").click(
        function () {
            if (parseInt($("#currentPage").val()) > 1) {
                getSupplyDeptList(parseInt($("#currentPage").val()) - 1);
            }
        });

    $("#nextPage").click(
        function () {
            if (parseInt($("#currentPage").val()) < parseInt($("#totalPage").val())) {
                getSupplyDeptList(parseInt($("#currentPage").val()) + 1);
            }
        });

    //点击div以外隐藏
    $("body").not($("#supplyDeptListDiv")).click(function () {
        if (outsideTag != 1) {
            $("#supplyDeptListDiv").hide();
        }
        outsideTag = 0;
    });


    function getObtainDeptList(page) {
        var url = "";
        var data = {};
        var myString = $("#obtainDeptSearch").val();

        data.departmentName = myString;
        data.pageNumber = page;
        url = "../../department/list";

        $.get(url, data,
            function (data, status) {
                if (status == "success" && (data.result == "success")) {
                    $("#obtainDeptList").empty();
                    if (data.deptList.length > 0) {
                        for (var i = 0; i < data.deptList.length; i++) {
                            var dept = data.deptList[i];
                            var trHTML = '<li class="longText" id=' + dept.id + ' title=' + dept.name + '>' + dept.name + '</li>';
                            $("#obtainDeptList").append(trHTML);
                        }
                        $("#obtainDeptCurrentPage").val(data.curPage);
                        $("#obtainDeptTotalPage").val(data.totalPages);
                        $("#obtainDeptWrongMsg").hide();
                        if (data.totalPages == 1) {
                            $("#obtainDeptPageDiv").hide();
                        } else {
                            $("#obtainDeptPageDiv").show();
                        }
                    } else {
                        $("#obtainDeptWrongMsg").show();
                        $("#obtainDeptPageDiv").hide();
                    }
                } else {
                    dmallError(data.result);
                }
            },
            "json"
        );
    }

    $("#obtainDeptSearch").keyup(function () {
        getObtainDeptList(1);
    });
    $("#obtainDeptSearch").focus(function () {
        obtainDeptOutsideTag = 1;
        getObtainDeptList(1);
    });
    $("obtainDeptSearch").click(function () {
        obtainDeptOutsideTag = 1;
    });

    $("#obtainDeptPageDiv").click(function () {
        obtainDeptOutsideTag = 1;
    });

    $("#inputObtainDept").focus(function () {
        $("#inputObtainDept").removeClass("errorC");
        $("#obtainDeptListDiv").show();
        $("#obtainDeptSearch").val("");
        $("#obtainDeptSearch").focus();
        obtainDeptOutsideTag = 1;
    });

    $("#obtainDeptList").delegate("li", "click", function () {
        var obtainDeptId = this.id;
        var obtainDeptName = this.innerText;
        $("#inputObtainDept").val(obtainDeptName);
        $("#inputObtainDept").data("obtainDeptId", obtainDeptId);
        $("#inputObtainDept").siblings("i").removeClass("hidden");
        //$("#obtainDeptClearIcon").removeClass("hidden");
        $("#obtainDeptId").val(obtainDeptId);
        $("#obtainDeptListDiv").hide();
        obtainDeptOutsideTag = 1;
    });

    // 流程单号列表翻页
    $("#obtainDeptPreviousPage").click(
        function () {
            if (parseInt($("#obtainDeptCurrentPage").val()) > 1) {
                getObtainDeptList(parseInt($("#obtainDeptCurrentPage").val()) - 1);
            }
        });

    $("#obtainDeptNextPage").click(
        function () {
            if (parseInt($("#obtainDeptCurrentPage").val()) < parseInt($("#obtainDeptTotalPage").val())) {
                getObtainDeptList(parseInt($("#obtainDeptCurrentPage").val()) + 1);
            }
        });

    //点击div以外隐藏
    $("body").not($("#obtainDeptListDiv")).click(function () {
        if (obtainDeptOutsideTag != 1) {
            $("#obtainDeptListDiv").hide();
        }
        obtainDeptOutsideTag = 0;
    });

    //选择资源形态分类
    $("#chooseResource").click(function () {
        /* 设置弹窗标题 */
        $("#addResourceTitle").text("请选择资源形态分类");
        /* 打开模态框 */
        openResource();
    });

    $("#confirmBtn").click(function () {
        location.href = window.location.href;
    });

    $("#closeBtn").click(function () {
        location.href = window.location.href;
    });
});

var pathname = window.location.pathname;
var arr = pathname.split("/");
var prjName = arr[1];
var updateHistory = false;

function exchangeRecord(obj, exchangeId){
    $('#exchangeId').val(exchangeId);
    $('#jobId').val(jobId);
    $('#exchangeRecordModal').modal({backdrop: 'static', keyboard: false});

    getJobStatistics(1);
    getJobStatus();

    function refreshByTime(){
        getJobStatus();
    }

    setInterval(refreshByTime, 5000);
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

    $.get("/" + prjName + "/job/jobstatistics",
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

function getJobRunStatistics(pageNumber) {
    var exchangeId = $("#exchangeId").val();
    if (exchangeId == null) {
        return;
    }
    if (pageNumber < 1) {
        pageNumber = 1;
    }

    $.get("/" + prjName + "/job/jobrunstatistics",
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

function getJobStatus() {
    $.get("/" + prjName + "/job/jobstatus",
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

function doClearSupplyDept(){
    $("#inputSupplyDept").val("");
    $("#supplyDeptId").val("");
    $("#inputSupplyDept").siblings("i").addClass("hidden");
    //$("#clearIcon").addClass("hidden");
}

function doClearObtainDept(){
    $("#inputObtainDept").val("");
    $("#obtainDeptId").val("");
    $("#inputObtainDept").siblings("i").addClass("hidden");
    //$("#obtainDeptClearIcon").addClass("hidden");
}


