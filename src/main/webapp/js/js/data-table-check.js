
var dataTableNo = $("#tableNo").val();
var totalPages;
$.get("/dmall/appsystems/datatable/"+dataTableNo+"/items",
    {
        pageNumber:1
    },
    function (data, status) {

        if (data.result == "success") {

            var list = data.dataTableItemList;
            totalPages = data.totalPage;

            for(var i=0;i<list.length;i++){
                if(list[i].dataItemFormatCode === null){list[i].dataItemFormatCode = "";}
                if(list[i].itemLength === null){list[i].itemLength = "";}
                $("#item_table_list").append("<tr>" +
                    "<td>"+list[i].itemNo+"</td>" +
                    "<td class='longText' title='"+htmlEncode(list[i].itemName)+"'>"+htmlEncode(list[i].itemName)+"</td>" +
                    "<td>"+list[i].dataItemFormatCode+"</td>" +
                    "<td><a href='javascript:void(0)' onclick='viewMeta(this)'>"+list[i].metadataCode.split(" ")[0]+"</a></td>" +
                    "<td>"+list[i].itemLength+"</td>" +
                    "<td class='longText' title='"+htmlEncode(list[i].itemDesc)+"'>"+htmlEncode(list[i].itemDesc)+"</td>" +
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
        if(pageNumber != "<" && pageNumber != ">" && pageNumber!="..."){
            $("#item_table_list").empty();
            pageNumber = parseInt(pageNumber);
            initPage(pageNumber);
            $.get("/dmall/appsystems/datatable/"+dataTableNo+"/items",
                {
                    pageNumber:pageNumber
                },
                function (data, status) {

                    if (data.result == "success") {

                        var list = data.dataTableItemList;

                        for(var i=0;i<list.length;i++){
                            if(list[i].dataItemFormatCode === null){list[i].dataItemFormatCode = "";}
                            if(list[i].itemLength === null){list[i].itemLength = "";}
                            $("#item_table_list").append("<tr>" +
                                "<td>"+list[i].itemNo+"</td>" +
                                "<td class='longText' title='"+htmlEncode(list[i].itemName)+"'>"+htmlEncode(list[i].itemName)+"</td>" +
                                "<td>"+list[i].dataItemFormatCode+"</td>" +
                                "<td><a href='javascript:void(0)' onclick='viewMeta(this)'>"+list[i].metadataCode.split(" ")[0]+"</a></td>" +
                                "<td>"+list[i].itemLength+"</td>" +
                                "<td class='longText' title='"+htmlEncode(list[i].itemDesc)+"'>"+htmlEncode(list[i].itemDesc)+"</td>" +
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
            $.get("/dmall/appsystems/datatable/"+dataTableNo+"/items",
                {
                    pageNumber:parseInt(active-1)
                },
                function (data, status) {

                    if (data.result == "success") {

                        var list = data.dataTableItemList;

                        for(var i=0;i<list.length;i++){
                            if(list[i].dataItemFormatCode === null){list[i].dataItemFormatCode = "";}
                            if(list[i].itemLength === null){list[i].itemLength = "";}
                            $("#item_table_list").append("<tr>" +
                                "<td>"+list[i].itemNo+"</td>" +
                                "<td class='longText' title='"+htmlEncode(list[i].itemName)+"'>"+htmlEncode(list[i].itemName)+"</td>" +
                                "<td>"+list[i].dataItemFormatCode+"</td>" +
                                "<td><a href='javascript:void(0)' onclick='viewMeta(this)'>"+list[i].metadataCode.split(" ")[0]+"</a></td>" +
                                "<td>"+list[i].itemLength+"</td>" +
                                "<td class='longText' title='"+htmlEncode(list[i].itemDesc)+"'>"+htmlEncode(list[i].itemDesc)+"</td>" +
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
            $.get("/dmall/appsystems/datatable/"+dataTableNo+"/items",
                {
                    pageNumber:parseInt(active+1)
                },
                function (data, status) {

                    if (data.result == "success") {

                        var list = data.dataTableItemList;
                        if(list.length != 0){

                            for(var i=0;i<list.length;i++){
                                if(list[i].dataItemFormatCode === null){list[i].dataItemFormatCode = "";}
                                if(list[i].itemLength === null){list[i].itemLength = "";}
                                $("#item_table_list").append("<tr>" +
                                    "<td>"+list[i].itemNo+"</td>" +
                                    "<td class='longText' title='"+htmlEncode(list[i].itemName)+"'>"+htmlEncode(list[i].itemName)+"</td>" +
                                    "<td>"+list[i].dataItemFormatCode+"</td>" +
                                    "<td><a href='javascript:void(0)' onclick='viewMeta(this)'>"+list[i].metadataCode.split(" ")[0]+"</a></td>" +
                                    "<td>"+list[i].itemLength+"</td>" +
                                    "<td class='longText' title='"+htmlEncode(list[i].itemDesc)+"'>"+htmlEncode(list[i].itemDesc)+"</td>" +
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
    console.log(totalPages);
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
                $("#viewMetaModal").modal("hide");
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
//返回
$("#submit").click(function () {
    history.go(-1);
});