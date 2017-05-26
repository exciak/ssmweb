/**
 * Created by pcd on 2016/1/5.
 */
var preventDefaultFlag = false;
var operate = "";
var bHideFlag = true;

$(document).ready(function () {
    var treeData = [];
    var rootNode = {};
    var selectNode = {};

    //清除按钮事件绑定
    $('#btn_clear').click(function(){
        $('#inputFilterIndustryCode').val("");
        $('#inputFilterIndustryName').val("");
    });

    //点击文本框显示选择树
    $('#inputFatherIndustry').click(function(){
        bHideFlag = false;
        if($("#industrySelectDiv").is(":hidden")){
            $("#industrySelectDiv").show();
        }else{
            $("#industrySelectDiv").hide();
        };
    });

    /*    部门选择树*/
    getTreeDataInit();

    function getTreeDataInit() {
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
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });

        treeData[0] = rootNode;
    };

    function createTreeView(treeData) {
        var treeView = $('#industrySelectTreeView').treeview({
            data: treeData,
            expandIcon: 'glyphicon glyphicon-plus',
            collapseIcon: 'glyphicon glyphicon-minus',
            onNodeSelected: function (event, node) {
                selectNode = node;
                bHideFlag = false;

                //点击文本框显示选择树
                $('#inputFatherIndustry').val(selectNode.text);
                $("#inputFatherIndustry").removeClass("border-red");
                $(".error3").hide();

                //先隐藏选择树
                $('#industrySelectDiv').hide();
            },
            onNodeCollapsed: function(event, node) {
                bHideFlag = false;
            },
            onNodeExpanded: function (event, node) {
                bHideFlag = false;
            }
        });

        return treeView;
    }

    var $industryTreeView = createTreeView(treeData);

    var searchIndustryTreeView = function (e) {
        var string = $('#inputFatherIndustry').val();
        var pattern = toEscStr(string);
        var options = {
            revealResults: true
        };
        var results = $industryTreeView.treeview('search', [pattern, options]);
    }

    $('#inputFatherIndustry').on('keyup', searchIndustryTreeView);

    function getNodeInIndustryTree(textName){
        var pattern = toEscStr(textName);
        var options = {
            exactMatch: true,
            revealResults: true
        };

        var results = $industryTreeView.treeview('search', [pattern, options]);

        if(results.length != 0){
            return results[0];
        }else{
            return null;
        }
    };

    var industryCreate = function () {
        var createNode = {};
        var result = false;

        createNode.code = $('#inputIndustryCode').val();

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
                    location.href = "industryTable";
                    result = true;
                } else {
                    if(data.existItem != undefined){
                        dmallError("新增行业编码与主题"+ data.existItem.name + "编码重复");
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

    var industryModify = function () {

        var result = false;

        //去服务端修改节点
        $.ajax({
            url:"../industry/edit",
            type:"POST",
            async: false,
            data:{
                id: $('#inputHiddenIndustryId').val(),
                code: $('#inputIndustryCode').val(),
                name:$('#inputIndustryName').val(),
                description: $('#inputIndustryDescription').val()
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    location.href = "industryTable";
                    result = true;
                } else {
                    if (data.existItem != undefined) {
                        dmallError("行业编码与主题" + data.existItem.name + "编码重复");
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

    var industryDelete = function () {

        //去服务端删除节点
        $.ajax({
            url:"../industry/delete",
            type:"POST",
            data:{
                id: $('#inputHiddenIndustryId').val()
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    location.href = "industryTable";
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

    /*名称获取焦距*/
    $("#inputFatherIndustry").focus(function () {
        var string = $("#inputFatherIndustry").val();
        var nodeTmp = getNodeInIndustryTree(string);
        if(null != nodeTmp)
        {
            selectNode = nodeTmp;
            $("#inputFatherIndustry").removeClass("border-red");
            $(".error3").hide();
        }
    });

    /*名称失去焦距*/
    function checkFatherIndustry(){
        var string = $("#inputFatherIndustry").val();
        var nodeTmp = getNodeInIndustryTree(string);
        if(null != nodeTmp)
        {
            selectNode = nodeTmp;
        }else{
            $("#inputFatherIndustry").addClass("border-red");
            $(".error3").html("*请选择正确的父节点");
            $(".error3").css("display", "block");
            preventDefaultFlag = true;
        }
    };

    $("body").click(function(){
        var string = $("#inputFatherIndustry").val();
        if( bHideFlag == true){
            $("#industrySelectDiv").hide();
            if(string != ""){
                checkFatherIndustry();
            }
        }
        bHideFlag = true;
    });

    function checkall(operate){
        checkIndustryCode();
        checkIndustryName();

        if(operate == "create"){
            checkFatherIndustry();
        }
    }

    /* 点击提交按钮 */
    $('#btnSubmit').click(function(){
        preventDefaultFlag = false;
        checkall(operate);
        if (preventDefaultFlag == true) {
            return false;
        }

        if(operate == "create"){
            return industryCreate();
        }else if(operate == "modify"){
            return industryModify();
        }
    });

    $('#btnDelSubmit').click(function(){
        industryDelete();
    });

});

function clearAllErrInfo(){
    $("#inputIndustryCode").removeClass("border-red");
    $(".error1").hide()
    $("#inputIndustryName").removeClass("border-red");
    $(".error2").hide()
};

//创建弹出框
function createIndustry() {

    operate = "create";
    $('#manageModalLabel').html("创建行业类目");
    clearAllErrInfo();

    $('#inputIndustryCode').val("");
    $('#inputIndustryName').val("");
    $('#inputIndustryDescription').val("");
    $('#inputFatherIndustry').val("");

    $('#divFatherIndustry').show();

    $('#manageIndustryModal').modal({backdrop: 'static', keyboard: false});
}

//创建弹出框
function modifyIndustry(obj, id, pageNumber) {

    var tds=$(obj).parent().parent().find('td');

    operate = "modify";
    $('#manageModalLabel').html("修改行业类目");
    clearAllErrInfo();

    $('#divFatherIndustry').hide();

    $('#inputHiddenIndustryId').val(id);
    $('#inputIndustryCode').val(tds.eq(0).text());
    $('#inputIndustryName').val(tds.eq(1).text());
    $('#inputIndustryDescription').val(tds.eq(2).text());

    $('#manageIndustryModal').modal({backdrop: 'static', keyboard: false});
}

//删除弹出框
function deleteIndustry(obj, id, pageNumber) {

    var tds=$(obj).parent().parent().find('td');

    $('#inputHiddenIndustryId').val(id);
    $('#deleteIndustryModal').modal({backdrop: 'static', keyboard: false});
}



