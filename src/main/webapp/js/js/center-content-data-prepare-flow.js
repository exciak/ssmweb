/**
 * Created by xunzhi on 2015/8/24.
 */
var destDbId="";
var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];
var isAlreadyStopExchange = false;
var createType = $("#createType").val();
var checkType;
var tableInfo;
var destDbColumuns;

$(document).ready(function () {
   // var srcDbType = $("#srcDbType").val();
    $("#agree_btn").click(function (event) {
        if($("#infoDiv").is(":visible")){
            checkAllItems();
            if (preventDefaultFlag === true) {
            event.preventDefault();
            preventDefaultFlag = false;
            return;
        }
            var dbId = $('#dstDbList').data("srcid");
            var dbTable = $("#resultTable").val();
            disableBtn();
            var maxSizePerTime =getMaxSizePerTime();
            var srcDbColumns = "";
            var srcDbTypeColumns = "";
            var dstDbColumns = "";
            var dstCheckedDbTypeColumns = "";
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
            if($("#isNoticeOption").attr("checked") == "checked"){
                isNotice = true;
            } else {
                updateReason = "";
            }

            $.post("cid",
                {
                    id: $("#catalogId").val(),
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
                    destDbId: destDbId,
                    destTableName: dbTable,
                    partition: getPartition(),
                    destColumns: dstDbColumns,
                    destColumnsType: dstCheckedDbTypeColumns,
                    insertMode: $("#insertMode option:selected").val(),
                    flushNumber : $("#flushNumber").val(),
                    result: "Agree",
                    maxSizePerTime:maxSizePerTime,
                    expireTime: getExpireTime(),
                    comment: "",
                    upgradeMode:$('input[name="upgradeMode"]').filter(":checked").val(),
                    isNotice:isNotice,
                    updateReason: updateReason
                },
                function (data, status) {
                    if(data.result == "success"){
                    window.location.href = "/" + proName + "/center/db/manage/catalogs";
                } else {
                    enableBtn();
                    dmallError(data.result);
                }
                },
                "json");
        } else{
            dmallError("请点击表检查完善信息");
        }
    });
    $("#resultTable").focus(function () {
        $("#errorResultTable").addClass("hidden");
        $("#emptyResultTable").addClass("hidden");
        $("#resultTable").removeClass("errorC");
    });
    /* 表检查，判断资源提供方是否配置了中间库 */
    $("#nextBtn").click(function(){
        if($("#resultTable").val() == ""){
            $("#resultTable").addClass("errorC");
            $("#emptyResultTable").removeClass("hidden");
            return false;
        } else{
            var ret = checkTableName($("#resultTable").val());
            if (!ret) {
                $("#errorResultTable").removeClass("hidden");
                $("#resultTable").addClass("errorC");
                return false;
            }
        }
        $("#nextBtn").attr("disabled",true);
        $("#resultTable").prop("readonly",true);
        if(createType == "UPDATE"){
            var type = $("[name='upgradeMode']").filter(":checked").val();
            if(type == "UPDATE"){
                $("#nextBtn").attr("disabled",false);
                $("#updateModal").modal({backdrop: 'static', keyboard: false});
            }else{
                $("#nextBtn").attr("disabled",false);
                $("#recreateModal").modal({backdrop: 'static', keyboard: false});
            }
        }else{
            checkTable("create");
        }
    });
    $("#updateBtn").click(function(){
        checkTable("update");
    });
    $("#recreateBtn").click(function(){
        checkTable("update");
    });
    $("#backBtn").click(function(){
        $("#infoDiv").hide();
        $("#nextBtn").show();
        $("#backBtn").hide();
        $("#agree_btn").hide();
        $("#sqlWrap").hide();
        $("#nextBtn").attr("disabled",false);
        emptyParams();
        if(createType == "UPDATE"){
            $("#updatePara").show();
        }else{
            $("#resultTable").prop("readonly",false);
        }
    });
    $("#checkTableModalBtn").click(function(){
        if(checkType == "update"){
            $("#updatePara").hide();
        }
        $("#nextBtn").hide();
        $("#backBtn").show();
        $("#agree_btn").show();
        $("#resultTable").prop("readonly",true);
        $("#dstCheckedTable").empty();
        //initDbCheckedTable();
        $("#loadingDbColumns").hide();
        if (!tableInfo) {
            dmallError("没有获取到列");
        } else {
            $("#infoDiv").show();
            $('#dstTableInfo').empty();
            for (var i = 0; i < tableInfo.columns.length; i++) {
                var column = tableInfo.columns[i];
                $('#dstTableInfo').append('<tr class="ui-state-default">' +
                    '<td width="40%">' + column.name + '</td><td width="60%">' + column.type +
                    '</td></tr>');
            }
            if (checkType == "update") {
                //停止传输
                stopNowTrans();
            }
        }
        if(!destDbColumuns){
            dmallError("没有获取到列");
        } else {
            $('#destDbTableColumn').empty();
            for (var i = 0; i < destDbColumuns.length; i++) {
                $('#destDbTableColumn').append('<tr class="ui-state-default">' +
                '<td width="40%">' + destDbColumuns[i].name + '</td><td width="60%">' + destDbColumuns[i].type +
                '</td></tr>');
            }
        }
        $("#srcTableInfoPanel").hide();
    });

    function checkTable(type){
        checkType = type;
        $.get("checkTable",
            {
                id: $("#catalogId").val(),
                desTable: $("#resultTable").val()
            },
            function (data, status) {
                if(data.result == "success") {
                    tableInfo = data.tableInfo;
                    destDbId = data.destDbId;
                    destDbColumuns = data.destDbColumuns;
                    if(data.checkTableMsg != null && data.checkTableMsg != ""){
                        $('#checkTableModal').modal({backdrop: 'static', keyboard: false});
                        $("#checkTableModalInfo").html(data.checkTableMsg + ",是否继续?");
                        $("#nextBtn").attr("disabled",false);
                        $("#resultTable").prop("readonly",false);
                    }else {
                        if(type == "update"){
                            $("#updatePara").hide();
                        }
                        $("#nextBtn").hide();
                        $("#backBtn").show();
                        $("#agree_btn").show();
                        $("#resultTable").prop("readonly",true);
                        $("#dstCheckedTable").empty();
                        //initDbCheckedTable();
                        $("#loadingDbColumns").hide();
                        if (!data.tableInfo) {
                            dmallError("没有获取到列");
                        } else {
                            $("#infoDiv").show();
                            $('#dstTableInfo').empty();
                            for (var i = 0; i < tableInfo.columns.length; i++) {
                                var column = tableInfo.columns[i];
                                $('#dstTableInfo').append('<tr class="ui-state-default">' +
                                    '<td width="40%">' + column.name + '</td><td width="60%">' + column.type +
                                    '</td></tr>');
                            }
                            if(type == "update"){
                                //停止传输
                                stopNowTrans();
                            }
                        }
                        if(!data.destDbColumuns){
                            dmallError("没有获取到列");
                        } else {
                            $('#destDbTableColumn').empty();
                            for (var i = 0; i < destDbColumuns.length; i++) {
                                $('#destDbTableColumn').append('<tr class="ui-state-default">' +
                                '<td width="40%">' + destDbColumuns[i].name + '</td><td width="60%">' + destDbColumuns[i].type +
                                '</td></tr>');
                            }
                        }
                        $("#srcTableInfoPanel").hide();
                    }
                } else {
                    $("#nextBtn").attr("disabled",false);
                    $("#resultTable").prop("readonly",false);
                    dmallError(data.result);
                }
            },
            "json"
        );
    }
    function disableBtn() {
        $("#agree_btn").attr("disabled", true);
        $("#backBtn").attr("disabled", true);
    }

    function enableBtn() {
        $("#agree_btn").attr("disabled", false);
        $("#backBtn").attr("disabled", false);
    }
    function init() {
        var provideType = $("#provideType").val();
        if(provideType == "ONCE" || provideType == "PERIODE") {
            $("#transmitScheduleType").show();
        }
    }
});
function emptyParams(){
    tableArray = [];
    $("#paramTable").empty();
    $("#maxSizePerTime").val("");
    $("#where").val("");
    $("#scheduleTypeList").val("none");
    $("#transmitIntervalMinute").hide();
    $("#transmitIntervalWeek").hide();
    $("#transmitIntervalMonth").hide();
    $("#transmitIntervalDay").hide();
    $("#insertMode").val("0");
    $("#flushNumber").val("");
    $("#transmitIntervalMinuteValue").val("");
    $("input").removeClass("errorC");
    $("select").removeClass("errorC");
    $(".text-danger").hide();
}

function viewAllColumns(){
    $('#dstTableInfoModal').modal({backdrop: 'static', keyboard: false});
}