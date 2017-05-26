/**
 * Created by pcd on 2016/1/5.
 */
var preventDefaultFlag = false;

$(document).ready(function () {

    var subjectTreeData = [];
    var rootNode = {};
    var parentNode = {};
    var curOperate = "";
    var treeExpandOpt = "expand";

    //关闭主题管理树窗口
    $('#btnCloseModal').click(function(){
        location.href = "subjectTree";
    });

    //清除按钮事件绑定
    $('#btn_clear').click(function(){
        $('#inputFilterSubjectCode').val("");
        $('#inputFilterSubjectName').val("");
    });

    $('#inputSubjectName').readOnly = true;

    getSubjectTreeDataInit();

    function getSubjectTreeDataInit() {
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
            url: "../subject/tree",
            async: false,
            success: function (data) {

                if(data.result == "success"){
                    rootNode.nodes = [];
                    for(var i=0; i< data.subject_list.length; i++){
                        rootNode.nodes[i] = data.subject_list[i] ;
                    }
                }else{
                    rootNode.nodes = null;
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });

        subjectTreeData[0] = rootNode;
    };

    var $subjectTreeView = createSubjectTreeView(subjectTreeData);
    var selectNode = {};

    function initFormInfo(selectNode){
        //无效节点不处理，并隐藏信息框
        if(selectNode.code == '00000'){
            $('#divSubjectInfo').hide();
        }else{
            $('#inputSubjectName').val(selectNode.text);
            $('#inputSubjectName').attr("readOnly",true);
            $('#inputSubjectCode').val(selectNode.code);
            $('#inputSubjectCode').attr("readOnly",true);
            $('#inputSubjectDescription').val(selectNode.description);
            $('#inputSubjectDescription').attr("readOnly",true);

            $('#divFatherName').hide();
            $('#btnSubmit').hide();
            $('#btnCancel').hide();

            //移除错误信息提示框
            clearAllErrInfo();

            //将主题信息div显示
            $('#divSubjectInfo').show();
        }
    };

    function createSubjectTreeView(treeData) {
        var subjectTreeView = $('#subjectTreeView').treeview({
            data: treeData,
            levels:2,
            expandIcon: 'glyphicon glyphicon-plus',
            collapseIcon: 'glyphicon glyphicon-minus',
            onNodeSelected: function (event, node) {
                selectNode = node;

                initFormInfo(selectNode);
            },
            onNodeUnselected: function (event, node) {
                selectNode = {};
                $('#divSubjectInfo').hide();
            }
        });

        return subjectTreeView;
    }

    function refreshSubjectTreeView(ocusNode){
        //从后端获取树结构并初始化
        getSubjectTreeDataInit();

        //重新创建数
        $subjectTreeView = createSubjectTreeView(subjectTreeData);

        //展开节点
        //expandNodes(ocusNode)

        //定位当前操作节点
        searchAndSelectNode(ocusNode);

    }

    function expandNodes(expandNode){
        var nodeTmp = {};
        var expandNodes = [];

        nodeTmp = expandNode;
        while(nodeTmp.nodeId != undefined){
            expandNodes.unshift(nodeTmp);
            nodeTmp = $subjectTreeView.treeview('getParent', nodeTmp.nodeId);
        }

        $subjectTreeView.treeview('expandNode', [ expandNodes, { levels: '1', silent: false, ignoreChildren: false}]);
    }

    /*    行业类目的搜索*/
    var searchSubjectTreeView = function (e) {
        var pattern = $('#inputSearchSubject').val();
        var options = {
            revealResults: true
        };
        var results = $subjectTreeView.treeview('search', [pattern, options]);

    }

    $('#inputSearchSubject').on('keyup', searchSubjectTreeView);

    /* 搜索节点并高亮*/
    var searchAndSelectNode = function (node) {
        var pattern = node.text;
        var options = {
            revealResults: true
        };
        return $subjectTreeView.treeview('search', [pattern, options]);
    }

    $('#btnToggleExpand').on('click', function (e) {
        if(treeExpandOpt == "expand"){
            $subjectTreeView.treeview('expandAll');
            treeExpandOpt = "collapse";
            $("#toggleImage").attr("src","../view/img/collapse-all.png");
            $("#btnToggleExpand").attr("title","收起树");
        }else{
            $subjectTreeView.treeview('collapseAll');
            treeExpandOpt = "expand";
            $("#toggleImage").attr("src","../view/img/expand-all.png");
            $("#btnToggleExpand").attr("title","展开树");
        }
    });

    /*    修改行业*/
    var subjectModify = function () {

        var updateNode = {};
        var result = false;

        updateNode.id = selectNode.id;
        updateNode.code = $('#inputSubjectCode').val();
        updateNode.text = $('#inputSubjectName').val();
        updateNode.description = $('#inputSubjectDescription').val();

        //去服务端修改节点
        $.ajax({
            url:"../subject/edit",
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
                    refreshSubjectTreeView(selectNode);
                    result = true;
                } else {
                    if (data.existItem != undefined) {
                        dmallError("主题编码与主题" + data.existItem.name + "编码重复");
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

    /*    新增主题类目*/
    var subjectCreate = function () {
        var createNode = {};
        var result = false;

        createNode.code = $('#inputSubjectCode').val();

        //编码为空给出提示
        if("" == createNode.code){
            dmallError("请填写主题编码");
            return result;
        }

        //编码与父节点相同给出提示
        if(selectNode.code == createNode.code){
            dmallError("新增主题编码不能与父主题编码重复");
            return result;
        }

        createNode.text = $('#inputSubjectName').val();
        createNode.description = $('#inputSubjectDescription').val();
        createNode.parentId = selectNode.id;
        createNode.level = selectNode.level+1;

        //去服务端新增行业
        $.ajax({
            url:"../subject/create",
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
                    refreshSubjectTreeView(createNode);
                    result = true;
                } else {
                    if(data.existItem != undefined){
                        dmallError("新增主题编码与主题"+ data.existItem.name + "编码重复");
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
    $('#btnSubjectAddSon').click(function(){

        //若还未选择节点则给出提示
        if(undefined == selectNode.code){
            dmallError("请先选择所要操作的节点");
            return false;
        }

        curOperate = "create";

        $('#labelFatherName').html(selectNode.text);
        $('#divFatherName').show();
        //清空表单，并可写
        $('#inputSubjectName').val("");
        $('#inputSubjectName').attr("readOnly",false);
        $('#inputSubjectCode').val("");
        $('#inputSubjectCode').attr("readOnly",false);
        $('#inputSubjectDescription').val("");
        $('#inputSubjectDescription').attr("readOnly",false)

        //显示提交按钮
        $('#divSubjectInfo').show();
        $('#btnSubmit').show();
        $('#btnCancel').show();

    });

    /* 点击修改按钮 */
    $('#btnSubjectModify').click(function(){
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

        $('#inputSubjectName').attr("readOnly",false);
        $('#inputSubjectCode').attr("readOnly",false);
        $('#inputSubjectDescription').attr("readOnly",false);

        //显示提交按钮
        $('#btnSubmit').show();
        $('#btnCancel').show();
    });

    //删除弹出框
    $('#btnSubjectDelete').click(function () {

        if (undefined == selectNode.code) {
            dmallError("请先选择所要操作的节点");
            return false;
        }

        //无效节点不能修改
        if (selectNode.code == '00000') {
            dmallError("不能删除根节点");
            return false;
        }

        $('#deleteSubjectModal').modal({backdrop: 'static', keyboard: false});
    });

    /*编码获取焦距*/
    $("#inputSubjectCode").focus(function () {
        var string = $("#inputSubjectCode").val();
        var ret = inputCheckCode(string);
        if(!ret)
        {
            $("#inputSubjectCode").removeClass("border-red");
            $(".error1").hide();
        }
    });

    /*编码失去焦距*/
    function checkSubjectCode(){
        var string = $("#inputSubjectCode").val();
        var ret = inputCheckCode(string);
        if(!ret)
        {
            $("#inputSubjectCode").addClass("border-red");
            $(".error1").html("*请输入编码,由字母、数字组成，1-16个字符");
            $(".error1").css("display", "block");
            preventDefaultFlag = true;
        }
    };
    $("#inputSubjectCode").blur(function(){
        checkSubjectCode();
    });

    /*名称获取焦距*/
    $("#inputSubjectName").focus(function () {
        var string = $("#inputSubjectName").val();
        var ret = inputCheckNameLax2(string);
        if(!ret)
        {
            $("#inputSubjectName").removeClass("border-red");
            $(".error2").hide();
        }
    });

    /*名称失去焦距*/
    function checkSubjectName(){
        var string = $("#inputSubjectName").val();
        var ret = inputCheckNameLax2(string);
        if(!ret)
        {
            $("#inputSubjectName").addClass("border-red");
            $(".error2").html("*请输入名称,由中文、字母、数字、下划线、标点符号组成，1-64个字符");
            $(".error2").css("display", "block");
            preventDefaultFlag = true;
        }
    };
    $("#inputSubjectName").blur(function(){
        checkSubjectName();
    });

    function checkall(){
        checkSubjectCode();
        checkSubjectName();
    }

    function clearAllErrInfo(){
        $("#inputSubjectCode").removeClass("border-red");
        $(".error1").hide()
        $("#inputSubjectName").removeClass("border-red");
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
            result = subjectCreate();
        };

        if(curOperate == "modify"){
            result = subjectModify();
        };

        if(true == result){
            $('#inputSubjectName').val("");
            $('#inputSubjectCode').val("");
            $('#inputSubjectDescription').val("");

            //隐藏提交取消按钮
            $('#btnSubmit').hide();
            $('#btnCancel').hide();
            $('#divSubjectInfo').hide();
        }

        return result;
    });

    /* 点击取消按钮 */
    $('#btnCancel').click(function(){
        initFormInfo(selectNode);
    });


    /*    删除行业*/
    var subjectDelete = function () {
        var deleteNode = {};

        //无效节点不能修改
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
            url:"../subject/delete",
            type:"POST",
            data:{
                id: deleteNode.id
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    parentNode = $subjectTreeView.treeview('getParent', deleteNode.nodeId);
                    refreshSubjectTreeView(parentNode);
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
        $('#divSubjectInfo').hide();

        subjectDelete();
    });

});





