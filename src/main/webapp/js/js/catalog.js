var  $hyTree, $bmTree;
var  industryTreeUrl, depTreeUrl, catalogUrl;
var  industryTreeData, depTreeData,curPre;
var curNode = null, indNode = null, deptNode = null;
var curorderName = 'cs_catalog.update_time';
var curorderSort = 'desc';
var topMenu;
var historyState = window.history.state;
var backTag = 0;
var curPageNumber;
var selectFunc = true;
// 是否是通过js设置为不选中
var isSetCancel = false;

var curSelectedNodeIndo = '';
if(historyState){
    backTag = 1;
}

var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];
var rootPath = "http://" + window.location.host + "/" + proName;

var data1stName =($("#data1stName").val()==0)?null:$("#data1stName").val();
var data2ndName =($("#data2ndName").val()==0)?null:$("#data2ndName").val();
var dataDetailName =($("#dataDetailName").val()==0)?null:$("#dataDetailName").val();
var dataPropertyName =($("#dataPropertyName").val()==0)?null:$("#dataPropertyName").val();
function setSelececValue(){
     data1stName =($("#data1stName").val()==0)?null:$("#data1stName").val();
    data2ndName =($("#data2ndName").val()==0)?null:$("#data2ndName").val();
     dataDetailName =($("#dataDetailName").val()==0)?null:$("#dataDetailName").val();
   dataPropertyName =($("#dataPropertyName").val()==0)?null:$("#dataPropertyName").val();
}


$(document).ready(function () {
    curPre = "industry";
    topMenu = $('#topmenu').val();
    industryTreeUrl = "share/industryCategory";
    depTreeUrl = "share/department";
    catalogUrl = "catalog/service/catalogs";

    var orderNameTmp = $("#orderName").val();
    if(orderNameTmp) {
        curorderName = orderNameTmp;
    }
    var orderSortTmp = $("#orderSort").val();
    if(orderSortTmp) {
        curorderSort = orderSortTmp;
    }
    if(historyState){
        var organCode = historyState.organCode;
        curPageNumber = historyState.pageNumber;
        curorderName = historyState.orderName;
    }

    if(curorderName){
        switch(curorderName){
            case "cs_catalog.update_time" :
                $("#update").parent().addClass("active");
                break;
            case "grading" :
                $("#update").parent().removeClass("active");
                $("#pf").parent().addClass("active");
                break;
            case "view" :
                $("#update").parent().removeClass("active");
                $("#view").parent().addClass("active");
                break;
        }
    }

    //给每个节点绑定浮动事件
    $("#industry").on("mouseover","ul.list-group li",
        function()
        {
            $($(this).find(".detail")[0]).css({
                "display":"inline",
                "float":"right"
            });

        });
    $("#industry").on("mouseout","ul.list-group li",
        function()
        {
            $($(this).find(".detail")[0]).css("display","none");
        });

    $.ajax({
        type: 'GET',
        url: industryTreeUrl,
        async: false,
        success: function (data) {
            if (data.result == "success") {
                industryTreeData = data.industry_list;
                if (industryTreeData && industryTreeData.length > 0) {
                    $hyTree = drawTree('industry', industryTreeData);
                }
                getCatalog( null, null, null, null, null, null, null, null,null, curorderName, curorderSort,
                    data1stName,data2ndName,dataDetailName,dataPropertyName);
            }

        },
        error: function (data) {
            dmallAjaxError();
        }
    });

    $.ajax({
        type: 'GET',
        url: depTreeUrl,
        async: false,
        success: function (data) {
            if (data.result == "success") {
                depTreeData = data.department_list;
                if (depTreeData && depTreeData.length > 0) {
                    $bmTree = drawTree('organ', depTreeData)
                }
            }
        },
        error: function (data) {
            dmallAjaxError();
        }
    });


    //获取保存在cookie中的industryId和industryCode
    var industryId, industryArr, reg = new RegExp("(^| )" + "industryId" + "=([^;]*)(;|$)");
    var industryCode, industryCodeArr,regcode = new RegExp("(^| )" + "industryCode" + "=([^;]*)(;|$)");
    var industry, industryNoArr,regNo = new RegExp("(^| )" + "industry" + "=([^;]*)(;|$)");
    if (industryArr = document.cookie.match(reg)){
        industryId = industryArr[2];
    }else{
        industryId = null;
    }
    if (industryCodeArr = document.cookie.match(regcode)){
        industryCode = industryCodeArr[2];
    }else{
        industryCode = null;
    }
    if (industryNoArr = document.cookie.match(regNo)){
        industry = industryNoArr[2];
    }else{
        industry = null;
    }
    //获取保存在cookie中的部门id用来和对应的树的id匹配，实现自动选择
    var deptCode, deptarr, deptreg = new RegExp("(^| )" + "deptCode" + "=([^;]*)(;|$)");
    if (deptarr = document.cookie.match(deptreg))
        deptCode = deptarr[2];
    else deptCode = null;
    //根据参数的不同确定哪颗树的哪个节点被选中
    if(industryId && industryId != "null"){
        var unselectNodes = $('#industry').treeview('getUnselected');
        var tnode;
        for (var i = 0; i < unselectNodes.length; i++) {
            if (unselectNodes[i].id == industryId&&unselectNodes[i].parent_code == "ZNB") {
                tnode = unselectNodes[i]
                break;
            }
        }
        $('#industry').treeview('revealNode', tnode);
        $('#industry').treeview('selectNode', tnode);
        getCatalog( tnode.parent_code, null,
            null, tnode.code, 2,
            null, null, null,
            1, curorderName, curorderSort,data1stName,data2ndName,dataDetailName,dataPropertyName);
        document.cookie = "industryId=" + null + "; path=/";
    }else if(industry && industry != "null"){
         var unselectNodes = $('#industry').treeview('getUnselected');
         var tnode;
         for (var i = 0; i < unselectNodes.length; i++) {
         if (unselectNodes[i].code == industry) {
         tnode = unselectNodes[i]
         break;
         }
         }
         $('#industry').treeview('revealNode', tnode);
         $('#industry').treeview('selectNode', tnode);

         getCatalog( null, null,
         null, tnode.code, 1,
         null, null, null,
         1, curorderName, curorderSort,data1stName,data2ndName,dataDetailName,dataPropertyName);
         document.cookie = "industry=" + null + "; path=/";
     }else if (deptCode && deptCode != 'null') {
        getdatalist(deptCode);
        document.cookie = "deptCode=" + null + "; path=/";
    }else if(organCode && organCode != null){
        var unselectNodes = $('#organ').treeview('getUnselected');
        var tnode;
        for (var i = 0; i < unselectNodes.length; i++) {
            if (unselectNodes[i].indexCode == organCode) {
                tnode = unselectNodes[i]
                break;
            }
        }

        $('#organ').treeview('revealNode', tnode);
        $('#organ').treeview('selectNode', tnode);
    } else {
        getCatalog( null, null, null, null, null, null, null, null, 1
            , curorderName, curorderSort,data1stName,data2ndName,dataDetailName,dataPropertyName);
    }

    //树的搜索功能
    var treeSearch = function (pre, tree) {
        var treedata;
        if (pre == 'industry') treedata = industryTreeData;
        if (pre == 'organ') treedata = depTreeData;
        drawTree(pre, treedata);
        var search = $('#input-search-' + pre).val();
        var pattern = toEscStr(search);
        var selectableNodes = tree.treeview('search', [pattern, {ignoreCase: false, exactMatch: false}]);
        if (search) {
            if (selectableNodes.length > 0) {
                var Nodes = [];
                for (var i = 0; i < selectableNodes.length; i++) {
                    var node = selectableNodes[i];
                    delete node.state;
                    if (node.nodes) delete node.nodes;
                    Nodes.push(node);
                }
            }
            tree = drawTree(pre, Nodes)
        } else {
            var treedata;
            if (pre == 'industry') treedata = industryTreeData;
            if (pre == 'organ') treedata = depTreeData;
            tree = drawTree(pre, treedata)
        }
    };


    $('#input-search-industry').on('keyup', function () {
        treeSearch('industry', $hyTree);
    });

    $('#input-search-organ').on('keyup', function () {
        treeSearch('organ', $bmTree);
    });

});

//获取数据目录的请求成功时执行的函数
function getCatalogSuccess(pageNumber, data) {
    var output = '';

    if (data && data.catalogList != null && data.catalogList.length>0) {
        for (var i = 0; i < data.catalogList.length; i++) {
            var catalogModel = data.catalogList[i];
            var className = "";
            if(catalogModel.resourceTypeCode == "ODPS" || catalogModel.resourceTypeCode == "RDS"
                || catalogModel.resourceTypeCode == "ADS" || catalogModel.resourceTypeCode == "VIRTUAL"){
                className = catalogModel.resourceTypeCode;
            } else{
                className = catalogModel.resourceParamType;
            }
            console.log(htmlEncode(catalogModel.resourceName));
            output = output + '<div class="col-lg-12 col-sm-12 store-list-item">' +
            '<div class="caption prod-caption a-front">' +
            '<div class="col-lg-1">' +
            '<div class="fileType type'+className+'"></div>' +
            '</div>' +
            '<div class="col-lg-11" style="line-height: 23px;">' +
            '<div class="col-lg-12 col-sm-12 text-left longText"> <strong><a href="data?id='+ catalogModel.id +'" title="' + htmlEncode(catalogModel.resourceName) + '">' + htmlEncode(catalogModel.resourceName) + '</a></strong> </div>' +
            '<div class="col-lg-12 col-sm-12 text-left" >' +
            '<div class=" col-lg-5 col-sm-5" style="padding-left: 0px;"> <a onclick=\"getdatalist(' + catalogModel.routinePowerDeptCode + ',\'' + catalogModel.resourceTypeCode + '\')\">' + catalogModel.routinePowerDeptName + '</a></div>' +
            '<div class=" col-lg-3 col-sm-3 text-right" style="padding-left: 0px;">' + catalogModel.industryName + ' </div>' +
            '<div class=" col-lg-2 col-sm-2 text-right" style="padding-left: 0px;">' + catalogModel.businessName + ' </div>' +
            '<div class=" col-lg-2 col-sm-2 text-right" style="padding-left: 0px;">' + catalogModel.update_time.substr(0, 10) + ' </div>' +
            '</div>' +
            '<div class="col-lg-12 col-sm-12 ">';

            output = output +
            '<div class="col-md-1" style="width: 120px;padding-left: 0px;padding-top: 3px;">' +
            '<span class="big_star" style="cursor:default"><span id="examplem' + catalogModel.id + '"class="big_star_index" style=" display:inline-block;"></span></span>' +
            '</div><div class=" col-lg-1 col-sm-1" style="padding-left: 0px; width: 10px;"> <span>' + catalogModel.grading.toFixed(1) + ' </span></div>' +
            ' <div class=" col-lg-9 col-sm-9"> |&nbsp;&nbsp;浏览(<span style="color: #1ece6d"> ' + catalogModel.view + ' </span>)' +
            '&nbsp;&nbsp;|&nbsp;&nbsp; 获取(<span style="color: #ff9a00" id="colection_stat_favor_' + catalogModel.id + '"> ' + catalogModel.exchange + ' </span>)' +
            '&nbsp;&nbsp;|&nbsp;&nbsp; 评论(<span style="color: #ff9a00" > ' + catalogModel.comment + ' </span>)' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        }
        $('#right_data').html(output);

        var html = fullPagination(pageNumber, data.totalPages, 'getGoodListsByPageNumber');
        $('#fullPagination').html(html);
        html = simplePagination(pageNumber, data.totalPages, 'getGoodListsByPageNumber');
        $('#simplePagination').html(html);

        if (data.catalogList && data.catalogList.length > 0) {
            for (var i = 0; i < data.catalogList.length; i++) {
                var catalog = data.catalogList[i];
                var pe = catalog.grading / 5 * 100;
                $('#examplem' + catalog.id)[0].style.width = pe + '%';//设置显示几颗星高亮
            }
        }
    } else {
        output = output + '<span>没有找到数据！</span>';
        $('#right_data').html(output);

        var html = fullPagination(pageNumber, data.totalPages, 'getGoodListsByPageNumber');
        $('#fullPagination').html(html);
        html = simplePagination(pageNumber, data.totalPages, 'getGoodListsByPageNumber');
        $('#simplePagination').html(html);
    }
}

var industrySelect = false;
var deptSelect = false;
//获取数据目录的请求函数，currentCode对应的是当前层数的节点的code属性，parentCode则为此节点父节点的属性，currentId只有第三层节点需要
function getCatalog( parentCode, catalogId,
                    currentId, currentCode, industryLevel,
                    deptId, organCode, deptLevel,
                    pageNumber, orderName, orderSort,data1stCode,data2ndCode,dataDetailCode,dataPropertyCode) {
    if (pageNumber < 1) {
        pageNumber = 1
    }
     $('#right_data').html('<img style="margin-left:315px;" src="view/img/loading32.png"/>');
     $('#fullPagination').html('');
     $('#simplePagination').html('');
    if (currentId) {
        industrySelect = true;
    }
    if (deptId) {
        deptSelect = true;
    }
    //如果是机构则直接使用tdata，行业相关的参数都置为空
    var tdata = {
        industryCode: null,
        businessCode:null,
        dataDirectoryId:null,
        industryLevel: null,
        organCode: organCode,
        deptLevel: null,
        pageNumber: pageNumber,
        orderName: orderName,
        orderSort: orderSort,
        data1stCode:data1stCode,
        data2ndCode:data2ndCode,
        dataDetailCode:dataDetailCode,
        dataPropertyCode:dataPropertyCode
    };
    //根据点击的树节点对应的层数不同，分别给请求参数赋不同的值
    if(industryLevel==1){
        tdata = {
            industryCode: currentCode,
            businessCode:null,
            dataDirectoryId:null,
            industryLevel: industryLevel,
            organCode: organCode,
            deptLevel: deptLevel,
            pageNumber: pageNumber,
            orderName: orderName,
            orderSort: orderSort,
            data1stCode:data1stCode,
            data2ndCode:data2ndCode,
            dataDetailCode:dataDetailCode,
            dataPropertyCode:dataPropertyCode
        };
    }else if(industryLevel==2){
        tdata = {
            industryCode: parentCode,
            businessCode:currentCode,
            dataDirectoryId:null,
            industryLevel: industryLevel,
            organCode: organCode,
            deptLevel: deptLevel,
            pageNumber: pageNumber,
            orderName: orderName,
            orderSort: orderSort,
            data1stCode:data1stCode,
            data2ndCode:data2ndCode,
            dataDetailCode:dataDetailCode,
            dataPropertyCode:dataPropertyCode
        };
    }else if(industryLevel == 3){
        tdata = {
            industryCode: null,
            businessCode:currentCode,
            dataDirectoryId:currentId,
            industryLevel: industryLevel,
            organCode: organCode,
            deptLevel: deptLevel,
            pageNumber: pageNumber,
            orderName: orderName,
            orderSort: orderSort,
            data1stCode:data1stCode,
            data2ndCode:data2ndCode,
            dataDetailCode:dataDetailCode,
            dataPropertyCode:dataPropertyCode
        };
    }
   if (topMenu == "dataapi") tdata.isApi = true;
    else tdata.isApi = false;

    if(backTag == 1){
        tdata = window.history.state;
        backTag = 0;
    }
    historyState = tdata;
    window.history.pushState(
        historyState,
        document.title,
        window.location.pathname+'?businessCode='+historyState.businessCode+'&catalogId='+historyState.catalogId+'&industryCode='+historyState.industryCode
        +'&industryLevel='+historyState.industryLevel+'&organCode='+historyState.organCode+'&deptLevel='+historyState.deptLevel+'&pageNumber='+historyState.pageNumber
        +'&orderName='+historyState.orderName+'&orderSort='+historyState.orderSort+'&data1stCode='+historyState.data1stCode+'&data2ndCode='+historyState.data2ndCode
        +'&dataDetailCode='+historyState.dataDetailCode+'&dataPropertyCode='+historyState.dataPropertyCode
    );
    //请求数据目录
    $.ajax({
        url: catalogUrl,
        type: "GET",
        data: tdata,
        dataType: "json",
        success: function (data) {
            if (!industrySelect && !deptSelect) {
                $('#titleSelect').html('');
                $('.type_selected').hide();
            }
                getCatalogSuccess(pageNumber, data);
        },
        error: function (data) {
            dmallAjaxError();
        }
    })
}

function getCatalogByIndustry(businessCode, catalogId, industryId, industryCode, industryLevel, pageNumber, orderName, orderSort,data1stName,data2ndName,dataDetailName,dataPropertyName) {
    getCatalog( businessCode, catalogId, industryId, industryCode, industryLevel, null, null, null, pageNumber, orderName, orderSort,data1stName,data2ndName,dataDetailName,dataPropertyName);
}

function getCatalogByDept(id, code, level, pageNumber, orderName, orderSort,data1stName,data2ndName,dataDetailName,dataPropertyName) {
    getCatalog( null, null, null, null, null, id, code, level, pageNumber, orderName, orderSort,data1stName,data2ndName,dataDetailName,dataPropertyName);
}

function getGoodListsByPageNumber(pageNumber, orderName, orderSort,data1stName,data2ndName,dataDetailName,dataPropertyName) {
    if (!orderName) orderName = curorderName;
    if (!orderSort) orderSort = curorderSort;
    var myTab = $($('#myTab')[0].children);
    var curli;
    for (var i = 0; i < myTab.length; i++) {
        li = myTab[i];
        if ($(li).hasClass('active'))
            curli = li;
    }

    if (pageNumber < 1) {
        pageNumber = 1
    }
    if (curNode) {
        if (curli.innerText == "组织机构") {
            getCatalogByDept(curNode.id, curNode.code, curNode.level, pageNumber, orderName, orderSort,data1stName,data2ndName,dataDetailName,dataPropertyName);
        } else if (curli.innerText == "行业类别") {
            getCatalogByIndustry(null,curNode.parent_code,curNode.id, curNode.code, curNode.level, pageNumber, orderName, orderSort,data1stName,data2ndName,dataDetailName,dataPropertyName);
        }
    } else {
        getCatalog( null, null, null, null, null, null, null, null, pageNumber, orderName, orderSort,data1stName,data2ndName,dataDetailName,dataPropertyName);
    }
}

//评分排序
function pfSort(el) {
    for (var i = 0; i < $(el).parent()[0].children.length; i++) {
        $($(el).parent()[0].children[i]).removeClass('active')
    }
    $(el).addClass('active');
    var curpager = 1;
    curorderName = 'grading';
    curorderSort = 'desc';
    setSelececValue();
    getGoodListsByPageNumber(curpager, curorderName, curorderSort,data1stName,data2ndName,dataDetailName,dataPropertyName);
}

//浏览量排序
function viewSort(el) {
    for (var i = 0; i < $(el).parent()[0].children.length; i++) {
        $($(el).parent()[0].children[i]).removeClass('active')
    }
    $(el).addClass('active');
    var curpager = 1;
    curorderName = 'view';
    curorderSort = 'desc';
    setSelececValue();
    getGoodListsByPageNumber(curpager, curorderName, curorderSort,data1stName,data2ndName,dataDetailName,dataPropertyName);
}

//更新时间
function updateSort(el) {
    for (var i = 0; i < $(el).parent()[0].children.length; i++) {
        $($(el).parent()[0].children[i]).removeClass('active')
    }
    $(el).addClass('active')
    var curpager = 1;
    curorderName = 'cs_catalog.update_time';
    curorderSort = 'desc';
    setSelececValue();
    getGoodListsByPageNumber(curpager, curorderName, curorderSort,data1stName,data2ndName,dataDetailName,dataPropertyName);
}

function industrynodeUnselect(nodeId) {
    curNode = null;
    isSetCancel = true;
    $hyTree.treeview('unselectNode', [nodeId]);
    $('#titleSelect').html('');
    $('.type_selected').hide();
    setSelececValue();

    getGoodListsByPageNumber(1, curorderName, curorderSort,data1stName,data2ndName,dataDetailName,dataPropertyName);
}
function deptnodeUnselect(nodeId) {
    curNode = null;
    isSetCancel = true;
    $bmTree.treeview('unselectNode', [nodeId]);
    $('#titleSelect').html('');
    $('.type_selected').hide();
    setSelececValue();
    getGoodListsByPageNumber(1, curorderName, curorderSort,data1stName,data2ndName,dataDetailName,dataPropertyName);
}

//画树
function drawTree(pre, treeData) {
    var tree = $('#' + pre).treeview({
        data: treeData,
        levels: 2,
        searchResultColor: "black",
        selectedBackColor: "#C7E7FE",
        selectedColor: "#55A0FE",
        onNodeSelected: function (event, node) {

            if(node.level == 1 || node.level == 2){
                curSelectedNodeIndo = pre + "_" + node.code;
            }else if(node.level == 3 ){
                curSelectedNodeIndo = pre + "_" + node.id;
            }else{
                curSelectedNodeIndo = pre + "_" + node.code;
            }
            if (pre == 'industry') {indNode = node;deptNode=null}
            if (pre == 'organ') {deptNode = node;indNode=null}
            curNode = node;
            $('.type_selected').show();
            if(node.level == 3){

                var title = '<li style="margin-left: -30px; float: none;"><a>' + node.text.replace(/<\/?.+?>/g,"")  + '<i class="close_min s_close" onclick="' + pre + 'nodeUnselect(' + node.nodeId + ')"></i></a></li>'
            }else{
                if(pre == "organ"){

                    var title = '<li style="margin-left: -30px; float: none;"><a>' + node.text + '<i class="close_min s_close" onclick="' + "dept" + 'nodeUnselect(' + node.nodeId + ')"></i></a></li>'
                }else{

                    var title = '<li style="margin-left: -30px; float: none;"><a>' + node.text + '<i class="close_min s_close" onclick="' + pre + 'nodeUnselect(' + node.nodeId + ')"></i></a></li>'
                }

            }
            $('#titleSelect').html(title);
            var page;
            if(curPageNumber != null ){
                page = curPageNumber
            }else{
                page = 1;
            }
            isSetCancel = false;
            curPre = pre;
             if (pre == 'industry') {
                selectFunc = true;
                setSelececValue();
                getCatalogByIndustry(node.parent_code,null,node.id, node.code, node.level, page, curorderName, curorderSort,data1stName,data2ndName,dataDetailName,dataPropertyName);
            } else if (pre == 'organ') {
                 setSelececValue();
                getCatalogByDept(node.id, node.code, node.level, page, curorderName, curorderSort,data1stName,data2ndName,dataDetailName,dataPropertyName);
            }
        },
        onNodeUnselected:function(event, node){
            setSelececValue();
            var temp = curSelectedNodeIndo;
            setTimeout(function () {
                if (temp == curSelectedNodeIndo && curPre == pre) {
                    if (isSetCancel == false) {
                        $('#titleSelect').html('');
                        if(pre == "industry" || pre == "business" || pre == "datadirectory" || pre == "catalog"){
                            getCatalogByIndustry(null,null,null, null, node.level, 1, curorderName, curorderSort,data1stName,data2ndName,dataDetailName,dataPropertyName);
                        }else{
                            getCatalogByDept(null, null, null, 1, curorderName, curorderSort,data1stName,data2ndName,dataDetailName,dataPropertyName);
                        }
                    }
                }
            }, 300);
        }
    });
    return tree;
}
function cldrawTree(pre) {
    var treedata;

    //是否执行
    var cancelflag = true;
    if (indNode) {
        cancelflag = false;
        industrynodeUnselect(indNode.nodeId);
    }
    if (deptNode) {
        cancelflag = false;
        deptnodeUnselect(deptNode.nodeId);
    }
    curNode = null;
     setSelececValue();
     if(cancelflag){
         getCatalog( null, null,
             null, null, null,
             null, null, null,
             null, null, null,data1stName,data2ndName,dataDetailName,dataPropertyName);
     }

}



function expandAll(el, pre) {
    if(el.firstChild.id=="plus"){
        $(el).html('<img id="minus" src="view/img/collapse-all.png">');
        el.title = "收起树";
        $('#' + pre).treeview('expandAll');
    }else{
       $(el).html('<img id="plus" src="view/img/expand-all.png">');
       el.title = "展开树";
       $('#' + pre).treeview('collapseAll');
    }
}
//根据传入的机构id选中对应的组织机构几点
function getdatalist(deptCode, resourceTypeCode) {
    var myTab = $($('#myTab')[0].children);
    for (var i = 0; i < myTab.length; i++) {
        li = myTab[i];
        if ($(li).hasClass('active'))
            $(li).removeClass('active');
    }

    document.getElementById("bmLiTab").click();

    var unselectNodes = $('#organ').treeview('getUnselected');
    var tnode;
    for (var i = 0; i < unselectNodes.length; i++) {
        if (unselectNodes[i].code == deptCode) {
            tnode = unselectNodes[i]
            break;
        }
    }
    $('#organ').treeview('revealNode', tnode);
    $('#organ').treeview('selectNode', tnode);
}
//数据目录的详情链接
function showDetail(detailId){
    window.location.href=rootPath+"/directory/datadirectory_detail/direcroty/?datadirectoryid="+detailId;
};

//数据资源要素一级分类
var $data1stName = $('#data1stName');
$.get(
    rootPath+"/code/data1st",
    {},
    function(data, status){
        if(data.result != "success"){
            dmallError(data.result);
        }else {
            var data1stCodeList = data.data1stCodeList;
            var html = '<option value="0">全部</option>';
            for(var i = 0; i < data1stCodeList.length; i++){
                html += '<option value="' + data1stCodeList[i].code + '">' + data1stCodeList[i].code + '&nbsp;&nbsp;'+ data1stCodeList[i].name + '</option>';
            }
            $data1stName.html(html);
        }
    },
    "json"
);

//数据资源要素二级分类
var $data2ndName = $('#data2ndName');
$.get(
    rootPath+"/code/data2nd",
    {},
    function(data, status){
        if(data.result != "success"){
            dmallError(data.result);
        }else {
            var data2ndCodeList = data.data2ndCodeList;
            var html = '<option value="0">全部</option>';
            for(var i = 0; i < data2ndCodeList.length; i++){

                html += '<option value="' + data2ndCodeList[i].code + '">' + data2ndCodeList[i].code + '&nbsp;&nbsp;'+ data2ndCodeList[i].name + '</option>';

            }
            $data2ndName.html(html);
        }
    },
    "json"
);

//数据资源要素细目分类
var $dataDetailName = $('#dataDetailName');
$.get(
    rootPath+"/code/dataDetails",
    {},
    function(data, status){
        if(data.result != "success"){
            dmallError(data.result);
        }else {
            var dataDetailCodeList = data.dataDetailCodeList;
            var html = '<option value="0">全部</option>';
            for(var i = 0; i < dataDetailCodeList.length; i++){

                html += '<option value="' + dataDetailCodeList[i].code + '">' + dataDetailCodeList[i].code + '&nbsp;&nbsp;'+ dataDetailCodeList[i].name + '</option>';

            }
            $dataDetailName.html(html);
        }
    },
    "json"
);

//数据资源属性分类
var $dataPropertyName = $('#dataPropertyName');
$.get(
    rootPath+"/code/dataProperties",
    {},
    function(data, status){
        if(data.result != "success"){
            dmallError(data.result);
        }else {
            var dataPropertyCodeList = data.dataPropertyCodeList;
            var html = '<option value="0">全部</option>';
            for(var i = 0; i < dataPropertyCodeList.length; i++){

                html += '<option value="' + dataPropertyCodeList[i].code + '">' + dataPropertyCodeList[i].code + '&nbsp;&nbsp;'+ dataPropertyCodeList[i].name + '</option>';
            }
            $dataPropertyName.html(html);
        }
    },
    "json"
);

//数据资源形态类型
var $resourceTypeName = $('#resourceTypeName');
$.get(
    rootPath+"/code/resourceType",
    {},
    function(data, status){
        if(data.result != "success"){
            dmallError(data.result);
        }else {
            var resourceTypeList = data.resourceTypeList;
            var html = '<option value="0">全部</option>';
            for(var i = 0; i < resourceTypeList.length; i++){

                html += '<option value="' + resourceTypeList[i].code + '">' + resourceTypeList[i].name + '</option>';

            }
            $resourceTypeName.html(html);
        }
    },
    "json"
);

function getCatalogs(){

     setSelececValue();
    var curpager = 1;

    getGoodListsByPageNumber(curpager, curorderName, curorderSort,data1stName,data2ndName,dataDetailName,dataPropertyName);
}