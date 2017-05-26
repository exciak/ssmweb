
$(document).ready(function() {
    //变量区
    var whereParams = jQuery.parseJSON($("#params").val());
    var tableArray = [];
    if (null != whereParams) {
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
    }
    if (tableArray.length) {
        for (var i = 0; i < tableArray.length; i++) {
            var tableArrayP = tableArray[i];
            var newRow = '<tr><td align="center">' + tableArrayP.name + '</td>' +
                '<td align="center">' + tableArrayP.type + '</td>' +
                '<td align="center">' + tableArrayP.values + '</td></tr>';
            $("#paramTable").append(newRow);
        }
    }

    //传输周期
    var scheduleType = $("#scheduleType").val();
    var scheduleInterval = eval("(" + $("#scheduleInterval").val() + ")");
    if (scheduleType == "minute") {
        $("#transmitIntervalMinute").show();
        $("#transmitIntervalMinuteValue").html(scheduleInterval.minute);
    } else if (scheduleType == "hourOfDay") {
        $("#transmitIntervalDay").show();
        $("#transmitIntervalDayHour").html(scheduleInterval.hourOfDay+'点'+scheduleInterval.minute+'分');
    } else if (scheduleType == "weekday") {
        $("#transmitIntervalWeek").show();
        $("#transmitIntervalDay").show();
        if(scheduleInterval.weekday == "2"){
            $("#transmitIntervalWeekValue").html("星期一");
        } else if(scheduleInterval.weekday == "3"){
            $("#transmitIntervalWeekValue").html("星期二");
        } else if(scheduleInterval.weekday == "4"){
            $("#transmitIntervalWeekValue").html("星期三");
        } else if(scheduleInterval.weekday == "5"){
            $("#transmitIntervalWeekValue").html("星期四");
        } else if(scheduleInterval.weekday == "6"){
            $("#transmitIntervalWeekValue").html("星期五");
        } else if(scheduleInterval.weekday == "7"){
            $("#transmitIntervalWeekValue").html("星期六");
        } else if(scheduleInterval.weekday == "1"){
            $("#transmitIntervalWeekValue").html("星期日");
        }
        $("#transmitIntervalDayHour").html(scheduleInterval.hourOfDay+'点'+scheduleInterval.minute+'分');
    } else if (scheduleType == "dayOfMonth") {
        $("#transmitIntervalMonth").show();
        $("#transmitIntervalDay").show();
        $("#transmitIntervalMonthValue").html(scheduleInterval.dayOfMonth+'日');
        $("#transmitIntervalDayHour").html(scheduleInterval.hourOfDay+'点'+scheduleInterval.minute+'分');
    }

});
