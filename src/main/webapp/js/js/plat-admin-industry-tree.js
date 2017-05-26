/**
 * Created by pcd on 2016/1/5.
 */
var preventDefaultFlag = false;

$(document).ready(function () {
    var industryTreeData = [];
    var rootNode = {};
    var parentNode = {};
    var curOperate = "";
    var treeExpandOpt = "expand";

    //关闭行业管理树窗口
    $('#btnCloseModal').click(function(){
        location.href = "industry";
    });

    //清除按钮事件绑定
    $('#btn_clear').click(function(){
        $('#inputFilterIndustryCode').val("");
        $('#inputFilterIndustryName').val("");
    });

    getIndustryTreeDataInit();

    function getIndustryTreeDataInit() {
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
            url: "../industry/tree",
            async: false,
            success: function (data) {
                if(data.result == "success"){
                    rootNode.nodes = [];
                    for(var i=0; i< data.industry_list.length; i++){
                        rootNode.nodes[i] = data.industry_list[i] ;
                    }
                }else{
                    rootNode.nodes = null;
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });

        industryTreeData[0] = rootNode;
    };

    var $industryTreeView = createIndustryTreeView(industryTreeData);
    var selectNode = {};

    function initFormInfo(selectNode){
        //无效节点不处理，并隐藏信息框
        if(selectNode.code == '00000'){
            $('#divIndustryInfo').hide();
        }else{
            $('#inputIndustryName').val(selectNode.text);
            $('#inputIndustryCode').val(selectNode.code);
            $('#inputIndustryDescription').val(selectNode.description);
            $('#inputIndustryName').attr("readOnly", true);
            $('#inputIndustryCode').attr("readOnly", true);
            $('#inputIndustryDescription').attr("readOnly", true);

            $('#btnSubmit').hide();
            $('#btnCancel').hide()

            $('#divFatherName').hide();

            //隐藏错误信息
            clearAllErrInfo();

            //将资源信息div隐藏
            $('#divIndustryInfo').show();
        }
    };

    function createIndustryTreeView(treeData) {
        var industryTreeView = $('#industryTreeView').treeview({
            data: treeData,
            expandIcon: 'glyphicon glyphicon-plus',
            collapseIcon: 'glyphicon glyphicon-minus',
            onNodeSelected: function (event, node) {
                selectNode = node;

                initFormInfo(selectNode);
            },
            onNodeUnselected: function (event, node) {
                selectNode = {};
                $('#divIndustryInfo').hide();
            }
        });

        return industryTreeView;
    }

    function refreshIndustryTreeView(ocusNode){
        //从后端获取树结构并初始化
        getIndustryTreeDataInit();

        //重新创建数
        createIndustryTreeView(industryTreeData);

        //定位当前操作节点
        searchAndSelectNode(ocusNode);
    }

    /*    行业类目的搜索*/
    var searchIndustryTreeView = function (e) {
        var string = $('#inputSearchIndustry').val();
        var pattern = toEscStr(string);
        var options = {
            revealResults: true
        };
        var results = $industryTreeView.treeview('search', [pattern, options]);

    }

    $('#inputSearchIndustry').on('keyup', searchIndustryTreeView);

    /* 搜索节点并高亮*/
    var searchAndSelectNode = function (node) {
        var pattern = toEscStr(node.text);
        var options = {
            revealResults: true
        };
        var results = $industryTreeView.treeview('search', [pattern, options]);
    }

    $('#btnToggleExpand').on('click', function (e) {
        if(treeExpandOpt == "expand"){
            $industryTreeView.treeview('expandAll');
            treeExpandOpt = "collapse";
            $("#toggleImage").attr("src","../view/img/collapse-all.png");
            $("#btnToggleExpand").attr("title","收起树");
        }else{
            $industryTreeView.treeview('collapseAll');
            treeExpandOpt = "expand";
            $("#toggleImage").attr("src","../view/img/expand-all.png");
            $("#btnToggleExpand").attr("title","展开树");
        }
    });

    /*    修改行业*/
    var industryModify = function () {

        var updateNode = {};
        var result = false;

        updateNode.id = selectNode.id;
        updateNode.code = $('#inputIndustryCode').val();
        updateNode.text = $('#inputIndustryName').val();
        updateNode.description = $('#inputIndustryDescription').val();

        //去服务端修改节点
        $.ajax({
            url:"../industry/edit",
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
                    refreshIndustryTreeView(updateNode);
                    result = true;
                } else {
                    if (data.existItem != undefined) {
                        dmallError("行业编码与行业" + data.existItem.name + "编码重复");
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

    /*    新增同级行业*/
    var industryCreate = function () {
        var createNode = {};
        var result = false;

        createNode.code = $('#inputIndustryCode').val();

        //编码为空给出提示
        if("" == createNode.code){
            dmallError("请填写行业编码");
            return result;
        }

        //编码与父节点相同给出提示
        if(selectNode.code == createNode.code){
            dmallError("新增行业编码不能与父行业编码重复");
            return result;
        }

        createNode.text = $('#inputIndustryName').val();
        createNode.description = $('#inputIndustryDescription').val();
        createNode.parentId = selectNode.id;
        createNode.level = selectNode.level+1;

        //去服务端新增行业
        $.ajax({
            url:"../industry/create",
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
                    refreshIndustryTreeView(createNode);
                    result = true;
                } else {
                    if(data.existItem != undefined){
                        dmallError("新增行业编码与行业"+ data.existItem.name + "编码重复");
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
    $('#btnIndustryAddSon').click(function(){

        //若还未选择节点则给出提示
        if(undefined == selectNode.code){
            dmallError("请先选择所要操作的节点");
            return false;
        }

        curOperate = "create";

        $('#labelFatherName').html(selectNode.text);
        $('#divFatherName').show();

        //清空表单，并可写
        $('#inputIndustryName').val("");
        $('#inputIndustryName').attr("readOnly",false);
        $('#inputIndustryCode').val("");
        $('#inputIndustryCode').attr("readOnly",false);
        $('#inputIndustryDescription').val("");
        $('#inputIndustryDescription').attr("readOnly",false)

        //显示提交按钮
        $('#divIndustryInfo').show();
        $('#btnSubmit').show();
        $('#btnCancel').show();

    });

    /* 点击修改按钮 */
    $('#btnIndustryModify').click(function(){
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
        $('#inputIndustryName').attr("readOnly",false);
        $('#inputIndustryCode').attr("readOnly",false);
        $('#inputIndustryDescription').attr("readOnly",false);

        //显示提交按钮
        $('#btnSubmit').show();
        $('#btnCancel').show();
    });

    //删除弹出框
    $('#btnIndustryDelete').click(function () {

        if (undefined == selectNode.code) {
            dmallError("请先选择所要操作的节点");
            return false;
        }

        //无效节点不能修改
        if (selectNode.code == '00000') {
            dmallError("不能删除根节点");
            return false;
        }

        $('#deleteIndustryModal').modal({backdrop: 'static', keyboard: false});
    });

    /*编码获取焦距*/
    $("#inputIndustryCode").focus(function () {
        var string = $("#inputIndustryCode").val();
        var ret = inputCheckCode(string);
        if(!ret)
        {
            $("#inputIndustryCode").removeClass("border-red");
            $(".error1").hide();
        }
    });

    /*编码失去焦距*/
    function checkIndustryCode(){
        var string = $("#inputIndustryCode").val();
        var ret = inputCheckCode(string);
        if(!ret)
        {
            $("#inputIndustryCode").addClass("border-red");
            $(".error1").html("*请输入编码,由字母、数字组成，1-16个字符");
            $(".error1").css("display", "block");
            preventDefaultFlag = true;
        }
    };
    $("#inputIndustryCode").blur(function(){
        checkIndustryCode();
    });

    /*名称获取焦距*/
    $("#inputIndustryName").focus(function () {
        var string = $("#inputIndustryName").val();
        var ret = inputCheckNameLax2(string);
        if(!ret)
        {
            $("#inputIndustryName").removeClass("border-red");
            $(".error2").hide();
        }
    });

    /*名称失去焦距*/
    function checkIndustryName(){
        var string = $("#inputIndustryName").val();
        var ret = inputCheckNameLax2(string);
        if(!ret)
        {
            $("#inputIndustryName").addClass("border-red");
            $(".error2").html("*请输入名称,由中文、字母、数字、下划线、标点符号组成，1-64个字符");
            $(".error2").css("display", "block");
            preventDefaultFlag = true;
        }
    };
    $("#inputIndustryName").blur(function(){
        checkIndustryName();
    });

    function checkall(){
        checkIndustryCode();
        checkIndustryName();
    }

    function clearAllErrInfo(){
        $("#inputIndustryCode").removeClass("border-red");
        $(".error1").hide()
        $("#inputIndustryName").removeClass("border-red");
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
            result = industryCreate();
        };

        if(curOperate == "modify"){
            result = industryModify();
        };

        if(true == result){
            $('#inputIndustryName').val("");
            $('#inputIndustryCode').val("");
            $('#inputIndustryDescription').val("");

            //隐藏提交取消按钮
            $('#btnSubmit').hide();
            $('#btnCancel').hide();
            $('#divIndustryInfo').hide();
        }

        return result;
    });

    /* 点击取消按钮 */
    $('#btnCancel').click(function(){
        initFormInfo(selectNode);
    });

    /*    删除行业*/
    var industryDelete = function () {
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
            url:"../industry/delete",
            type:"POST",
            data:{
                id: deleteNode.id
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    parentNode = $industryTreeView.treeview('getParent', deleteNode.nodeId);
                    refreshIndustryTreeView(parentNode);
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
        $('#divIndustryInfo').hide();

        industryDelete();
    });

});



