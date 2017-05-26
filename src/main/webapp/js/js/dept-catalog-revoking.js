/**
 * Created by lixy on 2016/1/6.
 */

$(document).ready(function () {

    var allResourceDetailName = "所有资源型态";

    /*横向菜单选择*/
    //$("#allQuery").attr("href", "../revoking/catalogs?subType=ALL");
    //$("#filterQuery").attr("href", "../revoking/catalogs?subType=REVOKING&state=8");

    $("#allQuery").click(function () {
        $("#subType").val("ALL");
        $("#state").val("ALL");
        $("#searchmessage").click();
    });
    $("#filterQuery").click(function () {
        $("#subType").val("REVOKING");
        $("#state").val(8);
        $("#searchmessage").click();
    });

    if ($("#state").val() == 8) {
        $("#subType").val("REVOKING");
    } else {
        $("#subType").val("ALL");
    }

    var subType = $("#subType").val();

    if (subType == "ALL") {
        $("#allQuery").addClass("a-selected");
        $("#filterQuery").removeClass("a-selected");
    } else if (subType == "REVOKING") {
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

    $("#resultList").click(function () {
        var selectedValue = $(this).val();
        if (0 == selectedValue) {
            // 如果是不通过，则不显示 下一步操作人选项
            $("#nexUserDiv").hide();
        } else {
            $("#nexUserDiv").show();
        }
    });

});

/*审核操作*/
function reviewCatalog(idInfo, result, comment, nextUserId) {
    $("#btn_bulkCommit").attr("disabled",true);
    $("#terminate_btn").attr("disabled",true);
    $.ajax({
        type: "POST",
        url: "../../content/revoking/catalogs",
        data: {
            ids: idInfo,
            result: result,
            comment: comment
        },
        dataType: "json",
        success: function (data) {
            if (data.result == "success") {
                window.location = window.location.href;
               // dmallNotifyAndLocation("资源目录撤销权签成功", window.location.href);
            } else {
                $("#btn_bulkCommit").attr("disabled",false);
                $("#terminate_btn").attr("disabled",false);
                dmallError(data.result);
                //dmallNotifyAndLocation(data.result,window.location.href);
            }
        },
        error: function () {
            dmallAjaxError();
        }
    });
}

// 打开批量撤销审核弹框
function openBulkModal() {
    emptyModal("catalogOpModal");
    //打开模态框
    $('#catalogOpModal').modal({backdrop: 'static', keyboard: false});
}

/*执行批量审核撤销操作*/
$("#btn_bulkCommit").click(function() {
    doAction("Agree");
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
function doAction(action){
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
    // 获取是否通过
    var result = action;
    // 意见
    var comment = $("#review_reason").val();
    // 下一步评审人
    var nextUserId = "";
    // 执行撤销审核操作
    reviewCatalog(indexList, result, comment, nextUserId);
}
