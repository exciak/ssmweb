var prjName;
var totalNum;
$(document).ready(function () {
    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    prjName = arr[1];




    getNewData();
    getNewHot(1);
    // var Number = parseInt($("#markPage").val());

});
// 针对结构化的下载文件地址，进行替换
if($("#urlDiv").text() == "file-address") {
    $("#urlDiv").text(window.location.href.replace(/\/data\/?\?id/, '/data/down?id'));
}
var string = $("#dataApiUrl p").text();
$("#dataApiUrl p").text(delBracket(string));

var typeCode = $('#inputHiddenresourceTypeCode').val();
if (typeCode == "DATAAPI") {
    $("#menu-catalog").removeClass("active");
    $("#menu-dataapi").addClass("active");
}

var grading = $('#grading').attr('value');
if (grading) {
    var pe = grading / 5 * 100;
    $('.big_star_index')[0].style.width = pe + '%';
} else {
    $('.big_star_index')[0].style.width = '0%';
}

var dbAccessId = $("#dbAccessId").val();
if(dbAccessId != undefined && dbAccessId !=""){
    getDbSrcById(dbAccessId,$("#dbTypeDiv"));
}
var exchangeType = $("#exchangeType").val();
var maskedDbAccessId = $("#maskedDbAccessId").val();
if(exchangeType == "SECURE" && maskedDbAccessId != undefined){
    getDbSrcById(maskedDbAccessId,$("#maskedDbTypeDiv"));
}

$(function () {
    var selfGrading = $('#inputHiddenMyGrading').val();
    if (selfGrading) {
        $('#examplem').barrating({
            theme: 'fontawesome-stars',
            readonly: true,
            initialRating: selfGrading
        })
    } else {
        $('#examplem').barrating({
            theme: 'fontawesome-stars',
            onSelect: function (value) {
                $.post("data/comment",
                    {
                        dataId: $("#dataId").val(),
                        grading: value
                    },
                    function (data, status) {
                        $('#examplem').barrating('destroy');
                        $('#examplem').barrating({
                            theme: 'fontawesome-stars',
                            readonly: true
                        })
                        if (data.result != "success") {
                            dmallError(data.result);
                        } else {
                            var pr = data.grading / 5 * 100;
                            $('.big_star_index')[0].style.width = pr + '%';
                            $('#grading').html(data.grading.toFixed(1));
                        }
                    },
                    "json");
            }
        });
    }
});

//右侧相关信息的数据异步请求
$("#decData").attr("disabled",true);
    $("#incData").click(function () {
        $("#newDataHot .row").remove();
        if(parseInt($("#markPage").val()) < totalNum) {
            $("#decData").attr("disabled",false);
            getNewHot(parseInt($("#markPage").val()) + 1);
            $("#markPage").val(parseInt($("#markPage").val()) + 1);
            console.log($("#markPage").val());
            if($("#markPage").val() == totalNum){
                $("#incData").attr("disabled",true);
            }

        }else{
            $("#incData").attr("disabled",true);
        }
    });


    $("#decData").click(function () {
        $("#newDataHot .row").remove();
        if(parseInt($("#markPage").val())>1){
            $("#incData").attr("disabled",false);
            getNewHot(parseInt($("#markPage").val())-1);
            $("#markPage").val(parseInt($("#markPage").val())-1);
            console.log($("#markPage").val());
            if($("#markPage").val() == 1){
                $("#decData").attr("disabled",true);
            }

        }else{
            $("#decData").attr("disabled",true);
        }
    });


function getDataByDept(deptCode, resourceTypeCode) {
    document.cookie = "deptCode=" + deptCode + "; path=/";
    if (resourceTypeCode == 'DATAAPI')
        window.location.href = "dataapi";
    else
        window.location.href = "catalog";
}
//将行业的相应属性存入cookie
function getDataListByIndustryCode(industryId, resourceTypeCode) {
    document.cookie = "industry=" + industryId + "; path=/";

    console.log(document.cookie);
    if (resourceTypeCode == 'DATAAPI') {
        window.location.href = "dataapi";
    }
    else {
        window.location.href = "catalog";
    }
}
//将行业类别的相应属性存入cookie
function getDataListByBusinessCode(industryId, resourceTypeCode) {
    console.log(industryId);
    document.cookie = "industryId=" + industryId + "; path=/";
    document.cookie = "industryCode=ZNB";
    console.log(document.cookie);
    if (resourceTypeCode == 'DATAAPI') {
        window.location.href = "dataapi";
    }
    else {
        window.location.href = "catalog";
    }
}





function viewMeta(obj){
    $(obj).removeAttr('onclick');
    var metacode = obj.name;
    var catecode = $.trim( $(obj).parent().next().text() );
    $("#viewMetaModal").data("metacode",metacode);
    $("#viewMetaModal").data("catecode",catecode);
    $.get("/" + prjName + "/metadata/detail",
        {
            metaCode:metacode,
            cateCode:catecode
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
                        var htmlStr = '';
                        htmlStr += '<div style="width:100%"><h5 style="color: #00B4DF"><strong>' + i + '</strong></h5><table style="border-bottom:0" class="table" width="100%">' +
                            '<thead><tr><td style="width:12%"></td><td style="width:20%"></td><td style="width:2%"></td><td style="width:12%"></td>' +
                            '<td style="width:20%"></td><td style="width:2%"></td><td style="width:12%"></td><td style="width:20%"></td></tr></thead>';
                        var num = 0;
                        var detail = metadata[i];
                        for (var j in detail) {
                            if (num % 3 == 0) {
                                htmlStr += '<tr>';
                            }
                            htmlStr += '<th class="text-left">' + j + '</th><td class="text-left"><span>' + detail[j] + '</span></td>';
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
                    var htmlStr1 = '<div style="width:100%"><h5 style="color: #00B4DF"><strong>所属类目</strong></h5><table style="border-bottom:0" class="table">'+
                        '<thead><tr><td style="width: 100%"></td></tr></thead>'
                    var metacate = data.qname;
                    var cate = metacate.split(".").join(" > ").replace(">","：");
                    htmlStr1 += '<tr><td class="text-left">' + cate + '</td></tr></table></div>';
                    $("#metaDetail").append(htmlStr1);
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
                            trHTML += '<tr><td>' + vrList[j].id + '</td><td>' + vrList[j].name + '</td><td>' + vrList[j].code + '</td><td>' + vrList[j].rule + '</td></tr>';
                        }else{
                            trHTML += '<tr><td>' + vrList[j].id + '</td><td>' + vrList[j].name + '</td><td>' + vrList[j].code + '</td><td></td></tr>';
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



function getNewHot(pageNumber){
    $.get("catalog/service/catalogs",
        {
            pageNumber: pageNumber,
            pageSize:4,
            dataDirectoryId:$("#directoryId").val(),
            industryCode:$("#industryCode").val(),
            businessCode:$("#businessCode").val(),
            data1stName:$("#data1stName").val(),
            data2ndName:$("#data2ndName").val(),
            dataDetailName:$("#dataDetailName").val(),
            dataPropertyName:$("#dataPropertyName").val(),
            orderName: "view",
            orderSort: "desc"
        },
        function (data, status) {

            if ((status == "success") && (data.result == "success")) {
                $("markPage").val(pageNumber);
                totalNum = data.totalPages;
                console.log(totalNum);
                if(totalNum == 1){$("#incData").attr("disabled",true);}
                for (i = 0; i < data.catalogList.length; i++) {
                    var catalogModel = data.catalogList[i];
                    // var className = "";
                    // if(catalogModel.resourceTypeCode == "ODPS" || catalogModel.resourceTypeCode == "RDS"
                    //     || catalogModel.resourceTypeCode == "ADS" || catalogModel.resourceTypeCode == "VIRTUAL"){
                    //     className = catalogModel.resourceTypeCode;
                    // } else{
                    //     className = catalogModel.resourceParamType;
                    // }
                    $("#newDataHot").append('<div class="row backEmpty" style="margin-bottom:10px;">'+
                        // '<div class="col-md-2 fileType type'+className+'" ></div>'+
                        '<div class="col-md-5 col-md-offset-2 longText"><a href="'+rootPath+'/data?id=' + catalogModel.id + '&isDept=true" title="' + htmlEncode(catalogModel.resourceName) + '">' + htmlEncode(catalogModel.resourceName) + '</a></div>'+
                        '</div>'+
                        '<div class="row backEmpty" style="margin-bottom:25px;">'+
                        '<div class="col-md-2"></div>'+
                        '<div class="col-md-10">'+
                        '<div class="col-md-6 longText" style="padding-left:0px;" title="'+catalogModel.routinePowerDeptName+'"><span>'+catalogModel.routinePowerDeptName+'</span></div>&nbsp;|&nbsp;<span>共享</span>&nbsp;<span>浏览&nbsp;(<b style="color:red;font-weight:normal">'+catalogModel.view+'</b>)</span>'+
                    '</div>'+
                    '</div>');

                }
            } else {
                dmallError("获取最热数据失败");
            }
        },
        "json"
    );
}

function getNewData(){
    $.get("catalog/service/catalogs",
        {
            pageNumber: 1,
            pageSize:3,
            industryCode:$("#industryCode").val(),
            orderName: "cs_catalog.update_time",
            orderSort: "desc"
        },
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {

                for (var i = 0; i < data.catalogList.length; i++) {
                    var catalogModel = data.catalogList[i];
                    $("#newData").append('<div class="row" style="margin-bottom:10px;">'+
                        '<div class="col-md-2" ></div>'+
                        '<div class="col-md-5 longText"><a href="'+rootPath+'/data?id=' + catalogModel.id + '&isDept=true" title="' + htmlEncode(catalogModel.resourceName) + '">' + htmlEncode(catalogModel.resourceName) + '</a></div>'+
                        '</div>'+
                        '<div class="row" style="margin-bottom:25px;">'+
                        '<div class="col-md-2"></div>'+
                        '<div class="col-md-5"><span class="big_star" style="cursor:default"><span class="big_star_indexI" style="width:'+catalogModel.grading / 5 * 100+'%"></span></span></div>'+
                        '<div class="col-md-1" hidden ><span id="gradingI" value="'+catalogModel.grading+'">'+catalogModel.grading +'</span></div>'+
                        '<div class="col-md-5" style="color:red;">'+catalogModel.collection+'人已下载</div>'+
                        '</div>');
                }
            }else{
                dmallError("获取最新数据失败");
            }
        },
        "json"
    );
}

$("section>div:nth-child(2)").css("height",$("section").css("height"));
// console.log($("section").css("height"));