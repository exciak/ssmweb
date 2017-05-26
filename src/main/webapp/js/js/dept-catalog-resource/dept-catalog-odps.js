/**
 * Created by 如川 on 2016/3/17.
 */

ExtraCatalog.regGetData(Module.ODPS, odpsGetData);
ExtraCatalog.regInit(Module.ODPS, odpsInit);
ExtraCatalog.regRender(Module.ODPS, odpsRender);
ExtraCatalog.regCheck(Module.ODPS, odpsCheck);

function odpsGetData() {
    return getOdpsData();
}

function odpsInit(bool) {
    if (bool)
        return initOdps();
    else
        return emptyOdps();
}

function odpsRender(catalog) {
    return renderOdps(catalog);
}

function odpsCheck() {
    return (checkRelateSrcListValue() || checkDbSrcListValue() || checkDbTable($("#virtualTable"),tableData) || /*checkDbTableColumns() ||*/ checkExchangeMode()||/*checkExchangeIntervalValue() ||*/
    /*checkUpdateIntervalValue() || checkUpdateDateValue() || */checkDbPartition() || checkDbTable($("#virtualMaskedDbTable"),maskedTableData) || checkExchangeItem());
}

$(document).ready()
{
    var metadataMode = $("#metadataMode").val();
    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    var prjName = arr[1];
    var currentDataSrcId = "";

    var exchangeType = "DIRECT";
    var exchangeMode = "TRANSMIT";
    var exchangeInterval = "";
    var provideType = "";
    var dbAccessId = "";
    var dbTable = "";
    var dbColumns = "";
    var dbPartition = "";
    var maskedDbAccessId = "";
    var maskedDbTable = "";
    var maskedDbColumns = "";
    var tableData = [];
    var newTableData = [];
    var maskedTableData = [];
    var newMaskedTableData = [];
    var dbLineNumber = 0;
    var dataUpdateTime = "";
    var updateInterval = "";
    var oldSearchStr = "";
    //latest 请求表名称
    var oldDbTableStr = "";
    var oldSearchMaskedStr = "";
    //latest 请求表名称
    var oldMaskedDbTableStr = "";
    var dbTableTag = 0;
    var maskedDbTableTag = 0;
    var root = "";
    var isLimit = $("#isLimit").val();
    // 交换方法
    // $("[name='exchangeType']").on("change", exchangeTypeChange);
    // function exchangeTypeChange() {
    //     var radio = $('input[name="exchangeType"]').filter(":checked");
    //     if (radio.length) {
    //         exchangeType = radio.val();
    //         if (exchangeType == "SECURE") {
    //             $("#virtualMaskedDataSrc").show();
    //             $("#exchangeMode").hide();
    //             $("#virtualPartitionWrap").hide();
    //             $(".odpsSrcTip").show();
    //             // disableAllSrcColumns();
    //         } else {
    //             $("#virtualMaskedDataSrc").hide();
    //             $("#exchangeMode").show();
    //             if($("#exchange_transmit").prop("checked")){
    //                 if(!$("#exchange_package").prop("checked")){
    //                     $(".odpsSrcTip").hide();
    //                     enableAllSrcColumns();
    //                 }else{
    //                     $(".odpsSrcTip").show();
    //                     // disableAllSrcColumns();
    //                 }
    //                 //判断分区是否存在
    //                 getColumnAndPartition();
    //                 if($("#virtualPartitionTableBody").children().length > 0){
    //                     $("#virtualPartitionWrap").show();
    //                 }
    //             }
    //         }
    //     }
    // };

    $("input[type=text]").focus(function(){
        $(this).removeClass("errorC");
        $(this).siblings("small").hide();
    });

    //交换模式
    // $("[name='exchangeMode']").click(function(){
    //     var size = $('input[name="exchangeMode"]').filter(":checked").size();
    //     if(size == 0){
    //         $(".errorExchangeMode").html("*请选择交换模式");
    //         $(".errorExchangeMode").css("display", "block");
    //     }else{
    //         $(".errorExchangeMode").css("display", "none");
    //     }
    //     if($("#exchange_package").prop("checked")){
    //        // $("#exchangeInterval").show();
    //         disableAllSrcColumns();
    //         $(".odpsSrcTip").show();
    //         if(!$("#exchange_transmit").prop("checked")){
    //             $("#partitionWrap").hide();
    //         }else{
    //             //判断分区是否存在
    //             getColumnAndPartition();
    //             if($("#partitionTableBody").children().length > 0){
    //                 $("#partitionWrap").show();
    //             }
    //         }
    //     }else{
    //       //  $("#exchangeInterval").hide();
    //         //判断分区是否存在
    //         getColumnAndPartition();
    //         if($("#exchange_transmit").prop("checked")){
    //             enableAllSrcColumns();
    //             $(".odpsSrcTip").hide();
    //             if($("#partitionTableBody").children().length > 0){
    //                 $("#partitionWrap").show();
    //             }
    //         }
    //     }
    // });
    function checkExchangeMode(){
        if(exchangeType == "DIRECT"){
            var size = $('input[name="exchangeMode"]').filter(":checked").size();
            if(size == 0){
                $(".errorExchangeMode").html("*请选择交换模式");
                $(".errorExchangeMode").css("display", "block");
                return true;
            }
            return false;
        }
    }
    //共享周期
   /* $("#exchangeIntervalList").change(function(){
        var selected = $("#exchangeIntervalList option:selected").val();
        if(selected == ""){
            $("#exchangeIntervalValue").val("");
            $("#exchangeIntervalValue").attr("readonly", true);
            $("#exchangeIntervalValue").removeClass("errorC");
            $(".errorExchangeIntervalValue").css("display", "none");
        }else{
            $("#exchangeIntervalValue").attr("readonly",false);
        }
    });*/
    /*$("#exchangeIntervalValue").blur(function () {
        checkExchangeIntervalValue();
    });
    function checkExchangeIntervalValue(){
        if ($("#exchange_package").prop("checked") && $("#exchangeIntervalList option:selected").val() != "") {
            if ($("#exchangeIntervalValue").val() == "") {
                $("#exchangeIntervalValue").addClass("errorC");
                $(".errorExchangeIntervalValue").html("*请输入共享周期");
                $(".errorExchangeIntervalValue").css("display", "block");
                return true;
            } else if (!z.test($("#exchangeIntervalValue").val())) {
                $("#exchangeIntervalValue").addClass("errorC");
                $(".errorExchangeIntervalValue").html("*共享周期必须为整数");
                $(".errorExchangeIntervalValue").css("display", "block");
                return true;
            }
        }
        return false;
    }*/

    function checkUpdateIntervalValue() {
        if ($("[name='provideType']").filter(":checked").val() == "PERIOD") {
            if ($("#updateIntervalValue").val() == "") {
                $("#updateIntervalValue").addClass("errorC");
                $(".errorUpdateIntervalValue").html("*请输入更新周期");
                $(".errorUpdateIntervalValue").css("display", "block");
                return true;
            } else if (!IntRegExp($("#updateIntervalValue").val())) {
                $("#updateIntervalValue").addClass("errorC");
                $(".errorUpdateIntervalValue").html("*更新周期必须为整数");
                $(".errorUpdateIntervalValue").css("display", "block");
                return true;
            }
        }
        return false;
    }
    function renderUpdateIntervalValue(update) {
        if ((null != update) && (update != "")) {
            var num = parseInt(update.replace(/[^0-9]/ig, ""));
            var unit = update.substr(update.length - 1, 1);
            if (unit == "钟") {
                unit = "分钟";
            }
        }
        $("#updateIntervalValue").val(num);
        $("#updateIntervalList").val(unit);
    }
    $("#updateIntervalValue").blur(function () {
        checkUpdateIntervalValue();
    });

    // 提供方式
    $("[name='provideType']").on("change", provideTypeChange);
    function provideTypeChange() {
        var radio = $('input[name="provideType"]').filter(":checked");
        if (radio.length) {
            provideType = radio.val();
            if (provideType == "PERIOD") {
                $("#updateInterval").show();
            } else {
                $("#updateInterval").hide();
            }
        }
    };

    function removeDbSrcListError() {
        $("#virtualSrcList").removeClass("errorC");
        $(".errorvirtualDbSrcListValue").hide();
    }
    function checkDbSrcListValue() {
        if ($("#virtualSrcList").val() == "") {
            $("#virtualSrcList").addClass("errorC");
            $(".errorvirtualDbSrcListValue").html("*请选择数据源");
            $(".errorvirtualDbSrcListValue").css("display", "block");
            return true;
        }
        return false;
    }
    $("#virtualSrcList").blur(function () {
        checkDbSrcListValue();
    });

    //选择odps数据源
    // $("#chooseVirtualSrc").click(function () {
    //     currentDataSrcId = $("#virtualSrcList").data("srcid");
    //     oldDbTableStr = "";
    //     openSrcModal("odps");
    // });
    function freshDbSrcList(pageNum, dbAccessId) {
        var dbType = "odps";
        $.get("/" + prjName + "/dbaccess/getdbsrc",
            {
                pageNumber: pageNum,
                action: "ROLE_DEPARTMENT_CATALOGER",
                dbSrcType: dbType
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
                        if (("" != dbAccessId) && (dbAccess.id == dbAccessId)) {
                            $("#virtualSrcList").val(dbName);
                        }
                    }

                    $("#totalPage").html(data.totalPage);
                    $("#currentPage").html(data.curPage);
                } else {
                    dmallError("获取数据源列表失败");
                }
            },
            "json"
        );
    };

    $("#editDbColumns").click(function(){
        getColumnAndPartition();
    });

    //获取表
    function freshDbTableList(dbAccessId,type) {
        $.get("/" + prjName + "/dbaccess/tables",
            {
                dbSrcId: dbAccessId
            },
            function (data, status) {
                tableData = [];
                $("#loadingDbTable").hide();
                if (status == "success") {
                    $("#virtualTableList").empty();
                    if (data.resultList.length > 0) {
                        for (var i = 0; i < data.resultList.length; i++) {
                            var table = data.resultList[i];
                            tableData.push(table);
                        }
                        if(type == "draw"){
                            drawTabelTree("virtual",tableData);
                        }else if(type == "search"){
                            var str = $("#dbTable").val();
                            newTableData = searchTableTree(str, tableData, "normal");
                            drawTabelTree("virtual", newTableData);
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

    function checkUpdateDateValue() {
        if ($("#updateDate").val() == "") {
            $("#updateDate").addClass("errorC");
            $(".errorUpdateDateValue").html("*请填写更新日期");
            $(".errorUpdateDateValue").css("display", "block");
            return true;
        } else {
            $("#updateDate").removeClass("errorC");
            $(".errorUpdateDateValue").hide();
            return false;
        }
    };
    //失去焦点
    $("#updateDate").blur(function () {
        checkUpdateDateValue();
    });

    //点击某一行
    $("#dbTableColumnsTable").delegate("input[name='idsDbTableColumn']:enabled", "click", function () {
        var columnsSize = $("#dbTableColumnsTable input[name='idsDbTableColumn']:enabled:not(:checked)").size();
        if (0 < columnsSize) {
            $("#selectAllColumns").prop("checked", false);
        } else {
            $("#selectAllColumns").prop("checked", true);
        }

        $(".errorDbTableColumnsListValue").hide();
    });

    //获取字段和分区
    function freshDbColumn(dbAccessId, dbTableName, partitionMap,type) {
        $("#dbTableColumnsTableBody").empty();
        $("#partitionTableBody").empty();
        $("#loadingDbColumns").show();

        $.get("/" + prjName + "/dbaccess/table_columns",
            {
                dbSrcId: dbAccessId,
                dbTableName: dbTableName
            },
            function (data, status) {
                $("#loadingDbColumns").hide();

                if (status == "success") {
                    if (!data.tableInfo) {
                        dmallError("没有获取到列");
                    } else {
                        var tableInfo = data.tableInfo;
                        //渲染数据列
                        // if(tableInfo.columns.length > 0) {
                        //     for (var i = 0; i < tableInfo.columns.length; i++) {
                        //         var columns = tableInfo.columns[i];
                        //         if(columns.alias == undefined){
                        //             columns.alias = "";
                        //         }
                        //         if(columns.comment == null){
                        //             columns.comment = "";
                        //         }
                        //         if(type == "new"){
                        //             var trHTML = '<tr><td><input type="checkbox" name="idsDbTableColumn"></td>' +
                        //                 '<td name="dbTableColumnName">' + columns.name + '</td>' +
                        //                 '<td><input name="columnAlias" type="text" class="form-control" maxlength="32" value="'+columns.name+'"></td>' +
                        //                 '<td name="dbTableColumnType">' + columns.type + '</td>' +
                        //                 '<td><input name="columnDesc" type="text" class="form-control" maxlength="255" value="'+columns.comment+'"></td>';
                        //             if(metadataMode == "1" || metadataMode == "0"){
                        //                 trHTML += '<td><a href="javascript:void(0)" onclick="addMeta($(this))" data-metacode="">添加关联</a>' +
                        //                 '<div hidden><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
                        //                 '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td></tr>';
                        //             }else{
                        //                 trHTML += '</tr>';
                        //             }
                        //             $("#dbTableColumnsTableBody").append(trHTML);
                        //         } else if(type == "edit"){
                        //             var alias = "";
                        //             var desc = "";
                        //             var dbColumnString = eval("(" + $("#dbDataJson").val() + ")");
                        //             if($("#dbColumn"+i).val() != undefined){
                        //                 desc = $("#dbColumn"+i).val();
                        //             }
                        //             if($("#dbColumnAlias"+i).val() != undefined){
                        //                 alias = $("#dbColumnAlias"+i).val();
                        //             }
                        //             var trHTML = '<tr><td><input type="checkbox" name="idsDbTableColumn" id="dbTableColumn'+i+'"></td>' +
                        //                 '<td name="dbTableColumnName">' + columns.name + '</td>' +
                        //                 '<td><input name="columnAlias" type="text" class="form-control" id="columnDbAlias'+i+'" maxlength="32" value="'+columns.name+'"></td>' +
                        //                 '<td name="dbTableColumnType">' + columns.type + '</td>' +
                        //                 '<td><input name="columnDesc" type="text" class="form-control" maxlength="255"id="columnDbDesc'+i+'" value=""></td>';
                        //             if(metadataMode == "1" || metadataMode == "0") {
                        //                     trHTML += '<td><a href="javascript:void(0)" onclick="addMeta($(this))" data-metacode="">添加关联</a>' +
                        //                     '<div hidden><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
                        //                     '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td></tr>';
                        //             }else{
                        //                 trHTML += '</tr>';
                        //             }
                        //             $("#dbTableColumnsTableBody").append(trHTML);
                        //             for (var j = 0; j < dbColumnString.length; j++) {
                        //                 if(dbColumnString[j].alias == undefined){
                        //                     dbColumnString[j].alias = "";
                        //                 }
                        //                 var dbname = dbColumnString[j].name;
                        //                 if (dbname == columns.name) {
                        //                     $("#dbTableColumn" + i).prop("checked", true);
                        //                     var limit = $("#isLimit").val();
                        //                     if(limit == "true"){
                        //                         $("#dbTableColumn" + i).prop("disabled", "disabled");
                        //                     }
                        //                     if(dbColumnString[j].desc == ""){
                        //                         $("#columnDbDesc" + i).val(columns.comment);
                        //                     }else{
                        //                         $("#columnDbDesc" + i).val(dbColumnString[j].desc);
                        //                     }
                        //                     $("#columnDbAlias" + i).val(dbColumnString[j].alias);
                        //                     if(dbColumnString[j].metaCode != undefined && dbColumnString[j].metaCode != ""){
                        //                         $("#dbTableColumn" + i).parent().next().next().next().next().next().children("a").data("metacode",dbColumnString[j].metaCode);
                        //                         $("#dbTableColumn" + i).parent().next().next().next().next().next().children("a").data("catecode",dbColumnString[j].cateCode);
                        //                         $("#dbTableColumn" + i).parent().next().next().next().next().next().children("a").text(dbColumnString[j].metaName);
                        //                         $("#dbTableColumn" + i).parent().next().next().next().next().next().children("a").siblings("div").show();
                        //                     }
                        //                 }
                        //             }
                        //         } else{
                        //             var trHTML = '<tr><td><input type="checkbox" name="idsDbTableColumn" value=""></td>' +
                        //                 '<td name="dbTableColumnName">' + columns.name + '</td>' +
                        //                 '<td><input name="columnAlias" type="text" class="form-control" value="'+columns.alias+'" maxlength="32"></td>' +
                        //                 '<td name="dbTableColumnType">' + columns.type + '</td>' +
                        //                 '<td><input name="columnDesc" type="text" class="form-control" maxlength="255" value="'+columns.desc+'"></td></tr>';
                        //             $("#dbTableColumnsTableBody").append(trHTML);
                        //         }
                        //     }
                        //     $("#dbTableColumnsTableBody").show();
                        //     $("#idColumnsDiv").show();
                        // }
                        //渲染分区（共享的数据源不显示分区）
                        var catalogMode = $("#catalogMode").val();
                        if(tableInfo.partitions.length > 0 && catalogMode != 1) {
                            for (var i = 0; i < tableInfo.partitions.length; i++) {
                                var trHTML = "";
                                var columns = tableInfo.partitions[i];
                                //     var hit = false;
                                var checked = false;

                                var value = "";
                                if(type == "new"){
                                    trHTML = '<tr><td><input type="checkbox" name="partitionColumn"></td><td>' + columns + '</td>' +
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
                                $("#partitionTableBody").append(trHTML);
                            }
                            $("#partitionTableBody").show();
                            if($("#exchange_transmit").prop("checked") && $("[name='exchangeType']").filter(":checked").val() == "DIRECT"){
                                $("#partitionWrap").show();
                            }
                        }
                        if($("#exchange_transmit").prop("checked") && $("[name='exchangeType']").filter(":checked").val() == "DIRECT" && !$("#exchange_package").prop("checked")){
                            if(type == "new"){
                                var $enabledIds = $("#dbTableColumnsTable input[name='idsDbTableColumn']:enabled");
                                $enabledIds.prop("checked", true);
                                $("#selectAllColumns").prop("checked", true);
                            }else{
                                var columnsSize = $("#dbTableColumnsTable input[name='idsDbTableColumn']:enabled:not(:checked)").size();
                                if (0 < columnsSize) {
                                    $("#selectAllColumns").prop("checked", false);
                                } else {
                                    $("#selectAllColumns").prop("checked", true);
                                }
                            }
                            $(".odpsSrcTip").hide();
                            //enableAllSrcColumns();
                        }else{
                            disableAllSrcColumns();
                            $(".odpsSrcTip").show();
                        }
                        $("#selectCheckbox").show();
                    }
                } else {
                    dmallError("获取列失败");
                }
            },
            "json"
        );
    }
    function directFreshDbColumn(partitionMap,columns){
        $("#storageColumns").empty();
        $("#storagePartition").empty();
        for(var i = 0; i < columns.length; i++){
            if(columns[i].alias == undefined){
                columns[i].alias = "";
            }
            if(columns[i].metaCode != ""){
                var trHTML = '<tr><td><input type="checkbox" name="idsDbTableColumn" checked hidden></td>' +
                    '<td name="dbTableColumnName">' + columns[i].name + '</td>' +
                    '<td><input name="columnAlias" type="text" class="form-control" id="dbColumnAlias'+i+'" maxlength="32" value="'+columns[i].alias+'"></td>' +
                    '<td name="dbTableColumnType">' + columns[i].type + '</td>' +
                    '<td><input name="columnDesc" type="text" class="form-control" id="dbColumn'+i+'" maxlength="255" value="'+columns[i].desc+'"></td>';
                if(metadataMode == "1" || metadataMode == "0") {
                    trHTML += '<td><a href="javascript:void(0)" onclick="viewMeta(this)" data-metacode="' + columns[i].metaCode + '" data-catecode="' + columns[i].cateCode + '">' + columns[i].metaName + '</a>' +
                    '<div><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
                    '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td></tr>';
                }else{
                    trHTML += '</tr>';
                }
            }else{
                var trHTML = '<tr><td><input type="checkbox" name="idsDbTableColumn" checked hidden></td>' +
                    '<td name="dbTableColumnName">' + columns[i].name + '</td>' +
                    '<td><input name="columnAlias" type="text" class="form-control" id="dbColumnAlias'+i+'" maxlength="32" value="'+columns[i].alias+'"></td>' +
                    '<td name="dbTableColumnType">' + columns[i].type + '</td>' +
                    '<td><input name="columnDesc" type="text" class="form-control" id="dbColumn'+i+'" maxlength="255" value="'+columns[i].desc+'"></td>';
                if(metadataMode == "1" || metadataMode == "0") {
                    trHTML += '<td><a href="javascript:void(0)" onclick="addMeta($(this))" data-metacode="">添加关联</a>' +
                    '<div hidden><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
                    '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td></tr>';
                }else {
                    trHTML += '</tr>';
                }
            }
            $("#storageColumns").append(trHTML);
        }
        if (partitionMap != null && partitionMap != "") {
            for (var key in partitionMap) {
                trHTML = '<tr><td><input type="checkbox" name="partitionColumn" checked hidden></td><td>' + key + '</td>' +
                '<td><input type="text" class="form-control"  value="' + partitionMap[key] + '"/><small class="text-danger"></small></td></tr>';
                $("#storagePartition").append(trHTML);
            }
            $("#partitionWrap").show();
        }
        $("#storageColumns").show();
        $("#storagePartition").show();
        $("#idColumnsDiv").show();
        $("#selectCheckbox").hide();
    }

    function checkDbTableColumns() {
        //$(".errorDbTableColumnsListValue").hide();
        //dbColumns = getDbColumnData();
        var size = $("#dbTableColumnsTable input[name='idsDbTableColumn']:checked").size();
        if (size == 0) {
            $(".errorDbTableColumnsListValue").html("*请选择列");
            $(".errorDbTableColumnsListValue").css("display", "block");
            return true;
        } else {
            $(".errorDbTableColumnsListValue").hide();
            return false;
        }
    }

    function getDbColumnData() {
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

        // var data = [];
        // var i = 0;
        // var columns;
        // if ($("#storageColumns").is(":hidden")){
        //     $("#dbTableColumnsTableBody").find(":checkbox:checked").each(function () {
        //         var val = {};
        //         val.name = $(this).parent().next().text();
        //         $(this).parent().parent().find("[name='columnAlias']").each(function (tdindex, tditem) {
        //             val.alias = $(tditem).val();
        //         });
        //         val.type = $(this).parent().next().next().next().text();
        //         $(this).parent().parent().find("[name='columnDesc']").each(function (tdindex, tditem) {
        //             val.desc = $(tditem).val();
        //         });
        //         if(metadataMode == "0" || metadataMode =="1") {
        //             val.metaCode = $(this).parent().next().next().next().next().next().children("a").data("metacode");
        //             val.cateCode = $(this).parent().next().next().next().next().next().children("a").data("catecode");
        //         }
        //         data[i++] = val;
        //     });
        // } else{
        //     $("#storageColumns").find(":checkbox:checked").each(function () {
        //         var val = {};
        //         val.name = $(this).parent().next().text();
        //         $(this).parent().parent().find("[name='columnAlias']").each(function (tdindex, tditem) {
        //             val.alias = $(tditem).val();
        //         });
        //         val.type = $(this).parent().next().next().next().text();
        //         $(this).parent().parent().find("[name='columnDesc']").each(function (tdindex, tditem) {
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
        return columns;
    }

    function checkDbPartition() {
        //dbPartition = getDbPartitionData();
        var ptFlag = false;
        $("#virtualPartitionWrap").find(":checkbox:checked").each(function () {
            var ptValue = "";
            var ptName = $(this).parent().next().text();
            //      var ptValue = $("#partition"+j).val();
            $(this).parent().parent().find("[type='text']").each(function (tdindex, tditem) {
                ptValue = $(tditem).val();
                if (ptValue == "" && !$("#virtualPartitionWrap").is(":hidden")) {
                    $(this).parent().parent().find("[type='text']").addClass("errorC");
                    $(this).parent().parent().find("[type='text']").siblings("small").show().html("*请输入分区值");
                    ptFlag = true;
                } else {
                    $(this).parent().parent().find("[type='text']").removeClass("errorC");
                    $(this).parent().parent().find("[type='text']").siblings("small").hide();
                }
            });
        });
        return ptFlag;
    }
    //获取分区信息
    function getDbPartitionData() {
        var j = 0;
        var val2 = {};
        var partitions = '';
        if($('[name="exchangeType"]:checked').val() == 'DIRECT' && $('#exchange_transmit').prop('checked')){
            $("#virtualPartitionTableBody").find(":checkbox:checked").each(function () {
                var ptValue = "";
                var ptName = $(this).parent().next().text();
                //      var ptValue = $("#partition"+j).val();
                $(this).parent().parent().find("[type='text']").each(function (tdindex, tditem) {
                    ptValue = $(tditem).val();
                });
                val2[ptName] = ptValue;
                j++;
            });
            if (j > 0) {
                partitions = JSON.stringify(val2);
            }
        }

        return partitions;

        // var j = 0;
        // var val2 = {};
        // var partitions;
        // if ($("#storagePartition").is(":hidden")){
        //     $("#virtualPartitionTableBody").find(":checkbox:checked").each(function () {
        //         var ptValue = "";
        //         var ptName = $(this).parent().next().text();
        //         //      var ptValue = $("#partition"+j).val();
        //         $(this).parent().parent().find("[type='text']").each(function (tdindex, tditem) {
        //             ptValue = $(tditem).val();
        //         });
        //         val2[ptName] = ptValue;
        //         j++;
        //     });
        // } else{
        //     $("#storagePartition").find(":checkbox:checked").each(function () {
        //         var ptValue = "";
        //         var ptName = $(this).parent().next().text();
        //         //      var ptValue = $("#partition"+j).val();
        //         $(this).parent().parent().find("[type='text']").each(function (tdindex, tditem) {
        //             ptValue = $(tditem).val();
        //         });
        //         val2[ptName] = ptValue;
        //         j++;
        //     });
        // }
        //
        // if (j > 0) {
        //     partitions = JSON.stringify(val2);
        // }
        // return partitions;
    }

    $("#selectAllColumns").click(function () {
        var $this = $(this);
        var $enabledIds = $("#dbTableColumnsTable input[name='idsDbTableColumn']:enabled");
        //var $contentRow = $("#dbTableColumnsTable tr:gt(0)");

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

        $(".errorDbTableColumnsListValue").hide();
    });

    function getMaskedDbSrcById(maskedDbAccessId) {
        $.get("/" + prjName + "/dbaccess/dbaccess_detail",
            {
                dbaccessID:maskedDbAccessId,
                usage: "catalog"
            },
            function (data, status) {
                if (status == "success" && data.result == "success") {
                    var dbName = data.dbaccess.name;
                    $("#virtualMaskedDbSrcList").val(dbName);
                } else {
                    dmallError("获取数据源失败");
                }
            },
            "json"
        );
    }

    $("#chooseMarkedDbSrc").click(function(){
        $("#addDbSrcModalTitle").text("添加脱敏数据源");
        oldMaskedDbTableStr = "";
        openSrcModal("mark");
    });

    $("#clearMarkedDbSrc").click(function(){
        clearMaskedDbSrcList();
    });

    function clearMaskedDbSrcList(){
        $("#virtualMaskedDbSrcList").attr("value", "");
        $("#virtualMaskedDbSrcList").data("srcid", "");
        $("#virtualMaskedDbTable").val("");
        $("#maskedStorageColumns").empty();
        $("#maskedDbTableColumnsTableBody").empty();
        $("#idVirtualMaskedColumnsDiv").hide();
    }

    $("#editMaskedDbColumns").click(function(){
        if(!$("#maskedStorageColumns").is(":hidden")){
            var dbTable = $("#virtualMaskedDbTable").val();
            $("#maskedSelectCheckbox").show();
            maskedDbAccessId = $("#virtualMaskedDbSrcList").data("srcid");
            freshMaskedDbColumn(maskedDbAccessId, dbTable,"edit");
            $("#maskedStorageColumns").hide();
            //$("#loadingMaskedDbColumns").show();
        }
    });

    function freshMaskedDbTableList(dbAccessId, type) {
        $.get("/" + prjName + "/dbaccess/tables",
            {
                dbSrcId: dbAccessId
            },
            function (data, status) {
                maskedTableData = [];
                $("#loadingVirtualMaskedDbTable").hide();
                if (status == "success") {
                    $("#virtualMaskedDbTableList").empty();
                    if (data.resultList.length > 0) {
                        for (var i = 0; i < data.resultList.length; i++) {
                            var table = data.resultList[i];
                            maskedTableData.push(table);
                        }
                        if(type == "draw"){
                            drawTabelTree("virtualMaskedDb",maskedTableData);
                        }else if(type == "search"){
                            var str = $("#virtualMaskedDbTable").val();
                            newMaskedTableData = searchTableTree(str,maskedTableData,"normal");
                            drawTabelTree("virtualMaskedDb",newMaskedTableData);
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

    //获取字段和分区
    function freshMaskedDbColumn(dbAccessId, dbTableName,type) {
        $("#maskedDbTableColumnsTableBody").empty();
        $("#idVirtualMaskedColumnsDiv").hide();
        $("#maskedStorageColumns").hide();
        //   $("#editDbColumns").hide();

        $("#loadingMaskedDbColumns").show();

        $.get("/" + prjName + "/dbaccess/table_columns",
            {
                dbSrcId: dbAccessId,
                dbTableName: dbTableName
            },
            function (data, status) {
                $("#loadingMaskedDbColumns").hide();

                if (status == "success") {
                    if (!data.tableInfo) {
                        dmallError("没有获取到列");
                    } else {
                        var tableInfo = data.tableInfo;
                        if(tableInfo.columns.length > 0) {
                            for (var i = 0; i < tableInfo.columns.length; i++) {
                                var columns = tableInfo.columns[i];
                                if(columns.comment == null){
                                    columns.comment = "";
                                }
                                if(type == "new"){
                                    var trHTML = '<tr><td><input type="checkbox" name="idsMaskedDbTableColumn" value=""></td>' +
                                        '<td name="maskedDbTableColumnName">' + columns.name + '</td>' +
                                        '<td><input name="maskedDbTableColumnAlias" type="text" class="form-control" maxlength="32" value="'+columns.name+'"></td>' +
                                        '<td name="maskedDbTableColumnType">' + columns.type + '</td>' +
                                        '<td><input name="maskedDbTableColumnDesc" type="text" class="form-control" maxlength="255" value="'+columns.comment+'"></td>';
                                    if(metadataMode == "1" || metadataMode == "0") {
                                        trHTML += '<td><a href="javascript:void(0)" onclick="addMeta($(this))" data-metacode="">添加关联</a>' +
                                        '<div hidden><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
                                        '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td></tr>';
                                    }else {
                                        trHTML += '</tr>';
                                    }
                                } else if(type == "edit"){
                                    var alias = "";
                                    var desc = "";
                                    var dbColumnString = eval("(" + $("#maskedDbDataJson").val() + ")");
                                    if($("#maskedDbColumnAlias"+i).val() != undefined){
                                        alias = $("#maskedDbColumnAlias"+i).val();
                                    }
                                    if($("#maskedDbColumn"+i).val() != undefined){
                                        desc = $("#maskedDbColumn"+i).val();
                                    }else if($("#maskedDbColumn"+i).val() == ""){
                                        desc = columns.comment;
                                    }
                                    if(dbColumnString[i].metaCode != ""){
                                        var trHTML = '<tr><td><input type="checkbox" name="idsMaskedDbTableColumn" value=""></td>' +
                                            '<td name="maskedDbTableColumnName">' + columns.name + '</td>' +
                                            '<td><input name="maskedDbTableColumnAlias" type="text" class="form-control" maxlength="32" value="'+alias+'"></td>' +
                                            '<td name="maskedDbTableColumnType">' + columns.type + '</td>' +
                                            '<td><input name="maskedDbTableColumnDesc" type="text" class="form-control" maxlength="255" value="'+desc+'"></td>';
                                        if(metadataMode == "1" || metadataMode == "0") {
                                            trHTML += '<td><a href="javascript:void(0)" onclick="viewMeta(this)" data-metacode="' + dbColumnString[i].metaCode + '" data-catecode="' + dbColumnString[i].cateCode + '">' + dbColumnString[i].metaName + '</a>' +
                                            '<div><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
                                            '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td></tr>';
                                        }else {
                                            trHTML += '</tr>';
                                        }
                                    }else{
                                        var trHTML = '<tr><td><input type="checkbox" name="idsMaskedDbTableColumn" value=""></td>' +
                                            '<td name="maskedDbTableColumnName">' + columns.name + '</td>' +
                                            '<td><input name="maskedDbTableColumnAlias" type="text" class="form-control" maxlength="32" value="'+alias+'"></td>' +
                                            '<td name="maskedDbTableColumnType">' + columns.type + '</td>' +
                                            '<td><input name="maskedDbTableColumnDesc" type="text" class="form-control" maxlength="255" value="'+desc+'"></td>';
                                        if(metadataMode == "1" || metadataMode == "0") {
                                            trHTML += '<td><a href="javascript:void(0)" onclick="addMeta($(this))" data-metacode="">添加关联</a>' +
                                            '<div hidden><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
                                            '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td></tr>';
                                        }else {
                                            trHTML += '</tr>';
                                        }
                                    }
                                }
                                $("#maskedDbColumnTable tbody").append(trHTML);
                            }
                            $("#maskedDbTableColumnsTableBody").show();
                            $("#idVirtualMaskedColumnsDiv").show();
                        }

                        var $enabledIds = $("#maskedDbColumnTable input[name='idsMaskedDbTableColumn']:enabled");
                        $enabledIds.prop("checked", true);
                        $("#maskedSelectAllColumns").prop("checked", true);
                        $enabledIds.attr("disabled", "disabled");
                        $("#maskedSelectAllColumns").attr("disabled", "disabled");
                        $("#maskedSelectCheckbox").show();
                        $(".maskedOdpsSrcTip").show();

                    }
                } else {
                    dmallError("获取列失败");
                }
            },
            "json"
        );
    }

    function directFreshMaskedDbColumn(columns){
        $('#virtualMaskedDbTableColumnsTableBody').empty();
        for (var i = 0; i < columns.length; i++) {
            var html = '<tr><td><input type="checkbox" checked disabled></td>' +
                '<td>' + columns[i].name + '</td>' +
                '<td>' + columns[i].type + '</td>' +
                '<td><input name="maskedDbTableColumnDesc" type="text" class="form-control" maxlength="255" value="'+ columns[i].desc +'"></td>';
            // if(metadataMode == "1" || metadataMode == "0") {
            //     html += '<td><a href="javascript:void(0)" onclick="addMeta($(this))" data-metacode="">添加关联</a>' +
            //     '<div hidden><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
            //     '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td></tr>';
            // }else {
            //     html += '</tr>';
            // }
            html += '</tr>';
            $('#virtualMaskedDbTableColumnsTableBody').append(html);
        }
        $("#virtualMaskedDbTableColumnsTableBody").show();
        $("#virtualMaskedOdpsSrcTip").show();
        $("#idVirtualMaskedColumnsDiv").show();

        // $("#maskedStorageColumns").empty();
        // for(var i = 0; i < columns.length; i++){
        //     if (columns[i].alias == undefined){
        //         columns[i].alias = "";
        //     }
        //     if(columns[i].metaCode != ""){
        //         var trHTML = '<tr><td><input type="checkbox" name="idsMaskedDbTableColumn" checked hidden></td>' +
        //             '<td name="maskedDbTableColumnName">' + columns[i].name + '</td>' +
        //             '<td><input name="maskedDbTableColumnAlias" type="text" class="form-control" maxlength="32" value="'+columns[i].alias+'"></td>';
        //             '<td name="maskedDbTableColumnType">' + columns[i].type + '</td>' +
        //             '<td><input name="maskedDbTableColumnDesc" type="text" class="form-control" maxlength="255" value="'+columns[i].desc+'"></td>';
        //         if(metadataMode == "1" || metadataMode == "0") {
        //             trHTML += '<td><a href="javascript:void(0)" onclick="viewMeta(this)" data-metacode="' + columns[i].metaCode + '" data-catecode="' + columns[i].cateCode + '">' + columns[i].metaName + '</a>' +
        //             '<div><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
        //             '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td></tr>';
        //         }else {
        //             trHTML += '</tr>';
        //         }
        //     }else{
        //         var trHTML = '<tr><td><input type="checkbox" name="idsMaskedDbTableColumn" checked hidden></td>' +
        //             '<td name="maskedDbTableColumnName">' + columns[i].name + '</td>' +
        //             '<td><input name="maskedDbTableColumnAlias" type="text" class="form-control" maxlength="32" value="'+columns[i].alias+'"></td>' +
        //             '<td name="maskedDbTableColumnType">' + columns[i].type + '</td>' +
        //             '<td><input name="maskedDbTableColumnDesc" type="text" class="form-control" maxlength="255" value="'+columns[i].desc+'"></td>';
        //         if(metadataMode == "1" || metadataMode == "0") {
        //             trHTML += '<td><a href="javascript:void(0)" onclick="addMeta($(this))" data-metacode="">添加关联</a>' +
        //             '<div hidden><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
        //             '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td></tr>';
        //         }else {
        //             trHTML += '</tr>';
        //         }
        //     }
        //     $("#maskedStorageColumns").append(trHTML);
        // }
        // $("#maskedStorageColumns").show();
        // $("#idVirtualMaskedColumnsDiv").show();
        // $("#maskedSelectCheckbox").hide();
    }

    function getMaskedDbColumn() {
        var data = [];
        var i = 0;
        var columns = "";
        if(!$('#virtualMaskedDataSrc').is(':hidden')){
            $("#virtualMaskedDbTableColumnsTableBody").find(":checkbox:checked").each(function () {
                var val = {};
                val.name = $(this).parent().next().text();
                val.type = $(this).parent().next().next().text();
                $(this).parent().parent().find("[name='maskedDbTableColumnDesc']").each(function (tdindex, tditem) {
                    val.desc = $(tditem).val();
                });
                val.metaCode = $(this).parent().next().next().next().next().children("a").data("metacode");
                val.cateCode = $(this).parent().next().next().next().next().children("a").data("catecode");
                data[i++] = val;
            });
            if (i > 0) {
                columns = JSON.stringify(data);
            }
        }
        return columns;

        // if ($("#maskedStorageColumns").is(":hidden")){
        //     $("#virtualMaskedDbTableColumnsTableBody").find(":checkbox:checked").each(function () {
        //         var val = {};
        //         val.name = $(this).parent().next().text();
        //         $(this).parent().parent().find("[name='maskedDbTableColumnAlias']").each(function (tdindex, tditem) {
        //             val.alias = $(tditem).val();
        //         });
        //         val.type = $(this).parent().next().next().next().text();
        //         $(this).parent().parent().find("[name='maskedDbTableColumnDesc']").each(function (tdindex, tditem) {
        //             val.desc = $(tditem).val();
        //         });
        //         val.metaCode = $(this).parent().next().next().next().next().next().children("a").data("metacode");
        //         val.cateCode = $(this).parent().next().next().next().next().next().children("a").data("catecode");
        //         val.metaName = $(this).parent().next().next().next().next().next().children("a").text();
        //         if(val.metaCode == ""){
        //             val.metaName = "";
        //         }
        //         data[i++] = val;
        //     });
        // } else{
        //     $("#maskedStorageColumns").find(":checkbox:checked").each(function () {
        //         var val = {};
        //         val.name = $(this).parent().next().text();
        //         $(this).parent().parent().find("[name='maskedDbTableColumnAlias']").each(function (tdindex, tditem) {
        //             val.alias = $(tditem).val();
        //         });
        //         val.type = $(this).parent().next().next().next().text();
        //         $(this).parent().parent().find("[name='maskedDbTableColumnDesc']").each(function (tdindex, tditem) {
        //             val.desc = $(tditem).val();
        //         });
        //         val.metaCode = $(this).parent().next().next().next().next().next().children("a").data("metacode");
        //         val.cateCode = $(this).parent().next().next().next().next().next().children("a").data("catecode");
        //         val.metaName = $(this).parent().next().next().next().next().next().children("a").text();
        //         if(val.metaCode == ""){
        //             val.metaName = "";
        //         }
        //         data[i++] = val;
        //     });
        // }
        // if (i > 0) {
        //     columns = JSON.stringify(data);
        // }
        // return columns;
    }

    function getOdpsData() {
        dbTable = $("#virtualTable").val();
        dbLineNumber = $("#dataSize").val();
        exchangeType = $('input[name="exchangeType"]').filter(":checked").val();
        if(exchangeType == "DIRECT"){
            if($("#exchange_package").prop("checked") && $("#exchange_transmit").prop("checked")){
                exchangeMode = "ALL";
            }else if($("#exchange_package").prop("checked")){
                exchangeMode = "PACKAGE";
            }else{
                exchangeMode = "TRANSMIT";
            }
        }else{
            exchangeMode = "";
        }
       /* if(exchangeMode != "TRANSMIT"){
            var val = {};
            if($("#exchangeIntervalList option:selected").val() != ""){

                var key = $("#exchangeIntervalList option:selected").val();
                var value = $("#exchangeIntervalValue").val();
                val[key] = value;
            }
            exchangeInterval = JSON.stringify(val);
        }*/

        // provideType = $('input[name="provideType"]').filter(":checked").val();
        // dataUpdateTime = $("#updateDate").val();
        // if ($("#updateIntervalValue").val() != "") {
        //     updateInterval = $("#updateIntervalValue").val() + $("#updateIntervalList option:selected").val();
        // }
        var resourceParamType = $("#resourceParamType").val();

        dbColumns = getDbColumnData();
        dbPartition = getDbPartitionData();

        maskedDbAccessId = $("#virtualMaskedDbSrcList").data("srcid");
        maskedDbTable = $("#virtualMaskedDbTable").val();
        maskedDbColumns = getMaskedDbColumn();
        var odpsParams = {
            resourceParamType: resourceParamType,
            exchangeType: exchangeType,
            dbAccessId: dbAccessId,
            dbTable: dbTable,
            // dbColumn: dbColumns,
            itemJson:dbColumns,
            // provideType: provideType,
            // updateInterval: updateInterval,
            // dataUpdateTime: dataUpdateTime,
            // dbLineNumber: dbLineNumber,
            dbPartition: dbPartition,
            maskedDbAccessId: maskedDbAccessId,
            maskedDbTable: maskedDbTable,
            maskedDbColumn: maskedDbColumns,
            exchangeMode:exchangeMode
            // exchangeInterval:""
        };

        return odpsParams;
    };


    function renderOdps(extraParams) {

        var itemList = eval("(" + extraParams.itemJson + ")");
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
        }
        $('#virtualFinalTable').show();
        $('#inlineRadio1').attr('checked', true);
        $('#relateWrap').show();
        var resourceTypeCode = $("#resourceTypeCode").val();
        $('#relateSrcList').val(resourceTypeCode.toLowerCase());
        $('#relationList').show();
        getVirtualResData(resourceTypeCode);
        //交换方式
        var exchangeType = extraParams.exchangeType;
        if(exchangeType == 'DIRECT'){
            $('[name="exchangeType"]').eq(0).attr('checked', true);
            $('[name="exchangeType"]').eq(1).attr('checked', false);
            $('#exchangeMode').show();
            $('#virtualMaskedDataSrc').hide();
        }else {
            $('[name="exchangeType"]').eq(0).attr('checked', false);
            $('[name="exchangeType"]').eq(1).attr('checked', true);
            $('#exchangeMode').hide();
            $('#virtualMaskedDataSrc').show();
        }
        //交换模式
        exchangeMode = extraParams.exchangeMode;
        if(exchangeMode == "ALL"){
            $("#exchange_transmit").attr("checked",true);
            $("#exchange_package").attr("checked",true);
        } else if(exchangeMode == "PACKAGE"){
            $("#exchange_package").attr("checked",true);
            $("#exchange_transmit").attr("checked",false);
        }else if(exchangeMode == "TRANSMIT"){
            $("#exchange_package").attr("checked",false);
            $("#exchange_transmit").attr("checked",true);
        }else {
            $('#exchangeMode').hide();
        }
        //获取分区
        var dbPartition = '';
        if(extraParams.dbPartition != "" && extraParams.dbPartition != null){
            dbPartition = eval("(" + extraParams.dbPartition + ")");
            $('#virtualPartitionWrap').show();
            $.each(dbPartition, function (key, val) {
                var trHTML = '<tr><td><input type="checkbox" checked></td>' +
                    '<td>' + key + '</td>' +
                    '<td><input id="partition_' + key + '" name="partitionColumnNames" onblur="checkPartition()" type="text" class="form-control"  value="'+ val +'"/>' +
                    '<small class="text-danger"></small></td></tr>';
                $("#virtualPartitionTableBody").append(trHTML);
            });
        }



        // var dbColumnString = eval("(" + extraParams.dbColumn + ")");
        // $("#dbDataJson").val(extraParams.dbColumn);
        // var partitionMap = "";
        // if (extraParams.dbPartition != "")
        //     partitionMap = eval("(" + extraParams.dbPartition + ")");
        $("#resourceParamType").val(extraParams.resourceParamType);
        // $("#dataSize").val(extraParams.dbLineNumber);
        // $("#updateDate").val(extraParams.dataUpdateTime);
        dbAccessId = extraParams.dbAccessId;
        $("#virtualSrcList").data("srcid", dbAccessId);
        dbTable = extraParams.dbTable;
        oldSearchStr = extraParams.dbTable;
        oldDbTableStr = oldSearchStr;
        // var provideType = extraParams.provideType;
        // var update = extraParams.updateInterval;
        // renderUpdateIntervalValue(update);
        // exchangeMode = extraParams.exchangeMode;
        // if(exchangeMode == "ALL"){
        //     $("#exchange_transmit").attr("checked",true);
        //     $("#exchange_package").attr("checked",true);
        //   //  $("#exchangeInterval").show();
        // } else if(exchangeMode == "PACKAGE"){
        //     $("#exchange_package").attr("checked",true);
        //     $("#exchange_transmit").attr("checked",false);
        //   //  $("#exchangeInterval").show();
        // }else{
        //     $("#exchange_package").attr("checked",false);
        //     $("#exchange_transmit").attr("checked",true);
        //   //  $("#exchangeInterval").hide();
        // }
       /* if(exchangeMode != "TRANSMIT"){
            if(extraParams.exchangeInterval == "{}"){
                $("#exchangeIntervalValue").attr("readonly",true);
                $("#exchangeIntervalList").val("");
            }else{
                var exchangeIntervalMap = eval("(" + extraParams.exchangeInterval + ")");
                for (var key in exchangeIntervalMap){
                    $("#exchangeIntervalValue").val(exchangeIntervalMap[key]);
                    $("#exchangeIntervalList").val(key);
                }
            }
        }*/
        // var exchangeType = extraParams.exchangeType;
        // if (exchangeType == "DIRECT") {
        //     $("input[name='exchangeType']:eq(0)").attr("checked", "checked");
        //     $("#maskedDataSrc").hide();
        //     $("#exchangeMode").show();
        // } else {
        //     $("input[name='exchangeType']:eq(1)").attr("checked", "checked");
        //     $("#maskedDataSrc").show();
        //     $("#exchangeMode").hide();
        // }

        // if (provideType == "ONCE") {
        //     $("input[name='provideType']:eq(0)").attr("checked", "checked");
        //     $("#updateInterval").hide();
        // } else {
        //     $("input[name='provideType']:eq(1)").attr("checked", "checked");
        //     $("#updateInterval").show();
        // }

        getDbSrcById(dbAccessId, $("#virtualSrcList"));

        //获取表名
        freshDbTableList(dbAccessId,"get");
        $("#virtualTable").val(dbTable);

        //获取列与分区
        $("#dbTableColumnsTableBody").hide();
        $("#partitionTableBody").hide();
        $(".odpsSrcTip").hide();
        // directFreshDbColumn(partitionMap, dbColumnString);


        //获取脱敏数据库
        maskedDbAccessId = extraParams.maskedDbAccessId;
        $("#virtualMaskedDbSrcList").data("srcid", maskedDbAccessId);

        $("#virtualMaskedDbTableColumnsTableBody").hide();
        $(".virtualMaskedOdpsSrcTip").hide();
        if (maskedDbAccessId != null && exchangeType != "DIRECT") {
            getDbSrcById(maskedDbAccessId, $("#virtualMaskedDbSrcList"));
            maskedDbTable = extraParams.maskedDbTable;
            oldSearchMaskedStr = extraParams.maskedDbTable;
            oldMaskedDbTableStr = oldSearchMaskedStr;
            $("#virtualMaskedDbTable").val(maskedDbTable);
            freshMaskedDbTableList(maskedDbAccessId, "get");

            //获取脱敏表列与分区
            var maskedDbColumnString = eval("(" + extraParams.maskedDbColumn + ")");
            $("#maskedDbDataJson").val(extraParams.maskedDbColumn);
            directFreshMaskedDbColumn( maskedDbColumnString);
        } else {
            clearMaskedDbSrcList();
        }
    };

    function initOdps() {
        $('#inlineRadio1').attr('checked', true);
        $('#virtualFinalTable').show();
        $('#relateWrap').show();
        var resourceTypeCode = $("#resourceTypeCode").val();
        $('#relateSrcList').val(resourceTypeCode.toLowerCase());
        $('#relationList').show();
        getVirtualResData(resourceTypeCode);
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

        // var update = $("#odpsUpdate").val();
        // renderUpdateIntervalValue(update);
        // $("#idColumnsDiv").show();
        dbAccessId = $("#dbAccessId").val();
        getDbSrcById(dbAccessId,$("#virtualSrcList"));
        freshDbTableList(dbAccessId, "get");
        oldSearchStr = $("#virtualTable").val();
        oldDbTableStr = oldSearchStr;
        $("#virtualSrcList").data("srcid", dbAccessId);

        var exchangeType = $('[name = "exchangeType"]').filter(':checked').val();
        maskedDbAccessId = $("#virtualMaskedDbAccessId").val();
        if (exchangeType == "SECURE") {
            $("#virtualMaskedDataSrc").show();
            if(maskedDbAccessId != ''){
                getMaskedDbSrcById(maskedDbAccessId);
                $("#virtualMaskedDbSrcList").data('srcid', maskedDbAccessId);
                freshMaskedDbTableList(maskedDbAccessId, "get");
                oldSearchMaskedStr = $("#virtualMaskedDbTable").val();
                oldMaskedDbTableStr = oldSearchMaskedStr;
            }
        }

    };

    function emptyOdps() {
        $("#dataSize").val("");
        $("input[name='provideType']:eq(0)").attr("checked", 'checked');
        $("#exchange_transmit").attr("checked",true);
        $("#exchange_package").attr("checked",true);
        $("#exchangeMode").show();
        $("#updateInterval").hide();
        $("#rdsTableColumnsTable").hide();
        $("#dbTableColumnsTable").show();
    }

    // $("#virtualTable").click(function(){
    //     if(isLimit == "false") {
    //         var src = $("#virtualSrcList").val();
    //         if (src == "") {
    //             $("#virtualSrcList").addClass("errorC");
    //             $(".errorVirtualDbSrcListValue").html("*请选择数据源");
    //             $(".errorVirtualDbSrcListValue").css("display", "block");
    //         } else {
    //             var str = $("#virtualTable").val();
    //             dbTableTag = 0;
    //             if (str == "") {
    //                 $("#loadingDbTable").show();
    //                 freshDbTableList(dbAccessId, "draw");
    //             } else {
    //                 freshDbTableList(dbAccessId, "search");
    //             }
    //         }
    //     }
    // });
    // $("#virtualMaskedDbTable").click(function(){
    //     if(isLimit == "false"){
    //         var src = $("#virtualMaskedDbSrcList").val();
    //         if(src != ""){
    //             var str = $("#virtualMaskedDbTable").val();
    //             maskedDbTableTag = 0;
    //             if(str == ""){
    //                 $("#loadingVirtualMaskedDbTable").show();
    //                 freshMaskedDbTableList(maskedDbAccessId,"draw");
    //             }else{
    //                 freshMaskedDbTableList(maskedDbAccessId,"search");
    //             }
    //         }
    //     }
    // });
    // $("#virtualTable").keyup(function(){
    //     if(oldSearchStr == ""){
    //         oldSearchStr = $("#virtualTable").val();
    //     }
    //     var str = $("#virtualTable").val();
    //     if(str.length >oldSearchStr.length){
    //         newTableData = searchTableTree(str,newTableData,"normal");
    //     }else{
    //         newTableData = searchTableTree(str,tableData,"normal");
    //     }
    //     drawTabelTree("virtual",newTableData);
    //     oldSearchStr = $("#virtualTable").val();
    // });

    // $("#virtualTableList").delegate("li", "click", function () {
    //     dbTableTag = 1;
    //     $("#virtualTableListWrap").hide();
    //     if(this.title != oldDbTableStr){
    //         var dbTableName = this.title;
    //         $("#virtualTable").val(dbTableName);
    //         dbAccessId = $("#virtualSrcList").data("srcid");
    //         $("#idColumnsDiv").hide();
    //         $("#storageColumns").hide();
    //         $("#storagePartition").hide();
    //         $("#partitionWrap").hide();
    //         $("#editDbColumns").hide();
    //         freshDbColumn(dbAccessId, dbTableName, null,"new");
    //         oldSearchStr = dbTableName;
    //         oldDbTableStr = dbTableName;
    //     }else{
    //         $("#virtualTable").val(this.title);
    //         $("#idColumnsDiv").show();
    //     }
    // });

    $("#virtualMaskedDbTable").keyup(function(){
        if(oldSearchMaskedStr == ""){
            oldSearchMaskedStr = $("#virtualMaskedDbTable").val();
        }
        var str = $("#virtualMaskedDbTable").val();
        if(str.length >oldSearchMaskedStr.length){
            newMaskedTableData = searchTableTree(str,newMaskedTableData,"normal");
        }else{
            newMaskedTableData = searchTableTree(str,maskedTableData,"normal");
        }
        drawTabelTree("virtualMaskedDb",newMaskedTableData);
        oldSearchMaskedStr = $("#virtualMaskedDbTable").val();
    });

    // $("#virtualMaskedDbTableList").delegate("li", "click", function () {
    //     maskedDbTableTag = 1;
    //     $("#virtualMaskedDbTableListWrap").hide();
    //     if(this.title != oldMaskedDbTableStr){
    //         $("#virtualMaskedDbTable").val(this.title);
    //         maskedDbTable = this.title;
    //         $("#maskedDbTablesColumnsTable tbody").empty();
    //         $("#loadingMaskedDbColumns").show();
    //         maskedDbAccessId = $("#virtualMaskedDbSrcList").data("srcid");
    //         $("#editMaskedDbColumns").hide();
    //         freshMaskedDbColumn(maskedDbAccessId, maskedDbTable, "new");
    //         oldSearchMaskedStr = this.title;
    //         oldMaskedDbTableStr = oldSearchMaskedStr;
    //     }else{
    //         $("#virtualMaskedDbTable").val(this.title);
    //         $("#idVirtualMaskedColumnsDiv").show();
    //     }
    // });

    function dbTableBlur(){
        var str = $("#virtualTable").val();
        if(dbTableTag != 1){
            $("#virtualTableListWrap").hide();
            if(checkDbTable($("#virtualTable"),tableData) || str == ""){
                $("#idColumnsDiv").hide();

                $('#virtualFinalTable').hide();
                $('#relationFinalTable').empty();
            }else{
                if(str != oldDbTableStr){
                    dbAccessId = $("#virtualSrcList").data("srcid");
                    $("#idColumnsDiv").hide();
                    $("#storageColumns").hide();
                    $("#storagePartition").hide();
                    $("#partitionWrap").hide();
                    $("#editDbColumns").hide();
                    freshDbColumn(dbAccessId, str, null,"new");
                    oldSearchStr = str;
                    oldDbTableStr = oldSearchStr;
                }else{
                    $("#idColumnsDiv").show();
                }
            }
        }
    }

    function maskedDbTableBlur(){
        var str = $("#virtualMaskedDbTable").val();
        if(maskedDbTableTag != 1){
            $("#virtualMaskedDbTableListWrap").hide();
            if(checkDbTable($("#virtualMaskedDbTable"),maskedTableData) || str == ""){
                $("#idVirtualMaskedColumnsDiv").hide();
            }else{
                if(str != oldMaskedDbTableStr){
                    $("#maskedDbTablesColumnsTable tbody").empty();
                    maskedDbAccessId = $("#virtualMaskedDbSrcList").data("srcid");
                    $("#editMaskedDbColumns").hide();
                    freshMaskedDbColumn(maskedDbAccessId, str, "new");
                    oldSearchMaskedStr = str;
                    oldMaskedDbTableStr = str;
                }else{
                    $("#idVirtualMaskedColumnsDiv").show();
                }
            }
        }
    }

    $("#virtualTableListWrap").mouseover(function(){
        $("#virtualTable").unbind('blur');
    });
    $("#virtualTableListWrap").mouseleave(function(){
        $("#virtualTable").bind("blur",function(){
            dbTableBlur();
        });
    });
    $("#virtualTable").blur(function(){
        dbTableBlur();
    });
    $("#virtualMaskedDbTableListWrap").mouseover(function(){
        $("#virtualMaskedDbTable").unbind('blur');
    });
    $("#virtualMaskedDbTableListWrap").mouseleave(function(){
        $("#virtualMaskedDbTable").bind("blur",function(){
            maskedDbTableBlur();
        });
    });
    $("#virtualMaskedDbTable").blur(function(){
        maskedDbTableBlur();
    });
    function checkDbTable($selector,data){
        var str = $selector.val();
        var checkArr = searchTableTree(str,data,"exact");
        if(checkArr.length <= 0){
            if($selector.selector == "#virtualTable"){
                $selector.addClass("errorC");
                $selector.siblings("small").html("*请选择正确的表");
                $selector.siblings("small").css("display", "block");
                return true;
            }else{
                if ($("[name='exchangeType']").filter(":checked").val() == "SECURE" && $("#virtualMaskedDbSrcList").val() != ""){
                    $selector.addClass("errorC");
                    $selector.siblings("small").html("*请选择正确的表");
                    $selector.siblings("small").css("display", "block");
                    return true;
                }
            }
        }
    }
};

function disableAllSrcColumns() {
    var $enabledIds = $("#dbTableColumnsTable input[name='idsDbTableColumn']");
    var $selectAllSrcColumns = $("#selectAllColumns");
    $enabledIds.prop("checked","checked");
    $selectAllSrcColumns.prop("checked","checked");
    $enabledIds.attr("disabled", true);
    $selectAllSrcColumns.attr("disabled", true);
}
function enableAllSrcColumns() {
    var $enabledIds = $("#dbTableColumnsTable input[name='idsDbTableColumn']");
    var $selectAllSrcColumns = $("#selectAllColumns");
    $enabledIds.attr("disabled", false);
    $selectAllSrcColumns.attr("disabled", false);
}
function getColumnAndPartition(){
    if(!$("#storageColumns").is(":hidden")){
        var dbTable = $("#virtualTable").val();
        $("#selectCheckbox").show();
        dbAccessId = $("#virtualSrcList").data("srcid");
        freshDbColumn(dbAccessId, dbTable, null,"edit");
        $("#storageColumns").hide();
        $("#storagePartition").hide();
    }
}

