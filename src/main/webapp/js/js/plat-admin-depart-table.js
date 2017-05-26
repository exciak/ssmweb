/**
 * Created by pcd on 2016/1/5.
 */
var preventDefaultFlag = false;
var selectDepart = {};
var operate = "";
var bHideDepartFlag = true;
var bHideAreaFlag = true;
var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];
var rootPath = "http://" + window.location.host + "/" + proName;

$(document).ready(function () {
    var departTreeData = [];
    var departRootNode = {};
    var $departTreeView = {};
    var selectDepartNode = {};

    var areaTreeData = [];
    var $areaTreeView = {};
    var selectAreaNode = {};
    //清除按钮事件绑定
    $('#btn_clear').click(function(){
        $('#inputFilterDepartmentName').val("");
        $('#inputFilterDepartmentArea').val("");
    });

    //点击文本框显示选择树
    $('#inputBelongDepart').click(function(){
        bHideDepartFlag = false;
        if($("#departSelectDiv").is(":hidden")){
            $("#departSelectDiv").show();
        }else{
            $("#departSelectDiv").hide();
        };
    });

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
    //getDepartTreeDataInit();
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
    var searchDepartTreeView = function (e) {
        var string = $('#inputBelongDepart').val();
        var pattern = toEscStr(string);
        var options = {
            revealResults: true
        };
        var results = $departTreeView.treeview('search', [pattern, options]);
    }

    $('#inputBelongDepart').on('keyup', searchDepartTreeView);

    function getNodeInDepartTree(textName){
        var pattern = toEscStr(textName);
        var options = {
            exactMatch: true,
            revealResults: true
        };

        var results = $departTreeView.treeview('search', [pattern, options]);

        if(results.length != 0){
            return results[0];
        }else{
            return null;
        }
    };

    function createDepartTreeView(treeData) {
        var departTreeView = $('#departSelectTreeView').treeview({
            data: treeData,
            expandIcon: 'glyphicon glyphicon-plus',
            collapseIcon: 'glyphicon glyphicon-minus',
            onNodeSelected: function (event, node) {
                selectDepartNode = node;
                bHideDepartFlag = false;

                //点击文本框显示选择树
                $('#inputBelongDepart').val(selectDepartNode.text);
                $("#inputBelongDepart").removeClass("border-red");
                $(".error2").hide();

                //先隐藏选择树
                $('#departSelectDiv').hide();
            },
            onNodeCollapsed: function(event, node) {
                bHideDepartFlag = false;
            },
            onNodeExpanded: function (event, node) {
                bHideDepartFlag = false;
            }
        });

        return departTreeView;
    }

    /*    区域选择树*/
    //getAreaTreeDataInit();

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

                //点击文本框显示选择树
                $('#inputBelongArea').val(selectAreaNode.text);
                $("#inputBelongArea").removeClass("border-red");
                $(".error3").hide();

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

    //选择部门
    $('#btnAddDepartCommit').click(function(){
        selectDepart.code = selectDepartNode.code;
        selectDepart.name = selectDepartNode.text;
        $('#inputBelongDepart').val(selectDepart.name);
    });

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
        var count = List.length;
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

    // 弹出框提交
    $('#btnManagerCommit').click(function() {
        var $selectShow = $('#selectManagerList');
        var $listSelected = $('#selectedUserList');
        var count = $('#selectedUserList option').length;
        $selectShow.empty();
        for (var i=0; i<count; i++){
            var optionSrc = $listSelected.get(0).options[i];
            var newOption = new Option(optionSrc.text, optionSrc.value);
            $selectShow.append(newOption);
        }
    });
    // 打开对话框
/*    处理添加前段码*/
    /* 管理listAll,如果无元素，增加说明”无可选前段码“ */
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
                    /* 获取已选择的前缀码 */
                    var selectedIdList = [];
                    var $listSelected = $('#selectedPrefixList');
                    var count = $('#selectedPrefixList option').length;
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

    // 弹出框中选取前段码
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
    var createDepartment = function (){
    var areaId;
    var parentCode;
    var prefixIdList = [];
    var managerList = [];

    areaId = selectAreaNode.id;
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
            data:{
                name:$('#inputDepartName').val(),
                areaId: areaId,
                parentCode: parentCode,
                prefixIdList:prefixIdList,
                telephone: $('#inputTel').val(),
                email: $('#inputEmail').val(),
                description: $('#inputDescription').val(),
                managerList:managerList,
                needKexinReview:$("input[name='needKexinReview']").filter(":checked").val()
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    location.href = "departTable";
                } else {
                    dmallError(data.result);
                    return;
                }
            },
            error: function () {
                dmallAjaxError();
            }
         });
    };

    var modifyDepartment = function (){
        var managerList = [];
        var departId = $('#inputHiddenDepartId').val();

        var managerCount = $('#selectManagerList option').length;
        for(var i=0; i< managerCount; i++){
            managerList.push($('#selectManagerList').get(0).options[i].value);
        }
        console.log($("input[name='isReportSuperior']").filter(":checked").val());
        console.log($("input[name='needKexinReview']").filter(":checked").val());
        //去服务端新增
        $.ajax({
            url:"../department/modifydept",
            type:"POST",
            data:{
                name:$('#inputDepartName').val(),
                deptId:departId,
                telephone: $('#inputTel').val(),
                email: $('#inputEmail').val(),
                description: $('#inputDescription').val(),
                managerList:managerList,
                needKexinReview: $("input[name='needKexinReview']").filter(":checked").val(),
                isReportSuperior: $("input[name='isReportSuperior']").filter(":checked").val()
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    location.href = "departTable";
                } else {
                    dmallError(data.result);
                    //location.href = "departTable";
                    return;
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });

    };

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



    /*组织电话栏获取焦距*/
    $("#inputTel").focus(function () {
        var string = $("#inputTel").val();
        var ret = inputTelephone(string);
        if(!ret)
        {
            $("#inputTel").removeClass("border-red");
            $(".error4").hide();
        }
    });

    /*组织电话栏失去焦距*/
    function checkTel(){
        var string = $("#inputTel").val();
        var ret = inputTelephone(string);
        if(!ret&&string!="")
        {
            $("#inputTel").addClass("border-red");
            $(".error4").html("*请输入正确的电话号码");
            $(".error4").css("display", "block");
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
            $(".error5").hide();
        }
    });

    /*组织邮箱栏失去焦距*/
    function checkEmail(){
        var string = $("#inputEmail").val();
        var ret = inputEmail(string);
        if(!ret&&string!="")
        {
            $("#inputEmail").addClass("border-red");
            $(".error5").html("*请输入正确的邮箱地址");
            $(".error5").css("display", "block");
            preventDefaultFlag = true;
        }
    };
    $("#inputEmail").blur(function(){
        checkEmail();
    });

    function checkall(operate){
        checkDeptName();

        if(operate == "create"){
        }

        checkEmail();
        checkTel();
    }

    //创建或修改部门提交
    $('#btnOperateDepartSubmit').click(function(){
        preventDefaultFlag = false;
        console.log(preventDefaultFlag);
        checkall(operate);
        if (preventDefaultFlag == true) {
            dmallError("参数有误！");

            return false;
        }

        if(operate == "create"){
            createDepartmentSub();
        }else if(operate == "modify"){
            modifyDepartment();
        }
    });

    //创建或修改部门取消
    $('#btnOperateDepartCancel').click(function(){
        $('#departManageInfo').hide();
        $('#departListInfo').show();
    });


    var departDelete = function () {

        var departId = $('#inputHiddenDepartId').val();

        //去服务端删除节点
        $.ajax({
            url:"../department/del",
            type:"POST",
            data:{
                deptId: departId
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    location.href = "departTable";
                } else {
                    dmallError(data.result);
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });
    }

    //删除部门
    $('#btnDelDepartSubmit').click(function(){
        departDelete();
    });

});

function clearAllErrInfo(){
    $("#inputDepartName").removeClass("border-red");
    $(".error1").hide()
    $("#inputBelongDepart").removeClass("border-red");
    $(".error2").hide()
    $("#inputBelongArea").removeClass("border-red");
    $(".error3").hide()
    $("#inputTel").removeClass("border-red");
    $(".error4").hide()
    $("#inputEmail").removeClass("border-red");
    $(".error5").hide()
};

//选择部门弹出框
function addDepart() {
    $('#addDepartModal').modal({backdrop: 'static', keyboard: false});
}

//创建弹出框
function createDepart() {
    operate = "create";
    clearAllErrInfo();
    $('#inputDepartName').val("");
    $('#inputTel').val("");
    $('#inputEmail').val("");
    $('#inputDescription').val("");
    $('#inputBelongDepart').val("");
    $('#inputBelongArea').val("");
    $('#selectPrefixList').empty();
    $('#selectManagerList').empty();
    $('#needKexinReview0').attr("checked", true);
    $('#isReportSuperior0').attr("checked", true);

    $('#departListInfo').hide();
    $('#departManageInfo').show();
    $('#departBelongDiv').show();
    $('#visit').hide();
}

//修改
function modifyDepart(obj, id, pageNumber) {
    var departDetail = {};
    var departList = [];
    var areaDetail = {};
    var organDetail = {};
    var departId = id;
    var creator ={};

    operate = "modify";
    clearAllErrInfo();
    $('#inputHiddenDepartId').val(id);
    //$('#isNeedPaperReview').hide();
    //去后端获取前段码详情
    $.ajax({
        type: 'GET',
        url: "../department/getDepartById?departId="+departId,
        async: false,
        success: function (data) {
            if(data.result == "success"){
                departDetail = data.departDetail;
                console.log(departDetail);
                if(null != departDetail.creator){
                    creator = departDetail.creator;
                }
                if(null != departDetail.departmentManagerList){
                    departList = departDetail.departmentManagerList;
                }

                if(null != departDetail.areaCodeEntity){
                    areaDetail = departDetail.areaCodeEntity;

                }
                if(null != departDetail.organCodeEntity){
                    organDetail = departDetail.organCodeEntity;
                    console.log(organDetail.name);
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
    $('#inputAreaId').val(areaDetail.code);
    $('#ongCodeName').val(organDetail.code);
    $('#uDate').val(getSmpFormatDateByLong(departDetail.update_time,true));
    $('#crDate').val(getSmpFormatDateByLong(departDetail.create_time,true));
    $('#cPerson').val(creator.user_name);
    if(departDetail.needKexinReview == 0) {
        $('#needKexinReview0').attr("checked", true);
        $('#needKexinReview1').attr("checked", false);
    } else {
        $('#needKexinReview0').attr("checked", false);
        $('#needKexinReview1').attr("checked", true);
    }

    if(departDetail.isReportSuperior == 0) {
        $('#isReportSuperior0').attr("checked", true);
        $('#isReportSuperior1').attr("checked", false);
    } else {
        $('#isReportSuperior0').attr("checked", false);
        $('#isReportSuperior1').attr("checked", true);
    }

    if(null != areaDetail){
        $('#inputBelongArea').val(areaDetail.name);
    }


    $('#selectManagerList').empty();
    if(departList.length != 0){
        for (var i=0; i<departList.length; i++){
            var newOption = new Option(departList[i].user_name, departList[i].userId);
            $('#selectManagerList').append(newOption);
        }
    }

    $('#departListInfo').hide();
    $('#departManageInfo').show();
    $('#departBelongDiv').hide();
}


//删除
function deleteDepart(obj, id, pageNumber) {

    $('#inputHiddenDepartId').val(id);
    $('#deleteDepartModal').modal({backdrop: 'static', keyboard: false});
}

function detailDepart(obj, id, pageNumber) {

    var departDetail = {};
    var departList = [];
    var areaDetail = {};
    var departId = id;

    $('#inputHiddenDepartId').val(id);

    //去后端获取前段码详情
    $.ajax({
        type: 'GET',
        url: "../department/getDepartById?departId="+departId,
        async: false,
        success: function (data) {
            if(data.result == "success"){
                departDetail = data.departDetail;
                if(null != departDetail.departmentManagerList){
                    departList = departDetail.departmentManagerList;
                }

                if(null != departDetail.areaCodeEntity){
                    areaDetail = departDetail.areaCodeEntity;
                }
            }
        },
        error: function () {
            dmallAjaxError();
        }
    })

    $('#inputDepartNameDetail').val(departDetail.name);
    $('#inputAreaDetail').val(departDetail.organCodeEntity.name +" "+departDetail.organCodeEntity.code);
    $('#inputTelDetail').val(departDetail.telephone);
    $('#inputEmailDetail').val(departDetail.email);
    $('#inputDescriptionDetail').val(departDetail.description);
    $('#managerListDetail').val(departDetail.administrator);
    $('#inputBelongAreaDetail').val(areaDetail.name);
    if (departDetail.needKexinReview == 0) {
        $('#needKexinReviewDetail0').attr("checked", true);
        $('#needKexinReviewDetail1').attr("checked", false);
    } else {
        $('#needKexinReviewDetail0').attr("checked", false);
        $('#needKexinReviewDetail1').attr("checked", true);
    }


    $('#selectManagerListDetail').empty();
    if(departList.length != 0){
        for (var i=0; i<departList.length; i++){
            var newOption = new Option(departList[i].user_name, departList[i].userId);
            $('#selectManagerListDetail').append(newOption);
        }
    }

    $('#departDetailModal').modal({backdrop: 'static', keyboard: false});


}

/*
var $inputBelongDepartR = $('#inputBelongDepartR');

$.get(
    rootPath + "/organ/organCodes",
    {},
    function(data, status){
        if(data.result != "success"){
            dmallError(data.result);
        }else {
            var organCodeList = data.organCodeList;
            console.log(data);
            var html = "";
            for(var i = 0; i < organCodeList.length; i++){
                html += '<option value="' + organCodeList[i].code + '">' + organCodeList[i].code + '&nbsp;&nbsp;'+ organCodeList[i].name + '</option>';
            }
            $inputBelongDepartR.append(html);
        }
    },
    "json"
);
*/

//创建部门提交
var createDepartmentSub = function (){

    var managerList = [];

    var managerCount = $('#selectManagerList option').length;
    for(var i=0; i< managerCount; i++){
        managerList.push($('#selectManagerList').get(0).options[i].value);
    }
    //去服务端新增
    if($('#inputDepartName').val()==""||$('#inputDepartName').val()==undefined||$('#inputDepartName').val()==null){
        dmallError("部门名称不能为空！");
    }else if($('#provideDeptCode').val()==undefined||$('#provideDeptCode').val()==""){
        dmallError("请选择所属机构!");
    }else{
        $.ajax({
            url:"../department/createdept",
            type:"POST",
            data:{
                name:$('#inputDepartName').val(),
                organCode:$("#provideDeptCode").val(),
                telephone: $('#inputTel').val(),
                email: $('#inputEmail').val(),
                description: $('#inputDescription').val(),
                managerList:managerList,
                needKexinReview:$("input[name='needKexinReview']").filter(":checked").val(),
                isReportSuperior:$("input[name='isReportSuperior']").filter(":checked").val()
            },
            dataType:"json",
            success:function(data){
                if (data.result === "success") {
                    location.href = "departTable";
                } else {
                    dmallError(data.result);
                    return;
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });
    }


};
//扩展Date的format方法
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
/**
 *转换日期对象为日期字符串
 * @param date 日期对象
 * @param isFull 是否为完整的日期数据,
 * 为true时, 格式如"2000-03-05 01:05:04"
 * 为false时, 格式如 "2000-03-05"
 * @return 符合要求的日期字符串
 */
function getSmpFormatDate(date, isFull) {
    var pattern = "";
    if (isFull == true || isFull == undefined) {
        pattern = "yyyy-MM-dd";
    } else {
        pattern = "yyyy-MM-dd";
    }
    return getFormatDate(date, pattern);
}
/**
 *转换long值为日期字符串
 * @param l long值
 * @param isFull 是否为完整的日期数据,
 * 为true时, 格式如"2000-03-05 01:05:04"
 * 为false时, 格式如 "2000-03-05"
 * @return 符合要求的日期字符串
 */
function getSmpFormatDateByLong(l, isFull) {
    return getSmpFormatDate(new Date(l), isFull);
}
/**
 *转换日期对象为日期字符串
 * @param l long值
 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
 * @return 符合要求的日期字符串
 */
function getFormatDate(date, pattern) {
    if (date == undefined) {
        date = new Date();
    }
    if (pattern == undefined) {
        pattern = "yyyy-MM-dd";
    }
    return date.format(pattern);
}

//数据资源提供单位
var $provideDeptName = $('#provideDeptName');
var provideDeptCode = $('#provideDeptCode').val();
var provideDeptName = $provideDeptName.val();
$('#chooseProvideDept').click(function () {
    $provideDeptName.removeClass("errorC");
    $('.errorProvideDept').hide();
    openProvideDept();
});

function openProvideDept() {
    //打开模态框
    $('#addProvideDept').modal({backdrop: 'static', keyboard: false});
    /*数据资源提供单位*/
    getProvideDeptList();
}

//获取数据资源提供单位
var pageNum = 1;
var pageSize = 7;
var pages = 0;
var $provideDeptTree;
function getProvideDeptList() {
    $.get(rootPath + "/organ/organCodes/tree", {},
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                $provideDeptTree = $('#list-provideDept').treeview({
                    data: data.organCodeList,
                    onNodeSelected: function (event, node) {
                        var $provideDeptList = $("#provideDeptName");
                        $provideDeptList.data("provideDeptCode", node.code);
                        $provideDeptList.data("provideDeptName", node.text);
                    }
                });
                var list = $('#list-provideDept').children().children();
                pages =Math.ceil(list.length/pageSize);
                for (var i=0; i < list.length; i++){
                    for (var j=0; j<pages; j++){

                    }
                }
            } else {
                dmallError("获取数据资源提供单位列表失败");
            }
        },
        "json"
    );
}
//数据资源提供单位提交
$("#provideDept_btn_commit").click(function () {
    provideDeptCode = $provideDeptName.data('provideDeptCode');
    provideDeptName = $provideDeptName.data('provideDeptName');
    $("#provideDeptCode").val(provideDeptCode);
    $("#provideDeptName").val(provideDeptName);
});
//数据资源提供单位验证
function checkProvideDeptNameValue() {
    if($('#provideDeptName').val()){
        return false;
    }else {
        checkNotBlank($('#provideDeptName'),$('.errorProvideDept'),'*请选择数据资源提供单位');
        return true;
    }
}
//非空验证
function checkNotBlank($select,$errorClass,errorMsg){
    var str = $select.val();
    if (str == "") {
        $select.addClass("errorC");
        $errorClass.html(errorMsg);
        $errorClass.css("display", "block");
        return true;
    } else {
        $select.removeClass("errorC");
        $errorClass.hide();
        return false;
    }
}


