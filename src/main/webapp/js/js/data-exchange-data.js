var pathname = window.location.pathname;
var arr = pathname.split("/");
var prjName = arr[1];
var rootPath = "http://" + window.location.host + "/" + prjName;

$(document).ready(function () {
    // 针对结构化的下载文件地址，进行替换
    if($("#urlDiv").text() == "file-address") {
        var rootRoute = $("#rootRoute").val();
        $("#urlDiv").text("http://" + window.location.host + rootRoute + '/data/down?id=' + $("#catalogId").val());
    }
    var string = $("#dataApiUrl p").text();
    $("#dataApiUrl p").text(delBracket(string));
    getNewData();
    getNewHot(1);
});
// $("#totalNum").data("$totalNum",totalNum1);
var totalNum;
//右侧相关信息的数据异步请求
$("#decData").attr("disabled",true);
console.log(totalNum);
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

function getNewHot(pageNumber){
    $.get(rootPath+"/catalog/service/catalogs",
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
                totalNum1 = data.totalPages;
                totalNum = totalNum1;
                if(totalNum1 == 1){$("#incData").attr("disabled",true);}
                for (i = 0; i < data.catalogList.length; i++) {
                    var catalogModel = data.catalogList[i];
                    $("#newDataHot").append('<div class="row backEmpty" style="margin-bottom:10px;">'+
                        // '<div class="col-md-2" ></div>'+
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
    $.get(rootPath+"/catalog/service/catalogs",
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
$("section>div:nth-child(2)").css("height",$("section").css("height"));