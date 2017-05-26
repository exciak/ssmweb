/**
 * Created by xunzhi on 2015/8/24.
 */

$(document).ready(function () {

    var srcDbType = $("#srcDbType").val();

    $("#confirm_btn").click(function (event) {
        checkAllItems();

        if (preventDefaultFlag === true) {
            event.preventDefault();
            preventDefaultFlag = false;
            return;
        }

        $("#confirm_btn").attr("disabled", true);

        var dbId = $('#dstDbList').data("srcid");
        var dbTable = $('#dbTableList option:selected').val();

        var pathname = window.location.pathname;
        var arr = pathname.split("/");
        var proName = arr[1];
        var maxSizePerTime =getMaxSizePerTime();
        $.post("/" + proName + "/mydata/demand/obtain",
            {
                dataId: $("#inputHiddenDataId").val(),
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
                destColumns: dstDbColumns,
                destColumnsType: dstCheckedDbTypeColumns,
                partition: getPartition(),
                insertMode: insertMode,
                flushNumber : $("#flushNumber").val(),
                action: "Agree",
                maxSizePerTime:maxSizePerTime,
                expireTime: getExpireTime()
            },
            function (data, status) {
                if (data.result != "success") {
                    dmallError(data.result);
                    $("#confirm_btn").attr("disabled", false);
                } else {
                    window.location.href = "mydata/demand";
                }
            },
            "json");
    });
});