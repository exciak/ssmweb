var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];
var rootPath = "http://" + window.location.host + "/" + proName;
/* 修改操作的索引值 */

var preventDefaultFlag = false;
var typeCodes = $('#databaseTypeCodes').val();
var codes =  typeCodes.split(":");
for (var i = 0; i < codes.length-1; i++) {
    if (i == 0) {
        typeCodes = codes[i];
    } else {
        typeCodes += "," + codes[i].substring(codes[i].length-2);
    }
}


$(document).ready(function () {


        $("#sureBox").click(function(){
        if($("#sureBox").prop("checked")){
            $("#btn_commitCreateInfo").attr("disabled",false);
        }else{
            $("#btn_commitCreateInfo").attr("disabled",true);
        }
    });

    //数据库类型代码
    var databaseTypeCodes = $('#databaseTypeCodes');
    $('#chooseDatabaseTypeCode').click(function () {
        openTypeCode();
    });

    function openTypeCode() {
        //打开模态框
        $('#dataTableTypeCodeModel').modal({backdrop: 'static', keyboard: false});
    }

    //选择数据库类型代码
    $('#list-typeCode').on('click', 'li', function () {
        var deptSelected = $('#list-typeCode-selected').html();
        deptSelected += '<li class="list-group-item share-in" data-shareDeptCode="' + $(this).attr('data-shareDeptCode') +'">' + $(this).html() + '</li>';
        $('#list-typeCode-selected').html(deptSelected);
        $(this).remove();
    });
    //取消数据库类型代码的选择
    $('#list-typeCode-selected').on('click', 'li', function () {
        var shareDept = $('#list-typeCode').html();
        shareDept += '<li class="list-group-item share-in" data-shareDeptCode="' + $(this).attr('data-shareDeptCode') +'">' + $(this).html() + '</li>';
        $('#list-typeCode').html(shareDept);
        $(this).remove();
    });
    //提交选择数据库类型代码
    $("#typeCode_btn_commit").click(function () {
        var html='';
        var typeCode = [];
        var deptSelected = $('#list-typeCode-selected').children();
        for (var i = 0; i < deptSelected.length; i++) {
            html += $(deptSelected[i]).attr('data-shareDeptCode') + '：' + $(deptSelected[i]).html() + '&nbsp;&nbsp;&nbsp;';
            typeCode.push($(deptSelected[i]).attr('data-shareDeptCode'));
        }
        databaseTypeCodes.html(html);
        typeCodes = typeCode.join(',');
    });
});

//系统在用标识判断
function useFlagChange() {
    var useFlag = $('#useFlag option:selected').val();
    if (useFlag == 1) {
        $('#offlineDateDiv1').prop("hidden", true);
        $('#offlineDateDivDef1').removeAttr("hidden");
        $('#offlineDateDiv0').prop("hidden", true);
        $('#offlineDateDivDef0').removeAttr("hidden");
        $('#offlineDate1').val("");
        $('#offlineDate0').val("");
    } else {
        $('#offlineDateDiv1').removeAttr("hidden");
        $('#offlineDateDivDef1').prop("hidden", true);
        $('#offlineDateDiv0').removeAttr("hidden");
        $('#offlineDateDivDef0').prop("hidden", true);
    }
}
//不为空校验
function isEmpty(string) {
    if((string == "") || (string == null) || (string == undefined)) {
        return true;
    }

    return false;
}
function createCheckIsEmpty(obj, num, message) {
    var string = obj.val();
    if(isEmpty(string)) {
        obj.addClass("border-red");
        $('.error'+num).html(message);
        $('.error'+num).css("display", "block");
        preventDefaultFlag = true;
    } else {
        obj.removeClass("border-red");
        $('.error'+num).hide();
    }
}

// /* 输入中文、英文字母、数字、标点符号 */
// function inputCheckName(string) {
//     var regex =  /^[\w\u4e00-\u9fa5_]{1,200}$/;
//     return regex.test(string);
// }

function checkAppSystemName() {
    if (isEmpty($("#appSystemName").val())) {
        $("#appSystemName").addClass("border-red");
        $('.error2').html("*请输入应用系统名称");
        $('.error2').css("display", "block");
        preventDefaultFlag = true;
    } else {
        $("#appSystemName").removeClass("border-red");
        $('.error2').hide();
    }
}

$("#appSystemName").blur(function () {
    checkAppSystemName();
});
$("#appSystemDesc").blur(function () {
    createCheckIsEmpty($("#appSystemDesc"), 3, "请输入应用系统说明，1000字以内");
});
$("#contractorName").blur(function () {
    createCheckIsEmpty($("#contractorName"), 4, "请输入承建单位名称，100字以内");
});
$("#onlineDate").focus(function () {
    $("#onlineDate").removeClass("border-red");
    $('.error5').hide();
});

$('#onlineDate').datetimepicker({
    language:  'zh-CN',
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0
}).on('changeDate', function() {
    $('#offlineDate1').datetimepicker('setStartDate', $('#onlineDate').val());
    $('#offlineDate0').datetimepicker('setStartDate', $('#onlineDate').val());
});

$('#offlineDate0').datetimepicker({
    language:  'zh-CN',
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0
}).on('changeDate', function() {

    $('#onlineDate').datetimepicker('setEndDate', $('#offlineDate0').val());

});
$('#offlineDate1').datetimepicker({
    language:  'zh-CN',
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0
}).on('changeDate', function() {
    $('#onlineDate').datetimepicker('setEndDate', $('#offlineDate1').val());
});


$('#onlineDate').click(function () {
    $('#offlineDate1').datetimepicker('setStartDate', $('#onlineDate').val());
    $('#offlineDate0').datetimepicker('setStartDate', $('#onlineDate').val());

    if (isEmpty($('#offlineDate1').val()) && !isEmpty($('#offlineDate0').val())) {
        $('#onlineDate').datetimepicker('setEndDate', $('#offlineDate0').val());
    } else if (isEmpty($('#offlineDate0').val()) && !isEmpty($('#offlineDate1').val())){
        $('#onlineDate').datetimepicker('setEndDate', $('#offlineDate1').val());
    }
});

$('#offlineDate0').click(function () {
    $('#onlineDate').datetimepicker('setEndDate', $('#offlineDate0').val());
    $('#offlineDate0').datetimepicker('setStartDate', $('#onlineDate').val());
});
$('#offlineDate1').click(function () {
    $('#onlineDate').datetimepicker('setEndDate', $('#offlineDate1').val());
    $('#offlineDate1').datetimepicker('setStartDate', $('#onlineDate').val());
});

$("#databaseTypeCodes").blur(function () {
    createCheckIsEmpty($("#databaseTypeCodes"), 7, "请选择数据表类型代码");
});
$("#databaseProductDesc").blur(function () {
    createCheckIsEmpty($("#databaseProductDesc"), 8, "请输入数据库产品描述，400字以内");
});
$("#accessAddress").blur(function () {
    createCheckIsEmpty($("#accessAddress"), 9, "请输入应用系统访问地址");
});

//提交创建信息
function createCheckAll() {
    checkAppSystemName();
    createCheckIsEmpty($("#appSystemDesc"), 3, "请输入应用系统说明，1000字以内");
    createCheckIsEmpty($("#contractorName"), 4, "请输入承建单位名称，100字以内");
    createCheckIsEmpty($("#onlineDate"), 5, "请选择上线时间");

    createCheckIsEmpty($("#databaseTypeCodes"), 7, "请选择数据库类型代码");
    createCheckIsEmpty($("#databaseProductDesc"), 8, "请输入数据库产品描述，400字以内");
    createCheckIsEmpty($("#accessAddress"), 9, "请输入应用系统访问地址");
    checkProvideDeptNameValue();
}
$("#btn_commitCreateInfo").click(function () {

    preventDefaultFlag=false;

    createCheckAll();
    if(preventDefaultFlag==true)
    {
        return false;
    }
    else {
        var arr = $('#onlineDate').val().split("-");
        var online = new Date(arr[0], parseInt(arr[1])-1, arr[2]);
        var appSystem = {
            "id":$('#appSystemId').val(),
            "appSystemNo": $('#appSystemNo').val(),
            "appSystemName": $('#appSystemName').val(),
            "appSystemDesc": $('#appSystemDesc').val(),
            "routinePowerDeptCode": $('#routinePowerDeptCode').val(),
            "contractorName": $('#contractorName').val(),
            "onlineDate": online,
            "databaseTypeCode": typeCodes,
            "databaseProductDesc": $('#databaseProductDesc').val(),
            "industryCode": $('#industryCode').val(),
            "appSystemTypeCode": $('#appSystemTypeCode option:selected').val(),
            "useFlag": $('#useFlag option:selected').val(),
            "accessAddress": $('#accessAddress').val(),
            "registerDeptCode": $('#provideDeptCode').val()
        };
        if ($('#useFlag option:selected').val() == 0) {
            if (isEmpty($('#offlineDate0').val()) && !isEmpty($('#offlineDate1').val())) {
                arr = $('#offlineDate1').val().split("-");
                var offlineDate = new Date(arr[0], parseInt(arr[1])-1, arr[2]);
                appSystem.offlineDate = offlineDate;
            } else if (isEmpty($('#offlineDate1').val()) && !isEmpty($('#offlineDate0').val())) {
                arr = $('#offlineDate0').val().split("-");
                var offlineDate = new Date(arr[0], parseInt(arr[1])-1, arr[2]);
                appSystem.offlineDate = offlineDate;
            }
        }

        $.ajax({
            type: "post",
            url: rootPath+"/appsystems",
            data: appSystem,
            dataType: "json",
            //contentType: 'application/json;charset=utf-8',
            success: function (data) {
                if (data.result == "success") {
                    location.href = rootPath+"/appsystems";
                } else {
                    dmallError(data.result);
                }
            },
            error: function () {
                dmallAjaxError();
                $("#btn_commitCreateInfo").attr('disabled', false);
            }
        })
    }

});


//数据资源提供单位
var $provideDeptName = $('#provideDeptName');
var provideDeptCode = $('#provideDeptCode').val();
var provideDeptName = $provideDeptName.val();
$('#chooseProvideDept').click(function () {
    $provideDeptName.removeClass("errorC");
    $('.errorProvideDept').hide();
    openProvideDept();
});

function openProvideDept() {
    //打开模态框
    $('#addProvideDept').modal({backdrop: 'static', keyboard: false});
    /*数据资源提供单位*/
    getProvideDeptList();
}

//获取数据资源提供单位
var pageNum = 1;
var pageSize = 7;
var pages = 0;
var $provideDeptTree;
function getProvideDeptList() {
    $.get(rootPath + "/organ/organCodes/tree", {},
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                $provideDeptTree = $('#list-provideDept').treeview({
                    data: data.organCodeList,
                    onNodeSelected: function (event, node) {
                        var $provideDeptList = $("#provideDeptName");
                        $provideDeptList.data("provideDeptCode", node.code);
                        $provideDeptList.data("provideDeptName", node.text);
                    }
                });
                var list = $('#list-provideDept').children().children();
                pages =Math.ceil(list.length/pageSize);
                for (var i=0; i < list.length; i++){
                    for (var j=0; j<pages; j++){

                    }
                }
            } else {
                dmallError("获取数据资源提供单位列表失败");
            }
        },
        "json"
    );
}
//数据资源提供单位提交
$("#provideDept_btn_commit").click(function () {
    provideDeptCode = $provideDeptName.data('provideDeptCode');
    provideDeptName = $provideDeptName.data('provideDeptName');
    $("#provideDeptCode").val(provideDeptCode);
    $("#provideDeptName").val(provideDeptName);
});
//数据资源提供单位验证
function checkProvideDeptNameValue() {
    if($('#provideDeptName').val()){
        return false;
    }else {
        checkNotBlank($('#provideDeptName'),$('.errorProvideDept'),'*请选择数据资源提供单位');
        return true;
    }
}
//非空验证
function checkNotBlank($select,$errorClass,errorMsg){
    var str = $select.val();
    if (str == "") {
        $select.addClass("errorC");
        $errorClass.html(errorMsg);
        $errorClass.css("display", "block");
        preventDefaultFlag = true;
        return true;
    } else {
        $select.removeClass("errorC");
        $errorClass.hide();
        return false;
    }
}
