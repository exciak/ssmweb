/**
 * Created by lixy on 2016/1/6.
 */


$(document).ready(function () {

    var $selectAll = $("#selectAll");
    var $actionButton = $("#actionButton");
    var $ids = $("input[name='ids']");
    var $enabledIds = $("input[name='ids']:enabled");
    /*tab菜单选择*/
    //$("#allQuery").attr("href", "../revoking/catalogs?subType=ALL");
    //$("#filterQuery").attr("href", "../revoking/catalogs?subType=REVOKING&state=6");

    $("#allQuery").click(function () {
        $("#subType").val("ALL");
        $("#state").val("ALL");
        $("#searchmessage").click();
    });
    $("#filterQuery").click(function () {
        $("#subType").val("REVOKING");
        $("#state").val(6);
        $("#searchmessage").click();
    });

    if ($("#state").val() == 6) {
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

    function isShowSelectAll() {
        if ($enabledIds.size() <= 0) {
            $("#actionDiv").addClass("hidden");
        }else {
            $("#actionDiv").removeClass("hidden");
        }
    }

    //是否显示全选按钮
    isShowSelectAll();
    /******选择业务类型*****/
    var allBusinessName = "所有业务";
    var businessIdTemp = null;
    var businessNameTemp = null;

    //选择主题分类
    $("#chooseBusiness").click(function () {
        //设置弹窗标题
        $("#addBusinessTitle").text("请选择业务分类");
        //打开模态框
        openBusiness();
    });

    //打开选择主题的弹出框
    function openBusiness() {
        //打开模态框
        $('#addBusiness').modal({backdrop: 'static', keyboard: false});
        $(".notifications").empty();
        if($("#industryId").val()==""||$("#industryId").val()==undefined){

            dmallError("请先选择行业类别");
        }else{
            getBusinessList();
        }
    }

    //获取业务分类
    function getBusinessList() {
        $.get(rootPath+"/share/businessTree", {
                industryCode:$("#industryId").val()
            },
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {

                    var treeData = [{
                        id: '',
                        code: '',
                        text: allBusinessName,
                        nodes: data.business_list
                    }];

                    $businessTree = $('#list-business').treeview({
                        data: treeData,
                        onNodeSelected: function (event, node) {
                            if (allBusinessName == node.text) {
                                businessIdTemp = null;
                                businessNameTemp = null;
                            } else {
                                businessNameTemp = node.text.split(" ")[0];
                                businessIdTemp = node.code;
                            }
                        }
                    });
                } else {
                    dmallError(data.result);
                }
            },
            "json"
        );
    }
    //业务分类提交
    $("#business_btn_commit").click(
        function () {
            $("#businessId").val(businessIdTemp);
            $("#businessName").val(businessNameTemp);
        }
    );


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
            $("#deptName").val(providerNameTemp);
        }
    );

    var allResourceDetailName = "所有资源型态";
    var resourceDetailCodeTemp = null;
    var resourceDetailNameTemp = null;

    //选择资源形态分类
    $("#chooseResource").click(function () {
        //设置弹窗标题
        $("#addResourceTitle").text("请选择资源形态分类");
        //打开模态框
        openResource();
    });

    //打开选择资源的弹出框
    function openResource() {
        //打开模态框
        $('#addResource').modal({backdrop: 'static', keyboard: false});
        getResourceList();
    }

    //获取资源形态分类
    function getResourceList() {
        $.get("../../../share/resourceDetail", {},
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {

                    var treeData = [{
                        id: '',
                        code: '',
                        text: allResourceDetailName,
                        nodes: data.resource_detail_list
                    }];

                    $resourceTree = $('#list-resource').treeview({
                        data: treeData,
                        onNodeSelected: function (event, node) {
                            if (allResourceDetailName == node.text) {
                                resourceDetailCodeTemp = null;
                                resourceDetailNameTemp = null;
                            } else {
                                resourceDetailCodeTemp = node.indexCode;
                                resourceDetailNameTemp = node.text;
                                resourceDetailIndexCode = node.indexCode;
                                $("#resourceDetailIndexCode").val(resourceDetailIndexCode);
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
            $("#resourceDetailIndexCode").val(resourceDetailCodeTemp);
            $("#resourceDIndexCode").val(resourceDetailCodeTemp);
            $("#resourceDetailName").val(resourceDetailNameTemp);
        }
    );


    var allIndustryName = "所有行业";
    var industryIdTemp = null;
    var industryNameTemp = null;

    //选择行业分类
    $("#chooseIndustry").click(function () {
        //设置弹窗标题
        $("#addIndustryTitle").text("请选择行业分类");
        $('#list-business').treeview();
        $(".notifications").empty();
        //打开模态框
        openIndustry();
    });

    //打开选择行业的弹出框
    function openIndustry() {
        //打开模态框
        $('#addIndustry').modal({backdrop: 'static', keyboard: false});
        getIndustryList();
    }

    //获取行业分类
    function getIndustryList() {
        $.get(rootPath+"/share/onlyIndustry", {},
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {

                    var treeData = [{
                        id: '',
                        code: '',
                        text: allIndustryName,
                        nodes: data.industry_list
                    }];

                    $industryTree = $('#list-industry').treeview({
                        data: treeData,
                        onNodeSelected: function (event, node) {
                            if (allIndustryName == node.text) {
                                industryIdTemp = null;
                                industryNameTemp = null;
                            } else {

                                if(node.level == 1 || node.level == 2){
                                    industryNameTemp = node.text.split(" ")[0];
                                    industryIdTemp = node.code;
                                }else if(node.level == 3) {
                                    industryNameTemp = node.text.replace(/<\/?.+?>/g,"");
                                    industryIdTemp = node.id;
                                }

                            }
                        }
                    });
                } else {
                    dmallError("获取行业列表失败");
                }
            },
            "json"
        );
    }

    //主题分类提交
    $("#industry_btn_commit").click(
        function () {
            $("#industryId").val(industryIdTemp);
            $("#induCode").val(industryIdTemp);
            $("#industryName").val(industryNameTemp);
        }
    );
});

/*提交操作*/
function reviewCatalog(idInfo, result, comment) {
    $("#btn_bulkCommit").attr("disabled",true);
    $("#disagree_btn").attr("disabled",true);
    $("#terminate_btn").attr("disabled",true);
    $.ajax({
        type: "POST",
        url: "../../../center/content/revoking/catalogs",
        data: {
            ids: idInfo,
            result: result,
            comment: comment
        },
        dataType: "json",
        success: function (data) {
            if (data.result == "success") {
                location.href = window.location.href;
            } else {
                $("#btn_bulkCommit").attr("disabled",false);
                $("#disagree_btn").attr("disabled",false);
                $("#terminate_btn").attr("disabled",false);
                dmallError(data.result);
                //dmallNotifyAndLocation(data.result,window.location.href);
            }
        },
        error: function (data) {
            dmallAjaxError();
        }
    });
}

/*执行批量提交操作*/
$("#btn_bulkCommit").click(function() {
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
function doAction(action){
    // 获取选择的资源目录ids
    var indexList = "";
    for (var i = 0; i < $("#listTable input[name='ids']:enabled:checked").size(); i++) {
        indexList = indexList + $("#listTable input[name='ids']:enabled:checked")[i].value;
        if ((i + 1) != $("#listTable input[name='ids']:enabled:checked").size()) {
            indexList += ',';
        }
    }
    // 获取是否通过
    var result = action;
    // 意见
    var comment = $("#review_reason").val();
    // 执行提交操作
    reviewCatalog(indexList, result, comment);
}

/*打开批量审核弹框*/
function openBulkModal() {
    emptyModal("batchReview");
    //打开模态框
    $('#batchReview').modal({backdrop: 'static', keyboard: false});

}

/*查看流程*/
function checkCatalogFlow(id) {
    window.location.href = "../../../center/content/revoking/catalogs/cid?id=" + id + "&isView=true";
}

/*进入审核流程*/
function checkCatalogReviewFlow(id) {
    window.location.href = "../../../center/content/revoking/catalogs/cid?id=" + id + "&isView=false";
}