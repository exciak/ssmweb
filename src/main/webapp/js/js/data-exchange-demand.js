/**
 * Created by xunzhi on 2015/7/13.
 */
var curExchangeId;
var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];

function doIgnore(obj){
    $.post("/" + proName +"/mydata/demand/ignore",
        {
            exchangeId: obj.id
        },
        function (data, status) {
            if (data.result == "success") {
                dmallNotifyAndLocation("操作成功。", window.location.href);
            } else {
                dmallError(data.result);
            }
        },
        "json");
}
function doClose(obj){
    $(obj).parent().parent().hide();
}
$(document).ready(function(){
    //errorMsg
    $(".errorMsg").each(function(){
        $(this).hover(function(){
            $(".popover").hide();
            $(this).popover('show');
        });
    });
    $("body").delegate(".popover","mouseleave",function(){
        $(this).hide();
    });
    /* 定时器回调，重定向到当前url */
    function refreshByTime(){
        var href = window.location.href;
        location.href = href;
    }
    /* 管理定时器 */
    function manageRefresh(){
        var refreshFlag = false;
        /* 获取第五列中的所有字符串 */
        var stringList= '';
        $("tbody tr td:nth-child(5)").each(function(){
           stringList += $(this).text() + " ";
        });

        /* 判断两种非稳态 */
        if((stringList.indexOf("状态：正在运行") > 0) || (stringList.indexOf("状态：正在调度") > 0) ||
            (stringList.indexOf("状态：运行完成") > 0)){
            refreshFlag = true;
        }

        /* 需要刷新，频率为30s */
        if(refreshFlag == true){
            setInterval(refreshByTime, 30000);
        }
    }

    manageRefresh();

    $('#runJobModalBtn').click(
        function() {
            $('#runJobModal').modal('hide');
            $.post("run_job",
                {
                    exchangeId: curExchangeId
                },
                function (data, status) {
                    if (data.result == "success") {
                        dmallNotifyAndLocation("开始传输成功。", window.location.href);
                    } else {
                        dmallError(data.result);
                    }
                },
                "json");
        }
    );

    $('#stopJobModalBtn').click(
        function() {
            $('#stopJobModal').modal('hide');
            $.post("stop_job",
                {
                    exchangeId: curExchangeId
                },
                function (data, status) {
                    if (data.result == "success") {
                        dmallNotifyAndLocation("停止传输成功。", window.location.href);
                    } else {
                        dmallError(data.result);
                    }
                },
                "json");
        }
    );

    $('#restartJobModalBtn').click(
        function() {
            $('#restartJobModal').modal('hide');
            $.post("restart_job",
                {
                    exchangeId: curExchangeId
                },
                function (data, status) {
                    if (data.result == "success") {
                        dmallNotifyAndLocation("重新启动传输成功。", window.location.href);
                    } else {
                        dmallError(data.result);
                    }
                },
                "json");
        }
    );

    $('#restartShareModalBtn').click(
        function() {
            $('#restartShareModal').modal('hide');
            $.post("restart_share",
                {
                    exchangeId: curExchangeId
                },
                function (data, status) {
                    if (data.result == "success") {
                        dmallNotifyAndLocation("重新共享成功。", window.location.href);
                    } else {
                        dmallError(data.result);
                    }
                },
                "json");
        }
    );

    $('#stopSharingModalBtn').click(
        function (){
            $('#stopSharingModal').modal('hide');
            $.post("stop_sharing",
                {
                    exchangeId: curExchangeId
                },
                function (data, status) {
                    if (data.result == "success") {
                        dmallNotifyAndLocation("停止使用成功。", window.location.href);
                    } else {
                        dmallError(data.result);
                    }

                },
                "json");
        }
    );

    $('#terminateFlowModalBtn').click(
        function (){
            $('#terminateFlowModal').modal('hide');
            $.post("terminate_flow",
                {
                    exchangeId: curExchangeId
                },
                function (data, status) {
                    if (data.result == "success") {
                        dmallNotifyAndLocation("停止使用成功。", window.location.href);
                    } else {
                        dmallError(data.result);
                    }
                },
                "json");
        }
    );

    $('#backupCompleteModalBtn').click(
        function (){
            $('#backupCompleteModal').modal('hide');
            $.post("backup_complete",
                {
                    exchangeId: curExchangeId
                },
                function (data, status) {
                    if (data.result == "success") {
                        dmallNotifyAndLocation("确认备份完成成功。", window.location.href);
                    } else {
                        dmallError(data.result);
                    }
                },
                "json");
        }
    );

    $(function () {
        $("[data-toggle='popover']").popover();
    });


    //选择资源形态分类
    $("#chooseResource").click(function () {
        /* 设置弹窗标题 */
        $("#addResourceTitle").text("请选择资源形态分类");
        /* 打开模态框 */
        openResource();
    });
});

function runJob(obj, exchangeId){
    curExchangeId = exchangeId;
    $('#runJobModal').modal({backdrop: 'static', keyboard: false});
}

function stopJob(obj, exchangeId){
    curExchangeId = exchangeId;
    $('#stopJobModal').modal({backdrop: 'static', keyboard: false});
}

function restartJob(obj, exchangeId){
    curExchangeId = exchangeId;
    $('#restartJobModal').modal({backdrop: 'static', keyboard: false});
}

function restartShare(obj, exchangeId){
    curExchangeId = exchangeId;
    $('#restartShareModal').modal({backdrop: 'static', keyboard: false});
}

function stopSharing(obj, exchangeId){
    curExchangeId = exchangeId;
    $('#stopSharingModal').modal({backdrop: 'static', keyboard: false});
}

function terminateFlow(obj, exchangeId){
    curExchangeId = exchangeId;
    $('#terminateFlowModal').modal({backdrop: 'static', keyboard: false});
}

function backupComplete(obj, exchangeId){
    curExchangeId = exchangeId;
    $('#backupCompleteModal').modal({backdrop: 'static', keyboard: false});
}
