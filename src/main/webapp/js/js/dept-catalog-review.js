/**
 * Created by lixy on 2016/1/6.
 */

$(document).ready(function () {

    var allResourceDetailName = "所有资源型态";

    /*横向菜单选择*/
    //$("#allQuery").attr("href", "../review/catalogs?subType=ALL");
    //$("#filterQuery").attr("href", "../review/catalogs?subType=REVIEWING&state=2");

    $("#allQuery").click(function () {
        $("#subType").val("ALL");
        $("#state").val("ALL");
        $("#searchmessage").click();
    });
    $("#filterQuery").click(function () {
        $("#subType").val("REVIEWING");
        $("#state").val(2);
        $("#searchmessage").click();
    });

    if ($("#state").val() == 2) {
        $("#subType").val("REVIEWING");
    } else {
        $("#subType").val("ALL");
    }

    var subType = $("#subType").val();

    if (subType == "ALL") {
        $("#allQuery").addClass("a-selected");
        $("#filterQuery").removeClass("a-selected");
    } else if (subType == "REVIEWING") {
        $("#allQuery").removeClass("a-selected");
        $("#filterQuery").addClass("a-selected");
    }

    //选择资源形态分类
    $("#chooseResource").click(function () {
        /* 设置弹窗标题 */
        $("#addResourceTitle").text("请选择资源形态分类");
        /* 打开模态框 */
        openResource();
    });
    function openResource() {
        //打开模态框
        $('#addResource').modal({backdrop: 'static', keyboard: false});
        getResourceList();
    }

    /* 获取资源形态分类 */
    function getResourceList() {
        var pathname = window.location.pathname;
        var arr = pathname.split("/");
        var proName = arr[1];
        $.get("/" + proName + "/res/tree", {},
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {

                    var treeData = [{
                        id: '',
                        code: '',
                        text: allResourceDetailName,
                        nodes: data.resource_list
                    }];

                    $resourceTree = $('#list-resource2').treeview({
                        data: treeData,
                        onNodeSelected: function (event, node) {
                            if (allResourceDetailName == node.text) {
                                resourceDetailIdTemp = '';
                                resourceDetailNameTemp = '';
                            } else {
                                resourceDetailIdTemp = node.id;
                                resourceDetailNameTemp = node.text;
                            }
                        }
                    });
                } else {
                    dmallError("获取资源形态列表失败");
                }
            },
            "json"
        );
    }
    //资源形态分类提交
    $("#resource_btn_commit").click(
        function () {
            $("#resourceDetailId").val(resourceDetailIdTemp);
            $("#resourceDetailName").val(resourceDetailNameTemp);
        }
    );
    $("#reviewerList").focus(function () {
        if ($("#reviewerList").children('option:selected').val() == "") {
            $("#reviewerList").removeClass("errorC");
            $(".errorReviewerList").hide();
        }
    });
    $("#reviewerList").blur(function () {
        checkReviewerValue();
    });
});

/*审核操作*/
function reviewCatalog(idInfo, result, comment, nextUserId) {
    $("#btn_bulkCommit").attr("disabled",true);
    $("#disagree_btn").attr("disabled",true);
    $("#terminate_btn").attr("disabled",true);
    $.ajax({
        type: "POST",
        url: "../../content/review/catalogs",
        data: {
            ids: idInfo,
            result: result,
            comment: comment,
            nextUserId: nextUserId
        },
        dataType: "json",
        success: function (data) {
            if (data.result == "success") {
                window.location = window.location.href;
            } else {
                $("#btn_bulkCommit").attr("disabled",false);
                $("#disagree_btn").attr("disabled",false);
                $("#terminate_btn").attr("disabled",false);
                dmallError(data.result);
            //    dmallNotifyAndLocation(data.result,window.location.href);
            }
        },
        error: function () {
            dmallAjaxError();
        }
    });
}

// 打开批量提交弹框
function openBulkModal() {
    emptyModal("catalogOpModal");
    //从后端获取人员并填充
    getUsers();
}

/*执行批量提交操作*/
$("#btn_bulkCommit").click(function() {
    if (checkReviewerValue()) {
        return false;
    }
    doAction("Agree");
});
$("#disagree_btn").click(function() {
    var $comment = $("#review_reason");
    var $commentWarning = $("#commentWarning");
    var comment = $comment.val();
    if(comment === ""){
        $commentWarning.show();
        $comment.addClass("errorC");
        return false;
    }else{
        $commentWarning.hide();
        $comment.removeClass("errorC");
        doAction("Disagree");
    }
});
$("#terminate_btn").click(function() {
    var $comment = $("#review_reason");
    var $commentWarning = $("#commentWarning");
    var comment = $comment.val();
    if(comment === ""){
        $commentWarning.show();
        $comment.addClass("errorC");
        return false;
    }else{
        $commentWarning.hide();
        $comment.removeClass("errorC");
        doAction("Terminate");
    }
});
/*批量审核操作*/
function doAction(action){
    var result = action;
    // 获取选择的资源目录ids
    var indexList = "";
    for (var i = 0; i < $("#listTable input[name='ids']:enabled:checked").size(); i++) {
        indexList = indexList + $("#listTable input[name='ids']:enabled:checked")[i].value;
        if ((i + 1) != $("#listTable input[name='ids']:enabled:checked").size()) {
            indexList += ',';
        }
    }
    if (indexList == "") {
        dmallError("请选择数据目录");
        return false;
    }
    // 意见
    var comment = $("#review_reason").val();
    // 下一步评审人
    var nextUserId = $("#reviewerList").val();
    // 执行提交操作
    reviewCatalog(indexList, result, comment, nextUserId);
}
function getUsers() {
    var indexList = "";
    for (var i = 0; i < $("#listTable input[name='ids']:enabled:checked").size(); i++) {
        indexList = indexList + $("#listTable input[name='ids']:enabled:checked")[i].value;
        if ((i + 1) != $("#listTable input[name='ids']:enabled:checked").size()) {
            indexList += ',';
        }
    }
    if (indexList == "") {
        dmallError("请选择数据目录");
        return false;
    }
    $.get("../../content/review/userlist",
        {
            ids: indexList
        },
        function (data, status) {
            if (status == "success" && data.result == "success") {
                if(data.needNextOperator){
                    $("#nextUserPara").show();
                    // 填充下拉列表
                    var $reviewerList = $('#reviewerList');
                    $reviewerList.empty();
                    $reviewerList.append(new Option("请选择", ""));
                    for (var i = 0; i < data.users.length; i++) {
                        var newOption = new Option(data.users[i].name, data.users[i].id);
                        $reviewerList.append(newOption);
                    }
                }else{
                    $("#nextUserPara").hide();
                }
                //打开模态框
                $('#catalogOpModal').modal({backdrop: 'static', keyboard: false});
            } else {
                dmallError(data.result);
            }
        },
        "json"
    );
}
function checkReviewerValue() {
    if ($("#reviewerList").children('option:selected').val() == "") {
        $("#reviewerList").addClass("errorC");
        $(".errorReviewerList").show();
        return true;
    }
}