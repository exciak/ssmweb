/**
 * Created by zlx on 2015/8/3.
 */

/* 修改和删除操作的索引值 */
var dbOpRowIndex = 0;
var curPageNumber = 0;
var preventDefaultFlag = false;
var operate = "";
var needModifyPrefixCode = "";

$(document).ready(function () {
    var departTreeData = [];
    var departRootNode = {};
    var selectDepartNode = {};

    //清除按钮事件绑定
    $('#btn_clear').click(function(){
        $('#inputFilterDepartment').val("");
        $('#inputFilterPrefix').val("");
    });

    //查询
    $("#btn_filter").click(function () {
       var deptName=$("#inputFilterDepartment").attr("value");
        var prefixCode =$("#inputFilterName").attr("value");
        $("#hiddenPrefixcode").val($.trim(prefixCode));
        $("#hiddenDeptName").val($.trim(deptName));

    });

    /*    部门选择树*/
    getDepartTreeDataInit();

    function getDepartTreeDataInit() {
        //初始化根节点
        departRootNode.id = 0;
        departRootNode.code = "00000";
        departRootNode.text = "根节点";
        departRootNode.description = "根节点";
        departRootNode.level = 0;
        departRootNode.parent_code = "00000";

        //去后端获取treedata
        $.ajax({
            type: 'GET',
            url: "../department/tree",
            async: false,
            success: function (data) {
                if(data.result == "success"){
                    departRootNode.nodes = [];
                    for(var i=0; i< data.department_list.length; i++){
                        departRootNode.nodes[i] = data.department_list[i] ;
                    }
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });

        departTreeData[0] = departRootNode;
    };

   var $departTreeViewForCreate = createDepartTreeView(departTreeData);

    function createDepartTreeView(treeData) {
        var departTreeView = $('#departTreeView').treeview({
            data: treeData,
            showBorder:true,
            expandIcon: 'glyphicon glyphicon-plus',
            collapseIcon: 'glyphicon glyphicon-minus',
            onNodeSelected: function (event, node) {
                selectDepartNode = node;

            }
        });

        return departTreeView;
    }

    function createPrefixCode(){
        var departmentList = [];
        //前段码输入合法性检查
        preventDefaultFlag = false;
        checkall();
        if (preventDefaultFlag == true) {
            return;
        }

        //添加所有选择部门的ID
        $("#selectedDepartment option").each(function(){
            var departmentId = $(this).get(0).value;
            departmentList.push(departmentId);
        });

        $.post("../prefix/create",
            {
                prefix: $("#inputPrefixCode").val(),
                departList:departmentList,
                description: $("#inputDescription").attr("value")
            },
            function (data, status) {
                if (data.result == "success") {
                    location.href = "prefix?" + "&department=" + $("#inputFilterDepartment").attr("value")
                    + "&pageNumber=" + curPageNumber;
                } else {
                    if (data.existItem != undefined) {
                        dmallError("前缀码已存在");
                    } else {
                        dmallError(data.result);
                    }
                }
            },
            "json");
    };

    //提交前段码修改信息
    function modifyPrefixCode(){
        var departments=[];

        var count = $('#selectedDepartment'+' option').length;
        for (var i=0; i<count; i++){
            var optionSrc = $('#selectedDepartment').get(0).options[i];
            departments[i] = optionSrc.value;
        }

        $.post("../prefix/modify",
            {
                id:dbOpRowIndex,
                code:$('#inputPrefixCode').val(),
                description: $("#inputDescription").attr("value"),
                departments: departments
            },
            function (data, status) {
                if (data.result == "success") {
                    window.location.reload();
                } else {
                    if (data.existItem != undefined) {
                        dmallError("前缀码已存在");
                    } else {
                        dmallError(data.result);
                    }
                }
            },
            "json");
    };

    function deletePrefixCode(){
        $.post("../prefix/del",
            {
                id:dbOpRowIndex
            },
            function (data, status) {
                if (data.result != "success") {
                    dmallError("删除失败。");
                }else{
                    location.href = "prefix?" + "&department=" + $("#inputFilterDepartment").attr("value")
                    + "&pageNumber=" + curPageNumber;
                }
                /*                else
                 {
                 window.location.reload();
                 }*/
            },
            "json");
    }

    //提交批量删除信息
    $("#btnDeletePrefixCodeBulk").click(function(){
        var indexList="";
        for (i = 0; i<$("#listTable input[name='ids']:enabled:checked").size(); i++ )
        {
            indexList = indexList + $("#listTable input[name='ids']:enabled:checked")[i].value;
            if ((i+1)!=$("#listTable input[name='ids']:enabled:checked").size())
            {
                indexList += ',';
            }
        }

        $.ajax({
            url:"../prefix/del",
            type:"POST",
            data:{id: indexList.split(",")},
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    location.href = "prefix?" + "&department=" + $("#inputFilterDepartment").attr("value")
                    + "&pageNumber=" + curPageNumber;
                } else {
                    var url = "";
                    dmallNotifyAndLocation(data.result, url);
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });
    });

    //创建对话框添加部门
    $('#btnAddDepartment').click(function() {
        //若还未选择节点则给出提示
        if(undefined == selectDepartNode.id){
            dmallError("请先选择部门");
            return;
        }

        //根节点不能选择
        if(0 == selectDepartNode.nodeId){
            dmallError("根节点不能选择");
            return;
        }

        //如果已经存在则返回
        var count = $('#selectedDepartment'+' option').length;
        for (var i=0; i<count; i++){
            var optionSrc = $('#selectedDepartment').get(0).options[i];
            if(selectDepartNode.text == optionSrc.text){
                dmallError("该部门已经被选择");
                return;
            }
        }

        var newOption = new Option(selectDepartNode.text, selectDepartNode.id);
        $('#selectedDepartment').append(newOption);


    });

    //创建对话框删除部门
    $('#btnRemoveDepartment').click(function() {
        var selectOpt = $("#selectedDepartment option:selected");
        selectOpt.remove();
    });

    //修改对话框删除部门
    $('#btnRemoveDepartment').click(function() {
        var selectOpt = $("#selectedDepartment option:selected");
        selectOpt.remove();
    });

    function prefixExist(prefixCode){
        var bExsit = false;
        $.ajax({
            type: 'GET',
            url: "../prefix/getPrefixByCode?prefixCode="+prefixCode,
            async: false,
            success: function (data) {
                if(data.result == "success"){
                    bExsit =  true;
                }
            },
            error: function () {
                dmallAjaxError();
            }
        })

        return bExsit;
    }

    /*编码获取焦距*/
    $("#inputPrefixCode").focus(function () {
        var string = $("#inputPrefixCode").val();
        var ret = inputCheckCode(string);
        if(!ret)
        {
            $("#inputPrefixCode").removeClass("border-red");
            $(".error1").hide();
        }
    });

    /*编码失去焦距*/
    function checkPreifxCode(){
        var prefixCode = $("#inputPrefixCode").val();
        var ret = inputCheckCode(prefixCode);
        if(!ret)
        {
            $("#inputPrefixCode").addClass("border-red");
            $(".error1").html("*请输入编码,由字母、数字组成，1-16个字符");
            $(".error1").css("display", "block");
            preventDefaultFlag = true;
        }

        //if((true == prefixExist(prefixCode)) && (prefixCode != needModifyPrefixCode)){
        //    $("#inputPrefixCode").addClass("border-red");
        //    $(".error1").html("*前段码冲突");
        //    $(".error1").css("display", "block");
        //    preventDefaultFlag = true;
        //}
    };
    $("#inputPrefixCode").blur(function(){
        checkPreifxCode();
    });

    function checkall(){
        checkPreifxCode();
    }

    /* 点击提交按钮 */
    $('#btnSubmit').click(function(){
        preventDefaultFlag = false;
        checkall(operate);
        if (preventDefaultFlag == true) {
            return false;
        }

        if(operate == "create"){
            createPrefixCode();
        }else if(operate == "modify"){
            modifyPrefixCode();
        }
    });

    $('#btnDelSubmit').click(function(){
        deletePrefixCode();
    });

});

//创建前段码弹出框
function createPrifixCode(obj, pageNumber){

    operate = "create";
    $('#manageModalLabel').html("创建前段码")

    $('#inputPrefixCode').val("");
    $('#inputDescription').val("");
    $('#selectedDepartment').empty();

    $('#managePrefixCodeModal').modal({backdrop: 'static', keyboard: false});
}

//修改前段码弹出框
function modifyPrifixCode(obj, id){
    var tds=$(obj).parent().parent().find('td');


    operate = "modify";
    $('#manageModalLabel').html("修改前段码");
    dbOpRowIndex = id;
    var prefixDeptList = [];
    var prefixCode = tds.eq(1).text();
    tds.eq(2).children("span").each(function() {
        prefixDeptList.push({name : $(this).text(), id : this.id});
    });

    //去后端获取前段码详情
    //$.ajax({
    //    type: 'GET',
    //    url: "../prefix/getPrefixByCode?prefixCode="+prefixCode,
    //    async: false,
    //    success: function (data) {
    //        if(data.result == "success"){
    //            prefixDeptList = data.prefixCode.departmentEntityList;
    //        }
    //    },
    //    error: function (data) {
    //    }
    //})

    $('#selectedDepartment').empty();
    if(prefixDeptList!=null) {
        for (var i = 0; i < prefixDeptList.length; i++) {
            var newOption = new Option(prefixDeptList[i].name, prefixDeptList[i].id);
            $('#selectedDepartment').append(newOption);
        }
    }

    $('#inputPrefixCode').val(tds.eq(1).text());
    needModifyPrefixCode = $('#inputPrefixCode').val();
    $('#inputDescription').val(tds.eq(3).text());

    $('#managePrefixCodeModal').modal({backdrop: 'static', keyboard: false});
}

//删除前段码弹出框
function deletePrifixCode(obj, id, pageNumber){
    var tds=$(obj).parent().parent().find('td');
    var prefixCode = tds.eq(1).text();
    var bHasDepart = false;

    $.ajax({
        type: 'GET',
        url: "../prefix/getPrefixByCode?prefixCode="+prefixCode,
        async: false,
        success: function (data) {
            if(data.result == "success"){
                if(null  != data.prefixCode.departmentEntityList){
                    bHasDepart = true;
                }
            }
        },
        error: function () {
            dmallAjaxError();
        }
    })

    if(bHasDepart == true){
        dmallError("存在部门引用，不能删除。");
        return;
    }

    dbOpRowIndex = id;
    curPageNumber = pageNumber;


    $('#deletePrefixCodeModal').modal({backdrop: 'static', keyboard: false});
}

