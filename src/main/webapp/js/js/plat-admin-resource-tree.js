/**
 * Created by pcd on 2016/1/5.
 */
var preventDefaultFlag = false;

$(document).ready(function () {
    var resourceTreeData = [];
    var rootNode = {};
    var parentNode = {};
    var curOperate = "";
    var treeExpandOpt = "expand";

    //关闭资源形态管理树窗口
    $('#btnCloseModal').click(function(){
        location.href = "resource";
    });

    //清除按钮事件绑定
    $('#btn_clear').click(function(){
        $('#inputFilterResourceCode').val("");
        $('#inputFilterResourceName').val("");
    });

    getResourceTreeDataInit();

    function getResourceTreeDataInit() {
        //初始化根节点
        rootNode.id = 0;
        rootNode.code = "00000";
        rootNode.text = "根节点";
        rootNode.description = "根节点";
        rootNode.level = 0;
        rootNode.parent_code = "00000";

        //去后端获取treedata
        $.ajax({
            type: 'GET',
            url: "../resourcedetail/tree",
            async: false,
            success: function (data) {
                if(data.result == "success"){
                    rootNode.nodes = [];
                    for(var i=0; i< data.resource_detail_list.length; i++){
                        rootNode.nodes[i] = data.resource_detail_list[i] ;
                    }
                }else{
                    rootNode.nodes = null;
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });

        resourceTreeData[0] = rootNode;
    };

    var $resourceTreeView = createResourceTreeView(resourceTreeData);
    var selectNode = {};

    function initFormInfo(selectNode){
        //无效节点不处理，并隐藏信息框
        if(selectNode.code == '00000'){
            $('#divResourceInfo').hide();
        }else{
            $('#inputResourceCode').val(selectNode.code);
            $('#inputResourceName').val(selectNode.text);
            $('#selectResourceType').val(selectNode.resourceTypeId);
            $('#inputResourceDescription').val(selectNode.description);
            $('#inputResourceCode').attr("readOnly", true);
            $('#inputResourceName').attr("readOnly", true);
            $('#selectResourceType').attr("disabled", true);
            $('#inputResourceDescription').attr("readOnly", true);

            $('#divFatherName').hide();
            $('#btnSubmit').hide();
            $('#btnCancel').hide();

            //移除错误信息提示框
            clearAllErrInfo();

            //将资源信息div显示
            $('#divResourceInfo').show();
        }
    };

    function createResourceTreeView(treeData) {
        var resourceTreeView = $('#resourceTreeView').treeview({
            data: treeData,
            expandIcon: 'glyphicon glyphicon-plus',
            collapseIcon: 'glyphicon glyphicon-minus',
            onNodeSelected: function (event, node) {
                selectNode = node;

                initFormInfo(selectNode);
            },
            onNodeUnselected: function (event, node) {
                selectNode = {};
                $('#divResourceInfo').hide();
            }
        });

        return resourceTreeView;
    }

    function refreshResourceTreeView(ocusNode){
        //从后端获取树结构并初始化
        getResourceTreeDataInit();

        //重新创建数
        createResourceTreeView(resourceTreeData);

        //定位当前操作节点
        searchAndSelectNode(ocusNode);

    }

    /*    资源形态类目的搜索*/
    var searchResourceTreeView = function (e) {
        var string = $('#inputSearchResource').val();
        var pattern = toEscStr(string);
        var options = {
            revealResults: true
        };
        var results = $resourceTreeView.treeview('search', [pattern, options]);

    }

    $('#inputSearchResource').on('keyup', searchResourceTreeView);

    /* 搜索节点并高亮*/
    var searchAndSelectNode = function (node) {
        var pattern = toEscStr(node.text);
        var options = {
            revealResults: true
        };
        var results = $resourceTreeView.treeview('search', [pattern, options]);
    }

    $('#btnToggleExpand').on('click', function (e) {
        if(treeExpandOpt == "expand"){
            $resourceTreeView.treeview('expandAll');
            treeExpandOpt = "collapse";
            $("#toggleImage").attr("src","../view/img/collapse-all.png");
            $("#btnToggleExpand").attr("title","收起树");
        }else{
            $resourceTreeView.treeview('collapseAll');
            treeExpandOpt = "expand";
            $("#toggleImage").attr("src","../view/img/expand-all.png");
            $("#btnToggleExpand").attr("title","展开树");
        }
    });

    /*    修改资源形态*/
    var resourceModify = function () {

        var updateNode = {};
        var result = false;

        updateNode.id = selectNode.id;
        updateNode.code = $('#inputResourceCode').val();
        updateNode.text = $('#inputResourceName').val();
        updateNode.resourceTypeId = $('#selectResourceType').val();
        updateNode.description = $('#inputResourceDescription').val();

        //去服务端修改节点
        $.ajax({
            url:"../resourcedetail/edit",
            type:"POST",
            async: false,
            data:{
                id: updateNode.id,
                code: updateNode.code,
                resourceTypeId:updateNode.resourceTypeId,
                name:updateNode.text,
                description: updateNode.description
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    refreshResourceTreeView(updateNode);
                    result = true;
                } else {
                    if (data.existItem != undefined) {
                        dmallError("资源形态编码与资源形态" + data.existItem.name + "编码重复");
                    } else {
                        dmallError(data.result);
                    }
                    result = false;
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });

        return result;
    }

    /*    新增资源形态*/
    var resourceCreate = function () {
        var createNode = {};
        var result = false;

        createNode.code = $('#inputResourceCode').val();

        //编码为空给出提示
        if("" == createNode.code){
            dmallError("请填写资源形态编码");
            return result;
        }

        //编码与父节点相同给出提示
        if(selectNode.code == createNode.code){
            dmallError("新增资源形态编码不能与父资源形态编码重复");
            return result;
        }

        createNode.text = $('#inputResourceName').val();
        createNode.description = $('#inputResourceDescription').val();
        createNode.resourceTypeId = $('#selectResourceType').val();
        createNode.parentId = selectNode.id;
        createNode.level = selectNode.level+1;

        //去服务端新增资源形态
        $.ajax({
            url:"../resourcedetail/create",
            type:"POST",
            async: false,
            data:{
                code: createNode.code,
                name:createNode.text,
                resourceTypeId:createNode.resourceTypeId,
                parentId: createNode.parentId,
                description: createNode.description,
                level:createNode.level
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    refreshResourceTreeView(createNode);
                    result = true;
                } else {
                    if(data.existItem != undefined){
                        dmallError("新增资源形态编码与资源形态"+ data.existItem.name + "编码重复");
                    }else{
                        dmallError(data.result);
                    }
                    result = false;
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });

        return result;
    }

    /* 点击新增按钮 */
    $('#btnResourceAddSon').click(function(){

        //若还未选择节点则给出提示
        if(undefined == selectNode.code){
            dmallError("请先选择所要操作的节点");
            return false;
        }

        curOperate = "create";

        $('#labelFatherName').html(selectNode.text);
        $('#divFatherName').show();
        //清空表单，并可写
        $('#inputResourceName').val("");
        $('#inputResourceName').attr("readOnly",false);
        $('#inputResourceCode').val("");
        $('#inputResourceCode').attr("readOnly",false);
        $('#inputResourceDescription').val("");
        $('#inputResourceDescription').attr("readOnly",false);
        $('#selectResourceType').val("");
        $('#selectResourceType').attr("disabled", false);

        //显示提交按钮
        $('#divResourceInfo').show();
        $('#btnSubmit').show();
        $('#btnCancel').show();

    });

    /* 点击修改按钮 */
    $('#btnResourceModify').click(function(){
        //无效节点不能修改
        if(selectNode.code == '00000'){
            dmallError("不能修改根节点");
            return;
        }

        //若还未选择节点则给出提示
        if(undefined == selectNode.code){
            dmallError("请先选择所要操作的节点");
            return;
        }

        curOperate = "modify";

        initFormInfo(selectNode);

        //置可写
        $('#inputResourceName').attr("readOnly",false);
        $('#inputResourceCode').attr("readOnly",false);
        $('#inputResourceDescription').attr("readOnly",false);
        $('#selectResourceType').attr("disabled", false);

        //显示提交按钮
        $('#btnSubmit').show();
        $('#btnCancel').show();
    });

    //删除弹出框
    $('#btnResourceDelete').click(function () {

        if (undefined == selectNode.code) {
            dmallError("请先选择所要操作的节点");
            return false;
        }

        //无效节点不能修改
        if (selectNode.code == '00000') {
            dmallError("不能删除根节点");
            return false;
        }

        $('#deleteResourceModal').modal({backdrop: 'static', keyboard: false});
    });

    /*编码获取焦距*/
    $("#inputResourceCode").focus(function () {
        var string = $("#inputResourceCode").val();
        var ret = inputCheckCode(string);
        if(!ret)
        {
            $("#inputResourceCode").removeClass("border-red");
            $(".error1").hide();
        }
    });

    /*编码失去焦距*/
    function checkResourceCode(){
        var string = $("#inputResourceCode").val();
        var ret = inputCheckCode(string);
        if(!ret)
        {
            $("#inputResourceCode").addClass("border-red");
            $(".error1").html("*请输入编码,由字母、数字组成，1-16个字符");
            $(".error1").css("display", "block");
            preventDefaultFlag = true;
        }
    };
    $("#inputResourceCode").blur(function(){
        checkResourceCode();
    });

    /*名称获取焦距*/
    $("#inputResourceName").focus(function () {
        var string = $("#inputResourceName").val();
        var ret = inputCheckNameLax2(string);
        if(!ret)
        {
            $("#inputResourceName").removeClass("border-red");
            $(".error2").hide();
        }
    });

    /*名称失去焦距*/
    function checkResourceName(){
        var string = $("#inputResourceName").val();
        var ret = inputCheckNameLax2(string);
        if(!ret)
        {
            $("#inputResourceName").addClass("border-red");
            $(".error2").html("*请输入名称,由中文、字母、数字、下划线、标点符号组成，1-64个字符");
            $(".error2").css("display", "block");
            preventDefaultFlag = true;
        }
    };
    $("#inputResourceName").blur(function(){
        checkResourceName();
    });

    function checkall(){
        checkResourceCode();
        checkResourceName();
    }

    function clearAllErrInfo(){
        $("#inputResourceCode").removeClass("border-red");
        $(".error1").hide();
        $("#inputResourceName").removeClass("border-red");
        $(".error2").hide();
    };

    /* 点击提交按钮 */
    $('#btnSubmit').click(function(){
        var result = false;

        preventDefaultFlag = false;
        checkall();
        if (preventDefaultFlag == true) {
            return false;
        }

        if(curOperate == "create"){
            result = resourceCreate();
        };

        if(curOperate == "modify"){
            result = resourceModify();
        };

        if(true == result){
            $('#inputResourceName').val("");
            $('#inputResourceCode').val("");
            $('#inputResourceDescription').val("");

            //隐藏提交取消按钮
            $('#btnSubmit').hide();
            $('#btnCancel').hide();
            $('#divResourceInfo').hide();
        }

        return result;
    });

    /* 点击取消按钮 */
    $('#btnCancel').click(function(){
        initFormInfo(selectNode);;
    });

    /*    删除资源形态*/
    var resourceDelete = function () {
        var deleteNode = {};

        //无效节点不能删除
        if(selectNode.code == '00000'){
            dmallError("不能删除根节点");
            return;
        }

        //若还未选择节点则给出提示
        if(undefined == selectNode.code){
            dmallError("请先选择所要操作的节点");
            return;
        }

        deleteNode.id = selectNode.id;
        deleteNode.nodeId = selectNode.nodeId;
        //去服务端删除节点
        $.ajax({
            url:"../resourcedetail/delete",
            type:"POST",
            data:{
                id: deleteNode.id
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    parentNode = $resourceTreeView.treeview('getParent', deleteNode.nodeId);
                    refreshResourceTreeView(parentNode);
                } else {
                    dmallError(data.result);
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });
    }

    $('#btnDelSubmit').click(function(){
        //隐藏提交取消按钮
        $('#btnSubmit').hide();
        $('#btnCancel').hide();
        $('#divResourceInfo').hide();

        resourceDelete();
    });

});



