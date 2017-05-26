/**
 * Created by yi on 2017/3/22.
 */
var pathname = window.location.pathname;
var list = pathname.split("/");
var proName = list[1];
var rootPath = "http://" + window.location.host + "/" + proName;

//数据项编号详情
function openDataItem(itemNo) {
    getDataItemDetailList(itemNo);
}
//获取数据项编号详情
function getDataItemDetailList(itemNo) {
    var html = '';
    $('#dataItemDetail').empty();
    if(itemNo.length > 20){
        $.get(rootPath + "/appsystems/item",
            {
                itemNo:itemNo
            },
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    //打开模态框
                    $('#addDataItemDetail').modal({backdrop: 'static', keyboard: false});
                    var obj = data.dataTableItemModel;
                    $.each(obj, function (key, val) {
                        if(key != 'itemLength'){
                            if(val == null || val == '')obj[key] = '--';
                        }else {
                            if(val === null || val === '')obj[key] = '--';
                        }

                    });
                    html += '<div class="form-group"><div class="col-sm-5">数据项编号：</div><div class="col-sm-7">'+ obj.itemNo +'</div></div>';
                    html += '<div class="form-group"><div class="col-sm-5">数据项名称：</div><div class="col-sm-7">'+ obj.itemName +'</div></div>';
                    html += '<div class="form-group"><div class="col-sm-5">数据格式类型：</div><div class="col-sm-7">'+ obj.dataItemFormatCode +'</div></div>';
                    html += '<div class="form-group"><div class="col-sm-5">数据元内容标识符：</div><div class="col-sm-7 a-admin"><a href="javascript:void(0)" onclick="addMetaDetail(this)">'+ obj.metadataCode +'</a></div></div>';
                    html += '<div class="form-group"><div class="col-sm-5">数据项长度：</div><div class="col-sm-7">'+ obj.itemLength +'</div></div>';
                    html += '<div class="form-group"><div class="col-sm-5">数据项描述：</div><div class="col-sm-7">'+ obj.itemDesc +'</div></div>';
                    html += '<div class="form-group"><div class="col-sm-5">所属数据表编号：</div><div class="col-sm-7">'+ obj.dataTableNo +'</div></div>';
                    html += '<div class="form-group"><div class="col-sm-5">所属数据表名称：</div><div class="col-sm-7">'+ obj.dataTableName +'</div></div>';
                    html += '<div class="form-group"><div class="col-sm-5">所属应用系统编号：</div><div class="col-sm-7">'+ obj.appSystemNo +'</div></div>';
                    html += '<div class="form-group"><div class="col-sm-5">所属应用系统名称：</div><div class="col-sm-7">'+ obj.appSystemName +'</div></div>';
                    if(obj.isDicItem == true){
                        html += '<div class="form-group"><div class="col-sm-5">参照字典表_数据表编号：</div><div class="col-sm-7">'+ obj.dicDataTableNo +'</div></div>';
                        html += '<div class="form-group"><div class="col-sm-5">字典表代码列_数据项编号：</div><div class="col-sm-7">'+ obj.dicCodeItemNo +'</div></div>';
                        html += '<div class="form-group"><div class="col-sm-5">字典表描述列_数据项编号：</div><div class="col-sm-7">'+ obj.dicDescItemNo +'</div></div>';
                        if(obj.dicDataTableDicTypeCode == 'DIC_LH'){
                            html += '<div class="form-group"><div class="col-sm-5">数据项编号_联合字典分组列：</div><div class="col-sm-7">'+ obj.lhDicItemNo +'</div></div>';
                            html += '<div class="form-group"><div class="col-sm-5">分组代码_联合字典分组列：</div><div class="col-sm-7">'+ obj.lhDicGroupCode +'</div></div>';
                        }
                    }
                    $('#dataItemDetail').html(html);
                } else {
                    html = '<div class="form-group">获取数据失败</div>';
                    $('#dataItemDetail').html(html);
                    dmallError("获取数据项失败");
                }
            },
            "json"
        );
    }else{
        $.get(rootPath + "/directory/item",
            {
                itemNo:itemNo
            },
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    //打开模态框
                    $('#addDataItemDetail').modal({backdrop: 'static', keyboard: false});
                    var obj = data.directoryItemModel;
                    $.each(obj, function (key, val) {
                        if(val == null || val == '')obj[key] = '--';
                    });
                    html += '<div class="form-group"><div class="col-sm-5">数据项编号：</div><div class="col-sm-7">'+ obj.itemNo +'</div></div>';
                    html += '<div class="form-group"><div class="col-sm-5">数据项名称：</div><div class="col-sm-7">'+ obj.itemName +'</div></div>';
                    html += '<div class="form-group"><div class="col-sm-5">数据项中文名称：</div><div class="col-sm-7">'+ obj.itemChineseName +'</div></div>';
                    html += '<div class="form-group"><div class="col-sm-5">数据格式类型：</div><div class="col-sm-7">'+ obj.dataItemFormatCode +'</div></div>';
                    html += '<div class="form-group"><div class="col-sm-5">数据元内容标识符：</div><div class="col-sm-7 a-admin"><a href="javascript:void(0)" onclick="addMetaDetail(this)">'+ obj.metadataCode +'</a></div></div>';
                    html += '<div class="form-group"><div class="col-sm-5">数据项长度：</div><div class="col-sm-7">'+ obj.itemLength +'</div></div>';
                    html += '<div class="form-group"><div class="col-sm-5">数据项描述：</div><div class="col-sm-7">'+ obj.itemDesc +'</div></div>';
                    $('#dataItemDetail').html(html);
                } else {
                    html = '<div class="form-group">获取数据失败</div>';
                    $('#dataItemDetail').html(html);
                    dmallError("获取数据项失败");
                }
            },
            "json"
        );
    }
}

//获取数据项详情
$('.toDataItemDetail').click(function (e) {
    e.preventDefault();
    var itemNo = $(this).html();
    openDataItem(itemNo);
});

//数据元标识符部分
var pathname = window.location.pathname;
var prjName;
var arrOther = pathname.split("/");
prjName = arrOther[1];
function addMetaDetail(obj){
    $(obj).removeAttr('onclick');

    var metacode = $(obj).text();
    $('#metaDetailDiv').empty();
    $("#addMetaDetail").data("metacode",metacode);
    $.get("/" + prjName + "/metadata/detail",
        {
            metaCode:metacode
            // cateCode:catecode
        },function(data,status){
            $(obj).attr('onclick', 'addMetaDetail(this);');
            if(data.result != "success"){
                dmallError(data.result);
            }else{
                var meta_data = eval("(" + data.metadata + ")");
                if(meta_data.message != "success"){
                    dmallError(meta_data.message);
                }else{
                    $("#addMetaDetail").modal({backdrop:'static', keyboard: false});
                    $("#metaDetailDiv div").remove();
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
                            if(i == 'categories'){
                                $("#addMetaDetail").data("catecode",j);
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
                                '<a href="javascript:void(0)" onclick="addValueRangeDetail()" class="fa fa-file-text-o text-primary oper-icon-2"></a></td><td style="border:0"></td>';
                            if (num % 3 == 2) {
                                htmlStr += '</tr>';
                            }
                            num++;
                        }
                        if (num % 3 != 0) {
                            htmlStr += '</tr>';
                        }
                        htmlStr += '</table></div>';
                        $("#metaDetailDiv").append(htmlStr);
                    }
                    // var htmlStr1 = '<div style="width:100%"><h5 style="color: #00B4DF"><strong>所属类目</strong></h5><table style="border-bottom:0" class="table">'+
                    //     '<thead><tr><td style="width: 100%"></td></tr></thead>'
                    // var metacate = data.qname;
                    // var cate = metacate.split(".").join(" > ").replace(">","：");
                    // htmlStr1 += '<tr><td class="text-left">' + cate + '</td></tr></table></div>';
                    // $("#metaDetailDiv").append(htmlStr1);
                }
            }
        },"json");


    
}

function addValueRangeDetail(){
    $('#addMetaDetail').modal('hide');
    $('#addDataItemDetail').modal('hide');
    $('#addValueRangeDetail').modal('hide');
    $('#addValueRangeDetail').modal({backdrop: 'static', keyboard: false});
    $("#valueRangeDetailTable tr:not(:first)").remove();
    var metacode = $("#addMetaDetail").data("metacode");
    var catecode = $("#addMetaDetail").data("catecode");
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
                            trHTML += '<tr><td>' +parseInt(j+1)+ '</td><td>' + vrList[j].name + '</td><td>' + vrList[j].code + '</td><td></td></tr>';
                        }
                    }
                    trHTML += '</tbody>';
                }else{
                    var trHTML = '<tfoot><tr><td>该数据元没有值域</td></tr></tfoot>';
                }
                $("#valueRangeDetailTable").append(trHTML);
            }
        },"json");
}

function valueRange_modal_close(){
    $('#addValueRangeDetail').hide();
    $('#addValueRangeDetail').modal('hide');
    $('#addMetaDetail').modal({backdrop: 'static', keyboard: false});
}
function metaDetail_modal_close() {
    $('#addMetaDetail').modal('hide');
    $('#addDataItemDetail').modal({backdrop: 'static', keyboard: false});
}






