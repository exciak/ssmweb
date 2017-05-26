/**
 * Created by xunzhi on 2015/8/7.
 */

$(document).ready(function(){
    var outsideTag = 1;
    //打开添加角色弹出框
    $("#addRoleBtn").click(function(){
        emptyModal("addRoleModal");
        $("#roleListFloat").find(":checkbox").attr("checked",false);
        $("#userNameDiv").hide();
        $("#errorMsg").hide();
        $("#editRoleDiv").hide();
        $("#userName").show();
        $('#addRoleModal').modal({backdrop: 'static', keyboard: false});
    });
    var $clear = $("#btn_clear");
    //清除查询条件
    $clear.click(function () {
        $("#searchName").val("");
    });
    //get username list
    function getUserNameList(page) {
        var myString = $("#userNameSearch").val();
        $.get("../user_role/getUserList",
            {
                searchUserName: myString,
                pageNumber:page
            },
            function (data, status) {
                if (status == "success"&& (data.result == "success")) {
                    $("#userNameList").empty();
                    if(data.resultList.result.length > 0){
                        for (var i = 0; i < data.resultList.result.length; i++) {
                            var users = data.resultList.result[i];
                            var trHTML = '<li class="longText" id=' + users.id + ' title=' + users.name + '>' +  users.name + '</li>';
                            $("#userNameList").append(trHTML);
                        }
                        $("#currentPage").val(data.curPage);
                        $("#totalPage").val(data.totalPage);
                        $("#wrongMsg").hide();
                        if(data.totalPage == 1){
                            $("#pageDiv").hide();
                        } else{
                            $("#pageDiv").show();
                        }
                    } else{
                        $("#wrongMsg").show();
                        $("#pageDiv").hide();
                    }
                    //   $("#modalHeight").css("height","300px");
                } else {
                    dmallError(data.result);
                }
            },
            "json"
        );
    }

    $("#userNameSearch").keyup(function(){
        getUserNameList(1);
    });
    $("#userNameSearch").focus(function(){
        getUserNameList(1);
        outsideTag = 1;
    });
    $("#userNameSearch").click(function(){
        outsideTag = 1;
    });
    $("#pageDiv").click(function(){
        outsideTag = 1;
    });
    $("#userName").focus(function () {
        $("#userName").removeClass("errorC");
        $(".errorSelectedId").hide();
        $("#userNameDiv").show();
        $("#userNameSearch").val("");
        $("#userNameSearch").focus();
        outsideTag = 1;
    });
    //选择用户名
    $("#userNameList").delegate("li","click",function(){
        var userId = this.id;
        var userName = this.innerText;
        $("#userName").val(userName);
        $("#userName").data("userId",userId);
        $("#userNameDiv").hide();
     //   $("#modalHeight").css("height","150px");
        queryRole(userId);
        outsideTag = 1;
    });
    // 用户列表翻页
    $("#previouspage").click(
        function () {
            if (parseInt($("#currentPage").val()) > 1) {
                getUserNameList(parseInt($("#currentPage").val()) - 1);
            }
        });

    $("#nextpage").click(
        function () {
            if (parseInt($("#currentPage").val()) < parseInt($("#totalPage").val())) {
                getUserNameList(parseInt($("#currentPage").val()) + 1);
            }
        });
    //隐藏用户列表
    $("#userNameDiv").focus();
    $("#userNameDiv").blur(function(){
        $(this).hide();
    });
    //提交修改
    $("#commitBtn").click(function(){
        var modifyUserId = $("#userName").data("userId");
        var roleList = [];
        var i = 0;
        $("#roleListFloat").find(":checkbox:checked").each(function () {
            var val = this.name;
            roleList[i++] = val;
        });
        if(!$("#userName").is(":hidden") && !checkUserName()){
            return false;
        } else if(roleList.length < 1){
            $("#errorMsg").show();
            return false;
        }else{
            $("#errorMsg").hide();
        }
        doPost(modifyUserId,roleList);
    });
    $("#delBtn").click(function(){
        var modifyUserId = $("#userName").data("userId");
        var roleList = [];
        doPost(modifyUserId,roleList);
    });
    //点击div以外隐藏
    $("body").not($("#userNameDiv")).click(function () {
        if (outsideTag != 1) {
            $("#userNameDiv").hide();
        }
        outsideTag = 0;
    });
});
//检查用户名输入框
function checkUserName(){
    if($("#userName").val() == ""){
        $("#userName").addClass("errorC");
        $(".errorUserName").show();
        $(".errorUserName").html("*请输入用户名");
        return false;
    } else{
        $("#userName").removeClass("errorC");
        $(".errorUserName").hide();
        return true;
    }
}
//打开修改角色弹出框
function editRole(obj,userId){
    emptyModal("addRoleModal");
    var userName = $(obj).parent().prev().prev().prev().prev().text();
    $("#userName").data("userId",userId);
    $("#userName").hide();
    queryRole(userId);
    $("#editRoleDiv").text(userName);
    $("#editRoleDiv").show();
    $("#userNameDiv").hide();
    $("#errorMsg").hide();
    $('#addRoleModal').modal({backdrop: 'static', keyboard: false});
}
//查询用户角色
function queryRole(userId){
    $.get("rolelist",
        {
            queryUserId:userId
        },
        function(data,status){
            if(status == "success"&& (data.result == "success")){
                $("#roleListFloat").find(":checkbox").attr("checked",false);
                for(var i=0;i<data.roleList.length;i++){
                    $("#roleListFloat").find(":checkbox").each(function() {
                        if(this.value == data.roleList[i]){
                            $(this).attr("checked","checked");
                        } else{
                        }
                    });
                }
            } else{
                dmallError(data.result);
            }
        },
        "json");
}
//删除用户角色
function delRole(userId){
    $('#delRoleModal').modal({backdrop: 'static', keyboard: false});
    $("#userName").data("userId",userId);
}
//提交
function doPost(modifyUserId,roleList){
    $.post("modify_role",
        {
            modifyUserId:modifyUserId,
            roleList:roleList
        },
        function (data, status) {
            if (status == "success"&& (data.result == "success")) {
                window.location = window.location.href
            } else {
                dmallError(data.result);
            }
        },
        "json"
    );
}