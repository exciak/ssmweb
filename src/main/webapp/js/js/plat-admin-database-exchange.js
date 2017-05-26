/**
 * Created by Administrator on 2016/10/11.
 */
var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];
$(document).ready(function () {
    var outsideTag = 1;
    setInterval(doRefresh, 30000);
    function doRefresh(){
        $(".exchangeId").each(function(){
            var dataBaseState = $(this).parent().prev().find(".tranState").data("databasestate")
            if(dataBaseState == "DATAPREPARE_EXCHANGING" || dataBaseState == "DATAPREPARE_PUBLISHEXCHANGING"){
                getSingleNum(this);
            }
        });
    }
    function getSingleNum(obj){
        $.get("/" + proName + "/job/jobdatatranstotal",
            {
                exchangeId:$(obj).data("exchangeid")
            },
            function(data,status){
                if(data.result != "success"){
                    dmallError(data.result);
                }else{
                    $(obj).empty();
                    $(obj).parent().next().find(".run-job").hide();
                    $(obj).parent().next().find(".stop-job").hide();
                    if(data.hasJobId){
                        if(data.successTimes != ""){
                            $(obj).append('<a href="/'+proName+'/center/db/manage/exchange/record?exchangeId='+ $(obj).data("exchangeid")+'">成功 '+ data.successTimes+'次<br>失败 '+ data.failTimes+' 次</a>');
                        }else{
                            $(obj).append('<div class="alert-warning">获取传输统计信息失败</div>');
                        }
                    }else{
                        $(obj).append("-");
                    }
                    var htmlStr = "";
                    if(data.tranState == "READY"){
                        htmlStr += '状态：准备就绪';
                        $(obj).parent().next().find(".run-job").show();
                    } else if(data.tranState == "RUNNING"){
                        htmlStr += '状态：正在运行';
                        $(obj).parent().next().find(".stop-job").show();
                    } else if(data.tranState == "FAILED"){
                        htmlStr += '状态：传输失败';
                        $(obj).parent().next().find(".run-job").show();
                    } else if(data.tranState == "STOP"){
                        htmlStr += '状态：已停止';
                        $(obj).parent().next().find(".run-job").show();
                    } else if(data.tranState == "FINISH"){
                        htmlStr += '状态：运行完成';
                        $(obj).parent().next().find(".run-job").show();
                    } else if(data.tranState == "SCHEDULE"){
                        htmlStr += '状态：正在调度';
                        $(obj).parent().next().find(".stop-job").show();
                    } else if(data.tranState == ""){
                        if(data.hasJobId == true){
                            htmlStr += '<div class="alert-warning">获取状态失败</div>';
                        } else{
                            htmlStr += '<div class="alert-warning">启动传输任务失败</div>';
                        }
                    } else{
                        htmlStr += '未知';
                    }
                    $(obj).parent().prev().find(".tranState").html(htmlStr);
                }
            },"json"
        );
    }
    doRefresh();
    function getSupplyDeptList(page) {
        var url = "";
        var data = {};
        var myString = $("#supplyDeptSearch").val();

        data.departmentName = myString;
        data.pageNumber = page;
        url = "/" + proName +"/department/list";

        $.get(url, data,
            function (data, status) {
                if (status == "success" && (data.result == "success")) {
                    $("#supplyDeptList").empty();
                    if (data.deptList.length > 0) {
                        for (var i = 0; i < data.deptList.length; i++) {
                            var dept = data.deptList[i];
                            var trHTML = '<li class="longText" id=' + dept.id + ' title=' + dept.name + '>' + dept.name + '</li>';
                            $("#supplyDeptList").append(trHTML);
                        }
                        $("#currentPage").val(data.curPage);
                        $("#totalPage").val(data.totalPages);
                        $("#wrongMsg").hide();
                        if (data.totalPages == 1) {
                            $("#pageDiv").hide();
                        } else {
                            $("#pageDiv").show();
                        }
                    } else {
                        $("#wrongMsg").show();
                        $("#pageDiv").hide();
                    }
                } else {
                    dmallError(data.result);
                }
            },
            "json"
        );
    }

    $("#supplyDeptSearch").keyup(function () {
        getSupplyDeptList(1);
    });
    $("#supplyDeptSearch").focus(function () {
        outsideTag = 1;
        getSupplyDeptList(1);
    });
    $("supplyDeptSearch").click(function () {
        outsideTag = 1;
    });

    $("#pageDiv").click(function () {
        outsideTag = 1;
    });

    $("#inputSupplyDept").focus(function () {
        $("#inputSupplyDept").removeClass("errorC");
        $("#supplyDeptListDiv").show();
        $("#supplyDeptSearch").val("");
        $("#supplyDeptSearch").focus();
        outsideTag = 1;
    });

    $("#supplyDeptList").delegate("li", "click", function () {
        var supplyDeptId = this.id;
        var supplyDeptName = this.innerText;
        $("#inputSupplyDept").val(supplyDeptName);
        $("#inputSupplyDept").data("supplyDeptId", supplyDeptId);
        $("#inputSupplyDept").siblings("i").removeClass("hidden");
        //$("#clearIcon").removeClass("hidden");
        $("#supplyDeptId").val(supplyDeptId);
        $("#supplyDeptListDiv").hide();
        outsideTag = 1;
    });

    // 流程单号列表翻页
    $("#previousPage").click(
        function () {
            if (parseInt($("#currentPage").val()) > 1) {
                getSupplyDeptList(parseInt($("#currentPage").val()) - 1);
            }
        });

    $("#nextPage").click(
        function () {
            if (parseInt($("#currentPage").val()) < parseInt($("#totalPage").val())) {
                getSupplyDeptList(parseInt($("#currentPage").val()) + 1);
            }
        });

    //点击div以外隐藏
    $("body").not($("#supplyDeptListDiv")).click(function () {
        if (outsideTag != 1) {
            $("#supplyDeptListDiv").hide();
        }
        outsideTag = 0;
    });

    var allProviderName = "所有部门";
    var providerIdTemp = null;
    var providerNameTemp = null;

    //选择发布部门
    $("#chooseProvider").click(function () {
        //设置弹窗标题
        $("#addProviderTitle").text("请选择注册部门");
        //打开模态框
        openProvider();
    });

    //打开选择部门的弹出框
    function openProvider() {
        //打开模态框
        $('#addProvider').modal({backdrop: 'static', keyboard: false});
        getProviderList();
    }

    //获取部门
    function getProviderList() {
        $.get("../../../share/department", {},
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {

                    var treeData = [{
                        id: '',
                        code: '',
                        text: allProviderName,
                        nodes: data.department_list
                    }];

                    $providerTree = $('#list-provider').treeview({
                        data: treeData,
                        onNodeSelected: function (event, node) {
                            if (allProviderName == node.text) {
                                providerIdTemp = null;
                                providerNameTemp = null;
                            } else {
                                providerIdTemp = node.code;
                                providerNameTemp = node.text.split(" ")[0];
                            }
                        }
                    });
                } else {
                    dmallError("获取部门列表失败");
                }
            },
            "json"
        );
    }

    //部门提交
    $("#provider_btn_commit").click(
        function () {
            $("#deptId").val(providerIdTemp);
            $("#depId").val(providerIdTemp);
            $("#deptName").val(providerNameTemp);
        }
    );

});

// 暂停传输
function stopJob(exchangeId){
    $.post("/" + proName + "/center/db/manage/exchange/stop/" + exchangeId,
        {
        },
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                dmallNotifyAndLocation("操作成功", window.location.href)
            } else {
                dmallError(data.result);
            }
        },
        "json"
    );

    $("#div1").hide();
    $("#div2").show();
}

// 启动传输
function runJob(exchangeId){
    $.post("/" + proName + "/center/db/manage/exchange/run/" + exchangeId,
        {},
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                dmallNotifyAndLocation("操作成功", window.location.href)
            } else {
                dmallError(data.result);
            }
        },
        "json"
    );

    $("#div2").hide();
    $("#div1").show();
}

// 强制传输
function restartJob(obj, exchangeId){
    upgradeMode = "RECREATE";
    $("#selectAllParam").attr("checked", false);
    $("#paramTable").empty();
    $("#where").val("");
    $("#sqlWrap").empty();
    $("#insertMode").find("option[value='0']").attr("selected",true);
    $("#insertMode").removeClass("errorC");
    $(".errorInsertMode").hide();
    $("#flushNumber").val("");
    $("#flushNumber").removeClass("errorC");
    $(".errorFlushNumber").hide();
    $("#infoDiv").hide();
    $("#restartJobModalLabel").show();
    $('#restartJobModal').modal({backdrop: 'static', keyboard: false});
}

// 启动出端传输
function confirmStart(){
    var cmHisId = $('#confirmStartModel').data("id");
    $.post("/" + proName + "/center/db/manage/exchange/run/using",
        {
            cmHisId: cmHisId
        },
        function (data, status) {
            if(data.result == "success"){
                $("#usingStopDiv").show();
                $("#usingSpaceDiv").hide();
                $("#usingStartDiv").hide();
                dmallNotify("操作成功")
            } else {
                dmallError(data.result);
            }
        },
        "json");
}
function runUsing(cmHisId){
    $('#confirmStartModel').data("id",cmHisId);
    $('#confirmStartModel').modal({backdrop: 'static', keyboard: false});
}

// 暂停出端传输
function confirmStop(){
    var cmHisId = $('#confirmStopModel').data("id");
    $.post("/" + proName + "/center/db/manage/exchange/stop/using",
        {
            cmHisId: cmHisId
        },
        function (data, status) {
            if(data.result == "success"){
                $("#usingStopDiv").hide();
                $("#usingSpaceDiv").hide();
                $("#usingStartDiv").show();
                dmallNotify("操作成功")
            } else {
                dmallError(data.result);
            }
        },
        "json"
    );
}
function stopUsing(cmHisId){
    $('#confirmStopModel').data("id",cmHisId);
    $('#confirmStopModel').modal({backdrop: 'static', keyboard: false});
}

// 确认修改提示框
function modifyParams(exchangeId) {
    $('#confirmModifyModel').data("id",exchangeId);
    $('#confirmModifyModel').modal({backdrop: 'static', keyboard: false});
}

// 修改参数
function confirmModify() {
    var exchangeId = $('#confirmModifyModel').data("id");
    window.location.href = "/" + proName + "/center/db/manage/exchange/record/modify?exchangeId=" + exchangeId + "&upgradeMode=UPDATE";
}

// 确认重置提示框
function recreateTrans(exchangeId) {
    $('#confirmRecreateModel').data("id",exchangeId);
    $('#confirmRecreateModel').modal({backdrop: 'static', keyboard: false});
}

// 重置传输
function confirmRecreate() {
    var exchangeId = $('#confirmRecreateModel').data("id");
    window.location.href = "/" + proName + "/center/db/manage/exchange/record/modify?exchangeId=" + exchangeId + "&upgradeMode=RECREATE";
}

function doClearSupplyDept(){
    $("#inputSupplyDept").val("");
    $("#supplyDeptId").val("");
    $("#inputSupplyDept").siblings("i").addClass("hidden");
    //$("#clearIcon").addClass("hidden");
}
