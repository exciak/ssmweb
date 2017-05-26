
var upgradeMode = $("#upgradeMode").val();
var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];


setInterval("doRefresh()",60000);//1000为1秒钟
function doRefresh(){
    $(".obtain").each(function(){
        getSingleNum(this.id);
    });
}
$(document).ready(function(){
    $(function () {
        $("[data-toggle='popover']").popover();
    });
    // 确定按钮
    $("#confirm_btn").click(function (event) {
        checkAllItems();
        if (preventDefaultFlag === true) {
            event.preventDefault();
            preventDefaultFlag = false;
            return;
        }
        if(upgradeMode == "UPDATE") {
            $('#modifyJobModal').modal({backdrop: 'static', keyboard: false});
        } else {
            $('#recreateJobModal').modal({backdrop: 'static', keyboard: false});
        }
        return false;
    });

    //$("#modifyJobModalBtn").click(function () {
    //    var maxSizePerTime = getMaxSizePerTime();
    //    $.post("../modify",
    //        {
    //            exchangeId: $("#exchangeId").val(),
    //            exchangeMethod: getDirectExchangeMethod(),
    //            scheduleType: getScheduleType(),
    //            minute: getMinute(),
    //            minuteOfHour: getMinuteOfHour(),
    //            hourOfDay: getHourOfDay(),
    //            weekday: getWeekday(),
    //            dayOfMonth: getDayOfMonth(),
    //            srcColumns: getSrcDbColumns(),
    //            srcColumnsType: getSrcDbTypeColumns(),
    //            splitPk: getSplitPk(),
    //            where: getWhere(),
    //            params: getParamsJson(),
    //            destDbId: getDstId(),
    //            destTableName: getDstDbTable(),
    //            destColumns: getDstDbColumns(),
    //            destColumnsType: getDstCheckedDbTypeColumns(),
    //            partition: getPartition(),
    //            insertMode: getInsertMode(),
    //            flushNumber: getFlushNumber(),
    //            action: "Agree",
    //            maxSizePerTime:maxSizePerTime
    //        },
    //        function (data, status) {
    //            if (data.result != "success") {
    //                dmallError(data.result);
    //            } else {
    //                window.location.href = "../record?exchangeId=" + $("#exchangeId").val();
    //            }
    //        },
    //        "json");
    //});

    /* 表检查，判断资源提供方是否配置了中间库 */
    $.get("/"+proName+"/center/db/manage/exchange/checkTable",
        {
            exchangeId: $("#exchangeId").val(),
            desTable: $("#resultTable").val()
        },
        function (data, status) {
            if(data.result == "success") {
                destDbId = data.destDbId;
                $("#dstCheckedTable").empty();
                $("#editColumn").show();
                //initDbCheckedTable();
                $("#partitionTable tbody").empty();
                $("#partitionWrap").hide();
                $("#loadingDbColumns").hide();
                if (!data.tableInfo) {
                    dmallError("没有获取到列");
                } else {
                    $("#infoDiv").show();
                    $('#sortable').empty();
                    $('#dbCheckedTable').empty();
                    $("#dstTableInfo").empty();
                    var tableInfo = data.tableInfo;
                    var columnArray = data.columnArray;
                    var destDbColumuns = data.destDbColumuns;
                    for (var i = 0; i < tableInfo.columns.length; i++) {
                        var column = tableInfo.columns[i];
                        $('#dstTableInfo').append('<tr class="ui-state-default">' +
                            '<td width="40%">' + column.name + '</td><td width="60%">' + column.type +
                            '</td></tr>');
                    }
                    for(var j = 0; j < columnArray.length; j++){
                        $("#dbCheckedTable").append('<tr><td><input type="checkbox" name="idsSrcDbTableColumn" value="" checked hidden></td>'+
                            '<td name="srcDbTableColumnName">'+columnArray[j].name+
                            '</td><td name="srcDbTableColumnName">'+columnArray[j].type+'</td></tr>');
                    }
                    for (var i = 0; i < destDbColumuns.length; i++) {
                        $('#destDbTableColumn').append('<tr class="ui-state-default">' +
                        '<td width="40%">' + destDbColumuns[i].name + '</td><td width="60%">' + destDbColumuns[i].type +
                        '</td></tr>');
                    }
                    if (tableInfo.partitions.length > 0) {
                        for (var i = 0; i < tableInfo.partitions.length; i++) {
                            var columns = tableInfo.partitions[i];

                            var trHTML = '<tr><td><input type="checkbox" checked hidden></td>' +
                                '<td>' + columns + '</td>' +
                                '<td><input id="partition_' + columns + '" name="partitionColumnNames" onblur="checkPatition()" type="text" class="form-control"' +
                                '  value=""/><small class="text-danger"></small></td></tr>';
                            $("#partitionTable").append(trHTML);
                        }

                        $("#partitionWrap").show();
                    }
                }

                $("#scheduleTypeList").val(data.scheduleType);
                var scheduleType = data.scheduleType;
                if (scheduleType == "none") {
                    $("#scheduleTypeList").attr("disabled", false);
                } else if (scheduleType == "minute") {
                    //$("#scheduleTypeList option[value='none']").remove();
                    $("#transmitIntervalMinute").show();
                    var obj = jQuery.parseJSON(data.scheduleInterval);
                    $("#transmitIntervalMinuteValue").val(obj.minute);
                } else if (scheduleType == "hourOfDay") {
                    $("#scheduleTypeList option[value='none']").remove();
                    $("#transmitIntervalDay").show();
                    var obj = jQuery.parseJSON(data.scheduleInterval);
                    $("#transmitIntervalDayMinute").val(obj.minute);
                    $("#transmitIntervalDayHour").val(obj.hourOfDay);
                } else if (scheduleType == "weekday") {
                    //$("#scheduleTypeList option[value='none']").remove();
                    $("#transmitIntervalWeek").show();
                    $("#transmitIntervalDay").show();
                    var obj = jQuery.parseJSON(data.scheduleInterval);
                    $("#transmitIntervalDayMinute").val(obj.minute);
                    $("#transmitIntervalDayHour").val(obj.hourOfDay);
                    $("#transmitIntervalWeekValue").val(obj.weekday);
                } else if (scheduleType == "dayOfMonth") {
                    //$("#scheduleTypeList option[value='none']").remove();
                    $("#transmitIntervalMonth").show();
                    $("#transmitIntervalDay").show();
                    var obj = jQuery.parseJSON(data.scheduleInterval);
                    $("#transmitIntervalDayMinute").val(obj.minute);
                    $("#transmitIntervalDayHour").val(obj.hourOfDay);
                    $("#transmitIntervalMonthValue").val(obj.dayOfMonth);
                }

                $("#insertMode").val(data.insertMode);
                $("#flushNumber").val(data.flushNumber);

            } else {
                dmallError(data.result);
                $("#infoDiv").hide();
            }
        },
        "json"
    );

    function disableBtn() {
        $("#confirm_btn").attr("disabled", true);
        $("#cancel_btn").attr("disabled", true);
    }

    function enableBtn() {
        $("#confirm_btn").attr("disabled", false);
        $("#cancel_btn").attr("disabled", false);
    }

    $("#recreateJobModalBtn").click(function (event) {
        $("#modifyJobModalBtn").click();
    });

    $("#modifyJobModalBtn").click(function (event) {
        if($("#infoDiv").is(":visible")){
            checkAllItems();
            if (preventDefaultFlag === true) {
                event.preventDefault();
                preventDefaultFlag = false;
                return false;
            }
            var dbId = $('#dstDbList').data("srcid");
            var dbTable = $("#resultTable").val();
            disableBtn();

            var maxSizePerTime =getMaxSizePerTime();
            srcDbColumns = "";
            srcDbTypeColumns = "";
            dstDbColumns = "";
            dstCheckedDbTypeColumns = "";
            $('#srcDbTableColumnsTable tr').find('td').each(function() {
                if ($(this).index() == "1") {
                    srcDbColumns = srcDbColumns+($(this).text() + ',');
                }
            });
            if(srcDbColumns != ""){
                srcDbColumns = srcDbColumns.substring(0,srcDbColumns.length-1);
            }
            $('#srcDbTableColumnsTable tr').find('td').each(function() {
                if ($(this).index() == "2") {
                    srcDbTypeColumns = srcDbTypeColumns+($(this).text() + ',');
                }
            });
            if(srcDbTypeColumns != ""){
                srcDbTypeColumns = srcDbTypeColumns.substring(0,srcDbTypeColumns.length-1);
            }
            $('#destDbTableColumnsTable tr').find('td').each(function() {
                if ($(this).index() == "0") {
                    dstDbColumns = dstDbColumns+($(this).text() + ',');
                }
            });
            if(dstDbColumns != ""){
                dstDbColumns = dstDbColumns.substring(0,dstDbColumns.length-1);
            }
            $('#destDbTableColumnsTable tr').find('td').each(function() {
                if ($(this).index() == "1") {
                    dstCheckedDbTypeColumns = dstCheckedDbTypeColumns+($(this).text() + ',');
                }
            });
            if(dstCheckedDbTypeColumns != ""){
                dstCheckedDbTypeColumns = dstCheckedDbTypeColumns.substring(0,dstCheckedDbTypeColumns.length-1);
            }
            if(scheduleType == undefined){
                scheduleType = "none";
            }
            var isNotice = false;
            var updateReason = $("#updateReason").val();
            if ($("#isNoticeOption").attr("checked") == "checked") {
                isNotice = true;
            } else {
                updateReason = "";
            }

            disableBtn();
            $.post("/" + proName + "/center/db/manage/exchange/stop/" + $("#exchangeId").val(),
                {},
                function (data, status) {
                    if (data.result == "success") {
                        $.post("/" + proName + "/center/db/manage/exchange/stop/using",
                            {
                                cmHisId: $("#cmHisId").val()
                            },
                            function (data, status) {
                                if (data.result == "success") {
                                    $.post("/" + proName + "/center/db/manage/exchange/params",
                                        {
                                            cmHisId: $("#cmHisId").val(),
                                            exchangeId: $("#exchangeId").val(),
                                            srcColumns: srcDbColumns,
                                            splitPk: splitPk,
                                            where: $("#where").val(),
                                            params: getParamsJson(),
                                            destDbId: destDbId,
                                            destTableName: dbTable,
                                            destColumns: dstDbColumns,
                                            partition: getPartition(),
                                            scheduleType: scheduleType,
                                            minute: $("#transmitIntervalMinuteValue").val(),
                                            minuteOfHour: $('#transmitIntervalDayMinute option:selected').val(),
                                            hourOfDay: $('#transmitIntervalDayHour option:selected').val(),
                                            weekday: $('#transmitIntervalWeekValue option:selected').val(),
                                            dayOfMonth: $('#transmitIntervalMonthValue option:selected').val(),
                                            insertMode: $("#insertMode").val(),
                                            flushNumber: $("#flushNumber").val(),
                                            srcColumnsType: srcDbTypeColumns,
                                            destColumnsType: dstCheckedDbTypeColumns,
                                            maxSizePerTime: maxSizePerTime,
                                            expireTime: getExpireTime(),
                                            upgradeMode: upgradeMode,
                                            isNotice: isNotice,
                                            updateReason: updateReason
                                        },
                                        function (data, status) {
                                            if (data.result == "success") {
                                                dmallNotifyAndLocation("操作成功", "/" + proName + "/center/db/manage/exchange");
                                            } else {
                                                enableBtn();
                                                dmallError(data.result);
                                            }
                                        },
                                        "json");
                                } else {
                                    enableBtn();
                                    dmallError(data.result);
                                }
                            },
                            "json"
                        );
                    } else {
                        enableBtn();
                        dmallError(data.result);
                    }
                },
                "json"
            );
        } else{
            dmallError("请点击表检查完善信息");
            return false;
        }
    });

});

var prepareType = $("#prepareType").val();
var curDirectExchangeMethod = $("#curDirectExchangeMethod").val();
var srcDbType = $("#srcDbType").val();

var srcDbColumns = "";
var srcDbTypeColumns = "";
var dstCheckedDbColumns = "";
var dstCheckedDbTypeColumns = "";
var dstDbId = 0;
var dstDbType = "";
var dstDbTable = "";
var dstDbColumns = "";
var dstDbTypeColumns = "";
var partition = "";
var directExchangeMethod = "TRANSMIT";
var scheduleType = "none";
var minute = "";
var minuteOfHour = "";
var hourOfDay = "";
var weekday = "";
var dayOfMonth = "";
var insertMode = "0";
var expireTime = "";
var splitPk = "";
var where = "";
var flushNumber = "";
var maxSizePerTime = "";
var z = /^[0-9]*$/;

var preventDefaultFlag = false;

function getSrcDbColumns() {
    return srcDbColumns;
}
function getSrcDbTypeColumns() {
    return srcDbTypeColumns;
}
function setSrcDbColumns(columns) {
    srcDbColumns = columns;
}
function getDstId() {
    return dstDbId;
}
function setDstDbId(id) {
    dstDbId = id;
}
function getDstDbType() {
    return dstDbType;
}
function setDstDbType(type) {
    dstDbType = type;
}
function getDstDbTable() {
    return dstDbTable;
}
function setDstDbTable(table) {
    dstDbTable = table;
}
function getDstDbColumns() {
    return dstDbColumns;
}
function getDstCheckedDbTypeColumns() {
    return dstCheckedDbTypeColumns;
}
function setDstDbColumns(columns) {
    dstDbColumns = columns;
}
function getPartition() {
    return partition;
}
function setPartition(p) {
    partition = p;
}
function getDirectExchangeMethod() {
    return directExchangeMethod;
}
function setDirectExchangeMethod(method) {
    directExchangeMethod = method;
}
function getScheduleType() {
    return scheduleType;
}
function setScheduleType(type) {
    scheduleType = type;
}
function getMinute() {
    return minute;
}
function getMinuteOfHour() {
    return minuteOfHour;
}
function getHourOfDay() {
    return hourOfDay;
}
function getWeekday() {
    return weekday;
}
function getDayOfMonth() {
    return dayOfMonth;
}
function getInsertMode() {
    return insertMode;
}
function setInsertMode(mode) {
    insertMode = mode;
}
function getSplitPk() {
    return splitPk;
}
function setSplitPk(s) {
    splitPk = s;
}
function getWhere() {
    return where;
}
function getFlushNumber() {
    return flushNumber;
}

function getMaxSizePerTime(){
    var maxSizePerTime = "";
    if($("#maxSizePerTime").val() != undefined){
        maxSizePerTime = $("#maxSizePerTime").val();
    }
    return maxSizePerTime;
}

function getExpireTime(){
    return expireTime;
}
init();

function showSchedulType() {
    var provideType = $("#provideType").val();
    if (provideType == "PERIOD") {
        $("#transmitScheduleType").show();
    }
}

function init() {

    switch (prepareType) {
        case "create":
            if (srcDbType != "ODPS") {
                $("#directExchangeMethodPara").hide();
                $("#expireTimePara").hide();
                $("#transmitPara").show();
                directExchangeMethod = "TRANSMIT";
            }
            break;
        case "modify":
            directExchangeMethod = curDirectExchangeMethod;
            if (curDirectExchangeMethod == "PACKAGE") {
                checkOdpsOwner();
            } else if (curDirectExchangeMethod == "TRANSMIT") {
                $("#expireTimePara").hide();
                $("#transmitPara").show();
            }
            break;
        default:
            break;
    }

    showSchedulType();

}

function checkSplitPk() {
    splitPk = $("#splitPk").val();
}

function checkOdpsOwner() {
    var dbId = $("#dstDbList").data('srcid');
    $.get("/" + proName + "/odps_owner/hasOdpsOwnerPrivilege",
        {
            dbaccessId: dbId
        },
        function (data, status) {
            if (status == "success") {
                if (data.result != "success") {
                    $(".errorPackageMethod").html("*" + data.result);
                    $(".errorPackageMethod").css("display", "block");
                } else {
                    $(".errorPackageMethod").hide();
                }
            } else {
                dmallError("验证ODPS owner失败");
            }
        },
        "json"
    );
}

$("input[name=directExchangeMethod]").click(function () {
    switch ($("input[name=directExchangeMethod]:checked").attr("id")) {
        case "packageMethod":
            $("#transmitPara").hide();
            $("#exchangeIntervalValue").attr("readonly", true);
            $("#exchangeIntervalValue").val("");
            $("#exchangeIntervalList").val("");
            if(prepareType == "create"){
                $("#expireTimePara").show();
            }
            directExchangeMethod = "PACKAGE";
            $(".errorSrcDbTableColumnsListValue").hide();
            break;
        case "transmitMethod":
            if(scheduleType == "none"){
                $("#exchangeIntervalValue").attr("readonly", true);
                $("#exchangeIntervalValue").val("");
                $("#exchangeIntervalList").val("");
                $("#expireTimePara").hide();
            }else{
                $("#exchangeIntervalValue").attr("readonly", true);
                $("#exchangeIntervalValue").val("");
                $("#exchangeIntervalList").val("");
                $("#expireTimePara").hide();
                /* if(prepareType == "create"){
                 $("#expireTimePara").show();
                 }*/
            }
            $("#transmitPara").show();
            directExchangeMethod = "TRANSMIT";
            break;
        default:
            break;
    }
});
$("#scheduleTypeList").change(
    function () {
        scheduleType = $("#scheduleTypeList option:selected").val();
        if (scheduleType == "none") {
            $("#transmitIntervalMinute").hide();
            $("#transmitIntervalWeek").hide();
            $("#transmitIntervalMonth").hide();
            $("#transmitIntervalDay").hide();
            $("#expireTimePara").hide();
        } else if (scheduleType == "minute") {
            $("#transmitIntervalMinute").show();
            $("#transmitIntervalWeek").hide();
            $("#transmitIntervalMonth").hide();
            $("#transmitIntervalDay").hide();
            /* if(prepareType == "create"){
             $("#expireTimePara").show();
             }*/
        } else if (scheduleType == "hourOfDay") {
            $("#transmitIntervalMinute").hide();
            $("#transmitIntervalWeek").hide();
            $("#transmitIntervalMonth").hide();
            $("#transmitIntervalDay").show();
            /* if(prepareType == "create"){
             $("#expireTimePara").show();
             }*/
        } else if (scheduleType == "weekday") {
            $("#transmitIntervalMinute").hide();
            $("#transmitIntervalWeek").show();
            $("#transmitIntervalMonth").hide();
            $("#transmitIntervalDay").show();
            /*if(prepareType == "create"){
             $("#expireTimePara").show();
             }*/
        } else if (scheduleType == "dayOfMonth") {
            $("#transmitIntervalMinute").hide();
            $("#transmitIntervalWeek").hide();
            $("#transmitIntervalMonth").show();
            $("#transmitIntervalDay").show();
            /*if(prepareType == "create"){
             $("#expireTimePara").show();
             }*/
        }
    }
);
//共享周期
$("#exchangeIntervalList").change(function () {
    var selected = $("#exchangeIntervalList option:selected").val();
    if (selected == "") {
        $("#exchangeIntervalValue").val("");
        $("#exchangeIntervalValue").attr("readonly", true);
        $("#exchangeIntervalValue").removeClass("errorC");
        $(".errorExchangeIntervalValue").css("display", "none");
    } else {
        $("#exchangeIntervalValue").attr("readonly", false);
    }
});
$("#exchangeIntervalValue").focus(function () {
    $("#exchangeIntervalValue").removeClass("errorC");
    $(".errorExchangeIntervalValue").hide();
});
$("#exchangeIntervalValue").blur(function () {
    checkExchangeIntervalValue();
});
function checkExchangeIntervalValue() {
    var val = {};
    if($("#exchangeIntervalList option:selected").val() != ""){
        var key = $("#exchangeIntervalList option:selected").val();
        var value = $("#exchangeIntervalValue").val();
        if(value != "" && value != undefined) {
            val[key] = value;
        }
    }
    expireTime = JSON.stringify(val);
    if (directExchangeMethod == "PACKAGE" && $("#exchangeIntervalList option:selected").val() != "") {
        if($("#exchangeIntervalValue").val() != undefined){
            if ($("#exchangeIntervalValue").val() == "") {
                $("#exchangeIntervalValue").addClass("errorC");
                $(".errorExchangeIntervalValue").html("*请输入共享周期");
                $(".errorExchangeIntervalValue").css("display", "block");
                preventDefaultFlag = true;
                return true;
            } else if (!z.test($("#exchangeIntervalValue").val())) {
                $("#exchangeIntervalValue").addClass("errorC");
                $(".errorExchangeIntervalValue").html("*共享周期必须为整数");
                $(".errorExchangeIntervalValue").css("display", "block");
                preventDefaultFlag = true;
                return true;
            }
        }
    }
    return false;
}

//获取选中的目的列
function updateDbTableColumns(id) {
    var data = "";
    var type = "";
    $("#"+id).find(":checkbox:checked").each(function () {
        if (data == "") {
            data = $(this).parent().next().text();
        } else {
            data = data + "," + $(this).parent().next().text();
        }
        if (type == "") {
            type = $(this).parent().next().next().text();
        } else {
            type = type + "," + $(this).parent().next().next().text();
        }
    });
    if( id == "srcDbTableColumnsTable"){
        srcDbColumns = data;
        srcDbTypeColumns = type;
    } else if(id == "sortable"){
        dstDbColumns = data;
        dstDbTypeColumns = type;
    } else if( id = "dstCheckedTable"){
        dstCheckedDbColumns = data;
        dstCheckedDbTypeColumns = type;
    }
}
function checkPatition() {
    var isTag = true;
    $('input[name="partitionColumnNames"]').each(function () {
        var partitionValue = $(this).val();
        if (partitionValue == null || partitionValue == "") {
            isTag = false;
            return false;
        }
    });

    if (!isTag) {
        preventDefaultFlag = true;
        $("#partitionTable").addClass("errorC");
        $(".errorPartitionTable").html("*目的分区不能为空，请修改目的分区");
        $(".errorPartitionTable").css("display", "block");
    } else {
        $("#partitionTable").removeClass("errorC");
        $(".errorPartitionTable").hide();
    }
};

function checkScheduleType() {
    scheduleType = $("#scheduleTypeList option:selected").val();
}
function checkTransmitIntervalMinute() {
    if (directExchangeMethod == "TRANSMIT" && scheduleType == "minute") {
        minute = $("#transmitIntervalMinuteValue").val();
        var ret = inputCheckNum(minute);
        if (!ret || parseInt(minute) <= 0 || parseInt(minute) > 100000) {
            $("#transmitIntervalMinuteValue").addClass("errorC");
            $(".errorTransmitIntervalMinuteValue").html("*请输入分钟，分钟为大于0且不能超过100000的整数");
            $(".errorTransmitIntervalMinuteValue").css("display", "block");
            preventDefaultFlag = true;

        }
    }
};
$("#transmitIntervalMinuteValue").focus(function () {
    $("#transmitIntervalMinuteValue").removeClass("errorC");
    $(".errorTransmitIntervalMinuteValue").hide();

});
$("#transmitIntervalMinuteValue").blur(function () {
    checkTransmitIntervalMinute();
});

function checkTransmitIntervalWeek() {
    if (directExchangeMethod == "TRANSMIT" && scheduleType == "weekday") {
        weekday = $("#transmitIntervalWeekValue").val();
        if (weekday == "") {
            $("#transmitIntervalWeekValue").addClass("errorC");
            $(".errorTransmitIntervalWeekValue").html("*请选择每周时间");
            $(".errorTransmitIntervalWeekValue").css("display", "block");
            preventDefaultFlag = true;
        }
    }
};
$("#transmitIntervalWeekValue").focus(function () {
    if ($("#transmitIntervalWeekValue").val() == "") {
        $("#transmitIntervalWeekValue").removeClass("errorC");
        $(".errorTransmitIntervalWeekValue").hide();
    }
});
$("#transmitIntervalWeekValue").blur(function () {
    checkTransmitIntervalWeek();
});

function checkTransmitIntervalMonth() {
    if (directExchangeMethod == "TRANSMIT" && scheduleType == "dayOfMonth") {
        dayOfMonth = $("#transmitIntervalMonthValue").val();
        if (dayOfMonth == "") {
            $("#transmitIntervalMonthValue").addClass("errorC");
            $(".errorTransmitIntervalMonthValue").html("*请选择每月时间");
            $(".errorTransmitIntervalMonthValue").css("display", "block");
            preventDefaultFlag = true;
        }
    }
};
$("#transmitIntervalMonthValue").focus(function () {
    if ($("#transmitIntervalMonthValue").val() == "") {
        $("#transmitIntervalMonthValue").removeClass("errorC");
        $(".errorTransmitIntervalMonthValue").hide();
    }
});
$("#transmitIntervalMonthValue").blur(function () {
    checkTransmitIntervalMonth();
});

function checkTransmitIntervalDay() {
    if (directExchangeMethod == "TRANSMIT" &&
        (scheduleType == "hourOfDay" || scheduleType == "weekday" || scheduleType == "dayOfMonth")) {
        hourOfDay = $("#transmitIntervalDayHour").val();
        if (hourOfDay == "") {
            $("#transmitIntervalDayHour").addClass("errorC");
            $(".errorTransmitIntervalDay").html("*请选择具体时间");
            $(".errorTransmitIntervalDay").css("display", "block");
            preventDefaultFlag = true;
        }
        minuteOfHour = $("#transmitIntervalDayMinute").val();
        if (minuteOfHour == "") {
            $("#transmitIntervalDayMinute").addClass("errorC");
            $(".errorTransmitIntervalDay").html("*请选择具体时间");
            $(".errorTransmitIntervalDay").css("display", "block");
            preventDefaultFlag = true;
        }
    }
};
$("#transmitIntervalDayHour").focus(function () {
    if ($("#transmitIntervalDayHour").val() == "") {
        $("#transmitIntervalDayHour").removeClass("errorC");
        $(".errorTransmitIntervalDay").hide();
    }
});
$("#transmitIntervalDayMinute").focus(function () {
    if ($("#transmitIntervalDayMinute").val() == "") {
        $("#transmitIntervalDayMinute").removeClass("errorC");
        $(".errorTransmitIntervalDay").hide();
    }
});
$("#transmitIntervalDayHour").blur(function () {
    checkTransmitIntervalDay();
});
$("#transmitIntervalDayMinute").blur(function () {
    checkTransmitIntervalDay();
});

function checkInsertMode() {
    if (directExchangeMethod == "TRANSMIT") {
        dstDbType = $("#dstDbList").data("type");
        if (dstDbType == "ODPS") {
            insertMode = $("#insertModeOdps").val();
            if (insertMode == "0") {
                $("#insertModeOdps").addClass("errorC");
                $(".errorInsertModeOdps").html("*请选择清理规则");
                $(".errorInsertModeOdps").css("display", "block");
                preventDefaultFlag = true;
            }
        } else if (dstDbType == "ADS") {
            insertMode = "2";
        } else {
            insertMode = $("#insertMode").val();
            if (insertMode == "0") {
                $("#insertMode").addClass("errorC");
                $(".errorInsertMode").html("*请选择导入规则");
                $(".errorInsertMode").css("display", "block");
                preventDefaultFlag = true;
            }
        }
    }
};
$("#insertMode").focus(function () {
    if ($("#insertMode").val() == "0") {
        $("#insertMode").removeClass("errorC");
        $(".errorInsertMode").hide();
    }
});
$("#insertMode").blur(function () {
    checkInsertMode();
});

$("#insertModeOdps").focus(function () {
    if ($("#insertModeOdps").val() == "0") {
        $("#insertModeOdps").removeClass("errorC");
        $(".errorInsertModeOdps").hide();
    }
});
$("#insertModeOdps").blur(function () {
    checkInsertMode();
});

function checkFlushNumber() {
    if (directExchangeMethod == "TRANSMIT" && dstDbType != "ODPS" && dstDbType != "") {
        flushNumber = $("#flushNumber").val();
        var ret = inputCheckNum(flushNumber);
        if (!ret || parseInt(flushNumber) < 1000 || parseInt(flushNumber) > 10000) {
            $("#flushNumber").addClass("errorC");
            $(".errorFlushNumber").html("*单次提交记录数必须是数字，且在1000-10000之间");
            $(".errorFlushNumber").css("display", "block");
            preventDefaultFlag = true;
        }
    }
};
$("#flushNumber").focus(function () {
    $("#flushNumber").removeClass("errorC");
    $(".errorFlushNumber").hide();

});
$("#flushNumber").blur(function () {
    checkFlushNumber();
});

function checkMaxSizePerTime() {
    var resourceParamType = $("#resourceParamType").val();
    if (resourceParamType == "Oracle+") {
        maxSizePerTime = $("#maxSizePerTime").val();
        if(maxSizePerTime != ""){
            var ret = inputCheckNum(maxSizePerTime);
            if (!ret || parseInt(maxSizePerTime) < 1000 || parseInt(maxSizePerTime) > 10000) {
                $("#maxSizePerTime").addClass("errorC");
                $(".errorMaxSizePerTime").html("*单次提交记录数必须是数字，且在1000-10000之间");
                $(".errorMaxSizePerTime").css("display", "block");
                preventDefaultFlag = true;
            }
        }
    }
};
$("#maxSizePerTime").focus(function () {
    $("#maxSizePerTime").removeClass("errorC");
    $(".errorMaxSizePerTime").hide();

});
$("#maxSizePerTime").blur(function () {
    checkMaxSizePerTime();
});


function checkWhere() {
    var connectId = $("#connectId").val();
    var tableName = $("#dbTable").val();
    var column = "";
    //   var data = "";
    updateDbTableColumns("srcDbTableColumnsTable");
    column = srcDbColumns;

    where = $("#where").val();
    if (where == "") {
        return;
    }

    $.post("/" + proName + "/mydata/demand/parsesql",
        {
            column: column,
            dbID: connectId,
            params: getParamsJson(),
            tableName: tableName,
            where: where
        },
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
            } else {
                preventDefaultFlag = true;
                dmallError("where条件填写错误")
            }
        },
        "json"
    );
}

function checkAllItems() {
    preventDefaultFlag = false;

    checkSplitPk();
    checkScheduleType();
    checkTransmitIntervalMinute();
    checkTransmitIntervalWeek();
    checkTransmitIntervalMonth();
    checkTransmitIntervalDay();

    //checkDb();
    checkWhere();

    checkInsertMode();
    checkFlushNumber();
    checkMaxSizePerTime();
    if(prepareType == "create"){
        checkExchangeIntervalValue();
    }

//    checkPatition();
};

//变量区
var paraPreventDefaultFlag = false;
var regName = /^[a-zA-Z]{0,20}$/;
var regInt = /^\[[0-9]{1,50}(,[0-9]{1,50})*\]$/;
var regString = /^\["[a-zA-Z0-9_\u4e00-\u9fa5]{1,50}"(,"[a-zA-Z0-9_\u4e00-\u9fa5]{1,50}")*\]$/;
var regTime = /^((\+|\-){1}([1-9]|[1-9][0-9]|100)(Y){1})?((\+|\-){1}([1-9]|10|11|12)(M){1})?((\+|\-){1}([1-9]|[1-2][0-9]|30|31)(D){1})?((\+|\-){1}([1-9]|[1][0-9]|20|21|22|23|24)(h){1})?((\+|\-){1}([1-9]|[1-5][0-9]|60)(m){1})?((\+|\-){1}([1-9]|[1-5][0-9]|60)(s){1})?$/;
var $pbasedatetime = $("#pbasedatetime");
var enums = [];
var tableArray = [];
var datetimes = [];
var $selectAllParam = $("#selectAllParam");
var $enabledIdsParam = $("#paramTable input[name='ids']:enabled");
var oldParam = null;
var globalIndex = -1;
var oldparamName = "";

function createTableArryFromParamsJson(paramsJson) {
    if (paramsJson == null) {
        return;
    }
    var whereParams = jQuery.parseJSON(paramsJson);
    $.each(whereParams, function (key, value) {
        for (var i = 0; i < value.length; i++) {
            var tableArrayP = value[i];

            var tableParam = {};
            if (key == "datetimes") {
                tableParam.name = tableArrayP.name;
                tableParam.type = "datetime";
                tableParam.values = "$" + tableArrayP.source + ".format(\"" + tableArrayP.format + "\")" + tableArrayP.offset;
                tableParam.format = tableArrayP.format;
                tableParam.offset = tableArrayP.offset;
                tableParam.source = tableArrayP.source;
            } else if (key == "enums") {
                tableParam.name = tableArrayP.name;
                tableParam.subtype = tableArrayP.subtype;
                tableParam.type = "enum";
                tableParam.values = JSON.stringify(tableArrayP.values);
            }
            tableArray.push(tableParam);
        }
    });
    createParamArray();
}

function getParamsJson() {
    var params = "";
    if (tableArray.length > 0) {
        var param = createParamArray();
        params = JSON.stringify(param);
    }
    return params;
}
// 全选
$selectAllParam.click(function () {
    var $this = $(this);
    $enabledIdsParam = $("#paramTable input[name='ids']:enabled");
    if ($this.prop("checked")) {
        $enabledIdsParam.prop("checked", true);
    } else {
        $enabledIdsParam.prop("checked", false);
    }
});
$("#paramTable").delegate("input[name='ids']:enabled", "click", function () {
    var columnsSize = $("#paramTable input[name='ids']:enabled:not(:checked)").size();
    if (0 < columnsSize) {
        $("#selectAllParam").prop("checked", false);
    } else {
        $("#selectAllParam").prop("checked", true);
    }
});
//打开帮助说明
$("#paramhelp").click(function (event) {
        $('#paramhelpModal').modal({backdrop: 'static', keyboard: false});
    }
);
//新增变量
$("#addParamBtn").click(function (event) {
    emptyModal("addParam");
    $('#addParam').modal({backdrop: 'static', keyboard: false});
    //  $("#pname").focus();
});

//编辑变量
function editParam(index) {
    var editedParam = tableArray[index];
    oldParam = editedParam;
    globalIndex = index;

    $('#addParam').modal({backdrop: 'static', keyboard: false});
    oldparamName = editedParam.name;
    $('#pname').val(editedParam.name);
    switch (editedParam.type) {
        case "enum":
            $('#ptype').val("enum");
            $("#enumWrap").show();
            switch (editedParam.subtype) {
                case "int":
                    $('#psubtype').val("int");
                    break;
                case "string":
                    $('#psubtype').val("string");
                    break;
            }
            $('#pvalues').val(editedParam.values);
            break;
        case "datetime":
            $('#ptype').val("datetime");
            $("#datetimeWrap").show();
            $('#pbasedatetime').val(editedParam.source);
            $('#pdatetimeformat').val(editedParam.format);
            $('#ptimeoffset').val(editedParam.offset);
            break;
    }
}


////编辑取消
//function editCancel(oldParam) {
//    if(oldParam)
//        tableArray.push(oldParam);
//    initParamTable();
//    createParamArray();
//    $("#pname").val("");
//    $("#ptype").val("");
//    $("#psubtype").val("");
//    $("#pvalues").val("");
//    $("#pbasedatetime").val("");
//    $("#pdatetimeformat").val("");
//    $("#ptimeoffset").val("");
//    $("#datetimeWrap").hide();
//    $("#enumWrap").hide();
//    $("#addParam").hide();
//    oldParam = null;
//}

$("#ptype").change(function () {
    var ptype = $("#ptype option:selected").val();
    validateValue($("#ptype"), $(".errorPtype"), "*请选择变量类型", "", "");
    $("#enumWrap").hide();
    $("#datetimeWrap").hide();
    $("#" + ptype + "Wrap").show();
});

$("#psubtype").change(function () {
    var psubtype = $("#psubtype option:selected").val();
    validateValue($("#psubtype"), $(".errorPsubtype"), "*请选择字段类型", "", "");
});

$pbasedatetime.change(function () {
    var pbasedatetime = $("#pbasedatetime option:selected").val();
    validateValue($pbasedatetime, $(".errorPbasedatetime"), "*请选择基准时间", "", "");
});

$("#pdatetimeformat").change(function () {
    var pdatetimeformat = $("#pdatetimeformat option:selected").val();
    validateValue($("#pdatetimeformat"), $(".errorPdatetimeformat"), "*请选择时间格式", "", "");
});

//取消新变量
$("#addParamCancel").click(function () {
    globalIndex = -1;
    refresh();
    $('#addParam').hide();
    $('#addParam').modal('hide');
    $('#restartJobModal').modal({backdrop: 'static', keyboard: false});
});
//关闭新变量
$("#addParamClose").click(function () {
    globalIndex = -1;
    refresh();
});
//创建新变量
$("#addParamCommit").click(function () {
    //组装数据
    var tableParam = {};
    var pname = $("#pname").val();
    var ptype = $("#ptype").val();
    var psubtype = $("#psubtype").val();
    var pbasedatetime = $("#pbasedatetime").val();
    var pdatetimeformat = $("#pdatetimeformat").val();
    var ptimeoffset = $("#ptimeoffset").val();

    validateValue($("#pname"), $(".errorPname"), "*请输入变量名称", "*变量名只能包含字母，且不超过20个字符", regName);
    validateValue($("#psubtype"), $(".errorPsubtype"), "*请选择字段类型", "", "");

    if (ptype == "enum") {
        validateValue($("#ptype"), $(".errorPtype"), "*请选择变量类型", "", "");
        if (psubtype == "int") {
            validateValue($("#pvalues"), $(".errorPvalues"), "*请输入变量表达式", "*格式不正确，值应为数组形式数字，且单个数字长度小于等于50", regInt);
        } else {
            validateValue($("#pvalues"), $(".errorPvalues"), "*请输入变量表达式", "*格式不正确，值应为数组形式字符串，且单个字符串长度小于等于50", regString);
        }
    }
    else {
        validateValue($pbasedatetime, $(".errorPbasedatetime"), "*请选择基准时间", "", "");
        validateValue($("#pdatetimeformat"), $(".errorPdatetimeformat"), "*请选择时间格式", "", "");
        if ($("#ptimeoffset").val() != "") {
            validateValue($("#ptimeoffset"), $(".errorPtimeoffset"), "*请输入偏移量", "*请输入正确格式,如，+3s，-4M，[+|-]数值[Y|M|D|h|m|s]", regTime);
        }

    }
    if (paraPreventDefaultFlag) {
        return false;
    }
    else {
        if (ptype == "datetime") {
            ptimeoffset = $("#ptimeoffset").val();
            //组装表格数据
            tableParam.name = pname;
            tableParam.type = ptype;
            tableParam.values = "$" + pbasedatetime + ".format(\"" + pdatetimeformat + "\")" + ptimeoffset;
            tableParam.format = pdatetimeformat;
            tableParam.offset = ptimeoffset;
            tableParam.source = pbasedatetime;
        }
        else {
            var pvalues = $("#pvalues").val();
            //组装表格数据
            tableParam.name = pname;
            tableParam.subtype = psubtype;
            tableParam.type = ptype;
            tableParam.values = pvalues;
        }
        if (globalIndex == -1)
            tableArray.push(tableParam);
        else {
            tableArray.splice(globalIndex, 1, tableParam);
            globalIndex = -1;
        }

        initParamTable();
        createParamArray();
        refresh();
    }
    $('#addParam').hide();
    $('#addParam').modal('hide');
    $('#restartJobModal').modal({backdrop: 'static', keyboard: false});
});

//清空addParam界面
function refresh() {
    $("#pname").val("");
    $("#ptype").val("");
    $("#psubtype").val("");
    $("#pvalues").val("");
    $("#pbasedatetime").val("");
    $("#pdatetimeformat").val("");
    $("#ptimeoffset").val("");
    $("#datetimeWrap").hide();
    $("#enumWrap").hide();
    $("#addParam").hide();
}
//getSQL
$("#getSQL").click(function () {
    var connectId = $("#connectId").val();
    var tableName = $("#dbTable").val();
    var column = "";
    //  var data = "";
    updateDbTableColumns("srcDbTableColumnsTable");
    column = srcDbColumns;

    where = $("#where").val();
    $.post("/" + proName + "/center/demand/parsesql",
        {
            column: column,
            dbID: connectId,
            params: getParamsJson(),
            tableName: tableName,
            where: where
        },
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                var $listAll = $('#sqlWrap');
                $listAll.empty();
                var body = eval("(" + data.body + ")");
                var sql = body.sql;
                if (typeof(sql) != "string") {
                    for (var i = 0; i < sql.length; i++) {
                        var newLi = "<li>" + sql[i] + "</li>";
                        $listAll.append(newLi);
                    }
                } else {
                    var newLi = "<li>" + sql + "</li>";
                    $listAll.append(newLi);
                }
            } else {
                dmallError("获取SQL失败");
            }
        },
        "json"
    );
    return false;
});

function createParamArray() {
    var param = new Object();

    enums = [];
    datetimes = [];

    for (var i = 0; i < tableArray.length; i++) {
        var newparam = {};
        var tableArrayP = tableArray[i];
        if (tableArrayP.type == "enum") {
            newparam.name = tableArrayP.name;
            newparam.subtype = tableArrayP.subtype;
            newparam.values = eval(tableArrayP.values);
            if (newparam.name) {
                enums.push(newparam);
            }
        }
        else {
            newparam.name = tableArrayP.name;
            newparam.format = tableArrayP.format;
            newparam.offset = tableArrayP.offset;
            newparam.source = tableArrayP.source;
            if (newparam.name) {
                datetimes.push(newparam);
            }
        }
    }
    param.enums = enums;
    param.datetimes = datetimes;

    return param;
}
//删除变量
$("#delParamBtn").click(function () {
    var indexList = [];
    if($("#selectAllParam").prop("checked")){
        for (var i = 0; i < $("#paramTable input[name='ids']:enabled:checked").size(); i++) {
            var idsValue = $("#paramTable input[name='ids']:enabled:checked")[i].value;
            idsValue = idsValue.substring(3, idsValue.length);
            indexList.push(idsValue);
        }
    } else{
        for (var i = 0; i < $("#paramTable input[name='ids']:enabled:checked").size(); i++) {
            var idsValue = $("#paramTable input[name='ids']:enabled:checked")[i].value;
            idsValue = idsValue.substring(3, idsValue.length);
            var delParamName = tableArray[idsValue].name;
            for(var j=0;j<tableArray.length;j++){
                if(tableArray[j].source && delParamName == tableArray[j].source){
                    dmallError("该变量已被其他变量使用，不能删除");
                    //   $("#paramTable input[name='ids']").attr("checked",false);
                    return;
                }
            }
            indexList.push(idsValue);
        }
    }
    if (indexList.length <= 0) {
        dmallError("未选中任何参数");
    } else {
        removeParam(indexList);
        createParamArray();
        initParamTable();
        $("#selectAllParam").attr("checked",false);
    }
});
function removeParam(indexs) {
    var table = tableArray;
    for (var i = 0; i < indexs.length; i++) {
        var arg = indexs[i];
        table.splice(arg - i, 1);
    }
    //createParamArray();
}
//变量名验证
$("#pname").focus(function () {
    $("#pname").removeClass("errorC");
    $(".errorPname").hide();
});
$("#pname").blur(function () {
    validateValue($("#pname"), $(".errorPname"), "*请输入变量名称", "*变量名只能包含字母，且不超过20个字符", regName);
    checkUniq();
});
$("#pname").on("keyup", function () {
    validateValue($("#pname"), $(".errorPname"), "*请输入变量名称", "*变量名只能包含字母，且不超过20个字符", regName);
    checkUniq();
});
//变量表达式验证
$("#pvalues").focus(function () {
    $("#pvalues").removeClass("errorC");
    $(".errorPvalues").hide();
});
$("#pvalues").blur(function () {
    var psubtype = $("#psubtype").val();
    if (psubtype == "int") {
        validateValue($("#pvalues"), $(".errorPvalues"), "*请输入变量表达式", "*格式不正确，值应为数组形式数字，且单个数字长度小于等于50", regInt);
    } else {
        validateValue($("#pvalues"), $(".errorPvalues"), "*请输入变量表达式", "*格式不正确，值应为数组形式字符串，且单个字符串长度小于等于50", regString);
    }
});
$("#pvalues").on("keyup", function () {
    var psubtype = $("#psubtype").val();
    if (psubtype == "int") {
        validateValue($("#pvalues"), $(".errorPvalues"), "*请输入变量表达式", "*格式不正确，值应为数组形式数字，且单个数字长度小于等于50", regInt);
    } else {
        validateValue($("#pvalues"), $(".errorPvalues"), "*请输入变量表达式", "*格式不正确，值应为数组形式字符串，且单个字符串长度小于等于50", regString);
    }
});
//偏移量验证
$("#ptimeoffset").focus(function () {
    $("#ptimeoffset").removeClass("errorC");
    $(".errorPtimeoffset").hide();
});
$("#ptimeoffset").blur(function () {
    if ($("#ptimeoffset").val() != "") {
        validateValue($("#ptimeoffset"), $(".errorPtimeoffset"), "*请输入偏移量", "*请输入正确格式,如，+3s，-4M，[+|-]数值[Y|M|D|h|m|s]", regTime);
    }
});
$("#ptimeoffset").on("keyup", function () {
    if ($("#ptimeoffset").val() != "") {
        validateValue($("#ptimeoffset"), $(".errorPtimeoffset"), "*请输入偏移量", "*请输入正确格式,如，+3s，-4M，[+|-]数值[Y|M|D|h|m|s]", regTime);
    }
});

//重置table
function initParamTable() {
    $("#paramTable").empty();
    if (tableArray.length) {
        for (var i = 0; i < tableArray.length; i++) {
            var tableArrayP = tableArray[i];
            var newRow = '<tr><td><input type="checkbox" name="ids" value="ids' + i + '"></td>' +
                '<td align="center" onclick="editParam(' + i + ')" style="color:blue;cursor:pointer">' + tableArrayP.name + '</td>' +
                '<td align="center">' + tableArrayP.type + '</td>' +
                '<td align="center">' + tableArrayP.values + '</td></tr>';
            $("#paramTable").append(newRow);
        }
    }
}
//表单验证
function validateValue($selector, $classname, errMsg1, errMsg2, reg) {
    if ($selector.val() == "") {
        $selector.addClass("errorC");
        $classname.html(errMsg1);
        $classname.css("display", "block");
        paraPreventDefaultFlag = true;
    } else if (reg != "" && !reg.test($selector.val())) {
        $selector.addClass("errorC");
        $classname.html(errMsg2);
        $classname.css("display", "block");
        paraPreventDefaultFlag = true;
    } else {
        $selector.removeClass("errorC");
        $classname.hide();
        paraPreventDefaultFlag = false;
    }
}
//变量名唯一性验证
function checkUniq() {
    var paramName = $("#pname").val();
    if(paramName != oldparamName){
        for (var i = 0; i < tableArray.length; i++) {
            if (paramName == tableArray[i].name) {
                $("#pname").addClass("errorC");
                $(".errorPname").html("*变量名已存在");
                $(".errorPname").css("display", "block");
                paraPreventDefaultFlag = true;
            }
        }
        if(paramName == "dxtDatetime" || paramName == "dxtLastDatetime"){
            $("#pname").addClass("errorC");
            $(".errorPname").html("*与系统变量名冲突");
            $(".errorPname").css("display", "block");
            paraPreventDefaultFlag = true;
        }
    }
}

function stopJob(obj, exchangeId){
    //todo:暂停传输

    $.post("/" + proName + "/center/db/manage/exchange/stop/" + exchangeId,
        {
        },
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                dmallNotifyAndLocation("操作成功", window.location.href)
            } else {
                dmallError(data.result);
            }
        },
        "json"
    );

    $("#div1").hide();
    $("#div2").show();
}

function stopUsing(obj, catalogId){
    $.post("stop/using",
        {
            cmHisId:catalogId
        },
        function (data, status) {
            if(data.result == "success"){
                $("#usingStopDiv").hide();
                $("#usingSpaceDiv").hide();
                $("#usingStartDiv").show();
                dmallNotify("操作成功")
            } else {
                dmallError(data.result);
            }
        },
        "json");
}

function runJob(obj, exchangeId){
    //todo:暂停传输

    $.post("/" + proName + "/center/db/manage/exchange/run/" + exchangeId,
        {},
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                dmallNotifyAndLocation("操作成功", window.location.href)
            } else {
                dmallError(data.result);
            }
        },
        "json"
    );

    $("#div2").hide();
    $("#div1").show();
}

function runUsing(obj, catalogId){
    $.post("run/using",
        {
            cmHisId:catalogId
        },
        function (data, status) {
            if(data.result == "success"){
                $("#usingStopDiv").show();
                $("#usingSpaceDiv").hide();
                $("#usingStartDiv").hide();
                dmallNotify("操作成功")
            } else {
                dmallError(data.result);
            }
        },
        "json");
}

function restartJob(obj, exchangeId){
    upgradeMode = "RECREATE";
    $("#selectAllParam").attr("checked", false);
    $("#paramTable").empty();
    $("#where").val("");
    $("#sqlWrap").empty();
    $("#insertMode").find("option[value='0']").attr("selected",true);
    $("#insertMode").removeClass("errorC");
    $(".errorInsertMode").hide();
    $("#flushNumber").val("");
    $("#flushNumber").removeClass("errorC");
    $(".errorFlushNumber").hide();
    $("#infoDiv").hide();
    $("#restartJobModalLabel").show();
    $('#restartJobModal').modal({backdrop: 'static', keyboard: false});
}

function modifyParam(obj, exchangeId){
    upgradeMode = "UPDATE";
    $("#selectAllParam").attr("checked", false);
    $("#paramTable").empty();
    $("#where").val("");
    $("#sqlWrap").empty();
    $("#insertMode").find("option[value='0']").attr("selected",true);
    $("#insertMode").removeClass("errorC");
    $(".errorInsertMode").hide();
    $("#flushNumber").val("");
    $("#flushNumber").removeClass("errorC");
    $(".errorFlushNumber").hide();
    $("#infoDiv").hide();
    $("#modifyParamModalLabel").show();
    $('#restartJobModal').modal({backdrop: 'static', keyboard: false});
}

function modal_close1(){
    $('#addParam').hide();
    $('#addParam').modal('hide');
    $('#restartJobModal').modal({backdrop: 'static', keyboard: false});
}
function modal_close2(){
    $('#paramhelpModal').hide();
    $('#paramhelpModal').modal('hide');
    $('#restartJobModal').modal({backdrop: 'static', keyboard: false});
}
function first_modal_close(){
    $('#restartJobModal').modal('hide');
}

// 确认修改框
function modifyParams(obj, exchangeId) {

    $('#confirmContinueModel').modal({backdrop: 'static', keyboard: false});

}

// 修改参数
function confirmContinue(exchangeId, catalogId) {

    $.post("/" + proName + "/center/db/manage/exchange/stop/" + exchangeId,
        {},
        function (data, status) {
            if (data.result == "success") {
                $.post("/" + proName + "/center/db/manage/exchange/stop/using",
                    {
                        cmHisId: catalogId
                    },
                    function (data, status) {
                        if (data.result == "success") {
                            window.location.href = "/" + proName + "/center/db/manage/exchange/record/modify?exchangeId=" + exchangeId + "&upgradeMode=UPDATE";
                        } else {
                            dmallError(data.result);
                        }
                    },
                    "json"
                );
            } else {
                dmallError(data.result);
            }
        },
        "json"
    );
}

$("#isNoticeOption").click(function () {

    if ($("#isNoticeOption").attr("checked") == "checked") {
        $("#updateReasonDiv").show();
    } else {
        $("#updateReasonDiv").hide();
    }
});

function viewAllColumns(){
    $('#dstTableInfoModal').modal({backdrop: 'static', keyboard: false});
}