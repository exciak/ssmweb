
var totalPages;

var id=$("#directoryId").val();
$.get("/dmall/directory/datadirectory/itemDetail/"+id,
    {
        pageNumber:1
    },
    function (data, status) {
        totalPages=data.totalPages;
        console.log(totalPages);
        if (data.result == "success") {
            // var curPage=data.pageNumber;
            // var totalPage=data.totalPages;
            //
            // $("#myPageNumber").append(pageStr);
            var len="";
            var list = data.itemEntity;
            if(list.length == 0){
                totalPages = 1;
            }

            for(var i=0;i<list.length;i++){
                if(list[i].itemChineseName === ""){list[i].itemChineseName = "--";}
                len = list[i].itemLength;
                if(list[i].itemLength == null){
                    len = "";
                }
                var newItemName = htmlEncode(list[i].itemName);
                var newItemChineseName = htmlEncode(list[i].itemChineseName);
                var newItemDesc = htmlEncode(list[i].itemDesc);
                $("#item_table_list").append("<tr>" +
                    "<td>"+list[i].itemNo+"</td>" +
                    "<td class='longText' title='"+list[i].itemName+"'>"+newItemName+"</td>" +
                    "<td class='longText' title='"+list[i].itemChineseName+"'>"+newItemChineseName+"</td>"+
                    "<td>"+list[i].dataItemFormatCode+"</td>" +
                    "<td><a href='javascript:void(0)' onclick='viewMeta(this)'>"+list[i].metadataCode+"</a></td>" +
                    "<td>"+len+"</td>" +
                    "<td class='longText' title='"+newItemDesc+"'>"+newItemDesc+"</td>" +
                    "</tr>");
            }

        } else {
            dmallError(data.result);
        }
        initPage(1,totalPages);
    },
    "json");

//分页js代码


function initPage(pageNumber,type) {

    $("#pageTag").empty();

    var pageSize = 10;              //分页导航每页数
   // var item = $("#listTable tbody tr");
      //分页导航总页数

console.log(totalPages);
    // for(var i=1;i<item.length;i++){
    //     for(var j=(i-1)*10;j<i*10;j++){
    //         item.slice((i-1)*pageSize,i*pageSize).addClass("class"+i);
    //
    //     }
    // }
    // if(item.length%10 == 0){
    //     totalPages = item.length/10;
    //     console.log(totalPages);
    // }else{
    //     totalPages = parseInt(item.length/10)+1;
    //     console.log(totalPages);
    // }

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

    // $('#listTable tbody tr[class="class'+pageNumber+'"]').css("display","table row");
    // console.log($('#listTable tbody tr[class="class'+pageNumber+'"]'));
    // $('#listTable tbody tr[class!="class'+pageNumber+'"]').css("display","none");

}


$("#pageTag").on("click",".pageTag",function (){
    //列表的点击异步请求判断
    if(!$(this).hasClass("disabled")){
        var pageNumber = $(this).children("a").text();
        var active = parseInt($("#pageTag li.active a").text());
        if(pageNumber != "<" && pageNumber != ">" && pageNumber!="..."){
            pageNumber = parseInt(pageNumber);
            initPage(pageNumber);
            request(pageNumber);
        }else if(pageNumber == "<"){
            initPage(parseInt(active-1));
            request(parseInt(active-1));
        }else if (pageNumber == ">"){
            initPage(parseInt(active+1));
            request(parseInt(active+1));
        }else if(pageNumber == "..."){
            request(active);
        }

    }




});
function request(pageNumber) {
    $.get("/dmall/directory/datadirectory/itemDetail/"+id,
        {
            pageNumber:pageNumber
        },
        function (data, status) {

            if (data.result == "success") {
                // var curPage=data.pageNumber;
                // var totalPage=data.totalPages;
                //
                // $("#myPageNumber").append(pageStr);

                var list = data.itemEntity;
                $("#item_table_list").empty();
                for(var i=0;i<list.length;i++){
                    if(list[i].itemChineseName === ""){list[i].itemChineseName = "--";}
                    var newItemName = htmlEncode(list[i].itemName);
                    var newItemChineseName = htmlEncode(list[i].itemChineseName);
                    var newItemDesc = htmlEncode(list[i].itemDesc);
                    $("#item_table_list").append("<tr>" +
                        "<td>"+list[i].itemNo+"</td>" +
                        "<td class='longText' title='"+list[i].itemName+"'>"+newItemName+"</td>" +
                        "<td class='longText' title='"+list[i].itemChineseName+"'>"+newItemChineseName+"</td>"+
                        "<td>"+list[i].dataItemFormatCode+"</td>" +
                        "<td><a href='javascript:void(0)' onclick='viewMeta(this)'>"+list[i].metadataCode+"</a></td>" +
                        "<td>"+list[i].itemLength+"</td>" +
                        "<td class='longText' title='"+list[i].itemDesc+"'>"+newItemDesc+"</td>" +
                        "</tr>");
                }

            } else {
                dmallError(data.result);
            }
        },
        "json");
}



$("#submit").click(function () {
    history.go(-1);
})
$("#esc").click(function () {
    history.go(-1);
})
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
