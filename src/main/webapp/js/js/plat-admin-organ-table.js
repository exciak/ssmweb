/**
 * Created by exciak on 2017/3/27.
 */
var preventDefaultFlag = false;
var operate = "";
var bHideFlag = true;
var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];
var rootPath = "http://" + window.location.host + "/" + proName;
var metaTreeData;
var $metaDataTree;
$(document).ready(function () {

    var treeData = [];
    var rootNode = {};
    var selectNode = {};
    $('#btn_clear').click(function(){
        $('#inputFilterOrganCode').val("");
        $('#inputFilterOrganName').val("");
    });
    //点击文本框显示选择树
    $('#inputFatherOrgan').click(function(){
        bHideFlag = false;
        if($("#organSelectDiv").is(":hidden")){
            $("#organSelectDiv").show();
        }else{
            $("#organSelectDiv").hide();
        };
    });

    /*    部门选择树*/
    getTreeDataInit();

    function getTreeDataInit() {
        //初始化根节点
        rootNode.id = 0;
        rootNode.code = null;
        rootNode.text = "根节点";
        rootNode.description = "根节点";
        rootNode.parent_code = null;

        //去后端获取treedata
        $.ajax({
            type: 'GET',
            url: rootPath+"/share/department",
            async: false,
            success: function (data) {
                if(data.result == "success"){
                    rootNode.nodes = [];

                    for(var i=0; i< data.department_list.length; i++){
                        rootNode.nodes[i] = data.department_list[i] ;
                    }
                }
                console.log(rootNode);
            },
            error: function () {
                dmallAjaxError();
            }
        });

        treeData[0] = rootNode;
    };

    /*function createTreeView(treeData) {
        $metaDataTree = $('#organSelectTreeView').treeview({
            data: treeData,
            expandIcon: 'glyphicon glyphicon-plus',
            collapseIcon: 'glyphicon glyphicon-minus',
            levels: 1,
            searchResultColor: "black",
            selectedBackColor: "#C7E7FE",
            selectedColor: "#55A0FE",
            onNodeSelected: function (event, node) {
                selectNode = node;
                bHideFlag = false;

                //点击文本框显示选择树

                $('#inputFatherOrgan').val(selectNode.text);
                $("#inputFatherOrgan").removeClass("border-red");
                $(".error3").hide();
                console.log(1);

                //先隐藏选择树
                $('#organSelectDiv').hide();
            },
            onNodeCollapsed: function(event, node) {
                bHideFlag = false;
            },
            onNodeExpanded: function (event, node) {
                bHideFlag = false;
            }
        });

        return $metaDataTree;
    }*/
    //画树
    function drawTree(treeData) {
        var tree = $('#organSelectTreeView').treeview({
            data: treeData,
            levels: 2,
            searchResultColor: "black",
            selectedBackColor: "#C7E7FE",
            selectedColor: "#55A0FE",
            onNodeSelected: function (event, node) {
                    var $metaList = $("#inputFatherOrgan");
                    $metaList.data("name", node.text);
                    $metaList.data("code", node.code);
                    $metaList.data("parent_code", node.parent_code);
                    $metaList.val($metaList.data("name"));
                    $("#inputFatherOrgan").removeClass("border-red");
                    $(".error3").hide();
                bHideFlag = false;
                $('#organSelectDiv').hide();
            },
            onNodeCollapsed: function(event, node) {
                bHideFlag = false;
            },
            onNodeExpanded: function (event, node) {
                bHideFlag = false;
            }
        });

        return tree;
    }
    var treeSearch = function (tree) {
        var tdata;
        tdata = treeData;
        drawTree(tdata);
        var search = $('#inputFatherOrgan').val();
        var pattern = toEscStr(search);
        var selectableNodes = tree.treeview('search', [pattern, {ignoreCase: false, exactMatch: false}]);
        if (search) {
            if (selectableNodes.length > 0) {
                var Nodes = [];
                for (var i = 0; i < selectableNodes.length; i++) {
                    var node = selectableNodes[i];
                    delete node.state;
                    if (node.nodes) delete node.nodes;
                    Nodes.push(node);
                }
            }
            tree = drawTree(Nodes);
        } else {
            tdata = treeData;
            tree = drawTree(tdata);
        }
    };
    $('#inputFatherOrgan').keyup(function () {
        treeSearch($organTreeView);

    });

    /*var $organTreeView = createTreeView(treeData);*/
    var $organTreeView = drawTree(treeData);


    function getNodeInOrganTree(textName){
        var pattern = toEscStr(textName);
        var options = {
            exactMatch: true,
            revealResults: true
        };

        var results = $organTreeView.treeview('search', [pattern, options]);

        if(results.length != 0){
            return results[0];
        }else{
            return null;
        }
    };

    var organCreate = function () {
        var createNode = {};
        var result = false;

        createNode.code = $('#inputOrganCode').val();

        //编码为空给出提示
        if("" == createNode.code){
            dmallError("请填写机构编码");
            return result;
        }

        //编码与父节点相同给出提示
        if(selectNode.code == createNode.code){
            dmallError("新增区域编码不能与父区域编码重复");
            return result;
        }

        createNode.text = $('#inputOrganName').val();
        createNode.description = $('#inputOrganDescription').val();
        createNode.parentCode = selectNode.code;
        console.log(rootPath+"/organ/create");
        //去服务端新增机构
        $.ajax({
            url:rootPath+"/organ/create",
            type:"POST",
            async: false,
            data:{
                code: createNode.code,
                name:createNode.text,
                parentCode: createNode.parentCode,
                description: createNode.description,
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    location.href = "organTable";
                    result = true;
                } else {
                    dmallError(data.result);
                    result = false;
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });

        return result;
    }

    var organModify = function () {

        var result = false;

        //去服务端修改节点
        $.ajax({
            url:rootPath+"/organ/edit",
            type:"POST",
            async: false,
            data:{
                id: $('#inputHiddenOrganId').val(),
                code: $('#inputOrganCode').val(),
                name:$('#inputOrganName').val(),
                description: $('#inputOrganDescription').val()
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    location.href = "organTable";
                    result = true;
                } else {
                    dmallError(data.result);
                    result = false;
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });

        return result;
    }

    var areaDelete = function () {

        //去服务端删除节点
        $.ajax({
            url:rootPath+"/organ/delete",
            type:"POST",
            data:{
                id: $('#inputHiddenOrganId').val()
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    location.href = "organTable";
                } else {
                    dmallError(data.result);
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });
    }

    /*编码获取焦距*/
    $("#inputOrganCode").focus(function () {
        var string = $("#inputOrganCode").val();

        $("#inputOrganCode").removeClass("border-red");
        $(".error1").hide();
    });

    /*编码失去焦距*/
    function checkOrganCode(){
        var string = $("#inputOrganCode").val();
        var ret = inputCheckOrganCode(string);
        if(!ret)
        {
            $("#inputOrganCode").addClass("border-red");
            $(".error1").html("*编码规范是前6位为数字，后6位为数字或字母，字母不能够使用I和O");
            $(".error1").css("display", "block");
            preventDefaultFlag = true;
        }
    };
    $("#inputOrganCode").blur(function(){
        checkOrganCode();
    });

    /*名称获取焦距*/
    $("#inputOrganName").focus(function () {
        var string = $("#inputOrganName").val();

        $("#inputOrganName").removeClass("border-red");
        $(".error2").hide();

    });

    /*名称失去焦距*/
    function checkOrganName(){
        var string = $("#inputOrganName").val();
        var ret = inputCheckName(string);
        if(!ret)
        {
            $("#inputOrganName").addClass("border-red");
            $(".error2").html("*请输入名称,由中文、数字、字母、下划线组成，1-120个字符");
            $(".error2").css("display", "block");
            preventDefaultFlag = true;
        }
    };
    $("#inputOrganName").blur(function(){
        checkOrganName();
    });

    /*名称获取焦距*/
    $("#inputFatherOrgan").focus(function () {
        var string = $("#inputFatherOrgan").val();
        var nodeTmp = getNodeInOrganTree(string);

        selectNode = nodeTmp;
        $("#inputFatherOrgan").removeClass("border-red");
        $(".error3").hide();

    });

    /*名称失去焦距*/
    function checkFatherOrgan(){
        var string = $("#inputFatherOrgan").val();
        var nodeTmp = getNodeInOrganTree(string);
        if(null != nodeTmp)
        {
            selectNode = nodeTmp;
        }else{
            $("#inputFatherOrgan").addClass("border-red");
            $(".error3").html("*请选择正确的父节点");
            $(".error3").css("display", "block");
            preventDefaultFlag = true;
        }
    }

    $("body").click(function(){
        var string = $("#inputFatherOrgan").val();
        if( bHideFlag == true){
            $("#organSelectDiv").hide();
            if(string != ""){
                checkFatherOrgan();
            }
        }
        bHideFlag = true;
    });

    function checkall(operate){
        checkOrganCode();
        checkOrganName();

        if(operate == "create"){
            checkFatherOrgan();
        }
    }

    $('#btnSubmit').click(function(){
        preventDefaultFlag = false;
        checkall(operate);
        if (preventDefaultFlag == true) {
            return false;
        }

        if(operate == "create"){
            return organCreate();
        }else if(operate == "modify"){
            return organModify();
        }
    });

    $('#btnDelSubmit').click(function(){
        areaDelete();
    });

    $('#cancelSubmit').click(function(){
        drawTree(treeData);
        $(".error3").hide();
    });
});

function clearAllErrInfo(){
    $("#inputOrganCode").removeClass("border-red");
    $(".error1").hide()
    $("#inputOrganName").removeClass("border-red");
    $(".error2").hide()
};

function createOrgan() {
    $("#inputOrganCode").attr("readonly",false);
    operate = "create";
    $('#manageModalLabel').html("创建机构");
    clearAllErrInfo();

    $('#inputOrganCode').val("");
    $('#inputOrganName').val("");
    $('#inputFatherOrgan').val("");
    $('#inputOrganDescription').val("");

    $('#divFatherOrgan').show();

    $('#manageOrganModal').modal({backdrop: 'static', keyboard: false});
}

//创建弹出框
function modifyOrgan(obj, id, pageNumber) {
    $("#inputOrganCode").attr("readonly",true);
    var tds=$(obj).parent().parent().find('td');
    operate = "modify";
    $('#manageModalLabel').html("修改机构");
    clearAllErrInfo();

    $('#divFatherOrgan').hide();

    $('#inputHiddenOrganId').val(id);
    $('#inputOrganCode').val(tds.eq(0).text());
    $('#inputOrganName').val(tds.eq(1).text());
    $('#inputOrganDescription').val(tds.eq(3).text());

    $('#manageOrganModal').modal({backdrop: 'static', keyboard: false});
}

//删除弹出框
function deleteOrgan(obj, id, pageNumber) {

    var tds=$(obj).parent().parent().find('td');

    $('#inputHiddenOrganId').val(id);
    $('#deleteOrganModal').modal({backdrop: 'static', keyboard: false});
}

/* 12位 数字 */
function inputCheckOrganCodeNum(string) {
    var regex = /^[a-zA-Z0-9]{12}$/
    return regex.test(string);
}
/*前6位为数字，后6位为数字或字母,字母不能使用I和O*/
function inputCheckOrganCode(string) {
    var regex = /^[0-9]{6}[0-9a-hj-np-zA-HJ-NP-Z]{6}$/
    return regex.test(string);
}