/**
 * Created by SS on 2016/9/8.
 */
ExtraCatalog.regGetData(Module.VIRTUAL, virtualGetData);
ExtraCatalog.regInit(Module.VIRTUAL, virtualInit);
ExtraCatalog.regRender(Module.VIRTUAL, virtualRender);
ExtraCatalog.regCheck(Module.VIRTUAL, virtualCheck);

function virtualGetData() {
    return getVirtualData();
}

function virtualInit(bool) {
    if (bool)
        initVirtual();
    else
        emptyVirtual();
}

function virtualRender(catalog) {
    return renderVirtual(catalog)
}

function virtualCheck() {
    var obj = getVirtualType();
    var type = obj.resourceTypeCode;
    if(checkVirtualRelateSrc()){
        return true;
    }
    switch(type){
        case "VIRTUAL":
            return (checkVirtualData());
            break;
        case "ODPS":
            return (checkRelateSrcListValue() || checkVirtualExchangeMode()||/*checkVirtualUpdateInterval() ||*/ checkVirtualSrc() || checkVirtualTable($("#virtualTable"),tableData) || checkFinalCol() || checkDbPartition()|| checkDbTable($("#virtualMaskedDbTable"),maskedTableData)|| checkExchangeItem() )
            break;
        case "RDS":
        case "ADS":
            return (checkRelateSrcListValue() ||/*checkVirtualUpdateInterval() ||*/ checkVirtualSrc() || checkVirtualTable($("#virtualTable"),tableData) || checkFinalCol()|| checkExchangeItem())
            break;
        case "STRUCTFILE":
            return (checkVirtualUrl())
            break;
    }

}
function getVirtualType(){
    if(!$("#relateWrap").is(":hidden") && $("#relateSrcList").val() != "" && $("#relateSrcList").val() != undefined){
        var newResStr = $("#relateResList option:selected").val();
        var arr = newResStr.split(",");
        var resObj = {
            resourceDetailId:arr[0],
            resourceTypeId:arr[1],
            resourceTypeCode:arr[2],
            resourceDetailIndexCode:arr[3],
            resourceDetailName:$("#relateResList option:selected").text()
        }
    }else{
        var resObj = {
            // resourceDetailId:arr[0],
            // resourceTypeId:arr[1],
            resourceTypeCode:"VIRTUAL",
            resourceDetailIndexCode:'1126999418470400',
            resourceDetailName:'虚目录'
        }
    }
    return resObj;
}
$(document).ready()
{
    var metadataMode = $("#metadataMode").val();
    var pathname = window.location.pathname;
    var pathnameArr = pathname.split("/");
    var proName = pathnameArr[1];
    var rootPath = "http://" + window.location.host + "/" + proName;
    var virtualTextCount = 1;
    var resourceTypeCode = "VIRTUAL";
    var dbAccessId = "";
    var createType = "";
    var tableData = [];
    var newTableData = [];
    var maskedTableData = [];
    var newMaskedTableData = [];
    var virtualTableTag = 1;
    var virtualMaskedTableTag = 1;
    var oldSearchStr = "";
    var uniqTag = false;
    var virColId = 1;
    //latest 请求表名称
    var oldSearchMaskedStr = "";
    //latest 请求表名称
    var oldMaskedDbTableStr = "";
    var catalogId = $("#catalogId").val();
    if (catalogId != "") {
        createType = "edit";
    } else {
        createType = $("#createType").val();
    }
    $(function () {
        $("#realCol").sortable(
            {
                axis: 'y', // 仅纵向拖动目的列
                cursor:'move'
            }
        );
        $("#virtualCol").sortable(
            {
                axis: 'y', // 仅纵向拖动目的列
                cursor:'move'
            }
        );
    });
    $("#openItemMappingModel").click(function () {
        clearInput();
        itemMappingArr.push({
            dataDirectoryItemNo:'',
            dataTableItemNo:''
        });
        $('#virtualTextTable').append('<tr><td><a href="#" class="addDataDirectory">未指定</a></td>' +
            '<td><a href="#" class="addDataTable">未指定</a></td>' +
            '<td><a href="#" class="removeItemMapping" style="font-size: 14px"><em class="fa fa-times-circle"></em></a></td><td><i class="repeatRow"></i></td></tr>');
    });
    function clearInput() {
        $('#toRrlation').prop('disabled', false);
    }

    $("#virtualTextTable").on("click", ".removeVirtualText", function (e) {
        if (virtualTextCount > 1) {
            $(this).parent().parent().remove();
            virtualTextCount--;
        }
        return false;
    });
    //添加字段验证
    $("#virtualTextTable").delegate("input[name = 'virtualTextName']", "focus", function () {
        $(this).removeClass("errorC");
        $(this).siblings("small").hide();
        $(this).blur(function () {
            checkNotBlank($(this), $(this).siblings("small"), "*请输入名称");
            checkNameUniq($(this),"*名称不允许重复");
        });
    });
    $("#virtualTextTable").delegate("input[name = 'virtualTextType']", "focus", function () {
        $(this).removeClass("errorC");
        $(this).siblings("small").hide();
        $(this).blur(function () {
            checkNotBlank($(this), $(this).siblings("small"), "*请输入类型");
        });
    });

    //添加关联按钮
    $("#relateBtn").click(function () {
        var date = new Date();
        var currentDate = "";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        currentDate += year;
        if (month >= 10) {
            currentDate += "-" + month;
        }
        else {
            currentDate += "-" + "0" + month;
        }
        if (day >= 10) {
            currentDate += "-" + day;
        }
        else {
            currentDate += "-" + "0" + day;
        }
        $("#virtualUpdateDate").val(currentDate);
        $("#relateWrap").show();
        $("#virtualMaskedDataSrc").hide();
        $("#virtualOdpsPara").hide();
        $("#virtualRdsPara").hide();
        $("#virtualSrcPara").hide();
        $("#virtualStructPara").hide();
        $("#relateResPara").hide();
        $("#cancelRelateBtn").show();
        $("#relateBtn").hide();
        $("#editRealCol").show();
    });
    //取消关联
    $("#cancelRelateBtn").click(function () {
        $("#relateBtn").show();
        $("#cancelRelateBtn").hide();
        $("#relateWrap").hide();
        $("#virtualRdsPara").hide();
        $("#virtualPartitionWrap").hide();
        $("#virtualMaskedDataSrc").hide();
        $("#virtualHead").show();
        $("#finalHead").hide();
        $("#finalTable").empty();
        $("#finalTable").hide();
        $("#virtualTextTable").show();
        $("#addVirtualText").show();
        $("#editRealCol").hide();
        $("#virtualSrcList").val("");
        $("#virtualTable").val("");
        $("#relateSrcList").val("");
    });
    $("#relateSrcList").focus(function () {
        $("#relateSrcList").removeClass("errorC");
        $(".errorRelateSrcList").hide();
    });
    $("#relateSrcList").change(function () {
        $('#virtualFinalTable').hide();
        var type = $("#relateSrcList").val();
        $("#virtualSrcList").val("");
        $("#virtualTable").val("");
        $("#virtualMaskedDataSrc").hide();
        $("#finalTable").hide();
        $("#finalHead").hide();
        $("#virtualHead").show();
        $("#virtualPartitionWrap").hide();
        $("#virtualTextTable").show();
        $("#addVirtualText").show();
        $('#classFieldTable').html('');
        if(type == ""){
            $('#relationList').hide();
            $("#virtualOdpsPara").hide();
            // $("#shelveButton").hide();
            // $("#newAndSubmitBtn").hide();
            $("#virtualRdsPara").hide();
            // $("#virtualSrcPara").hide();
            // $("#virtualStructPara").hide();
            // $("#relateResPara").hide();
        }else if (type == "odps") {
            $('#relationList').show();
            $("#virtualOdpsPara").show();
            resourceTypeCode = 'ODPS';
            $('#resourceTypeCode').val('ODPS');
            $("#shelveButton").show();
            $("#newAndSubmitBtn").show();
            $('#exchangeMode').show();
            $('#idVirtualMaskedColumnsDiv').hide();
            $("#virtualRdsPara").hide();
            // $("#virtualSrcPara").show();
            // $("#virtualStructPara").hide();
            getVirtualResData(type);
            var radio = $('input[name="exchangeType"]').filter(":checked");
            var exchangeType = radio.val();
            if (exchangeType == "SECURE") {
                $("#virtualMaskedDataSrc").show();
                $("#exchangeMode").hide();
                $("#virtualPartitionWrap").hide();
                $("#virtualMaskedDbSrcList").val("");
                $("#virtualMaskedDbTable").val("");
            }
        }else if(type == "structFile"){
            $("#virtualOdpsPara").hide();
            $("#virtualRdsPara").hide();
            $("#virtualSrcPara").hide();
            $("#virtualStructPara").show();
            virStructFileType();
            getVirtualResData(type);
        } else if(type == 'rds'){
            $('#relationList').show();
            $("#virtualOdpsPara").hide();
            $("#virtualRdsPara").show();
            resourceTypeCode = 'RDS';
            $('#resourceTypeCode').val('RDS');
            $("#shelveButton").show();
            $("#newAndSubmitBtn").show();
            getVirtualResData(type);
        }else {
            type = 'VIRTUAL';
            $('#resourceTypeCode').val('VIRTUAL');
            getVirtualResData(type);
            $("#virtualOdpsPara").hide();
            $("#virtualRdsPara").show();
            $("#virtualSrcPara").show();
            $("#virtualStructPara").hide();
        }
    });
    function getVirtualResData(type){
        $("#relateResList").empty();
        $.get(rootPath + "/share/resourceDetail", {},
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    getVirtualResList(data.resource_detail_list,type);
                    var resLength = $("#relateResList option").length;
                    if(resLength == 0){
                        $("#relateSrcList").val("");
                        dmallError("该数据类型下无资源形态，请选择其他数据类型");
                    }else if(resLength == 1){
                        $("#relateResPara").hide();
                    } else{
                        $("#relateResPara").show();
                    }
                } else {
                    dmallError("获取资源形态列表失败");
                }
            },
            "json"
        );
    }
    function  getVirtualResList(data,type){
        type = type.toUpperCase();
        for(var i=0;i<data.length;i++){
            if(data[i].nodes != undefined){
                getVirtualResList(data[i].nodes,type);
            }else{
                if(data[i].resourceTypeCode == type){
                    var value = data[i].id + "," + data[i].resourceTypeId + "," + data[i].resourceTypeCode + "," + data[i].indexCode;
                    $("#relateResList").append(new Option(data[i].text,value));
                }
            }
        }
    }
    function virStructFileType() {
        $.get(rootPath + "/share/getResourceParamType",
            {
                resourceTypeCode: "STRUCTFILE"
            },
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    $("#typeVIRSTRUCTFILE").empty();
                    for (var key in data.resourceParamTypes) {
                        var temp = data.resourceParamTypes[key];
                        var trHTML = '<option value=' + key + '>' + temp + '</a></li>';
                        $("#typeVIRSTRUCTFILE").append(trHTML);
                    }
                } else {
                    dmallError("获取文件类型失败");
                }
            },
            "json"
        );
    };
    function getColumnData(type) {
        var virtualArray = itemMappingArr;
        uniqTag = false;
        for(var i = 0; i < virtualArray.length; i++) {
            if (virtualArray[i].dataTableItemNo == '--') virtualArray[i].dataTableItemNo = '';
            if (virtualArray[i].dataDirectoryItemNo == '--') virtualArray[i].dataDirectoryItemNo = '';
        }
        // $("#virtualTextTable tr").each(function (tdindex, tditem) {
        //     var virtualPara = new Object();
        //     virtualPara.dataTableItemNo = $.trim($(this).children('td').eq(0).html());
        //     virtualPara.dataDirectoryItemNo = $.trim($(this).children('td').eq(1).html());

            // if(type == "struct"){
            //     virtualPara.name = $.trim($(this).children("td").eq(1).find("input").val());
            //     virtualPara.value = $.trim($(this).children("td").eq(2).find("input").val());
            //     virtualPara.des = $.trim($(this).children("td").eq(3).find("input").val());
            //     virtualPara.id = $.trim($(this).children("td").eq(0).text());
            // }else{
            //     virtualPara.alias = $.trim($(this).children("td").eq(1).find("input").val());
            //     virtualPara.type = $.trim($(this).children("td").eq(2).find("input").val());
            //     virtualPara.desc = $.trim($(this).children("td").eq(3).find("input").val());
            //     virtualPara.id = $.trim($(this).children("td").eq(0).text());
            // }
            // if(metadataMode == "1" || metadataMode == "0") {
            //     virtualPara.metaCode = $.trim($(this).children("td").eq(4).children("a").data("metacode"));
            //     virtualPara.cateCode = $.trim($(this).children("td").eq(4).children("a").data("catecode"));
            //     if(virtualPara.metaCode != ""){
            //         virtualPara.metaName = $.trim($(this).children("td").eq(4).children("a").text());
            //     }
            // }
            // var $selector = $("#virtualTextTable tr").eq(tdindex).children("td:nth-child(2)").children("input");
            // if(virtualArray.length > 0){
            //     if(checkRepeat($selector,virtualArray)){
            //         uniqTag = true;
            //         return false;
            //     }else{
            //         if (virtualPara.name != "" || virtualPara.type != "") {
            //             virtualArray.push(virtualPara);
            //         }
            //     }
            // }else{
            //     if (virtualPara.name != "" || virtualPara.type != "") {
            //         virtualArray.push(virtualPara);
            //     }
            // }

        //     virtualArray.push(virtualPara);
        // });
        var string = JSON.stringify(virtualArray);
        return string;
    }
    function getVirtualData() {
        var obj = getVirtualType();
        var type = obj.resourceTypeCode;
        switch(type){
            case "VIRTUAL":
                var param = getVirData();
                break;
            case "ODPS":
                var param = getVirOdpsData();
                break;
            case "RDS":
            case "ADS":
                var param = getVirRdsData();
                break;
            case "STRUCTFILE":
                var param = getVirStructData();
                break;
        }
        if(uniqTag){
            return;
        }else{
            return param;
        }
    }
    function getVirData(){
        var virtualParams = {
            resourceParamType: "VIRTUAL",
            itemJson: getColumnData()
        };
        return virtualParams;
    }
    function getVirOdpsData(){
        var dbAccessId = $("#virtualSrcList").data("srcid");
        var dbTable = $("#virtualTable").val();
        var dbLineNumber = $("#virtualDataSize").val();
        var exchangeType = $('input[name="exchangeType"]').filter(":checked").val();
        var exchangeMode = '';
        if(exchangeType == "DIRECT"){
            if($("#exchange_package").prop("checked") && $("#exchange_transmit").prop("checked")){
                exchangeMode = "ALL";
            }else if($("#exchange_package").prop("checked")){
                exchangeMode = "PACKAGE";
            }else{
                exchangeMode = "TRANSMIT";
            }
        }
        var provideType = $('input[name="virtualProvideType"]').filter(":checked").val();
        var dataUpdateTime = $("#virtualUpdateDate").val();
        if ($("#virtualUpdateIntervalValue").val() != "") {
            var updateInterval = $("#virtualUpdateIntervalValue").val() + $("#virtualUpdateIntervalList option:selected").val();
        }
        var resourceParamType = $("#resourceParamType").val();
        var dbColumns = getFinalColData();
        var dbPartition = getVirtualDbPartitionData();

        var maskedDbAccessId = $("#virtualMaskedDbSrcList").data("srcid");
        var maskedDbTable = $("#virtualMaskedDbTable").val();
        var maskedDbColumns = getVirtualMaskedDbColumn();

        var odpsParams = {
            resourceParamType: resourceParamType,
            exchangeType: exchangeType,
            dbAccessId: dbAccessId,
            dbTable: dbTable,
            itemJson: dbColumns,
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
    }
    function getVirRdsData(){
        var dbAccessId = $("#virtualSrcList").data("srcid");
        var dbTable = $("#virtualTable").val();
        var dbLineNumber = $("#virtualDataSize").val();
        var provideType = $('input[name="virtualProvideType"]').filter(":checked").val();
        var dataUpdateTime = $("#virtualUpdateDate").val();
        if ($("#virtualUpdateIntervalValue").val() != "") {
            var updateInterval = $("#virtualUpdateIntervalValue").val() + $("#virtualUpdateIntervalList option:selected").val();
        }
        var resourceParamType = $("#resourceParamType").val();
        var dbColumns = getFinalColData();
        //if (resourceTypeCode == "RDS") {
        //    resourceParamType = "RDS";
        //} else if (resourceTypeCode == "ADS") {
        //    resourceParamType = "ADS";
        //}
        var splitPk = $("#virtualSplitPkList option:selected").val();
        if(checkSplitPKList(splitPk)){
            return;
        }
        var extractDescription = $("#virtualExtractDescription").val();

        var rdsParams = {
            resourceParamType: resourceParamType,
            dbAccessId: dbAccessId,
            dbTable: dbTable,
            itemJson: dbColumns,
            // provideType: provideType,
            // updateInterval: updateInterval,
            // dataUpdateTime: dataUpdateTime,
            // dbLineNumber: dbLineNumber,
            splitPk:splitPk
            // extractDescription:extractDescription
        }
        return rdsParams;
    }
    function getVirStructData(){
        var destColumn = getColumnData("struct");
        var structParams = {
            resourceParamType: $("#typeVIRSTRUCTFILE option:selected").val(),
            url: $("#virtualStructUrl").val(),
            destColumn: destColumn
        }
        return structParams;
    }
    function getFinalColData(){
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


        // $("#finalTable tr").each(function () {
        //     var virtualPara = new Object();
        //     virtualPara.id = $.trim($(this).children("td").eq(0).text());
        //     virtualPara.name = $.trim($(this).children("td").eq(1).text());
        //     virtualPara.alias = $.trim($(this).children("td").eq(2).find("input").val());
        //     virtualPara.type = $.trim($(this).children("td").eq(3).text());
        //     virtualPara.desc = $.trim($(this).children("td").eq(4).find("input").val());
        //     if(metadataMode == "1" || metadataMode == "0") {
        //         virtualPara.metaCode = $.trim($(this).children("td").eq(5).children("a").data("metacode"));
        //         virtualPara.cateCode = $.trim($(this).children("td").eq(5).children("a").data("catecode"));
        //         if(virtualPara.cateCode == ""){
        //             virtualPara.metaName == "";
        //         }else{
        //             virtualPara.metaName = $.trim($(this).children("td").eq(5).children("a").text());
        //         }
        //     }
        //     virtualArray.push(virtualPara);
        // });
        var str = JSON.stringify(virtualArray);
        return str;
    }
    function getVirtualDbPartitionData() {
        var j = 0;
        var val2 = [];
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
    }
    function getVirtualMaskedDbColumn(){
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
    }
    function initVirtual() {
        virtualTextCount = $("#virtualCount").val();
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
    }
    function emptyVirtual() {

    }
    function renderVirtual(extraParams) {

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
                    }else if(itemList[i].dataDirectoryItemName != undefined && arr1[j].dataDirectoryItemName == 'deleted'){
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
        // initCatalogPageArr();
        // $("#virtualUpdateDate").val(extraParams.dataUpdateTime);
        // $("#virtualDataSize").val(extraParams.dbLineNumber);
        // var virtualText = eval("(" + extraParams.dbColumn + ")");
        // virtualTextCount = virtualText.length;
        // $("#virtualTextTable").empty();
        // for (var i = 0; i < virtualText.length; i++) {
        //     var j = i + 1;
        //     var html = '<tr><td hidden>'+virtualText[i].id+'</td><td>' +
        //         '          <input type="text" id="virtualTextName' + j + '" class="form-control" name="virtualTextName" maxlength="32"/>' +
        //         '          <small class="text-danger"></small></td>' +
        //         '        <td>' +
        //         '          <input type="text" id="virtualTextType' + j + '" class="form-control" name="virtualTextType" maxlength="16"/>' +
        //         '          <small class="text-danger"></small></td>' +
        //         '        <td>' +
        //         '          <input type="text" id="virtualTextDesc' + j + '" class="form-control" name="virtualTextDes" maxlength="255"/></td>';
        //     if(metadataMode == "1" || metadataMode == "0") {
        //         if(virtualText[i].metaCode == "" || virtualText[i].metaCode == undefined){
        //             html += '<td><a href="javascript:void(0)" onclick="addMeta($(this))" data-metacode="">添加关联</a>' +
        //             '<div hidden><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
        //             '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td>';
        //         }else{
        //             html += '<td><a href="javascript:void(0)" onclick="viewMeta(this)" data-metacode="' + virtualText[i].metaCode + '" data-catecode="' + virtualText[i].cateCode + '">' + virtualText[i].metaName + '</a>' +
        //             '<div><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
        //             '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td>';
        //         }
        //     }
        //     html +=  '<td><a href="#" class="removeVirtualText" style="font-size: 32px">×</a></td></tr> ';
        //     $("#virtualTextTable").append(html);
        //     $("#virtualTextName" + j).val(virtualText[i].alias);
        //     $("#virtualTextType" + j).val(virtualText[i].type);
        //     $("#virtualTextDesc" + j).val(virtualText[i].desc);
        // }
    }
    //非空验证
    function checkNotBlank($select, $errorClass, errorMsg) {
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
    //虚转实---交换方法
    $("[name='exchangeType']").change(function () {
        var radio = $('input[name="exchangeType"]').filter(":checked");
        if (radio.length) {
            var exchangeType = radio.val();
            if (exchangeType == "SECURE") {
                $("#virtualMaskedDataSrc").show();
                $("#exchangeMode").hide();
                $("#virtualPartitionWrap").hide();
            } else {
                $("#virtualMaskedDataSrc").hide();
                $("#exchangeMode").show();
                if ($("#exchange_transmit").prop("checked")) {
                    //   getColumnAndPartition();
                    if ($("#virtualPartitionTableBody").children().length > 0) {
                        $("#virtualPartitionWrap").show();
                    }
                }
            }
        }
    });
    //交换模式
    $("[name='exchangeMode']").click(function(){
        var size = $('input[name="exchangeMode"]').filter(":checked").size();
        if(size == 0){
            $(".errorExchangeMode").html("*请选择交换模式");
            $(".errorExchangeMode").css("display", "block");
        }else{
            if($("#exchange_transmit").prop("checked")){
                //显示分区
                var type = $("#relateSrcList").val();
                initRealCol(type,"new");
                if($("#virtualPartitionTableBody").children().length > 0){
                    $("#virtualPartitionWrap").show();
                }
            }else {
                $("#virtualPartitionWrap").hide();
            }
            $(".errorExchangeMode").css("display", "none");
        }



        // if($("#exchange_package").prop("checked")){
        //     // $("#exchangeInterval").show();
        //     disableAllSrcColumns();
        //     if(!$("#exchange_transmit").prop("checked")){
        //         $("#virtualPartitionWrap").hide();
        //     }else{
        //         //显示分区
        //         if($("#virtualPartitionTableBody").children().length > 0){
        //             $("#virtualPartitionWrap").show();
        //         }
        //     }
        // }else{
        //     //  $("#exchangeInterval").hide();
        //     //显示分区
        //     if($("#exchange_transmit").prop("checked")){
        //         //  enableAllSrcColumns();
        //         disableAllSrcColumns();
        //         if($("#virtualPartitionTableBody").children().length > 0){
        //             $("#virtualPartitionWrap").show();
        //         }
        //     }
        // }
    });
    // 提供方式
    $("[name='virtualProvideType']").change(function () {
        var radio = $('input[name="virtualProvideType"]').filter(":checked");
        if (radio.length) {
            var virtualProvideType = radio.val();
            if (virtualProvideType == "PERIOD") {
                $("#virtualUpdateInterval").show();
                $("#virtualExtractDescriptionDiv").show();
            } else {
                $("#virtualExtractDescriptionDiv").hide();
                $("#virtualUpdateInterval").hide();
            }
        }
    });
    //选择数据源
    $("#chooseVirtualSrc").click(function () {
        var type = $("#relateSrcList").val();
        if (type == "") {
            $("#relateSrcList").addClass("errorC");
            $(".errorRelateSrcList").html("*请选择数据类型").show();
        } else {
            $("#btn_commit").data("mask", "");
            openSrcModal("virtual");
            // $('#virtualFinalTable').hide();
            $('#virtualPartitionWrap').hide();
            // $('#btn_commit').prop('disabled',true);
        }
        $("#finalTableName").val("");
        oldMaskedDbTableStr = "";
    });
    // $('#btn_commit').click(function () {
    //     $('#virtualFinalTable').hide();
    //     $('#relationFinalTable').empty();
    // });
    // $('#list-all').on('click','option',function () {
    //     $('#btn_commit').prop('disabled',false);
    // });
    //选择脱敏数据源
    $("#chooseVirtualMarkedDbSrc").click(function () {
        $("#btn_commit").data("mask", "masked");
        openSrcModal("virtual");
    });
    //清除脱敏数据源
    $("#clearVirtualMarkedDbSrc").click(function(){
        clearVirtualMaskedDbSrcList();
    });

    function clearVirtualMaskedDbSrcList(){
        $("#virtualMaskedDbSrcList").attr("value", "");
        $("#virtualMaskedDbSrcList").data("srcid", "");
        $("#virtualMaskedDbTable").val("");
        $("#virtualMaskedDbTableColumnsTableBody").empty();
        $("#idVirtualMaskedColumnsDiv").hide();
    }

    function getVirtualDbSrcList(pageNum) {
        var isCdc = 1;
        var virtualProvideType = $('input[name="virtualProvideType"]').filter(":checked").val();
        if (virtualProvideType == "PERIOD") {
            isCdc = 0;
        }
        var dbType = $("#relateSrcList").val();
        $.get("/" + prjName + "/dbaccess/getdbsrc",
            {
                pageNumber: pageNum,
                action: "ROLE_DEPARTMENT_CATALOGER",
                dbSrcType: dbType,
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

    //获取表
    function freshVirtualTableList(type,dbType) {
        var dbAccessId = '';
        if(dbType == "odps"){
            dbAccessId = $("#virtualSrcList").data("srcid");
        }else{
            dbAccessId = $("#virtualMaskedDbSrcList").data("srcid");
        }

        $.get("/" + prjName + "/dbaccess/tables",
            {
                dbSrcId: dbAccessId
            },
            function (data, status) {
                if(dbType == "odps"){
                    tableData = [];
                    $("#loadingVirtualTable").hide();
                }else{
                    maskedTableData = [];
                    $("#loadingVirtualMaskedDbTable").hide();
                }
                if (status == "success") {
                    if(dbType == "odps"){
                        $("#virtualTableList").empty();
                    }else{
                        $("#virtualMaskedDbTableList").empty();
                    }
                    if (data.resultList.length > 0) {
                        for (var i = 0; i < data.resultList.length; i++) {
                            var table = data.resultList[i];
                            if(dbType == "odps"){
                                tableData.push(table);
                            }else{
                                maskedTableData.push(table);
                            }
                        }
                        if (type == "draw") {
                            if(dbType == "odps"){
                                drawTabelTree("virtual", tableData);
                            }else{
                                drawTabelTree("virtualMaskedDb", maskedTableData);
                            }
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
    //选择表
    $("#virtualTable").click(function () {
        var src = $("#virtualSrcList").val();
        if (src == "") {
            $("#virtualSrcList").addClass("errorC");
            $(".errorVirtualSrcListValue").html("*请选择数据源");
            $(".errorVirtualSrcListValue").css("display", "block");
        } else {
            var str = $("#virtualTable").val();

            $("#finalTableName").val(str);
            virtualTableTag = 0;
            if (str == "") {
                $("#loadingVirtualTable").show();
                freshVirtualTableList("draw","odps");
                //获取列
            } else {
                newTableData = searchTableTree(str, tableData, "normal");
                drawTabelTree("virtual", newTableData);
            }
        }
    });
    $("#virtualMaskedDbTable").click(function(){
        var src = $("#virtualMaskedDbSrcList").val();
        if(src != ""){
            var str = $("#virtualMaskedDbTable").val();
            virtualMaskedTableTag = 0;
            if(str == ""){
                $("#loadingVirtualMaskedDbTable").show();
                freshVirtualTableList("draw","masked");
            }else{
                newMaskedTableData = searchTableTree(str,maskedTableData,"normal");
                drawTabelTree("virtualMaskedDb",newMaskedTableData);
            }
        }
    });
    $("#virtualTable").keyup(function(){
        if(oldSearchStr == ""){
            oldSearchStr = $("#virtualTable").val();
        }
        var str = $("#virtualTable").val();
        if(str.length >oldSearchStr.length){
            newTableData = searchTableTree(str,newTableData,"normal");
        }else{
            newTableData = searchTableTree(str,tableData,"normal");
        }
        drawTabelTree("virtual",newTableData);
        oldSearchStr = $("#virtualTable").val();
    });
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
    $("#virtualTableList").delegate("li", "click", function () {
        var type = $("#relateSrcList").val();
        virtualTableTag = 1;
        $("#virtualTableListWrap").hide();
        var oldDbTableStr = $("#finalTableName").val();
        if (this.title != oldDbTableStr) {
            var dbTableName = this.title;
            $("#virtualTable").val(dbTableName);
            $("#virtualPartitionWrap").hide();
            // initVirtualTable();
            initRealCol(type,"new");
            $("#relateModal").modal({backdrop: 'static', keyboard: false});
            $('#virtualFinalTable').hide();
            $('#relationFinalTable').empty();
            oldSearchStr = dbTableName;
        } else {
            var dbTableName = this.title;
            $("#virtualTable").val(dbTableName);
            $("#virtualPartitionWrap").hide();
            initRealCol(type,"new");
            $("#relateModal").modal({backdrop: 'static', keyboard: false});
        }
    });
    $("#virtualMaskedDbTableList").delegate("li", "click", function () {
        virtualMaskedTableTag = 1;
        $("#virtualMaskedDbTableListWrap").hide();
        var dbTableName = this.title;
        $("#virtualMaskedDbTable").val(dbTableName);
        freshVirtualMaskedInfo();
        // if (this.title != oldMaskedDbTableStr) {
        //     var dbTableName = this.title;
        //     $("#virtualMaskedDbTable").val(dbTableName);
        //     freshVirtualMaskedInfo();
        //     oldSearchMaskedStr = dbTableName;
        //     oldMaskedDbTableStr = dbTableName;
        // } else {
        //     $("#virtualMaskedDbTable").val(this.title);
        // }
    });
    function virtualTableBlur() {
        var str = $("#virtualTable").val();
        var oldDbTableStr = $("#finalTableName").val();
        if (virtualTableTag != 1) {
            $("#virtualTableListWrap").hide();
            if (checkVirtualTable($("#virtualTable"),tableData) || str == "") {
                $("#virtualHead").show();
                $("#finalHead").hide();
                $("#virtualTextTable").show();
                $("#addVirtualText").show();
                $("#finalTable").hide();
                $("#virtualPartitionWrap").hide();

                $('#virtualFinalTable').hide();
                $('#relationFinalTable').empty();
            } else {
                $("#virtualHead").show();
                $("#finalHead").hide();
                $("#addVirtualText").show();
                $("#virtualTextTable").show();
                $("#finalTable").hide();
                if (str != oldDbTableStr) {
                    var type = $("#relateSrcList").val();
                    $("#virtualPartitionWrap").hide();
                    // initVirtualTable();
                    initRealCol(type,"new");
                    $("#relateModal").modal({backdrop: 'static', keyboard: false});
                    $('#virtualFinalTable').hide();
                    $('#relationFinalTable').empty();
                    oldSearchStr = str;
                } else {
                    $("#virtualHead").hide();
                    $("#finalHead").show();
                    $("#addVirtualText").hide();
                    $("#virtualTextTable").hide();
                    $("#finalTable").show();

                    var type = $("#relateSrcList").val();
                    $("#virtualPartitionWrap").hide();
                    // initVirtualTable();
                    initRealCol(type,"new");
                    $("#relateModal").modal({backdrop: 'static', keyboard: false});
                }
            }
        }
    }
    function virtualMaskedTableBlur(){
        var str = $("#virtualMaskedDbTable").val();
        if(maskedDbTableTag != 1){
            $("#virtualMaskedDbTableList").hide();
            if(checkDbTable($("#virtualMaskedDbTable"),maskedTableData) || str == ""){
                $("#idVirtualMaskedColumnsDiv").hide();
            }else{
                if(str != oldMaskedDbTableStr){
                    freshVirtualMaskedInfo();
                    oldSearchMaskedStr = str;
                    oldMaskedDbTableStr = str;
                }else{
                    $("#virtualMaskedDataSrc").show();
                }
            }
        }
    }
    $("#virtualTableListWrap").mouseover(function () {
        $("#virtualTable").unbind('blur');
    });
    $("#virtualTableListWrap").mouseleave(function () {
        $("#virtualTable").bind("blur", function () {
            virtualTableBlur();
        });
    });
    // $("#virtualTable").blur(function () {
    //     virtualTableBlur();
    // });
    $("#virtualMaskedDbTableListWrap").mouseover(function () {
        $("#virtualMaskedDbTable").unbind('blur');
    });
    $("#virtualMaskedDbTableListWrap").mouseleave(function () {
        $("#virtualMaskedDbTable").bind("blur", function () {
            virtualMaskedTableBlur();
        });
    });
    $("#virtualMaskedDbTable").blur(function () {
        virtualMaskedTableBlur();
    });
    $("#editRealCol").click(function(){
        var type = $("#relateSrcList").val();
        if(checkVirtualTable($("#virtualTable"),tableData)){
            return false;
        }
        initVirtualTable();
        if($("#finalTable tr").length > 0){
            // initRealCol(type,"edit");
        }else{
            // initRealCol(type,"new");
        }
        $("#relateModal").modal({backdrop: 'static', keyboard: false});
    });

    $("#commitVirtualFinalTable").click(function(){
        $('#relationFinalTable').empty();
        $('#itemMappingTable tr').each(function (index) {
            var relationTr = $('#classFieldTable tr').eq(index);
            var html = '<tr>';
            if(relationTr.length == 0){
                html += '<td>'+ $(this).children().eq(0).html() +'</td><td>'+ $(this).children().eq(1).html() +'</td><td>--</td><td>--</td><td></td>';
            }else{
                var dbColumn = relationTr.children().eq(0).html();
                var dbColumnType = relationTr.children().eq(1).html();
                var dbColumnDesc = relationTr.children().eq(2).html();
                html += '<td>'+ $(this).children().eq(0).html() +'</td><td>'+ $(this).children().eq(1).html() +'</td><td>'+ dbColumn +'</td><td>'+ dbColumnType +'</td><td>'+ dbColumnDesc +'</td>';
                itemMappingArr[index]['dbColumn'] = dbColumn;
                itemMappingArr[index]['dbColumnType'] = dbColumnType;
                itemMappingArr[index]['dbColumnDesc'] = dbColumnDesc;
            }
            html += '</tr>';
            $('#relationFinalTable').append(html);
        });
        $('#virtualFinalTable').show();
        $("#shelveButton").attr('disabled', false);
        $("#newAndSubmitBtn").attr('disabled', false);

        newFinalTableList = [];
        oldFinalTableList = [];
        $('#relationFinalTable tr').each(function () {
            var newObj = {};
            newObj['dataTableItemNo'] = $(this).children('td').eq(0).html();
            newObj['dataDirectoryItemNo'] = $(this).children('td').eq(1).html();
            newObj['dbColumn'] = $(this).children('td').eq(2).html();
            newObj['dbColumnType'] = $(this).children('td').eq(3).html();
            oldFinalTableList.push(newObj);
            newFinalTableList.push(newObj);
        });
        $('.notifications').empty();
    });

    $("#relateHelp").click(function(){
        $("#relateHelpModal").modal({backdrop: 'static', keyboard: false});
    });
    $("#confirmBtn").click(function(){
        freshFinalTable();
    });
    //获取虚拟列
    function initVirtualTable(){
        // $('#virtualFinalTable').hide();
        // $('#relationFinalTable').empty();

        $("#virtualCol").empty();
        var colStr = getColumnData();
        var col = eval("("+colStr+")");
        var html = "";
        var finalColStr = getFinalColData();
        var finalCol = eval("("+finalColStr+")");
        if(!$("#finalTable").is(":hidden") && $("#finalTable").children().length > 0){
            for(var i = 0;i < finalCol.length;i++){
                html += '<tr style="height: 40px"><td hidden>'+finalCol[i].id+'</td>' +
                '<td width="30%">'+finalCol[i].alias+'</td>' +
                '<td width="30%">' + finalCol[i].type + '</td>' +
                '<td width="30%">' + finalCol[i].desc + '</td>';
                if(metadataMode == "1" || metadataMode == "0") {
                    if(finalCol[i].metaCode == "" || finalCol[i].metaCode == undefined){
                        html += '<td hidden><a href="javascript:void(0)" data-metacode="">添加关联</a></td>';
                    }else{
                        html += '<td hidden><a href="javascript:void(0)" data-metacode="' + finalCol[i].metaCode + '" data-catecode="' + finalCol[i].cateCode + '">' + finalCol[i].metaName + '</a></td>';
                    }
                }
            }
            for(var i= 0;i < col.length;i++){
                var finalTag = 0;
                for(var j = 0;j < finalCol.length;j++){
                    if(col[i].id == finalCol[j].id){
                        finalTag = 1;
                    }
                }
                if(finalTag == 0){
                    html += '<tr style="height: 40px"><td hidden>'+col[i].id+'</td>' +
                    '<td width="30%">'+col[i].alias+'</td>' +
                    '<td width="30%">' + col[i].type + '</td>' +
                    '<td width="30%">' + col[i].desc + '</td>';
                    if(metadataMode == "1" || metadataMode == "0") {
                        if(col[i].metaCode == "" || col[i].metaCode == undefined){
                            html += '<td hidden><a href="javascript:void(0)" data-metacode="">添加关联</a></td>';
                        }else{
                            html += '<td hidden><a href="javascript:void(0)" data-metacode="' + col[i].metaCode + '" data-catecode="' + col[i].cateCode + '">' + col[i].metaName + '</a></td>';
                        }
                    }
                    html += '</tr>';
                }
            }
        }else{
            for(var i= 0;i < col.length;i++){
                html += '<tr style="height: 40px"><td hidden>'+col[i].id+'</td>' +
                '<td width="30%">'+col[i].alias+'</td>' +
                '<td width="30%">' + col[i].type + '</td>' +
                '<td width="30%">' + col[i].desc + '</td>';
                if(metadataMode == "1" || metadataMode == "0") {
                    if(col[i].metaCode == "" || col[i].metaCode == undefined){
                        html += '<td hidden><a href="javascript:void(0)" data-metacode="">添加关联</a></td>';
                    }else{
                        html += '<td hidden><a href="javascript:void(0)" data-metacode="' + col[i].metaCode + '" data-catecode="' + col[i].cateCode + '">' + col[i].metaName + '</a></td>';
                    }
                }
                html += '</tr>';
            }
        }
        $('#virtualCol').append(html);
    }
    //获取实际列和分区
    function initRealCol(type,edit){
        $("#realCol").empty();
        $(".errorRealCol").hide();
        if(type == "odps"){
            $("#selectAllRealCol").prop("disabled", true);
        }else{
            $("#selectAllRealCol").prop("disabled", false);
        }
        $(".errorDstCheckedTable").hide();
        $(".errorDbTableColumnsListValue").hide();
        $("#loadingRealColumns").show();
        var dbSrcId = $("#virtualSrcList").data('srcid');
        var dbTableName = $("#virtualTable").val();
        $.get("/" + proName + "/dbaccess/table_columns",
            {
                dbSrcId: dbSrcId,
                dbTableName: dbTableName
            },
            function (data, status) {
                if (status == "success") {
                    if(data.tableInfo != undefined){
                        var list = data.tableInfo.columns;
                        var html = '';
                        $('#virtualSplitPkList').html('<option value="">请选择</option>');
                        for (var i = 0; i < list.length; i++){
                            html += '<tr class="ui-state-default"><td width="30%">'+ list[i].name + '</td><td width="30%">' + list[i].type + '</td><td width="40%"></td></tr>';
                            if(list[i].type == 'Integer'){
                                if($("#virtualSplitPkList").data("name") == list[i].name){
                                    $('#virtualSplitPkList').append('<option selected value="'+ list[i].name +'">'+ list[i].name +'</option>');
                                }else {
                                    $('#virtualSplitPkList').append('<option value="'+ list[i].name +'">'+ list[i].name +'</option>');
                                }
                            }
                        }
                        $('#classFieldTable').html(html);

                        // $("#realCol").empty();
                        $("#virtualPartitionTableBody").empty();
                        $("#virtualPartitionWrap").hide();
                        // $("#loadingRealColumns").hide();
                        if (!data.tableInfo) {
                            dmallError("没有获取到列");
                        } else {
                            var tableInfo = data.tableInfo;
                            // if(edit == "edit"){
                            // var finalColStr = getFinalColData();
                            // var finalCol = eval("("+finalColStr+")");
                            // if(type == "odps"){
                            //     var disable = "disabled";
                            // }else{
                            //     var disable = "";
                            // }
                            // for(var i = 0;i < finalCol.length;i++){
                            //     $('#realCol').append('<tr style="height: 40px">' +
                            //     '<td width="3%"><input type="checkbox" name="idsRealCol" checked '+ disable +'/></td>' +
                            //     '<td width="40%">' + finalCol[i].name + '</td><td width="57%">' + finalCol[i].type +
                            //     '</td><td hidden>' + finalCol[i].desc  +
                            //     '</td></tr>');
                            // }
                            // for (var i = 0; i < tableInfo.columns.length; i++) {
                            //     var column = tableInfo.columns[i];
                            //     var virTag = 0;
                            //     for(var j = 0;j < finalCol.length;j++){
                            //         if(column.name == finalCol[j].name){
                            //             virTag = 1;
                            //         }
                            //     }
                            //     if(column.comment == null){
                            //         column.comment = "";
                            //     }
                            //     if(virTag == 0){
                            //         $('#realCol').append('<tr style="height: 40px">' +
                            //         '<td width="3%"><input type="checkbox" name="idsRealCol" '+ disable +'/></td>' +
                            //         '<td width="40%">' + column.name + '</td><td width="57%">' + column.type +
                            //         '</td><td hidden>' + column.comment +
                            //         '</td></tr>');
                            //     }
                            // }
                            // }else{
                            //     if(type == "odps"){
                            //         var disable = "disabled";
                            //     }else{
                            //         var disable = "";
                            //     }
                            //     for (var i = 0; i < tableInfo.columns.length; i++) {
                            //         var column = tableInfo.columns[i];
                            //         if(column.comment == null){
                            //             column.comment = "";
                            //         }
                            //         $('#realCol').append('<tr style="height: 40px">' +
                            //         '<td width="3%"><input type="checkbox" name="idsRealCol" checked '+ disable +'/></td>' +
                            //         '<td width="40%">' + column.name + '</td><td width="57%">' + column.type +
                            //         '</td><td hidden>'+ column.comment +'</td></tr>');
                            //     }
                            // }
                            // var size = $("#realCol input[name='idsRealCol']:checked").size();
                            // if(size == tableInfo.columns.length){
                            //     $("#selectAllRealCol").prop("checked",true);
                            // }else{
                            //     $("#selectAllRealCol").prop("checked",false);
                            // }
                            //渲染分区（共享的数据源不显示分区）
                            if($('[name="exchangeType"]:checked').val() == 'DIRECT' && $('#exchange_transmit').prop('checked')){
                                if (tableInfo.partitions.length > 0) {
                                    $('#virtualPartitionWrap').show();
                                    for (var i = 0; i < tableInfo.partitions.length; i++) {
                                        var columns = tableInfo.partitions[i];

                                        var trHTML = '<tr><td><input type="checkbox" checked></td>' +
                                            '<td>' + columns + '</td>' +
                                            '<td><input id="partition_' + columns + '" name="partitionColumnNames" maxlength="16" onblur="checkPartition()" type="text" class="form-control"  value=""/>' +
                                            '<small class="text-danger"></small></td></tr>';
                                        $("#virtualPartitionTableBody").append(trHTML);
                                    }
                                }
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
    $("#realCol").delegate("input[name='idsRealCol']:enabled", "click", function () {
        var columnsSize = $("#realCol input[name='idsRealCol']:enabled:not(:checked)").size();
        if (0 < columnsSize) {
            $("#selectAllRealCol").prop("checked", false);
        } else {
            $("#selectAllRealCol").prop("checked", true);
        }
        $(".errorRealCol").hide();
    });
    //全选按钮
    $("#selectAllRealCol").click(function () {
        var $this = $(this);
        var $enabledIds = $("#realCol input[name='idsRealCol']:enabled");
        if ($this.prop("checked")) {
            $enabledIds.prop("checked", true);
            $(".errorRealCol").hide();
        } else {
            $enabledIds.prop("checked", false);
            $(".errorRealCol").show();
        }

    });
    //获取关联表数据
    function getFinalTableData(){
        var virtualArray = [];
        $('#itemMappingTable tr').each(function (index) {
            var virtualPara = new Object();
            var list = $('#virtualTextTable').data('virtualArray');
            virtualPara.dataTableItemNo = list[index].dataTableItemNo;
            virtualPara.dataDirectoryItemNo = list[index].dataDirectoryItemNo;
            virtualPara.dbColumn = $.trim($('#classFieldTable tr').eq(index).children().eq(0).html());
            virtualPara.dbColumnType = $.trim($('#classFieldTable tr').eq(index).children().eq(1).html());
            virtualPara.dbColumnDesc = $.trim($('#classFieldTable tr').eq(index).children().eq(2).html());
            virtualArray.push(virtualPara);
        });
        // $("#realCol tr").each(function (tdindex, tditem) {
        //     var virtualPara = new Object();
        //     var $selector;
        //     if($(this).children("td").eq(0).find("input").prop("checked")){
        //         virtualPara.name = $.trim($(this).children("td").eq(1).text());
        //         virtualPara.type = $.trim($(this).children("td").eq(2).text());
        //         $selector = $("#virtualCol").children("tr").eq(tdindex);
        //         virtualPara.id = $selector.children("td").eq(0).text();
        //         virtualPara.alias = $selector.children("td").eq(1).text();
        //         virtualPara.desc = $selector.children("td").eq(3).text();
        //         if(virtualPara.desc == ""){
        //             virtualPara.desc = $.trim($(this).children("td").eq(3).text());;
        //         }
        //         if(metadataMode == "1" || metadataMode == "0") {
        //             virtualPara.metaCode = $.trim($selector.children("td").eq(4).children("a").data("metacode"));
        //             virtualPara.cateCode = $.trim($selector.children("td").eq(4).children("a").data("catecode"));
        //             if(virtualPara.cateCode == ""){
        //                 virtualPara.metaName == "";
        //             }else{
        //                 virtualPara.metaName = $.trim($selector.children("td").eq(4).children("a").text());
        //             }
        //         }
        //         virtualArray.push(virtualPara);
        //     }
        // });
        return virtualArray;
    }
    //渲染关联后表
    function freshFinalTable(){
        if(checkVirtualCol()){
            return false;
        }else{
            $("#finalTableName").val($("#virtualTable").val());
            $("#virtualSplitPkList").empty();
            $("#finalTable").empty();
            var virtualArray = getFinalTableData();
            var opHTML = '<option value="">请选择</option>';
            for (var i = 0; i < virtualArray.length; i++) {
                var column = virtualArray[i];
                var html = '<tr>' +
                    '<td hidden>' + column.id + '</td>'+
                    '<td>' + column.name + '</td>';
                if(column.alias == ""){
                    html += '<td><input type="text" class="form-control" value="' + column.name + '" /></td>';
                }else{
                    html += '<td><input type="text" class="form-control" value="' + column.alias + '" /></td>';
                }
                html +=  '<td>' + column.type + '</td>' +
                '<td><input type="text" class="form-control" value="' + column.desc + '" /></td>';
                if(metadataMode == "1" || metadataMode == "0") {
                    if(column.metaCode == "" || column.metaCode == undefined){
                        html += '<td><a href="javascript:void(0)" onclick="addMeta($(this))" data-metacode="">添加关联</a>' +
                        '<div hidden><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
                        '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td>';
                    }else{
                        html += '<td><a href="javascript:void(0)" onclick="viewMeta(this)" data-metacode="' + column.metaCode + '" data-catecode="' + column.cateCode + '">' + column.metaName + '</a>' +
                        '<div><a href="javascript:void(0)" class="editMeta" title="修改数据元"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a>' +
                        '<a href="javascript:void(0)" onclick="delMeta(this)" title="删除数据元"><em class="fa fa-times" style="color:#1E90FF;font-size: 20px"></em></a></div></td>';
                    }
                }
                html += '</tr>';
                $("#finalTable").append(html);
                if(column.type == "Integer"){
                    opHTML += '<option value=' + column.name + '>' + column.alias + '</option>';
                }
            }
            $("#virtualSplitPkList").append(opHTML);
            $("#virtualTextTable").hide();
            $("#finalTable").show();
            $("#virtualHead").hide();
            $("#finalHead").show();
            $("#addVirtualText").hide();
            $("#relateModal").modal("hide");
            if($("#exchange_transmit").prop("checked") && $("[name='exchangeType']").filter(":checked").val() == "DIRECT"){
                if ($("#virtualPartitionTableBody").children().length > 0) {
                    $("#virtualPartitionWrap").show();
                }
            }
        }
    }
    function checkPartition() {
        var j = 0;
        var val2 = {};
        $("#virtualPartitionTableBody").find(":checkbox:checked").each(function () {
            var ptValue = "";
            var ptName = $(this).parent().next().text();
            $(this).parent().parent().find("[type='text']").each(function (tdindex, tditem) {
                ptValue = $(tditem).val();
                if (ptValue == "") {
                    $(this).parent().parent().find("[type='text']").addClass("errorC");
                    $(this).parent().parent().find("[type='text']").siblings("small").show().html("*请输入分区值");
                    preventDefaultFlag = true;
                }
                // else if(!inputCheckCode(ptValue)){
                //     $(this).parent().parent().find("[type='text']").addClass("errorC");
                //     $(this).parent().parent().find("[type='text']").siblings("small").show().html("*请输入数字、字母");
                //     preventDefaultFlag = true;
                // }
                else {
                    $(this).parent().parent().find("[type='text']").removeClass("errorC");
                    $(this).parent().parent().find("[type='text']").siblings("small").hide();
                }
            });
            val2[ptName] = ptValue;
            j++;
        });
        if (j > 0) {
            var partition = JSON.stringify(val2);
        }
    }
    //渲染脱敏数据列信息
    function freshVirtualMaskedInfo(){
        $('#virtualMaskedDbTableColumnsTableBody').empty();
        $("#loadingVirtualMaskedDbColumns").show();
        var dbSrcId = $("#virtualMaskedDbSrcList").data('srcid');
        var dbTableName = $("#virtualMaskedDbTable").val();
        $.get("/" + proName + "/dbaccess/table_columns",
            {
                dbSrcId: dbSrcId,
                dbTableName: dbTableName
            },
            function (data, status) {
                if (status == "success") {
                    $("#loadingVirtualMaskedDbColumns").hide();
                    if (!data.tableInfo) {
                        dmallError("没有获取到列");
                    } else {
                        var tableInfo = data.tableInfo;
                        for (var i = 0; i < tableInfo.columns.length; i++) {
                            var column = tableInfo.columns[i];
                            var html = '<tr><td><input type="checkbox" checked disabled></td>' +
                                '<td>' + column.name + '</td>' +
                                '<td>' + column.type + '</td>' +
                                '<td><input name="maskedDbTableColumnDesc" type="text" class="form-control" maxlength="255" value=""></td>';
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
                    }
                } else {
                    dmallError("获取列失败");
                }
            },
            "json"
        );
    }


    //检查相关
    function checkVirtualData(){
        var $selectName = $("#virtualTextTable").find("input[name = 'virtualTextName']");
        var sizeName = $selectName.size();
        for(var i=0;i<sizeName;i++){
            if(checkNotBlank($selectName.eq(i),$selectName.eq(i).siblings("small"),"*请输入名称")){
                return true;
            }
        }
        var $selectType = $("#virtualTextTable").find("input[name = 'virtualTextType']");
        var sizeType = $selectType.size();
        for(var i=0;i<sizeType;i++){
            if(checkNotBlank($selectType.eq(i),$selectType.eq(i).siblings("small"),"*请输入类型")){
                return true;
            }
        }
    }
    function checkRelateSrcListValue(){
        if ($("#relateSrcList").val() == "") {
            $("#relateSrcList").addClass("errorC");
            $(".errorRelateSrcList").html("*请选择数据类型");
            $(".errorRelateSrcList").css("display", "block");
            return true;
        }
        return false;
    }

    function checkVirtualExchangeMode(){
        var exchangeType = $('input[name="exchangeType"]').filter(":checked").val();
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
    function checkVirtualSrc(){
        if ($("#virtualSrcList").val() == "") {
            $("#virtualSrcList").addClass("errorC");
            $(".errorVirtualSrcListValue").html("*请选择数据源");
            $(".errorVirtualSrcListValue").css("display", "block");
            return true;
        }
        return false;
    }
    function checkVirtualTable($selector,data){
        var str = $selector.val();
        var checkArr = searchTableTree(str,data,"exact");
        if(checkArr.length <= 0){
            if($selector.selector == "#virtualTable"){
                $selector.addClass("errorC");
                $selector.siblings("small").html("*请选择正确的表");
                $selector.siblings("small").css("display", "block");
                return true;
            }
            // else{
            //     if ($("[name='exchangeType']").filter(":checked").val() == "SECURE" && $("#maskedDbSrcList").val() != ""){
            //         $selector.addClass("errorC");
            //         $selector.siblings("small").html("*请选择正确的表");
            //         $selector.siblings("small").css("display", "block");
            //         return true;
            //     }
            // }
        }
        return false;
    }
    function checkVirtualCol(){
        // var size = $("#realCol input[name='idsRealCol']:checked").size();
        // if (size == 0) {
        //     $(".errorRealCol").html("*请选择列");
        //     $(".errorRealCol").css("display", "block");
        //     return true;
        // } else {
        //     $(".errorRealCol").hide();
        //     return false;
        // }
        return false;
    }
    function checkVirtualUpdateInterval() {
        if ($("[name='virtualProvideType']").filter(":checked").val() == "PERIOD") {
            if ($("#virtualUpdateIntervalValue").val() == "") {
                $("#virtualUpdateIntervalValue").addClass("errorC");
                $(".errorVirtualUpdateIntervalValue").html("*请输入更新周期");
                $(".errorVirtualUpdateIntervalValue").css("display", "block");
                return true;
            } else if (!IntRegExp($("#virtualUpdateIntervalValue").val())) {
                $("#virtualUpdateIntervalValue").addClass("errorC");
                $(".errorVirtualUpdateIntervalValue").html("*更新周期必须为整数");
                $(".errorVirtualUpdateIntervalValue").css("display", "block");
                return true;
            }
        }
        return false;
    }
    $("#virtualUpdateIntervalValue").blur(function(){
        checkVirtualUpdateInterval();
    });
    function checkVirtualUrl(){
        var structUrl = $("#virtualStructUrl").val();
        if (structUrl == "") {
            $("#virtualStructUrl").addClass("errorC");
            $(".errorVirtualStructUrl").html("*请输入文件地址");
            $(".errorVirtualStructUrl").css("display", "block");
            return true;
        } else if (!normalUrlRegExp(structUrl)) {
            $("#virtualStructUrl").addClass("errorC");
            $(".errorVirtualStructUrl").html("*请输入正确格式的url,http(s)://域名(ip)(端口号)(路径)");
            $(".errorVirtualStructUrl").css("display", "block");
            return true;
        }else {
            $("#virtualStructUrl").removeClass("errorC");
            $(".errorVirtualStructUrl").hide();
            return false;
        }
    }
    function checkVirtualRelateSrc(){
        if (!$("#relateWrap").is(":hidden") && $("#relateSrcList").val() == "") {
            $("#relateSrcList").addClass("errorC");
            $(".errorRelateSrcList").html("*请选择数据类型").show();
            return true;
        }
        return false;
    }
    function checkFinalCol(){
        if ($("#virtualFinalTable").is(":hidden")){
            dmallError("请关联物理表");
            return true;
        }
    }
    function checkNameUniq($selector,errMsg){
        var str = $selector.val();
        var nameStr = getColumnData();
        var count = 0;
        var nameArr = [];
        if(nameStr == "[]"){
            return false;
        }else{
            nameArr = eval("(" + nameStr + ")");
        }
        for(var i=0;i<nameArr.length;i++){
            if(str == nameArr[i].alias){
                count ++;
            }
        }
        if(count <= 1){
            return false;
        }else{
            $selector.addClass("errorC");
            $selector.siblings("small").show().html(errMsg);
            return true;
        }
    }
    function checkRepeat($selector,nameArr){
        var str = $selector.val();
        var tag = false;
        for(var i=0;i<nameArr.length;i++){
            if(str == nameArr[i].alias){
                $selector.addClass("errorC");
                $selector.siblings("small").show().html("*字段名不允许重复");
                tag = true;
            }
        }
        return tag;
    }


    //数据项编号
    //应用系统变量
    var $appSystemCode = $('#appSystemCode');
    var appSystemCode = $appSystemCode.val();
    var $appSystemList = $('#appSystemList');
    var appSystemId = '';
    //数据表变量
    var $dataTableCode = $('#dataTableCode');
    var dataTableCode = $dataTableCode.val();
    var $dataTableList = $('#dataTableList');
    var dataTableId = '';
    //数据项变量
    var $dataItemCode = $('#dataItemCode');
    var dataItemCode = $dataItemCode.val();
    var $dataItemList = $('#dataItemList');
    var itemId = '';

    // $('#chooseDataTableItem').click(function () {
    //     //打开模态框
    //     $('#addDataTableItem').modal({backdrop: 'static', keyboard: false});
    //     $('#itemDataBtn').prop('disabled', true);
    //     //清空
    //     clearDataTableItem();
    //     //获取应用系统编号
    //     getAppSystemNo();
    // });

    //获取应用系统编号
    function getAppSystemNo(key) {
        $.get(
            rootPath+"/appsystems/systemList",
            {
                appSystemNo:key
            },
            function(data, status){
                if(data.result != "success"){
                    $appSystemList.html('<li class="list-group-item provideDept-in">没有数据！</li>');
                }else {
                    var list=data.list;
                    var html='';
                    for (var i = 0; i < list.length; i++){
                        html += '<li class="list-group-item provideDept-in" data-appSystemId="' + list[i].id + '" data-appSystemNo="' + list[i].appSystemNo + '">' + list[i].appSystemNo + '<p title="' + list[i].appSystemName + '">' + list[i].appSystemName + '</p></li>';
                    }
                    $appSystemList.html(html);
                }
            },
            "json"
        );
        $dataTableList.html('');
        $dataItemList.html('');
        $('#itemDataBtn').prop('disabled',true);
    }
    //查询
    $appSystemCode.keyup(function () {
        getAppSystemNo($(this).val());
    });
    //点击
    $appSystemList.on('click', 'li', function () {
        if ($(this).html() != '没有数据！'){
            $(this).addClass('provideDept-click').siblings().removeClass('provideDept-click');
            appSystemId = $(this).attr('data-appSystemId');
            appSystemCode = $(this).html();
            getDataTableCode(appSystemId,$('#dataTableCode').val());
            $('#itemDataBtn').prop('disabled', true);
        }
    });

    //获取数据表
    function getDataTableCode(id, key) {
        // $dataTableList.html('');
        $.get(
            rootPath+"/appsystems/tableList",
            {
                appSystemId:id,
                dataTableNo:key
            },
            function(data, status){
                if(data.result != "success"){
                    $dataTableList.html('<li class="list-group-item provideDept-in">没有数据！</li>');
                }else {
                    var list=data.list;
                    var html='';
                    for (var i = 0; i < list.length; i++){
                        html += '<li class="list-group-item provideDept-in" data-dataTableId="' + list[i].id + '" data-dataTableNo="' + list[i].dataTableNo + '">' + list[i].dataTableNo + '<p title="' + list[i].dataTableName + '">' + list[i].dataTableName + '</p></li>';
                    }
                    $dataTableList.html(html);
                }
            },
            "json"
        );
        $('#addTableItemNo').hide();
        $dataItemList.html('');
        $('#itemDataBtn').prop('disabled',true);
    }
    //查询
    $dataTableCode.keyup(function () {
        getDataTableCode(appSystemId, $(this).val());
    });
    //点击
    $dataTableList.on('click', 'li', function () {
        if ($(this).html() != '没有数据！'){
            $(this).addClass('provideDept-click').siblings().removeClass('provideDept-click');
            dataTableId = $(this).attr('data-dataTableId');
            dataTableCode = $(this).html();
            getDataItemCode(dataTableId,$('#dataItemCode').val());
            $('#itemDataBtn').prop('disabled', true);
            $('#addTableItemNo').show();
        }
    });

    // 获取数据项编号
    function getDataItemCode(id, key) {
        // $dataItemList.html('');
        $.get(
            rootPath+"/appsystems/tableItemList",
            {
                dataTableId:id,
                dataTableItemNo:key
            },
            function(data, status){
                if(data.result != "success"){
                    $dataItemList.html('<li class="list-group-item provideDept-in">没有数据！</li>');
                }else {
                    var list=data.list;
                    var html='';
                    for (var i = 0; i < list.length; i++){
                        html += '<li class="list-group-item provideDept-in" data-itemNo="' + list[i].itemNo + '">' + list[i].itemNo + '<p title="' + list[i].itemName + '">' + list[i].itemName + '</p></li>';
                    }
                    $dataItemList.html(html);
                }
            },
            "json"
        );
    }
    //查询
    $dataItemCode.keyup(function () {
        getDataItemCode(dataTableId, $(this).val());
    });
    //点击
    $dataItemList.on('click', 'li', function () {
        if ($(this).html() != '没有数据！'){
            $(this).addClass('provideDept-click').siblings().removeClass('provideDept-click');
            dataItemCode = $(this).attr('data-itemNo');
            itemId = $(this).attr('data-itemId');
            $('#itemDataBtn').prop('disabled', false);
        }
    });


    //清空数据项编号
    function clearDataTableItem() {
        $appSystemCode.val('');
        $dataTableCode.val('');
        $dataItemCode.val('');
        $dataTableList.html('');
        $dataItemList.html('');
        $('#dataTableItemNo').val('');
        $('.errorDataDirectoryItem').css('display', 'none');
        $('#confirmItemMappingBtn').attr('disabled', false);
    }


    //所属目录数据项编号
    // $('#chooseDataDirectoryItem').click(function () {
    //     //打开模态框
    //     $('#addDataDirectoryItem').modal({backdrop: 'static', keyboard: false});
    //     $('#confirmItemDataBtn').prop('disabled', true);
    //     //清空
    //     clearDataDirectoryItem();
    //     //获取数据项编号
    //     if(sessionStorage['directoryId'] == '0'){
    //         $('.errorItemCode').html('请选择正确的所属目录编号').css('display','block');
    //     }else{
    //         getConfirmItemCode(sessionStorage['directoryId']);
    //     }
    // });
    // var $dataDirectoryItemNo = $('#dataDirectoryItemNo');
    // var $dataDirectoryList = $('#dataDirectoryList');
    // var $dataDirectoryPageList = $('#dataDirectoryPageList');
    // $dataDirectoryItemNo.focus(function () {
    //     $('#confirmItemMappingBtn').attr('disabled', false);
    //     getPageConfirmItem(1, sessionStorage['directoryId'], $(this).val());
    // });
    // $dataDirectoryItemNo.keyup(function () {
    //     getPageConfirmItem(1, sessionStorage['directoryId'], $(this).val());
    // });
    // var confirmItemPageSize = 10;
    // function getPageConfirmItem(num, id, key){
    //     $.get(
    //         rootPath+"/directory/datadirectory_item_list",
    //         {
    //             id : id,
    //             itemNo : key
    //         },
    //         function(data, status){
    //             $dataDirectoryPageList.show();
    //             if(data.result != "success"){
    //                 $dataDirectoryList.html('请选择正确的所属目录编号!');
    //             }else {
    //                 var itemEntityList = data.itemEntityList;
    //                 $dataDirectoryList.html('');
    //                 if(itemEntityList.length != 0){
    //                     var list = [];
    //                     var pages = Math.ceil(itemEntityList.length/confirmItemPageSize);
    //                     var html='';
    //                     for (var i = 0; i < itemEntityList.length; i++){
    //                         if(i < num*confirmItemPageSize && i >= (num-1)*confirmItemPageSize){
    //                             list.push(itemEntityList[i]);
    //                         }
    //                     }
    //                     for(var j = 0; j < list.length; j++){
    //                         html += '<li class="list-group-item provideDept-in longText" data-confirmItemCode="' + list[j].itemNo + '" title="' + list[j].itemNo + ' ' +list[j].itemName +'">' + list[j].itemNo + ' ' +list[j].itemName +'</li>';
    //                     }
    //                     initDataDirectoryPage(num, pages);
    //                     $("#dataDirectoryPageNum").show();
    //                     $dataDirectoryList.html(html);
    //                 }else{
    //                     $dataDirectoryList.html('没有数据!');
    //                     $("#dataDirectoryPageNum").hide();
    //                 }
    //             }
    //         },
    //         "json"
    //     );
    // }
    // $dataDirectoryList.on('click','li', function () {
    //     $dataDirectoryItemNo.val($(this).attr('data-confirmItemCode'));
    //     $('#confirmItemMappingBtn').attr('disabled', false);
    //     $('.errorDataDirectoryItem').hide();
    //     $dataDirectoryPageList.hide();
    // });
    // function initDataDirectoryPage(pageNumber,totalPages, type) {
    //     $("#dataDirectoryPageNum").empty();
    //
    //     if (pageNumber == 1) {
    //         $("#dataDirectoryPageNum").append('<li class="disabled pageTag"><a>&lt;</a></li>');
    //     } else {
    //         $("#dataDirectoryPageNum").append('<li class="pageTag"><a>&lt;</a></li>');
    //         if (pageNumber >= 3 && totalPages >= 5) {
    //             $("#dataDirectoryPageNum").append('<li class="pageTag"><a>1</a></li>');
    //         }
    //     }
    //     if (pageNumber > 3 && totalPages > 5) {
    //         $("#dataDirectoryPageNum").append('<li class="pageTag"><a>...</a></li>');
    //     }
    //     if ((totalPages - pageNumber) < 2 && pageNumber > 2) {
    //         if ((totalPages == pageNumber) && pageNumber > 3) {
    //             $("#dataDirectoryPageNum").append('<li class="pageTag"><a>' + (parseInt(pageNumber) - 3) + '</a></li>');
    //         }
    //         $("#dataDirectoryPageNum").append('<li class="pageTag"><a>' + (parseInt(pageNumber) - 2) + '</a></li>');
    //     }
    //
    //     if (pageNumber > 1) {
    //         $("#dataDirectoryPageNum").append('<li class="pageTag"><a>' + (parseInt(pageNumber) - 1) + '</a></li>');
    //     }
    //     $("#dataDirectoryPageNum").append('<li class="active pageTag"><a>' + parseInt(pageNumber) + '</a></li>');
    //     if ((totalPages - pageNumber) >= 1) {
    //         $("#dataDirectoryPageNum").append('<li class="pageTag"><a>' + (parseInt(pageNumber) + 1) + '</a></li>');
    //     }
    //     if (pageNumber < 3) {
    //         if ((pageNumber + 2) < totalPages) {
    //             $("#dataDirectoryPageNum").append('<li class="pageTag"><a>' + (parseInt(pageNumber) + 2) + '</a></li>');
    //         }
    //         if ((pageNumber < 2) && ((pageNumber + 3) < totalPages)) {
    //             $("#dataDirectoryPageNum").append('<li class="pageTag"><a>' + (parseInt(pageNumber) + 3) + '</a></li>');
    //         }
    //     }
    //     if ((totalPages - pageNumber) >= 3 && totalPages > 5) {
    //         $("#dataDirectoryPageNum").append('<li class="pageTag"><a >...</a></li>');
    //     }
    //
    //     if (pageNumber == totalPages || type == "create") {
    //         $("#dataDirectoryPageNum").append('<li class="disabled pageTag"><a>&gt;</a></li>');
    //     } else {
    //         if ((totalPages - pageNumber) >= 2) {
    //             $("#dataDirectoryPageNum").append('<li class="pageTag"><a>' + totalPages + '</a></li>');
    //         }
    //         $("#dataDirectoryPageNum").append('<li class="pageTag"><a>&gt;</a></li>');
    //     }
    // }
    // // 点击下面的页码改变的页面数据
    // $("#dataDirectoryPageNum").on("click", ".pageTag", function () {
    //     if (!$(this).hasClass("disabled")) {
    //         var pageNumber = $(this).children("a").text();
    //         var active = parseInt($("#dataDirectoryPageNum li.active a").text());
    //         if (pageNumber != "<" && pageNumber != ">" && pageNumber!= '...') {
    //             getPageConfirmItem(parseInt(pageNumber), sessionStorage['directoryId'], $dataDirectoryItemNo.val());
    //         } else if (pageNumber == "<") {
    //             getPageConfirmItem(parseInt(active - 1), sessionStorage['directoryId'], $dataDirectoryItemNo.val());
    //         } else if (pageNumber == ">") {
    //             getPageConfirmItem(parseInt(active + 1), sessionStorage['directoryId'], $dataDirectoryItemNo.val());
    //         }
    //     }
    // });
    //
    // //获取数据项编号
    // var $confirmItemCode = $('#confirmItemCode');
    // var confirmItemCode = $confirmItemCode.val();
    // var $confirmItemList = $('#confirmItemList');
    // var confirmItemId = '';
    // function getConfirmItemCode(id, key) {
    //     $.get(
    //         rootPath+"/directory/datadirectory_item_list",
    //         {
    //             id : id,
    //             itemNo : key
    //         },
    //         function(data, status){
    //             if(data.result != "success"){
    //                 $confirmItemList.html('<li class="list-group-item">请选择正确的所属目录编号</li>');
    //             }else {
    //                 var itemEntityList = data.itemEntityList;
    //                 var html='';
    //                 for (var i = 0; i < itemEntityList.length; i++){
    //                     html += '<li class="list-group-item provideDept-in" data-confirmItemId="' + itemEntityList[i].id + '">' + itemEntityList[i].itemNo + '</li>';
    //                 }
    //                 $confirmItemList.html(html);
    //             }
    //         },
    //         "json"
    //     );
    // }
    // //查询
    // $confirmItemCode.keyup(function () {
    //     getConfirmItemCode(sessionStorage['directoryId'], $(this).val());
    // });
    // //点击
    // $confirmItemList.on('click', 'li', function () {
    //     $(this).addClass('provideDept-click').siblings().removeClass('provideDept-click');
    //     confirmItemId = $(this).attr('data-confirmItemId');
    //     confirmItemCode = $(this).html();
    //     $('#confirmItemDataBtn').prop('disabled', false);
    // });

    //数据项编号提交
    // $('#confirmItemDataBtn').click(function () {
    //     // if(checkDirectoryItemNoRepeat(confirmItemCode)){
    //     //     $('.errorDataDirectoryItem').css('display', 'block').html('所属目录数据项编号不能重复');
    //     //     return;
    //     // }
    //     $('#dataDirectoryItemNo').val(confirmItemCode);
    // });
    //清空
    function clearDataDirectoryItem() {
        $confirmItemCode.val('');
        $('#dataDirectoryItemNo').val('');
        $('.errorDataDirectoryItem').css('display', 'none');
        $('#confirmItemMappingBtn').attr('disabled', false);
        $dataDirectoryPageList.hide();
    }

    //添加数据资源与数据项映射
    var dataTableItemNo = '';
    var dataDirectoryItemNo = '';
    // $('#confirmItemMappingBtn').click(function () {
    //     var html = '';
    //     dataTableItemNo = $('#dataTableItemNo').val();
    //     dataDirectoryItemNo = $('#dataDirectoryItemNo').val();
    //     if(checkItemNo(dataTableItemNo, dataDirectoryItemNo)){
    //         $(this).attr('disabled', true);
    //     } else {
    //         html = '<tr class="newAdd"><td data-dataTableItemId="' + itemId +'">'+ dataTableItemNo +'</td><td data-dataDirectoryItemId="' + confirmItemId + '">'+ dataDirectoryItemNo +'</td><td><a href="#" class="removeItemMapping" style="font-size: 32px">×</a></td></tr>';
    //         $('#virtualTextTable').append(html);
    //     }
    // });
    //删除
    // $('#virtualTextTable').on('click', '.removeItemMapping', function () {
    //     $(this).parent().parent().remove();
    // });
    //清空

    //验证数据项编号重复
    // function checkItemNoRepeat(no){
    //     var itemArr = arr;
    //     for (var i=0; i < itemArr.length; i++){
    //         if (itemArr[i].dataTableItemNo == no){
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    //验证所属目录数据项编号重复
    // function checkDirectoryItemNoRepeat(no){
    //     var directoryItemArr = arr;
    //     for (var i=0; i < directoryItemArr.length; i++){
    //         if (directoryItemArr[i].dataDirectoryItemNo == no){
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    //验证数据项是否为空和重复

    // function checkItemBland(no1, no2) {
    //     if(no1 == '' && no2 == ''){
    //         $('.errorDataDirectoryItem').css('display', 'block').html('数据项和所属目录数据项编号不能都为空');
    //         return true;
    //     }else if(no2 != ''){
    //         var list = [];
    //         for(var j = 0; j < allDataDirectoryItemList.length; j++){
    //             list.push(allDataDirectoryItemList[j].itemNo);
    //         }
    //         if(list.indexOf(no2) == -1){
    //             $('.errorDataDirectoryItem').css('display', 'block').html('不存在该所属目录数据项编号');
    //             return true;
    //         }
    //     }
    //     var itemArr = itemMappingArr;
    //     if(no1 == '')no1 = '--';
    //     if(no2 == '')no2 = '--';
    //     for (var i=0; i < itemArr.length; i++){
    //         if (itemArr[i].dataTableItemNo == no1 && itemArr[i].dataDirectoryItemNo == no2){
    //             $('.errorDataDirectoryItem').css('display', 'block').html('数据项映射不能重复添加');
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    //验证数据项映射是否为空
   function checkDataTable() {
       var list = $('#virtualTextTable tr');
       if(list.length == 0){
           $('#addRepeat').css('display', 'block').children().html('数据项映射不能为空!');
           return true;
       }else if(isRemovedItem()){
           $('#addRepeat').css('display', 'block').children().html('有删除线的数据项已不存在，请删除！');
           return true;
       }
       return false;
    }
    //保存数据项映射
    function saveDataMapping() {
        var virtualArray = [];
        $("#virtualTextTable tr").each(function () {
            var virtualPara = new Object();
            virtualPara.dataTableItemNo = $(this).children('td').eq(0).children().html();
            virtualPara.dataDirectoryItemNo = $(this).children('td').eq(1).children().html();
            virtualArray.push(virtualPara);
        });
        $('#virtualTextTable').data('virtualArray', virtualArray);
    }
    //判断数据项映射数据项是否deleted
    function isRemovedItem() {
        var itemDeleted = $('#virtualTextTable').find('.itemDeleted');
        if(itemDeleted.length>0){
            return true;
        }
        return false;
    }

    //物理数据关联

    //是否关联
    $('#isRelation').on('click', 'input[name="relation"]', function () {
        var val = $(this).val();
        if(val == 0){
            $("#shelveButton").show();
            $("#newAndSubmitBtn").show();
            $('#relateWrap').hide();
            resourceTypeCode = 'VIRTUAL';
            $('#resourceTypeCode').val('VIRTUAL');
            getVirtualResData(resourceTypeCode);
        }else if(val == 1){
            $('#relateWrap').show();
            resourceTypeCode = $('#relateSrcList').val().toUpperCase();
            if(resourceTypeCode != ''){
                $('#resourceTypeCode').val(resourceTypeCode);
                getVirtualResData(resourceTypeCode);
            }
        }else {
            $('#relateWrap').show();
            $("#shelveButton").hide();
            $("#newAndSubmitBtn").hide();
        }
    });

    //拖动
    $('#classFieldTable').sortable(
        {
            axis: 'y', // 仅纵向拖动目的列
            cursor:'move'
        }
    );

    //载入到数据项映射表中
    function addItemMappingTable(type) {
        var list = itemMappingArr;
        var html = '';
        for (var i = 0; i < list.length; i++){
            if(list[i].dataTableItemNo == ''||list[i].dataTableItemNo == '--'){
                html += '<tr><td>--</td><td><a href="#" class="toDataItemDetail">' + list[i].dataDirectoryItemNo + '</a></td></tr>';
            }else if(list[i].dataDirectoryItemNo == ''||list[i].dataDirectoryItemNo == '--'){
                html += '<tr><td><a href="#" class="toDataItemDetail">' + list[i].dataTableItemNo + '</a></td><td>--</td></tr>';
            }else {
                html += '<tr><td><a href="#" class="toDataItemDetail">' + list[i].dataTableItemNo + '</a></td><td><a href="#" class="toDataItemDetail">' + list[i].dataDirectoryItemNo + '</a></td></tr>';
            }
        }
        $('#itemMappingTable').html(html);
        var createType = $('#createType').val();

        var finalHtml = [];
        for(var k = 0; k < list.length; k++){
            if(list[k].dbColumn == '' || list[k].dbColumn == undefined)list[k].dbColumn = '--';
            if(list[k].dbColumnType == '' || list[k].dbColumnType == undefined)list[k].dbColumnType = '--';
            if(list[k].dbColumnDesc == ''||list[k].dbColumnDesc == '--'||list[k].dbColumnDesc == undefined)list[k].dbColumnDesc = '';
            if(list[k].dataTableItemNo == ''){
                finalHtml.push('<tr><td>--</td><td><a href="#" class="toDataItemDetail">'+ list[k].dataDirectoryItemNo +'</a></td><td>'+ list[k].dbColumn +'</td><td>'+ list[k].dbColumnType +'</td><td>'+ list[k].dbColumnDesc +'</td></tr>');
            }else if(list[k].dataDirectoryItemNo == ''){
                finalHtml.push('<tr><td><a href="#" class="toDataItemDetail">'+ list[k].dataTableItemNo +'</a></td><td>--</td><td>'+ list[k].dbColumn +'</td><td>'+ list[k].dbColumnType +'</td><td>'+ list[k].dbColumnDesc +'</td></tr>');
            }else {
                finalHtml.push('<tr><td><a href="#" class="toDataItemDetail">'+ list[k].dataTableItemNo +'</a></td><td><a href="#" class="toDataItemDetail">'+ list[k].dataDirectoryItemNo +'</a></td><td>'+ list[k].dbColumn +'</td><td>'+ list[k].dbColumnType +'</td><td>'+ list[k].dbColumnDesc +'</td></tr>') ;
            }
        }

        $('#relationFinalTable').html(finalHtml.join(''));

        newFinalTableList = [];
        $('#relationFinalTable tr').each(function () {
            var newObj = {};
            newObj['dataTableItemNo'] = $(this).children('td').eq(0).html();
            newObj['dataDirectoryItemNo'] = $(this).children('td').eq(1).html();
            newObj['dbColumn'] = $(this).children('td').eq(2).html();
            newObj['dbColumnType'] = $(this).children('td').eq(3).html();
            newFinalTableList.push(newObj);
        });
    }

    //集群拆分字段非空验证
    function checkSplitPKList(splitPk) {
        if(splitPk == '请选择'){
            $('.errorVirtualSplitPkList').css('display', 'block').html('请选择集群拆分字段');
            return true;
        }
        return false;
    }
    //
    $('#virtualSplitPkList').change(function () {
        $('.errorVirtualSplitPkList').css('display', 'none').html('');
    });
}

//验证是否关联物理数据
var oldFinalTableList = [];
var newFinalTableList = [];
function checkExchangeItem() {
    if($('#resourceTypeCode').val() == 'VIRTUAL'){
        return false;
    }else{
        var isSame = false;
        var list = [];
        var oldList = [];
        $('#relationFinalTable tr').each(function () {
            var dataTableItemNo = $(this).children('td').eq(0).html();
            var dataDirectoryItemNo = $(this).children('td').eq(1).html();
            var dbColumn = $(this).children('td').eq(2).html();
            list.push(dataTableItemNo+dataDirectoryItemNo+dbColumn);
        });
        for(var i = 0; i < oldFinalTableList.length; i++){
            oldList.push(oldFinalTableList[i].dataTableItemNo+oldFinalTableList[i].dataDirectoryItemNo+oldFinalTableList[i].dbColumn);
        }
        for(var j =0; j < list.length; j++){
            if(oldList.indexOf(list[j]) == -1){
                isSame = true;
                j = list.length;
            }
        }
        if(isSame == true){
            $('.notifications').empty();
            dmallError('数据项映射变化，请重新关联物理数据');
            $("#shelveButton").attr('disabled', true);
            $("#newAndSubmitBtn").attr('disabled', true);
        }
        return isSame;
    }
    return false;

}
$('#confirmBtn').click(function () {
    var type = $("#relateSrcList").val();
    initRealCol(type,"new");
    $("#relateModal").modal({backdrop: 'static', keyboard: false});
    $("#shelveButton").attr('disabled', false);
    $("#newAndSubmitBtn").attr('disabled', false);
});


//创建应用系统
$('#addAppSystem').click(function () {
    //打开模态框
    $('#createAppSystem').modal({backdrop: 'static', keyboard: false});
    clearAllAppSystem();
});

function clearAllAppSystem() {
    $('#appSystemNo').val('A-'+ $('#deptCode').val() +'-ZNB-00001');
    $('#appRoutinePowerDeptCode').val($('#deptCode').val());
    $('#appRoutinePowerDeptCodeName').val($('#deptName').val());
    $('#appProvideDeptName').val('');
    $('#onlineDate').css({
        width: '369px',
        marginLeft: '15px'
    });
    $('#offlineDate').css({
        width: '369px',
        marginLeft: '15px'
    });

    $('#appSystemNo').val('A-'+ $('#deptCode').val() +'-ZNB-00001');
    $('#appSystemName').val('');
    $('#appSystemDesc').val('');
    $('#contractorName').val('');
    $('#databaseTypeCodes').html('');
    $('#databaseProductDesc').val('');
    $('#appIndustryCode').val('ZNB');
    $('#appSystemTypeCode').val('1');
    $('#useFlag').val('1');
    $('#accessAddress').val('');
    $('#appProvideDeptName').val('');
    $('#onlineDate').val('');
    $('#offlineDate').val('');
    $('#offlineDateDivDef').removeProp('hidden');
    $('#offlineDateDiv').prop('hidden', 'hidden');
    typeCodes = '';
    getDatabaseTypes();
    $('#list-typeCode-selected').empty();
    $('#createAppSystem small').hide();
    $('#createAppSystem input').removeClass('border-red').removeClass('errorC');
    $('#createAppSystem textarea').removeClass('border-red');
}
function getAppSystemTypeCodes() {
    $.get(
        rootPath+"/appsystems/getAppSystemTypeCodes",
        {},
        function(data, status){
            if(data.result != "success"){
                dmallError(data.result);
            }else {
                var list = data.appSystemTypeCodeList;
                var html = '';
                for(var i = 0; i < list.length; i++){
                    html += '<option value="' + list[i].code + '">' + list[i].code + '&nbsp;&nbsp;'+ list[i].name + '</option>';
                }
                $('#appSystemTypeCode').html(html);
            }
        },
        "json"
    );
}
getAppSystemTypeCodes();
var $appProvideDeptTree;
$('#chooseAppProvideDept').click(function () {
    $.get(rootPath + "/organ/organCodes/tree", {},
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                $appProvideDeptTree = $('#list-appProvideDept').treeview({
                    data: data.organCodeList,
                    onNodeSelected: function (event, node) {
                        $('#appProvideDeptName').data("appProvideDeptCode", node.code);
                        $('#appProvideDeptName').data("appProvideDeptName", node.text);
                    }
                });
                var list = $('#list-provideDept').children().children();
            } else {
                dmallError("获取数据资源提供单位列表失败");
            }
        },
        "json"
    );
});
$('#chooseDatabaseTypeCode').click(function () {
    getDatabaseTypes();
});
function getDatabaseTypes() {
    $.get(rootPath + "/code/databaseTypes", {},
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                var list = data.databaseTypeCodeList;
                var html = '';
                for(var i = 0; i < list.length; i++){
                    html += '<li class="list-group-item share-in" data-shareDeptCode="'+list[i].code+'">'+list[i].name+'</li>';
                }
                $('#list-typeCode').html(html);
                if(typeCodes){
                    var typeCode = typeCodes.split(',');
                    $('#list-typeCode li').each(function () {
                        if(typeCode.indexOf($(this).attr('data-shareDeptCode')) != -1){
                            $(this).remove();
                        }
                    });
                }
            } else {
                dmallError("获取数据资源提供单位列表失败");
            }
        },
        "json"
    );
}
//提交
var preventDefaultFlag = false;
$('#btn_catalogCreateInfo').click(function () {
    preventDefaultFlag = false;
    createAppSystemCheckAll();
    if(preventDefaultFlag==true)
    {
        return false;
    }
    else {
        var arr = $('#onlineDate').val().split("-");
        var online = new Date(arr[0], parseInt(arr[1])-1, arr[2]);
        var appSystem = {
            "appSystemNo": $('#appSystemNo').val(),
            "appSystemName": $('#appSystemName').val(),
            "appSystemDesc": $('#appSystemDesc').val(),
            "routinePowerDeptCode": $('#deptCode').val(),
            "contractorName": $('#contractorName').val(),
            "onlineDate": online,
            "databaseTypeCode": typeCodes,
            "databaseProductDesc": $('#databaseProductDesc').val(),
            "industryCode": $('#industryCode').val(),
            "appSystemTypeCode": $('#appSystemTypeCode option:selected').val(),
            "useFlag": $('#useFlag option:selected').val(),
            "accessAddress": $('#accessAddress').val(),
            "registerDeptCode": $('#provideDeptCode').val()
        }

        if ($('#useFlag option:selected').val() == 0 && !isEmpty($('#offlineDate').val())) {
            arr = $('#offlineDate').val().split("-");
            var offline = new Date(arr[0], parseInt(arr[1])-1, arr[2]);
            appSystem.offlineDate = offline;
        }

        $.ajax({
            type: "post",
            url: rootPath+"/appsystems",
            data: appSystem,
            dataType: "json",
            //contentType: 'application/json;charset=utf-8',
            success: function (data) {
                if (data.result == "success") {
                    getAppSystemNo();
                    $('#dataTableList').empty();
                    $('#dataItemList').empty();
                    $('#createAppSystem').modal('hide');
                } else {
                    dmallError(data.result);
                }
            },
            error: function () {
                dmallAjaxError();
                $("#btn_commitCreateInfo").attr('disabled', false);
            }
        })
    }
});

//创建应用系统数据表
$('#addDataTable').click(function () {
    $('#btn_catalogAddDataTableItem').hide();
    $('#btn_catalogCreateDataTable').show();
    //打开模态框
    $('#createDataTable').modal({backdrop: 'static', keyboard: false});
    clearAllDataTable();
});
function clearAllDataTable() {
    $('#dataTableNo').attr('readonly',false);
    $('#dataTableName').attr('readonly',false);
    $('#dataTableDesc').attr('readonly',false);
    $('#dataTableRemark').attr('readonly',false);
    $('#chooseAppSystemNum').attr('disabled',false);
    $('#dataTableUpdateCycleCode').attr('disabled',false);
    $('#dataTableUpdateModeCode').attr('disabled',false);
    $('#tableUseTypeCode').attr('disabled',false);
    $('#dicTypeCode').attr('disabled',false);

    $('#dataTableNo').val('');
    $('#dataTableAppSystemNo').val('');
    $('#dataTableName').val('');
    $('#dataTableDesc').val('');
    $('#dataTableUpdateCycleCode').val('GXZQ_BDS');
    $('#dataTableUpdateModeCode').val('GXFS_ZD');
    $('#dataTableRemark').val('');
    $('#tableUseTypeCode').val('TABLE_YWB');
    $('#dicTypeCodeDiv').removeProp('hidden');
    $('#dicTypeCodeDivDef').prop('hidden', 'hidden');
    $('#listTable tbody').empty();
    $('#createDataTable small').hide();
    $('#createDataTable input').removeClass('errorC').removeClass('border-red');
    $('#createDataTable textarea').removeClass('errorC').removeClass('border-red');
    initPage(1);
    dataTableArr = [];
}
//获取数据表用途分类代码
function getTableUseTypeCodes() {
    $.get(
        rootPath+"/appsystems/getTableUseTypeCodes",
        {},
        function(data, status){
            if(data.result != "success"){
                dmallError(data.result);
            }else {
                var list = data.tableUseTypeCodeList;
                var html = '';
                for(var i = 0; i < list.length; i++){
                    html += '<option value="' + list[i].code + '">' + list[i].code + '&nbsp;&nbsp;'+ list[i].name + '</option>';
                }
                $('#tableUseTypeCode').html(html);
            }
        },
        "json"
    );
}
getTableUseTypeCodes();
//获取数据表用途分类代码
function getDictionaryTypeCodes() {
    $.get(
        rootPath+"/appsystems/getDictionaryTypeCodes",
        {},
        function(data, status){
            if(data.result != "success"){
                dmallError(data.result);
            }else {
                var list = data.dictionaryTypeCodeList;
                var html = '';
                for(var i = 0; i < list.length; i++){
                    html += '<option value="' + list[i].code + '">' + list[i].code + '&nbsp;&nbsp;'+ list[i].name + '</option>';
                }
                $('#dicTypeCode').html(html);
            }
        },
        "json"
    );
}
getDictionaryTypeCodes();
//保存
$('#btn_catalogCreateDataTable').click(function () {

    dataTableDefaultFlag =false;
    createDataTableCheckAll();
    if(dataTableDefaultFlag) {
        return false;
    } else {

        var dataTable = {
            "dataTableNo": $('#dataTableNo').val(),
            "dataTableName": $('#dataTableName').val(),
            "dataTableDesc": $('#dataTableDesc').val(),
            "updateCycleCode": $('#dataTableUpdateCycleCode option:selected').val(),
            "dataTableRemark": $('#dataTableRemark').val(),
            "tableUseTypeCode": $('#tableUseTypeCode option:selected').val(),
            "appSystemId": $('#dataTableAppSystemId').val()
        }
        if (dataTable.updateCycleCode != "GXZQ_BGX") {
            dataTable.updateModeCode = $('#dataTableUpdateModeCode option:selected').val();
        }
        if (dataTable.tableUseTypeCode == "TABLE_ZDB") {
            dataTable.dicTypeCode = $('#dicTypeCode option:selected').val();
        }
        var datTableItemList = dataTableArr;
        $.ajax({
            type: "post",
            url: rootPath+"/appsystems/datatables",
            data: {"dataTableEntity":JSON.stringify(dataTable), "dataTableItemList":JSON.stringify(datTableItemList)},
            dataType: "json",
            //contentType: 'application/json;charset=utf-8',
            success: function (data) {
                if (data.result == "success") {
                    var selectApp = $('#appSystemList').children('.provideDept-click');
                    if(selectApp.length != 0){
                        getDataTableCode(selectApp.attr('data-appSystemid'));
                        $('#dataItemList').empty();
                    }
                    $('#createDataTable').modal('hide');
                } else {
                    dmallError(data.result);
                }
            },
            error: function () {
                dmallAjaxError();
                $("#btn_commitCreateInfo").attr('disabled', false);
            }
        });
    }
});
//添加应用系统数据表数据项
$('#addTableItemNo').click(function () {
    var dataTableNo = $('#dataTableList').children('.provideDept-click').attr('data-dataTableNo');
    if(dataTableNo){
        $('#btn_catalogAddDataTableItem').show();
        $('#btn_catalogCreateDataTable').hide();
        //打开模态框
        $('#createDataTable').modal({backdrop: 'static', keyboard: false});
        clearAllDataTable();
        initDataTable(dataTableNo);
    }
});
var dataTableBasic;
function initDataTable(dataTableNo) {
    $('#dataTableNo').attr('readonly',true);
    $('#dataTableName').attr('readonly',true);
    $('#dataTableDesc').attr('readonly',true);
    $('#dataTableRemark').attr('readonly',true);
    $('#chooseAppSystemNum').attr('disabled',true);
    $('#dataTableUpdateCycleCode').attr('disabled',true);
    $('#dataTableUpdateModeCode').attr('disabled',true);
    $('#tableUseTypeCode').attr('disabled',true);
    $('#dicTypeCode').attr('disabled',true);
    deleteArr=[];
    $.get(
        rootPath+"/appsystems/datatable",
        {
            dataTableNo:dataTableNo
        },
        function(data, status){
            if(data.result != "success"){
                dmallError(data.result);
            }else {
                dataTableBasic = data.dataTableEntity;
                $('#dataTableNo').val(dataTableBasic.dataTableNo);
                var arr = dataTableBasic.dataTableNo.split('-');
                arr.pop();
                $('#dataTableAppSystemNo').val(arr.join('-'));
                $('#dataTableName').val(dataTableBasic.dataTableName);
                $('#dataTableDesc').val(dataTableBasic.dataTableDesc);
                $('#dataTableRemark').val(dataTableBasic.dataTableRemark);
                $('#dataTableUpdateCycleCode').val(dataTableBasic.updateCycleCode);
                if(dataTableBasic.updateCycleCode == 'GXZQ_BGX'){
                    $('#updateModeCodeDiv').removeProp('hidden');
                    $('#updateModeCodeDivDef').prop('hidden', 'hidden');
                }else{
                    $('#updateModeCodeDivDef').removeProp('hidden');
                    $('#updateModeCodeDiv').prop('hidden', 'hidden');
                    $('#dataTableUpdateModeCode').val(dataTableBasic.updateModeCode);
                }
                $('#tableUseTypeCode').val(dataTableBasic.tableUseTypeCode);
                if(dataTableBasic.tableUseTypeCode == 'TABLE_ZDB'){
                    $('#dicTypeCodeDivDef').removeProp('hidden');
                    $('#dicTypeCodeDiv').prop('hidden', 'hidden');
                    $('#dicTypeCode').val(dataTableBasic.dicTypeCode);
                }else{
                    $('#dicTypeCodeDiv').removeProp('hidden');
                    $('#dicTypeCodeDivDef').prop('hidden', 'hidden');
                }
                dataTableArr = data.dataTableItemList;
                if(dataTableArr.length !=0){
                    catalogTurnToPage(1);
                }
            }
        },
        "json"
    );
}
//修改保存
var deleteArr = [];
$('#btn_catalogAddDataTableItem').click(function () {
    var dataTable = dataTableBasic;
    for(var i = 0; i < dataTableArr.length; i++){
        dataTableArr[i].dataTableId = dataTable.id;
    }
    var datTableItemList = dataTableArr.concat(deleteArr);
    $.ajax({
        type: "post",
        url: rootPath+"/appsystems/datatables",
        data: {"dataTableEntity":JSON.stringify(dataTable), "dataTableItemList":JSON.stringify(datTableItemList)},
        dataType: "json",
        //contentType: 'application/json;charset=utf-8',
        success: function (data) {
            if (data.result == "success") {
                getDataItemCode(dataTable.id,$('#dataItemCode').val());
                $('#createDataTable').modal('hide');
            } else {
                dmallError(data.result);
            }
        },
        error: function () {
            dmallAjaxError();
            $("#btn_commitCreateInfo").attr('disabled', false);
        }
    });
});

