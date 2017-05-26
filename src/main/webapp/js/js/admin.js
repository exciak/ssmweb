/**
 * Created by lixy on 2016/2/18.
 */
var $hyTree, $bmTree;
var industryTreeUrl, depTreeUrl;
var industryTreeData, depTreeData;
var curNode, indNode, deptNode, curPre;
// 是否是通过js设置为不选中
var isSetCancel = false;
var curSelectedNodeIndo = '';
var trendYearValue, trendMonthValue;

var topMenu;
$(document).ready(function () {
    topMenu = $('#topmenu').val();
    industryTreeUrl = "share/industryCategory";
    depTreeUrl = "share/department";

    // 默认类型
    curPre = "industry";

    /*横向菜单选择*/
    $("#allQuery").attr("href", "index?isApi=false");
    $("#apiQuery").attr("href", "index?isApi=true");

    if ("true" == $("#isApi").val()) {
        $("#allQuery").removeClass("a-selected");
        $("#apiQuery").addClass("a-selected");
    } else {
        $("#allQuery").addClass("a-selected");
        $("#apiQuery").removeClass("a-selected");
    }

    var date = new Date;
    trendYearValue = date.getFullYear();
    trendMonthValue = date.getMonth() + 1;
    var trendYearOption = $("<option>").val(trendYearValue).text(trendYearValue).attr("selected", true);
    $("#trendYear").append(trendYearOption);
    var trendMonthOption = $("<option>").val(trendMonthValue).text(trendMonthValue).attr("selected", true);
    $("#trendMonth").append(trendMonthOption);

    var orgId = null;
    if("true" == $("#isAdmin").val()) {
        orgId = null;
    } else {
        $("#bmLi").css("display", "none");
        $("#bm1").css("display", "none");
        orgId = $("#orgId").val();
    }

    $.ajax({
        type: 'GET',
        data: {
            isApi: $("#isApi").val(),
            orgId: orgId
        },
        url: industryTreeUrl,
        success: function (data) {
            if (data.result == "success") {
                industryTreeData = data.industry_list;
                if (industryTreeData && industryTreeData.length > 0) {
                    $hyTree = drawTree('industry', industryTreeData);
                    
                }

              // $("#industry ul.list-group li span").click();
                /*$("li").live("mouseover",
                    function()
                    {
                        $($(this).find(".detail")[0]).css({
                            "display":"inline",
                            "float":"right",
                        });
                    }
                ).live("mouseout",
                    function()
                    {
                        $($(this).find(".detail")[0]).css("display","none");
                    }
                );*/
            }
        },
        error: function () {
            dmallAjaxError();
        }
    });

    if("true" == $("#isAdmin").val()) {
        $.ajax({
            type: 'GET',
            //data: {isApi: $("#isApi").val()},
            url: depTreeUrl,
            async: false,
            success: function (data) {
                if (data.result == "success") {
                    depTreeData = data.department_list;
                    if (depTreeData && depTreeData.length > 0) {
                        $bmTree = drawTree('organ', depTreeData)
                    }
                    //$("#organ ul.list-group li span").click();
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });
    }


    var deptId, deptarr, deptreg = new RegExp("(^| )" + "deptId" + "=([^;]*)(;|$)");
    if (deptarr = document.cookie.match(deptreg))
        deptId = deptarr[2];
    else deptId = null;


    if (deptId && deptId != 'null') {
        getdatalist(deptId);
        document.cookie = "deptId=" + null + "; path=/";
    }
    else {
        getCatalog(null, null, null, null, null, null);
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

function getCatalogSuccess(dataType, data) {
    var output = '';

    if (data && data.result == "success") {
        if("amount" == dataType) {
            if (0 == data.total) {
                data.result_title = ["当前资源"];
                data.result_list = [{value: 0, name: '当前资源'}];
            }
            var myChart = echarts.init(document.getElementById('totalAmount'));
            initPieChart(data, myChart, "资源目录数量统计", "总数量：" + data.total, "暂无资源目录");
        } else if("exchange" == dataType) {
            if(0 == data.total) {
                data.result_title = ["当前资源"];
                data.result_list = [{value: 0, name: '当前资源'}];
            }
            var myChart = echarts.init(document.getElementById('exchangeAmount'));
            initPieChart(data, myChart, "资源交换次数统计", "总数量：" + data.total, "暂无交换记录");
        } else if("overall" == dataType) {
            var myChart = echarts.init(document.getElementById('overallAmount'));


                initTotalBarChart(data, myChart, "资源使用情况统计");


                //initDetailBarChart(data, myChart, "资源使用情况统计");

        } else if ("trend" == dataType) {

            // 初始化年度和月度下拉框
            var $trendYear = $("#trendYear");
            $trendYear.empty();
            for(var i = 0; i < data.year_list.length; i++) {
                var optionItem = $("<option>").val(data.year_list[i]).text(data.year_list[i]);
                if(data.trendYear == data.year_list[i]) {
                    optionItem.attr("selected", true);
                }
                $trendYear.append(optionItem);
            }
            var $trendMonth = $("#trendMonth");
            $trendMonth.empty();
            for (var i = 0; i < data.month_list.length; i++) {
                var optionItem = $("<option>").val(data.month_list[i]).text(data.month_list[i]);
                if (data.trendMonth == data.month_list[i]) {
                    optionItem.attr("selected", true);
                }
                $trendMonth.append(optionItem);
            }

            var myChart = echarts.init(document.getElementById('trendAmount'));
            initTrendChart(data, myChart, "资源访问量统计");
        }

    } else {
        output = output + '<span>没有找到数据！</span>';
        $('#right_data').html(output)
    }
}

function getCatalog(pre,datadirectoryId,businessCode,industryCode,organCode) {
    $('#right_data').html('<img style="margin-left:315px;" src="view/img/loading32.png"/>');
    $('#listFormc').html('');
    $('#uppag').html('');

    // 资源数量统计
    getTotalStat(pre,datadirectoryId,businessCode,industryCode,organCode);
    // 资源交换数量统计
    getExchangeStat(pre,datadirectoryId,businessCode,industryCode,organCode);

    // 资源访问量统计
    getTrendStat(pre,datadirectoryId,businessCode,industryCode,organCode);

    // 资源使用情况统计
    getOverallStat(pre,datadirectoryId,businessCode,industryCode,organCode);
}

function getTrendStat(pre,datadirectoryId,businessCode,industryCode,organCode) {
    var tdata = {
        directoryId:datadirectoryId,
        businessCode:businessCode,
        industryCode:industryCode,
        organCode:organCode,
        checkedType: pre,
        isApi: $("#isApi").val(),
        trendYear: $("#trendYear")[0].value,
        trendMonth: $("#trendMonth")[0].value
    };

    $.ajax({
        url: "index/stats/trend",
        type: "GET",
        data: tdata,
        dataType: "json",
        success: function (data) {

            getCatalogSuccess("trend", data);
        },
        error: function () {
            dmallAjaxError();
        }
    })
}

function getTotalStat(pre,datadirectoryId,businessCode,industryCode,organCode) {
    var tdata = {
        directoryId:datadirectoryId,
        businessCode:businessCode,
        industryCode:industryCode,
        organCode:organCode,
        checkedType: pre,
        isApi: $("#isApi").val()
    };
    $.ajax({
        url: "index/stats/amount",
        type: "GET",
        data: tdata,
        dataType: "json",
        success: function (data) {

            getCatalogSuccess("amount", data);
        },
        error: function () {
            dmallAjaxError();
        }
    });
    
}

function getExchangeStat(pre,datadirectoryId,businessCode,industryCode,organCode) {
    var tdata = {
        directoryId:datadirectoryId,
        businessCode:businessCode,
        industryCode:industryCode,
        organCode:organCode,
        checkedType: pre,
        isApi: $("#isApi").val()
    };
    $.ajax({
        url: "index/stats/exchange",
        type: "GET",
        data: tdata,
        dataType: "json",
        success: function (data) {

            getCatalogSuccess("exchange", data);
        },
        error: function () {
            dmallAjaxError();
        }
    })
}

function getOverallStat(pre,datadirectoryId,businessCode,industryCode,organCode) {
    var tdata = {
        directoryId:datadirectoryId,
        businessCode:businessCode,
        industryCode:industryCode,
        organCode:organCode,
        checkedType: pre,
        isApi: $("#isApi").val()
    };

    $.ajax({
        url: "index/stats/overall",
        type: "GET",
        data: tdata,
        dataType: "json",
        success: function (data) {

            getCatalogSuccess("overall", data);
        },
        error: function () {
            dmallAjaxError();
        }
    })
}


function industrynodeUnselect(nodeId) {
    curNode = null;
    isSetCancel = true;
    $hyTree.treeview('unselectNode', [nodeId]);
    $('#titleSelect').html('');
    $('.type_selected').hide();
}
function deptnodeUnselect(nodeId) {
    curNode = null;
    isSetCancel = true;
    $bmTree.treeview('unselectNode', [nodeId]);
    $('#titleSelect').html('');
    $('.type_selected').hide();
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
            if (pre == 'industry' || pre == 'business' || pre == 'datadirectory' || pre == 'catalog') {
                indNode = node;
                deptNode = null
            }
            if (pre == 'organ') {
                deptNode = node;
                indNode = null
            }
            isSetCancel = false;
            curNode = node;
            $('.type_selected').show();
            var title = '<li style="margin-left: -30px; float: none;"><a>' + node.text + '<i class="close_min s_close" onclick="' + pre + 'nodeUnselect(' + node.nodeId + ')"></i></a></li>'
            $('#titleSelect').html(title);
            if(node.level == 1){
                pre="business";
                getCatalog(pre,null,null,node.code,null);
            }else if(node.level == 2){
                pre="datadirectory";
                getCatalog(pre,null,node.code,node.parent_code,null);
            }else if(node.level == 3){
                pre="catalog";
                getCatalog(pre,node.id,null,null,null);
            }else{
                pre="organ";
                getCatalog(pre,null,null,null,node.code);
            }
            curPre = pre;
        },
        onNodeUnselected: function (event, node) {
            var temp = curSelectedNodeIndo;
            setTimeout(function () {
                if (temp == curSelectedNodeIndo && curPre == pre) {
                    if (isSetCancel == false) {
                        if(pre == "industry" || pre == "business" || pre == "datadirectory" || pre == "catalog"){
                            getCatalog("industry", null, null,null,null);
                        }else{
                            getCatalog(pre, null, null,null,null);
                        }
                    }
                }
            }, 300);
        }
    });

    return tree;
}
function cldrawTree(pre) {
    if (indNode){
        industrynodeUnselect(indNode.nodeId);
    }
    if (deptNode) {
        deptnodeUnselect(deptNode.nodeId);
    }
    $('#'+pre).treeview('clearSearch');
    curPre = pre;
        getCatalog(pre, null, null,null,null);
    curNode = null;
}

function expandAll(el, pre) {
    if (el.firstChild.id == "plus") {
        $(el).html('<img id="minus" src="view/img/collapse-all.png">');
        el.title = "收起树";
        $('#' + pre).treeview('expandAll');
    } else {
        $(el).html('<img id="plus" src="view/img/expand-all.png">');
        el.title = "展开树";
        $('#' + pre).treeview('collapseAll');
    }
}

function getdatalist(deptId, resourceTypeCode) {
    var myTab = $($('#myTab')[0].children);
    for (var i = 0; i < myTab.length; i++) {
        li = myTab[i];
        if ($(li).hasClass('active'))
            $(li).removeClass('active');
    }

    document.getElementById("bmLi").click();
    var unselectNodes = $('#organ').treeview('getUnselected');
    var tnode;
    for (var i = 0; i < unselectNodes.length; i++) {
        if (unselectNodes[i].id == deptId) {
            tnode = unselectNodes[i]
            break;
        }
    }
    $('#organ').treeview('revealNode', tnode);
    $('#organ').treeview('selectNode', tnode);

}

function executeTrendAmount() {

    // 资源编目数量变化趋势
    if(null != curNode) {
        if(curNode.level == 1){
            pre="business";
            getTrendStat(pre,null,null,curNode.code,null);
        }else if(curNode.level == 2){
            pre="datadirectory";
            getTrendStat(pre,null,curNode.code,curNode.parent_code,null);
        }else if(curNode.level == 3){
            pre="catalog";
            getTrendStat(pre,curNode.id,null,null,null);
        }else{
            pre="organ";
            getTrendStat(pre,null,null,null,curNode.code);
        }
    } else {
        getTrendStat(null, null, null,null,null,null);
    }

}

function setMonthOption(selectedYear) {
    var date = new Date;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;

    var tempMaxMonth = 12;
    if(year == selectedYear) {
        tempMaxMonth = month;
    }

    $("#trendMonth").empty();
    for(var i = tempMaxMonth; i > 0; i--) {
        var option = $("<option>").val(i).text(i);
        if(i == tempMaxMonth) {
            option.attr("selected", true);
        }
        $("#trendMonth").append(option);
    }
}

function initPieChart(data, myChart, title, subtitle, nullTip) {

    var typeOption = {
        title: {
            text: title,
            subtext: subtitle,
            show: true,
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter : function (params, ticket, callback) {
                if(0 == data.total) {
                    return nullTip;
                } else {
                    return params.name + " : " + params.value + " (" + params.percent + "%)";
                }
            }
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            show: false,
            data: data.result_title
        },
        series: [
            {
                name: '目录统计',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: data.result_list,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    myChart.setOption(typeOption);
}

function initTotalBarChart(data, myChart, title) {

    var dataNumber = [];
    if(data.child_list.length == 0){
        dataNumber = data.directly_list;
    }else if(data.directly_list.length == 0){
        dataNumber = data.child_list;
    }else if(data.child_list.length != 0 && data.directly_list.length != 0) {

        for(var i = 0;i < data.child_list.length;i++){
            dataNumber.push(String(parseInt(data.child_list[i]) + parseInt(data.directly_list[i])));
        }

    }

    var typeOption = {
        title: {
            text: title,
            //subtext: subtitle,
            show: true,
            x: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: "{b} : {c}",
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['数量'],
            show: false
        },
        grid: {
            left: '1%',
            right: '1%',
            bottom: '3%',
            height: 320,
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['总数量', '访问次数', '收藏次数', '交换次数', '评论次数']

            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '当前资源',
                type: 'bar',
                stack: '总量',
                barWidth: 30,
                itemStyle: {normal: {label: {show: false, position: 'insideRight'}}},
                data:dataNumber
            }
        ]
    };

    myChart.setOption(typeOption);
}


function initTrendChart(data, myChart, title) {

    var typeOption = {
        title: {
            text: title,
            //subtext: subtitle,
            show: true,
            x: 'center'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            height: 320,
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            formatter: "日期 : {b} <br/>访问量 : {c}",
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        xAxis: [
            {
                type: 'category',
                data: data.result_title

            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '当日编目数量',
                type: 'line',
                smooth: true,
                data: data.result_list
            }
        ]
    };

    myChart.setOption(typeOption);
}



