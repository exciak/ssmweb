/**
 * Created by lixy on 2016/1/6.
 */

$(document).ready(function () {

    var allResourceDetailName = "所有资源型态";
    //var resourceDetailCodeTemp = null;
    var resourceDetailNameTemp = null;
    var resourceDetailIndexCode = null;
    //var resourceDetailIdTemp = null;

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
                                //resourceDetailIdTemp = '';
                                resourceDetailNameTemp = '';
                                resourceDetailIndexCode = '';
                            } else {
                                //resourceDetailIdTemp = node.id;
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
            console.log(resourceDetailIndexCode);
            //$("#resourceDetailId").val(resourceDetailIdTemp);
            $("#resourceDetailName").val(resourceDetailNameTemp);
            $("#resourceDetailIndexcode").val(resourceDetailIndexCode);

        }
    );

});


/*表单操作*/

/*编辑操作*/
function editCatalog(id) {
    window.location.href = "../../dept/content/catalog/" + id;
}

/*查看流程*/
function checkCatalogFlow(id) {
    //var SubmenuValue = $("#subType").val();
    //var dataId = $("#dataId").val();
    //var dataName = $("#dataName").val();
    //var dataDesp = $("#dataDesp").val();
    //var dataType = $("#dataType").children("option:selected").val();
    //var dataDepart = $("#dataDepart").val();
    //var reviewedState = $("#reviewedState").children("option:selected").val();
    //var pageNumber = $("#pageNumber").val();
    //window.location.href = "" + "shelve_record?orderId=" + orderId;
    window.location.href = "../../dept/content/catalog/flow/" + id;
}


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










