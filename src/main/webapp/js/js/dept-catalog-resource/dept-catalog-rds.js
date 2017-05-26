/**
 * Created by 如川 on 2016/3/17.
 */
ExtraCatalog.regGetData(Module.RDS, rdsGetData);
ExtraCatalog.regInit(Module.RDS, rdsInit);
ExtraCatalog.regRender(Module.RDS, rdsRender);
ExtraCatalog.regCheck(Module.RDS, rdsCheck);

function rdsGetData(){
    return getRdsData();
}

function rdsInit(bool) {
    if(bool)
        return initRds();
    else
        return emptyRds();
}

function rdsRender(catalog) {
    return renderRds(catalog);
}

function rdsCheck() {
    // return (checkRdsSrcListValue() || checkRdsTable() || checkRdsTableColumns() || checkUpdateIntervalValue2() || checkUpdateDateValue2());
    return checkRelateSrcListValue() || checkVirtualSrc() || checkVirtualTable($("#virtualTable"),tableData)  || checkExchangeItem();
}

$(document).ready()
{
    var metadataMode = $("#metadataMode").val();
    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    var proName = arr[1];
    var rootPath = "http://" + window.location.host + "/" + proName;
    var dataType = "DATATABLE";
    var dbAccessId = "";
    var dbTable = "";
    var dbColumns;
    var tableData = [];
    var newTableData = [];
    var provideType = "";
    var dbLineNumber = 0;
    var dataUpdateTime = "";
    var catalogId = "";
    var updateInterval;
    var oldSearchStr = "";
    var oldRdsTableStr = "";
    var rdsTableTag = 0;
    var isLimit = $("#isLimit").val();

    $("#updateIntervalValue2").focus(function () {
        if ($("#updateIntervalValue2").val() == "") {
            $("#updateIntervalValue2").removeClass("errorC");
            $(".errorUpdateIntervalValue2").hide();
        } else if (!IntRegExp($("#updateIntervalValue2").val())) {
            $("#updateIntervalValue2").removeClass("errorC");
            $(".errorUpdateIntervalValue2").hide();
        }
    });

    function checkUpdateIntervalValue2() {
        if ($("[name='provideType2']").filter(":checked").val() == "PERIOD") {
            if ($("#updateIntervalValue2").val() == "") {
                $("#updateIntervalValue2").addClass("errorC");
                $(".errorUpdateIntervalValue2").html("*请输入更新周期");
                $(".errorUpdateIntervalValue2").css("display", "block");
                return true;
            } else if (!IntRegExp($("#updateIntervalValue2").val())) {
                $("#updateIntervalValue2").addClass("errorC");
                $(".errorUpdateIntervalValue2").html("*更新周期必须为整数");
                $(".errorUpdateIntervalValue2").css("display", "block");
                return true;
            }
        }
        return false;
    }

    //更新周期失去焦点
    $("#updateIntervalValue2").blur(function () {
        checkUpdateIntervalValue2();
    });

    /**
     * 数据源输入框合规性检查
     */
    $("#rdsSrcList").focus(function () {
        if ($("#rdsSrcList").val() == 0) {
            $("#rdsSrcList").removeClass("errorC");
            $(".errorRdsSrcListValue").hide();
        }
    });
    function checkRdsSrcListValue() {
        if ($("#virtualSrcList").val() == 0) {
            $("#virtualSrcList").addClass("errorC");
            $(".errorVirtualSrcListValue").html("*请选择数据源");
            $(".errorVirtualSrcListValue").css("display", "block");
            return true;
        }
        return false;
    }

    //失去焦点
    $("#rdsSrcList").blur(function () {
        checkRdsSrcListValue();
    });
    function removeRdsSrcListError() {
        $("#rdsSrcList").removeClass("errorC");
        $(".errorRdsSrcListValue").hide();
    }

    /**
     * 更新日期合规性检查
     */
    $("#updateDate2").focus(function () {
        if ($("#updateDate2").val() == "") {
            $("#updateDate2").removeClass("errorC");
            $(".errorUpdateDateValue2").hide();
        }
    });

    function checkUpdateDateValue2() {
        if ($("#updateDate2").val() == "") {
            $("#updateDate2").addClass("errorC");
            $(".errorUpdateDateValue2").html("*请填写更新日期");
            $(".errorUpdateDateValue2").css("display", "block");
            return true;
        } else {
            $("#updateDate2").removeClass("errorC");
            $(".errorUpdateDateValue2").hide();
        }
        return false;
    };
    //失去焦点
    $("#updateDate2").blur(function () {
        checkUpdateDateValue2();
    });

    // 注册rds提供方式radio的change事件
    $("[name='provideType2']").on("change", provideTypeChange2);
    function provideTypeChange2() {
        var radio = $('input[name="provideType2"]').filter(":checked");
        if (radio.length) {
            provideType = radio.val();
            if (provideType == "PERIOD") {
                $("#updateInterval2").show();
                $("#extractDescriptionDiv").show();
            } else {
                $("#updateInterval2").hide();
                $("#extractDescriptionDiv").hide();
            }
        }
    };
    //选择rds数据源
    $("#chooseRdsSrc").click(function () {
        var resourceTypeCode = $("#resourceTypeCode").val();
        var type = "";
        if(resourceTypeCode == "RDS"){
            type = "rds";
        }else{
            type = "ads";
        }
        oldRdsTableStr = "";
        openSrcModal(type);
    });

    /* 选择数据源相关 */
    function getRDSDbSrcList(pageNum,type) {
        var isCdc = 1;
        provideType = $('input[name="provideType2"]').filter(":checked").val();
        if(provideType == "CONTINUOUS") {
            // 只查询oracleCDC/sqlserverCDC/mysqlBinlog类型的数据库
            isCdc = 2;
        } else if (provideType == "PERIOD") {
            isCdc = 0;
        }

        $.get(rootPath + "/dbaccess/getdbsrc",
            {
                pageNumber: pageNum,
                dbSrcType: type,
                action: "ROLE_DEPARTMENT_CATALOGER",
                isCdc: isCdc
            },
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    var $listAll = $('#list-all');
                    $listAll.empty();
                    for (var i = 0; i < data.dbSrcList.length; i++) {
                        var dbAccess = data.dbSrcList[i];
                        var dbName = dbAccess.name + "(类型：" + dbAccess.type + ")";
                        var newOption = "<option value='" + dbAccess.id + "' id='" + dbAccess.type + "'>" + dbName + "</option>";
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

    function freshRdsColumnsTable(type){
        $("#rdsTableColumnsTableBody").empty();
        $("#splitPkList").empty();
        var opHTML = '<option value="">请选择</option>';
        $("#splitPkList").append(opHTML);
        $(".errorRdsTableColumnsListValue").hide();
        $("#loadingRdsColumns").show();
        dbAccessId = $("#rdsSrcList").data("srcid");
        $.get(rootPath + "/dbaccess/table_columns",
            {
                dbSrcId: dbAccessId,
                dbTableName: $("#rdsTable").val()
            },
            function (data, status) {
                $("#loadingRdsColumns").hide();

                if (status == "success") {
                    if (!data.tableInfo) {
                        dmallError("没有获取到列");
                    } else {
                        var tableInfo = data.tableInfo;
                        for(var i = 0; i < tableInfo.columns.length; i++) {
                            var columns = tableInfo.columns[i];
                            if(columns.type == "Integer"){
                                var opHTML = '<option value=' + columns.name + '>' + columns.name + '</option>';
                                $("#splitPkList").append(opHTML);
                            }
                        }
                        if(type == "new"){
                            for (var i = 0; i < tableInfo.columns.length; i++) {
                                var columns = tableInfo.columns[i];
                                if(columns.comment == null){
                                    columns.comment = "";
                                }
                                var trHTML = '<tr><td><input type="checkbox" name="rdsDbTableColumn" value=""></td>' +
                                    '<td name="rdsTableColumnName">' + columns.name + '</td>' +
                                    '<td><input name="columnRdsAlias" type="text" class="form-control" maxlength="32" value="'+columns.name+'"></td>' +
                                    '<td name="rdsTableColumnType">' + columns.type + '</td>' +
                                    '<td><input name="columnRdsDesc" type="text" class="form-control" maxlength="255" value="'+columns.comment+'"></td>';
                                if(metadataMode == "1" || metadataMode == "0"){
                                    trHTML += '<td><a href="javascript:void(0)" onclick="addMeta($(this))" data-metacode="">添加关联</a>' +
                                    '<div hidden><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
                                    '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td></tr>';
                                }else{
                                    trHTML += '</tr>';
                                }
                                $("#rdsTableColumnsTableBody").append(trHTML);
                            }
                            var $enabledIds = $("#rdsTableColumnsTable input[name='rdsDbTableColumn']:enabled");
                            $enabledIds.prop("checked", true);
                            $("#selectAllRdsColumns").prop("checked", true);
                        }
                        else{
                            for (var i = 0; i < tableInfo.columns.length; i++) {
                                var columns = tableInfo.columns[i];
                                if(columns.comment == null){
                                    columns.comment = "";
                                }
                                var trHTML = '<tr><td><input type="checkbox" name="rdsDbTableColumn" id="rdsDbTableColumn'+i+'"></td>' +
                                    '<td name="rdsTableColumnName">' + columns.name + '</td>' +
                                    '<td><input name="columnRdsAlias" type="text" class="form-control" id="columnRdsAlias'+i+'" maxlength="32" value="'+columns.name+'"></td>' +
                                    '<td name="rdsTableColumnType">' + columns.type + '</td>' +
                                    '<td><input name="columnRdsDesc" type="text" class="form-control" id="columnRdsDesc'+i+'" maxlength="255" value="'+columns.comment+'"></td>';
                                if(metadataMode == "1" || metadataMode == "0"){
                                    trHTML += '<td><a href="javascript:void(0)" onclick="addMeta($(this))" data-metacode="">添加关联</a>' +
                                    '<div hidden><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
                                    '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td></tr>';
                                }else{
                                    trHTML += '</tr>';
                                }
                                $("#rdsTableColumnsTableBody").append(trHTML);

                                var dbColumnString = eval("(" + $("#rdsDataJson").val() + ")");
                                for (var j = 0; j < dbColumnString.length; j++) {
                                    if(dbColumnString[j].alias == undefined){
                                        dbColumnString[j].alias = "";
                                    }
                                    var rdsname = dbColumnString[j].name;
                                    if (rdsname == columns.name) {
                                        $("#rdsDbTableColumn" + i).prop("checked", true);
                                        var limit = $("#isLimit").val();
                                        if(limit == "true"){
                                            $("#rdsDbTableColumn" + i).prop("disabled", "disabled");
                                        }
                                        if(dbColumnString[j].desc != ""){
                                            $("#columnRdsDesc" + i).val(dbColumnString[j].desc);
                                        }
                                        $("#columnRdsAlias" + i).val(dbColumnString[j].alias);
                                        if(dbColumnString[j].metaCode != undefined && dbColumnString[j].metaCode != ""){
                                            $("#rdsDbTableColumn" + i).parent().next().next().next().next().next().children("a").data("metacode",dbColumnString[j].metaCode);
                                            $("#rdsDbTableColumn" + i).parent().next().next().next().next().next().children("a").data("catecode",dbColumnString[j].cateCode);
                                            $("#rdsDbTableColumn" + i).parent().next().next().next().next().next().children("a").text(dbColumnString[j].metaName);
                                            $("#rdsDbTableColumn" + i).parent().next().next().next().next().next().children("a").siblings("div").show();
                                        }
                                    }
                                }
                            }
                            var columnsSize = $("#rdsTableColumnsTable input[name='rdsDbTableColumn']:enabled:not(:checked)").size();
                            if (0 < columnsSize) {
                                $("#selectAllRdsColumns").prop("checked", false);
                                $("#selectAllRdsColumns").attr("disabled", false);
                            } else {
                                $("#selectAllRdsColumns").prop("checked", true);
                                $("#selectAllRdsColumns").attr("disabled", true);
                            }
                            $(".errorRdsTableColumnsListValue").hide();
                            var name = $("#selectedSplitPk").val();
                            $("#splitPkList option[value='"+name+"']").attr("selected","selected");
                        }
                        $("#selectRdsCheckbox").show();
                        $("#rdsTableColumnsTableBody").show();
                        $("#rdsColumnsDiv").show();
                    }
                } else {
                    dmallError("获取列失败");
                }
            },
            "json"
        );
    }
    //点击某一行
    $("#rdsTableColumnsTable").delegate("input[name='rdsDbTableColumn']:enabled", "click", function () {
        var columnsSize = $("#rdsTableColumnsTable input[name='rdsDbTableColumn']:not(:checked)").size();
        if (0 < columnsSize) {
            $("#selectAllRdsColumns").prop("checked", false);
        } else {
            $("#selectAllRdsColumns").prop("checked", true);
        }
        $(".errorRdsTableColumnsListValue").hide();
        var name = $(this).parent().next().text();
        var type = $(this).parent().next().next().text();
        if(type == "Integer"){
            if($(this).filter(":checked").size() > 0){
                $("#splitPkList").append(new Option(name, name));
            }else{
                $("#splitPkList option[value='"+name+"']").remove();
            }
        }
    });
    function checkRdsTableColumns() {
        $(".errorRdsTableColumnsListValue").hide();
        updateRdsTableColumns();
        var size = $("#rdsTableColumnsTable input[name='rdsDbTableColumn']:checked").size();
        if (size == 0) {
            $(".errorRdsTableColumnsListValue").html("*请选择列");
            $(".errorRdsTableColumnsListValue").css("display", "block");
            return true;
        } else {
            $(".errorRdsTableColumnsListValue").hide();
        }
        return false;
    }

    function updateRdsTableColumns() {
        var columns;
        var virtualArray = [];
        $('#relationFinalTable tr').each(function () {
            var virtualPara = new Object();
            virtualPara.dataTableItemNo = $.trim($(this).children().eq(0).children().html());
            virtualPara.dataDirectoryItemNo = $.trim($(this).children().eq(1).children().html());
            virtualPara.dbColumn = $.trim($(this).children().eq(2).html());
            virtualPara.dbColumnType = $.trim($(this).children().eq(3).html());
            virtualPara.dbColumnDesc = $.trim($(this).children().eq(4).html());
            virtualArray.push(virtualPara);
        });
        columns = JSON.stringify(virtualArray);
        return columns;

        // var data = [];
        // var i = 0;
        // var columns;
        // if ($("#storageRdsColumns").is(":hidden")){
        //     $("#rdsTableColumnsTableBody").find(":checkbox:checked").each(function () {
        //         var val = {};
        //         val.name = $(this).parent().next().text();
        //         $(this).parent().parent().find("[name='columnRdsAlias']").each(function (tdindex, tditem) {
        //             val.alias = $(tditem).val();
        //         });
        //         val.type = $(this).parent().next().next().next().text();
        //         $(this).parent().parent().find("[name='columnRdsDesc']").each(function (tdindex, tditem) {
        //             val.desc = $(tditem).val();
        //         });
        //         if(metadataMode == "0" || metadataMode =="1") {
        //             val.metaCode = $(this).parent().next().next().next().next().next().children("a").data("metacode");
        //             val.cateCode = $(this).parent().next().next().next().next().next().children("a").data("catecode");
        //         }
        //         data[i++] = val;
        //     });
        // } else{
        //     $("#storageRdsColumns").find(":checkbox:checked").each(function () {
        //         var val = {};
        //         val.name = $(this).parent().next().text();
        //         $(this).parent().parent().find("[name='columnRdsAlias']").each(function (tdindex, tditem) {
        //             val.alias = $(tditem).val();
        //         });
        //         val.type = $(this).parent().next().next().next().text();
        //         $(this).parent().parent().find("[name='columnRdsDesc']").each(function (tdindex, tditem) {
        //             val.desc = $(tditem).val();
        //         });
        //         if(metadataMode == "0" || metadataMode =="1") {
        //             val.metaCode = $(this).parent().next().next().next().next().next().children("a").data("metacode");
        //             val.cateCode = $(this).parent().next().next().next().next().next().children("a").data("catecode");
        //         }
        //         data[i++] = val;
        //     });
        // }
        // if (i > 0) {
        //     columns = JSON.stringify(data);
        // }
        // return columns;
    }
    $("#editRdsColumns").click(function(){
        if(!$("#storageRdsColumns").is(":hidden")){
            $("#selectRdsCheckbox").show();
            freshRdsColumnsTable("edit");
            $("#storageRdsColumns").hide();
        }
    });
    $("#selectAllRdsColumns").click(function () {
        var $this = $(this);
        var $enabledIds = $("#rdsTableColumnsTable input[name='rdsDbTableColumn']:enabled");
        //var $contentRow = $("#dbTableColumnsTable tr:gt(0)");

        $("#splitPkList").empty();
        var opHTML = '<option value="">请选择</option>';
        $("#splitPkList").append(opHTML);
        if($this.filter(":checked").size() > 0){
            var trs = $("#rdsTableColumnsTableBody").children("tr");
            for(var i=0; i<trs.length; i++){
                var tds = trs.eq(i).find("td");
                var name = tds.eq(1).text();//字段
                var type = tds.eq(3).text();//类型
                if(type == "Integer"){
                    $("#splitPkList").append(new Option(name,name));
                }
            }
        }

        if ($this.prop("checked")) {
            $enabledIds.prop("checked", true);
            if ($enabledIds.filter(":checked").size() > 0) {
                //$contentRow.addClass("active");
            } else {
                //$deleteButton.attr("disabled", true);
            }
        } else {
            $enabledIds.prop("checked", false);
            //$contentRow.removeClass("active");
        }

        $(".errorRdsTableColumnsListValue").hide();
    });

    // 数据类型选择
    $("[name='dataType']").on("change", dataTypeChange);
    function dataTypeChange() {
        var radio = $('input[name="dataType"]').filter(":checked");
        if (radio.length) {
            dataType = radio.val();
            if (dataType == "DATATABLE") {
                $("#dataBasePara").show();
                $("#apiPara").hide();

            } else if (dataType == "DATAAPI") {
                $("#dataBasePara").hide();
                $("#apiPara").show();
            }
        }
    };

    function getRdsData() {
        dbTable = $("#virtualTable").val();
        // dbLineNumber = $("#rdsDataSize").val();
        // dataUpdateTime = $("#updateDate2").val();
        // provideType = $('input[name="provideType2"]').filter(":checked").val();
        // if ($("#updateIntervalValue2").val() != "") {
        //     updateInterval = $("#updateIntervalValue2").val() + $("#updateIntervalList2 option:selected").val();
        // }
        //if (resourceTypeCode == "RDS") {
        //    resourceParamType = "RDS";
        //} else if (resourceTypeCode == "ADS") {
        //    resourceParamType = "ADS";
        //}
        var resourceParamType = $("#resourceParamType").val();
        dbColumns = updateRdsTableColumns();
        var extractDescription = $("#extractDescription").val();
        var rdsParams = {
            resourceParamType: resourceParamType,
            dbAccessId: dbAccessId,
            dbTable: dbTable,
            // dbColumn: dbColumns,
            itemJson:dbColumns,
            // provideType: provideType,
            // updateInterval: updateInterval,
            // dataUpdateTime: dataUpdateTime,
            // dbLineNumber: dbLineNumber,
            splitPk:checkSplitPk()
            // extractDescription:extractDescription
        }
        return rdsParams;
    };

    function renderRds(catalog) {
        var itemList = eval("(" + catalog.itemJson + ")");
        $('#itemJson').data('itemList', itemList);
        for (var i = 0; i < itemList.length; i++){
            if(itemList[i] != ''){
                if(createType != 'copy'){
                    var obj = {};
                    var oldList = {};
                    if(itemList[i].dataDirectoryItemNo == '--' || itemList[i].dataDirectoryItemNo == ''){
                        obj['dataDirectoryItemNo'] = '';
                        oldList['dataDirectoryItemNo'] = '--';
                    }else {
                        obj['dataDirectoryItemNo'] = itemList[i].dataDirectoryItemNo;
                        oldList['dataDirectoryItemNo'] = '<a href="#" class="toDataItemDetail">'+itemList[i].dataDirectoryItemNo+'</a>';
                    }
                    if(itemList[i].dataTableItemNo == '--' || itemList[i].dataTableItemNo == ''){
                        obj['dataTableItemNo'] = '';
                        oldList['dataTableItemNo'] = '--';
                    }else {
                        obj['dataTableItemNo'] = itemList[i].dataTableItemNo;
                        oldList['dataTableItemNo'] = '<a href="#" class="toDataItemDetail">'+itemList[i].dataTableItemNo+'</a>';
                    }
                    obj['dbColumn'] = itemList[i].dbColumn;
                    obj['dbColumnType'] = itemList[i].dbColumnType;
                    obj['dbColumnDesc'] = itemList[i].dbColumnDesc;
                    itemMappingArr.push(obj);
                    oldList['dbColumn'] = itemList[i].dbColumn;
                    oldList['dbColumnType'] = itemList[i].dbColumnType;
                    oldFinalTableList.push(oldList);

                    var html = '<tr>';
                    if(itemList[i].dataDirectoryItemNo =='')itemList[i].dataDirectoryItemNo = '--';
                    if(itemList[i].dataDirectoryItemNo == '--'){
                        html += '<td><a href="#" class="addDataDirectory">未指定</a></td>';
                    }else if(itemList[i].dataDirectoryItemName != undefined && itemList[i].dataDirectoryItemName == 'deleted'){
                        html += '<td class="itemDeleted">' + itemList[i].dataDirectoryItemNo + '</td>';
                    }else {
                        html += '<td><a href="#" class="toDataItemDetail">' + itemList[i].dataDirectoryItemNo + '</a></td>';
                    }
                    if(itemList[i].dataTableItemNo =='')itemList[i].dataTableItemNo = '--';
                    if(itemList[i].dataTableItemNo == '--'){
                        html += '<td><a href="#" class="addDataTable">未指定</a></td>';
                    }else if(itemList[i].dataTableItemName != undefined && itemList[i].dataTableItemName == 'deleted'){
                        html += '<td class="itemDeleted">' + itemList[i].dataTableItemNo + '</td>';
                    }else {
                        html += '<td><a href="#" class="toDataItemDetail">' + itemList[i].dataTableItemNo + '</a></td>';
                    }
                    html += '<td><a href="#" class="removeItemMapping" style="font-size: 14px"><em class="fa fa-times-circle"></em></a></td></tr>';
                    $("#virtualTextTable").append(html);
                }
            }

            if(itemList[i].dbColumnType == 'Integer'){
                var opHTML = '<option value=' + itemList[i].dbColumn + '>' + itemList[i].dbColumn + '</option>';
                $("#virtualSplitPkList").append(opHTML);
            }
        }
        $('#virtualFinalTable').show();
        $('#inlineRadio1').attr('checked', true);
        $('#relateWrap').show();
        var resourceTypeCode = $("#resourceTypeCode").val();
        $('#relateSrcList').val(resourceTypeCode.toLowerCase());
        $('#relationList').show();
        getVirtualResData(resourceTypeCode);
        $('#virtualOdpsPara').hide();
        $('#virtualRdsPara').show();



        // $("#rdsDataJson").val(catalog.dbColumn);
        // var dbColumnString = eval("(" + catalog.dbColumn + ")");
        $("#resourceDetailName").data("resourceTypeCode",resourceTypeCode);
        $("#resourceParamType").val(catalog.resourceParamType);
        // $("#rdsDataSize").val(catalog.dbLineNumber);
        // $("#updateDate2").val(catalog.dataUpdateTime);
        dbAccessId = catalog.dbAccessId;
        $("#virtualSrcList").data("srcid",dbAccessId);
        dbTable = catalog.dbTable;
        oldSearchStr = catalog.dbTable;
        oldRdsTableStr = oldSearchStr;
        // var provideType = catalog.provideType;
        // if (provideType == "ONCE") {
        //     $("input[name='provideType2']:eq(0)").attr("checked", "checked");
        //     $("#updateInterval2").hide();
        //     $("#extractDescriptionDiv").hide();
        // } else if (provideType == "CONTINUOUS") {
        //     $("input[name='provideType2']:eq(1)").attr("checked", "checked");
        //     $("#updateInterval2").hide();
        //     $("#extractDescriptionDiv").hide();
        // } else {
        //     $("input[name='provideType2']:eq(2)").attr("checked", "checked");
        //     $("#updateInterval2").show();
        //     $("#extractDescriptionDiv").show();
        // }
        // var update = catalog.updateInterval;
        // if (update != "" && update != null) {
        //     var num = parseInt(update.replace(/[^0-9]/ig, ""));
        //     var unit = update.substr(update.length - 1, 1);
        //     if (unit == "钟") {
        //         unit = "分钟";
        //     }
        // }
        // $("#updateIntervalValue2").val(num);
        // $("#updateIntervalList2").val(unit);
        getDbSrcById(dbAccessId,$("#virtualSrcList"));
        $("#virtualTable").val(dbTable);
        getRdsTableData("get");
        // $("#storageRdsColumns").empty();
        $("#rdsColumnsDiv").show();
        // var tableInfo = dbColumnString;
        // for (var i = 0; i < tableInfo.length; i++) {
        //     var columns = tableInfo[i];
        //     if(columns.alias == undefined){
        //         columns.alias = "";
        //     }
        //     if(columns.metaCode != "" && columns.metaCode != undefined){
        //         var trHTML = '<tr><td><input type="checkbox" name="rdsDbTableColumn" checked hidden></td>' +
        //             '<td name="rdsTableColumnName">' + columns.name + '</td>' +
        //             '<td><input name="columnRdsAlias" type="text" class="form-control" value="'+columns.alias+'" maxlength="32"></td>' +
        //             '<td name="rdsTableColumnType">' + columns.type + '</td>' +
        //             '<td><input name="columnRdsDesc" type="text" class="form-control" value="'+columns.desc+'" maxlength="255"></td>';
        //         if(metadataMode == "1" || metadataMode == "0") {
        //             trHTML += '<td><a href="javascript:void(0)" onclick="viewMeta(this)" data-metacode="' + columns.metaCode + '" data-catecode="' + columns.cateCode + '">' + columns.metaName + '</a>' +
        //             '<div><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
        //             '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td></tr>';
        //         }else{
        //             trHTML += '</tr>';
        //         }
        //     } else {
        //         var trHTML = '<tr><td><input type="checkbox" name="rdsDbTableColumn" checked hidden></td>' +
        //             '<td name="rdsTableColumnName">' + columns.name + '</td>' +
        //             '<td><input name="columnRdsAlias" type="text" class="form-control" value="'+columns.alias+'" maxlength="32"></td>' +
        //             '<td name="rdsTableColumnType">' + columns.type + '</td>' +
        //             '<td><input name="columnRdsDesc" type="text" class="form-control" value="'+columns.desc+'" maxlength="255"></td>';
        //         if(metadataMode == "1" || metadataMode == "0"){
        //             trHTML += '<td><a href="javascript:void(0)" onclick="addMeta($(this))" data-metacode="">添加关联</a>' +
        //             '<div hidden><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
        //             '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td></tr>';
        //         }else{
        //             trHTML += '</tr>';
        //         }
        //     }
        //     $("#storageRdsColumns").append(trHTML);
        // }

        // for(var i = 0; i < dbColumnString.length; i++) {
        //     var columns = dbColumnString[i];
        //     if(columns.type == "Integer"){
        //         var opHTML = '<option value=' + columns.name + '>' + columns.name + '</option>';
        //         $("#splitPkList").append(opHTML);
        //     }
        // }
        //集群拆分字段
        var type = $("#relateSrcList").val();
        var name = catalog.splitPk;
        $("#virtualSplitPkList").data("name",name);
        initRealCol(type,"new");
        // $("#virtualSplitPkList option[value='"+name+"']").attr("selected","selected");
        // $("#selectedSplitPk").attr("value",name);

        $("#storageRdsColumns").show();
        $("#rdsTableColumnsTableBody").hide();
        $("#selectRdsCheckbox").hide();
        $(".errorRdsTableColumnsListValue").hide();
    };

    function initRds() {
        $('#inlineRadio1').attr('checked', true);
        $('#virtualFinalTable').show();
        $('#relateWrap').show();
        var resourceTypeCode = $("#resourceTypeCode").val();
        $('#relateSrcList').val(resourceTypeCode.toLowerCase());
        $('#relationList').show();
        getVirtualResData(resourceTypeCode);
        dbAccessId = $("#dbAccessId").val();
        getDbSrcById(dbAccessId,$("#virtualSrcList"));
        oldSearchStr = $("#virtualTable").val();
        oldDbTableStr = oldSearchStr;
        $("#virtualSrcList").data("srcid", dbAccessId);
        getRdsTableData("get");
        $('#virtualRdsPara').show();
        $('#virtualOdpsPara').hide();
        var splitPk = $('#virtualSplitPk').val();
        var type = $("#relateSrcList").val();
        $("#virtualSplitPkList").data("name",splitPk);
        $('#virtualSplitPkList').val(splitPk);
        initRealCol(type,"new");

        var itemList = eval("("+$('#itemJson').val()+")");
        for(var i = 0; i < itemList.length; i++){
            var obj = {};
            var oldList = {};
            if(itemList[i].dataDirectoryItemNo == '--' || itemList[i].dataDirectoryItemNo == ''){
                obj['dataDirectoryItemNo'] = '';
                oldList['dataDirectoryItemNo'] = '--';
            }else {
                obj['dataDirectoryItemNo'] = itemList[i].dataDirectoryItemNo;
                oldList['dataDirectoryItemNo'] = '<a href="#" class="toDataItemDetail">'+itemList[i].dataDirectoryItemNo+'</a>';
            }
            if(itemList[i].dataTableItemNo == '--' || itemList[i].dataTableItemNo == ''){
                obj['dataTableItemNo'] = '';
                oldList['dataTableItemNo'] = '--';
            }else {
                obj['dataTableItemNo'] = itemList[i].dataTableItemNo;
                oldList['dataTableItemNo'] = '<a href="#" class="toDataItemDetail">'+itemList[i].dataTableItemNo+'</a>';
            }
            obj['dbColumn'] = itemList[i].dbColumn;
            obj['dbColumnType'] = itemList[i].dbColumnType;
            obj['dbColumnDesc'] = itemList[i].dbColumnDesc;
            itemMappingArr.push(obj);
            oldList['dbColumn'] = itemList[i].dbColumn;
            oldList['dbColumnType'] = itemList[i].dbColumnType;
            oldFinalTableList.push(oldList);
        }

        // var update = $("#rdsUpdate").val();
        // if (update != "") {
        //     var num = parseInt(update.replace(/[^0-9]/ig, ""));
        //     var unit = update.substr(update.length - 1, 1);
        //     if (unit == "钟") {
        //         unit = "分钟";
        //     }
        // }
        // dbAccessId = $("#dbAccessId").val();
        // $("#updateIntervalValue2").val(num);
        // $("#updateIntervalList2").val(unit);
        //var databaseT = "rds";
        //if (oldResourceTypeCode == "RDS") {
        //    databaseT = "rds";
        //} else if (oldResourceTypeCode == "ADS") {
        //    databaseT = "ads";
        //}
        // oldSearchStr = $("#virtualTable").val();
        // oldRdsTableStr = oldSearchStr;
        // getDbSrcById(dbAccessId,$("#virtualSrcList"));
        // getRdsTableData("get");
        // $("#rdsColumnsDiv").show();
    };

    function emptyRds() {
        $("#rdsDataSize").val("");
        $("input[name='provideType2']:eq(0)").attr("checked", 'checked');
        $("#updateInterval2").hide();
        $("#extractDescriptionDiv").hide();
        $("#dbTableColumnsTable").hide();
        $("#rdsTableColumnsTable").show();
    }
    $("#rdsTable").click(function(){
        if(isLimit == "false"){
            var src = $("#rdsSrcList").val();
            if(src == ""){
                $("#rdsSrcList").addClass("errorC");
                $(".errorRdsSrcListValue").html("*请选择数据源");
                $(".errorRdsSrcListValue").css("display", "block");
            }else{
                var str = $("#rdsTable").val();
                rdsTableTag = 0;
                if(str == ""){
                    $("#loadingRdsTable").show();
                    getRdsTableData("draw");
                }else{
                    getRdsTableData("search");
                }
            }
        }
    });
    function getRdsTableData(type){
        $.get(rootPath + "/dbaccess/tables",
            {
                dbSrcId: dbAccessId
            },
            function (data, status) {
                tableData = [];
                $("#loadingRdsTable").hide();
                if (status == "success") {
                    $("#rdsTableList").empty();
                    if (data.resultList.length > 0) {
                        for (var i = 0; i < data.resultList.length; i++) {
                            var table = data.resultList[i];
                            tableData.push(table);
                        }
                        if(type == "draw"){
                            drawTabelTree("virtual",tableData);
                        }else if(type == "search"){
                            var str = $("#rdsTable").val();
                            newTableData = searchTableTree(str,tableData,"normal");
                            drawTabelTree("virtual",newTableData);
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
    $("#rdsTable").keyup(function(){
        if(oldSearchStr == ""){
            oldSearchStr = $("#rdsTable").val();
        }
        var str = $("#rdsTable").val();
        if(str.length >oldSearchStr.length){
            newTableData = searchTableTree(str,newTableData,"normal");
        }else{
            newTableData = searchTableTree(str,tableData,"normal");
        }
        drawTabelTree("virtual",newTableData);
        oldSearchStr = $("#rdsTable").val();
    });

    $("#rdsTableList").delegate("li", "click", function () {
        rdsTableTag = 1;
        $("#rdsTableListWrap").hide();
        if(this.title != oldRdsTableStr){
            $("#rdsTable").val(this.title);
            $("#storageRdsColumns").hide();
            $("#rdsColumnsDiv").hide();
            $("#editRdsColumns").hide();
            freshRdsColumnsTable("new");
            oldSearchStr = $("#rdsTable").val();
            oldRdsTableStr = oldSearchStr;
        }else{
            $("#rdsTable").val(this.title);
            $("#rdsColumnsDiv").show();
//            freshRdsColumnsTable("new");
        }
    });
    function rdsTableBlur(){
        var str = $("#rdsTable").val();
        if(rdsTableTag != 1){
            $("#rdsTableListWrap").hide();
            if(checkRdsTable()){
                $("#rdsColumnsDiv").hide();
            }else{
                if(str != oldRdsTableStr){
                    $("#storageRdsColumns").hide();
                    $("#rdsColumnsDiv").hide();
                    $("#editRdsColumns").hide();
                    freshRdsColumnsTable("new");
                    oldSearchStr = $("#rdsTable").val();
                    oldRdsTableStr = oldSearchStr;
                }else{
                    $("#rdsColumnsDiv").show();
                }
            }
        }
    }
    $("#rdsTableListWrap").mouseover(function(){
        $("#rdsTable").unbind('blur');
    });
    $("#rdsTableListWrap").mouseleave(function(){
        $("#rdsTable").bind("blur",function(){
            rdsTableBlur();
        });
    });
    $("#rdsTable").blur(function(){
        rdsTableBlur();
    });

    function checkRdsTable(){
        var str = $("#virtualTable").val();
        var checkArr = searchTableTree(str,tableData,"exact");
        if(checkArr.length <= 0){
            $("#virtualTable").addClass("errorC");
            $("#virtualTable").siblings("small").html("*请选择正确的表");
            $("#virtualTable").siblings("small").css("display", "block");
            return true;
        }
    }
};

$("#splitPkList").change(
    function () {
        splitPk = $("#splitPkList option:selected").val();
        $('#errorVirtualSplitPkList').hide();
    }
);

function checkSplitPk() {
    splitPk = $("#virtualSplitPkList option:selected").val();
    return splitPk;
}
function checkSplitPkBlank() {
    splitPk = $("#virtualSplitPkList option:selected").val();
    if(splitPk == ''){
        $('#errorVirtualSplitPkList').show().html('请选择集群拆分字段');
        return true;
    }
    return false;
}

