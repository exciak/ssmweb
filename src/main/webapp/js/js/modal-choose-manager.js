/**
 * Created by ss on 2016/11/2.
 */
$(document).ready(function(){
    var outsideTag = 1;
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
        outsideTag = 1;
        $(".errorUserName").hide();
    });
    // 用户列表翻页
    $("#previouspage").click(function () {
        if (parseInt($("#currentPage").val()) > 1) {
            getUserNameList(parseInt($("#currentPage").val()) - 1);
        }
    });

    $("#nextpage").click(function () {
        if (parseInt($("#currentPage").val()) < parseInt($("#totalPage").val())) {
            getUserNameList(parseInt($("#currentPage").val()) + 1);
        }
    });
    //隐藏用户列表
    $("#userNameDiv").focus();
    $("#userNameDiv").blur(function(){
        $(this).hide();
    });
    $("body").not($("#userNameDiv")).click(function () {
        if (outsideTag != 1) {
            $("#userNameDiv").hide();
        }
        outsideTag = 0;
    });
    $("#commitBtn").click(function(){
        var userId = $("#userName").data("userId");
        var userName = $("#userName").val();
        if(checkUserName()){
            return false;
        }
        if(!checkUserNameUniq(userId)){
            var newOption = new Option(userName, userId);
            $('#selectManagerList').append(newOption);
        }
    });
    function checkUserNameUniq(id){
        var $selectShow = $('#selectManagerList');
        var count = $('#selectManagerList option').length;
        var tag = false;
        for (var i=0; i<count; i++){
            var selectedId = $selectShow.get(0).options[i].value;
            if(selectedId == id){
                tag = true;
            }
        }
        return tag;
    }
    //检查用户名输入框
    function checkUserName(){
        if($("#userName").val() == ""){
            $("#userName").addClass("errorC");
            $(".errorUserName").show();
            $(".errorUserName").html("*请输入用户名");
            return true;
        } else{
            $("#userName").removeClass("errorC");
            $(".errorUserName").hide();
            return false;
        }
    }

    $("#btnAddManager").click(function (){
        emptyModal("addManagerModal");
        $("#userNameDiv").hide();
        $("#errorMsg").hide();
        $("#editRoleDiv").hide();
        $("#userName").show();
        $('#addManagerModal').modal({backdrop: 'static', keyboard: false});
    });
    $("#userListDiv").delegate("input[name='idsDeptManager']:enabled", "click", function () {
        $(".errorMsgNotChecked").hide();
    });
    $("#btnDelManager").click(function (){
        var $selectSrc = $('#selectManagerList');
        var count = $('#selectManagerList option').length;
        $("#userListDiv").empty();
        if(count <= 0){
            $("#userListDiv").append("不存在管理员");
            $('#delManagerModal').modal({backdrop: 'static', keyboard: false});
            return false;
        }
        for (var i=0; i<count; i++){
            var optionSrc = $selectSrc.get(0).options[i];
            $("#userListDiv").append('<div style="height: 20px"><input type="checkbox" name="idsDeptManager" id="'+optionSrc.value+'" style="margin:0 5px" value="'+optionSrc.text+'">'+optionSrc.text+'</div>');
        }
        $(".errorMsgNotChecked").hide();
        $('#delManagerModal').modal({backdrop: 'static', keyboard: false});
    });
    $("#btnManagerCommit").click(function(){
        if($("input[name='idsDeptManager']:checked").size() <= 0){
            $(".errorMsgNotChecked").show();
            return false;
        }
        var $selectShow = $('#selectManagerList');
        $selectShow.empty();
        $("input[name='idsDeptManager']").not("input:checked").each(function (){
            var newOption = new Option(this.value, this.id);
            $selectShow.append(newOption);
        });
    });
});