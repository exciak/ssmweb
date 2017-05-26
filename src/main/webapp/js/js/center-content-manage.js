/**
 * Created by lixy on 2016/1/6.
 */

var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];
var rootPath = "http://" + window.location.host + "/" + proName;
$(document).ready(function () {
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
        $(".notifications").empty();
        getProviderList();
    }

    //获取部门
    function getProviderList() {
        $.get(rootPath+"/share/department", {},
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
        $('#businessId').val("");
        $('#businessName').val("");
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
$().ready(function () {
    $("#resName").val($("#resourceName").val());
    $("#staTime").val($("#startTime").val());
    $("#enTime").val($("#endTime").val());
    $("#sta").val($("#state option:selected").val())
})

$("#resourceName").change(function () {
    $("#resName").val($("#resourceName").val());
});

$("#startTime").change(function () {
    $("#staTime").val($("#startTime").val());
});

$("#endTime").change(function () {
    $("#enTime").val($("#endTime").val());
});


// $("#industryName").change(function () {
//     $("#induCode").val($("#industryName").val())
// })
$("#state").change(function () {
    $("#sta").val($("#state option:selected").val())
})