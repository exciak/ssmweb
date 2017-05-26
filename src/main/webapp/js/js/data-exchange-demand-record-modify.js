/**
 * Created by xunzhi on 2015/8/24.
 */

$(document).ready(function () {
    unselectAllSrcColumns();
    initExchangePara();
    $("#confirm_btn").click(function (event) {
        checkAllItems();
        if (preventDefaultFlag === true) {
            event.preventDefault();
            preventDefaultFlag = false;
            return;
        }
        $('#modifyJobModal').modal({backdrop: 'static', keyboard: false});
    });

    $("#modifyJobModalBtn").click(function () {
        var maxSizePerTime = getMaxSizePerTime();
        $.post("modify",
            {
                exchId: $("#exchangeId").val(),
                exchangeMethod: getDirectExchangeMethod(),
                scheduleType: getScheduleType(),
                minute: getMinute(),
                minuteOfHour: getMinuteOfHour(),
                hourOfDay: getHourOfDay(),
                weekday: getWeekday(),
                dayOfMonth: getDayOfMonth(),
                srcColumns: getSrcDbColumns(),
                srcColumnsType: getSrcDbTypeColumns(),
                splitPk: getSplitPk(),
                where: getWhere(),
                params: getParamsJson(),
                destDbId: getDstId(),
                destTableName: getDstDbTable(),
                destColumns: getDstDbColumns(),
                destColumnsType: getDstCheckedDbTypeColumns(),
                partition: getPartition(),
                insertMode: getInsertMode(),
                flushNumber: getFlushNumber(),
                action: "Agree",
                maxSizePerTime:maxSizePerTime
            },
            function (data, status) {
                if (data.result != "success") {
                    dmallError(data.result);
                } else {
                    window.location.href = "../record?exchangeId=" + $("#exchangeId").val();
                }
            },
            "json");
    });

    function initExchangePara() {
        var curDirectExchangeMethod = $("#curDirectExchangeMethod").val();

        $.get("para",
            {
                exchangeId: $("#exchangeId").val()
            },
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {

                    if (curDirectExchangeMethod == "TRANSMIT") {
                        var srcDbColumn = data.srcDbColumn;
                        var srcDbColumnArray = srcDbColumn.split(",");
                        $("#srcDbTableColumnsTable tr").each(function (trindex, tritem) {
                            var srcColumn = $(this).children("td").eq(3).text();
                            var checkTag = false;
                            $.each(srcDbColumnArray, function (n, value) {
                                if (srcColumn == value) {
                                    checkTag = true;
                                }
                            });
                            if (checkTag) {
                                $(this).find(":checkbox").prop("checked",true);
                            }else{
                                $(this).find(":checkbox").prop("checked",false);
                                $(this).hide();
                            }
                        });
                        if (srcDbColumnArray.length == $("#srcDbTableColumnsTable tbody").find("tr").length) {
                            $("#selectAllSrcColumns").prop("checked", true);
                        }
                    } else {
                        selectAllSrcColumns();
                        disableAllSrcColumns();
                    }
                    if(data.resourceParamType == "Oracle+"){
                        $("#maxSizePerTimePara").show();
                        $("#maxSizePerTime").val(data.maxSizePerTime);
                    }else{
                        $("#maxSizePerTimePara").hide();
                    }
                    $("#splitPk").val(data.splitPk);
                    $("#where").val(data.whereCondition);

                    var whereParams = jQuery.parseJSON(data.whereParams);
                    if (whereParams != null) {
                        var i = 0;
                        $.each(whereParams, function (key, value) {
                            for (var j = 0; j < value.length; j++) {
                                var tableArrayP = value[j];
                                var values = "";
                                var type = "";
                                if (key == "datetimes") {
                                    values = "$" + tableArrayP.source + ".format(\"" + tableArrayP.format + "\")" + tableArrayP.offset;
                                    type = "datetime";
                                } else if (key == "enums") {
                                    if (tableArrayP.values.length > 0) {
                                        values = JSON.stringify(tableArrayP.values);
                                    }
                                    type = "enum";
                                }
                                var newRow = '<tr><td><input type="checkbox" name="ids" value="ids' + i + '"></td>' +
                                    '<td align="center" onclick="editParam(' + i + ')" style="color:blue;cursor:pointer">' + tableArrayP.name + '</td>' +
                                    '<td align="center">' + type + '</td>' +
                                    '<td align="center">' + values + '</td></tr>';
                                $("#paramTable").append(newRow);
                                i++;
                            }
                        });
                    }

                    createTableArryFromParamsJson(data.whereParams);

                    $("#scheduleTypeList").val(data.scheduleType);
                    var scheduleType = data.scheduleType;
                    if (scheduleType == "none") {
                        $("#transExpireTimePara").hide();
                        $("#scheduleTypeList").attr("disabled",true);
                    } else if (scheduleType == "minute") {
                        $("#scheduleTypeList option[value='none']").remove();
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
                        $("#scheduleTypeList option[value='none']").remove();
                        $("#transmitIntervalWeek").show();
                        $("#transmitIntervalDay").show();
                        var obj = jQuery.parseJSON(data.scheduleInterval);
                        $("#transmitIntervalDayMinute").val(obj.minute);
                        $("#transmitIntervalDayHour").val(obj.hourOfDay);
                        $("#transmitIntervalWeekValue").val(obj.weekday);
                    } else if (scheduleType == "dayOfMonth") {
                        $("#scheduleTypeList option[value='none']").remove();
                        $("#transmitIntervalMonth").show();
                        $("#transmitIntervalDay").show();
                        var obj = jQuery.parseJSON(data.scheduleInterval);
                        $("#transmitIntervalDayMinute").val(obj.minute);
                        $("#transmitIntervalDayHour").val(obj.hourOfDay);
                        $("#transmitIntervalMonthValue").val(obj.dayOfMonth);
                    }

                    $.get("../../../dbaccess/dbaccess_detail",
                        {
                            dbaccessID: data.desDbId,
                            usage: "catalog"
                        },
                        function (dbsrc, status) {
                            if ((status == "success") && (dbsrc.result == "success")) {
                                $("#dstDbList").val(dbsrc.dbaccess.name);
                                $("#dstDbList").data("srcid", dbsrc.dbaccess.id);
                                $("#dstDbList").data("type", dbsrc.dbaccess.type);

                                var dstDbType = $("#dstDbList").data("type");
                                if (dstDbType == "ODPS") {
                                    $("#insertModePara").hide();
                                    $("#flushNumberPara").hide();
                                    $("#odpsPara").show();
                                    $("#insertModeOdps").val(data.insertMode);
                                } else if (dstDbType == "ADS") {
                                    $("#insertModePara").hide(); // ADS不支持该参数
                                    $("#flushNumberPara").show();
                                    $("#flushNumber").val(data.flushNumber);
                                    $("#odpsPara").hide();
                                } else {
                                    $("#insertModePara").show();
                                    $("#insertMode").val(data.insertMode);
                                    $("#flushNumberPara").show();
                                    $("#flushNumber").val(data.flushNumber);
                                    $("#odpsPara").hide();
                                }
                            } else {
                                dmallError("获取数据源失败");
                            }
                        },
                        "json"
                    );

                    if (curDirectExchangeMethod == "TRANSMIT") {
                        $.get("../prepare/tables",
                            {
                                dbSrcId: data.desDbId
                            },
                            function (tables, status) {
                                $("#loadingDbTable").hide();

                                if (status == "success") {
                                    if (tables.resultList.length == 0) {
                                        dmallError("没有获取到表");
                                    } else {
                                        for (var i = 0; i < tables.resultList.length; i++) {
                                            var table = tables.resultList[i];
                                            var newOption = new Option(table, table);
                                            $("#dbTableList").append(newOption);

                                            if (table == data.desDbTable) {
                                                $("#dbTableList").val(table);
                                            }
                                        }
                                    }
                                } else {
                                    dmallError("获取表失败");
                                }
                            },
                            "json"
                        );

                        $("#loadingDbColumns").show();
                        $.get("../prepare/columns",
                            {
                                dbSrcId: data.desDbId,
                                dbTableName: data.desDbTable
                            },
                            function (columns, status) {
                                $("#loadingDbColumns").hide();
                                if (status == "success") {

                                    $("#partitionTable tbody").empty();
                                    $("#partitionWrap").hide();

                                    if (!columns.tableInfo) {
                                        dmallError("没有获取到列");
                                    } else {
                                        $("#dstColumnsDiv").show();
                                        var tableInfo = columns.tableInfo;

                                        // 按照顺序显示选择的列
                                        var desDbColumn = data.desDbColumn;
                                        var desDbColumnArray = desDbColumn.split(",");
                                        $.each(desDbColumnArray, function (n, value) {
                                            for (var i = 0; i < tableInfo.columns.length; i++) {
                                                var column = tableInfo.columns[i];
                                                if (column.name == value) {
                                                    $('#dstCheckedTable').append('<tr><td>' +
                                                    '<input type="checkbox" hidden name="idsDbTableColumn" id="idsDbTableColumn' + i + '" data-name="' + column.name + '" data-type="' + column.type + '"/>' +
                                                    '</td><td>' + column.name + '</td><td>' + column.type +
                                                    '</td></tr>');
                                                    $("#idsDbTableColumn" + i).prop("checked", true);
                                                    $('#sortable').append('<tr><td>' +
                                                    '<input type="checkbox" name="idsDbTableColumn" id="idsDstTableColumn' + i + '" data-name="' + column.name + '" data-type="' + column.type + '"/>' +
                                                    '</td><td>' + column.name + '</td><td>' + column.type +
                                                    '</td></tr>');
                                                    $("#idsDstTableColumn" + i).prop("checked", true);
                                                }
                                            }
                                        });

                                        // 显示未选择的列
                                        for (var i = 0; i < tableInfo.columns.length; i++) {
                                            var column = tableInfo.columns[i];
                                            var append = false;
                                            var desDbColumn = data.desDbColumn;
                                            var desDbColumnArray = desDbColumn.split(",");
                                            $.each(desDbColumnArray, function (n, value) {
                                                if (column.name == value) {
                                                    append = true;
                                                }
                                            });
                                            if (append != true) {
                                                $('#sortable').append('<tr><td>' +
                                                '<input type="checkbox" name="idsDbTableColumn" id="idsDstTableColumn' + i + '" data-name="' + column.name + '" data-type="' + column.type + '"/>' +
                                                '</td><td>' + column.name + '</td><td>' + column.type +
                                                '</td></tr>');
                                            }
                                        }

                                        var dstColumnsSize = $("#sortable input[name='idsDbTableColumn']:enabled:not(:checked)").size();
                                        if (0 < dstColumnsSize) {
                                            $("#selectAllColumns").prop("checked", false);
                                        } else {
                                            $("#selectAllColumns").prop("checked", true);
                                        }

                                        if (tableInfo.partitions.length > 0) {
                                            for (var i = 0; i < tableInfo.partitions.length; i++) {
                                                var partition = tableInfo.partitions[i];

                                                var trHTML = '<tr><td><input type="checkbox" checked hidden></td><td>' + partition + '</td>' +
                                                    '<td><input type="text" class="form-control" id="partitionColumnValue' + i + '" value=""/><small class="text-danger"></small></td></tr>';

                                                $("#partitionTable").append(trHTML);

                                                var desPartition = jQuery.parseJSON(data.desPartition);
                                                $.each(desPartition, function (key, value) {
                                                    if (key == partition) {
                                                        $("#partitionColumnValue" + i).val(value);
                                                    }
                                                });
                                            }
                                            $("#partitionWrap").show();
                                        }
                                    }
                                } else {
                                    dmallError("获取列失败");
                                }
                            },
                            "json"
                        );
                    }
                } else {
                    dmallError("获取参数失败");
                }
            }
            ,
            "json"
        );
    }
});