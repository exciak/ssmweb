/**
 * Created by xunzhi on 2015/7/13.
 */
$(document).ready(function () {
    $("#menu-index").addClass("active");
    $("#menu-demand").removeClass("active");
    $("#menu-supply").removeClass("active");
    $("#menu-review").removeClass("active");
    $("#menu-auth").removeClass("active");
    $("#menu-admin").removeClass("active");

    $(function () {
        if (window.chrome) {
            $('.banner li').css('background-size', '100% 100%');
        }
        $('.banner').unslider({
            //speed: 500,               //  The speed to animate each slide (in milliseconds)
            //delay: 300000,              //  The delay between slide animations (in milliseconds)
            //complete: function() {},  //  A function that gets called after every slide animation
            keys: true,               //  Enable keyboard (left, right) arrow shortcuts
            dots: false,               //  Display dot navigation
            fluid: true              //  Support responsive design. May break non-responsive designs
        });
    });

    var depTreeUrl = "share/department";
    var industryTreeUrl = "share/industryCategory";
    $.ajax({
        type: 'GET',
        async: false,
        url: industryTreeUrl,
        success: function (data) {
            if (data.result == "success") {
                industryTreeData = data.industry_list;
                businessTreeData = [];
                if (industryTreeData && industryTreeData.length > 0) {
                    //取公安行业下的子节点用于首页显示
                    for (var i = 0; i < industryTreeData.length; i++) {
                        if(industryTreeData[i].code=='ZNB'){
                            for(var j= 0;j < industryTreeData[i].nodes.length;j++ ){
                                businessTreeData.push(industryTreeData[i].nodes[j]);
                            }
                        }

                    }
                    if (businessTreeData.length > 8) businessTreeData.length = 8;
                    //展示业务节点
                    for(var i = 0; i < businessTreeData.length; i++){
                        $("#subLeft").append('<div class="col-md-12 col-sm-12 col-xs-12 one-line" style="padding:0px;margin-bottom:15px;margin-right: 0px;"><span class=" glyphicon glyphicon-play" style="color: #017aff;margin-right:10px"></span><a title=' + businessTreeData[i].text + ' onclick="getDataListByBusinessCode(' + businessTreeData[i].id + ')">' + businessTreeData[i].text + '</a></div>');
                    }
                }
            }
        },
        error: function () {
            dmallAjaxError();
        }
    });

    $.get("catalog/service/catalogs",
        {
            pageNumber: 1,
            orderName: "view",
            orderSort: "desc"
        },
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                for (i = 0; i < data.catalogList.length; i++) {
                    var catalogModel = data.catalogList[i];
                    var resourceName = catalogModel.resourceName;
                    resourceName = formatString(resourceName, 27);
                    var y = i + 1
                    var classInfo = "grayclor";
                    if(i == 0) {
                        classInfo = "redclor";
                    } else if(i == 1) {
                        classInfo = "clor";
                    } else if(i == 2) {
                        classInfo = "yellowclor";
                    }

                    $("#hotData").append('<div class="col-md-12 col-sm-12 col-xs-12 dt-no-padding">' +
                        '                    <div class="index-a longText" style="float:left; width: 30%; margin-bottom:15px;text-align:center;"><span style="margin-top: 3px;" class= "' + classInfo + '">' + y + '</span><a onclick=\"getDataListByDeptCode(' + catalogModel.routinePowerDeptCode + ',\'' + null + '\')\" title='+catalogModel.routinePowerDeptName+'>[' + catalogModel.routinePowerDeptName + ']</a></div>' +
                        '                    <div class="index-content longText" style="float:left; width: 50%;text-align:center;"> <a href="data?id=' + catalogModel.id + '" title="' + htmlEncode(catalogModel.resourceName) + '">' + htmlEncode(resourceName) + '</a></div>' +
                        '                    <div class="text-right" style="margin-bottom:8px;color:#017aff;text-align:center;">' + catalogModel.view + '次浏览</div>' +
                        '                    </div>');

                }
            } else {
                dmallError("获取最热数据失败");
            }
        },
        "json"
    );

    $.get("catalog/service/catalogs",
        {
            pageNumber: 1,
            orderName: "cs_catalog.update_time",
            orderSort: "desc"
        },
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                for (i = 0; i < data.catalogList.length; i++) {
                    var catalogModel = data.catalogList[i];
                    var resourceName = catalogModel.resourceName;
                    resourceName = formatString(resourceName, 27);
                    var y = i + 1;
                    var classInfo = "grayclor";
                    if(i == 0) {
                        classInfo = "redclor";
                    } else if(i == 1) {
                        classInfo = "clor";
                    } else if(i == 2) {
                        classInfo = "yellowclor";
                    }
                    $("#latestData").append('<div class="col-md-12 col-sm-12 col-xs-12 dt-no-padding">' +
                    '                    <div class="index-a longText" style="float:left; width: 30%; margin-bottom:15px;text-align:center;"><span style="margin-top: 3px;" class= "' + classInfo + '">' + y + '</span><a onclick=\"getDataListByDeptCode(' + catalogModel.routinePowerDeptCode + ',\'' + catalogModel.resourceTypeCode + '\')\" title='+catalogModel.routinePowerDeptName+'>[' + catalogModel.routinePowerDeptName + ']</a></div>' +
                    '                    <div class="index-content longText" style="float:left; width: 50%;text-align:center;"> <a href="data?id=' + catalogModel.id + '" title="' + htmlEncode(catalogModel.resourceName) + '">' + htmlEncode(resourceName) + '</a></div>' +
                    '                    <div class="text-right" style="color:#017aff;text-align:center;">' + catalogModel.update_time.substr(0, 10) + '</div>' +
                    '                    </div>');
                }
            } else {
                dmallError("获取最新数据失败");
            }
        },
        "json"
    );




});




//存组织机构的相应属性
function getDataListByDeptCode(deptCode, resourceTypeCode) {
    document.cookie = "deptCode=" + deptCode + "; path=/";
    if (resourceTypeCode == 'DATAAPI') {
        window.location.href = "dataapi";
    }
    else {
        window.location.href = "catalog";
    }
}
//将行业类别的相应属性存入cookie
function getDataListByBusinessCode(industryId, resourceTypeCode) {
    document.cookie = "industryId=" + industryId + "; path=/";
    document.cookie = "industryCode=ZNB";
    console.log(document.cookie);
    if (resourceTypeCode == 'DATAAPI') {
        window.location.href = "dataapi";
    }
    else {
        window.location.href = "catalog";
    }
}



