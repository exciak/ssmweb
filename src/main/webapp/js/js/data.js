var prjName;
var totalNum;
$(document).ready(function () {
    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    prjName = arr[1];

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

    $("#showTable").click(function () {
        $('#tableModal').modal({backdrop: 'static', keyboard: false});
    });

    $("#showApiTable").click(function () {
        $('#apiModal').modal({backdrop: 'static', keyboard: false});
    });

    $("#commentBtn").click(
        function (event) {
            var comment = $.trim($("#comment").val());
            if (comment == "") {
                dmallError("请输入评论");
                return;
            }

            $.post("data/comment",
                {
                    dataId: $("#dataId").val(),
                    comment: $("#comment").val()
                },
                function (data, status) {
                    if (data.result != "success") {
                        dmallError(data.result);
                    } else {
                        updateComments();
                        $("#comment").val("");
                    }
                },
                "json");
        }
    );

    updateComments();
    //打开帮助说明
    $("#dataapihelp").click(function(){
        $("#dataapihelpModal").modal({backdrop: 'static', keyboard: false});
    });

    //根据数据源ID获取数据源
    function getDbSrcById(dbAccessId,$selectorType) {
        $.get("/" + prjName + "/dbaccess/dbaccess_detail",
            {
                dbaccessID:dbAccessId,
                usage: "catalog"
            },
            function (data, status) {
                if (status == "success" && data.result == "success") {
                    var type = data.dbaccess.type;
                    $selectorType.html('<strong>数据库类型：</strong>'+type);
                } else {
                    dmallError("获取数据源失败");
                }
            },
            "json"
        );
    }

    $('#sureModalModalBtn').click(function () {
        var dataId = $('#modelCataId').val();
        var typeCode = $('#modelCataTypeCode').val();
        var isShowModel = $('#modelCataisShowModel').val();


        if(isShowModel == 'false') { // 是否显示确认框
            window.location.href = "obtain?id=" + dataId;
            return;
        }

        $("#sureContext").text("获取中，请稍等...");
        $("#sureModalModalBtn").attr("disabled", true);
        $("#sureModalcancelBtn").attr("disabled", true);

        if (typeCode == 'STRUCTFILE') {
            var dbAccessId = $('#dbAccessId').val();
            getStrAddress(dataId);
        } else if (typeCode == 'COMMFILE') {
            getComAddress(dataId);
        } else if (typeCode == 'ONLINEURL') {
            getOnlineAddress(dataId);
        } else if (typeCode == 'DATAAPI') {
            getApiAddress(dataId);
        } else if (typeCode == 'ODPS') {
            getSecureData(dataId);
        }
    });

    $('#sureModalcancelBtn').click(function () {
        $('#sureModal').modal('hide');
    });
    $("#structfile").delegate("#downloadButton","click",function(){
        var dataId = $('#modelCataId').val();
        getStrFile(dataId);
    });
    getNewData();
    getNewHot(1);
    // var Number = parseInt($("#markPage").val());

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




function updateComments() {
    $.get("/" + prjName + "/data/comment",
        {
            dataId: $("#dataId").val(),
            pageNumber: 1
        },
        function (data, status) {
            if (data.result != "success") {
                dmallError(data.result);
            } else {
                $('#commentHistroy').html('');
                for (var i = 0; i < data.commentList.length; i++) {
                    var comment = data.commentList[i];
                    var divStr = '<li  style="list-style-type:none; padding-bottom: 10px;border-bottom: 1px solid #eaeaea;line-height: 23px;">' +
                        ' <div style="margin-bottom: 10px;"><span style="color:#E28C2D">' + comment.userName + " (" + comment.deptName + ") " + '</span>' + "：" + '<pre>' + comment.comment + '</pre></div>' +
                        ' <div><span style="color:#CDCDCD;">' + comment.commentTime + '发表</span></div>' +
                        '</li>';
                    $('#commentHistroy').append(divStr);
                }
                var pag = pagination(1, data.totalPages, $("#dataId").val());
                $('#listFormc').html(pag);
                $('#commentCount')[0].innerText=data.comment;                    //评论总数
            }
        },
        "json");
}

function pagination(pageNumber, totalPages, cat) {
    var outString = "";
    var pageNumberInput = pageNumber;
    if (pageNumber > totalPages) {
        pageNumber = totalPages;
    }
    if (pageNumber > 0 && totalPages > 0) {
        outString = outString + '<ul class = "pagination mtm mb pull-right" >';
        if (pageNumber == 1) {
            outString = outString + '<li class="disabled"><a>&lt;</a></li>';
        } else {
            outString = outString + '<li><a onclick="getComments(' + cat + ',' + (pageNumber - 1) + ')">&lt;</a></li>';
            if (pageNumber >= 3 && totalPages >= 5) {
                outString = outString + '<li><a onclick="getComments(' + cat + ',' + 1 + ')">1</a></li>';
            }
        }
        if (pageNumber > 3 && totalPages > 5) {
            outString = outString + '<li><a href="#">...</a></li>';
        }
        if ((totalPages - pageNumber) < 2 && pageNumber > 2) {
            if ((totalPages == pageNumber) && pageNumber > 3) {
                outString = outString + '<li><a onclick="getComments(' + cat + ',' + (pageNumber - 3) + ')">' + (pageNumber - 3) + '</a></li>';
            }
            outString = outString + '<li><a onclick="getComments(' + cat + ',' + (pageNumber - 2) + ')">' + (pageNumber - 2) + '</a></li>';
        }
        if (pageNumber > 1) {
            outString = outString + '<li><a onclick="getComments(' + cat + ',' + (pageNumber - 1) + ')">' + (pageNumber - 1) + '</a></li>';
        }
        outString = outString + '<li class="active"><a onclick="getComments(' + cat + ',' + pageNumber + ')">' + pageNumber + '</a></li>';
        if ((totalPages - pageNumber) >= 1) {
            outString = outString + '<li><a onclick="getComments(' + cat + ',' + (pageNumber + 1) + ')">' + (parseInt(pageNumber) + 1) + '</a></li>';
        }
        if (pageNumber < 3) {
            if ((pageNumber + 2) < totalPages) {
                outString = outString + '<li><a onclick="getComments(' + cat + ',' + (pageNumber + 2) + ')">' + (parseInt(pageNumber) + 2) + '</a></li>';
            }
            if ((pageNumber < 2) && (pageNumber + 3 < totalPages)) {
                outString = outString + '<li><a onclick="getComments(' + cat + ',' + (pageNumber + 3) + ')">' + (parseInt(pageNumber) + 3) + '</a></li>';
            }
        }
        if ((totalPages - pageNumber) >= 3 && totalPages > 5) {
            outString = outString + '<li><a>...</a></li>';
        }

        if (pageNumber == totalPages) {
            outString = outString + '<li class="disabled"><a >&gt;</a></li>';
        } else {
            if ((totalPages - pageNumber) >= 2) {
                outString = outString + '<li><a onclick="getComments(' + cat + ',' + totalPages + ')">' + totalPages + '</a></li>';
            }
            outString = outString + '<li><a onclick="getComments(' + cat + ',' + (pageNumber + 1) + ')">&gt;</a></li>';
        }

        outString = outString + '<span class="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;到第&nbsp;' +
        '<input type="hidden" id="pageNumber" name="pageNumber" value="1"/>' +
        '<input type="number" id="pageNumberInput" value=' + pageNumberInput + ' min=1>&nbsp;&nbsp;页&nbsp;&nbsp;' +
        '<a type="submit" id="" class="btn btn-default" onclick="pagerTurn(' + cat + ')">确定</a>' +
        '</span>' +
        '</ul>'
    }
    return outString;
}

function getComments(dataId, pageNumber) {
    if (pageNumber < 1) {
        pageNumber = 1;
    }
    $.get("data/comment",
        {
            dataId: dataId,
            pageNumber: pageNumber
        },
        function (data, status) {
            if (data.result != "success") {
                dmallError(data.result);
            } else {
                $('#commentHistroy').html('');

                if (data.commentList.length == 0) {
                    $('#commentHistroy').html('<li style="list-style-type:none; padding-bottom: 10px;border-bottom: 1px solid #eaeaea;line-height: 23px;"><label class="control-label">没有找到评论。</label></li>');
                } else {
                    for (var i = 0; i < data.commentList.length; i++) {
                        var comment = data.commentList[i];
                        var divStr = '<li  style="list-style-type:none; padding-bottom: 10px;border-bottom: 1px solid #eaeaea;line-height: 23px;">' +
                            ' <div style="margin-bottom: 10px;"><span style="color:#E28C2D">' + comment.userName + '</span>&nbsp;&nbsp;' + "：" + '<pre>' + comment.comment + '</pre></div>' +
                            ' <div><span style="color:#CDCDCD;">' + comment.commentTime + '发表</span></div>' +
                            '</li>';
                        $('#commentHistroy').append(divStr);
                    }
                }

                var pag = pagination(data.pageNumber, data.totalPages, $("#dataId").val());
                $('#listFormc').html(pag);
            }
        },
        "json");
}

function updateExchangeNumber(dataId) {
    $.get("data/exchange_number",
        {
            dataId: dataId
        },
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                $("#exchangeNumber").html(data.exchange);
            }
        },
        "json");
}

//确定按钮功能
function pagerTurn(cat) {
    var pageNumber = $('#pageNumberInput').val();
    getComments(cat, pageNumber);

}
function getApiAddress(dataId) {
    $.post("obtain/uncontrolled",
        {
            dataId: dataId
        },
        function (data, status) {
            if (data.result != "success") {
                dmallError(data.result);
                $("#sureModalModalBtn").attr("disabled", false);
                $("#sureModalcancelBtn").attr("disabled", false);
                $('#sureModal').modal('hide');
            } else {
                var href = window.location.href;
                location.href = href;
            }
        },
        "json");
}
function getStrAddress(dataId) {
    $.post("obtain/uncontrolled",
        {
            dataId: dataId
        },
        function (data, status) {
            if (data.result != "success") {
                dmallError(data.result);
                $("#sureModalModalBtn").attr("disabled", false);
                $("#sureModalcancelBtn").attr("disabled", false);
                $('#sureModal').modal('hide');
            } else {
                var rootlocation = window.location.href;
                rootlocation = rootlocation.replace(/\/data\/?\?id/,"/data/down?id");
                var dbAccessId = $('#dbAccessId').val();
                var output = "";
                if (null == dbAccessId || "" == dbAccessId){
                    output = '<strong>文件地址：</strong>' + data.url;
                }else{
                    output = '<strong>文件地址：</strong>' + rootlocation + '<button id="downloadButton" class="btn btn-primary" style="width:120px;margin-left: 20px">下载</button>';
                }
                $('#structfile').html(output);
                updateExchangeNumber(dataId);

                $("#sureModalModalBtn").attr("disabled", false);
                $("#sureModalcancelBtn").attr("disabled", false);
                $('#sureModal').modal('hide');
            }
        },
        "json");
}

//下载结构化文件
function getStrFile(dataId){
    location.href = "data/down?id=" + dataId;
}

function getComAddress(dataId) {
    $.post("obtain/uncontrolled",
        {
            dataId: dataId
        },
        function (data, status) {
            if (data.result != "success") {
                dmallError(data.result);
                $("#sureModalModalBtn").attr("disabled", false);
                $("#sureModalcancelBtn").attr("disabled", false);
                $('#sureModal').modal('hide');
            } else {
                if (data.url)
                    var output = '<strong>文件地址：</strong>' + data.url;
                else
                    output = '<strong>文件地址：</strong>';
                $('#commfile').html(output);
                updateExchangeNumber(dataId);
                $('#sureModal').modal('hide');
            }
        },
        "json");
}
function getOnlineAddress(dataId) {
    $.post("obtain/uncontrolled",
        {
            dataId: dataId
        },
        function (data, status) {
            if (data.result != "success") {
                dmallError(data.result);
                $("#sureModalModalBtn").attr("disabled", false);
                $("#sureModalcancelBtn").attr("disabled", false);
                $('#sureModal').modal('hide');
            } else {
                if (data.url)
                    var output = '<strong>在线资源链接地址：</strong>' + data.url;
                else
                    output = '<strong>在线资源链接地址：</strong>';
                $('#onlinefile').html(output);
                updateExchangeNumber(dataId);
                $('#sureModal').modal('hide');
            }
        },
        "json");
}

function getSecureData(dataId) {
    $.post("mydata/demand/secure_obtain",
        {
            dataId: dataId
        },
        function (data, status) {
            if (data.result != "success") {
                dmallError(data.result);
                $("#sureModalModalBtn").attr("disabled", false);
                $("#sureModalcancelBtn").attr("disabled", false);
                $('#sureModal').modal('hide');
            } else {
                location.href = "mydata/demand";
            }
        },
        "json");
}

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


function getData(dataId, typeCode, state, isShowModel) {

    if(1 == state) {
        dmallError("本信息资源已撤销发布，请联系提供方。");
        return;
    }

    if(3 == state) {
        dmallError("本信息资源正在发布中，请稍后。");
        return;
    }

    // 验证是否为虚目录
    if("VIRTUAL" == typeCode) {
        $('#virtualCatalogWarningModel').modal({backdrop: 'static', keyboard: false});
        return;
    }

    if($("#existDeletedItem").val() == "true") {
        showModel(dataId, typeCode, isShowModel, "当前目录关联的数据项已被删除，可能造成数据不可用。确定继续获取数据吗?");
        return;
    }

    if(isShowModel) { // 是否显示确认框
        showModel(dataId, typeCode, isShowModel, "确定获取吗?");
    } else {
        window.location.href = "obtain?id=" + dataId;
    }
}

function showModel(dataId, typeCode, isShowModel, infoText) {
    $('#modelCataId').val(dataId);
    $('#modelCataTypeCode').val(typeCode);
    $('#modelCataisShowModel').val(isShowModel);
    $("#sureContext").text(infoText);
    $('#sureModal').modal({backdrop: 'static', keyboard: false});
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
                        '<div class="col-md-5 col-md-offset-2 longText"><a href="data?id=' + catalogModel.id + '" title="' + htmlEncode(catalogModel.resourceName) + '">' + htmlEncode(catalogModel.resourceName) + '</a></div>'+
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
                        '<div class="col-md-5 longText"><a href="data?id=' + catalogModel.id + '" title="' + htmlEncode(catalogModel.resourceName) + '">' + htmlEncode(catalogModel.resourceName) + '</a></div>'+
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
//设置右侧的热门数据以及最新数据的整个部分的高度，和左侧的部分高度保持一致。
$("section>div:nth-child(2)").css("height",$("section").css("height"));
