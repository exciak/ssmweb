/**
 * Created by lixy on 2016/1/6.
 */

$(document).ready(function () {

    var allResourceDetailName = "所有资源型态";

    /*横向菜单选择*/
    //$("#allQuery").attr("href", "../revoke/catalogs?subType=ALL");
    //$("#canFilterQuery").attr("href", "../revoke/catalogs?subType=CANREVOKE&state=7");
    //$("#revokingFilterQuery").attr("href", "../revoke/catalogs?subType=REVOKEING&state=8");

    $("#allQuery").click(function () {
        $("#subType").val("ALL");
        $("#state").val("ALL");
        $("#searchmessage").click();
    });
    $("#canFilterQuery").click(function () {
        $("#subType").val("CANREVOKE");
        $("#state").val(7);
        $("#searchmessage").click();
    });

    if ($("#state").val() == 7) {
        $("#subType").val("CANREVOKE");
    } else {
        $("#subType").val("ALL");
    }

    var subType = $("#subType").val();

    if (subType == "ALL") {
        $("#allQuery").addClass("a-selected");
        $("#canFilterQuery").removeClass("a-selected");
        $("#revokingFilterQuery").removeClass("a-selected");
    } else if (subType == "CANREVOKE") {
        $("#allQuery").removeClass("a-selected");
        $("#canFilterQuery").addClass("a-selected");
        $("#revokingFilterQuery").removeClass("a-selected");
    } else if (subType == "REVOKEING") {
        $("#allQuery").removeClass("a-selected");
        $("#canFilterQuery").removeClass("a-selected");
        $("#revokingFilterQuery").addClass("a-selected");
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

});


/*撤销操作*/
function submitCatalog(idInfo,comment, nextUserId) {
    $("#btn_bulkCommit").attr("disabled",true);
    $.ajax({
        type: "POST",
        url: "../../content/revoke/catalogs",
        data: {
            ids: idInfo,
            comment: comment,
            nextUserId: nextUserId,
            result:"Agree",
            cancelMode:"NORMAL"
        },
        dataType: "json",
        success: function (data) {
            if (data.result == "success") {
                window.location = window.location.href;
            } else {
                $("#btn_bulkCommit").attr("disabled",false);
                dmallError(data.result);
                //dmallNotifyAndLocation(data.result,window.location.href);
            }
        },
        error: function () {
            dmallAjaxError();
        }
    });
}

// 打开批量撤销弹框
function openBulkModal() {
    emptyModal("catalogOpModal");
    //从后端获取人员并填充
    getUsers();
}

/*执行批量撤销操作*/
$("#btn_bulkCommit").click(function() {
    // 获取选择的资源目录ids
    var indexList = "";
    for (var i = 0; i < $("#listTable input[name='ids']:enabled:checked").size(); i++) {
        indexList = indexList + $("#listTable input[name='ids']:enabled:checked")[i].value;
        if ((i + 1) != $("#listTable input[name='ids']:enabled:checked").size()) {
            indexList += ',';
        }
    }
    // 意见
    var comment = $("#review_reason").val();
    // 只有通过了，在有下一步操作人
    var nextUserId = $("#reviewerList").val();
   /* if (nextUserId == undefined) {
        dmallError("请选择下一步操作人");
        return false;
    }*/
    if (indexList == "") {
        dmallError("请选择数据目录");
        return false;
    }

    // 执行撤销操作
    submitCatalog(indexList, comment, nextUserId);
});


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
    $.get("../../content/revoke/userlist",
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