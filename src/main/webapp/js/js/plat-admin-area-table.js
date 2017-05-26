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
        $('#inputFilterAreaCode').val("");
        $('#inputFilterAreaName').val("");
    });

    //点击文本框显示选择树
    $('#inputFatherArea').click(function(){
        bHideFlag = false;
        if($("#areaSelectDiv").is(":hidden")){
            $("#areaSelectDiv").show();
        }else{
            $("#areaSelectDiv").hide();
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
            url: "../area/tree",
            async: false,
            success: function (data) {
                if(data.result == "success"){
                    rootNode.nodes = [];
                    for(var i=0; i< data.area_list.length; i++){
                        rootNode.nodes[i] = data.area_list[i] ;
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
        var treeView = $('#areaSelectTreeView').treeview({
            data: treeData,
            expandIcon: 'glyphicon glyphicon-plus',
            collapseIcon: 'glyphicon glyphicon-minus',
            onNodeSelected: function (event, node) {
                selectNode = node;
                bHideFlag = false;

                //点击文本框显示选择树
                $('#inputFatherArea').val(selectNode.text);
                $("#inputFatherArea").removeClass("border-red");
                $(".error3").hide();


                //先隐藏选择树
                $('#areaSelectDiv').hide();
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

    var $areaTreeView = createTreeView(treeData);

    var searchAreaTreeView = function (e) {
        var string = $('#inputFatherArea').val();
        var pattern = toEscStr(string);
        var options = {
            revealResults: true
        };
        var results = $areaTreeView.treeview('search', [pattern, options]);
    }

    $('#inputFatherArea').on('keyup', searchAreaTreeView)

    function getNodeInAreaTree(textName){
        var pattern = toEscStr(textName);
        var options = {
            exactMatch: true,
            revealResults: true
        };

        var results = $areaTreeView.treeview('search', [pattern, options]);

        if(results.length != 0){
            return results[0];
        }else{
            return null;
        }
    };

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

        //去服务端新增行业
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
                    location.href = "areaTable";
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

    var areaModify = function () {

        var result = false;

        //去服务端修改节点
        $.ajax({
            url:"../area/edit",
            type:"POST",
            async: false,
            data:{
                id: $('#inputHiddenAreaId').val(),
                code: $('#inputAreaCode').val(),
                name:$('#inputAreaName').val(),
                description: $('#inputAreaDescription').val()
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    location.href = "areaTable";
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

    var areaDelete = function () {

        //去服务端删除节点
        $.ajax({
            url:"../area/delete",
            type:"POST",
            data:{
                id: $('#inputHiddenAreaId').val()
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    location.href = "areaTable";
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
    $("#inputAreaCode").focus(function () {
        var string = $("#inputAreaCode").val();
        var ret = inputCheckCodeNum(string);
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

    /*名称获取焦距*/
    $("#inputFatherArea").focus(function () {
        var string = $("#inputFatherArea").val();
        var nodeTmp = getNodeInAreaTree(string);
        if(null != nodeTmp)
        {
            selectNode = nodeTmp;
            $("#inputFatherArea").removeClass("border-red");
            $(".error3").hide();
        }
    });

    /*名称失去焦距*/
    function checkFatherArea(){
        var string = $("#inputFatherArea").val();
        var nodeTmp = getNodeInAreaTree(string);
        if(null != nodeTmp)
        {
            selectNode = nodeTmp;
        }else{
            $("#inputFatherArea").addClass("border-red");
            $(".error3").html("*请选择正确的父节点");
            $(".error3").css("display", "block");
            preventDefaultFlag = true;
        }
    };

    $("body").click(function(){
        var string = $("#inputFatherArea").val();
        if( bHideFlag == true){
            $("#areaSelectDiv").hide();
            if(string != ""){
                checkFatherArea();
            }
        }
        bHideFlag = true;
    });

    function checkall(operate){
        checkAreaCode();
        checkAreaName();

        if(operate == "create"){
            checkFatherArea();
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
            return areaCreate();
        }else if(operate == "modify"){
            return areaModify();
        }
    });

    $('#btnDelSubmit').click(function(){
        areaDelete();
    });
});

function clearAllErrInfo(){
    $("#inputAreaCode").removeClass("border-red");
    $(".error1").hide()
    $("#inputAreaName").removeClass("border-red");
    $(".error2").hide()
};

//创建弹出框
function createArea() {

    operate = "create";
    $('#manageModalLabel').html("创建区域类目");
    clearAllErrInfo();

    $('#inputAreaCode').val("");
    $('#inputAreaName').val("");
    $('#inputFatherArea').val("");
    $('#inputAreaDescription').val("");

    $('#divFatherArea').show();

    $('#manageAreaModal').modal({backdrop: 'static', keyboard: false});
}

//创建弹出框
function modifyArea(obj, id, pageNumber) {

    var tds=$(obj).parent().parent().find('td');
    operate = "modify";
    $('#manageModalLabel').html("修改区域类目");
    clearAllErrInfo();

    $('#divFatherArea').hide();

    $('#inputHiddenAreaId').val(id);
    $('#inputAreaCode').val(tds.eq(0).text());
    $('#inputAreaName').val(tds.eq(1).text());
    $('#inputAreaDescription').val(tds.eq(2).text());

    $('#manageAreaModal').modal({backdrop: 'static', keyboard: false});
}

//删除弹出框
function deleteArea(obj, id, pageNumber) {

    var tds=$(obj).parent().parent().find('td');

    $('#inputHiddenAreaId').val(id);
    $('#deleteAreaModal').modal({backdrop: 'static', keyboard: false});
}



