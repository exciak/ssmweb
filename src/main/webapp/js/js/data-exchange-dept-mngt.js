/**
 * Created by Administrator on 2015/7/2.
 */
var pathname = window.location.pathname;
var arr = pathname.split("/");
var prjName = arr[1];
$(document).ready(function () {
    var subMenuValue = $("#subType").val();
    setInterval(doRefresh, 30000);
    function doRefresh(){
        $(".exchangeId").each(function(){
            var hasJobId = $(this).data("hasjobid");
            if(hasJobId){
                getSingleNum(this);
            }
        });
    }
    function getSingleNum(obj){
        $.get("/" + prjName + "/job/jobdatatranstotal",
            {
                exchangeId:$(obj).data("exchangeid")
            },
            function(data,status){
                if(data.result != "success"){
                    dmallError(data.result);
                }else{
                    $(obj).empty();
                    if(data.successTimes != ""){
                        $(obj).append('<div class="alert-info">成功 '+ data.successTimes+'次<br>失败 '+ data.failTimes+' 次</div>');
                    }else{
                        $(obj).append('<div class="alert-warning">获取传输统计信息失败</div>');
                    }
                }
            },"json"
        );
    }
    doRefresh();
    $("#demandExchange").attr("href", "deptmngt?subType=demand");
    $("#demandExchange").click (function () {
        subMenuValue = "demand";
    });

    $("#supplyExchange").attr("href", "deptmngt?subType=supply");
    $("#supplyExchange").click (function () {
        subMenuValue = "supply";
    });

    if (subMenuValue === "supply") {
        $("#supplyExchange").addClass("a-selected");
        $("#demandExchange").removeClass("a-selected");
    } else if (subMenuValue === "demand"){
        $("#supplyExchange").removeClass("a-selected");
        $("#demandExchange").addClass("a-selected");
    }

    //选择资源形态分类
    $("#chooseResource").click(function () {
        /* 设置弹窗标题 */
        $("#addResourceTitle").text("请选择资源形态分类");
        /* 打开模态框 */
        openResource();
    });
});
