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
        $('#inputFilterSubjectCode').val("");
        $('#inputFilterSubjectName').val("");
    });

    //点击文本框显示选择树
    $('#inputFatherSubject').click(function(){
        bHideFlag = false;
        if($("#subjectSelectDiv").is(":hidden")){
            $("#subjectSelectDiv").show();
        }else{
            $("#subjectSelectDiv").hide();
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
            url: "../subject/tree",
            async: false,
            success: function (data) {
                if(data.result == "success"){
                    rootNode.nodes = [];
                    for(var i=0; i< data.subject_list.length; i++){
                        rootNode.nodes[i] = data.subject_list[i] ;
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
        var treeView = $('#subjectSelectTreeView').treeview({
            data: treeData,
            expandIcon: 'glyphicon glyphicon-plus',
            collapseIcon: 'glyphicon glyphicon-minus',
            onNodeSelected: function (event, node) {
                selectNode = node;
                bHideFlag = false;

                //点击文本框显示选择树
                $('#inputFatherSubject').val(selectNode.text);
                $("#inputFatherSubject").removeClass("border-red");
                $(".error3").hide();

                //先隐藏选择树
                $('#subjectSelectDiv').hide();
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

    var $subjectTreeView = createTreeView(treeData);

    var searchSubjectTreeView = function (e) {
        var string = $('#inputFatherSubject').val();
        var pattern = toEscStr(string);
        var options = {
            revealResults: true
        };
        var results = $subjectTreeView.treeview('search', [pattern, options]);
    }

    $('#inputFatherSubject').on('keyup', searchSubjectTreeView)

    function getNodeInSubjectTree(textName){
        var pattern = toEscStr(textName);
        var options = {
            exactMatch: true,
            revealResults: true
        };

        var results = $subjectTreeView.treeview('search', [pattern, options]);

        if(results.length != 0){
            return results[0];
        }else{
            return null;
        }
    };

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
                    location.href = "subjectTable";
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

    var subjectModify = function () {

        var result = false;

        //去服务端修改节点
        $.ajax({
            url:"../subject/edit",
            type:"POST",
            async: false,
            data:{
                id: $('#inputHiddenSubjectId').val(),
                code: $('#inputSubjectCode').val(),
                name:$('#inputSubjectName').val(),
                description: $('#inputSubjectDescription').val()
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    location.href = "subjectTable";
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

    var subjectDelete = function () {

        //去服务端删除节点
        $.ajax({
            url:"../subject/delete",
            type:"POST",
            data:{
                id: $('#inputHiddenSubjectId').val()
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    location.href = "subjectTable";
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

    /*名称获取焦距*/
    $("#inputFatherSubject").focus(function () {
        var string = $("#inputFatherSubject").val();
        var nodeTmp = getNodeInSubjectTree(string);
        if(null != nodeTmp)
        {
            selectNode = nodeTmp;
            $("#inputFatherSubject").removeClass("border-red");
            $(".error3").hide();
        }
    });

    /*名称失去焦距*/
    function checkFatherSubject(){
        var string = $("#inputFatherSubject").val();
        var nodeTmp = getNodeInSubjectTree(string);
        if(null != nodeTmp)
        {
            selectNode = nodeTmp;
        }else{
            $("#inputFatherSubject").addClass("border-red");
            $(".error3").html("*请选择正确的父节点");
            $(".error3").css("display", "block");
            preventDefaultFlag = true;
        }
    };

    $("body").click(function(){
        var string = $("#inputFatherSubject").val();
        if( bHideFlag == true){
            $("#subjectSelectDiv").hide();
            if(string != ""){
                checkFatherSubject();
            }
        }
        bHideFlag = true;
    });

/*    $("#inputFatherSubject").blur(function(){

        $("#subjectSelectDiv").hide();
        //checkFatherSubject();

    });*/

    function checkall(operate){
        checkSubjectCode();
        checkSubjectName();

        if(operate == "create"){
            checkFatherSubject();
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
            return subjectCreate();
        }else if(operate == "modify"){
            return subjectModify();
        }
    });

    $('#btnDelSubmit').click(function(){
        subjectDelete();
    });
});

function clearAllErrInfo(){
    $("#inputSubjectCode").removeClass("border-red");
    $(".error1").hide()
    $("#inputSubjectName").removeClass("border-red");
    $(".error2").hide()
};

//创建弹出框
function createSubject() {

    operate = "create";
    $('#manageModalLabel').html("创建主题类目");
    clearAllErrInfo();

    $('#inputSubjectCode').val("");
    $('#inputSubjectName').val("");
    $('#inputSubjectDescription').val("");
    $('#inputFatherSubject').val("");

    $('#divFatherSubject').show();

    $('#manageSubjectModal').modal({backdrop: 'static', keyboard: false});
}

//创建弹出框
function modifySubject(obj, id, pageNumber) {

    var tds=$(obj).parent().parent().find('td');

    operate = "modify";
    $('#manageModalLabel').html("修改主题类目");
    clearAllErrInfo();

    $('#divFatherSubject').hide();

    $('#inputHiddenSubjectId').val(id);
    $('#inputSubjectCode').val(tds.eq(0).text());
    $('#inputSubjectName').val(tds.eq(1).text());
    $('#inputSubjectDescription').val(tds.eq(2).text());

    $('#manageSubjectModal').modal({backdrop: 'static', keyboard: false});
}

//删除弹出框
function deleteSubject(obj, id, pageNumber) {

    $('#inputHiddenSubjectId').val(id);
    $('#deleteSubjectModal').modal({backdrop: 'static', keyboard: false});
}



