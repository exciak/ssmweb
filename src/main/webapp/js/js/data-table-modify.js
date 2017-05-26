//检查数据表编号标志
var drawMetaTreeData;
var $metaDataTree;
var preventDefaultFlag = true;
var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];
var rootPath = "http://" + window.location.host + "/" + proName;
var treeSearch = function (tree) {
    var treedata;
    //if (pre == 'subject') treedata = subjectTreeData;
    treedata = drawMetaTreeData;
    drawTree(treedata);
    var search = $('#appSystemCode').val();
    var pattern = toEscStr(search);
    var selectableNodes = tree.treeview('search', [pattern, {ignoreCase: false, exactMatch: false}]);
    if (search) {
        if (selectableNodes.length > 0) {
            var Nodes = [];
            for (var i = 0; i < selectableNodes.length; i++) {
                var node = selectableNodes[i];
                delete node.state;
                if (node.nodes) delete node.nodes;
                Nodes.push(node);
            }
        }
        tree = drawTree(Nodes);
    } else {
        var treedata;
        treedata = drawMetaTreeData;
        tree = drawTree(treedata)
    }
};
$('#appSystemCode').keyup(function () {
    treeSearch($metaDataTree);

});
function drawTree(treeData) {
    var tree = $('#appSystemList').treeview({
        data: treeData,
        levels: 1,
        searchResultColor: "black",
        selectedBackColor: "#C7E7FE",
        selectedColor: "#55A0FE",
        onNodeSelected: function (event, node) {
            if(node.resourceTypeName != "Category"){
                var $metaList = $("#appSystemCode");
                $metaList.data("metaName", node.text);
                $metaList.data("metacode", node.code);
                $metaList.data("catecode", node.parent_code);
                $metaList.val($metaList.data("metaName"));
                $("#appSystemCode").removeClass("border-red");
                $(".error19").html("");
                // $("#appSystemList").hide();
            }else{
                dmallError("只能选择数据元，类目不可选");
            }
        },
        onNodeUnselected: function (event, node) {
            metaTag = 1;
        }
    });

    return tree;
}

    var momentArr = [];
    var deleteArr = [];
    $("#btn_create").click(function () {

        $("#inputNo").removeClass("border-red");
        $('.error5').hide();
        $("#inputName").removeClass("border-red");
        $('.error6').hide();
        $("#inputDataContent").removeClass("border-red");
        $('.error7').hide();
        $("#inputDatalength").removeClass("border-red");
        $('.error8').hide();
        $("#inputDescription").removeClass("border-red");
        $('.error17').hide();

        //模态框显示，同时清空input里面的val；
        $('#dataTableItemNo').text($('#dataTableNo').val() + "-")
        $('#createModal').modal({backdrop: 'static', keyboard: false});
        $("#inputNo").val("");
        $("#inputName").val("");
        $("#inputDataType").val(" ");
        $("#inputDataContent").val("");
        $("#inputDatalength").val("");
        $("#inputDescription").val("");
        $("#inputIsDicItem").val(0);
        $('#isFlag').prop("hidden", true);
        $('#inputDataTableNo').val($('#dataTableNo').val());
        $("#inputDicDataTableNo").val("");
        $("#inputDicCodeItemNo").val("");
        $('#chooseDicCodeItemNo').prop("disabled", "disabled");
        $("#inputDicDescItemNo").val("");
        $('#chooseDicDescItemNo').prop("disabled", "disabled");
        $("#inputLhDicItemNo").val("");
        $('#chooseLhDicItemNo').prop("disabled", "disabled");
        $("#inputLhDicGroupCode").val("");

        $('#isDIC_LH').prop("hidden", "hidden");
    });

    // 当前页面里面的tr数据添加到数组arr中
    var pageArr = $("#listTable tbody tr");
    //ole.log(pageArr);
    //console.log(pageArr.eq(0).find("td").eq(0).text());
    for(var i = 0;i < pageArr.length;i++){
        var pageArrInputNum = pageArr.eq(i).find("td").eq(0).text();
        var pageArrInputName = pageArr.eq(i).find("td").eq(1).text();
        var pageArrInputDataType = pageArr.eq(i).find("td").eq(2).text();
        var pageArrInputDataContent = pageArr.eq(i).find("td").eq(3).text();
        var pageArrInputDatalength = pageArr.eq(i).find("td").eq(4).text();
        var pageArrInputDescription = pageArr.eq(i).find("td").eq(5).text();
        var pageArrInputIsDicItem = pageArr.eq(i).find("td").eq(6).text();
        var pageArrInputDataTableNo = pageArr.eq(i).find("td").eq(7).text();
        var pageArrInputDicDataTableNo = pageArr.eq(i).find("td").eq(8).text();
        var pageArrInputDicCodeItemNo = pageArr.eq(i).find("td").eq(9).text();
        var pageArrInputDicDescItemNo = pageArr.eq(i).find("td").eq(10).text();
        var pageArrInputLhDicItemNo = pageArr.eq(i).find("td").eq(11).text();
        var pageArrInputLhDicGroupCode = pageArr.eq(i).find("td").eq(12).text();
        var pageArrItemId = pageArr.eq(i).find("td").eq(13).text();
        // if(pageArrInputDescription == "" || pageArrInputDescription == null){pageArrInputDescription = "--";}
        // if(pageArrInputDatalength == "" || pageArrInputDatalength == null){pageArrInputDatalength = "--";}
        var pageArrObj = {
            id:pageArrItemId,
            itemNo:pageArrInputNum,
            itemName:pageArrInputName,
            dataItemFormatCode:pageArrInputDataType,
            metadataCode:pageArrInputDataContent,
            itemLength:pageArrInputDatalength,
            itemDesc:pageArrInputDescription,
            isDicItem:pageArrInputIsDicItem,
            dataTableNo:pageArrInputDataTableNo,
            dicDataTableNo:pageArrInputDicDataTableNo,
            dicCodeItemNo:pageArrInputDicCodeItemNo,
            dicDescItemNo:pageArrInputDicDescItemNo,
            lhDicItemNo:pageArrInputLhDicItemNo,
            lhDicGroupCode:pageArrInputLhDicGroupCode,
            active_flag:true,
            dataTableId:$("#dataTableId").val()
        };
        momentArr.push(pageArrObj);
    }
    var pageArrActive = parseInt($("#pageTag li.active a").text());
    initPage(1);
    turnToPage(1);


    //数据元标识符部分
    var pathname = window.location.pathname;
    var prjName;
    var arrOther = pathname.split("/");
    prjName = arrOther[1];

function viewMeta(obj){
    $(obj).removeAttr('onclick');

    var metacode = $(obj).text();
    console.log(obj);
    console.log(metacode);
    // var catecode = $.trim( $(obj).parent().next().text() );
    $("#viewMetaModal").data("metacode",metacode);
    // $("#viewMetaModal").data("catecode",catecode);
    $.get("/" + prjName + "/metadata/detail",
        {
            metaCode:metacode
            // cateCode:catecode
        },function(data,status){
            $(obj).attr('onclick', 'viewMeta(this);');
            if(data.result != "success"){
                dmallError(data.result);
                $("#viewMetaModal").modal("hide");
            }else{
                var meta_data = eval("(" + data.metadata + ")");
                if(meta_data.message != "success"){
                    dmallError(meta_data.message);
                }else{
                    $("#viewMetaModal").modal({backdrop:'static', keyboard: false});
                    $("#metaDetail div").remove();
                    var metadata = meta_data.data.result.attrDetailMap;
                    for(var i in metadata) {
                        if(i == 'categories'){
                            i = '所属类目';
                        }
                        var htmlStr = '';
                        htmlStr += '<div style="width:100%"><h5 style="color: #00B4DF"><strong>' + i + '</strong></h5><table style="border-bottom:0" class="table" width="100%">' +
                            '<thead><tr><td style="width:12%"></td><td style="width:20%"></td><td style="width:2%"></td><td style="width:12%"></td>' +
                            '<td style="width:20%"></td><td style="width:2%"></td><td style="width:12%"></td><td style="width:20%"></td></tr></thead>';
                        if(i == '所属类目'){
                            i = 'categories';
                        }
                        var num = 0;
                        var detail = metadata[i];
                        for (var j in detail) {
                            var qName = '';
                            // console.log(j);
                            if(i == 'categories'){
                                $("#viewMetaModal").data("catecode",j);
                                qName = data.qname+":";
                            }else{
                                qName = j;
                            }
                            if (num % 3 == 0) {
                                htmlStr += '<tr>';
                            }
                            htmlStr += '<th class="text-left">' + qName + '</th><td class="text-left"><span>' + detail[j] + '</span></td>';
                            if (num % 3 != 2) {
                                htmlStr += '<td style="border:0"></td>';
                            }
                            if (num % 3 == 2) {
                                htmlStr += '</tr>';
                            }
                            num++;
                        }
                        if (i == "表示类") {
                            if (num % 3 == 0) {
                                htmlStr += '<tr>';
                            }
                            htmlStr += '<th class="text-left">值域:</th><td class="text-left">' +
                                '<a href="javascript:void(0)" onclick="viewValueRange()" class="fa fa-file-text-o text-primary oper-icon-2"></a></td><td style="border:0"></td>';
                            if (num % 3 == 2) {
                                htmlStr += '</tr>';
                            }
                            num++;
                        }
                        if (num % 3 != 0) {
                            htmlStr += '</tr>';
                        }
                        htmlStr += '</table></div>';
                        $("#metaDetail").append(htmlStr);
                    }
                    // var htmlStr1 = '<div style="width:100%"><h5 style="color: #00B4DF"><strong>所属类目</strong></h5><table style="border-bottom:0" class="table">'+
                    //     '<thead><tr><td style="width: 100%"></td></tr></thead>'
                    // var metacate = data.name;
                    // console.log(data);
                    // console.log(metacate);
                    // var cate = metacate.split(".").join(" > ").replace(">","：");
                    // htmlStr1 += '<tr><td class="text-left">' + cate + '</td></tr></table></div>';
                    // $("#metaDetail").append(htmlStr1);
                }
            }
        },"json");
}

function viewValueRange(){
    $('#viewMetaModal').modal('hide');
    $('#viewValueRangeModal').modal('hide');
    $('#viewValueRangeModal').modal({backdrop: 'static', keyboard: false});
    $("#valueRangeTable tr:not(:first)").remove();
    var metacode = $("#viewMetaModal").data("metacode");
    var catecode = $("#viewMetaModal").data("catecode");
    $.get("/" + prjName + "/metadata/value_range",
        {
            metaCode:metacode,
            cateCode:catecode
        },
        function(data,status){
            if(data.result != "success"){
                dmallError(data.result);
            }else{
                var vrList=data.valueRange.list;
                if(vrList.length != 0) {
                    var trHTML = '<tbody id="valueRange">';
                    for (var j = 0; j < vrList.length; j++) {
                        if(vrList[j].rule != undefined){
                            trHTML += '<tr><td>' + parseInt(j+1) + '</td><td>' + vrList[j].name + '</td><td>' + vrList[j].code + '</td><td>' + vrList[j].rule + '</td></tr>';
                        }else{
                            trHTML += '<tr><td>' + parseInt(j+1) + '</td><td>' + vrList[j].name + '</td><td>' + vrList[j].code + '</td><td></td></tr>';
                        }
                    }
                    trHTML += '</tbody>';
                }else{
                    var trHTML = '<tfoot><tr><td>该数据元没有值域</td></tr></tfoot>';
                }
                $("#valueRangeTable").append(trHTML);
            }
        },"json");
}

    function modal_close(){
        $('#viewValueRangeModal').hide();
        $('#viewValueRangeModal').modal('hide');
        $('#viewMetaModal').modal({backdrop: 'static', keyboard: false});
    }
    function first_modal_close() {
        $('#viewMetaModal').modal('hide');
    }
        //创建添加到DOM树
    $("#btn-submit").click(function () {
        preventDefaultFlag = false;

        createItemcheck();

        if (preventDefaultFlag) {
            return false;
        } else {
            var inputNo = $("#inputNo").val();
            var inputName = $("#inputName").val();
            var inputDataType = $("#inputDataType option:selected").val();
            var inputDataContent = $("#inputDataContent").val();
            var inputDatalength = $("#inputDatalength").val();
            var inputDescription = $("#inputDescription").val();
            var inputIsDicItem = $("#inputIsDicItem option:selected").val();
            var totalPages;

            if (momentArr.length % 10 == 0) {
                totalPages = momentArr.length / 10;
            } else {
                totalPages = parseInt(momentArr.length / 10) + 1;
            }
            if (momentArr.length % 10 == 0) {
                initPage(totalPages + 1, "create");
                $("#listTable tbody tr").hide();
                turnToPage(totalPages + 1);
            } else {
                turnToPage(totalPages);
            }
            // if (inputDescription == "" || inputDescription == null) {
            //     inputDescription = "--";
            // }
            // if (inputDatalength == "" || inputDatalength == null) {
            //     inputDatalength = "--";
            // }
            var obj = {
                itemNo: $("#dataTableNo").val() + '-' + inputNo,
                itemName: inputName,
                dataItemFormatCode: inputDataType,
                metadataCode: inputDataContent,
                itemLength: inputDatalength,
                itemDesc: inputDescription,
                dataTableId: $("#dataTableId").val(),
                dataTableNo: $("#inputDataTableNo").val()
            };


            if (inputIsDicItem == 1) {

                $("#listTable tbody").append('<tr style="">' +
                    '<td>' + $("#dataTableNo").val() + '-' + inputNo + '</td>' +
                    '<td class="longText" title="'+htmlEncode(inputName)+'">' + htmlEncode(inputName) + '</td>' +
                    '<td>' + inputDataType + '</td>' +
                    "<td><a href='javascript:void(0)' onclick='viewMeta(this)'>" + inputDataContent + "</a></td>" +
                    '<td>' + inputDatalength + '</td>' +
                    '<td class="longText" title="'+htmlEncode(inputDescription)+'">' + htmlEncode(inputDescription) + '</td>' +
                    '<td hidden="true">' + true + '</td>' +
                    '<td hidden="true">' + $("#inputDataTableNo").val() + '</td>' +
                    '<td hidden="true">' + $("#inputDicDataTableNo").val() + '</td>' +
                    '<td hidden="true">' + $("#inputDicCodeItemNo").val() + '</td>' +
                    '<td hidden="true">' + $("#inputDicDescItemNo").val() + '</td>' +
                    '<td hidden="true">' + $("#inputLhDicItemNo").val() + '</td>' +
                    '<td hidden="true">' + htmlEncode($("#inputLhDicGroupCode").val()) + '</td>' +
                    '<td class="td-modify"><a id="btn-modify"><em class="fa fa-edit"></em></a></td>' +
                    '<td class="deleteBtn"><a><em class="fa fa-times-circle"></em></a></td>' +
                    '</tr>');
                obj.isDicItem = true;
                obj.dicDataTableNo = $("#inputDicDataTableNo").val();
                obj.dicCodeItemNo = $("#inputDicCodeItemNo").val();
                obj.dicDescItemNo = $("#inputDicDescItemNo").val();
                obj.lhDicItemNo = $("#inputLhDicItemNo").val();
                obj.lhDicGroupCode = $("#inputLhDicGroupCode").val();

            } else {
                $("#listTable tbody").append('<tr style="">' +
                    '<td>' + $("#dataTableNo").val() + '-' + inputNo + '</td>' +
                    '<td class="longText" title="'+htmlEncode(inputName)+'">' + htmlEncode(inputName) + '</td>' +
                    '<td>' + inputDataType + '</td>' +
                    "<td><a href='javascript:void(0)' onclick='viewMeta(this)'>" + inputDataContent + "</a></td>" +
                    '<td>' + inputDatalength + '</td>' +
                    '<td class="longText" title="'+htmlEncode(inputDescription)+'">' + htmlEncode(inputDescription) + '</td>' +
                    '<td hidden="true">' + false + '</td>' +
                    '<td hidden="true"></td>' +
                    '<td hidden="true"></td>' +
                    '<td hidden="true"></td>' +
                    '<td hidden="true"></td>' +
                    '<td hidden="true"></td>' +
                    '<td hidden="true"></td>' +
                    '<td class="td-modify"><a id="btn-modify"><em class="fa fa-edit"></em></a></td>' +
                    '<td class="deleteBtn"><a><em class="fa fa-times-circle"></em></a></td>' +
                    '</tr>');
                obj.isDicItem = false;
            }
            //console.log(obj);
            momentArr.push(obj);
        }
        if(momentArr.length % 10 == 1){
            initPage(totalPages+1);
        }
    });
    $("#pageTag").on("click",".pageTag",function(){
        if(!$(this).hasClass("disabled")){
            var pageNumber = $(this).children("a").text();
            var active = parseInt($("#pageTag li.active a").text());
            if(pageNumber != "<" && pageNumber != ">" && pageNumber!="..."){
                pageNumber = parseInt(pageNumber);
                turnToPage(pageNumber);
            }else if(pageNumber == "<"){
                turnToPage(parseInt(active-1));
            }else if (pageNumber == ">"){
                turnToPage(parseInt(active+1));
            }
        }
    });
    function initPage(pageNumber,type) {
        $("#pageTag").empty();
        var pageSize = 10;
        var item = momentArr;
        var totalPages;

        if( item.length == 0){
            totalPages = 1;
        }else if(item.length%10 == 0){
            totalPages = item.length/10;
        }else{
            totalPages = parseInt(item.length/10)+1;
        }

        if(pageNumber == 1){
            $("#pageTag").append('<li class="disabled pageTag"><a>&lt;</a></li>');
        }else{
            $("#pageTag").append('<li class="pageTag"><a>&lt;</a></li>');
            if(pageNumber >= 3 && totalPages >= 5){
                $("#pageTag").append('<li class="pageTag"><a>1</a></li>');
            }
        }
        if(pageNumber > 3 && totalPages > 5){
            $("#pageTag").append('<li class="pageTag"><a>...</a></li>');
        }
        if((totalPages - pageNumber) < 2 && pageNumber > 2){
            if((totalPages == pageNumber) && pageNumber > 3){
                $("#pageTag").append('<li class="pageTag"><a>'+(parseInt(pageNumber) - 3)+'</a></li>');
            }
            $("#pageTag").append('<li class="pageTag"><a>'+(parseInt(pageNumber) - 2)+'</a></li>');
        }

        if(pageNumber > 1){
            $("#pageTag").append('<li class="pageTag"><a>'+(parseInt(pageNumber)-1)+'</a></li>');
        }
        $("#pageTag").append('<li class="active pageTag"><a>'+parseInt(pageNumber)+'</a></li>');
        if((totalPages - pageNumber) >= 1){
            $("#pageTag").append('<li class="pageTag"><a>'+(parseInt(pageNumber)+1)+'</a></li>');
        }
        if(pageNumber <3){
            if((pageNumber + 2) < totalPages){
                $("#pageTag").append('<li class="pageTag"><a>'+(parseInt(pageNumber)+2)+'</a></li>');
            }
            if((pageNumber < 2)&& ((pageNumber + 3) < totalPages) ){
                $("#pageTag").append('<li class="pageTag"><a>'+(parseInt(pageNumber)+3)+'</a></li>');
            }
        }
        if((totalPages - pageNumber) >= 3 && totalPages > 5){
            $("#pageTag").append('<li class="pageTag"><a >...</a></li>');
        }

        if(pageNumber == totalPages || type == "create"){
            $("#pageTag").append('<li class="disabled pageTag"><a>&gt;</a></li>');
        }else{
            if((totalPages - pageNumber) >= 2){
                $("#pageTag").append('<li class="pageTag"><a>'+totalPages+'</a></li>');
            }
            $("#pageTag").append('<li class="pageTag"><a>&gt;</a></li>');
        }
    }
    initPage(1);
    function turnToPage(pageNumber){
        var arr1 = momentArr.slice((pageNumber-1)*10,pageNumber*10);

        //刷新表格数据
        $("#listTable tbody").empty();
        for(var j=0;j<arr1.length;j++){
            $("#listTable tbody").append('<tr style="display:table-row">'+
                '<td>'+arr1[j].itemNo+'</td>'+
                '<td class="longText" title="'+htmlEncode(arr1[j].itemName)+'">'+htmlEncode(arr1[j].itemName)+'</td>'+
                '<td>'+arr1[j].dataItemFormatCode+'</td>'+
                '<td><a href="javascript:void(0)" onclick="viewMeta(this)">'+arr1[j].metadataCode+'</td>'+
                '<td>'+arr1[j].itemLength+'</td>'+
                '<td class="longText" title="'+htmlEncode(arr1[j].itemDesc)+'">'+htmlEncode(arr1[j].itemDesc)+'</td>'+
                '<td hidden="true">'+arr1[j].isDicItem+'</td>'+
                '<td hidden="true">'+arr1[j].dataTableNo+'</td>'+
                '<td hidden="true">'+arr1[j].dicDataTableNo+'</td>'+
                '<td hidden="true">'+arr1[j].dicCodeItemNo+'</td>'+
                '<td hidden="true">'+arr1[j].dicDescItemNo+'</td>'+
                '<td hidden="true">'+arr1[j].lhDicItemNo+'</td>'+
                '<td hidden="true">'+htmlEncode(arr1[j].lhDicGroupCode)+'</td>'+
                '<td class="td-modify"><a id="btn-modify"><em class="fa fa-edit"></em></a></td>'+
                '<td class="deleteBtn"><a><em class="fa fa-times-circle"></em></a></td>'+
                '</tr>');


        }
        initPage(pageNumber);
    }
var modifyArr = [];
//获取修改数据项信息
$("#listTable tbody").on("click","tr td.td-modify a",function () {

    var targetNameIndex = parseInt(($("#pageTag li.active a").text()-1)*10)
    var targetName = parseInt($(this).parent().parent().index()+targetNameIndex);
    modifyArr = [];
    modifyArr = modifyArr.concat(momentArr);
    modifyArr.splice(targetName, 1);
    
    //var obj = momentArr[targetName];

    var dataItemTr = $(this).parent().parent().find("td");

    $("#modifyNo").removeClass("border-red");
    $('.error9').hide();
    $("#modifyName").removeClass("border-red");
    $('.error10').hide();
    $("#modifyDataContent").removeClass("border-red");
    $('.error11').hide();
    $("#modifyDatalength").removeClass("border-red");
    $('.error12').hide();
    $("#modifyDescription").removeClass("border-red");
    $('.error18').hide();



    if (!isEmpty(dataItemTr[8].innerHTML)) {
        $.ajax({
            type: "get",
            url: rootPath+"/appsystems/isDic_lh?dicDataTableNo="+dataItemTr[8].innerHTML,
            dataType: "json",
            //contentType: 'application/json;charset=utf-8',
            success: function (data) {
                if (data.result == "success") {

                    if (data.isDIC_LH) {
                        $('#isModifyDIC_LH').removeAttr("hidden", false);
                    } else {
                        $('#isModifyDIC_LH').prop("hidden", "hidden");
                    }
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });
    }

    //模态框显示
    $('#modifyDataTableItemNo').text($('#dataTableNo').val() + "-");
    $('#modifyModal').modal({backdrop: 'static', keyboard: false});
    $('#modifyModal').data("$selector", $(this));

    var arr = dataItemTr[0].innerHTML.split("-");
    $("#modifyNo").val(arr[arr.length-1]);
    $("#modifyName").val(dataItemTr[1].innerText);
    $("#modifyDataType").val(dataItemTr[2].innerHTML);
    $("#modifyDataContent").val(dataItemTr[3].innerText);
    $("#modifyDatalength").val(dataItemTr[4].innerHTML);
    $("#modifyDescription").val(dataItemTr[5].innerText);
    
    $("#modifyDataTableNo").val($('#dataTableNo').val());

    if(dataItemTr[6].innerHTML == 'true'){
        $("#modifyIsDicItem").val(1);
        $('#isModifyFlag').removeAttr("hidden");
        $("#modifyDicDataTableNo").val(dataItemTr[8].innerHTML);
        $("#modifyDicCodeItemNo").val(dataItemTr[9].innerHTML);
        $("#modifyDicDescItemNo").val(dataItemTr[10].innerHTML);
        $("#modifyLhDicItemNo").val(dataItemTr[11].innerHTML);
        $("#modifyLhDicGroupCode").val(dataItemTr[12].innerText);
    } else {
        $("#modifyIsDicItem").val(0);
        $('#isModifyFlag').prop("hidden", "hidden");
        $("#modifyDicDataTableNo").val("");
        $("#modifyDicCodeItemNo").val("");
        $("#modifyDicDescItemNo").val("");
        $("#modifyLhDicItemNo").val("");
        $("#modifyLhDicGroupCode").val("");
        $('#isModifyDIC_LH').prop("hidden", "hidden");
    }

    if (!isEmpty($("#modifyDicDataTableNo").val())) {
        $("#chooseModifyDicCodeItemNo").removeAttr("disabled", false);
        $("#chooseModifyDicDescItemNo").removeAttr("disabled", false);
        $("#chooseModifyLhDicItemNo").removeAttr("disabled", false);
    } else {
        $("#chooseModifyDicCodeItemNo").prop("disabled", "disabled");
        $("#chooseModifyDicDescItemNo").prop("disabled", "disabled");
        $("#chooseModifyLhDicItemNo").prop("disabled", "disabled");
    }

});

//提交修改模态框信息
$("#modify-submit").click(function () {

    preventDefaultFlag = false;

    modifyItemCheck();

    if (preventDefaultFlag) {
        return false;
    } else {
        var $selector = $('#modifyModal').data("$selector");

        $selector.parent().parent().children("td").eq(0).text($('#dataTableNo').val() + "-" + $("#modifyNo").val());
        $selector.parent().parent().children("td").eq(1).text(htmlEncode($("#modifyName").val()));
        $selector.parent().parent().children("td").eq(2).text($("#modifyDataType").val());
        $selector.parent().parent().children("td").eq(3).children("a").text($("#modifyDataContent").val());
        $selector.parent().parent().children("td").eq(4).text($("#modifyDatalength").val());
        $selector.parent().parent().children("td").eq(5).text(htmlEncode($("#modifyDescription").val()));
        if ($("#modifyIsDicItem option:selected").val() == 1) {
            $selector.parent().parent().children("td").eq(6).text(true);
        } else {
            $selector.parent().parent().children("td").eq(6).text(false);
        }
        $selector.parent().parent().children("td").eq(8).text($("#modifyDicDataTableNo").val());
        $selector.parent().parent().children("td").eq(9).text($("#modifyDicCodeItemNo").val());
        $selector.parent().parent().children("td").eq(10).text($("#modifyDicDescItemNo").val());
        $selector.parent().parent().children("td").eq(11).text($("#modifyLhDicItemNo").val());
        $selector.parent().parent().children("td").eq(12).text(htmlEncode($("#modifyLhDicGroupCode").val()));

        var modifyNameIndex = parseInt(($("#pageTag li.active a").text()-1)*10)
        var modifyName = parseInt($selector.parent().parent().index()+modifyNameIndex);
        var modifyDataObj = {};
        modifyDataObj.itemNo = $('#dataTableNo').val() + "-" + $("#modifyNo").val();
        modifyDataObj.itemName = $("#modifyName").val();
        modifyDataObj.dataItemFormatCode = $("#modifyDataType").val();
        modifyDataObj.metadataCode = $("#modifyDataContent").val();
        modifyDataObj.itemLength = $("#modifyDatalength").val();
        modifyDataObj.itemDesc = $("#modifyDescription").val();
        modifyDataObj.id = momentArr[modifyName].id;
        modifyDataObj.dataTableId = $('#dataTableId').val();
        modifyDataObj.dataTableNo = $("#dataTableNo").val();
        if ($("#modifyIsDicItem option:selected").val() == 1) {
            modifyDataObj.isDicItem = true;
            modifyDataObj.dicDataTableNo = $("#modifyDicDataTableNo").val();
            modifyDataObj.dicCodeItemNo = $("#modifyDicCodeItemNo").val();
            modifyDataObj.dicDescItemNo = $("#modifyDicDescItemNo").val();
            modifyDataObj.lhDicItemNo = $("#modifyLhDicItemNo").val();
            modifyDataObj.lhDicGroupCode = $("#modifyLhDicGroupCode").val();
        } else {
            modifyDataObj.isDicItem = false;
        }

        momentArr.splice(modifyName,1,modifyDataObj);
        turnToPage( parseInt($("#pageTag li.active a").text()));
    }


});

function isEmpty(string) {
    if((string == "") || (string == null) || (string == undefined)) {
        return true;
    }

    return false;
}

//删除按钮
$("#listTable tbody").on("click","tr td:last-child a",function () {
    var target = $(this).parent().parent();
    var targetNameIndex = parseInt(($("#pageTag li.active a").text()-1)*10);
    var targetName = parseInt($(this).parent().parent().index()+targetNameIndex);
    target.remove();
    var obj = momentArr[targetName];
    if (null != obj.id) {
        obj.active_flag = false;
        deleteArr.push(obj);
    }
    momentArr.splice(targetName,1);
    var page = $("#pageTag li.active a").text();
    if ((momentArr.length !=0) && (momentArr.length%10 == 0) && (momentArr.length/10 == ($("#pageTag li.active a").text() - 1))) {
        page = page - 1;
        if ((page-1) < 1) {
            page = 1
        }
    }

    turnToPage(parseInt(page));
    initPage(parseInt(page));


});

//数据元内容标识关联
    var $appSystemCode = $('#appSystemCode');
    var appSystemCode = $appSystemCode.val();
    var $appSystemList = $('#appSystemList');
    var appSystemId = '';
    $('.chooseDataTableItem').click(function () {

        $("#inputDataContent").removeClass("border-red");
        $(".error7").html("");
        $("#appSystemCode").val("");
        //打开模态框
        $('#addDataTableItem').modal({backdrop: 'static', keyboard: false});
        getAppSystemNo();
    });
    $('.chooseDataTableItem1').click(function () {

        $("#modifyDataContent").removeClass("border-red");
        $(".error11").html("");
        $("#appSystemCode").val("");
        $('#addDataTableItem').modal({backdrop: 'static', keyboard: false});
        getAppSystemNo();
    });

    $('#metaName').click(function () {
        $("#metaName").removeClass("border-red");
        $(".errorMetaName").hide();
        if ($("#list-meta").is(":hidden")) {
            $("#list-meta").show();
        }
        metaTag = 1;
    });
//获取数据元内容标识
    function getAppSystemNo(key) {
        $.get(rootPath + "/metadata/tree", {},
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    drawMetaTreeData =  data.metadataCategory;
                    drawMetaTree(data.metadataCategory);
                    $("#appSystemCode").removeClass("border-red");
                    $(".error19").html("");
                    $('#addDataTableItem').modal({backdrop: 'static', keyboard: false});
                } else {
                    dmallError(data.result);
                }
            },
            "json"
        );
    }

    function drawMetaTree(data){
        $metaDataTree = $('#appSystemList').treeview({
            data: data,
            onNodeSelected: function (event, node) {
                if(node.resourceTypeName != "Category"){
                    var $metaList = $("#appSystemCode");
                    $metaList.data("metaName", node.text);
                    $metaList.data("metacode", node.code);
                    $metaList.data("catecode", node.parent_code);
                    $metaList.val($metaList.data("metaName"));
                    $("#appSystemCode").removeClass("border-red");
                    $(".error19").html("");
                    // $("#appSystemList").hide();
                }else{
                    dmallError("只能选择数据元，类目不可选");
                }
            },
            onNodeCollapsed: function (event, node) {
                metaTag = 1;
            },
            onNodeExpanded: function (event, node) {
                metaTag = 1;
            }
        });
        return $metaDataTree;
    }
// 查询
   /* $appSystemCode.keyup(function () {
        getAppSystemNo($(this).val());
    });*/
//点击
    $appSystemList.on('click', 'li', function () {

        if ($(this).html() != '空'){
            $(this).addClass('provideDept-click').siblings().removeClass('provideDept-click');
            appSystemId = $(this).attr('data-appSystemId');
            appSystemCode = $(this).html();
            // getDataTableCode(appSystemId);
            //$dataItemList.html('');
        }
    });

//将值填入到数据元内容标识文本框
    $("#itemDataBtn").click(function () {
        if(checkMetaNameValue()){
            return false;
        }
        $("#appSystemCode").removeClass("border-red");
        $(".error19").html("");
        $("#modifyDataContent").val($("#appSystemCode").val().split(" ")[0]);
    });
    $("#itemDataBtn").click(function () {
        if(checkMetaNameValue()){
            return false;
        }
        $("#appSystemCode").removeClass("border-red");
        $(".error19").html("");
        $("#inputDataContent").val($("#appSystemCode").val().split(" ")[0]);
    });

$("#appSystemCode").focus(function () {
    $("#appSystemCode").removeClass("border-red");
    $(".error19").html("");
});
$("#modifyDataContent").blur(function () {
    createCheckIsEmpty($("#modifyDataContent"), 11, "请输入数据元内容标识符");
});
$("#modifyDataContent").focus(function () {
    $("#modifyDataContent").removeClass("border-red");
    $('.error11').hide();
});
$('#inputDataContent').blur(function () {
    createCheckIsEmpty($("#inputDataContent"), 7, "请输入数据元内容标识符");
});
$('#inputDataContent').focus(function () {
    $("#inputDataContent").removeClass("border-red");
    $('.error7').hide();
});

//检查数据元选择框
function checkMetaNameValue() {
    var string = $("#appSystemCode").val();
    var nodeTmp = getNodeInMetaTree(string);
    if (null != nodeTmp) {
        $("#appSystemCode").removeClass("border-red");
        $(".error19").html("");
    } else {
        $("#appSystemCode").addClass("border-red");
        $(".error19").html("*请选择正确的数据元");
        $(".error19").css("display", "block");
        preventDefaultFlag = true;
        return true;
    }
    if ($("#appSystemCode").val() == "") {
        $("#appSystemCode").addClass("border-red");
        $(".error19").html("*请选择数据元");
        $(".error19").css("display", "block");
        preventDefaultFlag = true;
        return true;
    }

    return false;
};

//检查输入项是否在树中存在
function getNodeInMetaTree(textName) {
    var pattern = textName;
    var options = {
        exactMatch: true,
        revealResults: true
    };
    var results = $metaDataTree.treeview('search', [pattern, options]);

    if (results.length != 0) {
        return results[0];
    } else {
        return null;
    }
}

function createCheckIsEmpty(obj, num, message) {
    var string = obj.val();
    if(isEmpty(string)) {
        obj.addClass("border-red");
        $('.error'+num).html(message);
        $('.error'+num).css("display", "block");
        preventDefaultFlag = true;
    } else {
        obj.removeClass("border-red");
        $('.error'+num).hide();
    }
}

$("#dataTableName").blur(function (){
    checkDataTableName();
});
$("#dataTableDesc").blur(function (){
    createCheckIsEmpty($("#dataTableDesc"), 3, "请输入数据表描述，2000字以内");
});

//提交修改信息
function createCheckAll() {
    checkDataTableName();
    createCheckIsEmpty($("#dataTableDesc"), 3, "请输入数据表描述，2000字以内");

}
$("#btn_commitCreateInfo").click(function () {

    preventDefaultFlag=false;

    createCheckAll();
    if(preventDefaultFlag==true)
    {
        return false;
    }
    else {
        $.ajax({
            type: "GET",
            url: rootPath+"/appsystems/isLinked?preDataTableItemNo=" + $("#dataTableNo").val(),
            dataType: "json",
            success: function (data) {
                if (data.result = "success") {
                    if (data.isUse) {
                        $('#isLinkedModal').modal({backdrop: 'static', keyboard: false});
                        return false;
                    } else {
                        commitTable();
                    }
                } else {
                    dmallError(data.result);
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });

    }
});

function commitTable() {
    var datTableItemList = momentArr.concat(deleteArr);

    var dataTable = {
        "id": $('#dataTableId').val(),
        "dataTableNo": $('#dataTableNo').val(),
        "dataTableName": $('#dataTableName').val(),
        "dataTableDesc": $('#dataTableDesc').val(),
        "updateCycleCode": $('#updateCycleCode option:selected').val(),
        "dataTableRemark": $('#dataTableRemark').val(),
        "tableUseTypeCode": $('#tableUseTypeCode option:selected').val(),
        "appSystemId": $('#appSystemId').val()
    };
    if (dataTable.updateCycleCode != "GXZQ_BGX") {
        dataTable.updateModeCode = $('#updateModeCode option:selected').val();
    }
    if (dataTable.tableUseTypeCode == "TABLE_ZDB") {
        dataTable.dicTypeCode = $('#dicTypeCode option:selected').val();
    }
    $.ajax({
        type: "post",
        url: rootPath+"/appsystems/datatables",
        data: {"dataTableEntity":JSON.stringify(dataTable), "dataTableItemList":JSON.stringify(datTableItemList)},
        dataType: "json",
        //contentType: 'application/json;charset=utf-8',
        success: function (data) {
            if (data.result = "success") {
                location.href = rootPath+"/appsystems/datatables";
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

//提交修改项
$("#btn_commitIsLinkedInfo").click(function () {
    commitTable();
});

//字典项标识判断
function dicItemChange() {
    var isFlag = $('#inputIsDicItem option:selected').val();
    if (isFlag == 1) {
        $('#isFlag').removeAttr("hidden");
    } else {
        $('#isFlag').prop("hidden", true);
        $("#inputDicDataTableNo").val(" ");
        $("#inputDicCodeItemNo").val(" ");
        $("#inputDicDescItemNo").val(" ");
        $("#inputLhDicItemNo").val(" ");
        $("#inputLhDicGroupCode").val(" ");
    }
}
function modifyDicItemChange() {
    var isFlag = $('#modifyIsDicItem option:selected').val();
    if (isFlag == 1) {
        $('#isModifyFlag').removeAttr("hidden");
    } else {
        $('#isModifyFlag').prop("hidden", true);
        $("#modifyDicDataTableNo").val(" ");
        $("#modifyDicCodeItemNo").val(" ");
        $("#modifyDicDescItemNo").val(" ");
        $("#modifyLhDicItemNo").val(" ");
        $("#modifyLhDicGroupCode").val(" ");
    }
}

//数据表更新周期判断
function updateCycleCodeChange() {
    var updateCycleCode = $('#updateCycleCode option:selected').val();
    if (updateCycleCode == "GXZQ_BGX") {
        $('#updateModeCode').removeClass("border-red");
        $('.error14').hide();
        $('#updateModeCodeDiv').prop("hidden", "hidden");
        $('#updateModeCodeDivDef').removeAttr("hidden");
    }else{
        $('#updateModeCodeDivDef').prop("hidden", "hidden");
        $('#updateModeCodeDiv').removeAttr("hidden");
    }
}

//数据表用途分类代码判断
function tableUseTypeCodeChange() {
    var tableUseTypeCode = $('#tableUseTypeCode option:selected').val();
    if (tableUseTypeCode != "TABLE_ZDB") {
        $('#dicTypeCode').removeClass("border-red");
        $('.error16').hide();
        $('#dicTypeCode').val("DIC_DD");
        $('#dicTypeCodeDivDef').removeAttr("hidden");
        $('#dicTypeCodeDiv').prop("hidden", "hidden");
    }else{
        $('#dicTypeCodeDiv').removeAttr("hidden");
        $('#dicTypeCodeDivDef').prop("hidden", "hidden");
    }
}

var type = "";
$("#previouspage").click(function () {
    if (parseInt($("#currentPage").text()) > 1) {
        switch (type){
            case "dicDataTableNo":
                getDicDataTableNo(parseInt($("#currentPage").text()) - 1, $('#appSystemId').val());
                break;
            case "dicCodeItemNo":
                getDicCodeItemNo(parseInt($("#currentPage").text()) - 1, $('#inputDicDataTableNo').val());
                break;
            case "dicDescItemNo":
                getDicCodeItemNo(parseInt($("#currentPage").text()) - 1, $('#inputDicDataTableNo').val());
                break;
            case "lhDicItemNo":
                getDicCodeItemNo(parseInt($("#currentPage").text()) - 1, $('#inputDicDataTableNo').val());
                break;
            case "modifyDicDataTableNo":
                getDicDataTableNo(parseInt($("#currentPage").text()) - 1, $('#appSystemId').val());
                break;
            case "modifyDicCodeItemNo":
                getDicCodeItemNo(parseInt($("#currentPage").text()) - 1, $('#modifyDicDataTableNo').val());
                break;
            case "modifyDicDescItemNo":
                getDicCodeItemNo(parseInt($("#currentPage").text()) - 1, $('#modifyDicDataTableNo').val());
                break;
            case "modifyLhDicItemNo":
                getDicCodeItemNo(parseInt($("#currentPage").text()) - 1, $('#modifyDicDataTableNo').val());
                break;
        }
    }
});

$("#nextpage").click(function () {
    if (parseInt($("#currentPage").text()) < parseInt($("#totalPage").text())) {
        switch (type){
            case "dicDataTableNo":
                getDicDataTableNo(parseInt($("#currentPage").text()) + 1, $('#appSystemId').val());
                break;
            case "dicCodeItemNo":
                getDicCodeItemNo(parseInt($("#currentPage").text()) + 1, $('#inputDicDataTableNo').val());
                break;
            case "dicDescItemNo":
                getDicCodeItemNo(parseInt($("#currentPage").text()) + 1, $('#inputDicDataTableNo').val());
                break;
            case "lhDicItemNo":
                getDicCodeItemNo(parseInt($("#currentPage").text()) + 1, $('#inputDicDataTableNo').val());
                break;
            case "modifyDicDataTableNo":
                getModifyDicDataTableNo(parseInt($("#currentPage").text()) + 1, $('#appSystemId').val());
                break;
            case "modifyDicCodeItemNo":
                getModifyDicCodeItemNo(parseInt($("#currentPage").text()) + 1, $('#modifyDicDataTableNo').val());
                break;
            case "modifyDicDescItemNo":
                getModifyDicCodeItemNo(parseInt($("#currentPage").text()) + 1, $('#modifyDicDataTableNo').val());
                break;
            case "modifyLhDicItemNo":
                getModifyDicCodeItemNo(parseInt($("#currentPage").text()) + 1, $('#modifyDicDataTableNo').val());
                break;
        }
    }
});

$('#dicDataTableNo_btn_commit').click(function () {

    switch (type) {
        case "dicDataTableNo" :
            if ($("#inputDicDataTableNo").val() != $("#inputDicDataTableNo").data('dicDataTableNo')) {
                $('#inputDicCodeItemNo').val("");
                $('#inputDicDescItemNo').val("");
                $('#inputLhDicItemNo').val("");
            }

            $("#inputDicDataTableNo").val($("#inputDicDataTableNo").data('dicDataTableNo'));
            if (!isEmpty($("#inputDicDataTableNo").data('dicDataTableNo'))) {
                $('#chooseDicCodeItemNo').removeAttr("disabled",false);
                $('#chooseDicDescItemNo').removeAttr("disabled",false);
                $('#chooseLhDicItemNo').removeAttr("disabled",false);
            }

            if ($("#inputDicDataTableNo").data('dicTypeCode') == "DIC_LH") {
                $('#isDIC_LH').removeAttr("hidden", false);
            } else {
                $('#isDIC_LH').prop("hidden", "hidden");
            }

            break;
        case "dicCodeItemNo" :
            $("#inputDicCodeItemNo").val($("#inputDicCodeItemNo").data('dicCodeItemNo'));
            break;
        case "dicDescItemNo":
            $("#inputDicDescItemNo").val($("#inputDicCodeItemNo").data('dicCodeItemNo'));
            break;
        case "lhDicItemNo":
            $("#inputLhDicItemNo").val($("#inputDicCodeItemNo").data('dicCodeItemNo'));
            break;
        case "modifyDicDataTableNo" :
            if ($("#mofidyDicDataTableNo").val() != $("#modifyDicDataTableNo").data('modifyDicDataTableNo')) {
                $('#modifyDicCodeItemNo').val("");
                $('#modifyDicDescItemNo').val("");
                $('#modifyhDicItemNo').val("");
            }
            $("#modifyDicDataTableNo").val($("#modifyDicDataTableNo").data('modifyDicDataTableNo'));
            if (!isEmpty($("#modifyDicDataTableNo").data('modifyDicDataTableNo'))) {
                $('#chooseModifyDicCodeItemNo').removeAttr("disabled",false);
                $('#chooseModifyDicDescItemNo').removeAttr("disabled",false);
                $('#chooseModifyLhDicItemNo').removeAttr("disabled",false);
            }

            if ($("#modifyDicDataTableNo").data('modifyDicTypeCode') == "DIC_LH") {
                $('#isModifyDIC_LH').removeAttr("hidden", false);
            } else {
                $('#isModifyDIC_LH').prop("hidden", "hidden");
            }
            $("#modifyLhDicItemNo").val("");
            $("#modifyLhDicGroupCode").val("");
            break;
        case "modifyDicCodeItemNo" :
            $("#modifyDicCodeItemNo").val($("#modifyDicCodeItemNo").data('modifyDicCodeItemNo'));
            break;
        case "modifyDicDescItemNo":
            $("#modifyDicDescItemNo").val($("#modifyDicCodeItemNo").data('modifyDicCodeItemNo'));
            break;
        case "modifyLhDicItemNo":
            $("#modifyLhDicItemNo").val($("#modifyDicCodeItemNo").data('modifyDicCodeItemNo'));
            break;
    }

});

//添加模态框
//打开参照字典表_数据表模态框
$('#chooseDicDataTableNo').click(function () {
    type = "dicDataTableNo";
    $('#addModel').modal({backdrop: 'static', keyboard: false});
    getDicDataTableNo(1, $('#appSystemId').val());
});

//分页获取参照字典表_数据表
function getDicDataTableNo(pageNum, appSystemId) {
    $.get(rootPath + "/appsystems/datatables/getPage", {
            pageNumber: pageNum,
            appSystemId: appSystemId
        },
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                var $listDicDataTableNo = $('#list-All');
                $listDicDataTableNo.empty();
                var list = data.dataTableList;
                for (var i=0; i < list.length;i++){
                    list[i]['text'] = '<span  style="float:left;margin-top: -17px;width:450px;height:17px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;" title="'+ list[i].dataTableNo + ' ' + htmlEncode(list[i].dataTableName)+'">' + list[i].dataTableNo + ' ' + htmlEncode(list[i].dataTableName)+'</span>';
                }
                var dataTableNameTree = $listDicDataTableNo.treeview({
                    data: list,
                    onNodeSelected: function (event, node) {
                        $("#inputDicDataTableNo").data("dicDataTableNo", node.dataTableNo);
                        $("#inputDicDataTableNo").data("dicTypeCode", node.dicTypeCode);
                        if (node.dataTableNo == $('#dataTableNo').val()) {
                            $('#dicDataTableNo_btn_commit').attr("disabled","disabled");
                            dmallError("参照字典表_数据表不能选择自己");
                        } else {
                            $('#dicDataTableNo_btn_commit').removeAttr("disabled", false);
                        }
                    }
                });

                $("#totalPage").html(data.totalPage);
                if (data.totalPage == 0) {
                    $("#currentPage").html(0);
                } else {
                    $("#currentPage").html(data.pageNumber);
                }
            } else {
                dmallError("获取参照字典表_数据表失败");
            }
        },
        "json"
    );
}

//打开字典表代码列_数据项编号模态框
$('#chooseDicCodeItemNo').click(function () {
    type = "dicCodeItemNo";
    $('#addModel').modal({backdrop: 'static', keyboard: false});
    $('#title').text('选择字典表代码列_数据项编号');
    getDicCodeItemNo(1, $('#inputDicDataTableNo').val());
});

//获取字典表代码列_数据项编号分页信息
function getDicCodeItemNo(pageNum, dicDataTableNo) {
    $.get(rootPath + "/appsystems/datatable/"+ dicDataTableNo +"/items", {
            pageNumber: pageNum,
        },
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                var $listDicDataTableNo = $('#list-All');
                $listDicDataTableNo.empty();
                var list = data.dataTableItemList;
                for (var i=0; i < list.length;i++){
                    list[i]['text'] = '<span  style="float:left;margin-top: -17px;width:450px;height:17px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;" title="'+ list[i].itemNo + ' ' + htmlEncode(list[i].itemName)+'">' + list[i].itemNo + ' ' + htmlEncode(list[i].itemName)+'</span>';
                }
                var dataTableNameTree = $listDicDataTableNo.treeview({
                    data: list,
                    onNodeSelected: function (event, node) {
                        $("#inputDicCodeItemNo").data("dicCodeItemNo", node.itemNo);
                    }
                });

                $("#totalPage").html(data.totalPage);
                if (data.totalPage == 0) {
                    $("#currentPage").html(0);
                } else {
                    $("#currentPage").html(data.pageNumber);
                }
            } else {
                dmallError("获取字典表代码列_数据项失败");
            }
        },
        "json"
    );
}

//打开字典表描述列_数据项编号模态框
$('#chooseDicDescItemNo').click(function () {
    type = "dicDescItemNo";
    $('#addModel').modal({backdrop: 'static', keyboard: false});
    $('#title').text('选择字典表描述列_数据项编号');
    getDicCodeItemNo(1, $('#inputDicDataTableNo').val());
});

//打开联合字典分组列_数据项编号模态框
$('#chooseLhDicItemNo').click(function () {
    type = "lhDicItemNo";
    $('#addModel').modal({backdrop: 'static', keyboard: false});
    $('#title').text('选择联合字典分组列_数据项编号');
    getDicCodeItemNo(1, $('#inputDicDataTableNo').val());
});

//修改模态框
//打开参照字典表_数据表模态框
$('#chooseModifyDicDataTableNo').click(function () {
    type = "modifyDicDataTableNo";
    $('#addModel').modal({backdrop: 'static', keyboard: false});
    getModifyDicDataTableNo(1, $('#appSystemId').val());
});

//打开字典表代码列_数据项编号模态框
$('#chooseModifyDicCodeItemNo').click(function () {
    type = "modifyDicCodeItemNo";
    $('#addModel').modal({backdrop: 'static', keyboard: false});
    $('#title').text('选择字典表代码列_数据项编号');
    getModifyDicCodeItemNo(1, $('#modifyDicDataTableNo').val());
});

//打开字典表描述列_数据项编号模态框
$('#chooseModifyDicDescItemNo').click(function () {
    type = "modifyDicDescItemNo";
    $('#addModel').modal({backdrop: 'static', keyboard: false});
    $('#title').text('选择字典表描述列_数据项编号');
    getModifyDicCodeItemNo(1, $('#modifyDicDataTableNo').val());
});

//打开联合字典分组列_数据项编号模态框
$('#chooseModifyLhDicItemNo').click(function () {
    type = "modifyLhDicItemNo";
    $('#addModel').modal({backdrop: 'static', keyboard: false});
    $('#title').text('选择联合字典分组列_数据项编号');
    getModifyDicCodeItemNo(1, $('#modifyDicDataTableNo').val());
});

//分页获取参照字典表_数据表
function getModifyDicDataTableNo(pageNum, appSystemId) {
    $.get(rootPath + "/appsystems/datatables/getPage", {
            pageNumber: pageNum,
            appSystemId: appSystemId
        },
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                var $listDicDataTableNo = $('#list-All');
                $listDicDataTableNo.empty();
                var list = data.dataTableList;
                for (var i=0; i < list.length;i++){
                    list[i]['text'] = '<span  style="float:left;margin-top: -17px;width:450px;height:17px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;" title="'+ list[i].dataTableNo + ' ' + htmlEncode(list[i].dataTableName)+'">' + list[i].dataTableNo + ' ' + htmlEncode(list[i].dataTableName)+'</span>';
                }
                var dataTableNameTree = $listDicDataTableNo.treeview({
                    data: list,
                    onNodeSelected: function (event, node) {
                        $("#modifyDicDataTableNo").data("modifyDicDataTableNo", node.dataTableNo);
                        $("#modifyDicDataTableNo").data("modifyDicTypeCode", node.dicTypeCode);
                        if (node.dataTableNo == $('#dataTableNo').val()) {
                            $('#dicDataTableNo_btn_commit').attr("disabled","disabled");
                            dmallError("参照字典表_数据表不能选择自己");
                        } else {
                            $('#dicDataTableNo_btn_commit').removeAttr("disabled", false);
                        }
                    }
                });

                $("#totalPage").html(data.totalPage);
                if (data.totalPage == 0) {
                    $("#currentPage").html(0);
                } else {
                    $("#currentPage").html(data.pageNumber);
                }
            } else {
                dmallError("获取参照字典表_数据表失败");
            }
        },
        "json"
    );
}

//获取字典表代码列_数据项编号分页信息
function getModifyDicCodeItemNo(pageNum, modifyDicDataTableNo) {
    $.get(rootPath + "/appsystems/datatable/"+ modifyDicDataTableNo +"/items", {
            pageNumber: pageNum,
        },
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                var $listDicDataTableNo = $('#list-All');
                $listDicDataTableNo.empty();
                var list = data.dataTableItemList;
                for (var i=0; i < list.length;i++){
                    list[i]['text'] = '<span  style="float:left;margin-top: -17px;width:450px;height:17px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;" title="'+ list[i].itemNo + ' ' + htmlEncode(list[i].itemName)+'">' + list[i].itemNo + ' ' + htmlEncode(list[i].itemName)+'</span>';
                }
                var dataTableNameTree = $listDicDataTableNo.treeview({
                    data: list,
                    onNodeSelected: function (event, node) {
                        $("#modifyDicCodeItemNo").data("modifyDicCodeItemNo", node.itemNo);
                    }
                });

                $("#totalPage").html(data.totalPage);
                if (data.totalPage == 0) {
                    $("#currentPage").html(0);
                } else {
                    $("#currentPage").html(data.pageNumber);
                }
            } else {
                dmallError("获取字典表代码列_数据项失败");
            }
        },
        "json"
    );
}


/* 5位数字检查 */
function inputCheckCodeNum(string) {
    var regex = /^[0-9]{5}$/;
    return regex.test(string);
}

function checkNumber(num) {
    var regex = /^([1-9]\d*|0)(\.\d*[1-9])?$/;
    return regex.test(num);
}

// /* 输入中文、英文字母、数字、下划线 */
// function inputCheckName(string) {
//     var regex =  /^[\w\u4e00-\u9fa5_]{1,120}$/;
//     return regex.test(string);
// }

function checkItemName() {
    if (isEmpty($("#inputName").val())) {
        $("#inputName").addClass("border-red");
        $('.error6').html("*请输入数据项名称");
        $('.error6').css("display", "block");
        preventDefaultFlag = true;
    } else {
        $("#inputName").removeClass("border-red");
        $('.error6').hide();
    }
}

function checkDataTableName() {
    if (isEmpty($("#dataTableName").val())) {
        $("#dataTableName").addClass("border-red");
        $('.error2').html("*请输入数据表名称");
        $('.error2').css("display", "block");
        preventDefaultFlag = true;
    } else {
        $("#dataTableName").removeClass("border-red");
        $('.error2').hide();
    }
}

function createItemcheck() {

    if (!isEmpty($('#inputDatalength').val())) {
        if (!checkNumber($('#inputDatalength').val())) {
            $('#inputDatalength').addClass("border-red");
            $('.error8').html("*请输入正确的数据项长度，数据项长度只能是数字");
            $('.error8').css("display", "block");
            preventDefaultFlag = true;
        } else {
            $('#inputDatalength').removeClass("border-red");
            $('.error8').hide();
        }
    } else {
        $('#inputDatalength').removeClass("border-red");
        $('.error8').hide();
    }

    checkItemName();
    createCheckIsEmpty($("#inputDescription"), 17, "请输入数据项描述，2000字以内");
    createCheckIsEmpty($("#inputDataContent"), 7, "请输入数据元内容标识符");
    checkItemNo($("#inputNo"), 5, momentArr);
};

//数据项重复性检查
function checkItemRepeat(obj, arr) {
    for(var i = 0;i < arr.length;i++){
        if(arr[i].itemNo == $("#dataTableNo").val()+"-"+obj.val()){
            return true;
        }
    }
    return false;
}

function checkItemNo(obj, num, arr) {
    var itemNo = obj.val();
    if (isEmpty(itemNo) || !inputCheckCodeNum(itemNo)) {
        obj.addClass("border-red");
        $('.error' + num).html("*请输入5位数据项流水号");
        $('.error' + num).css("display", "block");
        preventDefaultFlag = true;
    } else if (checkItemRepeat(obj, arr)) {
        obj.addClass("border-red");
        $('.error' + num).html("*数据项编号已存在");
        $('.error' + num).css("display", "block");
        preventDefaultFlag = true;
    } else {
        obj.removeClass("border-red");
        $('.error' + num).hide();
    }
}

$("#inputNo").blur(function () {
    checkItemNo($("#inputNo"), 5, momentArr);
});

$("#inputName").blur(function () {
    checkItemName();
});

$('#inputDatalength').blur(function () {

    if (!isEmpty($('#inputDatalength').val())) {
        if (!checkNumber($('#inputDatalength').val())) {
            $('#inputDatalength').addClass("border-red");
            $('.error8').html("*请输入正确的数据项长度，数据项长度只能是数字");
            $('.error8').css("display", "block");
            preventDefaultFlag = true;
        } else {
            $('#inputDatalength').removeClass("border-red");
            $('.error8').hide();
        }
    } else {
        $('#inputDatalength').removeClass("border-red");
        $('.error8').hide();
    }

});

$("#inputDescription").blur(function () {
    createCheckIsEmpty($("#inputDescription"), 17, "请输入数据项描述，2000字以内");
});


function checkModifyItemName() {
    if (isEmpty($("#modifyName").val())) {
        $("#modifyName").addClass("border-red");
        $('.error10').html("*请输入数据项名称");
        $('.error10').css("display", "block");
        preventDefaultFlag = true;
    } else {
        $("#modifyName").removeClass("border-red");
        $('.error10').hide();
    }
}

function modifyItemCheck() {

    if (!isEmpty($('#modifyDatalength').val())) {
        if (!checkNumber($('#modifyDatalength').val())) {
            $('#modifyDatalength').addClass("border-red");
            $('.error12').html("*请输入正确的数据项长度，数据项长度只能是数字");
            $('.error12').css("display", "block");
            preventDefaultFlag = true;
        } else {
            $('#modifyDatalength').removeClass("border-red");
            $('.error12').hide();
        }
    } else {
        $('#modifyDatalength').removeClass("border-red");
        $('.error12').hide();
    }

    checkModifyItemName();
    createCheckIsEmpty($("#modifyDescription"), 18, "请输入数据项描述，2000字以内");
    createCheckIsEmpty($("#modifyDataContent"), 11, "请输入数据元内容标识符");
    checkItemNo($("#modifyNo"), 9, modifyArr);
}

$("#modifyNo").blur(function () {
    checkItemNo($("#modifyNo"), 9, modifyArr);
});

$("#modifyName").blur(function () {
    checkModifyItemName();
});

$('#modifyDatalength').blur(function () {

    if (!isEmpty($('#modifyDatalength').val())) {
        if (!checkNumber($('#modifyDatalength').val())) {
            $('#modifyDatalength').addClass("border-red");
            $('.error12').html("*请输入正确的数据项长度，数据项长度只能是数字");
            $('.error12').css("display", "block");
            preventDefaultFlag = true;
        } else {
            $('#modifyDatalength').removeClass("border-red");
            $('.error12').hide();
        }
    } else {
        $('#modifyDatalength').removeClass("border-red");
        $('.error12').hide();
    }

});

$("#modifyDescription").blur(function () {
    createCheckIsEmpty($("#modifyDescription"), 18, "请输入数据项描述，2000字以内");
});

