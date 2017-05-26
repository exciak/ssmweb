var allResourceDetailName = "所有资源型态";
var resourceDetailIndexcodeTemp = '';
var resourceDetailNameTemp = '';

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
                            resourceDetailIndexcodeTemp = node.indexcode;
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