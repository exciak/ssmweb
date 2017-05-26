var subjectTypeName = "subject";
var industryTypeName = "industry";
var resourceTypeName = "resource";
var subjectTypeLevel = 1;
var industryTypeLevel = 1;
var resourceTypeLevel = 1;
$(document).ready(function () {
    $.ajax({
        url: "../../../dept/content/stats/catalog/amount",
        dataType: "json",
        success: function (data) {
            if ("success" != data.result) {
                return;
            }

            initYearChart(data);
        },
        error: function () {
            dmallAjaxError();
        }
    });

    selectSubject();
    selectIndustry();
    selectResource();

    $("#subjectLevel").change(function () {
        subjectTypeLevel = $("#subjectLevel").val();
        selectSubject();
    });
    $("#industryLevel").change(function () {
        industryTypeLevel = $("#industryLevel").val();
        selectIndustry();
    });
    $("#resourceLevel").change(function () {
        resourceTypeLevel = $("#resourceLevel").val();
        selectResource();
    });

    function selectIndustry(){
        $.ajax({
            url: "../../../dept/content/stats/catalog/type",
            dataType: "json",
            data: {
                type: industryTypeName,
                level: industryTypeLevel
            },
            success: function (data) {
                if ("success" != data.result) {
                    return;
                }
                var myChart = echarts.init(document.getElementById('industryType'));
                initTypeChart(data, myChart, "行业分类统计");
            },
            error: function () {
                dmallAjaxError();
            }
        });
    }

    function selectResource() {
        $.ajax({
            url: "../../../dept/content/stats/catalog/type",
            dataType: "json",
            data: {
                type: resourceTypeName,
                level: resourceTypeLevel
            },
            success: function (data) {
                if ("success" != data.result) {
                    return;
                }
                var myChart = echarts.init(document.getElementById('resourceType'));
                initTypeChart(data, myChart, "资源型态分类统计");
            },
            error: function () {
                dmallAjaxError();
            }
        });
    }

    function selectSubject() {
        $.ajax({
            url: "../../../dept/content/stats/catalog/type",
            dataType: "json",
            data: {
                type: subjectTypeName,
                level: subjectTypeLevel
            },
            success: function (data) {
                if ("success" != data.result) {
                    return;
                }
                var myChart = echarts.init(document.getElementById('subjectType'));
                initTypeChart(data, myChart, "主题分类统计");
            },
            error: function () {
                dmallAjaxError();
            }
        });
    }
});

function initTypeChart(data, myChart, title) {

    var typeOption = {
        title: {
            text: title,
            //subtext: '纯属虚构',
            show: false,
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
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

function initYearChart(data) {

    var yearOption = {
        title: {
            text: '目录年度统计',
            show: false,
            x: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        yAxis: [
            {
                type: 'value'
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: data.key_list
            }
        ],
        series: [
            {
                name: '年度编目数量',
                type: 'bar',
                data: data.value_list
            }
        ]
    };

    var myChart = echarts.init(document.getElementById('yearType'));
    myChart.setOption(yearOption);
}


