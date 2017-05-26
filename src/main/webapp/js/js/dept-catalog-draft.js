/**
 * Created by lixy on 2016/1/6.
 */

$(document).ready(function () {

    var allResourceDetailName = "所有资源型态";

    var subType = $("#subType").val();

    /*横向菜单选择*/
    $("#allQuery").attr("href", "../submit/catalogs?subType=ALL");

    $("#filterQuery").attr("href", "../submit/catalogs?subType=SUBMITING&state=0");

    if (subType == "ALL") {
        $("#allQuery").addClass("a-selected");
        $("#filterQuery").removeClass("a-selected");
        $("select[name=state]").attr("disabled", false);
    } else if (subType == "SUBMITING") {
        $("#allQuery").removeClass("a-selected");
        $("#filterQuery").addClass("a-selected");
        $("select[name=state]").attr("disabled", true);
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
                                resourceDetailIndexcodeTemp = '';
                                resourceDetailNameTemp = '';
                            } else {
                                resourceDetailIndexcodeTemp = node.indexCode;
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
            $("#resourceDetailIndexcode").val(resourceDetailIndexcodeTemp);
            $("#resourceDetailName").val(resourceDetailNameTemp);
        }
    );

});

//打开批量删除确认框
function openDelModal() {
    //打开模态框
    $('#delModal').modal({backdrop: 'static', keyboard: false});
    $("#delOneBtn").hide();
    $("#delBatchBtn").show();
}

function delSubmit() {

    // 获取选择的资源目录ids
    var indexList = "";
    for (var i = 0; i < $("#listTable input[name='ids']:enabled:checked").size(); i++) {
        indexList = indexList + $("#listTable input[name='ids']:enabled:checked")[i].value;
        if ((i + 1) != $("#listTable input[name='ids']:enabled:checked").size()) {
            indexList += ',';
        }
    }
    // 执行删除操作
    $.post("../../content/delete/catalogs",{
            ids: indexList
        },function(data,success){
            if (data.result == "success") {
                dmallNotifyAndLocation("资源目录删除成功", window.location.href);
            } else {
                dmallError(data.result);
            }
        },
        "json"
    );
}

/*删除编目*/
function delCatalogFlow(id){
    $('#delModal').modal({backdrop: 'static', keyboard: false});
    $("#delBatchBtn").hide();
    $("#delOneBtn").show();
    $('#delModal').data("cataId",id);
}
$("#delOneBtn").click(function(){
    $.post("../../content/delete/catalog/cid",{
            id: $('#delModal').data("cataId")
        },function(data,success){
            if (data.result == "success") {
                dmallNotifyAndLocation("资源目录删除成功", window.location.href);
            } else {
                dmallError(data.result);
            }
        },
        "json"
    );
});
