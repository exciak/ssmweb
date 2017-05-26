/**
 * Created by pcd on 2016/1/5.
 */
var preventDefaultFlag = false;

$(document).ready(function () {
    var areaTreeData = [];
    var rootNode = {};
    var parentNode = {};
    var curOperate = "";
    var treeExpandOpt = "expand";

    //关闭管理树窗口
    $('#btnCloseModal').click(function(){
        location.href = "area";
    });

    //清除按钮事件绑定
    $('#btn_clear').click(function(){
        $('#inputFilterAreaCode').val("");
        $('#inputFilterAreaName').val("");
    });

    getAreaTreeDataInit();

    function getAreaTreeDataInit() {
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
            url: "../area/tree",
            async: false,
            success: function (data) {
                if(data.result == "success"){
                    rootNode.nodes = [];
                    for(var i=0; i< data.area_list.length; i++){
                        rootNode.nodes[i] = data.area_list[i] ;
                    }
                }else{
                    rootNode.nodes = null;
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });

        areaTreeData[0] = rootNode;
    };

    var $areaTreeView = createAreaTreeView(areaTreeData);
    var selectNode = {};

    function initFormInfo(selectNode){
        //无效节点不处理，并隐藏信息框
        if(selectNode.code == '00000'){
            $('#divAreaInfo').hide();
        }else{
            $('#inputAreaCode').val(selectNode.code);
            $('#inputAreaName').val(selectNode.text);
            $('#inputAreaDescription').val(selectNode.description);
            $('#inputAreaCode').attr("readOnly",true);
            $('#inputAreaName').attr("readOnly",true);
            $('#inputAreaDescription').attr("readOnly",true);

            $('#divFatherName').hide();
            $('#btnSubmit').hide();
            $('#btnCancel').hide();

            //移除错误信息提示框
            clearAllErrInfo();

            //将信息div显示
            $('#divAreaInfo').show();
        }
    };

    function createAreaTreeView(treeData) {
        var areaTreeView = $('#areaTreeView').treeview({
            data: treeData,
            expandIcon: 'glyphicon glyphicon-plus',
            collapseIcon: 'glyphicon glyphicon-minus',
            onNodeSelected: function (event, node) {
                selectNode = node;

                initFormInfo(selectNode);
            },
            onNodeUnselected: function (event, node) {
                selectNode = {};
                $('#divAreaInfo').hide();
            }
        });

        return areaTreeView;
    }

    function refreshAreaTreeView(ocusNode){
        //从后端获取树结构并初始化
        getAreaTreeDataInit();

        //重新创建数
        createAreaTreeView(areaTreeData);

        //定位当前操作节点
        searchAndSelectNode(ocusNode);

    }

    /*    类目的搜索*/
    var searchAreaTreeView = function (e) {
        var string = $('#inputSearchArea').val();
        var pattern = toEscStr(string);
        var options = {
            revealResults: true
        };
        var results = $areaTreeView.treeview('search', [pattern, options]);

    }

    $('#inputSearchArea').on('keyup', searchAreaTreeView);

    /* 搜索节点并高亮*/
    var searchAndSelectNode = function (node) {
        var pattern = toEscStr(node.text);
        var options = {
            revealResults: true
        };
        var results = $areaTreeView.treeview('search', [pattern, options]);
    }

    $('#btnToggleExpand').on('click', function (e) {
        if(treeExpandOpt == "expand"){
            $areaTreeView.treeview('expandAll');
            treeExpandOpt = "collapse";
            $("#toggleImage").attr("src","../view/img/collapse-all.png");
            $("#btnToggleExpand").attr("title","收起树");
        }else{
            $areaTreeView.treeview('collapseAll');
            treeExpandOpt = "expand";
            $("#toggleImage").attr("src","../view/img/expand-all.png");
            $("#btnToggleExpand").attr("title","展开树");
        }
    });

    /*    修改*/
    var areaModify = function () {
        var updateNode = {};
        var result = false;

        updateNode.id = selectNode.id;
        updateNode.code = $('#inputAreaCode').val();
        updateNode.text = $('#inputAreaName').val();
        updateNode.description = $('#inputAreaDescription').val();

        //去服务端修改节点
        $.ajax({
            url:"../area/edit",
            type:"POST",
            async: false,
            data:{
                id: updateNode.id,
                code: updateNode.code,
                name:updateNode.text,
                description: updateNode.description
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    refreshAreaTreeView(updateNode);
                    result = true;
                } else {
                    if (data.existItem != undefined) {
                        dmallError("区域编码与区域" + data.existItem.name + "编码重复");
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

    /*    新增*/
    var areaCreate = function () {
        var createNode = {};
        var result = false;

        createNode.code = $('#inputAreaCode').val();

        //编码为空给出提示
        if("" == createNode.code){
            dmallError("请填写区域编码");
            return result;
        }

        //编码与父节点相同给出提示
        if(selectNode.code == createNode.code){
            dmallError("新增区域编码不能与父区域编码重复");
            return result;
        }

        createNode.text = $('#inputAreaName').val();
        createNode.description = $('#inputAreaDescription').val();
        createNode.parentId = selectNode.id;
        createNode.level = selectNode.level+1;

        //去服务端新增
        $.ajax({
            url:"../area/create",
            type:"POST",
            async: false,
            data:{
                code: createNode.code,
                name:createNode.text,
                parentId: createNode.parentId,
                description: createNode.description,
                level:createNode.level
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    refreshAreaTreeView(createNode);
                    result = true;
                } else {
                    if(data.existItem != undefined){
                        dmallError("新增区域编码与区域"+ data.existItem.name + "编码重复");
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
    $('#btnAreaAddSon').click(function(){

        //若还未选择节点则给出提示
        if(undefined == selectNode.code){
            dmallError("请先选择所要操作的节点");
            return false;
        }

        curOperate = "create";

        $('#labelFatherName').html(selectNode.text);
        $('#divFatherName').show();

        //清空表单，并可写
        $('#inputAreaName').val("");
        $('#inputAreaName').attr("readOnly",false);
        $('#inputAreaCode').val("");
        $('#inputAreaCode').attr("readOnly",false);
        $('#inputAreaDescription').val("");
        $('#inputAreaDescription').attr("readOnly",false)

        //显示提交按钮
        $('#divAreaInfo').show();
        $('#btnSubmit').show();
        $('#btnCancel').show();

    });

    /* 点击修改按钮 */
    $('#btnAreaModify').click(function(){
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

        //清空表单，并可写
        $('#inputAreaName').attr("readOnly",false);
        $('#inputAreaCode').attr("readOnly",false);
        $('#inputAreaDescription').attr("readOnly",false)

        //显示提交按钮
        $('#divAreaInfo').show();
        $('#btnSubmit').show();
        $('#btnCancel').show();
    });

    //删除弹出框
    $('#btnAreaDelete').click(function () {

        if (undefined == selectNode.code) {
            dmallError("请先选择所要操作的节点");
            return false;
        }

        //无效节点不能修改
        if (selectNode.code == '00000') {
            dmallError("不能删除根节点");
            return false;
        }

        $('#deleteAreaModal').modal({backdrop: 'static', keyboard: false});
    });

    /*编码获取焦距*/
    $("#inputAreaCode").focus(function () {
        var string = $("#inputAreaCode").val();
        var ret = inputCheckCode(string);
        if(!ret)
        {
            $("#inputAreaCode").removeClass("border-red");
            $(".error1").hide();
        }
    });

    /*编码失去焦距*/
    function checkAreaCode(){
        var string = $("#inputAreaCode").val();
        var ret = inputCheckCode(string);
        if(!ret)
        {
            $("#inputAreaCode").addClass("border-red");
            $(".error1").html("*请输入编码,由字母、数字组成，1-16个字符");
            $(".error1").css("display", "block");
            preventDefaultFlag = true;
        }
    };
    $("#inputAreaCode").blur(function(){
        checkAreaCode();
    });

    /*名称获取焦距*/
    $("#inputAreaName").focus(function () {
        var string = $("#inputAreaName").val();
        var ret = inputCheckNameLax2(string);
        if(!ret)
        {
            $("#inputAreaName").removeClass("border-red");
            $(".error2").hide();
        }
    });

    /*名称失去焦距*/
    function checkAreaName(){
        var string = $("#inputAreaName").val();
        var ret = inputCheckNameLax2(string);
        if(!ret)
        {
            $("#inputAreaName").addClass("border-red");
            $(".error2").html("*请输入名称,由中文、字母、数字、下划线、标点符号组成，1-64个字符");
            $(".error2").css("display", "block");
            preventDefaultFlag = true;
        }
    };
    $("#inputAreaName").blur(function(){
        checkAreaName();
    });

    function checkall(){
        checkAreaCode();
        checkAreaName();
    }

    function clearAllErrInfo(){
        $("#inputAreaCode").removeClass("border-red");
        $(".error1").hide()
        $("#inputAreaName").removeClass("border-red");
        $(".error2").hide()
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
            result = areaCreate();
        };

        if(curOperate == "modify"){
            result = areaModify();
        };

        if(true == result){
            $('#inputAreaName').val("");
            $('#inputAreaCode').val("");
            $('#inputAreaDescription').val("");

            //隐藏提交取消按钮
            $('#btnSubmit').hide();
            $('#btnCancel').hide();
            $('#divAreaInfo').hide();
        }

        return result;
    });

    /* 点击取消按钮 */
    $('#btnCancel').click(function(){
        initFormInfo(selectNode);
    });

    /*    删除*/
    var areaDelete = function () {
        var deleteNode = {};

        //无效节点不能删除
        if(selectNode.code == '00000'){
            return;
        }

        //若还未选择节点则给出提示
        if(undefined == selectNode.code){
            dmallError("请先选择所要操作的节点");
        }

        deleteNode.id = selectNode.id;
        deleteNode.nodeId = selectNode.nodeId;
        //去服务端删除节点
        $.ajax({
            url:"../area/delete",
            type:"POST",
            async: false,
            data:{
                id: deleteNode.id
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    parentNode = $areaTreeView.treeview('getParent', deleteNode.nodeId);
                    refreshAreaTreeView(parentNode);
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
        $('#divAreaInfo').hide();
        areaDelete();
    });

});



