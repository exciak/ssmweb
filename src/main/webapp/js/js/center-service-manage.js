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
        $("#addProviderTitle").text("请选择发布部门");
        //打开模态框
        openProvider();
    });

    //打开选择发布部门的弹出框
    function openProvider() {
        //打开模态框
        $('#addProvider').modal({backdrop: 'static', keyboard: false});
        getProviderList();
    }

    //获取主题分类
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

    //资源分类提交
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
        $.get(rootPath+"/share/resourceDetail", {},
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
        //打开模态框
        openIndustry();
    });

    //打开选择行业的弹出框
    function openIndustry() {
        //打开模态框
        $('#addIndustry').modal({backdrop: 'static', keyboard: false});
        $('#list-business').treeview();
        $(".notifications").empty();
        $('#businessId').val("");
        $('#businessName').val("");
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


//打开撤销发布确认框
function openRemoveConfirm(id) {
    //打开模态框
    $('#removeConfirm').modal({backdrop: 'static', keyboard: false});
    $('#removeConfirm').data("cataId",id);
}
//撤销发布
function revokeCatalog() {
    $.post("../../../center/service/manage/catalogs/cid",
        {
            id: $('#removeConfirm').data("cataId"),
            action: "revoke"
        },
        function (data, status) {
            if (data.result != "success") {
                dmallError(data.result);
            } else {
                window.location.href = "../../../center/service/manage/catalogs";
            }
        },
        "json");
}

//发布目录
function publishCatalog(id) {
    $.post("../../../center/service/manage/catalogs/cid",
        {
            id: id,
            action: "publish"
        },
        function (data, status) {
            if (data.result != "success") {
                dmallError(data.result);
            } else {
                window.location.href = "../../../center/service/manage/catalogs";
            }
        },
        "json");
}

/*查看流程*/
function checkCatalogFlow(id) {
    window.location.href = "../../../center/service/manage/catalogs/cid?id=" + id;
}
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

//同步目录
function reportCatalogs() {
    var ids="";
    var resourceNos="";
    var len = $("#listTable tr").length;
    var flag = false;
    for(var i=0;i<len;i++){
        var v = "";
        if($("#listTable tr").eq(i).find("td").eq(0).find("input").prop("checked")){
            if($("#listTable tr").eq(i).find("td").eq(8).text().trim()!="已发布"){
                dmallError("非'已发布'状态的编目不能同步!")
                return false;
            }
            if(flag){
                v = ",";
            }
            ids =ids+v+$("#listTable tr").eq(i).find("td").eq(0).find("input").val();
            resourceNos =resourceNos+v+$("#listTable tr").eq(i).find("td").eq(0).text().trim();
            flag = true;
        }
    }
    if(ids=="," || ids==""){
        dmallError("请先选择要同步的数据资源");
        return false;
    }
    $.get(rootPath+"/center/service/manage/report/catalogs",
        {
            ids:ids,
            resourceNos:resourceNos
        },
        function (data, status) {
            if (data.result == "success") {
                dmallNotify ("提交同步成功");
            } else {
                dmallError("同步成功，但"+data.result);
            }
        },
        "json");
    dmallNotify ("正在提交同步操作...");
}




















