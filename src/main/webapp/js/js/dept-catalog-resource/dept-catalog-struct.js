/**
 * Created by 如川 on 2016/3/17.
 */
ExtraCatalog.regGetData(Module.STRUCTFILE, structGetData);
ExtraCatalog.regInit(Module.STRUCTFILE, structInit);
ExtraCatalog.regRender(Module.STRUCTFILE, structRender);
ExtraCatalog.regCheck(Module.STRUCTFILE, structCheck);

function structGetData() {
    return getStructData();
}

function structInit(bool) {
    if (bool)
        initStruct();
    else
        emptyStruct();
}

function structRender(catalog) {
    return renderStruct(catalog)
}

function structCheck() {
    preventStructFlag = false;
    var tempFlag = false;
    var radio = $('input[name="fileCome"]').filter(":checked");
    if(radio.val() == "url"){
        if (checkStructUrl() || checkStructTextFields() || checkStructTextTypes() || checkStructTextDeses())
            tempFlag = true;
    } else{
        if (checkFileDbSrcListValue() || checkFileDbTableListValue() ||checkFileDbTableColumns("storageFileDbBody",$(".errorFileDb"))|| checkFileDbPartition() || checkWhere()
            ||checkFileName()||checkFileDbTableColumns("storageFileTableBody",$(".errorFileTable"))|| checkConsistency() || checkTransmitIntervalDay() ||checkTransmitIntervalMinute()){
            tempFlag = true;
        }else {
            var scheduleType = $("#scheduleTypeList option:selected").val();
            switch (scheduleType){
                case "dayOfMonth":
                    if(checkNotBlank($("#transmitIntervalMonthValue"),$(".errorTransmitIntervalMonthValue"),"*请选择每月时间")){
                        tempFlag = true;
                    }
                    break;
                case "weekday":
                    if(checkNotBlank($("#transmitIntervalWeekValue"),$(".errorTransmitIntervalWeekValue"),"*请选择每周时间")){
                        tempFlag = true;
                    }
                    break;
            }
        }
    }
    return tempFlag;
}

function NameRegExp(name){
    //var nameType = /^[^\.\s]{1,64}$/;
    var nameType = /^[\u4E00-\u9FA5A-Za-z0-9_\-]{1,120}$/;

    if (name == '')
        return -1;
    var regExpName = new RegExp(nameType);
    return regExpName.test(name);
}

//增加结构化文本字段
$(document).ready()
{
    var metadataMode = $("#metadataMode").val();
    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    var proName = arr[1];
    var rootPath = "http://" + window.location.host + "/" + proName;
    var preventStructFlag = false;
    var structTextCount = 1;
    var structTextId = 1;
    var resourceTypeCode = "STRUCTFILE";
    var dbAccessId = "";
    var fileDbTableTag = 0;
    var tableData = [];
    var newTableData = [];
    var oldSearchStr = "";
    var oldFileDbTableStr = "";

    //文件生成周期
    $("#scheduleTypeList").change(
        function () {
            var scheduleType = $("#scheduleTypeList option:selected").val();
            if (scheduleType == "none") {
                $("#transmitIntervalMinute").hide();
                $("#transmitIntervalWeek").hide();
                $("#transmitIntervalMonth").hide();
                $("#transmitIntervalDay").hide();
            } else if (scheduleType == "minute") {
                $("#transmitIntervalMinute").show();
                $("#transmitIntervalWeek").hide();
                $("#transmitIntervalMonth").hide();
                $("#transmitIntervalDay").hide();
            } else if (scheduleType == "hourOfDay") {
                $("#transmitIntervalMinute").hide();
                $("#transmitIntervalWeek").hide();
                $("#transmitIntervalMonth").hide();
                $("#transmitIntervalDay").show();
            } else if (scheduleType == "weekday") {
                $("#transmitIntervalMinute").hide();
                $("#transmitIntervalWeek").show();
                $("#transmitIntervalMonth").hide();
                $("#transmitIntervalDay").show();
            } else if (scheduleType == "dayOfMonth") {
                $("#transmitIntervalMinute").hide();
                $("#transmitIntervalWeek").hide();
                $("#transmitIntervalMonth").show();
                $("#transmitIntervalDay").show();
            }
        }
    );
    function checkTransmitIntervalMinute() {
        var scheduleType = $("#scheduleTypeList option:selected").val();
        if (scheduleType == "minute") {
            var minute = $("#transmitIntervalMinuteValue").val();
            var ret = inputCheckNum(minute);
            if (!ret || parseInt(minute) <= 0 || parseInt(minute) > 100000) {
                $("#transmitIntervalMinuteValue").addClass("errorC");
                $(".errorTransmitIntervalMinuteValue").html("*请输入分钟，分钟为大于0且不能超过100000的整数");
                $(".errorTransmitIntervalMinuteValue").css("display", "block");
                return true;
            }
            else{
                $("#transmitIntervalMinuteValue").removeClass("errorC");
                $(".errorTransmitIntervalMinuteValue").hide();
                return false;
            }
        }else{
            return false;
        }
    };
    $("#transmitIntervalMinuteValue").focus(function () {
        $("#transmitIntervalMinuteValue").removeClass("errorC");
        $(".errorTransmitIntervalMinuteValue").hide();
    });
    $("#transmitIntervalMinuteValue").blur(function () {
        checkTransmitIntervalMinute();
    });
    $("#transmitIntervalWeekValue").focus(function () {
        if ($("#transmitIntervalWeekValue").val() == "") {
            $("#transmitIntervalWeekValue").removeClass("errorC");
            $(".errorTransmitIntervalWeekValue").hide();
        }
    });
    $("#transmitIntervalWeekValue").blur(function () {
        checkNotBlank($("#transmitIntervalWeekValue"),$(".errorTransmitIntervalWeekValue"),"*请选择每周时间");
    });
    $("#transmitIntervalMonthValue").focus(function () {
        if ($("#transmitIntervalMonthValue").val() == "") {
            $("#transmitIntervalMonthValue").removeClass("errorC");
            $(".errorTransmitIntervalMonthValue").hide();
        }
    });
    $("#transmitIntervalMonthValue").blur(function () {
        checkNotBlank($("#transmitIntervalMonthValue"),$(".errorTransmitIntervalMonthValue"),"*请选择每月时间");
    });
    $("#transmitIntervalDayHour").blur(function () {
        checkTransmitIntervalDay();
    });
    $("#transmitIntervalDayMinute").blur(function () {
        checkTransmitIntervalDay();
    });
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
    function checkTransmitIntervalDay() {
        var scheduleType = $("#scheduleTypeList option:selected").val();
        if (scheduleType == "hourOfDay" || scheduleType == "weekday" || scheduleType == "dayOfMonth") {
            var hourOfDay = $("#transmitIntervalDayHour").val();
            if (hourOfDay == "") {
                $("#transmitIntervalDayHour").addClass("errorC");
                $(".errorTransmitIntervalDay").html("*请选择具体时间");
                $(".errorTransmitIntervalDay").css("display", "block");
                return true;
            }
            var minuteOfHour = $("#transmitIntervalDayMinute").val();
            if (minuteOfHour == "") {
                $("#transmitIntervalDayMinute").addClass("errorC");
                $(".errorTransmitIntervalDay").html("*请选择具体时间");
                $(".errorTransmitIntervalDay").css("display", "block");
                return true;
            }
        }
    };

    function renderScheduleInterval(type,interval){
        $("#scheduleTypeList").val(type);
        var scheduleType = type;
        var obj = jQuery.parseJSON(interval);
        if (scheduleType == "none") {
            $("#transmitIntervalMinute").hide();
            $("#transmitIntervalMinuteValue").val("");
            $("#transmitIntervalDay").hide();
            $("#transmitIntervalDayHour").val("");
            $("#transmitIntervalDayMinute").val("");
            $("#transmitIntervalWeek").hide();
            $("#transmitIntervalWeekValue").val("");
            $("#transmitIntervalMonth").hide();
            $("#transmitIntervalMonthValue").val("");
        } else if (scheduleType == "minute") {
            $("#transmitIntervalMinute").show();
            $("#transmitIntervalMinuteValue").val(obj.minute);
        } else if (scheduleType == "hourOfDay") {
            $("#transmitIntervalDay").show();
            $("#transmitIntervalDayMinute").val(obj.minute);
            $("#transmitIntervalDayHour").val(obj.hourOfDay);
        } else if (scheduleType == "weekday") {
            $("#transmitIntervalWeek").show();
            $("#transmitIntervalDay").show();
            $("#transmitIntervalDayMinute").val(obj.minute);
            $("#transmitIntervalDayHour").val(obj.hourOfDay);
            $("#transmitIntervalWeekValue").val(obj.weekday);
        } else if (scheduleType == "dayOfMonth") {
            $("#transmitIntervalMonth").show();
            $("#transmitIntervalDay").show();
            $("#transmitIntervalDayMinute").val(obj.minute);
            $("#transmitIntervalDayHour").val(obj.hourOfDay);
            $("#transmitIntervalMonthValue").val(obj.dayOfMonth);
        }
    }

    /*检查结构化文本地址输入框*/
    $("#structUrl").focus(function () {
        if ($("#structUrl").val() == "") {
            $("#structUrl").removeClass("errorC");
            $(".errorStructUrl").hide();
        }
    });

    function checkStructUrl() {
        var structUrl = $("#structUrl").val();
        if (structUrl == "") {
            $("#structUrl").addClass("errorC");
            $(".errorStructUrl").html("*请输入文件地址");
            $(".errorStructUrl").css("display", "block");
            return true;
        } else if (!normalUrlRegExp(structUrl)) {
            $("#structUrl").addClass("errorC");
            $(".errorStructUrl").html("*请输入正确格式的url,http(s)://域名(ip)(端口号)(路径)");
            $(".errorStructUrl").css("display", "block");
            return true;
        }else {
            $("#structUrl").removeClass("errorC");
            $(".errorStructUrl").hide();
            return false;
        }

    };
    /* 失去焦点*/
    $("#structUrl").blur(function () {
        checkStructUrl();
    });


    $("#structTextTable").delegate("input[name = 'structTextField']", "focus", function () {
        //alert("TestField");
        $(this).removeClass("errorC");
        $(this).siblings("small").hide();
        $(this).blur(function () {
            checkStructTextFields();
        });
    });

    $("#structTextTable").delegate("input[name = 'structTextType']", "focus", function () {
        $(this).removeClass("errorC");
        $(this).siblings("small").hide();
        $(this).blur(function () {
            checkStructTextTypes();
        });
    });

    $("#structTextTable").delegate("input[name = 'structTextDes']", "focus", function () {
        $(this).removeClass("errorC");
        $(this).siblings("small").hide();
        $(this).blur(function () {
            //alert("TextDes");
            checkStructTextDeses();
        });
    });

    $("#fileTableBody").delegate("input[name = 'columnName']", "focus", function () {
        $(this).removeClass("errorC");
        $(this).siblings("small").hide();
        $(this).blur(function () {
            if($(this).parent().parent().find(":checkbox").is(":checked")){
                checkNotBlank($(this),$(this).siblings("small"),"*请输入列名");
            }
        });
    });
    //注册文件来源 radio的change事件
    $("[name='fileCome']").on("change", showTypeChange);
    function showTypeChange() {
        var radio = $('input[name="fileCome"]').filter(":checked");
        if (radio.length) {
            if (radio.val() == "url") {
                var fileType = $("#structParamType").val();
                structFileType(fileType);
                $("#fileComeUrl").show();
                $("#fileComeDbsrc").hide();
            } else {
                $("#fileComeUrl").hide();
                $("#fileComeDbsrc").show();
            }
        }
    };
    $("#addStructText").click(function () {
        structTextCount++;
        structTextId++;
        var html = '<tr><td>' +
            '          <input id="structTextField' + structTextId + '" type="text" name="structTextField" class="form-control" maxlength="32"/>' +
            '          <small class="errorStructTextField' + structTextId + ' text-danger"></small></td>' +
            '        <td>' +
            '          <input id="structTextType' + structTextId + '" type="text" class="form-control" name="structTextType" maxlength="16"/>' +
            '          <small class="errorStructTextType' + structTextId + ' text-danger"></small></td>' +
            '        <td>' +
            '          <input id="structTextDes' + structTextId + '" type="text" class="form-control" name="structTextDes" maxlength="255"/>' +
            '          <small class="errorStructTextDes' + structTextId + ' text-danger"></small></td>';
        if(metadataMode == "1" || metadataMode == "0"){
            html += '<td><a href="javascript:void(0)" onclick="addMeta($(this))" data-metacode="">添加关联</a>' +
            '<div hidden><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
            '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td>';
        }
        html +=  '<td><a href="#" class="removeVirtualText" style="font-size: 32px">×</a></td></tr>';
        $("#structTextTable").append(html);
        return false;
    });

    $("body").on("click", ".removeStructText", function (e) {
        if (structTextCount > 1) {
            $(this).parent().parent().remove();
            structTextCount--;
        }
        return false;
    });

    //遍历结构字段
    function checkStructTextFields() {
        preventStructFlag = false;
        for (var i = 1; i <= structTextCount; i++) {
            if ($("#structTextField" + i).val() == "") {
                $("#structTextField" + i).addClass("errorC");
                $(".errorStructTextField" + i).html("*请输入结构字段");
                $(".errorStructTextField" + i).css("display", "block");
                preventStructFlag = true;
            }
        }
        return preventStructFlag;
    };
    //遍历结构字段类型
    function checkStructTextTypes() {
        preventStructFlag = false;
        //if (resourceTypeCode == "STRUCTFILE") {
        for (var i = 1; i <= structTextCount; i++) {
            if ($("#structTextType" + i).val() == "") {
                $("#structTextType" + i).addClass("errorC");
                $(".errorStructTextType" + i).html("*请输入结构类型");
                $(".errorStructTextType" + i).css("display", "block");
                preventStructFlag = true;
            }
        }
        //}
        return preventStructFlag;
    };
    //遍历结构字段描述
    function checkStructTextDeses() {
        preventStructFlag = false;
        //if (resourceTypeCode == "STRUCTFILE") {
        for (var i = 1; i <= structTextCount; i++) {
            if ($("#structTextDes" + i).val() == "") {
                $("#structTextDes" + i).addClass("errorC");
                $(".errorStructTextDes" + i).html("*请输入结构描述");
                $(".errorStructTextDes" + i).css("display", "block");
                preventStructFlag = true;
            }
        }
        //}\
        return preventStructFlag;
    };
    //非空验证
    function checkNotBlank($select,$errorClass,errorMsg){
        var str = $.trim($select.val());
        if (str == "") {
            $select.addClass("errorC");
            $errorClass.html(errorMsg);
            $errorClass.css("display", "block");
            return true;
        } else {
            $select.removeClass("errorC");
            $errorClass.hide();
            return false;
        }
    }
    function removeFileDbSrcListError() {
        $("#fileDbSrcList").removeClass("errorC");
        $(".errorFileDbSrcListValue").hide();
    }

    $("#fileDbTable").click(function(){
        if(isLimit == "false"){
            var src = $("#fileDbSrcList").val();
            if(src == ""){
                $("#fileDbSrcList").addClass("errorC");
                $(".errorFileDbSrcListValue").html("*请选择数据源");
                $(".errorFileDbSrcListValue").css("display", "block");
            }else{
                var str = $("#fileDbTable").val();
                fileDbTableTag = 0;
                if(str == ""){
                    $("#loadingFileDbTable").show();
                    getFileDbTableData("draw");
                }else{
                    getFileDbTableData("search");
                }
            }
        }
    });
    //获取表
    function getFileDbTableData(type){
        dbAccessId = $("#fileDbSrcList").data("srcid");
        $.get(rootPath + "/dbaccess/tables",
            {
                dbSrcId: dbAccessId
            },
            function (data, status) {
                tableData = [];
                $("#loadingFileDbTable").hide();
                if (status == "success") {
                    $("#fileDbTableList").empty();
                    if (data.resultList.length > 0) {
                        for (var i = 0; i < data.resultList.length; i++) {
                            var table = data.resultList[i];
                            tableData.push(table);
                        }
                        if(type == "draw"){
                            drawTabelTree("fileDb",tableData);
                        }else if(type == "search"){
                            var str = $("#fileDbTable").val();
                            newTableData = searchTableTree(str,tableData,"normal");
                            drawTabelTree("fileDb",newTableData);
                        }
                    } else {
                        dmallError("没有获取到表");
                    }
                } else {
                    dmallError("获取表失败");
                }
            },
            "json"
        );
    }
    $("#fileDbTable").keyup(function(){
        if(oldSearchStr == ""){
            oldSearchStr = $("#fileDbTable").val();
        }
        var str = $("#fileDbTable").val();
        if(str.length >oldSearchStr.length){
            newTableData = searchTableTree(str,newTableData,"normal");
        }else{
            newTableData = searchTableTree(str,tableData,"normal");
        }
        drawTabelTree("fileDb",newTableData);
        oldSearchStr = $("#fileDbTable").val();
    });
    // 获取字段
    $("#fileDbTableList").delegate("li", "click", function () {
        fileDbTableTag = 1;
        $("#fileDbTableListWrap").hide();
        if(this.title != oldFileDbTableStr){
            $("#fileDbTable").val(this.title);
            $("#storageFileDbPartition").hide();
            $("#filePartitionWrap").hide();
            $("#storageFileDbBody").empty();
            $("#storageFileTableBody").empty();
            openEditDbModal("new");
            oldSearchStr = $("#fileDbTable").val();
            oldFileDbTableStr = oldSearchStr;
        }else{
            $("#fileDbTable").val(this.title);

        }
    });
    function fileDbTableBlur(){
        var str = $("#fileDbTable").val();
        if(fileDbTableTag != 1){
            $("#fileDbTableListWrap").hide();
            if(checkFileDbTable()){
                $("#storageFileDbBody").hide();
                $("#storageFileTableBody").hide();
            }else{
                if(str != oldFileDbTableStr){
                    $("#storageFileDbPartition").hide();
                    $("#filePartitionWrap").hide();
                    $("#storageFileDbBody").empty();
                    $("#storageFileTableBody").empty();
                    openEditDbModal("new");
                    oldSearchStr = $("#fileDbTable").val();
                    oldFileDbTableStr = oldSearchStr;
                }else{
                    $("#storageFileDbBody").show();
                    $("#storageFileTableBody").show();
                }
            }
        }
    }
    $("#fileDbTableListWrap").mouseover(function(){
        $("#fileDbTable").unbind('blur');
    });
    $("#fileDbTableListWrap").mouseleave(function(){
        $("#fileDbTable").bind("blur",function(){
            fileDbTableBlur();
        });
    });
    $("#fileDbTable").blur(function(){
        fileDbTableBlur();
    });

    function checkFileDbTable(){
        var str = $("#fileDbTable").val();
        var checkArr = searchTableTree(str,tableData,"exact");
        if(checkArr.length <= 0){
            $("#fileDbTable").addClass("errorC");
            $("#fileDbTable").siblings("small").html("*请选择正确的表");
            $("#fileDbTable").siblings("small").css("display", "block");
            return true;
        }
    }

    $("#fileDbTable").focus(function () {
        $("#fileDbTable").removeClass("errorC");
        $(".errorFileDbTable").hide();
    });

    $("#editFileDbColumns").click(function(){
        $(".errorFileDb").hide();
        openEditDbModal("edit");
    });
    $("#editFileDbColumn").click(function(){
        $(".errorFileTable").hide();
        openEditTableModal("edit");
    });
    function openEditDbModal(type){
        if(checkFileDbSrcListValue() || checkFileDbTableListValue()){
            return false;
        }
        $("#editDbColumn").modal({backdrop: 'static', keyboard: false});
        var dbTableName = $("#fileDbTable").val();
        dbAccessId = $("#fileDbSrcList").data("srcid");
        freshFileDb(dbAccessId, dbTableName);
        if(type == "new"){
            freshPartition(dbAccessId, dbTableName,null,type);
        }
    }
    function openEditTableModal(){
        if(checkFileDbTableColumns("storageFileDbBody",$(".errorFileDb"))){
            return false;
        }
        $("#editTableColumn").modal({backdrop: 'static', keyboard: false});
        freshFileDbColumnsTable();
    }
    //生成表格列与文件列
    $("#btn_commit_edit").click(function(){
        if(checkFileDbTableColumns("fileDbBody",$(".errorFileDbTableColumnsListValue"))){
            return false;
        }
        createDbTable();
    });
    $("#btn_commit_file").click(function(){
        $("#fileTableBody").data("flag","true");
        $("#fileTableBody").find(":checkbox:checked").each(function () {
            $(this).parent().parent().find("[name='columnName']").each(function (tdindex, tditem) {
                if(checkNotBlank($(tditem),$(tditem).siblings("small"),"*请输入列名")){
                    $("#fileTableBody").data("flag","false");
                    return false;
                }
            });
        });
        if( $("#fileTableBody").data("flag") == "false"){
            return false;
        }
        createFileTable();
    });
    function createDbTable(){
        $("#storageFileDbBody").empty();
        var column = getFileDbData($("#fileDbBody"),"array");
        for(var i= 0;i < column.length;i++){
            $("#storageFileDbBody").append("<tr><td style='height: 40px'><input type='checkbox' name='idsFileTableColumn' checked hidden></td>" +
            "<td>"+column[i].name+"</td>" +
            "<td>"+column[i].type+"</td>" +
            "<td hidden>"+column[i].comment+"</td></tr>");
        }
        $("#storageFileDbBody").show();
    }
    function createFileTable(){
        $("#storageFileTableBody").empty();
        var column = getFileTableData();
        for(var i= 0;i < column.length;i++){
            $("#storageFileTableBody").append("<tr><td style='height: 40px'><input type='checkbox' name='idsFileTableColumn' checked hidden></td>" +
            "<td>"+column[i].name+"</td>" +
            "<td>"+column[i].type+"</td>" +
            "<td>"+column[i].desc+"</td>" +
            "<td hidden>"+column[i].id+"</td></tr>");
        }
        $("#storageFileTableBody").show();
    }
    function structFileType(resourceParamType) {
        $.get(rootPath + "/share/getResourceParamType",
            {
                resourceTypeCode: "STRUCTFILE"
            },
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    $("#typeSTRUCTFILE").empty();
                    for (var key in data.resourceParamTypes) {
                        var temp = data.resourceParamTypes[key];
                        if (key == resourceParamType) {
                            var trHTML = '<option value=' + key + ' selected>' + temp + '</a></li>';
                        } else {
                            var trHTML = '<option value=' + key + '>' + temp + '</a></li>';
                        }
                        $("#typeSTRUCTFILE").append(trHTML);
                    }
                } else {
                    dmallError("获取文件类型失败");
                }
            },
            "json"
        );
    };
    $("#typeSTRUCTFILE").change(function(){
        $("#structParamType").val($("#typeSTRUCTFILE option:selected").val());
    });

    function getStructData() {
        var radio = $('input[name="fileCome"]').filter(":checked");
        var structParams = {};
        if(radio.val() == "url"){
            var structTextArray = [];
            $("#structTextTable tr").each(function () {
                var structPara = new Object();
                structPara.name = $.trim($(this).children("td").eq(0).find("input").val());
                structPara.value = $.trim($(this).children("td").eq(1).find("input").val());
                structPara.des = $.trim($(this).children("td").eq(2).find("input").val());
                if(metadataMode == "1" || metadataMode == "0") {
                    structPara.metaCode = $.trim($(this).children("td").eq(3).children("a").data("metacode"));
                    structPara.cateCode = $.trim($(this).children("td").eq(3).children("a").data("catecode"));
                }
                if (structPara.name != "" && structPara.type != "") {
                    structTextArray.push(structPara);
                }
            });
            var structTextJsonString = JSON.stringify(structTextArray);

            structParams = {
                resourceParamType: $("#typeSTRUCTFILE option:selected").val(),
                url: $("#structUrl").val(),
                destColumn: structTextJsonString
            }
        } else
        {
            var scheduleType = $("#scheduleTypeList option:selected").val();
            var updateInterval = "";
            var interval = {};
            switch (scheduleType) {
                case "none":
                    break;
                case "minute":
                    updateInterval = $("#transmitIntervalMinuteValue").val()+"分钟";
                    interval.minute = $("#transmitIntervalMinuteValue").val();
                    break;
                case "hourOfDay":
                    updateInterval = "1天";
                    interval.minute = $("#transmitIntervalDayMinute option:selected").val();
                    interval.hourOfDay = $("#transmitIntervalDayHour option:selected").val();
                    break;
                case "weekday":
                    updateInterval = "1周";
                    interval.weekday = $("#transmitIntervalWeekValue option:selected").val();
                    interval.minute = $("#transmitIntervalDayMinute option:selected").val();
                    interval.hourOfDay = $("#transmitIntervalDayHour option:selected").val();
                    break;
                case "dayOfMonth":
                    updateInterval = "1月";
                    interval.dayOfMonth = $("#transmitIntervalMonthValue option:selected").val();
                    interval.minute = $("#transmitIntervalDayMinute option:selected").val();
                    interval.hourOfDay = $("#transmitIntervalDayHour option:selected").val();
                    break;
            }
            var scheduleInterval = JSON.stringify(interval);
            var data = getTableData($("#storageFileTableBody"),"array");
            var destColumn = JSON.stringify(data);
            structParams = {
                whereCondition: $("#where").val(),
                resourceParamType: "cvs",
                fileName:$("#fileName").val(),
                dbAccessId: $("#fileDbSrcList").data("srcid"),
                dbTable: $("#fileDbTable").val(),
                dbColumn: getFileDbData($("#storageFileDbBody"),"string"),
                provideType: $('input[name="createType"]').filter(":checked").val(),
                updateInterval: updateInterval,
                dbPartition: getFileDbPartitionData(),
                destColumn:destColumn,
                scheduleType:scheduleType,
                scheduleInterval:scheduleInterval
            }
        }
        return structParams;
    };
    function renderStruct(extraParams) {
        if(extraParams.dbAccessId == "" || extraParams.dbAccessId == null){
            structFileType(extraParams.resourceParamType);
            $("#structUrl").val(extraParams.url);
            var dbColumnString = eval("(" + extraParams.destColumn + ")");
            var structText = dbColumnString;
            structTextCount = structText.length;
            structTextId = structText.length;
            $("#structTextTable").empty();
            for (var i = 0; i < structText.length; i++) {
                var j = i + 1;
                var html = '<tr><td>' +
                    '          <input id="structTextField' + j + '" type="text" name="structTextField" class="form-control" maxlength="32"/>' +
                    '          <small class="errorStructTextField' + j + ' text-danger"></small></td>' +
                    '        <td>' +
                    '          <input id="structTextType' + j + '" type="text" class="form-control" name="structTextType" maxlength="16"/>' +
                    '          <small class="errorStructTextType' + j + ' text-danger"></small></td>' +
                    '        <td>' +
                    '          <input id="structTextDes' + j + '" type="text" class="form-control" name="structTextDes" maxlength="255"/>' +
                    '          <small class="errorStructTextDes' + j + ' text-danger"></small></td>';
                if(metadataMode == "1" || metadataMode == "0") {
                    if(structText[i].metaCode == "" || structText[i].metaCode == undefined){
                        html += '<td><a href="javascript:void(0)" onclick="addMeta($(this))" data-metacode="">添加关联</a>' +
                        '<div hidden><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
                        '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td>';
                    }else{
                        html += '<td><a href="javascript:void(0)" onclick="viewMeta(this)" data-metacode="' + structText[i].metaCode + '" data-catecode="' + structText[i].cateCode + '">' + structText[i].metaName + '</a>' +
                        '<div hidden><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
                        '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td>';
                    }
                }
                html +=  '<td><a href="#" class="removeVirtualText" style="font-size: 32px">×</a></td></tr> ';
                $("#structTextTable").append(html);
                $("#structTextField"+j).val(structText[i].name);
                $("#structTextType"+j).val(structText[i].value);
                $("#structTextDes"+j).val(structText[i].des);
            }
            $("input[name='fileCome']:eq(0)").attr("checked", "checked");
            $("#fileComeDbsrc").hide();
            $("#fileComeUrl").show();
        } else {
            var dbColumnString = eval("(" + extraParams.dbColumn + ")");
            var destColumnString = eval("(" + extraParams.destColumn + ")");
            var partitionMap = "";
            if (extraParams.dbPartition != "")
                partitionMap = eval("(" + extraParams.dbPartition + ")");
            dbAccessId = extraParams.dbAccessId;
            $("#fileDbSrcList").data("srcid",extraParams.dbAccessId);
            getFileDbTableData("get");
            $("#where").val(extraParams.whereCondition);
            $("#fileName").val(extraParams.fileName);
            var dbTable = extraParams.dbTable;
            var provideType = extraParams.provideType;
            $("input[name='fileCome']:eq(1)").attr("checked", "checked");
            $("#fileComeDbsrc").show();
            $("#fileComeUrl").hide();

            if (provideType == "ONCE") {
                $("input[name='createType']:eq(0)").attr("checked", "checked");
                $("#createInterval").hide();
            } else {
                $("input[name='createType']:eq(1)").attr("checked", "checked");
                $("#createInterval").show();
            }
            //获取源
            getDbSrcById(dbAccessId,$("#fileDbSrcList"));
            //获取表名
            $("#fileDbTable").val(dbTable);
            oldSearchStr = dbTable;
            oldFileDbTableStr = dbTable;
            //获取列与分区
            directFreshFileDbColumn(partitionMap,dbColumnString,destColumnString);
            renderScheduleInterval(extraParams.scheduleType,extraParams.scheduleInterval);
        }
    };
    function directFreshFileDbColumn(partitionMap,columns,destColumns){
        $("#storageFileDbBody").empty();
        $("#storageFileTableBody").empty();
        $("#storageFileDbPartition").empty();
        for(var i = 0; i < columns.length; i++){
            var trHTML = '<tr><td><input type="checkbox" checked hidden></td>' +
                '<td>' + columns[i].name + '</td>' +
                '<td>' + columns[i].type + '</td>' +
                '<td hidden>' + columns[i].comment + '</td>' +
                '</tr>';
            $("#storageFileDbBody").append(trHTML);
        }
        for(var i = 0; i < destColumns.length; i++){
            var trHTML = '<tr><td><input type="checkbox" checked hidden></td>' +
                '<td>' + destColumns[i].name + '</td>' +
                '<td>' + destColumns[i].type + '</td>' +
                '<td>' + destColumns[i].desc + '</td>' +
                '<td hidden>' + destColumns[i].id + '</td>' +
                '</tr>';
            $("#storageFileTableBody").append(trHTML);
        }
        if (partitionMap != null && partitionMap != "") {
            for (var key in partitionMap) {
                trHTML = '<tr><td><input type="checkbox" name="partitionColumn" checked hidden></td><td>' + key + '</td>' +
                '<td><input type="text" class="form-control"  value="' + partitionMap[key] + '"/><small class="text-danger"></small></td></tr>';
                $("#storageFileDbPartition").append(trHTML);
            }
            $("#filePartitionWrap").show();
        }
    }
    function initStruct() {
        var radio = $('input[name="fileCome"]').filter(":checked");
        if(radio.val() == "url"){
            var fileType = $("#structParamType").val();
            structFileType(fileType);
            if ($("#structCount").val() != undefined) {
                structTextCount = $("#structCount").val();
                structTextId = $("#structCount").val();
            }
        } else{
            oldSearchStr = $("#fileDbTable").val();
            oldFileDbTableStr = oldSearchStr;
            dbAccessId = $("#fileDbSrcList").data("srcid");
            getFileDbTableData("get");
            getDbSrcById(dbAccessId,$("#fileDbSrcList"));
            renderScheduleInterval($("#scheduleType").val(),$("#scheduleInterval").val());
            $("#createFileColumn").hide();
        }
    };

    function emptyStruct() {
        var fileType = $("#typeSTRUCTFILE").val();
        structFileType(fileType);
        //$("#structUrl").val("");
    };

    //由数据库生成文件
    //选择数据源
    $("#chooseFileDbSrc").click(function () {
        oldFileDbTableStr = "";
        openSrcModal("structFile");
    });

    /* 选择数据源相关 */
    function getFileDbSrcList(pageNum) {
        var dbType = "";

        $.get(rootPath + "/dbaccess/getdbsrc",
            {
                pageNumber: pageNum,
                dbSrcType: dbType,
                action: "ROLE_DEPARTMENT_CATALOGER",
                isCdc: 1
            },
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    var $listAll = $('#list-all');
                    $listAll.empty();
                    for (var i = 0; i < data.dbSrcList.length; i++) {
                        var dbAccess = data.dbSrcList[i];
                        var dbName = dbAccess.name + "(类型：" + dbAccess.type + ")";
                        var newOption = "<option value='" + dbAccess.id + "' data-type='" + dbAccess.type + "' id='" + dbAccess.connectID + "'>" + dbName + "</option>";
                        $listAll.append(newOption);
                    }
                    $("#totalPage").html(data.totalPage);
                    $("#currentPage").html(data.curPage);
                } else {
                    dmallError("获取数据源列表失败");
                }
            },
            "json"
        );
    }
    //修改源数据列
    function freshFileDb(dbAccessId, dbTableName) {
        $("#fileDbBody").empty();
        $("#loadingFileDbColumns").show();
        $.get(rootPath + "/dbaccess/table_columns",
            {
                dbSrcId: dbAccessId,
                dbTableName: dbTableName
            },
            function (data, status) {
                $("#loadingFileDbColumns").hide();
                if (status == "success") {
                    if (!data.tableInfo) {
                        dmallError("没有获取到列");
                    } else {
                        var tableInfo = data.tableInfo;
                        if(tableInfo.columns.length > 0){
                            var dbColumn = getFileDbData($("#storageFileDbBody"),"array");
                            for (var i = 0; i < tableInfo.columns.length; i++) {
                                var columns = tableInfo.columns[i];
                                var trHTML = '<tr><td width="3%"><input type="checkbox" name="idsFileDbTableColumn" id="idsFileDbTableColumn'+i+'" value=""></td>' +
                                    '<td width="47%"></td>' +
                                    '<td width="50%">' + columns.type + '</td>' +
                                    '<td hidden>' + columns.comment + '</td>' +
                                    '</tr>';
                                $("#fileDbBody").append(trHTML);
                                $("#idsFileDbTableColumn"+i).parent().next().text(columns.name);
                                if(dbColumn.length > 0){
                                    for (var j = 0; j < dbColumn.length; j++) {
                                        var name = dbColumn[j].name;
                                        if (name == columns.name) {
                                            $("#idsFileDbTableColumn" + i).prop("checked", true);
                                        }
                                    }
                                } else {
                                    var $enabledIds = $("#fileDbBody input[name='idsFileDbTableColumn']:enabled");
                                    $enabledIds.prop("checked", true);
                                    $("#selectAllFileDbColumns").prop("checked", true);
                                }
                                var columnsSize = $("#fileDbBody input[name='idsFileDbTableColumn']:enabled:not(:checked)").size();
                                if (0 < columnsSize) {
                                    $("#selectAllFileDbColumns").prop("checked", false);
                                } else {
                                    $("#selectAllFileDbColumns").prop("checked", true);
                                }
                                $(".errorFileDbTableColumnsListValue").hide();
                            }
                        }
                    }
                } else {
                    dmallError("获取列失败");
                }
            },
            "json"
        );
    }
    //修改文件列
    function freshFileDbColumnsTable() {
        $("#fileTableBody").empty();
        var dbColumn = getFileDbData($("#storageFileDbBody"),"array");
        var destColumn = getTableData($("#storageFileTableBody"),"array");
        if(destColumn.length > 0){
            for (var i = 0; i < destColumn.length; i++) {
                var tag = false;
                var countTag;
                for(var j = 0; j < dbColumn.length; j++){
                    if(destColumn[i].id == dbColumn[j].name){
                        tag = true;
                        countTag = j;
                    }
                }
                if(tag){
                    var columns = destColumn[i];
                    if(columns.desc == ""){
                        columns.desc = dbColumn[countTag].comment;
                    }
                    var trHTML = '<tr><td width="3%"><input type="checkbox" name="idsFileDbTableColumn" id="idsFileDbTableColumn' + i + '" checked hidden></td>' +
                        '<td width="15%">' + columns.id + '</td>' +
                        '<td width="30%">' + columns.type + '</td>' +
                        '<td width="7%" style="border: none"></td>' +
                        '<td width="15%"><input type="text" name="columnName" class="form-control" value="' + columns.name + '">' +
                        '<small class="text-danger"></small></td>' +
                        '<td width="30%"><input type="text" name="columnDesc" class="form-control" value="' + columns.desc + '"></td>' +
                        '</tr>';
                    $("#fileTableBody").append(trHTML);
                }
            }
            for (var i = 0; i < dbColumn.length; i++) {
                var tag = false;
                for(var j = 0; j < destColumn.length; j++){
                    if(destColumn[j].id == dbColumn[i].name){
                        tag = true;
                    }
                }
                if(!tag){
                    var columns = dbColumn[i];
                    if(columns.comment == null){
                        columns.comment = "";
                    }
                    var trHTML = '<tr><td width="3%"><input type="checkbox" name="idsFileDbTableColumn" id="idsFileDbTableColumn' + i + '" checked hidden></td>' +
                        '<td width="15%">' + columns.name + '</td>' +
                        '<td width="30%">' + columns.type + '</td>' +
                        '<td width="7%" style="border: none"></td>' +
                        '<td width="15%"><input type="text" name="columnName" class="form-control" value="' + columns.name + '">' +
                        '<small class="text-danger"></small></td>' +
                        '<td width="30%"><input type="text" name="columnDesc" class="form-control" value="' + columns.comment + '"></td>' +
                        '</tr>';
                    $("#fileTableBody").append(trHTML);
                }
            }
        } else{
            for (var i = 0; i < dbColumn.length; i++) {
                var columns = dbColumn[i];
                if(columns.comment == null){
                    columns.comment = "";
                }
                var trHTML = '<tr><td width="3%"><input type="checkbox" name="idsFileDbTableColumn" id="idsFileDbTableColumn' + i + '" checked hidden></td>' +
                    '<td width="15%">' + columns.name + '</td>' +
                    '<td width="30%">' + columns.type + '</td>' +
                    '<td width="7%" style="border: none"></td>' +
                    '<td width="15%"><input type="text" name="columnName" class="form-control" value="' + columns.name + '">' +
                    '<small class="text-danger"></small></td>' +
                    '<td width="30%"><input type="text" name="columnDesc" class="form-control" value="' + columns.comment + '"></td>' +
                    '</tr>';
                $("#fileTableBody").append(trHTML);
            }
        }
    }
    //获取分区
    function freshPartition(dbAccessId, dbTableName,partitionMap,type){
        $("#fileDbPartitionTableBody").empty();
        $("#storageFileDbPartition").hide();
        $("#filePartitionWrap").hide();
        $.get(rootPath + "/dbaccess/table_columns",
            {
                dbSrcId: dbAccessId,
                dbTableName: dbTableName
            },
            function (data, status) {
                $("#loadingFileDbColumns").hide();
                if (status == "success") {
                    if (!data.tableInfo) {
                        dmallError("没有获取到列");
                    } else {
                        var tableInfo = data.tableInfo;
                        if (tableInfo.partitions.length > 0) {
                            for (var i = 0; i < tableInfo.partitions.length; i++) {
                                var trHTML = "";
                                var columns = tableInfo.partitions[i];
                                var checked = false;
                                var value = "";
                                if(type == "new"){
                                    trHTML = '<tr><td><input type="checkbox" name="fileDbPartitionColumn"></td><td>' + columns + '</td>' +
                                    '<td><input type="text" class="form-control"  value=""/><small class="text-danger"></small></td></tr>';
                                }
                                else if(type == "edit"){
                                    var j = i+1;
                                    if(columns ==  $("#storagePartition tr:nth-child("+j+") td:nth-child(2)").text()){
                                        checked = true;
                                        value =  $("#storagePartition tr:nth-child("+j+") td:nth-child(3)").children("input").val();
                                    }
                                    if (checked)
                                        trHTML = '<tr><td><input type="checkbox" name="partitionColumn" checked></td><td>' + columns + '</td>' +
                                        '<td><input type="text" class="form-control"  value="' + value + '"/><small class="text-danger"></small></td></tr>';
                                    else
                                        trHTML =  '<tr><td><input type="checkbox" name="partitionColumn"></td><td>' + columns + '</td>' +
                                        '<td><input type="text" class="form-control" value=""/><small class="text-danger"></small></td></tr>';
                                }
                                else {
                                    for (var key in partitionMap) {
                                        if(key == columns) {
                                            hit = true;
                                            value = partitionMap[key];
                                        }
                                        if (hit)
                                            trHTML = '<tr><td><input type="checkbox" name="partitionColumn" checked></td><td>' + columns + '</td>' +
                                            '<td><input type="text" class="form-control"  value="' + value + '"/><small class="text-danger"></small></td></tr>';
                                        else
                                            trHTML =  '<tr><td><input type="checkbox" name="partitionColumn"></td><td>' + columns + '</td>' +
                                            '<td><input type="text" class="form-control" value=""/><small class="text-danger"></small></td></tr>';
                                    }
                                }
                                $("#fileDbPartitionTableBody").append(trHTML);
                            }
                            $("#filePartitionWrap").show();
                        }
                    }
                } else {
                    dmallError("获取列失败");
                }
            },
            "json"
        );
    }
    //全选框
    $("#selectAllFileDbColumns").click(function () {
        var $this = $(this);
        var $enabledIds = $("#fileDbBody input[name='idsFileDbTableColumn']:enabled");
        if ($this.prop("checked")) {
            $enabledIds.prop("checked", true);
        } else {
            $enabledIds.prop("checked", false);
        }
        $(".errorFileDbTableColumnsListValue").hide();
    });
    //点击某一行
    $("#fileDbBody").delegate("input[name='idsFileDbTableColumn']:enabled", "click", function () {
        var columnsSize = $("#fileDbBody input[name='idsFileDbTableColumn']:enabled:not(:checked)").size();
        if (0 < columnsSize) {
            $("#selectAllFileDbColumns").prop("checked", false);
        } else {
            $("#selectAllFileDbColumns").prop("checked", true);
        }
        $(".errorFileDbTableColumnsListValue").hide();
    });
    function getFileDbData($selector,type) {
        var data = [];
        var i = 0;
        var columns;
        $selector.find(":checkbox:checked").each(function () {
            var val = {};
            val.name = $(this).parent().next().text();
            val.type = $(this).parent().next().next().text();
            val.comment = $(this).parent().next().next().next().text();
            data[i++] = val;
        });
        if (i > 0) {
            columns = JSON.stringify(data);
        }
        if(type == "array"){
            return data;
        }else{
            return columns;
        }
    }
    function getTableData($selector,type) {
        var data = [];
        var i = 0;
        var columns;
        $selector.find(":checkbox:checked").each(function () {
            var val = {};
            val.name = $(this).parent().next().text();
            val.type = $(this).parent().next().next().text();
            val.desc = $(this).parent().next().next().next().text();
            val.id = $(this).parent().next().next().next().next().text();
            data[i++] = val;
        });
        if (i > 0) {
            columns = JSON.stringify(data);
        }
        if(type == "array"){
            return data;
        }else{
            return columns;
        }
    }
    function getFileTableData() {
        var data = [];
        var i = 0;
        $("#fileTableBody").find(":checkbox:checked").each(function () {
            var val = {};
            val.type = $(this).parent().next().next().text();
            val.id = $(this).parent().next().text();
            $(this).parent().parent().find("[name='columnName']").each(function (tdindex, tditem) {
                if(checkNotBlank($(tditem),$(tditem).siblings("small"),"*请输入列名")){
                    $("#fileTableBody").data("flag","false");
                    return false;
                } else{
                    val.name = $(tditem).val();
                }
            });
            $(this).parent().parent().find("[name='columnDesc']").each(function (tdindex, tditem) {
                val.desc = $(tditem).val();
            });
            data[i++] = val;
        });
        return data;
    }
    function getFileDbPartitionData() {
        var j = 0;
        var val = {};
        var partitions;
        if ($("#storageFileDbPartition").is(":hidden")){
            $("#fileDbPartitionTableBody").find(":checkbox:checked").each(function () {
                var ptValue = "";
                var ptName = $(this).parent().next().text();
                //      var ptValue = $("#partition"+j).val();
                $(this).parent().parent().find("[type='text']").each(function (tdindex, tditem) {
                    ptValue = $(tditem).val();
                });
                val[ptName] = ptValue;
                j++;
            });
        } else{
            $("#storageFileDbPartition").find(":checkbox:checked").each(function () {
                var ptValue = "";
                var ptName = $(this).parent().next().text();
                //      var ptValue = $("#partition"+j).val();
                $(this).parent().parent().find("[type='text']").each(function (tdindex, tditem) {
                    ptValue = $(tditem).val();
                });
                val[ptName] = ptValue;
                j++;
            });
        }

        if (j > 0) {
            partitions = JSON.stringify(val);
        }
        return partitions;
    }

    $("[name='createType']").on("change", function(){
        var radio = $('input[name="createType"]').filter(":checked");
        if (radio.length) {
            var createType = radio.val();
            if (createType == "PERIOD") {
                $("#createInterval").show();
            } else {
                $("#createInterval").hide();
            }
        }
    });
    //预览SQL
    $("#getSQL").click(function(){
        var pathname = window.location.pathname;
        var arr = pathname.split("/");
        var proName = arr[1];
        var connectId = $("#fileDbSrcList").data("connectid");
        var tableName = $("#fileDbTable").val();
        var where = $("#where").val();
        var column = updateDbTableColumns();
        if(checkFileDbSrcListValue() || checkFileDbTableListValue() || checkFileDbTableColumns("storageFileDbBody",$(".errorFileDb")) || checkNotBlank($("#where"),$(".errorWhere"),"请输入where条件")){
            return false;
        }
        $.post("/" + proName + "/mydata/demand/parsesql",
            {
                column: column,
                dbID: connectId,
                params: "",
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
    $("#where").focus(function(){
        $("#where").removeClass("errorC");
        $(".errorWhere").hide();
    });
    function checkWhere(){
        var pathname = window.location.pathname;
        var arr = pathname.split("/");
        var proName = arr[1];
        var connectId = $("#fileDbSrcList").data("connectid");
        var tableName = $("#fileDbTable").val();
        var where = $("#where").val();
        var column = updateDbTableColumns();
        var flag;
        if(where != ""){
            $.ajax({
                type: 'post',
                async: false,
                data:{
                    column: column,
                    dbID: connectId,
                    params: "",
                    tableName: tableName,
                    where: where
                },
                url: "/" + proName + "/mydata/demand/parsesql",
                success: function (data) {
                    if (data.result == "success") {
                        flag = false;
                    }
                },
                error: function (data) {
                    flag = true;
                    dmallAjaxError();
                }
            });
        } else{
            flag = false;
        }
        return flag;
    }
    //获取选中的数据源列
    function updateDbTableColumns() {
        var data = "";
        $("#storageFileDbBody").find(":checkbox:checked").each(function () {
            if (data == "") {
                data = $(this).parent().next().text();
            } else {
                data = data + "," + $(this).parent().next().text();
            }
        });
        return data;
    }

    //check相关
    //数据源
    $("#fileDbSrcList").focus(function () {
        if ($("#fileDbSrcList").val() == "") {
            $("#fileDbSrcList").removeClass("errorC");
            $(".errorFileDbSrcListValue").hide();
        }
    });
    function removeFileDbSrcListError() {
        $("#fileDbSrcList").removeClass("errorC");
        $(".errorFileDbSrcListValue").hide();
    }
    function checkFileDbSrcListValue() {
        if ($("#fileDbSrcList").val() == "") {
            $("#fileDbSrcList").addClass("errorC");
            $(".errorFileDbSrcListValue").html("*请选择数据源");
            $(".errorFileDbSrcListValue").css("display", "block");
            return true;
        }
        return false;
    }
    $("#fileDbSrcList").blur(function () {
        checkFileDbSrcListValue();
    });

    //数据表
    function checkFileDbTableListValue() {
        if ($("#fileDbTable").val() == "") {
            $("#fileDbTable").addClass("errorC");
            $(".errorFileDbTable").html("*请选择表");
            $(".errorFileDbTable").css("display", "block");
            return true;
        }
        return false;
    };
    //失去焦点
    $("#fileDbTableList").blur(function () {
        checkFileDbTableListValue();
    });

    //数据列
    function checkFileDbTableColumns(table,$className) {
        var size = $("#"+table+"").find(":checkbox:checked").size();
        if (size == 0) {
            $className.html("*请选择列");
            $className.css("display", "block");
            return true;
        } else {
            $className.hide();
            return false;
        }
    }

    //分区
    function checkFileDbPartition() {
        //dbPartition = getDbPartitionData();
        $("#filePartitionTable").find(":checkbox:checked").each(function () {
            var ptValue = "";
            var ptName = $(this).parent().next().text();
            //      var ptValue = $("#partition"+j).val();
            $(this).parent().parent().find("[type='text']").each(function (tdindex, tditem) {
                ptValue = $(tditem).val();
                if (ptValue == "") {
                    $(this).parent().parent().find("[type='text']").addClass("errorC");
                    $(this).parent().parent().find("[type='text']").siblings("small").show().html("*请输入分区值");
                    return true;
                } else {
                    $(this).parent().parent().find("[type='text']").removeClass("errorC");
                    $(this).parent().parent().find("[type='text']").siblings("small").hide();
                }
            });
        });
        return false;
    }

    //文件名
    $("#fileName").focus(function () {
        if ($("#fileName").val() == "") {
            $("#fileName").removeClass("errorC");
            $(".errorFileName").hide();
        }
    });
    function checkFileName(){
        if ($("#fileName").val() == "") {
            $("#fileName").addClass("errorC");
            $(".errorFileName").html("*请输入导出文件名");
            $(".errorFileName").css("display", "block");
            return true;
        }else if (!NameRegExp($("#fileName").val())) {
            $("#fileName").addClass("errorC");
            $(".errorFileName").html('*请输入导出文件名,由中文、字母、数字、"-","_"组成，1-120个字符');
            $(".errorFileName").css("display", "block");
            return true;
        }
        return false;
    }
    $("#fileName").blur(function () {
        checkFileName();
    });
    function checkConsistency(){
        var dbColumn = getFileDbData($("#storageFileDbBody"),"array");
        var destColumn = getTableData($("#storageFileTableBody"),"array");
        if(dbColumn.length != destColumn.length){
            $(".errorFileTable").html("*与数据源列不一致，请修改");
            $(".errorFileTable").css("display", "block");
            return true;
        }
        return false;
    }
    //数据源可拖动
    $(function () {
        $("#fileTableBody").sortable(
            {
                axis: 'y', // 仅纵向拖动目的列
                cursor:'move'
            }
        );
    });
}
