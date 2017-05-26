var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];
var rootPath = "http://" + window.location.host + "/" + proName;
var prjName;
var arrOther = pathname.split("/");
prjName = arrOther[1];
var totalPages;

var $directoryId=$("#directoryId").val();
$("#backLastPage").click(function () {
    window.history.go(-1)
})
$.get(rootPath + "/directory/datadirectory_detail/direcrotyItem_list",
    {
        pageNumber:1,
        datadirectoryid:$directoryId
    },
    function (data, status) {
    var len;
        if (data.result == "success") {

            var list = data.itemEntity;
            totalPages = data.totalPages;
            for(var i=0;i<list.length;i++){
                var newItemName = htmlEncode(list[i].itemName);
                var newItemChineseName = htmlEncode(list[i].itemChineseName);
                var newItemDesc = htmlEncode(list[i].itemDesc);
                if(list[i].itemChineseName == null || list[i].itemChineseName == ""){list[i].itemChineseName = "--";}
                if(list[i].itemDesc == null || list[i].itemDesc == ""){list[i].itemDesc = "";}
                len = list[i].itemLength;
                if(list[i].itemLength == null){
                    len = "";
                }
                $("#item_table_list").append("<tr>" +
                    "<td>"+list[i].itemNo+"</td>" +
                    "<td class='longText' title='"+newItemName+"'>"+newItemName+"</td>" +
                    "<td class='longText' title='"+newItemChineseName+"'>"+newItemChineseName+"</td>" +
                    "<td>"+list[i].dataItemFormatCode+"</td>" +
                    "<td>"+len+"</td>" +
                    "<td><a href='javascript:void(0)' onclick='viewMeta(this)'>"+list[i].metadataCode+"</a></td>" +
                    "<td class='longText' title='"+newItemDesc+"'>"+newItemDesc+"</td>" +
                    "</tr>");
            }
            initPage(1);

        } else {
            dmallError(data.result);
        }
    },
    "json");


$("#pageTag").on("click",".pageTag",function(){
    if(!$(this).hasClass("disabled")){
        var pageNumber = $(this).children("a").text();
        var active = parseInt($("#pageTag li.active a").text());
        if(pageNumber != "<" && pageNumber != ">" && pageNumber !="..."){
            $("#item_table_list").empty();
            pageNumber = parseInt(pageNumber);
            initPage(pageNumber);
            $.get(rootPath + "/directory/datadirectory_detail/direcrotyItem_list",
                {
                    pageNumber:pageNumber,
                    datadirectoryid:$directoryId
                },
                function (data, status) {

                    if (data.result == "success") {

                        var list = data.itemEntity;

                        for(var i=0;i<list.length;i++){
                            var newItemName = htmlEncode(list[i].itemName);
                            var newItemChineseName = htmlEncode(list[i].itemChineseName);
                            var newItemDesc = htmlEncode(list[i].itemDesc);
                            if(list[i].itemChineseName == null || list[i].itemChineseName == ""){list[i].itemChineseName = "--";}
                            if(list[i].itemDesc == null || list[i].itemDesc == ""){list[i].itemDesc = "";}
                            $("#item_table_list").append("<tr>" +
                                "<td>"+list[i].itemNo+"</td>" +
                                "<td class='longText' title='"+newItemName+"'>"+newItemName+"</td>" +
                                "<td class='longText' title='"+newItemChineseName+"'>"+newItemChineseName+"</td>" +
                                "<td>"+list[i].dataItemFormatCode+"</td>" +
                                "<td>"+list[i].itemLength+"</td>" +
                                "<td><a href='javascript:void(0)' onclick='viewMeta(this)'>"+list[i].metadataCode+"</a></td>" +
                                "<td class='longText' title='"+newItemDesc+"'>"+newItemDesc+"</td>" +
                                "</tr>");
                        }

                    } else {
                        dmallError(data.result);
                    }
                },
                "json");
        }else if(pageNumber == "<"){
            $("#item_table_list").empty();
            initPage(parseInt(active-1));
            $.get(rootPath + "/directory/datadirectory_detail/direcrotyItem_list",
                {
                    pageNumber:parseInt(active-1),
                    datadirectoryid:$directoryId
                },
                function (data, status) {

                    if (data.result == "success") {

                        var list = data.itemEntity;

                        for(var i=0;i<list.length;i++){
                            var newItemName = htmlEncode(list[i].itemName);
                            var newItemChineseName = htmlEncode(list[i].itemChineseName);
                            var newItemDesc = htmlEncode(list[i].itemDesc);
                            if(list[i].itemChineseName == null || list[i].itemChineseName == ""){list[i].itemChineseName = "--";}
                            if(list[i].itemDesc == null || list[i].itemDesc == ""){list[i].itemDesc = "";}
                            $("#item_table_list").append("<tr>" +
                                "<td>"+list[i].itemNo+"</td>" +
                                "<td class='longText' title='"+newItemName+"'>"+newItemName+"</td>" +
                                "<td class='longText' title='"+newItemChineseName+"'>"+newItemChineseName+"</td>" +
                                "<td>"+list[i].dataItemFormatCode+"</td>" +
                                "<td>"+list[i].itemLength+"</td>" +
                                "<td><a href='javascript:void(0)' onclick='viewMeta(this)'>"+list[i].metadataCode+"</a></td>" +
                                "<td class='longText' title='"+newItemDesc+"'>"+newItemDesc+"</td>" +
                                "</tr>");
                        }

                    } else {
                        dmallError(data.result);
                    }
                },
                "json");
        }else if (pageNumber == ">"){

            $("#item_table_list").empty();
            initPage(parseInt(active+1));
            $.get(rootPath + "/directory/datadirectory_detail/direcrotyItem_list",
                {
                    pageNumber:parseInt(active+1),
                    datadirectoryid:$directoryId
                },
                function (data, status) {

                    if (data.result == "success") {

                        var list = data.itemEntity;
                        if(list.length != 0){

                            for(var i=0;i<list.length;i++){
                                var newItemName = htmlEncode(list[i].itemName);
                                var newItemChineseName = htmlEncode(list[i].itemChineseName);
                                var newItemDesc = htmlEncode(list[i].itemDesc);
                                if(list[i].itemChineseName == null || list[i].itemChineseName == ""){list[i].itemChineseName = "--";}
                                if(list[i].itemDesc == null || list[i].itemDesc == ""){list[i].itemDesc = "";}
                                $("#item_table_list").append("<tr>" +
                                    "<td>"+list[i].itemNo+"</td>" +
                                    "<td class='longText' title='"+newItemName+"'>"+newItemName+"</td>" +
                                    "<td class='longText' title='"+newItemChineseName+"'>"+newItemChineseName+"</td>" +
                                    "<td>"+list[i].dataItemFormatCode+"</td>" +
                                    "<td>"+list[i].itemLength+"</td>" +
                                    "<td><a href='javascript:void(0)' onclick='viewMeta(this)'>"+list[i].metadataCode+"</a></td>" +
                                    "<td class='longText' title='"+newItemDesc+"'>"+newItemDesc+"</td>" +
                                    "</tr>");
                            }
                        }else{
                            $("#item_table_list").append("<tr>" +
                                "<td colspan='6' style='border:0;'>没有查询到数据详情</td>" +
                                "</tr>");
                        }

                    } else {
                        dmallError(data.result);
                    }
                },
                "json");

        }
    }
});





function initPage(pageNumber,type) {
    $("#pageTag").empty();
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



//


$.get(rootPath + "/directory/datadirectory_detail/catalog_list",
    {
        pageNumber:1,
        datadirectoryid:$directoryId
    },
    function (data, status) {
        if (data.result == "success") {

            var list = data.catalogEntity;
            c_totalPages = data.catalogTotalPages;

            for(var i=0;i<list.length;i++){
                $("#c_item_table_list").append("<tr>" +
                    "<td><a href="+rootPath+'/data?id='+list[i].id+">"+list[i].resourceNo+"</a></td>" +
                    "<td class='longText' title='"+list[i].resourceName+"'>"+list[i].resourceName+"</td>" +
                    "<td>"+list[i].provideDeptCode+"</td>" +
                    "<td>"+list[i].routinePowerDeptCode+"</td>" +
                    "<td>"+list[i].update_time+"</td>" +
                    "</tr>");
            }
            c_initPage(1);

        } else {
            dmallError(data.result);
        }
    },
    "json");


$("#c_pageTag").on("click",".c_pageTag",function(){
    if(!$(this).hasClass("disabled")){
        var pageNumber = $(this).children("a").text();
        var active = parseInt($("#c_pageTag li.active a").text());
        if(pageNumber != "<" && pageNumber != ">"){
            $("#c_item_table_list").empty();
            pageNumber = parseInt(pageNumber);
            c_initPage(pageNumber);
            $.get(rootPath + "/directory/datadirectory_detail/catalog_list",
                {
                    pageNumber:pageNumber,
                    datadirectoryid:$directoryId
                },
                function (data, status) {

                    if (data.result == "success") {

                        var list = data.catalogEntity;

                        for(var i=0;i<list.length;i++){
                            $("#c_item_table_list").append("<tr>" +
                                "<td><a href="+rootPath+'/data?id='+list[i].id+">"+list[i].resourceNo+"</a></td>" +
                                "<td class='longText' title='"+list[i].resourceName+"'>"+list[i].resourceName+"</td>" +
                                "<td>"+list[i].provideDeptCode+"</td>" +
                                "<td>"+list[i].routinePowerDeptCode+"</td>" +
                                "<td>"+list[i].update_time+"</td>" +
                                "</tr>");
                        }

                    } else {
                        dmallError(data.result);
                    }
                },
                "json");
        }else if(pageNumber == "<"){
            $("#c_item_table_list").empty();
            c_initPage(parseInt(active-1));
            $.get(rootPath + "/directory/datadirectory_detail/catalog_list",
                {
                    pageNumber:parseInt(active-1),
                    datadirectoryid:$directoryId
                },
                function (data, status) {

                    if (data.result == "success") {

                        var list = data.catalogEntity;

                        for(var i=0;i<list.length;i++){
                            $("#c_item_table_list").append("<tr>" +
                                "<td><a href="+rootPath+'/data?id='+list[i].id+">"+list[i].resourceNo+"</a></td>" +
                                "<td class='longText' title='"+list[i].resourceName+"'>"+list[i].resourceName+"</td>" +
                                "<td>"+list[i].provideDeptCode+"</td>" +
                                "<td>"+list[i].routinePowerDeptCode+"</td>" +
                                "<td>"+list[i].update_time+"</td>" +
                                "</tr>");
                        }

                    } else {
                        dmallError(data.result);
                    }
                },
                "json");
        }else if (pageNumber == ">"){

            $("#c_item_table_list").empty();
            c_initPage(parseInt(active+1));
            $.get(rootPath + "/datadirectory_detail/catalog_list",
                {
                    pageNumber:parseInt(active+1),
                    datadirectoryid:$directoryId
                },
                function (data, status) {

                    if (data.result == "success") {
                        var list = data.catalogEntity;
                        if(list.length != 0){
                            for(var i=0;i<list.length;i++){
                                $("#c_item_table_list").append("<tr>" +
                                    "<td><a href="+rootPath+'/data?id='+list[i].id+">"+list[i].resourceNo+"</a></td>" +
                                    "<td class='longText' title='"+list[i].resourceName+"'>"+list[i].resourceName+"</td>" +
                                    "<td>"+list[i].provideDeptCode+"</td>" +
                                    "<td>"+list[i].routinePowerDeptCode+"</td>" +
                                    "<td>"+list[i].update_time+"</td>" +
                                    "</tr>");
                            }
                        }else{
                            $("#c_item_table_list").append("<tr>" +
                                "<td colspan='6' style='border:0;'>没有查询到数据详情</td>" +
                                "</tr>");
                        }

                    } else {
                        dmallError(data.result);
                    }
                },
                "json");

        }
    }
});

function c_initPage(pageNumber,type) {
    $("#c_pageTag").empty();
    if(pageNumber == 1){
        $("#c_pageTag").append('<li class="disabled c_pageTag"><a>&lt;</a></li>');
    }else{
        $("#c_pageTag").append('<li class="c_pageTag"><a>&lt;</a></li>');
        if(pageNumber >= 3 && c_totalPages >= 5){
            $("#c_pageTag").append('<li class="c_pageTag"><a>1</a></li>');
        }
    }
    if(pageNumber > 3 && c_totalPages > 5){
        $("#c_pageTag").append('<li class="c_pageTag"><a>...</a></li>');
    }
    if((c_totalPages - pageNumber) < 2 && pageNumber > 2){
        if((c_totalPages == pageNumber) && pageNumber > 3){
            $("#c_pageTag").append('<li class="c_pageTag"><a>'+(parseInt(pageNumber) - 3)+'</a></li>');
        }
        $("#c_pageTag").append('<li class="c_pageTag"><a>'+(parseInt(pageNumber) - 2)+'</a></li>');
    }

    if(pageNumber > 1){
        $("#c_pageTag").append('<li class="c_pageTag"><a>'+(parseInt(pageNumber)-1)+'</a></li>');
    }
    $("#c_pageTag").append('<li class="active c_pageTag"><a>'+parseInt(pageNumber)+'</a></li>');
    if((c_totalPages - pageNumber) >= 1){
        $("#c_pageTag").append('<li class="c_pageTag"><a>'+(parseInt(pageNumber)+1)+'</a></li>');
    }
    if(pageNumber <3){
        if((pageNumber + 2) < c_totalPages){
            $("#c_pageTag").append('<li class="c_pageTag"><a>'+(parseInt(pageNumber)+2)+'</a></li>');
        }
        if((pageNumber < 2)&& ((pageNumber + 3) < c_totalPages) ){
            $("#c_pageTag").append('<li class="c_pageTag"><a>'+(parseInt(pageNumber)+3)+'</a></li>');
        }
    }
    if((c_totalPages - pageNumber) >= 3 && c_totalPages > 5){
        $("#c_pageTag").append('<li class="c_pageTag"><a >...</a></li>');
    }

    if(pageNumber == c_totalPages || type == "create"){
        $("#c_pageTag").append('<li class="disabled c_pageTag"><a>&gt;</a></li>');
    }else{
        if((c_totalPages - pageNumber) >= 2){
            $("#c_pageTag").append('<li class="c_pageTag"><a>'+c_totalPages+'</a></li>');
        }
        $("#c_pageTag").append('<li class="c_pageTag"><a>&gt;</a></li>');
    }
}



function viewMeta(obj){
    $(obj).removeAttr('onclick');

    var metacode = $(obj).text();
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
function first_modal_close(){
    $('#viewMetaModal').modal('hide');
}