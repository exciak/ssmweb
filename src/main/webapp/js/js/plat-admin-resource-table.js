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
        $('#inputFilterResourceCode').val("");
        $('#inputFilterResourceName').val("");
    });

    //点击文本框显示选择树
    $('#inputFatherResource').click(function(){
        bHideFlag = false;
        if($("#resourceSelectDiv").is(":hidden")){
            $("#resourceSelectDiv").show();
        }else{
            $("#resourceSelectDiv").hide();
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
            url: "../resourcedetail/tree",
            async: false,
            success: function (data) {
                if(data.result == "success"){
                    rootNode.nodes = [];
                    for(var i=0; i< data.resource_detail_list.length; i++){
                        rootNode.nodes[i] = data.resource_detail_list[i] ;
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
        var treeView = $('#resourceSelectTreeView').treeview({
            data: treeData,
            expandIcon: 'glyphicon glyphicon-plus',
            collapseIcon: 'glyphicon glyphicon-minus',
            onNodeSelected: function (event, node) {
                selectNode = node;
                bHideFlag = false;

                //点击文本框显示选择树
                $('#inputFatherResource').val(selectNode.text);
                $("#inputFatherResource").removeClass("border-red");
                $(".error3").hide();

                //先隐藏选择树
                $('#resourceSelectDiv').hide();
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

    var $resourceTreeView = createTreeView(treeData);

    var searchResourceTreeView = function (e) {
        var string = $('#inputFatherResource').val();
        var pattern = toEscStr(string);
        var options = {
            revealResults: true
        };
        var results = $resourceTreeView.treeview('search', [pattern, options]);
    }

    $('#inputFatherResource').on('keyup', searchResourceTreeView)


    function getNodeInResourceTree(textName){
        var pattern = toEscStr(textName);
        var options = {
            exactMatch: true,
            revealResults: true
        };

        var results = $resourceTreeView.treeview('search', [pattern, options]);

        if(results.length != 0){
            return results[0];
        }else{
            return null;
        }
    };

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

        //去服务端新增行业
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
                    location.href = "resourceTable";
                    result = true;
                } else {
                    if(data.existItem != undefined){
                        dmallError("新增资源编码与主题"+ data.existItem.name + "编码重复");
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

    var resourceModify = function () {

        var result = false;

        //去服务端修改节点
        $.ajax({
            url:"../resourcedetail/edit",
            type:"POST",
            async: false,
            data:{
                id: $('#inputHiddenResourceId').val(),
                code: $('#inputResourceCode').val(),
                resourceTypeId:$('#selectResourceType').val(),
                name:$('#inputResourceName').val(),
                description: $('#inputResourceDescription').val()
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    location.href = "resourceTable";
                    result = true;
                } else {
                    if (data.existItem != undefined) {
                        dmallError("资源编码与主题" + data.existItem.name + "编码重复");
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

    var resourceDelete = function () {

        //去服务端删除节点
        $.ajax({
            url:"../resourcedetail/delete",
            type:"POST",
            data:{
                id: $('#inputHiddenResourceId').val()
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    location.href = "resourceTable";
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
            $(".error1").html("*请输入编码,由1-16位数字、字母组成");
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

    /*名称获取焦距*/
    $("#inputFatherResource").focus(function () {
        var string = $("#inputFatherResource").val();
        var nodeTmp = getNodeInResourceTree(string);
        if(null != nodeTmp)
        {
            selectNode = nodeTmp;
            $("#inputFatherResource").removeClass("border-red");
            $(".error3").hide();
        }
    });

    /*名称失去焦距*/
    function checkFatherResource(){
        var string = $("#inputFatherResource").val();
        var nodeTmp = getNodeInResourceTree(string);
        if(null != nodeTmp)
        {
            selectNode = nodeTmp;
        }else{
            $("#inputFatherResource").addClass("border-red");
            $(".error3").html("*请选择正确的父节点");
            $(".error3").css("display", "block");
            preventDefaultFlag = true;
        }
    };

    $("body").click(function(){
        var string = $("#inputFatherResource").val();
        if( bHideFlag == true){
            $("#resourceSelectDiv").hide();
            if(string != ""){
                checkFatherResource();
            }
        }
        bHideFlag = true;
    });

    /*    $("#inputFatherSubject").blur(function(){
     if(true == bTreeClick){
     $("#subjectSelectDiv").hide();
     checkFatherSubject();
     }
     });*/


    function checkall(operate){
        checkResourceCode();
        checkResourceName();

        if(operate == "create"){
            checkFatherResource();
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
            return resourceCreate();
        }else if(operate == "modify"){
            return resourceModify();
        }
    });

    $('#btnDelSubmit').click(function(){
        resourceDelete();
    });

});

function clearAllErrInfo(){
    $("#inputResourceCode").removeClass("border-red");
    $(".error1").hide();
    $("#inputResourceName").removeClass("border-red");
    $(".error2").hide();
};

//创建弹出框
function createResource() {

    operate = "create";
    $('#manageModalLabel').html("创建资源形态");
    clearAllErrInfo();

    $('#inputResourceCode').val("");
    $('#inputResourceName').val("");
    $('#selectResourceType').val("0");
    $('#inputResourceDescription').val("");
    $('#inputFatherResource').val("");

    $('#divFatherResource').show();

    $('#manageResourceModal').modal({backdrop: 'static', keyboard: false});
}

//创建弹出框
function modifyResource(obj, id, pageNumber) {

    var tds=$(obj).parent().parent().find('td');

    operate = "modify";
    $('#manageModalLabel').html("修改资源形态");
    clearAllErrInfo();

    $('#divFatherResource').hide();

    $('#inputHiddenResourceId').val(id);
    $('#inputResourceCode').val(tds.eq(0).text());
    $('#inputResourceName').val(tds.eq(1).text());
    $('#inputResourceDescription').val(tds.eq(3).text());

    var selectOptionName = tds.eq(2).text();

    //方法一
    //$("#selectResourceType option[text='ODPS']").attr("selected", true);

    //方法二
    //$("#selectResourceType").find("option[text='ODPS']").attr('selected', true);

    //方法三
    //$("#selectResourceType option:contains('ODPS')").attr('selected', true);

    //方法四
    $("#selectResourceType option").each(function (){
        if($(this).text()== selectOptionName){
            $(this).attr('selected',true);
        }
    });

    $('#manageResourceModal').modal({backdrop: 'static', keyboard: false});
}

//删除弹出框
function deleteResource(obj, id, pageNumber) {

    var tds=$(obj).parent().parent().find('td');

    $('#inputHiddenResourceId').val(id);
    $('#deleteResourceModal').modal({backdrop: 'static', keyboard: false});
}



