//数据目录字段数
var directoryLen = 10;
$(document).ready(function () {
    emptyDirectory(3);
    selectChange(3);
})
function selectChange(count) {
    var selectedVersion = $("#version_old option:selected").val();
    var newVersion = $("#version option:selected").val();
    emptyDirectory(count);
    $.get(rootPath + "/directory/datadirectory/compare/directory", {
            directoryNo:$("#directoryNo").text(),
            oldVersion:selectedVersion,
            newlyVersion:newVersion
        },
        function (data) {
            if (data.result == "success") {
                var entity = data.oldStr;
                drawDirectory(entity,3);
                drawDirectory(entity,2);
                var rightitem = data.oldItemList;
                var leftitem = data.newItemList;
                var maxSize = rightitem.length>leftitem.length?rightitem.length:leftitem.length
                drawItem(leftitem,2,maxSize);
                drawItem(rightitem,3,maxSize);
                compareDirectory();
                compareItem(leftitem,rightitem,maxSize);


            }else{
                dmallError(data.result);
            }
        })
}
function drawDirectory(entity,count){
    for(var j = 1;j <= 9;j++){
        $("#dataTable tr:nth-child("+j+") td:nth-child("+count+")").attr("title",entity[j-1]);
        $("#dataTable tr:nth-child("+j+") td:nth-child("+count+")").text(entity[j-1]);
    }
    compareDirectory();
}
function drawItem(item,count,maxItemLen) {
    var lastItemLen = $("#dataTable tr").length-directoryLen;
    if(lastItemLen >= maxItemLen){
        for(var i = 1;i <= maxItemLen;i++){
            var no = item[i - 1].itemNo;
            $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child("+count+")").attr("title",item[i-1].itemNo == null?"":item[i-1].itemNo);
            $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child("+count+")").text(item[i-1].itemNo == null?"":item[i-1].itemNo);

        }
        for(var i = lastItemLen;i >= maxItemLen+1;i--){
            $("#dataTable tr:nth-child("+(directoryLen+i)+")").remove();
        }
    }else{
        for(var i = lastItemLen+1;i <= maxItemLen;i++){
            $("#dataTable").append("<tr><td style='text-align:right'>数据项</td></tr>")
            $("#dataTable tr:nth-child("+(directoryLen+i)+")").append("<td class='longText' title=''id=''></td>");
            $("#dataTable tr:nth-child("+(directoryLen+i)+")").append("<td class='longText' title=''id=''></td>");
        }
        for(var i = 1;i <= maxItemLen;i++){
            $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child("+count+")").attr("title",item[i-1].itemNo == null?"":item[i-1].itemNo);
            $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child("+count+")").text(item[i-1].itemNo == null?"":item[i-1].itemNo);
        }
    }


}
function emptyDirectory(i){
    for(var j = 1;j <= 9;j++)
    $("#dataTable tr:nth-child("+j+") td:nth-child("+i+")").attr("title","");
    $("#dataTable tr:nth-child("+j+") td:nth-child("+i+")").text("")

}


function compareDirectory(){
    for(var i = 1;i <= directoryLen;i ++){
        var directoryNew = $("#dataTable tr:nth-child("+i+") td:nth-child(2)").text().trim();
        var directoryOld = $("#dataTable tr:nth-child("+i+") td:nth-child(3)").text().trim();
        if(directoryNew != directoryOld){
            $("#dataTable tr:nth-child("+i+") td:nth-child(2)").css("color", "red");
            $("#dataTable tr:nth-child("+i+") td:nth-child(3)").css("color", "red");
        }else{
            $("#dataTable tr:nth-child("+i+") td:nth-child(2)").css("color", "black");
            $("#dataTable tr:nth-child("+i+") td:nth-child(3)").css("color", "black");
        }
    }
}
var newlyItemAll1,oldItemAll1,newlyItemAll,oldItemAll =[];
function  compareItem(leftitem,rightitem,maxSize) {
    for(var i = 1;i <= maxSize;i ++){
        var directoryNew = $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child(2)").text().trim();
        var directoryOld = $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child(3)").text().trim();
        if(directoryNew != directoryOld){
            var newlyItemAll1 = leftitem[i-1].itemNo+"+"+leftitem[i-1].itemName+"+"+leftitem[i-1].itemChineseName+"+"+leftitem[i-1].dataItemFormatCode+"+"+leftitem[i-1].metadataCode+"+"+leftitem[i-1].itemLength+"+"+leftitem[i-1].itemDesc;
            var oldItemAll1 = rightitem[i-1].itemNo+"+"+rightitem[i-1].itemName+"+"+rightitem[i-1].itemChineseName+"+"+rightitem[i-1].dataItemFormatCode+"+"+rightitem[i-1].metadataCode+"+"+rightitem[i-1].itemLength+"+"+rightitem[i-1].itemDesc;
            $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child(2)").text(" ");
            $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child(2)").append('<a href="javascript:void(0)" style="color:red" onclick = "openCompareItem('+"'"+newlyItemAll1+"'"+','+"'"+oldItemAll1+"'"+')">'+directoryNew+'</a>');
            $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child(3)").text(" ");
            $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child(3)").append('<a href="javascript:void(0)" style="color:red" onclick = "openCompareItem('+"'"+newlyItemAll1+"'"+','+"'"+oldItemAll1+"'"+')">'+directoryOld+'</a>');
        }else{
            // $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child(2)").empty();
            // $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child(2)").text(directoryNew)
            // $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child(3)").css("color", "black");
            var newlyItemAll = leftitem[i-1].itemNo+"+"+leftitem[i-1].itemName+"+"+leftitem[i-1].itemChineseName+"+"+leftitem[i-1].dataItemFormatCode+"+"+leftitem[i-1].metadataCode+"+"+leftitem[i-1].itemLength+"+"+leftitem[i-1].itemDesc;
            var oldItemAll = rightitem[i-1].itemNo+"+"+rightitem[i-1].itemName+"+"+rightitem[i-1].itemChineseName+"+"+rightitem[i-1].dataItemFormatCode+"+"+rightitem[i-1].metadataCode+"+"+rightitem[i-1].itemLength+"+"+rightitem[i-1].itemDesc;
            $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child(2)").text(" ");
            $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child(2)").append('<a href="javascript:void(0)"  onclick = "openCompareItem('+"'"+newlyItemAll+"'"+','+"'"+oldItemAll+"'"+')">'+directoryNew+'</a>');
            $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child(3)").text(" ");
            $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child(3)").append('<a href="javascript:void(0)"  onclick = "openCompareItem('+"'"+newlyItemAll+"'"+','+"'"+oldItemAll+"'"+')">'+directoryOld+'</a>');

            if(newlyItemAll != oldItemAll){
                $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child(2)").text(" ");
                $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child(2)").append('<a href="javascript:void(0)" style="color:red" onclick = "openCompareItem('+"'"+newlyItemAll+"'"+','+"'"+oldItemAll+"'"+')">'+directoryNew+'</a>');
                $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child(3)").text(" ");
                $("#dataTable tr:nth-child("+(directoryLen+i)+") td:nth-child(3)").append('<a href="javascript:void(0)" style="color:red" onclick = "openCompareItem('+"'"+newlyItemAll+"'"+','+"'"+oldItemAll+"'"+')">'+directoryOld+'</a>');
            }

        }
    }

}
function openCompareItem(new_ItemAll,old_ItemAll) {
    var newItem = [];
    var oldItem = [];
    console.log(old_ItemAll);
    newItem = new_ItemAll.split("+");
    oldItem = old_ItemAll.split("+");
    console.log(newItem[4]=="null"?"":newItem[4]);
    console.log(oldItem[4]=="null"?"":oldItem[4]);
    $('#compareItem').modal({backdrop: 'static', keyboard: false});
    for(var i = 1; i <= 7; i++){
        $("#dataTable1 tr:nth-child("+i+") td:nth-child(2)").attr("title","");
        $("#dataTable1 tr:nth-child("+i+") td:nth-child(2)").text("");
        $("#dataTable1 tr:nth-child("+i+") td:nth-child(2)").empty();
        $("#dataTable1 tr:nth-child("+i+") td:nth-child(3)").empty();
        if(newItem[i-1] != oldItem[i-1]){
            $("#dataTable1 tr:nth-child("+i+") td:nth-child(2)").css("color","red")
            $("#dataTable1 tr:nth-child("+i+") td:nth-child(3)").css("color","red")
        }else{
            $("#dataTable1 tr:nth-child("+i+") td:nth-child(2)").css("color","black")
            $("#dataTable1 tr:nth-child("+i+") td:nth-child(3)").css("color","black")
        }
        if(i == 5){
            if(newItem[4] != oldItem[4]){
                $("#dataTable1 tr:nth-child("+i+") td:nth-child(2)").append("<a href='javascript:void(0)' style='color:red' onclick = 'viewMeta(this)'>"+(newItem[i-1]=="null"?"":newItem[i-1])+"</a>")
                $("#dataTable1 tr:nth-child("+i+") td:nth-child(3)").append("<a href='javascript:void(0)' style='color:red' onclick = 'viewMeta(this)'>"+(oldItem[i-1]=="null"?"":oldItem[i-1])+"</a>")
            }else{
                $("#dataTable1 tr:nth-child("+i+") td:nth-child(2)").append("<a href='javascript:void(0)' onclick = 'viewMeta(this)'>"+(newItem[i-1]=="null"?"":newItem[i-1])+"</a>")
                $("#dataTable1 tr:nth-child("+i+") td:nth-child(3)").append("<a href='javascript:void(0)' onclick = 'viewMeta(this)'>"+(oldItem[i-1]=="null"?"":oldItem[i-1])+"</a>")
            }
        }else{
            $("#dataTable1 tr:nth-child("+i+") td:nth-child(2)").attr("title",newItem[i-1]=='null'||""?"":newItem[i-1]);
            $("#dataTable1 tr:nth-child("+i+") td:nth-child(2)").text(newItem[i-1]=='null'||""?"":newItem[i-1]);
            $("#dataTable1 tr:nth-child("+i+") td:nth-child(3)").attr("title",oldItem[i-1]=='null'||""?"":oldItem[i-1]);
            $("#dataTable1 tr:nth-child("+i+") td:nth-child(3)").text(oldItem[i-1]=='null'||""?"":oldItem[i-1]);
        }
    }
    newlyItemAll1,oldItemAll1,newlyItemAll,oldItemAll =[];
}
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
