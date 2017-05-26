/**
 * Created by xunzhi on 2015/8/24.
 */

$(document).ready(function () {

    var srcDbType = $("#srcDbType").val();

    $("#agree_btn").click(function (event) {
        var dbId = $('#dstDbList').data("srcid");
        var dbTable = $('#dbTableList option:selected').val();

        checkAllItems();
        if (preventDefaultFlag === true) {
            event.preventDefault();
            preventDefaultFlag = false;
            return;
        }

        disableBtn();

        var maxSizePerTime =getMaxSizePerTime();
        $.post("prepare",
            {
                exchId: $("#orderId").val(),
                exchangeMethod: directExchangeMethod,
                scheduleType: scheduleType,
                minute: $("#transmitIntervalMinuteValue").val(),
                minuteOfHour: $('#transmitIntervalDayMinute option:selected').val(),
                hourOfDay: $('#transmitIntervalDayHour option:selected').val(),
                weekday: $('#transmitIntervalWeekValue option:selected').val(),
                dayOfMonth: $('#transmitIntervalMonthValue option:selected').val(),
                srcColumns: srcDbColumns,
                srcColumnsType: srcDbTypeColumns,
                splitPk: splitPk,
                where: $("#where").val(),
                params: getParamsJson(),
                destDbId: dbId,
                destTableName: dbTable,
                partition: getPartition(),
                destColumns: dstCheckedDbColumns,
                destColumnsType: dstCheckedDbTypeColumns,
                insertMode: insertMode,
                flushNumber : $("#flushNumber").val(),
                action: "Agree",
                maxSizePerTime:maxSizePerTime,
                expireTime: getExpireTime()
            },
            function (data, status) {
                if (data.result != "success") {
                    enableBtn();
                    dmallError(data.result);
                } else {
                    window.location.href = "../demand";
                }
            },
            "json");
    });

    $("#disagree_btn").click(function () {
        disableBtn();
        $.post("prepare",
            {
                exchId: $("#orderId").val(),
                action: "Disagree"
            },
            function (data, status) {
                if (data.result != "success") {
                    enableBtn();
                    dmallError(data.result);
                } else {
                    window.location.href = "../demand";
                }
            },
            "json");
    });

    $("#terminate_btn").click(function () {
        disableBtn();
        $.post("prepare",
            {
                exchId: $("#orderId").val(),
                action: "Terminate"
            },
            function (data, status) {
                if (data.result != "success") {
                    enableBtn();
                    dmallError(data.result);
                } else {
                    window.location.href = "../demand";
                }
            },
            "json");
    });

    function disableBtn() {
        $("#agree_btn").attr("disabled", true);
        if($("#disagree_btn").length > 0) {
            $("#disagree_btn").attr("disabled", true);
        }
        $("#terminate_btn").attr("disabled", true);
    }

    function enableBtn() {
        $("#agree_btn").attr("disabled", false);
        if ($("#disagree_btn") > 0) {
            $("#disagree_btn").attr("disabled", false);
        }
        $("#terminate_btn").attr("disabled", false);
    }
});