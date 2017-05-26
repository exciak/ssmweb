var pathname = window.location.pathname;
var arr = pathname.split("/");
var prjName = arr[1];
$(document).ready(function () {
    var $backRoute = document.referrer;
    var initBackRoute = "";
    var deptName = $("#deptName").val();
    var vindicatorName = $("#vindicatorName").val();
    deptName = formatString(deptName,10);
    vindicatorName = formatString(vindicatorName,10);
    $("#providerNameValue").text(deptName);
    $("#vindicatorNameValue").text(vindicatorName);

    function init() {
        if ($backRoute === "") {
            initBackRoute = $("#action").val();
        } else if ($backRoute === window.location.href) {
            initBackRoute = $("#action").val();
        } else {
            initBackRoute = $backRoute;
        }
        var dbAccessId = $("#dbAccessId").val();
        if(dbAccessId != undefined){
            getDbSrcById(dbAccessId,$("#dbAccessIdDiv"),$("#dbTypeDiv"));
        }
        var exchangeType = $("#exchangeType").val();
        var maskedDbAccessId = $("#maskedDbAccessId").val();
        if(exchangeType == "SECURE" && maskedDbAccessId != undefined){
            getDbSrcById(maskedDbAccessId,$("#maskedDbAccessIdDiv"),$("#maskedDbTypeDiv"));
        }
        var string = $("#dataApiUrl").text();
        $("#dataApiUrl").text(delBracket(string));
    }
    init();
    //根据数据源ID获取数据源
    function getDbSrcById(dbAccessId,$selectorName,$selectorType) {
        $.get("/" + prjName + "/dbaccess/dbaccess_detail",
            {
                dbaccessID:dbAccessId,
                usage: "catalog"
            },
            function (data, status) {
                if (status == "success" && data.result == "success") {
                    $selectorName.html('<strong>数据源：</strong>'+data.dbaccess.name);
                    var type = data.dbaccess.type;
                    $selectorType.html('<strong>数据库类型：</strong>'+type);
                } else {
                    dmallError("获取数据源失败");
                }
            },
            "json"
        );
    }
    $("#backLastPage").click(function () {
        location.href = initBackRoute;
    });

    $("#previouspage").click(
        function () {
            if (parseInt($("#currentPage").text()) > 1) {
                var id = $("#createListModal").data("resid");
                getCreateList(id,parseInt($("#currentPage").text()) - 1);
            }
        });

    $("#nextpage").click(
        function () {
            if (parseInt($("#currentPage").text()) < parseInt($("#totalPage").text())) {
                var id = $("#createListModal").data("resid");
                getCreateList(id,parseInt($("#currentPage").text()) + 1);
            }
        });

    $("#previouspageDownHis").click(
        function () {
            if (parseInt($("#currentPageDownHis").text()) > 1) {
                var id = $("#downHisListModal").data("resid");
                getDownHisList(id,parseInt($("#currentPageDownHis").text()) - 1);
            }
        });

    $("#nextpageDownHis").click(
        function () {
            if (parseInt($("#currentPageDownHis").text()) < parseInt($("#totalPageDownHis").text())) {
                var id = $("#downHisListModal").data("resid");
                getDownHisList(id,parseInt($("#currentPageDownHis").text()) + 1);
            }
        });
});

//获取文件生成记录
function getCreateList(id,page){
    $.get("/" + prjName + "/fm/getHisTrans",
        {
            resId:id,
            pageNumber:page
        },
        function(data, status){
            if (status == "success" && data.result == "success") {
                if(data.fileStatuses.length < 1){
                    dmallError("文件生成记录不存在");
                } else{
                    $("#createListModal").data("resid",id);
                    $("#createListTable tbody").empty();
                    for(var i=0;i<data.fileStatuses.length;i++){
                        var list = data.fileStatuses[i];
                        $("#createListTable tbody").append('<tr><td class="text-center">'+list.name+'</td>' +
                        '<td class="text-center">'+list.result+'</td>' +
                        '<td class="text-center">'+list.startTime+'</td>' +
                        '<td class="text-center">'+list.stopTime+'</td></tr>>');
                    }
                    $("#totalPage").html(data.totalPages);
                    $("#currentPage").html(data.pageNumber);
                    $("#createListModal").modal({backdrop: 'static', keyboard: false});
                }
            } else {
                dmallError(data.result);
            }
        },
        "json"
    );
}

//获取文件下载记录
function getDownHisList(id, page){
    $.get("/" + prjName + "/fm/getHisDown",
        {
            resId:id,
            pageNumber:page
        },
        function(data,status){
            if (status == "success" && data.result == "success") {
                if (data.catalogDownStatus < 1){
                    dmallError("文件下载记录不存在");
                }else{
                    $("#downHisListModal").data("resid",id);
                    $("#downHisListTable tbody").empty();
                    for(var i=0;i<data.catalogDownStatus.length;i++){
                        var list = data.catalogDownStatus[i];
                        var trStr = '<tr><td class="text-center">' + id + '</td>' + '<td class="text-center">' + list.resVersion + '</td>';
                        if(list.userName == null || list.userName == "") {
                            trStr += '<td class="text-center">-</td>';
                        } else {
                            trStr += '<td class="text-center">' + list.userName + '</td>';
                        }
                        if (list.deptName == null || list.deptName == "") {
                            trStr += '<td class="text-center">-</td>';
                        } else {
                            trStr += '<td class="text-center">' + list.deptName + '</td>';
                        }
                        trStr += '<td class="text-center">' + list.create_time + '</td></tr>>';

                        $("#downHisListTable tbody").append(trStr);
                    }
                    $("#totalPageDownHis").html(data.totalPages);
                    $("#currentPageDownHis").html(data.pageNumber);
                    $("#downHisListModal").modal({backdrop: 'static', keyboard: false});
                }
            } else {
                dmallError(data.result);
            }
        },
        "json"
    );
}

//重新生成
function reBuild(id){
    $.post("/" + prjName + "/fm/rebuild",
        {
            resId:id
        },
        function(data, status){
            if (status == "success" && data.result == "success") {
                dmallNotify("文件重新生成任务开始执行，请稍后");
            } else {
                dmallError(data.result);
            }
        },
        "json"
    );
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
                        htmlStr = '';
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