/* 创建操作的索引值 */

var preventDefaultFlag = false;
var typeCodes = $('#typeCodes').val();
var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];
var rootPath = "http://" + window.location.host + "/" + proName;
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
        $("#databaseTypeCodes").removeClass("border-red");
        $('.errorDatabaseTypeCodes').hide();
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

//数据资源提供单位
var $appProvideDeptName = $('#appProvideDeptName');
var appProvideDeptCode = $('#appProvideDeptCode').val();
var appProvideDeptName = $appProvideDeptName.val();
$('#chooseAppProvideDept').click(function () {
    $appProvideDeptName.removeClass("errorC");
    $('.errorAppProvideDept').hide();
    openAppProvideDept();
});

function openAppProvideDept() {
    //打开模态框
    $('#addAppProvideDept').modal({backdrop: 'static', keyboard: false});
    /*数据资源提供单位*/
    getProvideDeptList();
}

//获取数据资源提供单位
var pageNum = 1;
var pageSize = 7;
var $provideDeptTree;
function getProvideDeptList() {
    $.get(rootPath + "/organ/organCodes/tree", {},
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                $provideDeptTree = $('#list-appProvideDept').treeview({
                    data: data.organCodeList,
                    onNodeSelected: function (event, node) {
                        var $provideDeptList = $("#appProvideDeptName");
                        $provideDeptList.data("appProvideDeptCode", node.code);
                        $provideDeptList.data("appProvideDeptName", node.text);
                    }
                });
                var list = $('#list-appProvideDept').children().children();
            } else {
                dmallError("获取数据资源提供单位列表失败");
            }
        },
        "json"
    );
}
//数据资源提供单位提交
$("#appProvideDept_btn_commit").click(function () {
    appProvideDeptCode = $appProvideDeptName.data('appProvideDeptCode');
    appProvideDeptName = $appProvideDeptName.data('appProvideDeptName');
    $("#appProvideDeptCode").val(appProvideDeptCode);
    $("#appProvideDeptName").val(appProvideDeptName);
});
//数据资源提供单位验证
function checkappProvideDeptNameValue() {
    if($('#appProvideDeptName').val()){
        return false;
    }else {
        checkNotBlank($('#appProvideDeptName'),$('.errorAppProvideDept'),'*请选择数据资源提供单位');
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


//系统在用标识判断
function useFlagChange() {
    //console.log($('#useFlag').val());
    var useFlag = $('#useFlag option:selected').val();
    if (useFlag == 1) {
        $('#offlineDateDiv').prop("hidden", true);
        $('#offlineDate').val(" ");
        $('#offlineDateDivDef').removeAttr("hidden");
    } else {
        $('#offlineDateDiv').removeAttr("hidden");
        $('#offlineDateDivDef').prop("hidden", true);
    }
}

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
    $('#offlineDate').datetimepicker('setStartDate', $('#onlineDate').val());
});

$('#offlineDate').datetimepicker({
    language:  'zh-CN',
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0
}).on('changeDate', function() {
    $('#onlineDate').datetimepicker('setEndDate', $('#offlineDate').val());

});



//获取行业类别代码
function getIndustryCode() {
    $("#appSystemNo").removeClass("border-red");
    $(".errorAppSystemNo").hide();

    var industryCode = $('#appIndustryCode option:selected').val();
    var systemNo = "";
    var arr = $('#appSystemNo').val().split("-");
    for (var i = 0; i < arr.length; i++) {
        if (i == 2) {
            arr[2] = industryCode
        }
        if (i == arr.length - 1) {
            systemNo += arr[i];
        } else {
            systemNo += arr[i] + "-";
        }
    }

    $('#appSystemNo').val(systemNo);
}

$('#appIndustryCode').blur(function () {
    getIndustryCode();
});
//应用系统编号获取焦点
$("#appSystemNo").focus(function () {
    $("#appSystemNo").removeClass("border-red");
    $(".errorAppSystemNo").hide();
    var appSystemNo = "";
    if ($('#appIndustryCode option:selected').val() == "请选择") {
        appSystemNo = "A-" + $('#appRoutinePowerDeptCode').val() + "-";
    } else {
        appSystemNo = "A-" + $('#appRoutinePowerDeptCode').val() + "-" + $('#appIndustryCode option:selected').val() + "-00001";
    }
    $("#appSystemNo").val(appSystemNo);
});
//应用系统编号失去焦点
function createCheckAppNo() {

    if (isEmpty($('#appSystemNo').val())) {
        $('#appSystemNo').addClass("border-red");
        $(".errorAppSystemNo").html("*请输入应用系统编号");
        $(".errorAppSystemNo").css("display", "block");
        preventDefaultFlag = true;
    } else {
        var arr = $('#appSystemNo').val().split("-");
        var isFlag = false;

        if ((arr.length != 4) || isEmpty(arr[3]) || (arr[0] != "A") || (arr[1] != $('#appRoutinePowerDeptCode').val()) || !inputCheckCodeNum(arr[3])) {
            $('#appSystemNo').addClass("border-red");
            $(".errorAppSystemNo").html("*应用系统编号格式有误，请重新输入");
            $(".errorAppSystemNo").css("display", "block");
            preventDefaultFlag = true;
        }
        if (arr[2] != $('#appIndustryCode option select').val()) {
            $('#appIndustryCode option').each(function () {
                if ($(this).val() == arr[2]) {
                    $(this).parent().val(arr[2]);
                    isFlag = true;
                }
            });
            if (!isFlag) {
                $('#appSystemNo').addClass("border-red");
                $(".errorAppSystemNo").html("*无对应的行业类别，请重新输入");
                $(".errorAppSystemNo").css("display", "block");
                preventDefaultFlag = true;
            }
        }
    }
}
$("#appSystemNo").blur(function () {
    createCheckAppNo();
});


/* 5位数字 */
function inputCheckCodeNum(string) {
    var regex = /^[0-9]{5}$/
    return regex.test(string);
}

//不为空校验
function isEmpty(string) {
    if((string == "") || (string == null) || (string == undefined)) {
        return true;
    }

    return false;
}
//是否为空值
function createCheckIsEmpty(obj, name, message) {
    var string = obj.val();
    if(isEmpty(string)) {
        obj.addClass("border-red");
        $('.error'+name).html(message);
        $('.error'+name).css("display", "block");
        preventDefaultFlag = true;
    } else {
        obj.removeClass("border-red");
        $('.error'+name).hide();
    }
}

// /* 输入中文、英文字母、数字、下划线 */
// function inputCheckName(string) {
//     var regex = /^[\w\u4e00-\u9fa5_]{1,200}$/;
//     return regex.test(string);
// }

function checkAppSystemName() {
    if (isEmpty($("#appSystemName").val())) {
        $("#appSystemName").addClass("border-red");
        $('.errorAppSystemName').html("*请输入应用系统名称");
        $('.errorAppSystemName').css("display", "block");
        preventDefaultFlag = true;
    } else {
        $("#appSystemName").removeClass("border-red");
        $('.errorAppSystemName').hide();
    }
}

$("#appSystemName").blur(function () {
    checkAppSystemName();
});
$("#appSystemDesc").blur(function () {
    createCheckIsEmpty($("#appSystemDesc"), 'AppSystemDesc', "请输入应用系统说明，1000字以内");
});
$("#contractorName").blur(function () {
    createCheckIsEmpty($("#contractorName"), 'ContractorName', "请输入承建单位名称，100字以内");
});
$("#onlineDate").focus(function () {
    $("#onlineDate").removeClass("border-red");
    $('.errorOnlineDate').hide();
});

$("#databaseProductDesc").blur(function () {
    createCheckIsEmpty($("#databaseProductDesc"), 'DatabaseProductDesc', "请输入数据库产品描述，400字以内");
});
$("#accessAddress").blur(function () {
    createCheckIsEmpty($("#accessAddress"),'AccessAddress', "请输入应用系统访问地址");
});

//提交创建信息
function createAppSystemCheckAll() {
    createCheckAppNo();
    checkAppSystemName();
    createCheckIsEmpty($("#appSystemDesc"), 'AppSystemDesc', "请输入应用系统说明，1000字以内");
    createCheckIsEmpty($("#contractorName"), 'ContractorName', "请输入承建单位名称，100字以内");
    createCheckIsEmpty($("#onlineDate"), 'OnlineDate', "请选择上线时间");

    createCheckIsEmpty($("#databaseTypeCodes"), 'DatabaseTypeCodes', "请选择数据库类型代码");
    createCheckIsEmpty($("#databaseProductDesc"), 'DatabaseProductDesc', "请输入数据库产品描述，400字以内");
    createCheckIsEmpty($("#accessAddress"), 'AccessAddress', "请输入应用系统访问地址");
    checkappProvideDeptNameValue();
}
$("#btn_commitCreateInfo").click(function () {

    preventDefaultFlag=false;

    createAppSystemCheckAll();
    if(preventDefaultFlag==true)
    {
        return false;
    }
    else {
        var arr = $('#onlineDate').val().split("-");
        var online = new Date(arr[0], parseInt(arr[1])-1, arr[2]);
        var appSystem = {
            "appSystemNo": $('#appSystemNo').val(),
            "appSystemName": $('#appSystemName').val(),
            "appSystemDesc": $('#appSystemDesc').val(),
            "routinePowerDeptCode": $('#appRoutinePowerDeptCode').val(),
            "contractorName": $('#contractorName').val(),
            "onlineDate": online,
            "databaseTypeCode": typeCodes,
            "databaseProductDesc": $('#databaseProductDesc').val(),
            "industryCode": $('#appIndustryCode').val(),
            "appSystemTypeCode": $('#appSystemTypeCode option:selected').val(),
            "useFlag": $('#useFlag option:selected').val(),
            "accessAddress": $('#accessAddress').val(),
            "registerDeptCode": $('#appProvideDeptCode').val()
        }

        if ($('#useFlag option:selected').val() == 0 && !isEmpty($('#offlineDate').val())) {
            arr = $('#offlineDate').val().split("-");
            var offline = new Date(arr[0], parseInt(arr[1])-1, arr[2]);
            appSystem.offlineDate = offline;
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
