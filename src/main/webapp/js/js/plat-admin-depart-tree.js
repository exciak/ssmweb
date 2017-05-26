/**
 * Created by pcd on 2016/1/5.
 */
var preventDefaultFlag = false;
var bHideAreaFlag = true;

$(document).ready(function () {

    var departTreeData = [];
    var departRootNode = {};
    var $departTreeView = {};
    var selectDepartNode = {};
    var parentNode = {};

    var areaTreeData = [];
    var $areaTreeView = {};
    var selectAreaNode = {};
    var selectArea = {};
    var curOperate = "";
    var treeExpandOpt = "expand";
    //点击文本框显示选择树
    $('#inputBelongArea').click(function(){
        bHideAreaFlag = false;
        if($("#areaSelectDiv").is(":hidden")){
            $("#areaSelectDiv").show();
        }else{
            $("#areaSelectDiv").hide();
        };
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
                }else{
                    departRootNode.nodes = null;
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });

        departTreeData[0] = departRootNode;
    };

    $departTreeView = createDepartTreeView(departTreeData);

    function initDepartForm(departId){
        var departDetail = {};
        var prefixList = [];
        var departList = [];
        var areaDetail = {};

        //去后端获取前段码详情
        $.ajax({
            type: 'GET',
            url: "../department/getDepartById?departId="+departId,
            async: false,
            success: function (data) {
                if(data.result == "success"){
                    departDetail = data.departDetail;
                    if(null != departDetail.prefixCodeEntityList){
                        prefixList = departDetail.prefixCodeEntityList;
                    }

                    if(null != departDetail.departmentManagerList){
                        departList = departDetail.departmentManagerList;
                    }

                    if(null != departDetail.areaEntity){
                        areaDetail = departDetail.areaEntity;
                    }
                }
            },
            error: function () {
                dmallAjaxError();
            }
        })

        $('#inputDepartName').val(departDetail.name);
        $('#inputTel').val(departDetail.telephone);
        $('#inputEmail').val(departDetail.email);
        $('#inputDescription').val(departDetail.description);
        if (departDetail.needKexinReview == 0) {
            $('#needKexinReview0').attr("checked", true);
            $('#needKexinReview1').attr("checked", false);
        } else {
            $('#needKexinReview0').attr("checked", false);
            $('#needKexinReview1').attr("checked", true);
        }

        if(null != areaDetail){
            $('#inputBelongArea').val(areaDetail.name);
        }

        $('#inputDepartName').attr("readOnly", true);
        $('#inputTel').attr("readOnly", true);
        $('#inputEmail').attr("readOnly", true);
        $('#inputDescription').attr("readOnly", true);
        $('#inputBelongArea').attr("disabled", true);
        $('#needKexinReview0').attr("disabled", true);
        $('#needKexinReview1').attr("disabled", true);
        $('#btnSelectArea').hide();
        $('#btnSelectPrefix').hide();
        $('#btnAddManager').hide();
        $('#btnDelManager').hide();

        $('#divFatherName').hide();
        //隐藏提交取消按钮
        $('#btnManageDepartSubmit').hide();
        $('#btnManageDepartCancel').hide();

        //取消错误提示框
        clearAllErrInfo();

        selectArea.id = areaDetail.id;
        selectArea.name = areaDetail.name;



        $('#selectPrefixList').empty();
        if(prefixList.length != 0){
            for (var i=0; i<prefixList.length; i++){
                var newOption = new Option(prefixList[i].code, prefixList[i].id);
                $('#selectPrefixList').append(newOption);
            }
        }

        $('#selectManagerList').empty();
        if(departList.length != 0){
            for (var i=0; i<departList.length; i++){
                var newOption = new Option(departList[i].user_name, departList[i].userId);
                $('#selectManagerList').append(newOption);
            }
        }


    };

    function createDepartTreeView(treeData) {
        var departTreeView = $('#departTreeView').treeview({
            data: treeData,
            expandIcon: 'glyphicon glyphicon-plus',
            collapseIcon: 'glyphicon glyphicon-minus',
            onNodeSelected: function (event, node) {
                selectDepartNode = node;

                //无效节点不处理，并隐藏信息框
                if(selectDepartNode.code == '00000'){
                    $('#divDepartInfo').hide();
                }else{
                    //将主题信息div显示
                    $('#divDepartInfo').show();
                    initDepartForm(selectDepartNode.id);
                }
            },
            onNodeUnselected: function (event, node) {
                selectDepartNode = {};
                $('#divDepartInfo').hide();
            }
        });

        return departTreeView;
    }

    function refreshDepartTreeView(expandNode){
        //从后端获取树结构并初始化
        getDepartTreeDataInit();

        //重新创建数
        $departTreeView = createDepartTreeView(departTreeData);

        //展开节点
        expandNodes(expandNode)

        //定位当前操作节点
        //searchAndSelectNode(ocusNode);

    }

    function expandNodes(expandNode){
        var nodeTmp = {};
        var expandNodes = [];

        nodeTmp = expandNode;
        while(nodeTmp.nodeId != undefined){
            expandNodes.unshift(nodeTmp);
            nodeTmp = $departTreeView.treeview('getParent', nodeTmp.nodeId);
        }

        $departTreeView.treeview('expandNode', [ expandNodes, { levels: '1', silent: false, ignoreChildren: false}]);
    }

    /*    行业类目的搜索*/
    var searchDepartTreeView = function (e) {
        var string = $('#inputSearchDepart').val();
        var pattern = toEscStr(string);
        var options = {
            revealResults: true
        };
        var results = $departTreeView.treeview('search', [pattern, options]);

    }

    $('#inputSearchDepart').on('keyup', searchDepartTreeView);

    /* 搜索节点并高亮*/
    var searchAndSelectNode = function (node) {
        var pattern = toEscStr(node.text);
        var options = {
            revealResults: true
        };
        return $departTreeView.treeview('search', [pattern, options]);
    }

    $('#btnToggleExpand').on('click', function (e) {
        if(treeExpandOpt == "expand"){
            $departTreeView.treeview('expandAll');
            treeExpandOpt = "collapse";
            $("#toggleImage").attr("src","../view/img/collapse-all.png");
            $("#btnToggleExpand").attr("title","收起树");
        }else{
            $departTreeView.treeview('collapseAll');
            treeExpandOpt = "expand";
            $("#toggleImage").attr("src","../view/img/expand-all.png");
            $("#btnToggleExpand").attr("title","展开树");
        }
    });

    /*    区域选择树*/
    getAreaTreeDataInit();

    function getAreaTreeDataInit() {
        //去后端获取treedata
        $.ajax({
            type: 'GET',
            url: "../area/tree",
            async: false,
            success: function (data) {
                if(data.result == "success"){
                    areaTreeData = data.area_list;
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });

    };

    $areaTreeView = createAreaTreeView(areaTreeData);

    var searchAreaTreeView = function (e) {
        var string = $('#inputBelongArea').val();
        var pattern = toEscStr(string);
        var options = {
            revealResults: true
        };
        var results = $areaTreeView.treeview('search', [pattern, options]);
    }

    $('#inputBelongArea').on('keyup', searchAreaTreeView)

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

    function createAreaTreeView(treeData) {
        var areaTreeView = $('#areaSelectTreeView').treeview({
            data: treeData,
            expandIcon: 'glyphicon glyphicon-plus',
            collapseIcon: 'glyphicon glyphicon-minus',
            onNodeSelected: function (event, node) {

                selectAreaNode = node;
                bHideAreaFlag = false;

                selectArea.id = selectAreaNode.id;
                selectArea.name = selectAreaNode.text;

                //点击文本框显示选择树
                $('#inputBelongArea').val(selectAreaNode.text);
                $("#inputBelongArea").removeClass("border-red");
                $(".error2").hide();

                //先隐藏选择树
                $('#areaSelectDiv').hide();
            },
            onNodeCollapsed: function(event, node) {
                bHideAreaFlag = false;
            },
            onNodeExpanded: function (event, node) {
                bHideAreaFlag = false;
            }
        });

        return areaTreeView;
    }

    /* 管理listAll,如果无元素，增加说明”无可选人员“ */
    function manageListAllUserEmpty(flag){
        var EmptyOption = new Option("无可选人员", 0);
        if(flag == true) {
            if (0 == $('#allUserList option').length) {
                EmptyOption.disabled = true;
                $('#allUserList').append(EmptyOption);
            }
        }
        else if((1 == $('#allUserList option').length) &&
            ($("#allUserList").get(0).options[0].text === "无可选人员")){
            $("#allUserList").empty();
        }
    }

    var searchIdInList = function (Id, List){
        count = List.length;
        for(i = 0; i < count; i++){
            if(Id == List[i]){
                return true;
            }
        }

        return false;
    }

    function getUsers(pageNum){
        $.get("../user_role/getUserList",
            {
                pageNumber: pageNum,
                pageSize: 10
            },
            function (data, status) {
                if (status == "success"&& (data.result == "success")) {
                    /* 获取已选择的用户 */
                    var selectedIdList = [];
                    var $listSelected = $('#selectedUserList');
                    var count = $('#selectedUserList option').length;
                    for (var i=0; i<count; i++){
                        var optionSrc = $listSelected.get(0).options[i];
                        selectedIdList.push(optionSrc.value);
                    }

                    var $listAllUser = $('#allUserList');
                    $listAllUser.empty();
                    for (var i=0; i< data.resultList.result.length; i++){
                        var user = data.resultList.result[i];
                        if(false == searchIdInList(user.id, selectedIdList)) {
                            var newOption = new Option(user.name, user.id);
                            $listAllUser.append(newOption);
                        }
                    }

                    manageListAllUserEmpty(true);

                    $("#totalPageUser").html(data.totalPage);
                    $("#currentPageUser").html(data.curPage);
                } else {
                    console.log("获取用户失败！");
                }
            },
            "json"
        );
    }
    $("#previousPageUser").click(
        function(){
            if(parseInt($("#currentPageUser").text())>1) {
                getUsers(parseInt($("#currentPageUser").text())-1);
            }
        });

    $("#nextPageUser").click(
        function(){
            if(parseInt($("#currentPageUser").text())<parseInt($("#totalPageUser").text())) {
                getUsers(parseInt($("#currentPageUser").text())+1);
            }
        });

    // 弹出框中选取人员
    $('#selectSomeUser').click(function() {
        var $menus = $('#selectedUserList');

        var $items = $.grep($('#allUserList option:selected').clone(), function(v){
            return $menus.find("option[value='" + $(v).val() + "']").length == 0;

        });

        $menus.append($items);

        var $options = $menus.find('option'); // get all options
        $options = $options.sort(function(a,b){ // sort by value of options
            return a.value - b.value;
        });
        $menus.html($options); // add new sorted options to select

        $('#allUserList option:selected').remove();

        manageListAllUserEmpty(true);
    });

    // 弹出框中取消人员
    $('#removeSomeUser').click(function() {
        manageListAllUserEmpty(false);

        var $menus = $('#allUserList');

        var $items = $.grep($('#selectedUserList option:selected').clone(), function(v){
            return $menus.find("option[value='" + $(v).val() + "']").length == 0;

        });

        $menus.append($items);

        var $options = $menus.find('option');
        $options = $options.sort(function(a,b){
            return a.value - b.value;
        });
        $menus.html($options);

        $('#selectedUserList option:selected').remove();
    });

    /*    处理添加前段码*/
    /* 管理listAll,如果无元素，增加说明”无可选人员“ */
    function manageListAllPrefixEmpty(flag){
        var EmptyOption = new Option("无可选前段码", 0);
        if(flag == true) {
            if (0 == $('#allPrefixList option').length) {
                EmptyOption.disabled = true;
                $('#allPrefixList').append(EmptyOption);
            }
        }
        else if((1 == $('#allPrefixList option').length) &&
            ($("#allPrefixList").get(0).options[0].text === "无可选前段码")){
            $("#allPrefixList").empty();
        }
    }

    function getPrefix(pageNum){
        $.get("../prefix/getPrefix",
            {
                pageNumber: pageNum
            },
            function (data, status) {
                if (status == "success") {
                    /* 获取已选择的用户 */
                    var selectedIdList = [];
                    var $listSelected = $('#selectedPrefixList');
                    var count = $('#selectedPerfixList option').length;
                    for (var i=0; i<count; i++){
                        var optionSrc = $listSelected.get(0).options[i];
                        selectedIdList.push(optionSrc.value);
                    }

                    var $listAllPerfix = $('#allPrefixList');
                    $listAllPerfix.empty();
                    for (var i=0; i< data.prefixCode_list.length; i++){
                        var prefix = data.prefixCode_list[i];
                        if(false == searchIdInList(prefix.id, selectedIdList)) {
                            var newOption = new Option(prefix.code, prefix.id);
                            $listAllPerfix.append(newOption);
                        }
                    }

                    manageListAllPrefixEmpty(true);

                    $("#totalPagePrefix").html(data.totalPage);
                    $("#currentPagePrefix").html(data.curPage);
                } else {
                    console.log("获取前段码失败！");
                }
            },
            "json"
        );
    }
    $("#previousPagePrefix").click(
        function(){
            if(parseInt($("#currentPagePrefix").text())>1) {
                getPrefix(parseInt($("#currentPagePrefix").text())-1);
            }
        });

    $("#nextPagePrefix").click(
        function(){
            if(parseInt($("#currentPagePrefix").text())<parseInt($("#totalPagePrefix").text())) {
                getPrefix(parseInt($("#currentPagePrefix").text())+1);
            }
        });

    // 弹出框中选取人员
    $('#selectSomePrefix').click(function() {
        var $menus = $('#selectedPrefixList');

        var $items = $.grep($('#allPrefixList option:selected').clone(), function(v){
            return $menus.find("option[value='" + $(v).val() + "']").length == 0;

        });

        $menus.append($items);

        var $options = $menus.find('option'); // get all options
        $options = $options.sort(function(a,b){ // sort by value of options
            return a.value - b.value;
        });
        $menus.html($options); // add new sorted options to select

        $('#allPrefixList option:selected').remove();

        manageListAllPrefixEmpty(true);
    });

    // 弹出框中取消前段码
    $('#removeSomePrefix').click(function() {
        manageListAllPrefixEmpty(false);

        var $menus = $('#allPrefixList');

        var $items = $.grep($('#selectedPrefixList option:selected').clone(), function(v){
            return $menus.find("option[value='" + $(v).val() + "']").length == 0;

        });

        $menus.append($items);

        var $options = $menus.find('option');
        $options = $options.sort(function(a,b){
            return a.value - b.value;
        });
        $menus.html($options);

        $('#selectedPrefixList option:selected').remove();
    });

    // 弹出框提交
    $('#btnPrefixCommit').click(
        function() {
            var $selectShow = $('#selectPrefixList');
            var $listSelected = $('#selectedPrefixList');
            var count = $('#selectedPrefixList option').length;
            $selectShow.empty();
            for (var i=0; i<count; i++){
                var optionSrc = $listSelected.get(0).options[i];
                var newOption = new Option(optionSrc.text, optionSrc.value);
                $selectShow.append(newOption);
            }
        }
    );

    // 打开对话框
    $("#btnSelectPrefix").click(
        function (){
            //从后端获取所有人员
            getPrefix(1);
            //打开模态框
            $('#addPrefixModal').modal({backdrop: 'static', keyboard: false});
            //填写已选人员
            var $selectSrc = $('#selectPrefixList');
            var count = $('#selectPrefixList'+' option').length;
            var $listSelected = $('#selectedPrefixList');
            $listSelected.empty();
            for (var i=0; i<count; i++){
                var optionSrc = $selectSrc.get(0).options[i];
                var newOption = new Option(optionSrc.text, optionSrc.value);
                $listSelected.append(newOption);
            }
        }
    );

    /*    处理创建部门表单提交*/
    var departCreate = function (){
        var areaId;
        var parentCode;
        var prefixIdList = [];
        var managerList = [];
        var result = false;

        areaId = selectArea.id;
        parentCode = selectDepartNode.code;

        var prefixCount = $('#selectPrefixList option').length;
        for(var i=0; i< prefixCount; i++){
            prefixIdList.push($('#selectPrefixList').get(0).options[i].value);
        }

        var managerCount = $('#selectManagerList option').length;
        for(var i=0; i< managerCount; i++){
            managerList.push($('#selectManagerList').get(0).options[i].value);
        }

        //去服务端新增
        $.ajax({
            url:"../department/createdept",
            type:"POST",
            async: false,
            data:{
                name:$('#inputDepartName').val(),
                areaId: areaId,
                parentCode: parentCode,
                prefixIdList:prefixIdList,
                telephone: $('#inputTel').val(),
                email: $('#inputEmail').val(),
                description: $('#inputDescription').val(),
                managerList:managerList,
                needKexinReview: $("input[name='needKexinReview']").filter(":checked").val()
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    refreshDepartTreeView(selectDepartNode);
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
    };

    /*    处理修改部门表单提交*/
    var departModify = function (){
        var areaId;
        var departId;
        var parentCode;
        var prefixIdList = [];
        var managerList = [];
        var result = false;

        areaId = selectArea.id;
        departId = selectDepartNode.id;
        parentCode = selectDepartNode.parent_code;

        var prefixCount = $('#selectPrefixList option').length;
        for(var i=0; i< prefixCount; i++){
            prefixIdList.push($('#selectPrefixList').get(0).options[i].value);
        }

        var managerCount = $('#selectManagerList option').length;
        for(var i=0; i< managerCount; i++){
            managerList.push($('#selectManagerList').get(0).options[i].value);
        }

        //去服务端新增
        $.ajax({
            url:"../department/modifydept",
            type:"POST",
            async: false,
            data:{
                name:$('#inputDepartName').val(),
                areaId: areaId,
                deptId:departId,
                parentCode: parentCode,
                prefixIdList:prefixIdList,
                telephone: $('#inputTel').val(),
                email: $('#inputEmail').val(),
                description: $('#inputDescription').val(),
                managerList:managerList,
                needKexinReview: $("input[name='needKexinReview']").filter(":checked").val()
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    refreshDepartTreeView(selectDepartNode);
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
    };

    /*    删除部门*/
    var departDelete = function () {
        var result = false;

        //无效节点不能删除
        if(selectDepartNode.code == '00000'){
            dmallError("不能删除根节点");
            return false;
        }

        //若还未选择节点则给出提示
        if(undefined == selectDepartNode.code){
            dmallError("请先选择所要操作的节点");
            return false;
        }

        //去服务端删除节点
        $.ajax({
            url:"../department/del",
            type:"POST",
            async: false,
            data:{
                deptId: selectDepartNode.id
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    parentNode = $departTreeView.treeview('getParent', selectDepartNode.nodeId);
                    refreshDepartTreeView(parentNode);
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


    $('#btnDelDepartSubmit').click(function(){

        var result  = false;

        result = departDelete();

        if(true == result){
            $('#inputDepartName').val("");
            $('#inputTel').val("");
            $('#inputEmail').val("");
            $('#inputDescription').val("");
            $('#inputBelongArea').val("");
            $('#needKexinReview0').attr("checked", true);
            $('#selectPrefixList').empty();
            $('#selectManagerList').empty();

            //隐藏提交取消按钮
            $('#btnManageDepartSubmit').hide();
            $('#btnManageDepartCancel').hide();
            $('#divDepartInfo').hide();
        }
    });

    /* 点击新增按钮 */
    $('#btnDepartAddSon').click(function(){

        //若还未选择节点则给出提示
        if(undefined == selectDepartNode.code){
            dmallError("请先选择所要操作的节点");
            return false;
        }

        curOperate = "create";
        $('#labelFatherName').html(selectDepartNode.text);
        $('#divFatherName').show();

        //清空表单，并可写
        $('#inputDepartName').val("");
        $('#inputTel').val("");
        $('#inputEmail').val("");
        $('#inputDescription').val("");
        $('#inputBelongArea').val("");
        $('#selectPrefixList').empty();
        $('#selectManagerList').empty();
        $('#needKexinReview0').attr("checked", true);


        $('#inputDepartName').attr("readOnly", false);
        $('#inputTel').attr("readOnly", false);
        $('#inputEmail').attr("readOnly", false);
        $('#inputDescription').attr("readOnly", false);
        $('#inputBelongArea').attr("disabled", false);
        $('#needKexinReview0').attr("disabled", false);
        $('#needKexinReview1').attr("disabled", false);

        $('#btnSelectArea').show();
        $('#btnSelectPrefix').show();
        $('#btnAddManager').show();
        $('#btnDelManager').show();

        //显示提交按钮
        $('#divSubjectInfo').show();
        $('#btnManageDepartSubmit').show();
        $('#btnManageDepartCancel').show();

        $('#divDepartInfo').show();

    });

    /* 点击修改按钮 */
    $('#btnDepartModify').click(function(){
        //无效节点不能修改
        if(selectDepartNode.code == '00000'){
            dmallError("不能修改根节点");
            return;
        }

        //若还未选择节点则给出提示
        if(undefined == selectDepartNode.code){
            dmallError("请先选择所要操作的节点");
            return;
        }

        curOperate = "modify";

        initDepartForm(selectDepartNode.id);

        $('#inputDepartName').attr("readOnly", false);
        $('#inputTel').attr("readOnly", false);
        $('#inputEmail').attr("readOnly", false);
        $('#inputDescription').attr("readOnly", false);
        $('#inputBelongArea').attr("disabled", false);
        $('#needKexinReview0').attr("disabled", false);
        $('#needKexinReview1').attr("disabled", false);
        $('#btnSelectArea').show();
        $('#btnSelectPrefix').show();
        $('#btnAddManager').show();
        $('#btnDelManager').show();
        //显示提交按钮
        $('#divSubjectInfo').show();
        $('#btnManageDepartSubmit').show();
        $('#btnManageDepartCancel').show();
    });

    //删除弹出框
    $('#btnDepartDelete').click(function () {

        if (undefined == selectDepartNode.code) {
            dmallError("请先选择所要操作的节点");
            return false;
        }

        //无效节点不能修改
        if (selectDepartNode.code == '00000') {
            dmallError("不能删除根节点");
            return false;
        }

        $('#deleteDepartModal').modal({backdrop: 'static', keyboard: false});
    });

    /*组织名称栏获取焦距*/
    $("#inputDepartName").focus(function () {
        var string = $("#inputDepartName").val();
        var ret = inputCheckNameLax2(string);
        if(!ret)
        {
            $("#inputDepartName").removeClass("border-red");
            $(".error1").hide();
        }
    });

    /*组织名称栏失去焦距*/
    function checkDeptName(){
        var string = $("#inputDepartName").val();
        var ret = inputCheckNameLax2(string);
        if(!ret)
        {
            $("#inputDepartName").addClass("border-red");
            $(".error1").html("*请输入部门名称,由中文、字母、数字、下划线、标点符号组成，1-64个字符");
            $(".error1").css("display", "block");
            preventDefaultFlag = true;
        }
    };
    $("#inputDepartName").blur(function(){
        checkDeptName();
    });

    $("#inputBelongArea").focus(function () {
        var string = $("#inputBelongArea").val();
        var nodeTmp = getNodeInAreaTree(string);
        if(null != nodeTmp)
        {
            selectAreaNode = nodeTmp;
            $("#inputBelongArea").removeClass("border-red");
            $(".error2").hide();
        }
    });

    /*组织邮箱栏失去焦距*/
    function checkFatherArea(){
        var string = $("#inputBelongArea").val();
        var nodeTmp = getNodeInAreaTree(string);
        if(null != nodeTmp)
        {
            selectAreaNode = nodeTmp;
        }else{
            $("#inputBelongArea").addClass("border-red");
            $(".error2").html("*请选择正确的区域");
            $(".error2").css("display", "block");
            preventDefaultFlag = true;
        }
    };

    $("body").click(function(){
        var string = $("#inputBelongArea").val();
        if( bHideAreaFlag == true){
            $("#areaSelectDiv").hide();
            if(string != ""){
                checkFatherArea();
            }
        }
        bHideAreaFlag = true;
    });

    /*组织电话栏获取焦距*/
    $("#inputTel").focus(function () {
        var string = $("#inputTel").val();
        var ret = inputTelephone(string);
        if(!ret)
        {
            $("#inputTel").removeClass("border-red");
            $(".error3").hide();
        }
    });

    /*组织电话栏失去焦距*/
    function checkTel(){
        var string = $("#inputTel").val();
        var ret = inputTelephone(string);
        if(!ret&&string!="")
        {
            $("#inputTel").addClass("border-red");
            $(".error3").html("*请输入正确的电话号码");
            $(".error3").css("display", "block");
            preventDefaultFlag = true;
        }
    };
    $("#inputTel").blur(function(){
        checkTel();
    });

    /*组织邮箱栏获取焦距*/
    $("#inputEmail").focus(function () {
        var string = $("#inputEmail").val();
        var ret = inputEmail(string);
        if(!ret)
        {
            $("#inputEmail").removeClass("border-red");
            $(".error4").hide();
        }
    });

    /*组织邮箱栏失去焦距*/
    function checkEmail(){
        var string = $("#inputEmail").val();
        var ret = inputEmail(string);
        if(!ret&&string!="")
        {
            $("#inputEmail").addClass("border-red");
            $(".error4").html("*请输入正确的邮箱地址");
            $(".error4").css("display", "block");
            preventDefaultFlag = true;
        }
    };
    $("#inputEmail").blur(function(){
        checkEmail();
    });

    function checkall(){
        checkDeptName();
        checkFatherArea();
        checkEmail();
        checkTel();
    }

    function clearAllErrInfo(){
        $("#inputDepartName").removeClass("border-red");
        $(".error1").hide()
        $("#inputBelongArea").removeClass("border-red");
        $(".error2").hide()
        $("#inputTel").removeClass("border-red");
        $(".error3").hide()
        $("#inputEmail").removeClass("border-red");
        $(".error4").hide()
    };
    /* 点击提交按钮 */
    $('#btnManageDepartSubmit').click(function(){
        var result = false;
        preventDefaultFlag = false;
        checkall();
        if (preventDefaultFlag == true) {
            return false;
        }

        if(curOperate == "create"){
            result = departCreate();
        };

        if(curOperate == "modify"){
            result = departModify();
        };

        if(true == result){
            $('#inputDepartName').val("");
            $('#inputTel').val("");
            $('#inputEmail').val("");
            $('#inputDescription').val("");
            $('#inputBelongArea').val("");
            $('#needKexinReview0').attr("checked", true);
            $('#selectPrefixList').empty();
            $('#selectManagerList').empty();

            //隐藏提交取消按钮
            $('#btnManageDepartSubmit').hide();
            $('#btnManageDepartCancel').hide();
            $('#divDepartInfo').hide();
        }
    });

    /* 点击取消按钮 */
    $('#btnManageDepartCancel').click(function(){
        initDepartForm(selectDepartNode.id);

        //隐藏提交取消按钮
        $('#btnManageDepartSubmit').hide();
        $('#btnManageDepartCancel').hide();
    });
});

