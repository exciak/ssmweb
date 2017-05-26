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

var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];

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

function init() {


    switch (prepareType) {
        case "create":
            selectAllSrcColumns();
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
                disableAllSrcColumns();
                checkOdpsOwner();
            } else if (curDirectExchangeMethod == "TRANSMIT") {
                $("#expireTimePara").hide();
                $("#transmitPara").show();
            }
            break;
        default:
            break;
    }

    $(function () {
        $("#sortable").sortable(
            {
                axis: 'y', // 仅纵向拖动目的列
                cursor:'move'
            }
        );
    });
}

$("#originalCol input[name='idsSrcDbTableColumn']").click(function () {
    $(".errorSrcDbTableColumnsListValue").hide();
    var size = $("#originalCol input[name='idsSrcDbTableColumn']:not(:checked)").size();
    if (0 < size) {
        $("#selectAllSrcColumns").prop("checked", false);

    } else {
        $("#selectAllSrcColumns").prop("checked", true);
    }
   // checkSrcDstColumnsConsistency("srcDbTableColumnsTable","dstCheckedTable");
});

//检查源列
function checkSrcDbTableColumns() {
    var isSrcColumnsChecked = true;

    if (directExchangeMethod == "TRANSMIT") {
        updateDbTableColumns("srcDbTableColumnsTable");

        var size = $("#srcDbTableColumnsTable input[name='idsSrcDbTableColumn']:checked").size();
        if (size == 0) {
            $(".errorSrcDbTableColumnsListValue").html("*请选择列");
            $(".errorSrcDbTableColumnsListValue").css("display", "block");
            preventDefaultFlag = true;
            isSrcColumnsChecked = false;
        } else {
            $(".errorSrcDbTableColumnsListValue").hide();
        }
    }
    return isSrcColumnsChecked;
}

//根据选择的页码向后台获取目的数据源
function getDstDbSrcList(pageNum) {
    var resourceNo = $("#resourceNo").val();
    var resourceVersion = $("#resourceVersion").val();
    $.get("/" + proName + "/mydata/demand/prepare/dbsrc",
        {
            pageNumber: pageNum,
            resourceNo: resourceNo,
            resourceVersion: resourceVersion
        },
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                var $listAll = $('#list-all');
                $listAll.empty();
                for (var i = 0; i < data.dstDbList.length; i++) {
                    var dbAccess = data.dstDbList[i];
                    if (prepareType == "modify" && curDirectExchangeMethod == "PACKAGE" && dbAccess.type != "ODPS") {
                        continue; // 修改交换参数时根据原交换方法过滤数据库
                    }
                    var dbName = dbAccess.name + "(类型：" + dbAccess.type + ")";
                    var mixedId = dbAccess.id + "," + dbAccess.type + "," + dbAccess.isEndpointSame;
                    var newOption = new Option(dbName, mixedId);
                    $listAll.append(newOption);
                }

                $("#totalPage").html(data.totalPage);
                $("#currentPage").html(data.curPage);
            } else {
                dmallError("获取数据库列表失败");
            }
        },
        "json"
    );
}

$("#previouspage").click(
    function () {
        if (parseInt($("#currentPage").text()) > 1) {
            getDstDbSrcList(parseInt($("#currentPage").text()) - 1);
        }
    });

$("#nextpage").click(
    function () {
        if (parseInt($("#currentPage").text()) < parseInt($("#totalPage").text())) {
            getDstDbSrcList(parseInt($("#currentPage").text()) + 1);
        }
    });

$("#btn_commit").click(
    function () {
        $("#partitionWrap").hide();
        $("#list-all option:selected").each(function () {
            var $dbSrcList = $("#dstDbList");
            var mixId = $(this).get(0).value;
            $dbSrcList.val($(this).get(0).text);
            $dbSrcList.data("srcid", mixId.split(",")[0]);
            $dbSrcList.data("type", mixId.split(",")[1]);
            $dbSrcList.data("is-endpoint-same", mixId.split(",")[2]);
            //$dbSrcList.data("type", $(this).get(0).attr("type"));

            dstDbListChange();
        });

        //需要隐藏列区域和其错误信息的显示
    //    $("#dstColumnsDiv").hide();
        $("#dstCheckedTable").empty();
        $(".errorDstCheckedTable").hide();
        $(".errorDbTableColumnsListValue").hide();
    }
);
$("#btn_commit_edit").click(
    function(){
        preventDefaultFlag = false;
        var isDstColumnsChecked = checkDbTableColumns("sortable");
        checkSrcDstColumnsConsistency("dbCheckedTable","sortable");
        if(preventDefaultFlag === true || !isDstColumnsChecked){
            return false;
        } else{
            //updateDbTableColumns("sortable");
            //根据选中的目的表名判断是否需要显示列信息
            /*  var dstTableNameOptionValue = $('#dbTableList option:selected').val();
            if ('0' != dstTableNameOptionValue) {
                //选择表有效显示列的区域
                $("#dstColumnsDiv").show()
            } else {
                $("#dstColumnsDiv").hide();
            }*/
            initDstCheckedTable();
            $(".errorDstCheckedTable").hide();
            updateDbTableColumns("dstCheckedTable");
        }
    }
);

$("#chooseDstDbSrc").click(function () {
    //删除错误提示信息
    $(".errorDstDbValue").hide();
    $("#dstDbList").removeClass("errorC");

    //打开模态框
    $('#addDstDbSrcModal').modal({backdrop: 'static', keyboard: false});

    //填写数据源
    getDstDbSrcList(1);

    //保存当前的目的数据源
    dstDbId = $("#dstDbList").data('srcid');
});

function checkDstDbId() {
    dstDbId = $("#dstDbList").data('srcid');
}

/*function updateSrcDbTableColumns() {
    var data = "";
    var type = "";
    $("#srcDbTableColumnsTable").find(":checkbox:checked").each(function () {
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
    srcDbColumns = data;
    srcDbTypeColumns = type;
}*/

function selectAllSrcColumns() {
    var $enabledIds = $("#srcDbTableColumnsTable input[name='idsSrcDbTableColumn']");
    var $selectAllSrcColumns = $("#selectAllSrcColumns");
    $enabledIds.prop("checked", true);
    $selectAllSrcColumns.prop("checked", true);
}

function unselectAllSrcColumns() {
    var $enabledIds = $("#srcDbTableColumnsTable input[name='idsSrcDbTableColumn']");
    var $selectAllSrcColumns = $("#selectAllSrcColumns");
    $enabledIds.prop("checked", false);
    $selectAllSrcColumns.prop("checked", false);
}

function disableAllSrcColumns() {
    var $enabledIds = $("#srcDbTableColumnsTable input[name='idsSrcDbTableColumn']");
    var $selectAllSrcColumns = $("#selectAllSrcColumns");
    $enabledIds.attr("disabled", true);
    $selectAllSrcColumns.attr("disabled", true);
}

function enableAllSrcColumns() {
    var $enabledIds = $("#srcDbTableColumnsTable input[name='idsSrcDbTableColumn']");
    var $selectAllSrcColumns = $("#selectAllSrcColumns");
    $enabledIds.attr("disabled", false);
    $selectAllSrcColumns.attr("disabled", false);
}

$("#selectAllSrcColumns").click(function () {
    var $this = $(this);
    var $enabledIds = $("#originalCol input[name='idsSrcDbTableColumn']");

    if ($this.prop("checked")) {
        $enabledIds.prop("checked", true);
        $(".errorSrcDbTableColumnsListValue").hide();
    } else {
        $enabledIds.prop("checked", false);
    }
 //   checkSrcDstColumnsConsistency("srcDbTableColumnsTable","dstCheckedTable");
});

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

//选中目的数据库，获取表
function dstDbListChange() {
    var $dbTableList = $('#dbTableList');
    $dbTableList.empty();

    var dbId = $("#dstDbList").data('srcid');

    $('#sortable').empty();
    $('#selectAllColumns').prop("checked", false);

    if (dbId == "0") {
        $dbTableList.append("<option value='0'>" + "请先选择目的数据库" + "</option>");

        if (prepareType == "create" && srcDbType == "ODPS") {
            $("#directExchangeMethodPara").hide();
            $("#expireTimePara").hide();
            $("#transmitPara").hide();
        }
        dstDbType = "";
    } else {
        $dbTableList.append("<option value='0'>" + "请选择" + "</option>");

        dstDbType = $("#dstDbList").data("type");
        if (dstDbType == "ODPS") {
            $("#insertModePara").hide();
            $("#flushNumberPara").hide();
            $("#odpsPara").show();

        } else if (dstDbType == "ADS") {
            $("#insertModePara").hide(); // ADS不支持该参数
            $("#flushNumberPara").show();
            $("#odpsPara").hide();
        } else {
            $("#insertModePara").show();
            $("#flushNumberPara").show();
            $("#odpsPara").hide();
        }

        $("#dstDbList").removeClass("errorC");
        if (prepareType == "create") {
            if (srcDbType == "ODPS") {
                var isEndpointSame = $("#dstDbList").data("is-endpoint-same");
                var exchangeMode = $("#exchangeMode").val();
                if (dstDbType == "ODPS" && isEndpointSame == "true") {
                    // 源、目的为同一endpoint下的ODPS数据库
                    if(exchangeMode == "TRANSMIT"){
                        $("#directExchangeMethodPara").hide();
                        $("#expireTimePara").hide();
                        $("#packageMethod").removeAttr("checked", "checked");
                        $("#transmitMethod").attr("checked");
                        $("#transmitPara").show();
                        directExchangeMethod = "TRANSMIT";
                    } else if(exchangeMode == "PACKAGE"){
                        $("#directExchangeMethodPara").show();
                        if(prepareType == "create"){
                            $("#expireTimePara").show();
                        }
                        $("#packageMethod").attr("checked", "checked");
                        $("#transmitMethod").removeAttr("checked");
                        $("#transmitMethodPara").hide();
                        $("#transmitPara").hide();
                        directExchangeMethod = "PACKAGE";
                        disableAllSrcColumns();
                        checkOdpsOwner();
                    }else{
                        $("#directExchangeMethodPara").show();
                        if(prepareType == "create"){
                            $("#expireTimePara").show();
                        }
                        $("#packageMethod").attr("checked", "checked");
                        $("#transmitMethod").removeAttr("checked");
                        $("#transmitPara").hide();
                        directExchangeMethod = "PACKAGE";
                        disableAllSrcColumns();
                        checkOdpsOwner();
                    }
                    selectAllSrcColumns();
                    $(".errorSrcDbTableColumnsListValue").hide();
                } else if(exchangeMode == "PACKAGE"){
                    dmallError("源和目的数据库不在同一endpoint下，请重新选择目的数据库");
                }else{
                    $("#directExchangeMethodPara").hide();
                    $("#expireTimePara").hide();
                    $("#transmitPara").show();
                    enableAllSrcColumns();
                    directExchangeMethod = "TRANSMIT";
                }
            }
        }
    }

    $("#loadingDbTable").show();

    $.get("/" + proName + "/mydata/demand/prepare/tables",
        {
            dbSrcId: dbId
        },
        function (data, status) {
            $("#loadingDbTable").hide();
            if (status == "success") {
                if (data.resultList.length == 0) {
                    dmallError("没有获取到表");
                } else {
                    for (var i = 0; i < data.resultList.length; i++) {
                        var table = data.resultList[i];
                        var newOption = new Option(table, table);
                        $dbTableList.append(newOption);
                    }
                }
            } else {
                dmallError("获取表失败");
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
            selectAllSrcColumns();
            disableAllSrcColumns();
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
            enableAllSrcColumns();
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
//点击某个目的列
$("#sortable").delegate('tr', 'click', function () {
  //  $(".errorDstCheckedTable").hide();
    $(".errorDbTableColumnsListValue").hide();

    var dstColumnsSize = $("#sortable input[name='idsDbTableColumn']:not(:checked)").size();
    if (0 < dstColumnsSize) {
        $("#selectAllColumns").prop("checked", false);
    } else {
        $("#selectAllColumns").prop("checked", true);
    }

    checkSrcDstColumnsConsistency("dbCheckedTable","sortable");
});

//检查目的列是否选中
function checkDbTableColumns(id) {
    var isDstColumnsChecked = true;
    if (directExchangeMethod == "TRANSMIT") {
        $(".errorDstCheckedTable").hide();
        $(".errorDbTableColumnsListValue").hide();

        //获取选中的目的列
        updateDbTableColumns("sortable");

        var size = $("#"+id+" input[name='idsDbTableColumn']:checked").size();
        if (size == 0) {
            $(".errorDbTableColumnsListValue").html("*请选择列");
            $(".errorDstCheckedTable").css("display", "block");
            $(".errorDbTableColumnsListValue").css("display", "block");
            preventDefaultFlag = true;
            isDstColumnsChecked = false;
        } else {
            $(".errorDstCheckedTable").hide();
            $(".errorDbTableColumnsListValue").hide();
        }
    }

    return isDstColumnsChecked;
}

//获取选中的目的列
function updateDbTableColumns(id) {
    var data = "";
    var type = "";
    var tmpValue = "";
    $("#"+id).find(":checkbox:checked").each(function () {
        if(id == "sortable" || id == "dstCheckedTable") {
            tmpValue = $(this).parent().next().text();
            if (data == "") {
                data = tmpValue;
            } else {
                data = data + "," + tmpValue;
            }
            if (type == "") {
                type = $(this).parent().next().next().text();
            } else {
                type = type + "," + $(this).parent().next().next().text();
            }
        } else {
            tmpValue = $(this).parent().next().next().next().text();
            if(tmpValue != "") {
                if (data == "") {
                    data = tmpValue;
                } else {
                    data = data + "," + tmpValue;
                }
                if (type == "") {
                    type = $(this).parent().next().next().next().next().text();
                } else {
                    type = type + "," + $(this).parent().next().next().next().next().text();
                }
            }
        }
    });
    if(id == "sortable"){
        dstDbColumns = data;
        dstDbTypeColumns = type;
    }else if( id == "srcDbTableColumnsTable"){
        srcDbColumns = data;
        srcDbTypeColumns = type;
    }else if( id = "dstCheckedTable"){
        dstCheckedDbColumns = data;
        dstCheckedDbTypeColumns = type;
    }
}

//点击全选目的列
$("#selectAllColumns").click(function () {
    var $this = $(this);
    var $enabledIds = $("#sortable input[name='idsDbTableColumn']");

    if ($this.prop("checked")) {
        $enabledIds.prop("checked", true);
        $(".errorDstCheckedTable").hide();
        $(".errorDbTableColumnsListValue").hide();
    } else {
        $enabledIds.prop("checked", false);
    }
    checkSrcDstColumnsConsistency("dbCheckedTable","sortable");
});

//检查目的列和源列的一致性
function checkSrcDstColumnsConsistency(leftTable,rightTable) {
    if (directExchangeMethod == "TRANSMIT") {
        var dstColumnsSize = $("#"+rightTable+" input[name='idsDbTableColumn']:checked").size();
        var srcColumnsSize = $("#"+leftTable+" input[name='idsSrcDbTableColumn']:checked").size();
        //检查源列与目的列数量不一致
        if ( 0 != dstColumnsSize ) {
            if (dstColumnsSize != srcColumnsSize) {
                $(".errorDbTableColumnsListValue").html("*与源列数不一致，请重新选择列");
                $(".errorDbTableColumnsListValue").css("display", "block");
                if(leftTable != "dbCheckedTable"){
                    $(".errorSrcDbTableColumnsListValue").html("*与目的列数不一致，请重新选择列");
                    $(".errorSrcDbTableColumnsListValue").css("display", "block");
                }
                preventDefaultFlag = true;
                return true;
            } else {
                $(".errorDstCheckedTable").hide();
                $(".errorDbTableColumnsListValue").hide();
                $(".errorSrcDbTableColumnsListValue").hide();
            }
        }else {
       //     $(".errorDstCheckedTable").hide();
       //    $(".errorDbTableColumnsListValue").hide();
            $(".errorSrcDbTableColumnsListValue").hide();
        }
    }
}

//获取字段
$("#dbTableList").change(
    function () {
        if ($("#dbTableList").val() != 0){
            initDbCheckedTable();
            $("#editColumn").modal({backdrop: 'static', keyboard: false});
            initDstTable();
        }
    }
);
//构造已选择的目的数据列表格
function initDstCheckedTable(){
    $("#dstCheckedTable").empty();
    updateDbTableColumns("sortable");
    var column = dstDbColumns.split(",");
    var type = dstDbTypeColumns.split(",");
    for(var i= 0;i < column.length;i++){
        $("#dstCheckedTable").append("<tr><td><input type='checkbox' name='idsDbTableColumn' checked hidden></td><td>"+column[i]+"</td><td>"+type[i]+"</td></tr>");
    }
}
//构造已选择的源数据列表格
function initDbCheckedTable(){
    $("#dbCheckedTable").empty();
    updateDbTableColumns("srcDbTableColumnsTable");
    var column = srcDbColumns.split(",");
    var type = srcDbTypeColumns.split(",");
    for(var i= 0;i < column.length;i++){
        $("#dbCheckedTable").append("<tr><td style='height: 40px'><input type='checkbox' name='idsSrcDbTableColumn' checked hidden></td><td>"+column[i]+"</td><td>"+type[i]+"</td></tr>");
    }
}
//构造待选择的目的数据列表格
function initDstTable(){
    $('#sortable').empty();
    $('#selectAllColumns').prop("checked", false);
    $(".errorDstCheckedTable").hide();
    $(".errorDbTableColumnsListValue").hide();
    $("#loadingDbColumns").show();
    dstDbId = $("#dstDbList").data('srcid');
    dstDbTable = $("#dbTableList option:selected").val();
    $.get("/" + proName + "/mydata/demand/prepare/columns",
        {
            dbSrcId: dstDbId,
            dbTableName: dstDbTable
        },
        function (data, status) {
            if (status == "success") {
                $("#partitionTable tbody").empty();
                $("#partitionWrap").hide();
                $("#loadingDbColumns").hide();
                if (!data.tableInfo) {
                    dmallError("没有获取到列");
                } else {
                    var tableInfo = data.tableInfo;
                    for (var i = 0; i < tableInfo.columns.length; i++) {
                        var column = tableInfo.columns[i];
                        $('#sortable').append('<tr class="ui-state-default">' +
                        '<td width="3%" style="height: 40px"><input type="checkbox" name="idsDbTableColumn" data-name="' + column.name + '" data-type="' + column.type + '"/></td>' +
                        '<td width="40%">' + column.name + '</td><td width="47%">' + column.type +
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
            } else {
                dmallError("获取列失败");
            }
        },
        "json"
    );
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

//检查是否选中目的数据源
function checkDstDbValue() {
    var isDstDbChecked = true;

    if ($("#dstDbList").val() == 0) {
        $("#dstDbList").addClass("errorC");
        $(".errorDstDbValue").html("*请选择数据源");
        $(".errorDstDbValue").css("display", "block");
        preventDefaultFlag = true;
        isDstDbChecked = false;
    }

    return isDstDbChecked;
}

//检查目的表是否选中
function checkDbTableListValue() {
    var isDstDbTableChecked = true;
    if (directExchangeMethod == "TRANSMIT") {
        dstDbTable = $("#dbTableList option:selected").val();
        if ($("#dbTableList").children('option:selected').val() == 0) {
            $("#dbTableList").addClass("errorC");
            $(".errorDbTableListValue").html("*请选择表");
            $(".errorDbTableListValue").css("display", "block");
            preventDefaultFlag = true;
            isDstDbTableChecked = false;
        }
    }

    return isDstDbTableChecked;
};
//修改源列
$("#editOriginalColumnBtn").click(function(){
    updateDbTableColumns("srcDbTableColumnsTable");
    var column = srcDbColumns.split(",");
    $("#originalCol tr").each(function () {
        for(var j= 0;j < column.length;j++){
            if(column[j] == $(this).children("td").eq(3).text()){
                $(this).children("td").eq(0).find("input").attr("checked","checked");
            }
        }
    });
    var size = $("#originalCol input[name='idsSrcDbTableColumn']:not(:checked)").size();
    if (0 < size) {
        $("#selectAllSrcColumns").prop("checked", false);
    } else {
        $("#selectAllSrcColumns").prop("checked", true);
    }
    $("#editOriginalColumn").modal({backdrop: 'static', keyboard: false});
});
//todo
$("#btn_commit_original").click(function(){
        var size = $("#originalCol input[name='idsSrcDbTableColumn']:checked").size();
        if (0 < size) {
            $("#srcDbTableColumnsTable").empty();
            $("#originalCol").find(":checkbox:checked").each(function () {
                var dataTableItemNo = $(this).parent().next().text();
                var dataDirectoryItemNo = $(this).parent().next().next().text();
                var dbColumn = $(this).parent().next().next().next().text();
                var dbColumnType = $(this).parent().next().next().next().next().text();
                $("#srcDbTableColumnsTable").append("<tr><td><input type='checkbox' name='idsSrcDbTableColumn' checked hidden></td><td>"+dataTableItemNo+"</td><td>"+dataDirectoryItemNo+"</td><td>"+dbColumn+"</td><td>"+dbColumnType+"</td></tr>");
            });
            updateDbTableColumns("srcDbTableColumnsTable");
        } else {
            dmallError("请选择列");
            return false;
        }
    }
);
//修改目的列
$("#editColumnBtn").click(function(){
    var isDstDbTableChecked = checkDbTableListValue();
    if(!isDstDbTableChecked){
        return;
    }else{
        initDbCheckedTable();
       // initDstTable();
        checkSrcDstColumnsConsistency("dbCheckedTable","sortable");
        $("#editColumn").modal({backdrop: 'static', keyboard: false});
    }
});
$("#dbTableList").focus(function () {
    if ($("#dbTableList").children('option:selected').val() == 0) {
        $("#dbTableList").removeClass("errorC");
        $(".errorDbTableListValue").hide();
    }
});
$("#dbTableList").blur(function () {
    checkDbTableListValue();
});

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

function checkPartition() {
    var j = 0;
    var val2 = {};
    $("#partitionTable").find(":checkbox:checked").each(function () {
        var ptValue = "";
        var ptName = $(this).parent().next().text();
        $(this).parent().parent().find("[type='text']").each(function (tdindex, tditem) {
            ptValue = $(tditem).val();
            if (ptValue == "") {
                $(this).parent().parent().find("[type='text']").addClass("errorC");
                $(this).parent().parent().find("[type='text']").siblings("small").show().html("*请输入分区值");
                preventDefaultFlag = true;
            } else {
                $(this).parent().parent().find("[type='text']").removeClass("errorC");
                $(this).parent().parent().find("[type='text']").siblings("small").hide();
            }
        });
        val2[ptName] = ptValue;
        j++;
    });
    if (j > 0) {
        partition = JSON.stringify(val2);
    }
}

function checkDb() {

    checkDstDbId();

    //检查源列是否选中
    var isSrcColumnsChecked = checkSrcDbTableColumns();

    //检查目的数据源是否选中
    var isDstDbChecked = checkDstDbValue();

    //检查目的表是否选中
    var isDstDbTableChecked = checkDbTableListValue();

    //检查目的列是否选中
    var isDstColumnsChecked = checkDbTableColumns("dstCheckedTable");

    if ((isSrcColumnsChecked === true) && (isDstDbChecked === true) &&
        (isDstDbTableChecked === true) && (isDstColumnsChecked === true)) {
        //检查源列和目的列数是否一致
        if(checkSrcDstColumnsConsistency("srcDbTableColumnsTable","dstCheckedTable")){
            dmallError("源列与目的列不一致，请修改");
        }
    }
    checkPartition();
}

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
    checkDb();
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
    }
);

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
    paraPreventDefaultFlag = false;
    validateValue($("#pname"), $(".errorPname"), "*请输入变量名称", "*变量名只能包含字母，且不超过20个字符", regName);
    validateValue($("#ptype"), $(".errorPtype"), "*请选择变量类型", "", "");
    if (ptype == "enum") {
        validateValue($("#psubtype"), $(".errorPsubtype"), "*请选择字段类型", "", "");
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
});
function getSQL() {

}

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

