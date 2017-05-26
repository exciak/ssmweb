/**
 * Created by xunzhi on 2015/8/7.
 */

$(document).ready(function(){
    var outsideTag = 1;
    var outsideTagN = 1;
    //get username list
    function getUserNameList(page,type) {
        var url = "";
        var myString = $("#"+type+"UserNameSearch").val();

        if(type == "old"){
            url = "../user_role/getHistoryUserPageByRole";
        } else {
            url = "../user_role/getUserPageByRole";
        }

        $.get(url,
            {
                searchUserName:myString,
                pageNumber:page,
                roleType:$("#roleType :selected").val()
            },
            function (data, status) {
                if (status == "success"&& (data.result == "success")) {
                    $("#"+type+"UserNameList").empty();
                    if(data.resultList.length > 0){
                        for (var i = 0; i < data.resultList.length; i++) {
                            var users = data.resultList[i];
                            var trHTML = '<li class="longText" id=' + users.id + ' title=' + users.name + '>' +  users.name + '</li>';
                            $("#"+type+"UserNameList").append(trHTML);
                        }
                        $("#"+type+"currentPage").val(data.curPage);
                        $("#"+type+"totalPage").val(data.totalPage);
                        $("#"+type+"wrongMsg").hide();
                        if(data.totalPage == 1){
                            $("#"+type+"pageDiv").hide();
                        } else{
                            $("#"+type+"pageDiv").show();
                        }
                    } else {
                        $("#"+type+"wrongMsg").show();
                        $("#"+type+"pageDiv").hide();
                    }
                } else {
                    dmallError(data.result);
                }
            },
            "json"
        );
    }
    $("#oldUserNameSearch").keyup(function(){
        getUserNameList(1,"old");
    });
    $("#newUserNameSearch").keyup(function(){
        getUserNameList(1,"new");
    });
    $("#oldUserNameSearch").focus(function(){
        outsideTag = 1;
        getUserNameList(1,"old");
    });
    $("#oldUserNameSearch").click(function(){
        outsideTag = 1;
    });
    $("#newUserNameSearch").focus(function(){
        outsideTagN = 1;
        getUserNameList(1,"new");
    });
    $("#newUserNameSearch").click(function(){
        outsideTagN = 1;
    });
    $("#oldpageDiv").click(function(){
        outsideTag = 1;
    });
    $("#newpageDiv").click(function(){
        outsideTagN = 1;
    });
    $("#oldUserName").focus(function () {
        $("#oldUserName").removeClass("errorC");
        $(".erroroldUserName").hide();
        $("#oldUserNameDiv").show();
        $("#oldUserNameSearch").val("");
        $("#oldUserNameSearch").focus();
        outsideTag = 1;
    });
    $("#newUserName").focus(function () {
        $("#newUserName").removeClass("errorC");
        $(".errornewUserName").hide();
        $("#newUserNameDiv").show();
        $("#newUserNameSearch").val("");
        $("#newUserNameSearch").focus();
        outsideTagN = 1;
    });
    $("#oldUserNameList").delegate("li","click",function(){
        var userId = this.id;
        var userName = this.innerText;
        $("#oldUserName").val(userName);
    //    $("#oldUserName").siblings("i").removeClass("hidden");
        $("#oldUserName").data("userId",userId);
        $("#oldUserNameDiv").hide();
        outsideTag = 1;
    });
    $("#newUserNameList").delegate("li","click",function(){
        var userId = this.id;
        var userName = this.innerText;
        $("#newUserName").val(userName);
     //   $("#newUserName").siblings("i").removeClass("hidden");
        $("#newUserName").data("userId",userId);
        $("#newUserNameDiv").hide();
        outsideTagN = 1;
    });
    // 用户列表翻页
    $("#oldpreviouspage").click(
        function () {
            if (parseInt($("#oldcurrentPage").val()) > 1) {
                getUserNameList(parseInt($("#oldcurrentPage").val()) - 1,"old");
            }
        });

    $("#oldnextpage").click(
        function () {
            if (parseInt($("#oldcurrentPage").val()) < parseInt($("#oldtotalPage").val())) {
                getUserNameList(parseInt($("#oldcurrentPage").val()) + 1,"old");
            }
        });
    $("#newpreviouspage").click(
        function () {
            if (parseInt($("#newcurrentPage").val()) > 1) {
                getUserNameList(parseInt($("#newcurrentPage").val()) - 1,"new");
            }
        });

    $("#newnextpage").click(
        function () {
            if (parseInt($("#newcurrentPage").val()) < parseInt($("#newtotalPage").val())) {
                getUserNameList(parseInt($("#newcurrentPage").val()) + 1,"new");
            }
        });
    //点击div以外隐藏
    $("body").not($("#userNameDiv")).click(function () {
        if (outsideTag != 1) {
            $("#oldUserNameDiv").hide();
        }
        outsideTag = 0;
        if (outsideTagN != 1) {
            $("#newUserNameDiv").hide();
        }
        outsideTagN = 0;
    });
    //确认替换
    $("#btn_commit").click(function(){
        if(!checkUserName("oldUserName") || !checkUserName("newUserName") ){
            return false;
        }
        var oldUserId = $("#oldUserName").data("userId");
        var newUserId = $("#newUserName").data("userId");
        if(oldUserId == newUserId){
            dmallError("请选择不同的用户");
            return false;
        }
        $("#oldUserNameChange").text($("#oldUserName").val());
        $("#newUserNameChange").text($("#newUserName").val());
        $("#oldUserNameChange2").text($("#oldUserName").val());
        $("#changeRole").text($("#roleType :selected").text());
        $("#queryRoleModal").modal({backdrop: 'static', keyboard: false});
    });
    $("#commitBtn").click(function(){
        $("#commitBtn").attr("disabled",true);
        $("#btn_commit").attr("disabled",true);
        var oldUserId = $("#oldUserName").data("userId");
        var newUserId = $("#newUserName").data("userId");
        var roleType = $("#roleType :selected").val();
        $.post("../plat_admin/assign",
            {
                oldUserId: oldUserId,
                newUserId: newUserId,
                roleType:roleType
            },
            function (data, status) {
                if (status == "success"&& (data.result == "success")) {
                    dmallNotifyAndLocation("分配任务成功",window.location.href);
                } else {
                    dmallError("分配任务失败");
                    $("#commitBtn").attr("disabled",false);
                    $("#btn_commit").attr("disabled",false);
                }
            },
            "json"
        );
    });
});
function checkUserName(name){
    if($("#"+name+"").val() == ""){
        $("#"+name+"").addClass("errorC");
        $(".error"+name+"").show();
        $(".error"+name+"").html("*请输入用户名");
        return false;
    } else{
        $("#"+name+"").removeClass("errorC");
        $(".error"+name+"").hide();
        return true;
    }
}
