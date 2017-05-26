/**
 * Created by Administrator on 2015/7/2.
 */

var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];

var treeData;
var $metaTree = "";
var metaTag = 1;

var urlPath = "<script type='text/javascript' language='text/javascript' src='http://" + window.location.host + "/" + proName + "/view/js/dept-catalog-resource-interface.js'></script>";
document.write("<script type='text/javascript' language='text/javascript' src='http://" + window.location.host + "/" + proName + "/view/js/dept-catalog-resource/dept-catalog-resource-interface.js'></script>");

$(document).ready(function () {
    var preventDefaultFlag = false;
    var rootPath = "http://" + window.location.host + "/" + proName;
    var resourceNo = 0;
    var categoryId = 0;
    var categoryName = "";
    var subjectIndexCode = "";
    var industryId = "";
    var industryName = "";
    var industryIndexCode = "";
    var resourceTypeId = 0;
    var resourceTypeIdId = 0;
    var resourceTypeCode = "VIRTUAL";
    var resourceDetailId = 0;
    var resourceDetailName = "";
    var resourceTypeName = "";
    var resourceDetailIndexCode = "";
    var preIdentifier = "";

    var catalogId = "";
    var oldResourceTypeCode = "", oldApiUrl = "";
    var state = $("#state").val();
    var $subjectTree = "";
    var $industryTree = "";
    var $resTree = "";

    var subjectTag = 1;
    var industryTag = 1;
    var resTag = 1;
    var selectedTag = 1;

    var outsideTag = 1;

    var $selectedId = $("#selectedId");
    var $versionList = $("#versionList");
    var $createType = $("#createType");

    var $catalogDetail = $("#catalogDetail");
    var rootRoute = $("#rootRoute").val();
    var selectedId = "";
    var isLimit = "";
    var resourceParamType = "";
    catalogId = $("#catalogId").val();
    isLimit = $("#isLimit").val();

    resourceParamType = $("#resourceParamType").val();

    var maxHeight = -2;

    var opVersion = $('#opVersion').val();
    if (isLimit == 'true') {
        // $("input[type='checkbox']").attr("disabled", "disabled");
        $('#resourceNo').attr('readonly', true);
        $('#industryName').attr('disabled', true);
        $('#businessName').attr('disabled', true);
        $('#data1stName').attr('disabled', true);
        $('#data2ndName').attr('disabled', true);
        $('#dataDetailName').attr('disabled', true);
        $('#dataPropertyName').attr('disabled', true);
    }

    var createType = "";
    if (catalogId != "") {
        createType = "edit";
    } else {
        createType = $createType.val();
    }


    var catalogs = new Array();
    //获取目录列
    function selectedCatalog(page) {
        var myString = $.trim($selectedId.val());
        $catalogDetail.hide();
        $("#versionDiv").hide();
        $.get(rootPath + "/dept/content/submit/select_catalogs",
            {
                searchName: myString,
                createType: createType,
                pageNumber:page
            },
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    $("#catalogList").empty();
                    if (data.deptCatalogList.length == 0) {
                        $selectedId.addClass("errorC");
                        $(".errorSelectedId").html("*请选择正确的资源");
                        $(".errorSelectedId").css("display", "block");
                        $("#catalogListWrap").hide();
                    } else {
                        for (var i = 0; i < data.deptCatalogList.length; i++) {
                            var columns = data.deptCatalogList[i];
                            var trHTML = '<li class="longText" style="height: 20px" id=' + columns.resourceNo + ' title=' + columns.resourceName + '><a href="javascript:void(0)">' + columns.resourceNo + '——' + columns.resourceName + '</a></li>';
                            $("#catalogList").append(trHTML);
                        }
                        $("#currentPage2").html(data.pageNumber);
                        $("#totalPage2").html(data.totalPages);
                        $("#catalogListWrap").show();
                        if(data.totalPages == 1){
                            $("#pageDiv").hide();
                        } else{
                            $("#pageDiv").show();
                        }
                    }
                } else {
                    dmallError("获取目录列表失败");
                }
            },
            "json"
        );
    }
    $selectedId.keyup(function(){
        selectedCatalog(1);
    });
    $selectedId.focus(function () {
        $selectedId.removeClass("errorC");
        $(".errorSelectedId").hide();
    });
    // 资源列表翻页
    $("#previouspage2").click(
        function () {
            if (parseInt($("#currentPage2").html()) > 1) {
                selectedCatalog(parseInt($("#currentPage2").html()) - 1);
            }
            outsideTag = 1;
        });

    $("#nextpage2").click(
        function () {
            if (parseInt($("#currentPage2").html()) < parseInt($("#totalPage2").html())) {
                selectedCatalog(parseInt($("#currentPage2").html()) + 1);
            }
            outsideTag = 1;
        });
    //选择资源标识符
    $("#catalogList").delegate("li", "click", function () {
        selectedId = this.id;
        $selectedId.val(selectedId);
        getVersionList();
    });
   $("#catalogListWrap").click(function(){
       outsideTag = 1;
   });

    $("#catalogList").scroll(function() {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(this).height();
        //var clientHeight = $(this).maxHeight();
        //var clientHeight = $(this).maxHeight;
        if(scrollTop + scrollHeight >= maxHeight){
            //alert("you are in the bottom");
            freshCatalogList();
        }
    });
    $("#extentParamerDiv").delegate("input", "focus", function () {
        $(this).removeClass("errorC");
        $(this).siblings("small").hide();
        $(this).blur(function () {
            if($(this).data("required") == 1){
                checkNotBlank($(this),$(this).siblings("small"),"*请输入"+$(this).data("name"));
            }
        });
    });
    $("#extentParamerDiv").delegate("textarea", "focus", function () {
        $(this).removeClass("errorC");
        $(this).siblings("small").hide();
        $(this).blur(function () {
            if($(this).data("required") == 1){
                checkNotBlank($(this),$(this).siblings("small"),"*请输入"+$(this).data("name"));
            }
        });
    });
    function freshCatalogList() {
        for (var i = 0; (i < 5) && (catalogs.length > 0); i++) {
            var columns = catalogs.pop();
            //if (null != columns) {
                var trHTML = '<li class="longText" style="height: 20px" id=' + columns.resourceNo + ' title=' + columns.resourceName + '><a href="javascript:void(0)">' + columns.resourceNo + '——' + columns.resourceName + '</a></li>';
                $("#catalogList").append(trHTML);
                maxHeight += 20;
            //}
        }
    }

    //获取版本号
    function getVersionList() {
        $("#catalogListWrap").hide();
        $selectedId.removeClass("errorC");
        $(".errorSelectedId").hide();
        var resId = selectedId;
        selectedTag = 1;
        $selectedId.data("resId", resId);
        if (selectedId == "") {
            $versionList.append("<option value='0'>" + "请先选择目录" + "</option>");
        } else {
            $versionList.empty();
            //获取版本列表
            $.get(rootPath + "/dept/content/submit/versions",
                {
                    resId: resId,
                    createType: createType
                },
                //显示版本列表
                function (data, status) {
                    if ((status == "success") && (data.result == "success")) {
                        if (data.versions.length == 1) {
                            //只存在一个版本
                            var id = data.versions[0];
                            var name = "V" + id;
                            if (id == 0) {
                                name = "草稿"
                            }
                            $versionList.append("<option value='" + id + "'>" + name + "</option>");
                            $("#versionDiv").show();
                            getTemp();
                        } else {
                            $("#versionDiv").show();
                            $versionList.append("<option value='000'>" + "请选择" + "</option>");
                            for (var i = 0; i < data.versions.length; i++) {
                                var id = data.versions[i];
                                var name = "V" + id;
                                if (id == 0) {
                                    name = "草稿"
                                }
                                var newOption = new Option(name, id);
                                $versionList.append(newOption);
                            }
                        }
                    } else {
                        dmallError("获取版本失败：" + data.result);
                    }
                },
                "json"
            );
        }
    }

    //选择版本号
    $versionList.change(function () {
        if ($versionList.val() != "000") {
            getTemp();
        } else {
            $catalogDetail.hide();
        }
    });
    //获取使用模板
    function getTemp(){
        $("#extentParamerDiv").empty();
        var resId = $selectedId.data("resId");
        var version = $("#versionList option:selected").val();
        $.get(rootPath + "/dept/content/catalog/getTemplate",
            {
                resId:resId,
                version:version
            },
            function(data,status){
                if(data.result == "success" && status =="success"){
                    $("#extentParamerDiv").append(data.catalogTemplateContent);
                    openCatalog();
                }else{
                    dmallError(data.result);
                }
            },"json");
    }

    function BaseRender(baseParams) {
        console.log(baseParams);
        $('#resourceNo').val(baseParams.resourceNo);
        $('#resourceNo').removeClass('errorC');
        $('.errorResourceNo').hide().html('');

        $("#resourceName").val(baseParams.resourceName);
        $('#provideDeptCode').val(baseParams.provideDeptCode);
        $("#provideDeptName").val(baseParams.provideDeptName);
        $("#routinePowerDeptCode").val(baseParams.routinePowerDeptCode);
        $("#routinePowerDeptName").val(baseParams.routinePowerDeptName);
        $("#directoryId").val(baseParams.directoryId);
        getDirectoryId(baseParams.directoryNo);
        $("#industryName").val(baseParams.industryCode);
        industryCode = baseParams.industryCode;
        // getIndustryName();
        businessCode = baseParams.businessCode;
        // getBusinessName();
        $('#businessName').val(baseParams.businessCode);
        $("#data1stName").val(baseParams.data1stCode);
        $("#data2ndName").val(baseParams.data2ndCode);
        $("#dataDetailName").val(baseParams.dataDetailCode);
        $("#dataPropertyName").val(baseParams.dataPropertyCode);
        $("#updateModeName").val(baseParams.updateModeCode);
        $("#updateCycleName").val(baseParams.updateCycleCode);
        $("#resourceDesc").val(baseParams.resourceDesc);
        shareScopeCodes = baseParams.shareScopeCodes;
        if(shareScopeCodes == 'ZYGXFW_01' || shareScopeCodes == 'ZYGXFW_04'){
            $('#appointShare').val(shareScopeCodes);
            $('#shareScopeCodes').hide();
            $('#shareAreaCodes').val('');
            $('#shareAreaNames').html('');
            $('#shareDeptCodes').val('');
            $('#shareDeptNames').html('');
        }else {
            $('#appointShare').val('appoint');
            $('#shareScopeCodes').show();
            var shareScopeList = shareScopeCodes.split(',');
            for (var i = 0; i < shareScopeList.length; i++){
                $('#shareScope_' + shareScopeList[i]).attr('checked', true);
                if(shareScopeList[i] == 'ZYGXFW_02'){
                    $('#shareAreaCodes').val(baseParams.shareAreaCodes);
                    var codes = baseParams.shareAreaCodes.split(',');
                    getShareAreaNames(codes);
                    $('#shareAreaNames').html();
                    $('#shareArea').show();
                }
                if(shareScopeList[i] == 'ZYGXFW_03'){
                    $('#shareDeptCodes').val(baseParams.shareDeptCodes);
                    var codes = baseParams.shareDeptCodes.split(',');
                    getShareDeptNames(codes);
                    $('#shareDeptNames').html();
                    $('#shareDept').show();
                }
            }
        }

        shareModeCodes = baseParams.shareModeCodes;
        var shareModeList = baseParams.shareModeCodes.split(',');
        for (var i = 0; i < shareModeList.length; i++){
            $('#shareMode_' + shareModeList[i]).attr('checked', true);
        }


        // $("#resourceName").val(baseParams.resourceName);
        // $("#resourceDesc").val(baseParams.resourceDesc);
        $("#resourceTypeId").val(baseParams.resourceTypeId);
        $("#resourceTypeCode").val(baseParams.resourceTypeCode);
        $("#resourceDetailId").val(baseParams.resourceDetailId);
        $("#resourceDetailName").val(baseParams.resourceDetailName);
        $("#resourceDetailIndexCode").val(baseParams.resourceDetailIndexCode);
        $("#subjectId").val(baseParams.subjectId);
        $("#subjectName").val(baseParams.subjectName);
        $("#subjectIndexCode").val(baseParams.subjectIndexCode);
        $("#industryId").val(baseParams.industryId);
        // $("#industryName").val(baseParams.industryName);
        $("#industryIndexCode").val(baseParams.industryIndexCode);
        $("#deptId").val(baseParams.deptId);
        $("#deptName").val(baseParams.deptName);
        $("#providerCode").val(baseParams.providerCode);
        $("#providerLevel").val(baseParams.providerLevel);
        $("#vindicatorName").val(baseParams.vindicatorName);
        $("#keyword").val(baseParams.keyword);
        $("#opVersion").val(baseParams.opVersion);
        $("#state").val(baseParams.state);
        $("#version").val(baseParams.version);
        $("#catalogTemplateId").val(baseParams.catalogTemplateId);
        $("#publicLevel").val((baseParams.publicLevel));

        if(baseParams.catalogTemplateData != "" && baseParams.catalogTemplateData != null){
            var catalogTemplateData = eval("(" + baseParams.catalogTemplateData + ")");
            var $selector = $("#extentParamerDiv").find("input");
            var $selector2 = $("#extentParamerDiv").find("textarea");
            $selector.each(function () {
                var selectorValue = "";
                for (var key in catalogTemplateData) {
                    if(key == this.id) {
                        selectorValue = catalogTemplateData[key];
                        break;
                    }
                }
                $(this).val(selectorValue);
            });
            $selector2.each(function () {
                var selector2Value = "";
                for (var key in catalogTemplateData) {
                    if (key == this.id) {
                        selector2Value = catalogTemplateData[key];
                        break;
                    }
                }
                $(this).val(selector2Value);
            });
        }
        var accessLimit = baseParams.accessLimit;
        var showType = baseParams.showType;
        resourceTypeCode = baseParams.resourceTypeCode;
        if (accessLimit == 0) {
            $("input[name='accessLimit']:eq(1)").attr("checked", "checked");
        } else if (accessLimit == 1) {
            $("input[name='accessLimit']:eq(0)").attr("checked", "checked");
        }
        if (showType == 0) {
            $("input[name='showType']:eq(0)").attr("checked", "checked");
            $("#showLevel").val(baseParams.showLevel);
            $("#showType0").show();
            $("#showType1").hide();
        } else if (showType == 1) {
            $("input[name='showType']:eq(1)").attr("checked", "checked");
            $("#showLevel1").val(baseParams.showLevel);
            $("#showType0").hide();
            $("#showType1").show();
        }

        if (resourceTypeCode == "STRUCTFILE" || resourceTypeCode == "COMMFILE"|| resourceTypeCode == "ONLINEURL"){
            $("#publicLevelRadio").show();
        } else{
            $("#publicLevelRadio").hide();
        }

        var publicLevel = baseParams.publicLevel;
        if (publicLevel == 1){
            //对公众开放
            $("input[name='publicLevel']:eq(1)").attr("checked", "checked");
            $("#publicLevelDiv").hide();
            $(".errorPublicLevel").show();
            $(".errorPublicLevel").html("（未登录用户也将可以下载该资源）");
        } else {
            $("input[name='publicLevel']:eq(0)").attr("checked", "checked");
            $("#publicLevelDiv").show();
        }
    };

    //打开编目内容
    function openCatalog() {
        var resId = $selectedId.data("resId");
        var version = $("#versionList option:selected").val();
        var createType = $createType.val();
        $.get(rootPath + "/dept/content/catalog/get_content",
            {
                resId: resId,
                version: version,
                createType: createType
            },
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    // if (createType == "copy") {
                    //     console.log(data);
                    //     if (data.prefixcodeModels.length == 1) {
                    //         preIdentifier = data.prefixcodeModels[0].prefixCode;
                    //         $.get(rootPath + "/dept/content/create_identifier",
                    //             {
                    //                 preIdentifier: preIdentifier
                    //             },
                    //             function (data, status) {
                    //                 if (data.result != "success") {
                    //                     dmallError(data.result);
                    //                 } else {
                    //                     var $resourceList = $("#resourceNo");
                    //                     $resourceList.attr("value", "");
                    //                     $resourceList.val(data.identifier);
                    //                     $resourceList.data("resourceNo", data.identifier);
                    //                     $("#resourceNo").removeClass("errorC");
                    //                     $(".errorResourceId").hide();
                    //                     resourceNo = data.identifier;
                    //                     $("#metadataId").val(data.identifier);
                    //                     $("#metadataId").removeClass("errorC");
                    //                     $(".errorMetadataId").hide();
                    //                 }
                    //             },
                    //             "json");
                    //     } else {
                    //         $("#chooseDeptPrecode").show();
                    //     }
                    // } else {
                    //     $("#resourceNo").val(data.catalog.baseParams.resourceNo);
                    //     $("#metadataId").val(data.catalog.baseParams.metadataId);
                    //     $("#isLimit").val(data.isLimit);
                    // }
                    BaseRender(data.catalog.baseParams);
                    //fileParamType(resourceTypeCode);
                    resourceTypeId = comfirmResourceId(resourceTypeCode);
                    $('#virtualTextTable').empty();
                    itemMappingArr = [];
                    ExtraCatalog.render(resourceTypeId, data.catalog.extraParams);

                    if (createType == "newVersion") {
                        $('#resourceNo').attr('readonly', true);
                        $('#industryName').attr('disabled', true);
                        $('#businessName').attr('disabled', true);
                        $('#data1stName').attr('disabled', true);
                        $('#data2ndName').attr('disabled', true);
                        $('#dataDetailName').attr('disabled', true);
                        $('#dataPropertyName').attr('disabled', true);
                        $('#chooseDirectory').prop('disabled', true);


                        $("#resourceDetailName").attr("readonly", "readonly");
                        $("#fileName").attr("readonly", "readonly");
                     //   $("#transmitIntervalMinuteValue").attr("readonly", "readonly");
                        $("#chooseResource").hide();
                        $("#chooseDeptPrecode").hide();
                        $("#chooseDbSrc").hide();
                        $("#chooseRdsSrc").hide();
                        /*$("#editDbColumns").hide();
                        $("#editRdsColumns").hide();*/
                        $("#editFileDbColumns").hide();
                        $("#editFileDbColumn").hide();
                        $("#chooseFileDbSrc").hide();
                    //    $("#scheduleTypeList").attr("disabled", "disabled");
                    //    $("#transmitIntervalWeekValue").attr("disabled", "disabled");
                    //    $("#transmitIntervalMonthValue").attr("disabled", "disabled");
                    //    $("#transmitIntervalDayHour").attr("disabled", "disabled");
                    //    $("#transmitIntervalDayMinute").attr("disabled", "disabled");
                        $("#dbTable").attr("readonly", "readonly");
                        $("#rdsTable").attr("readonly", "readonly");
                        $("#fileDbTableList").attr("disabled", "disabled");
                        $("#apiUrl").attr("disabled", "disabled");
                        $("#chooseMarkedDbSrc").hide();
                        $("#clearMarkedDbSrc").hide();
                        $("#maskedDbTable").attr("readonly", "readonly");
                        $("#editMaskedDbColumns").hide();
                        $("input[name='fileCome']").attr("disabled", "disabled");
                        $("input[name='provideType']").attr("disabled", "disabled");
                        $("input[name='provideType2']").attr("disabled", "disabled");
                        // $("input[name='exchangeType']").attr("disabled", "disabled");
                    //    $("input[name='exchangeMode']").attr("disabled", "disabled");
                    //     $("#exchangeMode input[type='checkbox']").attr("disabled", "disabled");
                        //$("#exchangeIntervalList").attr("disabled", "disabled");
                        //$("#exchangeIntervalValue").attr("readonly", "readonly");
                        if(null != data.catalog.extraParams.dopGatewayId && "" != data.catalog.extraParams.dopGatewayId) {
                            $("#gateWay").attr("disabled", "disabled");
                        }

                        isLimit = "true";
                    }
                    $catalogDetail.show();
                } else {
                    dmallError("获取失败");
                }
            },
            "json"
        );
    }

    //检查数据资源编号输入框
    var $resourceNo = $('#resourceNo');
    var oldResourceNo = $('#resourceNo').val();
    function checkResValue() {
        var resourceNo = $("#resourceNo").val();
        var isExist = false;
        if(oldResourceNo != '' && oldResourceNo == resourceNo){

        }else{
            if(createType != 'newVersion'){
                $.ajax({
                    url: rootPath + "/dept/content/submit/exist",
                    async: false,
                    data: {resourceNo: resourceNo},
                    success:function (data) {
                        if (data.isExist) {
                            $resourceNo.addClass("errorC");
                            $(".errorResourceNo").html("*输入数据资源编号已存在");
                            $(".errorResourceNo").css("display", "block");
                            $(".notifications").empty();
                            dmallError('输入数据资源编号已存在');
                            isExist = true;
                            return;
                        }else {
                            $(".notifications").empty();
                        }
                    },
                    error: function () {
                        dmallAjaxError();
                    }
                });
            }
        }

            // $.get(rootPath + "/dept/content/submit/exist",
            //     {
            //         resourceNo: resourceNo
            //     },
            //     function (data, status) {
            //         if ((status == "success") && (data.result == "success")) {
            //                 if (data.isExist) {
            //                     $resourceNo.addClass("errorC");
            //                     $(".errorResourceNo").html("*输入数据资源编号已存在");
            //                     $(".errorResourceNo").css("display", "block");
            //                     isExist = true;
            //                     $('#nextStep').prop('disabled', true);
            //                     return;
            //                 }
            //
            //
            //
            //             // if (data.isExist) {
            //             //     $("#catalogListWrap").hide();
            //             //     selectedId = $("#selectedId").val();
            //             //     getVersionList();
            //             // } else {
            //             //     $("#catalogListWrap").hide();
            //             //     $("#selectedId").addClass("errorC");
            //             //     $(".errorSelectedId").html("*请输入正确的资源标识符");
            //             //     $(".errorSelectedId").css("display", "block");
            //             // }
            //
            //         } else {
            //             dmallError("获取目录列表失败");
            //         }
            //     },
            //     "json"
            // );

        return isExist;
    }

    //回写相关
    if (catalogId != "") {
        oldResourceTypeCode = $("#resourceTypeCode").val();
        resourceTypeCode = $("#resourceTypeCode").val();
        var oldResourceTypeId = comfirmResourceId(oldResourceTypeCode);
        //fileParamType(resourceTypeCode);
        ExtraCatalog.init(oldResourceTypeId, Flag.POSITIVE);
    }


    //资源树
    $.get(rootPath + "/share/resourceDetail", {},
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                $resTree = $('#list-res').treeview({
                    data: data.resource_detail_list,
                    onNodeSelected: function (event, node) {
                        if (node.resourceTypeCode != "" && node.resourceTypeCode != undefined) {
                            var $resourceTypeId = $("#resourceDetailName");
                            $resourceTypeId.data("resourceDetailName", node.text);
                            $resourceTypeId.data("resourceDetailId", node.id);
                            $resourceTypeId.data("resourceTypeIdId", node.resourceTypeId);
                            $resourceTypeId.data("resourceTypeCode", node.resourceTypeCode);
                            $resourceTypeId.data("resourceTypeName", node.resourceTypeName);
                            $resourceTypeId.data("resourceDetailIndexCode", node.indexCode);
                            var $resourceTypeId = $("#resourceDetailName");
                            $resourceTypeId.val($("#resourceDetailName").data("resourceDetailName"));
                            //     var resCode =$("#resourceDetailName").data("resCode");
                            resourceTypeCode = $resourceTypeId.data("resourceTypeCode");
                            resourceTypeIdId = $resourceTypeId.data("resourceTypeIdId");
                            resourceDetailIndexCode = $resourceTypeId.data("resourceDetailIndexCode");
                            resourceTypeName = $resourceTypeId.data("resourceTypeName");
                            resourceDetailId = $resourceTypeId.data("resourceDetailId");
                            resourceDetailName = $resourceTypeId.data("resourceDetailName");

                            if (resourceTypeCode == "STRUCTFILE" || resourceTypeCode == "COMMFILE"|| resourceTypeCode == "ONLINEURL"){
                                $("#publicLevelRadio").show();
                            } else{
                                $("#publicLevelRadio").hide();
                                $("input[name='publicLevel']:eq(0)").attr("checked", 'checked');
                                $("input:radio[name='accessLimit']").eq(0).attr("checked",true);
                                $(".errorPublicLevel").hide();
                                $("#publicLevelDiv").show();
                            }

                            $("#resourceTypeId").val(resourceTypeIdId);
                            $("#resourceTypeCode").val(resourceTypeCode);
                            $("#resourceDetailId").val(resourceDetailId);
                            $("#resourceDetailIndexCode").val(resourceDetailIndexCode);
                            $("#resourceDetailName").removeClass("errorC");
                            $(".errorResourceTypeId").hide();
                            $("#list-res").hide();
                            resTag = 1;

                            //fileParamType(resourceTypeCode);

                            if (catalogId != "" && resourceTypeCode != oldResourceTypeCode) {
                                initUpdateDate();
                                var RTI = comfirmResourceId(resourceTypeCode);
                                ExtraCatalog.init(RTI, Flag.NEGATIVE);
                            }

                            if (catalogId == "") {
                                initUpdateDate();
                            }
                        } else{
                            dmallError("该资源形态未关联资源模版，不可选择");
                        }
            },
                    onNodeCollapsed: function (event, node) {
                        resTag = 1;
                    },
                    onNodeExpanded: function (event, node) {
                        resTag = 1;
                    }
                });
            } else {
                dmallError("获取资源形态列表失败");
            }
        },
        "json"
    );
//点击展开资源树
    $('#resourceDetailName').click(function () {
        $("#resourceDetailName").removeClass("errorC");
        $(".errorResourceTypeId").hide();
        if ($("#list-res").is(":hidden") && isLimit == "false") {
            $("#list-res").show();
            $("#list-industry").hide();
            $("#list-subject").hide();
        }
        resTag = 1;
    });
    //资源树搜索
    var searchResTreeView = function (e) {
        var string = $('#resourceDetailName').val();
        var pattern = toEscStr(string);
        var options = {
            revealResults: true
        };
        var results = $resTree.treeview('search', [pattern, options]);
    }
    $('#resourceDetailName').on('keyup', searchResTreeView);
    function getNodeInResTree(textName) {
        var pattern = toEscStr(textName);
        var options = {
            exactMatch: true,
            revealResults: true
        };
        var results = $resTree.treeview('search', [pattern, options]);
        if (results.length != 0) {
            return results[0];
        } else {
            return null;
        }
    };
    //主题树
    // $.get(rootPath + "/share/subjectCategory", {},
    //     function (data, status) {
    //         if ((status == "success") && (data.result == "success")) {
    //             $subjectTree = $('#list-subject').treeview({
    //                 data: data.subject_list,
    //                 onNodeSelected: function (event, node) {
    //                     var $categoryList = $("#subjectName");
    //                     $categoryList.data("caValue", node.text);
    //                     $categoryList.data("srcid", node.id);
    //                     $categoryList.data("subjectIndexCode", node.indexCode);
    //                     //     $categoryList.attr("value","");
    //                     $categoryList.val($categoryList.data("caValue"));
    //                     categoryId = $categoryList.data("srcid");
    //                     categoryName = $categoryList.data("caValue");
    //                     subjectIndexCode = $categoryList.data("subjectIndexCode");
    //                     $("#subjectId").val(categoryId);
    //                     $("#subjectIndexCode").val(subjectIndexCode);
    //                     $("#subjectName").removeClass("errorC");
    //                     $(".errorCategoryId").hide();
    //                     $("#list-subject").hide();
    //                     subjectTag = 1;
    //                 },
    //                 onNodeCollapsed: function (event, node) {
    //                     subjectTag = 1;
    //                 },
    //                 onNodeExpanded: function (event, node) {
    //                     subjectTag = 1;
    //                 }
    //             });
    //         } else {
    //             dmallError("获取主题分类列表失败");
    //         }
    //     },
    //     "json"
    // );
    //点击文本框显示选择树
    $('#subjectName').click(function () {
        $("#subjectName").removeClass("errorC");
        $(".errorCategoryId").hide();
        if ($("#list-subject").is(":hidden")) {
            $("#list-subject").show();
            $("#list-industry").hide();
            $("#list-res").hide();
        }
        subjectTag = 1;
    });

    //主题类目的搜索
    // var searchSubjectTreeView = function (e) {
    //     var pattern = $('#subjectName').val();
    //     var options = {
    //         revealResults: true
    //     };
    //     var results = $subjectTree.treeview('search', [pattern, options]);
    // }
    // $('#subjectName').on('keyup', searchSubjectTreeView);
    // function getNodeInSubjectTree(textName) {
    //     var pattern = textName;
    //     var options = {
    //         exactMatch: true,
    //         revealResults: true
    //     };
    //     var results = $subjectTree.treeview('search', [pattern, options]);
    //
    //     if (results.length != 0) {
    //         return results[0];
    //     } else {
    //         return null;
    //     }
    // };

    //行业树
    // $.get(rootPath + "/share/industryCategory", {},
    //     function (data, status) {
    //         if ((status == "success") && (data.result == "success")) {
    //             $industryTree = $('#list-industry').treeview({
    //                 data: data.industry_list,
    //                 onNodeSelected: function (event, node) {
    //                     var $industryList = $("#industryName");
    //                     $industryList.data("industryId", node.id);
    //                     $industryList.data("industryName", node.text);
    //                     $industryList.data("industryIndexCode", node.indexCode);
    //                     $industryList.val($industryList.data("industryName"));
    //                     industryId = $industryList.data("industryId");
    //                     $("#industryId").val(industryId);
    //                     industryName = $industryList.data("industryName");
    //                     $industryList.val(industryName);
    //                     industryIndexCode = $industryList.data("industryIndexCode");
    //                     $("#industryIndexCode").val(industryIndexCode);
    //                     $industryList.removeClass("errorC");
    //                     $(".errorIndustryName").hide();
    //                     industryTag = 1;
    //                     $("#list-industry").hide();
    //                 },
    //                 onNodeCollapsed: function (event, node) {
    //                     industryTag = 1;
    //                 },
    //                 onNodeExpanded: function (event, node) {
    //                     industryTag = 1;
    //                 }
    //             });
    //         } else {
    //             dmallError("获取行业分类列表失败");
    //         }
    //     },
    //     "json"
    // );
    //点击文本框显示选择树
    $('#industryName').click(function () {
        $("#industryName").removeClass("errorC");
        $(".errorIndustryName").hide();
        if ($("#list-industry").is(":hidden")) {
            $("#list-industry").show();
        }
        industryTag = 1;
    });
    //行业搜索
    // var searchIndustryTreeView = function (e) {
    //     var pattern = $("#industryName").val();
    //     var options = {
    //         revealResults: true
    //     };
    //     var results = $industryTree.treeview('search', [pattern, options]);
    // }
    // $('#industryName').on('keyup', searchIndustryTreeView);
    //
    // function getNodeInIndustryTree(textName) {
    //     var pattern = textName;
    //     var options = {
    //         exactMatch: true,
    //         revealResults: true
    //     };
    //     var results = $industryTree.treeview('search', [pattern, options]);
    //
    //     if (results.length != 0) {
    //         return results[0];
    //     } else {
    //         return null;
    //     }
    // };
    // function checkIndustry() {
    //     var string = $("#industryName").val();
    //     var nodeTmp = getNodeInIndustryTree(string);
    //     if (null != nodeTmp) {
    //         selectNode = nodeTmp;
    //         $("#industryName").removeClass("errorC");
    //         $(".errorIndustryName").hide();
    //     } else {
    //         $("#industryName").addClass("errorC");
    //         $(".errorIndustryName").html("*请选择正确的行业分类");
    //         $(".errorIndustryName").css("display", "block");
    //         preventDefaultFlag = true;
    //     }
    // }

    //单条前段码
    // if ($("#precodeSize").val() == 1) {
    //     preIdentifier = $("#preCode").val();
    //     $.get(rootPath + "/dept/content/create_identifier",
    //         {
    //             preIdentifier: preIdentifier
    //         },
    //         function (data, status) {
    //             if (data.result != "success") {
    //                 dmallError(data.result);
    //             } else {
    //                 var $resourceList = $("#resourceNo");
    //                 $resourceList.attr("value", "");
    //                 $resourceList.val(data.identifier);
    //                 $resourceList.data("resourceNo", data.identifier);
    //                 $("#resourceNo").removeClass("errorC");
    //                 $(".errorResourceId").hide();
    //                 resourceNo = data.identifier;
    //                 $("#metadataId").val(data.identifier);
    //                 $("#metadataId").removeClass("errorC");
    //                 $(".errorMetadataId").hide();
    //             }
    //         },
    //         "json");
    // }
        //点击编目按钮
        $("#shelveButton").click(
            function (event) {
                checkAllItems();
                if (preventDefaultFlag === true) {
                    event.preventDefault();
                    preventDefaultFlag = false;
                    return false;
                }
                $("#shelveButton").attr('disabled', true);
                $("#newAndSubmitBtn").attr('disabled', true);
                //  $('#shelveModal').modal({backdrop: 'static', keyboard: false});
                if (catalogId == "") {
                    submitShelve(0);
                } else {
                    if (state == 0 || state == 1) {
                        submitShelve(3);
                    } else {
                        submitShelve(4);
                    }
                }
            }
        );
    //点击编目并提交按钮
    $("#newAndSubmitBtn").click(function (event) {
        checkAllItems();
        if (preventDefaultFlag === true) {
            event.preventDefault();
            preventDefaultFlag = false;
            return false;
        }
        $("#shelveButton").attr('disabled', true);
        $("#newAndSubmitBtn").attr('disabled', true);
        submitShelve(1);
    });

    //选择资源形态分类
    $("#chooseResource").click(function () {
        /* 打开模态框 */
        openResource();
    });
    function openResource() {
        //打开模态框
        $('#addResource').modal({backdrop: 'static', keyboard: false});
        /* 获取资源形态分类 */
        getResourceList();
    }

    //获取资源形态分类
    function getResourceList() {
        $.get(rootPath + "/share/resourceDetail", {},
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    $resourceTree = $('#list-resource2').treeview({
                        data: data.resource_detail_list,
                        onNodeSelected: function (event, node) {
                            if (node.resourceTypeCode != "" && node.resourceTypeCode != undefined) {
                                var $resourceTypeId = $("#resourceDetailName");
                                $resourceTypeId.data("resourceDetailName", node.text);
                                $resourceTypeId.data("resourceDetailId", node.id);
                                $resourceTypeId.data("resourceTypeIdId", node.resourceTypeId);
                                $resourceTypeId.data("resourceTypeCode", node.resourceTypeCode);
                                $resourceTypeId.data("resourceTypeName", node.resourceTypeName);
                                $resourceTypeId.data("resourceDetailIndexCode", node.indexCode);
                            } else {
                                dmallError("该资源形态未关联资源模版，不可选择");
                            }
                        }
                    });
                } else {
                    dmallError("获取资源形态列表失败");
                }
            },
            "json"
        );
    }

    //资源形态分类提交
    $("#resource_btn_commit").click(
        function () {
            var $resourceTypeId = $("#resourceDetailName");
            $resourceTypeId.val($("#resourceDetailName").data("resourceDetailName"));
            //     var resCode =$("#resourceDetailName").data("resCode");
            resourceTypeCode = $resourceTypeId.data("resourceTypeCode");
            resourceTypeIdId = $resourceTypeId.data("resourceTypeIdId");
            resourceDetailIndexCode = $resourceTypeId.data("resourceDetailIndexCode");
            resourceTypeName = $resourceTypeId.data("resourceTypeName");
            resourceDetailId = $resourceTypeId.data("resourceDetailId");
            resourceDetailName = $resourceTypeId.data("resourceDetailName");
            $("#resourceTypeId").val(resourceTypeIdId);
            $("#resourceTypeCode").val(resourceTypeCode);
            $("#resourceDetailId").val(resourceDetailId);
            $("#resourceDetailIndexCode").val(resourceDetailIndexCode);
            $("#resourceDetailName").removeClass("errorC");
            $(".errorResourceTypeId").hide();

            if (resourceTypeCode == "STRUCTFILE" || resourceTypeCode == "COMMFILE"|| resourceTypeCode == "ONLINEURL"){
                $("#publicLevelRadio").show();
            } else{
                $("#publicLevelRadio").hide();
                $("input[name='publicLevel']:eq(0)").attr("checked", 'checked');
                $("input:radio[name='accessLimit']").eq(0).attr("checked",true);
                $(".errorPublicLevel").hide();
                $("#publicLevelDiv").show();
            }

            if (catalogId != "" && resourceTypeCode != oldResourceTypeCode) {
                switch (resourceTypeCode) {
                    case "ONLINEURL":
                        $("#url").val("");
                        break;
                    case "DATAAPI" :
                        $("#apiUrl").val("");
                        break;
                    case "STRUCTFILE" :
                        $("#structUrl").val("");
                        break;
                    case "COMMFILE" :
                        $("#contentUrl").val("");
                        break;
                    case "ODPS" :
                        initUpdateDate();
                        $("#dataSize").val("");
                        $("input[name='provideType']:eq(0)").attr("checked", 'checked');
                        $("#updateInterval").hide();
                        $("#rdsTableColumnsTable").hide();
                        $("#dbTableColumnsTable").show();
                        break;
                    case "RDS" :
                    case "ADS" :
                        initUpdateDate();
                        $("#rdsDataSize").val("");
                        $("input[name='provideType2']:eq(0)").attr("checked", 'checked');
                        $("#updateInterval2").hide();
                        $("#extractDescriptionDiv").hide();
                        $("#dbTableColumnsTable").hide();
                        $("#rdsTableColumnsTable").show();
                        break;
                }
            }
           // fileParamType(resourceTypeCode);
            if (catalogId == "") {
                initUpdateDate();
            }
        }
    );

    //选择主题分类
    // $("#chooseSubject").click(function () {
    //     //打开模态框
    //     openSubject();
    // });
    // function openSubject() {
    //     //打开模态框
    //     $('#addSubject').modal({backdrop: 'static', keyboard: false});
    //     //获取主题分类
    //     getSubjectList();
    // }

    //获取主题分类
    // function getSubjectList() {
    //     $.get(rootPath + "/share/subjectCategory", {},
    //         function (data, status) {
    //             if ((status == "success") && (data.result == "success")) {
    //                 $subjectTree = $('#list-subject2').treeview({
    //                     data: data.subject_list,
    //                     onNodeSelected: function (event, node) {
    //                         var $categoryList = $("#subjectName");
    //                         $categoryList.data("caValue", node.text);
    //                         $categoryList.data("srcid", node.id);
    //                         $categoryList.data("subjectIndexCode", node.indexCode);
    //                     }
    //                 });
    //             } else {
    //                 dmallError("获取主题分类列表失败");
    //             }
    //         },
    //         "json"
    //     );
    // }

    //主题分类提交
    // $("#subject_btn_commit").click(
    //     function () {
    //         var $categoryList = $("#subjectName");
    //         //     $categoryList.attr("value","");
    //         $categoryList.val($("#subjectName").data("caValue"));
    //         categoryId = $("#subjectName").data("srcid");
    //         categoryName = $("#subjectName").data("caValue");
    //         subjectIndexCode = $("#subjectName").data("subjectIndexCode");
    //         $("#subjectId").val(categoryId);
    //         $("#subjectIndexCode").val(subjectIndexCode);
    //         $("#subjectName").removeClass("errorC");
    //         $(".errorCategoryId").hide();
    //     }
    // );
    // //选择行业分类
    // $("#chooseIndustry").click(function () {
    //     //打开模态框
    //     openIndustry();
    // });
    // function openIndustry() {
    //     //打开模态框
    //     $('#addIndustry').modal({backdrop: 'static', keyboard: false});
    //     //获取行业分类
    //     getIndustryList();
    // }

    //获取行业分类
    // function getIndustryList() {
    //     $.get(rootPath + "/share/industryCategory", {},
    //         function (data, status) {
    //             if ((status == "success") && (data.result == "success")) {
    //                 $bmTree = $('#list-industry2').treeview({
    //                     data: data.industry_list,
    //                     onNodeSelected: function (event, node) {
    //                         var $industryList = $("#industryName");
    //                         $industryList.data("industryId", node.id);
    //                         $industryList.data("industryName", node.text);
    //                         $industryList.data("industryIndexCode", node.indexCode);
    //                     }
    //                 });
    //             } else {
    //                 dmallError("获取行业分类列表失败");
    //             }
    //         },
    //         "json"
    //     );
    // }

    //行业分类提交
    // $("#industry_btn_commit").click(
    //     function () {
    //         var $industryList = $("#industryName");
    //         $industryList.val($("#industryName").data("industryName"));
    //         industryId = $("#industryName").data("industryId");
    //         $("#industryId").val(industryId);
    //         industryName = $("#industryName").data("industryName");
    //         $("#industryName").val(industryName);
    //         industryIndexCode = $("#industryName").data("industryIndexCode");
    //         $("#industryIndexCode").val(industryIndexCode);
    //     }
    // );

    //选择前段码
    // $("#chooseDeptPrecode").click(function () {
    //     /* 设置弹窗标题 */
    //     $("#addDeptPrecodeTitle").text("请选择前段码");
    //     /* 打开模态框 */
    //     openDeptPrecodeModal();
    // });
    //打开前段码模态框
    // function openDeptPrecodeModal() {
    //     //打开模态框
    //     $('#addDeptPrecodeModal').modal({backdrop: 'static', keyboard: false});
    //
    //     /* 填写前段码 */
    //     //  getDeptPrecodeList();
    // }

    //前段码提交
    // $("#precode_btn_commit").click(
    //     function () {
    //         $("#list-precode option:selected").each(function () {
    //             var $resourceList = $("#resourceNo");
    //             $resourceList.attr("value", "");
    //             $resourceList.val($(this).get(0).text);
    //             $resourceList.data("preIdentifier", $(this).get(0).value);
    //             $("#resourceNo").removeClass("errorC");
    //             $(".errorResourceId").hide();
    //             preIdentifier = $("#resourceNo").data("preIdentifier");
    //
    //         });
	 //        if(preIdentifier == "") {
    //             $("#list-precode").addClass("errorC");
    //             $(".error-list-precode").html("*请选择");
    //             $(".error-list-precode").css("display", "block");
    //             return false;
    //         }
    //         $.get(rootPath + "/dept/content/create_identifier",
    //             {
    //                 preIdentifier: preIdentifier
    //             },
    //             function (data, status) {
    //                 if (data.result != "success") {
    //                     dmallError(data.result);
    //                 } else {
    //                     var $resourceList = $("#resourceNo");
    //                     $resourceList.attr("value", "");
    //                     $resourceList.val(data.identifier);
    //                     $resourceList.data("resourceNo", data.identifier);
    //                     $("#resourceNo").removeClass("errorC");
    //                     $(".errorResourceId").hide();
    //                     resourceNo = data.identifier;
    //                     $("#metadataId").val(data.identifier);
    //                     $("#metadataId").removeClass("errorC");
    //                     $(".errorMetadataId").hide();
    //                 }
    //             },
    //             "json");
    //     }
    // );
    //点击文本框显示选择树
    $('#metaName').click(function () {
        $("#metaName").removeClass("errorC");
        $(".errorMetaName").hide();
        if ($("#list-meta").is(":hidden")) {
            $("#list-meta").show();
        }
       metaTag = 1;
    });
    $('#metaName').on('keyup', function () {
        searchMetaTree($metaTree);
    });
    //检查输入项是否在树中存在
    function getNodeInMetaTree(textName) {
        var pattern = textName;
        var options = {
            exactMatch: true,
            revealResults: true
        };
        var results = $metaTree.treeview('search', [pattern, options]);

        if (results.length != 0) {
            return results[0];
        } else {
            return null;
        }
    }
    //检查数据元选择框
    function checkMetaNameValue() {
        var string = $("#metaName").val();
        var nodeTmp = getNodeInMetaTree(string);
        if (null != nodeTmp) {
            selectNode = nodeTmp;
            $("#metaName").removeClass("errorC");
            $(".errorMetaName").hide();
        } else {
            $("#metaName").addClass("errorC");
            $(".errorMetaName").html("*请选择正确的数据元");
            $(".errorMetaName").css("display", "block");
            preventDefaultFlag = true;
            return true;
        }
        if ($("#metaName").val() == "") {
            $("#metaName").addClass("errorC");
            $(".errorMetaName").html("*请选择数据元");
            $(".errorMetaName").css("display", "block");
            preventDefaultFlag = true;
            return true;
        }
        else
            return false;
    };
    //提交关联数据元
    $("#meta_btn_commit").click(function(){
        if(checkMetaNameValue()){
            return false;
        }
        var $metaName = $("#metaName");
        var metaName = $metaName.val();
        var metaCode = $metaName.data("metacode");
        var cateCode = $metaName.data("catecode");
        var $selector = $("#addMetaModal").data("obj");
        $selector.attr('onclick', 'viewMeta(this);');
        $selector.text(metaName);
        $selector.siblings("div").show();
        $selector.data("metacode",metaCode);
        $selector.data("catecode",cateCode);
    });

    //获取第一页基础数据
    function getBaseParams() {
        var showType = $('input[name="showType"]').filter(":checked").val();
        var showLevel = "";
        if (showType == 0) {
            showLevel = $("#showLevel").val();
        } else if (showType == 1) {
            showLevel = $("#showLevel1").val();
        }
        var publicLevel = $('input[name="publicLevel"]').filter(":checked").val();
        var obj = getVirtualType();
        resourceTypeCode = obj.resourceTypeCode;
        if(obj.resourceTypeCode != "VIRTUAL"){
            var resTypeId = obj.resourceTypeId;
            var resTypeCode = obj.resourceTypeCode;
            var resDetailId = obj.resourceDetailId;
            var resDetailName = obj.resourceDetailName;
            var resDetailIndexCode = obj.resourceDetailIndexCode;
            if(obj.resourceTypeCode == "STRUCTFILE"){
                publicLevel = $('input[name="virtualPublicLevel"]').filter(":checked").val();
            }
        }else{
            var resTypeId = $("#resourceTypeId").val();
            var resTypeCode = obj.resourceTypeCode;
            var resDetailId = $("#resourceDetailId").val();
            var resDetailName = $("#resourceDetailName").val();
            var resDetailIndexCode = obj.resourceDetailIndexCode;
        }
        var catalogTempData = getCatalogTempData();
        getShareScopeCodes();
        getShareModeCodes();
        var baseParams = {
            id: catalogId,
            resourceNo: $("#resourceNo").val(),
            // metadataId: $("#metadataId").val(),
            resourceName: $("#resourceName").val(),
            provideDeptCode:$('#provideDeptCode').val(),
            directoryId:$('#directoryId').val(),
            directoryNo:$('#directoryNo').val(),
            directoryName:$('#directoryName').data('directoryName'),
            industryCode:$('#industryName').val(),
            businessCode:$('#businessName').val(),
            data1stCode:$('#data1stName').val(),
            data2ndCode:$('#data2ndName').val(),
            dataDetailCode:$('#dataDetailName').val(),
            dataPropertyCode:$('#dataPropertyName').val(),
            updateModeCode:$('#updateModeName').val(),
            updateCycleCode:$('#updateCycleName').val(),
            resourceDesc: $("#resourceDesc").val(),
            shareScopeCodes:shareScopeCodes,
            shareModeCodes: shareModeCodes,
            shareAreaCodes:$('#shareAreaCodes').val(),
            // shareAreaNames:shareAreaNames,
            shareDeptCodes:$('#shareDeptCodes').val(),
            // shareDeptNames:shareDeptNames,

            routinePowerDeptCode:$('#routinePowerDeptCode').val(),
            // routinePowerDeptName:$('#routinePowerDeptName').val(),
            // resourceTypeId: resTypeId,
            resourceTypeCode: resourceTypeCode,
            // resourceDetailId: resDetailId,
            // resourceDetailName: resDetailName,
            resourceDetailIndexCode: resDetailIndexCode,
            // subjectId: $("#subjectId").val(),
            // subjectName: $("#subjectName").val(),
            // subjectIndexCode: $("#subjectIndexCode").val(),
            // industryId: $("#industryId").val(),
            // industryIndexCode: $("#industryIndexCode").val(),
            deptId: $("#deptId").val(),
            deptName: $("#deptName").val(),
            // providerCode: $("#providerCode").val(),
            // providerLevel: $("#providerLevel").val(),
            // publicLevel: publicLevel,
            // vindicatorName: $("#vindicatorName").val(),
            // keyword: $("#keyword").val(),
            // accessLimit: $('input[name="accessLimit"]').filter(":checked").val(),
            // showLevel: showLevel,
            state: $("#state").val(),
            version: $("#version").val(),
            // showType: $('input[name="showType"]').filter(":checked").val(),
            changeReason: $("#changeReason").val(),
            opVersion: $("#opVersion").val(),
            catalogTemplateId: $("#catalogTemplateId").val(),
            catalogTemplateData: catalogTempData
        };
        return baseParams;
    };
    //获取模板数据
    function getCatalogTempData(){
        var $selector = $("#extentParamerDiv").find(".form-control");
        var size = $selector.size();
        var catalogTempParam = {};
        $selector.each(function(){
            var key = this.id;
            var val = $(this).val();
            catalogTempParam[key] = val;
        });  
        var catalogTempData = JSON.stringify(catalogTempParam);
        return catalogTempData;
    }
    //模板内表单验证
    function checkTempData(){
        var $selector = $("#extentParamerDiv").find("input");
        var $selector2 = $("#extentParamerDiv").find("textarea");
        var tempFlag = true;
        $selector.each(function(){
            if($(this).data("required") == 1){
                var errorMsg = $(this).data("name");
                if(checkNotBlank($(this),$(this).siblings("small"),"*请输入"+errorMsg)){
                    tempFlag = false;
                    return tempFlag;
                }
            }
        });
        $selector2.each(function(){
            if($(this).data("required") == 1){
                var errorMsg = $(this).data("name");
                if(checkNotBlank($(this),$(this).siblings("small"),"*请输入"+errorMsg)){
                    tempFlag = false;
                    return tempFlag;
                }
            }
        });
        return tempFlag;
    }
    //保存
    function submitShelve(callBack) {
        var baseParams = getBaseParams();
        resourceTypeId = comfirmResourceId(resourceTypeCode);
        var extraParams = ExtraCatalog.getExtraData(resourceTypeId);
        if(!extraParams){
            $("#shelveButton").attr('disabled', false);
            $("#newAndSubmitBtn").attr('disabled', false);
            return false;
        }
        var params = {
            baseParams: baseParams,
            extraParams: extraParams
        };
        console.log(params);
        var catalogJsonStr = JSON.stringify(params);
        //post方法
        $.post(rootPath + "/dept/content/catalog",
            {
                catalogJsonStr: catalogJsonStr,
                createType: createType
            },
            function (data, status) {
                if (data.result != "success") {
                    $("#shelveButton").attr('disabled', false);
                    $("#newAndSubmitBtn").attr('disabled', false);
                    dmallError(data.result);
                } else {
                    catalogId = data.catalogId;
                    $("#shelveButton").attr('disabled', false);
                    $("#newAndSubmitBtn").attr('disabled', false);
                    if (callBack == 0) {
                        location.href = rootPath + "/dept/content/catalog";
                    } else if (callBack == 1) {
                        var $reviewerList = $("#reviewerList");
                        $reviewerList.empty();
                        $("#shelveButton").attr('disabled', true);
                        $("#newAndSubmitBtn").attr('disabled', true);
                        $.get(rootPath + "/dept/content/submit/userlist",
                            {
                                ids: catalogId
                            },
                            function (data, status) {
                                if (data.result != "success") {
                                    dmallError(data.result);
                                } else {
                                    if(data.needNextOperator){
                                        $("#nextUserPara").show();
                                        $reviewerList.append(new Option("请选择", ""));
                                        for (var i = 0; i < data.users.length; i++) {
                                            var table = data.users[i];
                                            var newOption = new Option(table.name, table.id);
                                            $reviewerList.append(newOption);
                                        }
                                    }else{
                                        $("#nextUserPara").hide();
                                    }
                                    $('#newAndSubmitModal').modal({backdrop: 'static', keyboard: false});
                                }
                            },
                            "json");

                           // location.href = root+"../content/submit/catalogs/cid?id=" + catalogId + "&isView=false";
                    } else if (callBack == 3) {
                        var $backRoute = document.referrer;
                        if ($backRoute != "") {
                            location.href = document.referrer;
                        } else {
                            location.href = rootPath + "/dept/content/submit/catalogs";
                        }

                    } else if (callBack == 4) {
                        var $backRoute = document.referrer;
                        if ($backRoute != "") {
                            location.href = document.referrer;
                        } else {
                            location.href = rootPath + "/dept/content/review/catalogs";
                        }
                    }
                }
            },
            "json");
        return false;
    };
    // 审核同意
    function agreeSubmit() {
        var nextUserId = $("#reviewerList option:selected").val();
        /*if (nextUserId == undefined) {
            dmallError("请选择下一步操作人");
            return;
        }*/
        $.post(rootPath + "/dept/content/submit/catalog/cid",
            {
                id: catalogId,
                comment: $("#comment").val(),
                result: "Agree",
                nextUserId: nextUserId,
                cancelMode: $("input[name='cancelMode']").filter(":checked").val()
            },
            function (data, status) {
                if (data.result != "success") {
                    $("#newAndSubmit").attr("disabled",false);
                    dmallError(data.result);
                } else {
                    dmallNotifyAndLocation("资源目录提交成功", rootPath + "/dept/content/submit/catalogs");
                    // dmallNotifyAndLocation("资源目录提交成功", window.location.href);
                }
            },
            "json");
    }

    $("#newAndSubmit").click(function () {
        if (checkReviewerValue()) {
            return false;
        }
        $("#newAndSubmit").attr("disabled",true);
        $('#shelveButton').prop('disabled', true);
        $('#newAndSubmitBtn').prop('disabled', true);
        agreeSubmit();
    });
    $('.goToDraft').click(function () {
        dmallNotifyAndLocation("资源目录保存成功", rootPath + "/dept/content/draft/catalogs");
    });
    //重新编目
    $("#reNewBtn").click(function () {
        location.href = rootPath + "/dept/content/catalog";
    });
    //返回
    $("#beBack").click(function () {
        location.href = rootPath + "/dept/content/manage/catalogs";
    });
    $("#reviewerList").focus(function () {
        if ($("#reviewerList").children('option:selected').val() == "") {
            $("#reviewerList").removeClass("errorC");
            $(".errorReviewerList").hide();
        }
    });
    $("#reviewerList").blur(function () {
        checkReviewerValue();
    });
    function checkReviewerValue() {
        if ($("#reviewerList").children('option:selected').val() == "") {
            $("#reviewerList").addClass("errorC");
            $(".errorReviewerList").show();
            return true;
        }
    }

    $("#changeReason").focus(function () {
        var val = $("#changeReason").val();
        if (val == "" || !inputCheckNameLax2(val)) {
            $("#changeReason").removeClass("errorC");
            $(".errorReason").hide();
        }
    });
    function checkReason() {
        if (createType == "newVersion") {
            var val = $("#changeReason").val();
            if (val == "") {
                $("#changeReason").addClass("errorC");
                $(".errorReason").html("*请输入版本变更原因");
                $(".errorReason").css("display", "block");
                return true;
            }else if(!inputCheckNameLax2(val)){
                $("#changeReason").addClass("errorC");
                $(".errorReason").html("*请输入中文、英文字母、数字、标点符号");
                $(".errorReason").css("display", "block");
                return true;
            }
            else
                return false;
        }
        return false;
    };
    //失去焦点
    $("#changeReason").blur(function () {
        checkReason();
    });
    var oldDirectoryId = '';
    //点击上一步执行操作
    $("#lastStep").click(function () {
        $("#baseForm").show();
        for (i = 1; i <= 10; i++) {
            $("#resourceType" + i).hide();
        }
        $("#toRrlation").hide();
        $("#extentParamerDiv").show();
        $("#nextStep").show();
        $("#lastStep").hide();
        $("#shelveButton").hide();
        $("#newAndSubmitBtn").hide();
        $("#saveAndReview").hide();
        $("#changeBox").hide();
        if (createType == "copy" || createType == "newVersion") {
            $("#chooseCatalog").show();
        }
        if (createType == "copy" || createType == "new") {
            oldDirectoryId = sessionStorage['directoryId'];
        }
    });


    function comfirmResourceId(resourceTypeCode) {
        var resourceTypeId;
        if (resourceTypeCode == "ODPS") {
            resourceTypeId = 1;
        } else if (resourceTypeCode == "RDS" || resourceTypeCode == "ADS") {
            resourceTypeId = 2;
        } else if (resourceTypeCode == "DATAAPI") {
            resourceTypeId = 4;
        } else if (resourceTypeCode == "ONLINEURL") {
            resourceTypeId = 3;
        } else if (resourceTypeCode == "STRUCTFILE") {
            resourceTypeId = 5;
        } else if (resourceTypeCode == "COMMFILE") {
            resourceTypeId = 6;
        }else if (resourceTypeCode == "VIRTUAL") {
            resourceTypeId = 7;
        }
        return resourceTypeId;
    };

    //点击下一步执行操作
    $("#nextStep").click(function () {
        nextStep();
    });
    function nextStep() {
        getShareScopeCodes();
        getShareModeCodes();
        if(checkBasePageItems())
            return;
        if(!checkTempData()){
            return;
        }
        if(createType == 'new' || createType == 'copy'){
            if(oldDirectoryId != sessionStorage['directoryId']){
                getAllDataDirectoryItem(sessionStorage['directoryId']);
            }
        }
        resourceTypeId = comfirmResourceId(resourceTypeCode);
        if ((catalogId == "") && ((resourceTypeId == 5) || (resourceTypeId == 6)))
            ExtraCatalog.init(resourceTypeId);
        if(resourceTypeId == 4){
            if(!ExtraCatalog.init(resourceTypeId)){
                return false;
            }
        }
        if (!preventDefaultFlag) {
            $("#baseForm").hide();
            $("#resourceType9").show();
            $('#toRrlation').show();
            $("#nextStep").hide();
            $("#lastStep").show();
            $('#extentParamerDiv').hide();

            // for (var i = 1; i <= 8; i++) {
            //     $("#resourceType" + i).hide();
            // }
            // if (resourceTypeId != 0) {
            //     $("#resourceType" + resourceTypeId).show();
            // }

            $("#chooseCatalog").hide();
            // $("#extentParamerDiv").hide();
            // $("#nextStep").hide();
            // $("#changeBox").show();
            // $("#shelveButton").show();
            // $("#newAndSubmitBtn").show();
            // $("#saveAndReview").show();
            // $("#lastStep").show();
        }
    }

    //注册资源可见类别 radio的change事件
    $("[name='showType']").on("change", showTypeChange);
    function showTypeChange() {
        var radio = $('input[name="showType"]').filter(":checked");
        if (radio.length) {
            if (radio.val() == 0) {
                $("#showType0").show();
                $("#showType1").hide();
            } else {
                $("#showType1").show();
                $("#showType0").hide();
            }
        }
    };

    //是否对公众公开类别radio的change事件
    $("[name='publicLevel']").on("change", publicLevelChange);
    function publicLevelChange(){
        var radio = $('input[name="publicLevel"]').filter(":checked");
        if (radio.length) {
            if (radio.val() == 0){
                $("#publicLevelDiv").show();
                $(".errorPublicLevel").hide();
                $("input:radio[name='accessLimit']").eq(0).attr("checked",true);
            } else {
                $("#publicLevelDiv").hide();
                $(".errorPublicLevel").show();
                $(".errorPublicLevel").html("（未登录用户也将可以下载该资源）");
                $("input:radio[name='accessLimit']").eq(1).attr("checked",true);
                $("input:radio[name='showType']").eq(0).attr("checked",true);
                $("#showLevel").val(0);
            }
        }
    };

    //初始化更新时间的值
    function initUpdateDate() {
        var date = new Date();
        var currentDate = "";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        currentDate += year;
        if (month >= 10) {
            currentDate += "-" + month;
        }
        else {
            currentDate += "-" + "0" + month;
        }
        if (day >= 10) {
            currentDate += "-" + day;
        }
        else {
            currentDate += "-" + "0" + day;
        }
        if (resourceTypeCode == "ODPS") {
            $("#updateDate").val(currentDate);
        } else if (resourceTypeCode == "RDS" || resourceTypeCode == "ADS") {
            $("#updateDate2").val(currentDate);
        }
    }

    //检查信息资源标识符输入框
    // $("#resourceNo").focus(function () {
    //     if ($("#resourceNo").val() == "") {
    //         $("#resourceNo").removeClass("errorC");
    //         $(".errorResourceId").hide();
    //     }
    // });
    // function checkResourceIdValue() {
    //     if ($("#resourceNo").val() == "") {
    //         $("#resourceNo").addClass("errorC");
    //         $(".errorResourceId").html("*请选择");
    //         $(".errorResourceId").css("display", "block");
    //         //preventDefaultFlag = true;
    //         return true;
    //     }
    //     else
    //         return false;
    // };
    // //失去焦点
    // $("#resourceNo").blur(function () {
    //     checkResourceIdValue();
    // });

    //检查元数据标识符输入框
    $("#metadataId").focus(function () {
        if ($("#metadataId").val() == "") {
            $("#metadataId").removeClass("errorC");
            $(".errorMetadataId").hide();
        }
    });
    function checkMetadataIdValue() {
        if ($("#metadataId").val() == "") {
            $("#metadataId").addClass("errorC");
            $(".errorMetadataId").html("*请输入元数据标识符");
            $(".errorMetadataId").css("display", "block");
            //preventDefaultFlag = true;
            return true;
        }
        else
            return false;
    };
    //失去焦点
    $("#metadataId").blur(function () {
        checkMetadataIdValue();
    });

    //检查信息资源名称输入框
    // $("#resourceName").focus(function () {
    //     if ($("#resourceName").val() == "") {
    //         $("#resourceName").removeClass("errorC");
    //         $(".errorResourceTitle").hide();
    //     }
    // });
    // function checkResourceTitleValue() {
    //     if ($("#resourceName").val() == "") {
    //         $("#resourceName").addClass("errorC");
    //         $(".errorResourceTitle").html("*请输入信息资源名称");
    //         $(".errorResourceTitle").css("display", "block");
    //         preventDefaultFlag = true;
    //         return true;
    //     }
    //     else
    //         return false;
    // };
    //失去焦点
    // $("#resourceName").blur(function () {
    //     checkResourceTitleValue();
    // });

    //检查信息资源摘要输入框
    // $("#resourceDesc").focus(function () {
    //     if ($("#resourceDesc").val() == "") {
    //         $("#resourceDesc").removeClass("errorC");
    //         $(".errorResourceAbstract").hide();
    //     }
    // });
    // function checkResourceAbstractValue() {
    //     if ($("#resourceDesc").val() == "") {
    //         $("#resourceDesc").addClass("errorC");
    //         $(".errorResourceAbstract").html("*请输入信息资源摘要");
    //         $(".errorResourceAbstract").css("display", "block");
    //         preventDefaultFlag = true;
    //         return true;
    //     }
    //     else
    //         return false;
    // };
    //失去焦点
    // $("#resourceDesc").blur(function () {
    //     checkResourceAbstractValue();
    // });

    //检查资源形态分类选择框
    function checkResourceTypeIdValue() {
        var string = $("#resourceDetailName").val();
        var nodeTmp = getNodeInResTree(string);
        if (null != nodeTmp) {
            selectNode = nodeTmp;
            $("#resourceDetailName").removeClass("errorC");
            $(".errorResourceTypeId").hide();
        } else {
            $("#resourceDetailName").addClass("errorC");
            $(".errorResourceTypeId").html("*请选择正确的资源形态分类");
            $(".errorResourceTypeId").css("display", "block");
            preventDefaultFlag = true;
            return true;
        }
        if ($("#resourceDetailName").val() == "") {
            $("#resourceDetailName").addClass("errorC");
            $(".errorResourceTypeId").html("*请选择资源形态分类");
            $(".errorResourceTypeId").css("display", "block");
            preventDefaultFlag = true;
            return true;
        }
        else
            return false;
    };

    //检查主题分类选择框
    // function checkCategoryIdValue() {
    //     var string = $("#subjectName").val();
    //     var nodeTmp = getNodeInSubjectTree(string);
    //     if (null != nodeTmp) {
    //         selectNode = nodeTmp;
    //         $("#subjectName").removeClass("errorC");
    //         $(".errorCategoryId").hide();
    //     } else {
    //         $("#subjectName").addClass("errorC");
    //         $(".errorCategoryId").html("*请选择正确的主题分类");
    //         $(".errorCategoryId").css("display", "block");
    //         preventDefaultFlag = true;
    //         return true;
    //     }
    //     if ($("#subjectName").val() == "") {
    //         $("#subjectName").addClass("errorC");
    //         $(".errorCategoryId").html("*请选择主题分类");
    //         $(".errorCategoryId").css("display", "block");
    //         preventDefaultFlag = true;
    //         return true;
    //     }
    //     else if ($("#subjectId").val() == "") {
    //         $("#subjectName").addClass("errorC");
    //         $(".errorCategoryId").html("*请选择主题分类");
    //         $(".errorCategoryId").css("display", "block");
    //         preventDefaultFlag = true;
    //         return true;
    //     }
    //     else
    //         return false;
    // };

    //检查元数据维护方输入框
    $("#vindicatorName").focus(function () {
        if ($("#vindicatorName").val() == "") {
            $("#vindicatorName").removeClass("errorC");
            $(".errorVindicatorId").hide();
        }
    });
    function checkVindicatorName() {
        if ($("#vindicatorName").val() == "") {
            $("#vindicatorName").addClass("errorC");
            $(".errorVindicatorId").html("*请输入元数据维护方");
            $(".errorVindicatorId").css("display", "block");
            preventDefaultFlag = true;
            return true;
        }
        else
            return false;
    };
    //失去焦点
    $("#vindicatorName").blur(function () {
        checkVindicatorName();
    });
    //检查关键字输入框
    $("#keyword").focus(function () {
        if ($("#keyword").val() == "") {
            $("#keyword").removeClass("errorC");
            $(".errorKeyword").hide();
        }
    });
    function checkKeywordValue() {
        if ($("#keyword").val() == "") {
            $("#keyword").addClass("errorC");
            $(".errorKeyword").html("*请输入关键字");
            $(".errorKeyword").css("display", "block");
            preventDefaultFlag = true;
            return true;
        }
        else
            return false;
    };
    //失去焦点
    $("#keyword").blur(function () {
        checkKeywordValue();
    });

    function checkBasePageItems() {
        preventDefaultFlag = false;

        if(!checkBasePage())
            if(!checkReason())
                return false;
        return true;
    };

    // function checkBasePage() {
    //     //检查数据资源编号
    //     if(!checkResourceIdValue())
    //         //检查元数据标识符输入框
    //         // if(!checkMetadataIdValue())
    //             //检查信息资源名称输入框
    //             if(!checkResourceTitleValue())
    //                 //检查信息资源摘要输入框
    //                 // if(!checkResourceAbstractValue())
    //                     //检查资源形态分类选择框
    //                     // if(!checkResourceTypeIdValue())
    //                         //检查主题分类选择框
    //                         // if(!checkCategoryIdValue())
    //                             //检查元数据维护方输入框
    //                             // if(!checkVindicatorName())
    //                                 //检查关键字输入框
    //                                 // if(!checkKeywordValue())
    //                                     return false;
    //     return true;
    // };

    function checkExtraPage() {
        checkSplitPk();
        var preventExtraFlag = ExtraCatalog.check(resourceTypeId);
        return preventExtraFlag;
    };

    function checkAllItems() {
        preventDefaultFlag = false;
        if(checkBasePage()) {
            preventDefaultFlag = true;
            return true;
        }
        else if (checkExtraPage()) {
            preventDefaultFlag = true;
            return true;
        }
        else
            return false;
    };
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

    // $("body").not("#industryName").click(function () {
    //     if (industryTag != 1) {
    //         $("#list-industry").hide();
    //         if ($("#industryName").val() != 0) {
    //             checkIndustry();
    //         }
    //     }
    //     industryTag = 0;
    //     if (subjectTag != 1) {
    //         $("#list-subject").hide();
    //         if ($("#subjectName").val() != 0) {
    //             checkCategoryIdValue();
    //         }
    //     }
    //     subjectTag = 0;
    //
    //     if (resTag != 1) {
    //         $("#list-res").hide();
    //         if ($("#resourceDetailName").val() != 0) {
    //             checkResourceTypeIdValue();
    //         }
    //     }
    //     resTag = 0;
    //     if (createType == "copy" || createType == "newVersion") {
    //         if (selectedTag != 1) {
    //             if (!($("#catalogListWrap").is(":hidden"))) {
    //                 if (outsideTag != 1) {
    //                     $("#catalogListWrap").hide();
    //                 }
    //                 if ($("#selectedId").val() != "" && outsideTag != 1) {
    //                     checkResValue();
    //                 }
    //                 outsideTag = 0;
    //             }
    //
    //         }
    //         selectedTag = 0;
    //     }
    //
    //     if (metaTag != 1) {
    //         $("#list-meta").hide();
    //         if ($("#metaName").val() != 0) {
    //             checkMetaNameValue();
    //         }
    //     }
    //     metaTag = 0;
    // });



    //更改
    var businessCode = '';
    var directoryName = '';
    var industryCode = '';
    var data1stCode = $('#data1stCode').val();
    var data2ndCode = $('#data2ndCode').val();
    var dataDetailCode = $('#dataDetailCode').val();
    var dataPropertyCode = $('#dataPropertyCode').val();
    var directoryId = '';
    var directoryNo = '';
    var deptCode = $('#deptCode').val();


    //数据资源编号
    var resourceNoFirstNum = 0;
    if(createType == 'new'){

        var initCode = 'D-'+ deptCode +'-ZNB-01-111100001';
        $resourceNo.val(initCode);
    }
    function initResourceIdValue() {
        var str = $resourceNo.val();
        var arr = str.split('-');
        if ($resourceNo.val() == "") {
            return true;
        } else if (arr.length != 5 ){
            $resourceNo.addClass("errorC");
            $(".errorResourceNo").html("*输入数据资源编号格式错误");
            $(".errorResourceNo").css("display", "block");
            return true;
        } else if (arr[4].length != 9){
            $resourceNo.addClass("errorC");
            $(".errorResourceNo").html("*输入数据资源编号格式错误");
            $(".errorResourceNo").css("display", "block");
            return true;
        }
        else
            return false;
    }
    var oldDirectoryNo = '';
    function initData(){
        if(!initResourceIdValue()){
            var str = $resourceNo.val();
            var arr = str.split('-');
            //更改所属目录编号
            $('#directoryName').val(arr[2] + '-' + arr[3] + '-' + arr[4]);
            directoryNo =arr[2] + '-' + arr[3] + '-' + arr[4];
            $('#directoryNo').val(arr[2] + '-' + arr[3] + '-' + arr[4]);
            getDirectoryId(directoryNo);
            //更改行业类别
            industryCode = arr[2];
            //更改公安业务分类
            businessCode = arr[3];
            resourceNoFirstNum = arr[4][0];
            if(resourceNoFirstNum != 9){
                //更改数据资源要素一级分类
                data1stCode = arr[4][0];
                //更改数据资源要素二级分类
                data2ndCode = arr[4][1];
                //更改数据资源要素细目分类
                dataDetailCode = arr[4][2];
                //更改数据资源属性分类
                dataPropertyCode = arr[4][3];
            }
        }
    }
    initData();
    //失去焦点
    $resourceNo.blur(function () {
        if(checkResourceIdValue()){
            return;
        };
        changeAllSelect();
        checkResValue();
    });

    function changeAllSelect(){
        var str = $resourceNo.val();
        var arr = str.split('-');
        //更改所属目录编号
        directoryNo = arr[2] + '-' + arr[3] + '-' + arr[4];
        // $('#directoryName').val(arr[2] + '-' + arr[3] + '-' + arr[4]);
        //更改行业类别
        industryCode = arr[2];
        $('#industryName').val(industryCode);
        // getIndustryName();
        //更改公安业务分类
        businessCode = arr[3];
        $('#businessName').val(businessCode);
        // getBusinessName();
        resourceNoFirstNum = arr[4][0];
        if(resourceNoFirstNum != 9){
            //更改数据资源要素一级分类
            $('#data1stName').val(parseInt(arr[4][0]));
            //更改数据资源要素二级分类
            $('#data2ndName').val(parseInt(arr[4][1]));
            //更改数据资源要素细目分类
            $('#dataDetailName').val(parseInt(arr[4][2]));
            //更改数据资源属性分类
            $('#dataPropertyName').val(parseInt(arr[4][3]));
        }
        getDirectoryId(directoryNo);
        $('#errorResourceNo').hide().val('');
    }
    //数据资源编号验证
    var allIndustryList = [];
    var allBusinessList = [];
    var allData1stList = [];
    var allData2ndList = [];
    var allDataDetailList = [];
    var allDataPropertyList = [];

    $resourceNo.focus(function () {
        $('.notifications').empty();
        if ($resourceNo.val() == "") {
            $resourceNo.removeClass("errorC");
            $(".errorResourceNo").hide();
        }
        if($(".errorResourceNo").html()== "*输入第一项为大写字母D"){
            var str = $resourceNo.val();
            var arr = str.split('-');
            arr[0] = 'D';
            str = arr.join('-');
            $resourceNo.val(str);
        }else if($(".errorResourceNo").html()== "*输入第二项事权单位编号不能更改"){
            var str = $resourceNo.val();
            var arr = str.split('-');
            arr[1] = deptCode;
            str = arr.join('-');
            $resourceNo.val(str);
        }
    });
    function inputFirstCodeCheck(string){
        var regex = /^[A-Za-z]{1,16}$/;
        return regex.test(string);
    }
    function inputLastCodeCheck(string){
        var regex = /^[0-9]{1,16}$/;
        return regex.test(string);
    }

    function checkResourceIdValue() {
        var str = $resourceNo.val();
        var arr = str.split('-');
        if ($resourceNo.val() == "") {
            $resourceNo.addClass("errorC");
            $(".errorResourceNo").html("*请输入数据资源编号");
            $(".errorResourceNo").css("display", "block");
            //preventDefaultFlag = true;
            return true;
        } else if (arr.length != 5 ){
            $resourceNo.addClass("errorC");
            $(".errorResourceNo").html("*输入数据资源编号格式错误");
            $(".errorResourceNo").css("display", "block");
            return true;
        }else if(arr[0].length != 1 || arr[0] != 'D'){
            $resourceNo.addClass("errorC");
            $(".errorResourceNo").html("*输入第一项为大写字母D");
            $(".errorResourceNo").css("display", "block");
            return true;
        }else if(arr[1].length != 12 || arr[1] != deptCode){
            $resourceNo.addClass("errorC");
            $(".errorResourceNo").html("*输入第二项事权单位编号不能更改");
            $(".errorResourceNo").css("display", "block");
            return true;
        }else if (arr[4].length != 9 || !inputLastCodeCheck(arr[4])){
            $resourceNo.addClass("errorC");
            $(".errorResourceNo").html("*输入最后一项为9位数字");
            $(".errorResourceNo").css("display", "block");
            return true;
        }else if(allIndustryList.indexOf(arr[2]) == -1){
            $resourceNo.addClass("errorC");
            $(".errorResourceNo").html("*不存在该行业类别编号");
            $(".errorResourceNo").css("display", "block");
            return true;
        }else if(allBusinessList.indexOf(arr[3]) == -1){
            $resourceNo.addClass("errorC");
            $(".errorResourceNo").html("*不存在该公安业务分类编号");
            $(".errorResourceNo").css("display", "block");
            return true;
        }else if(allData1stList.indexOf(arr[4][0]) == -1){
            if(arr[4][0] != 9){
                $resourceNo.addClass("errorC");
                $(".errorResourceNo").html("*不存在该数据资源要素一级分类编号");
                $(".errorResourceNo").css("display", "block");
                return true;
            }
        }else if(allData2ndList.indexOf(arr[4][1]) == -1){
            $resourceNo.addClass("errorC");
            $(".errorResourceNo").html("*不存在该数据资源要素二级分类编号");
            $(".errorResourceNo").css("display", "block");
            return true;
        }else if(allDataDetailList.indexOf(arr[4][2]) == -1){
            $resourceNo.addClass("errorC");
            $(".errorResourceNo").html("*不存在该数据资源要素细目分类编号");
            $(".errorResourceNo").css("display", "block");
            return true;
        }else if(allDataPropertyList.indexOf(arr[4][3]) == -1){
            $resourceNo.addClass("errorC");
            $(".errorResourceNo").html("*不存在该数据资源属性分类编号");
            $(".errorResourceNo").css("display", "block");
            return true;
        }
        else
            return false;
    };

    //数据资源名称
    var $resourceName = $('#resourceName');
    //数据资源名称聚焦
    $resourceName.focus(function () {
        var val = $resourceName.val();
        if (val == "" || !inputNameReg(val)) {
            $resourceName.removeClass("errorC");
            $(".errorResourceName").hide();
        }
    });
    //失去焦点
    $resourceName.blur(function () {
        checkResourceTitleValue();
        directoryNo = $('#directoryName').val();
        getDirectoryId(directoryNo);
    });
    function inputNameReg(string) {
        var regex = /^(?!_)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
        return regex.test(string);
    }
    function checkResourceTitleValue() {
        var val = $("#resourceName").val();
        if ( val == "") {
            $("#resourceName").addClass("errorC");
            $(".errorResourceName").html("*请输入数据资源名称");
            $(".errorResourceName").css("display", "block");
            // preventDefaultFlag = true;
            return true;
        // }else if(!inputNameReg(val)){
        //     $("#resourceName").addClass("errorC");
        //     $(".errorResourceName").html("*请输入中文、数字、字母、下划线,不能由下划线开头");
        //     $(".errorResourceName").css("display", "block");
        //     return true;
        }else
            return false;
    };
    //数据资源事权单位
    var $routinePowerDeptName = $('#routinePowerDeptName');
    var routinePowerDeptCode = $('#routinePowerDeptCode').val();
    var routinePowerDeptName = $routinePowerDeptName.val();

    $('#chooseRoutinePowerDept').click(function () {
        $routinePowerDeptName.removeClass("errorC");
        $('.errorRoutinePowerDept').hide();
        openRoutinePowerDept();
    });
    function openRoutinePowerDept() {
        //打开模态框
        $('#addRoutinePowerDept').modal({backdrop: 'static', keyboard: false});
        /*数据资源事权单位*/
        getRoutinePowerDeptList();
    }
    var $routinePowerDeptTree;
    function getRoutinePowerDeptList() {
        $.get(rootPath + "/organ/organCodes/tree", {},
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    $routinePowerDeptTree = $('#list-routinePowerDept').treeview({
                        data: data.organCodeList,
                        onNodeSelected: function (event, node) {
                            var $provideDeptList = $("#routinePowerDeptName");
                            $provideDeptList.data("routinePowerDeptCode", node.code);
                            $provideDeptList.data("routinePowerDeptName", node.text);
                        }
                    });
                    var list = $('#list-routinePowerDept').children().children();
                } else {
                    dmallError("获取数据资源提供单位列表失败");
                }
            },
            "json"
        );
    }
    //数据资源事权单位提交
    $("#routinePowerDept_btn_commit").click(function () {
        routinePowerDeptCode = $routinePowerDeptName.data('routinePowerDeptCode');
        routinePowerDeptName = $routinePowerDeptName.data('routinePowerDeptName');
        $("#routinePowerDeptCode").val(routinePowerDeptCode);
        $("#routinePowerDeptName").val(routinePowerDeptName);
    });
    //数据资源事权单位验证
    function checkRoutinePowerDeptNameValue() {
        if($('#routinePowerDeptName').val()){
            return false;
        }else {
            checkNotBlank($('#routinePowerDeptName'),$('.errorRoutinePowerDept'),'*请选择数据资源事权单位');
            return true;
        }
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

    //所属目录编号
    var $directoryName = $('#directoryName');
    //点击请选择
    $('#chooseDirectory').click(function () {
        $('#resourceNo').removeClass('errorC');
        $('.errorResourceNo').hide();
        openDirectoryName();
        $('#directoryName_btn_commit').prop('disabled', true);
    });
    function openDirectoryName() {
        //打开模态框
        $('#addDirectoryName').modal({backdrop: 'static', keyboard: false});
        $('#search-directoryNo').val('');
        /*所属目录编号*/
        getDirectoryCode(1);
    }
    //
    function translateStr(str) {
        str = str.replace(/</g,'&lt;');
        str = str.replace(/>/g,'&gt;');
        str = str.replace(/\'/g,"&apos;");
        str = str.replace(/\"/g,"&quot;");
        return str;
    }
    //查询
    $('#search-directoryNo').keyup(function () {
        getDirectoryCode(1);
    });
    //获取所属目录编号
    var $directoryList = $('#list-directoryName');
    var directoryNameTree = '';
    var perPageNum = 10;
    function getDirectoryCode(num) {
        $.get(rootPath + "/directory/datadirectory_list", {
                keyword:$('#search-directoryNo').val(),
                pageNumber:num,
                pageSize:perPageNum
            },
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    var dataEntityList = data.dataEntityList;
                    var totalPages = dataEntityList.totalPages;
                    var list = dataEntityList.result;
                    if(list.length != 0){
                        for(var i = 0; i < list.length; i++){
                            var titleName = list[i].directoryName;
                            titleName = translateStr(titleName);
                            list[i]['text'] = '<span  style="float:left;margin-top: -17px;width:450px;height:17px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;" title="'+ list[i].directoryNo + ' ' + titleName+'">' + list[i].directoryNo + ' ' + titleName+'</span>';
                        }
                        initDirectoryPage(num, totalPages);
                        directoryNameTree = $directoryList.treeview({
                            data: list,
                            onNodeSelected: function (event, node) {
                                $directoryName.data("directoryId", node.id);
                                $directoryName.data("directoryNo", node.directoryNo);
                                $('#directoryName_btn_commit').prop('disabled', false);
                            }
                        });
                    }else{
                        $directoryList.html('没有数据！');
                        initDirectoryPage(1,1);
                    }
                } else {
                    dmallError("获取所属目录编号列表失败");
                }
            },
            "json"
        );
    }
    function initDirectoryPage(pageNumber,totalPages, type) {
        $("#pageNum").empty();

        if (pageNumber == 1) {
            $("#pageNum").append('<li class="disabled pageTag"><a>&lt;</a></li>');
        } else {
            $("#pageNum").append('<li class="pageTag"><a>&lt;</a></li>');
            if (pageNumber >= 3 && totalPages >= 5) {
                $("#pageNum").append('<li class="pageTag"><a>1</a></li>');
            }
        }
        if (pageNumber > 3 && totalPages > 5) {
            $("#pageNum").append('<li class="pageTag"><a>...</a></li>');
        }
        if ((totalPages - pageNumber) < 2 && pageNumber > 2) {
            if ((totalPages == pageNumber) && pageNumber > 3) {
                $("#pageNum").append('<li class="pageTag"><a>' + (parseInt(pageNumber) - 3) + '</a></li>');
            }
            $("#pageNum").append('<li class="pageTag"><a>' + (parseInt(pageNumber) - 2) + '</a></li>');
        }

        if (pageNumber > 1) {
            $("#pageNum").append('<li class="pageTag"><a>' + (parseInt(pageNumber) - 1) + '</a></li>');
        }
        $("#pageNum").append('<li class="active pageTag"><a>' + parseInt(pageNumber) + '</a></li>');
        if ((totalPages - pageNumber) >= 1) {
            $("#pageNum").append('<li class="pageTag"><a>' + (parseInt(pageNumber) + 1) + '</a></li>');
        }
        if (pageNumber < 3) {
            if ((pageNumber + 2) < totalPages) {
                $("#pageNum").append('<li class="pageTag"><a>' + (parseInt(pageNumber) + 2) + '</a></li>');
            }
            if ((pageNumber < 2) && ((pageNumber + 3) < totalPages)) {
                $("#pageNum").append('<li class="pageTag"><a>' + (parseInt(pageNumber) + 3) + '</a></li>');
            }
        }
        if ((totalPages - pageNumber) >= 3 && totalPages > 5) {
            $("#pageNum").append('<li class="pageTag"><a >...</a></li>');
        }

        if (pageNumber == totalPages || type == "create") {
            $("#pageNum").append('<li class="disabled pageTag"><a>&gt;</a></li>');
        } else {
            if ((totalPages - pageNumber) >= 2) {
                $("#pageNum").append('<li class="pageTag"><a>' + totalPages + '</a></li>');
            }
            $("#pageNum").append('<li class="pageTag"><a>&gt;</a></li>');
        }
    }
    // 点击下面的页码改变的页面数据
    $("#pageNum").on("click", ".pageTag", function () {
        if (!$(this).hasClass("disabled")) {
            var pageNumber = $(this).children("a").text();
            var active = parseInt($("#pageNum li.active a").text());
            if (pageNumber != "<" && pageNumber != ">"  && pageNumber!= '...') {
                getDirectoryCode(parseInt(pageNumber));
            } else if (pageNumber == "<") {
                getDirectoryCode(parseInt(active - 1));
            } else if (pageNumber == ">") {
                getDirectoryCode(parseInt(active + 1));
            }
        }
    });
    //所属目录编号提交
    $("#directoryName_btn_commit").click(function () {
        directoryId = $directoryName.data('directoryId');
        $('#directoryId').val(directoryId);
        sessionStorage['directoryId'] = directoryId;
        directoryNo = $directoryName.data('directoryNo');
        $("#directoryNo").val(directoryNo);
        $("#directoryName").val(directoryNo);
        changeOtherSelect();
        checkResValue();
    });
    //更改
    function changeOtherSelect() {
        var str = $resourceNo.val();
        if(str == ''){
            str = 'D-'+ deptCode +'-ZNB-01-111100001';
        }
        var arr = str.split('-');
        var arr2 = $directoryName.val().split('-');
        arr = arr.splice(0, 2).concat(arr2);
        //更改数据资源编号
        $resourceNo.val(arr.join('-'));
        changeAllSelect();
    }
    function getDirectoryId(no) {
        if(no!='' && no!= null){
            $.get(rootPath + "/directory/datadirectory/directoryNo", {
                    keyword:no
                },
                function (data, status) {
                    if ((status == "success") && (data.result == "success")) {
                        var list = data.dataEntityList;
                        if(list != null){
                            $('#directoryId').val(list.id);
                            $('#directoryNo').val(list.directoryNo);
                            $('#directoryName').val(list.directoryNo);
                            $('#directoryName').data('directoryId',list.id);
                            $('#directoryName').data('directoryNo',list.directoryNo);
                            $('#directoryName').data('directoryName',list.directoryName);
                            sessionStorage['directoryId'] = list.id;
                            oldDirectoryNo = list.directoryNo;
                        }else {
                            $('#directoryNo').val('');
                            $('#directoryName').val('');
                            oldDirectoryNo = '';
                            sessionStorage['directoryId'] = '0';
                        }
                    } else {
                        dmallError("获取所属目录编号列表失败");
                    }
                },
                "json"
            );
        }
        // $.get(rootPath + "/directory/no/"+no, {},
        //     function (data, status) {
        //         if ((status == "success") && (data.result == "success")) {
        //             var list = data.dataDirectory;
        //             if(list != null){
        //                     return list;
        //             }else{
        //                 return false;
        //             }
        //
        //         } else {
        //             dmallError(data.result);
        //         }
        //     },
        //     "json"
        // );
    }

    //行业类别
    var $industryName = $('#industryName');
    //获取行业类别
    function getIndustryName() {
        $.get(
            rootPath+"/code/industrys",
            {},
            function(data, status){
                if(data.result != "success"){
                    dmallError(data.result);
                }else {
                    var industryCodeList = data.industryCodeList;
                    var html = '';
                    for(var i = 0; i < industryCodeList.length; i++){
                        allIndustryList.push(industryCodeList[i].code);
                        if (industryCodeList[i].code == industryCode){
                            html += '<option selected value="' + industryCodeList[i].code + '">' + industryCodeList[i].code + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ industryCodeList[i].name + '</option>';
                        }else{
                            html += '<option value="' + industryCodeList[i].code + '">' + industryCodeList[i].code + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ industryCodeList[i].name + '</option>';
                        }
                    }
                    $industryName.html(html);
                    $('#appIndustryCode').html(html).children('option').removeAttr('selected');
                }
            },
            "json"
        );
    }
    getIndustryName();
    //选择option
    $industryName.click(function () {
        industryCode = $industryName.val();
        if(industryCode != '0'){
            changeSelect(industryCode, 2);
        }
        if($('.errorResourceNo').html() == '*不存在该行业类别'){
            $resourceNo.removeClass('errorC');
            $('.errorResourceNo').css('display', 'none').val('');
        }
    });
    //行业类别,公安业务分类选择后更改
    function changeSelect(value, n) {
        var str = $resourceNo.val();
        var arr = str.split('-');
        arr[n] = value;
        if(str == ''){
            arr[0] = 'D';
            arr[1] = deptCode;
            if(n == 2){
                arr[3] = $('#businessName').val();
            }else {
                arr[2] = $('#industryName').val();
            }
            arr[4] = $('#data1stName').val()+$('#data2ndName').val()+$('#dataDetailName').val()+$('#dataPropertyName').val()+'00001';
        }
        str=arr.join('-');
        arr = str.split('-');
        //更改数据资源编号
        $resourceNo.val(str);
        //更改所属目录编号
        directoryNo = arr[2] + '-' + arr[3] + '-' + arr[4];
        // $('#directoryName').val(arr[2] + '-' + arr[3] + '-' + arr[4]);
        getDirectoryId(directoryNo);
        $industryName.removeClass('errorC');
        $('.errorIndustry').hide();
    }
    //行业类别验证
    function checkIndustryNameValue() {
        if($industryName.val() == '0'){
            checkSelectNotBlank($industryName,$('.errorIndustry'),'*请选择行业类别');
            return true;
        }else {
            return false;
        }
    }
    //select非空验证
    function checkSelectNotBlank($select,$errorClass,errorMsg) {
        $select.addClass("errorC");
        $errorClass.html(errorMsg);
        $errorClass.css("display", "block");
    }


    //公安业务分类
    var $businessName = $('#businessName');
    //获取公安业务分类
    function getBusinessName() {
        $.get(
            rootPath+"/code/businesses",
            {
                industryCode:'ZNB'
            },
            function(data, status){
                if(data.result != "success"){
                    dmallError(data.result);
                }else {
                    var businessCodeList = data.businessCodeList;
                    var html = '';
                    for(var i = 0; i < businessCodeList.length; i++){
                        allBusinessList.push(businessCodeList[i].code);
                        if (businessCodeList[i].code == businessCode){
                            html += '<option selected value="' + businessCodeList[i].code + '">' + businessCodeList[i].name + '&nbsp;&nbsp;&nbsp;'+ businessCodeList[i].code + '</option>';
                        }else{
                            html += '<option value="' + businessCodeList[i].code + '">' + businessCodeList[i].name + '&nbsp;&nbsp;&nbsp;'+ businessCodeList[i].code + '</option>';
                        }
                    }
                    $businessName.html(html);
                }
            },
            "json"
        );
    }
    getBusinessName();
    //选择option
    $businessName.click(function () {
        var value = $businessName.val();
        if(value != '0'){
            changeSelect(value, 3);
        }
        $businessName.removeClass('errorC');
        $('.errorBusiness').hide();
        if($('.errorResourceNo').html() == '*不存在该公安业务分类'){
            $resourceNo.removeClass('errorC');
            $('.errorResourceNo').css('display', 'none').val('');
        }
    });
    //公安业务分类验证
    function checkBusinessNameValue() {
        if($businessName.val() == '0'){
            checkSelectNotBlank($businessName,$('.errorBusiness'),'*请选择公安业务分类');
            return true;
        }else {
            return false;
        }
    }

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
                var html = '';
                for(var i = 0; i < data1stCodeList.length; i++){
                    allData1stList.push(data1stCodeList[i].code);
                    if(data1stCodeList[i].code == data1stCode){
                        html += '<option selected value="' + data1stCodeList[i].code + '">' + data1stCodeList[i].code + '&nbsp;&nbsp;'+ data1stCodeList[i].name + '</option>';
                    }else{
                        html += '<option value="' + data1stCodeList[i].code + '">' + data1stCodeList[i].code + '&nbsp;&nbsp;'+ data1stCodeList[i].name + '</option>';
                    }
                }
                $data1stName.html(html);
            }
        },
        "json"
    );
    //选择option
    $data1stName.click(function () {
        var value = $data1stName.val();
        if(value != '0'){
            changeSelect2(value, 0);
        }
        $data1stName.removeClass('errorC');
        $('.errorData1st').hide();
        if($('.errorResourceNo').html() == '*不存在该数据资源要素一级分类'){
            $resourceNo.removeClass('errorC');
            $('.errorResourceNo').css('display', 'none').val('');
        }
    });
    //数据资源要素一、二级分类，数据资源要素细目分类，属性分类选择后更改
    function changeSelect2(value, n) {
        var str = $resourceNo.val();
        var arr = str.split('-');
        if(str == ''){
            arr[0] = 'D';
            arr[1] = deptCode;
            arr[2] = $('#industryName').val();
            arr[3] = $('#businessName').val();
            arr[4] = $('#data1stName').val()+$('#data2ndName').val()+$('#dataDetailName').val()+$('#dataPropertyName').val()+'00001';

        }
        var arr4 = arr[4].split('');
        arr4[n]=value;
        arr[4]=arr4.join('');
        str=arr.join('-');
        arr = str.split('-');
        if(resourceNoFirstNum != 9){
            //更改数据资源编号
            $resourceNo.val(str);
            //更改所属目录编号
            directoryNo = arr[2] + '-' + arr[3] + '-' + arr[4];
        }
        // $('#directoryName').val(arr[2] + '-' + arr[3] + '-' + arr[4]);
        getDirectoryId(directoryNo);
    }
    //数据资源要素一级分类验证
    function checkData1stNameValue() {
        if($data1stName.val() == '0'){
            checkSelectNotBlank($data1stName,$('.errorData1st'),'*请选择数据资源要素一级分类');
            return true;
        }else {
            return false;
        }
    }

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
                var html = '';
                for(var i = 0; i < data2ndCodeList.length; i++){
                    allData2ndList.push(data2ndCodeList[i].code);
                    if(data2ndCodeList[i].code == data2ndCode){
                        html += '<option selected value="' + data2ndCodeList[i].code + '">' + data2ndCodeList[i].code + '&nbsp;&nbsp;'+ data2ndCodeList[i].name + '</option>';
                    }else{
                        html += '<option value="' + data2ndCodeList[i].code + '">' + data2ndCodeList[i].code + '&nbsp;&nbsp;'+ data2ndCodeList[i].name + '</option>';
                    }
                }
                $data2ndName.html(html);
            }
        },
        "json"
    );
    //选择option
    $data2ndName.click(function () {
        var value = $data2ndName.val();
        if(value != '0'){
            changeSelect2(value, 1);
        }
        $data2ndName.removeClass('errorC');
        $('.errorData2nd').hide();
        if($('.errorResourceNo').html() == '*不存在该数据资源要素二级分类'){
            $resourceNo.removeClass('errorC');
            $('.errorResourceNo').css('display', 'none').val('');
        }
    });
    //数据资源要素二级分类验证
    function checkData2ndNameValue() {
        if($data2ndName.val() == '0'){
            checkSelectNotBlank($data2ndName, $('.errorData2nd'), '*请选择数据资源要素二级分类');
            return true;
        }else {
            return false;
        }
    }

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
                var html = '';
                for(var i = 0; i < dataDetailCodeList.length; i++){
                    allDataDetailList.push(dataDetailCodeList[i].code);
                    if (dataDetailCodeList[i].code == dataDetailCode) {
                        html += '<option selected value="' + dataDetailCodeList[i].code + '">' + dataDetailCodeList[i].code + '&nbsp;&nbsp;'+ dataDetailCodeList[i].name + '</option>';
                    }else{
                        html += '<option value="' + dataDetailCodeList[i].code + '">' + dataDetailCodeList[i].code + '&nbsp;&nbsp;'+ dataDetailCodeList[i].name + '</option>';
                    }

                }
                $dataDetailName.html(html);
            }
        },
        "json"
    );
    //选择option
    $dataDetailName.click(function () {
        var value = $dataDetailName.val();
        if(value != '0'){
            changeSelect2(value, 2);
        }
        $dataDetailName.removeClass('errorC');
        $('.errorDataDetail').hide();
        if($('.errorResourceNo').html() == '*不存在该数据资源要素细目分类'){
            $resourceNo.removeClass('errorC');
            $('.errorResourceNo').css('display', 'none').val('');
        }
    });
    //数据资源要素细目分类验证
    function checkDataDetailNameValue() {
        if($dataDetailName.val() == '0'){
            checkSelectNotBlank($dataDetailName, $('.errorDataDetail'), '*请选择数据资源要素细目分类');
            return true;
        }else {
            return false;
        }
    }

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
                var html = '';
                for(var i = 0; i < dataPropertyCodeList.length; i++){
                    allDataPropertyList.push(dataPropertyCodeList[i].code);
                    if (dataPropertyCodeList[i].code == dataPropertyCode) {
                        html += '<option selected value="' + dataPropertyCodeList[i].code + '">' + dataPropertyCodeList[i].code + '&nbsp;&nbsp;'+ dataPropertyCodeList[i].name + '</option>';
                    }else{
                        html += '<option value="' + dataPropertyCodeList[i].code + '">' + dataPropertyCodeList[i].code + '&nbsp;&nbsp;'+ dataPropertyCodeList[i].name + '</option>';
                    }

                }
                $dataPropertyName.html(html);
            }
        },
        "json"
    );
    //选择option
    $dataPropertyName.click(function () {
        var value = $dataPropertyName.val();
        if(value != '0'){
            changeSelect2(value, 3);
        }
        $dataPropertyName.removeClass('errorC');
        $('.errorDataProperty').hide();
        if($('.errorResourceNo').html() == '*不存在该数据资源属性分类'){
            $resourceNo.removeClass('errorC');
            $('.errorResourceNo').css('display', 'none').val('');
        }
    });
    //数据资源属性分类验证
    function checkDataPropertyNameValue() {
        if($dataPropertyName.val() == '0'){
            checkSelectNotBlank($dataPropertyName, $('.errorDataProperty'), '*请选择数据资源属性分类');
            return true;
        }else {
            return false;
        }
    }

    //更新方式
    var $updateModeName = $('#updateModeName');
    var updateModeCode = $('#updateModeCode').val();
    $.get(
        rootPath+"/code/updateModes",
        {},
        function(data, status){
            if(data.result != "success"){
                dmallError(data.result);
            }else {
                var updataModeCodeList = data.updataModeCodeList;
                var html = "";
                for(var i = 0; i < updataModeCodeList.length; i++){
                    if(updataModeCodeList[i].code == updateModeCode){
                        html += '<option selected value="' + updataModeCodeList[i].code + '">'+ updataModeCodeList[i].code+ ' ' + updataModeCodeList[i].name + '</option>';
                    }else{
                        html += '<option value="' + updataModeCodeList[i].code + '">'+ updataModeCodeList[i].code+ ' ' + updataModeCodeList[i].name + '</option>';
                    }
                }
                $updateModeName.html(html);
                $('#dataTableUpdateModeCode').html(html).children('option').removeAttr('selected');
            }
        },
        "json"
    );
    $updateModeName.change(function () {
        $(this).removeClass('errorC');
        $('.errorUpdateMode').hide();
    });
    //更新方式验证
    function checkUpdateModeNameValue() {
        if($updateModeName.val() == '0'){
            checkSelectNotBlank($updateModeName, $('.errorUpdateMode'), '*请选择更新方式');
            return true;
        }else {
            return false;
        }
    }

    //更新周期
    var $updateCycleName = $('#updateCycleName');
    var updateCycleCode = $('#updateCycleCode').val();
    $.get(
        rootPath+"/code/updateCycles",
        {},
        function(data, status){
            if(data.result != "success"){
                dmallError(data.result);
            }else {
                var updateCycleCodeList = data.updateCycleCodeList;
                var html = "";
                for(var i = 0; i < updateCycleCodeList.length; i++){
                    if(updateCycleCodeList[i].code == updateCycleCode){
                        html += '<option selected value="' + updateCycleCodeList[i].code + '">'+ updateCycleCodeList[i].code+ '  ' + updateCycleCodeList[i].name + '</option>';
                    }else{
                        html += '<option value="' + updateCycleCodeList[i].code + '">'+ updateCycleCodeList[i].code+ '  ' + updateCycleCodeList[i].name + '</option>';
                    }
                }
                $updateCycleName.html(html);
                $('#dataTableUpdateCycleCode').html(html).children('option').removeAttr('selected');
            }
        },
        "json"
    );
    $updateCycleName.change(function () {
        $(this).removeClass('errorC');
        $('.errorUpdateCycle').hide();
    });
    //更新周期验证
    function checkUpdateCycleNameValue() {
        if($updateCycleName.val() == '0'){
            checkSelectNotBlank($updateCycleName, $('.errorUpdateCycle'), '*请选择更新周期');
            return true;
        }else {
            return false;
        }
    }

    //数据资源描述
    var $resourceDesc = $('#resourceDesc');
    //数据资源描述聚焦
    $resourceDesc.focus(function () {
        var val = $resourceDesc.val();
        if (val == "") {
            $resourceDesc.removeClass("errorC");
            $(".errorResourceDesc").hide();
        }
    });
    //失去焦点
    $resourceDesc.blur(function () {
        checkResourceDescValue();
    });
    function checkResourceDescValue() {
        var val = $("#resourceDesc").val();
        if ( val== "") {
            $("#resourceDesc").addClass("errorC");
            $(".errorResourceDesc").html("*请输入数据资源描述");
            $(".errorResourceDesc").css("display", "block");
            preventDefaultFlag = true;
            return true;
        }
        else
            return false;
    };

    //数据资源共享范围
    // $.get(
    //     rootPath+"/code/shareScopeCodes",
    //     {},
    //     function(data, status){
    //         if(data.result != "success"){
    //             dmallError(data.result);
    //         }else {
    //             var list = data['shareScopeCodeList'];
    //             var html1 = '<div class="col-sm-3">';
    //             var html2 = '<div class="col-sm-3">';
    //             for(var i = 0; i < list.length; i++){
    //                if(i%2 == 0){
    //                    html1 += '<label><input type="checkbox" name="shareScopeCode" id="shareScope_'+ list[i].code +'" value="'+ list[i].code +'"> &nbsp;'+ list[i].code +', '+ list[i].name +'</label><br>';
    //                }else {
    //                    html2 += '<label><input type="checkbox" name="shareScopeCode" id="shareScope_'+ list[i].code +'" value="'+ list[i].code +'"> &nbsp;'+ list[i].code +', '+ list[i].name +'</label><br>';
    //                }
    //             }
    //             html1 += '</div>';
    //             html2 += '</div>';
    //             $('#shareScope').html(html1+html2);
    //             initShareScopeCode();
    //         }
    //     },
    //     "json"
    // );
    //初始化
    function initShareScopeCode() {
        var shareScopeCode = $('#shareScopeCode').val();
        if(shareScopeCode == ''){
            $('#appointShare').val('ZYGXFW_01');
            $('#shareScopeCodes').hide();
            $('#shareAreaCodes').val('');
            $('#shareAreaNames').html('');
            $('#shareDeptCodes').val('');
            $('#shareDeptNames').html('');
        }else {
            if(shareScopeCode == 'ZYGXFW_01' || shareScopeCode == 'ZYGXFW_04'){
                $('#appointShare').val(shareScopeCode);
                $('#shareScopeCodes').hide();
                $('#shareAreaCodes').val('');
                $('#shareAreaNames').html('');
                $('#shareDeptCodes').val('');
                $('#shareDeptNames').html('');
            }else {
                $('#appointShare').val('appoint');
                $('#shareScopeCodes').show();
                var codeList = shareScopeCode.split(',');
                for(var i = 0; i < codeList.length; i++){
                    $('#shareScope_'+codeList[i]).attr('checked', true);
                    if(codeList[i] == 'ZYGXFW_02'){
                        $('#shareArea').show();
                        var shareAreaCodes = $('#shareAreaCodes').val();
                        var shareAreaCodeList = shareAreaCodes.split(',');
                        getShareAreaNames(shareAreaCodeList);
                    }
                    if(codeList[i] == 'ZYGXFW_03'){
                        $('#shareDept').show();
                        var shareDeptCodes = $('#shareDeptCodes').val();
                        var shareDeptCodeList = shareDeptCodes.split(',');
                        getShareDeptNames(shareDeptCodeList);
                    }
                }
            }
        }

    }
    initShareScopeCode();
    var shareScopeCodes = '';
    //获取数据资源共享范围
    function getShareScopeCodes() {
        var val = $('#appointShare').val();
        if(val == 'appoint'){
            var chk_value =[];
            $('input[name="shareScopeCode"]:checked').each(function(){
                chk_value.push($(this).val());
            });
            shareScopeCodes = chk_value.join(',');
        }else {
            shareScopeCodes = val;
        }
    }
    $('#shareScopeCodes').on('click', 'input[name="shareScopeCode"]', function () {
        getShareScopeCodes();
        if(shareScopeCodes != ''){
            $('.errorShareScopes').hide();
        }
    });
    //数据资源共享范围验证
    function checkShareScopeCodesValue() {
        if(shareScopeCodes == ''){
            $('.errorShareScopes').html('*请选择数据资源共享范围').css("display", "block");
            return true;
        }else {
            return false;
        }
    }
    $('#appointShare').change(function () {
        var val = $(this).val();
        if(val == 'appoint'){
            $('#shareScopeCodes').show();
            $('[name="shareScopeCode"]').filter(':checked').each(function () {
                if($(this).val() == 'ZYGXFW_02'){
                    $('#shareArea').show();
                }else if($(this).val() == 'ZYGXFW_03'){
                    $('#shareDept').show();
                }
            });
        }else {
            $('#shareScopeCodes').hide();
            $('#shareArea').hide();
            $('#shareDept').hide();
            shareScopeCodes = val;
        }
    });

    //数据资源共享方式
    $.get(
        rootPath+"/code/shareModeCodes",
        {},
        function(data, status){
            if(data.result != "success"){
                dmallError(data.result);
            }else {
                var list = data['shareModeCodeList'];
                var html1 = '<div class="col-sm-3">';
                var html2 = '<div class="col-sm-3">';
                for(var i = 0; i < list.length; i++){
                    if(i%2 == 0){
                        html1 += '<label><input type="checkbox" name="shareModeCode" id="shareMode_'+ list[i].code +'" value="'+ list[i].code +'"> &nbsp;'+ list[i].code +', '+ list[i].name +'</label><br>';
                    }else {
                        html2 += '<label><input type="checkbox" name="shareModeCode" id="shareMode_'+ list[i].code +'" value="'+ list[i].code +'"> &nbsp;'+ list[i].code +', '+ list[i].name +'</label><br>';
                    }
                }
                html1 += '</div>';
                html2 += '</div>';
                $('#shareMode').html(html1+html2);
                initShareModeCode();
            }
        },
        "json"
    );

    //初始化
    function initShareModeCode() {
        var shareModeCode = $('#shareModeCode').val();
        var codeList = shareModeCode.split(',');
        for(var i = 0; i < codeList.length; i++){
            $('#shareMode_'+codeList[i]).attr('checked', true);
        }
    }
    initShareModeCode();
    var shareModeCodes = '';
    //获取数据资源共享方式
    function getShareModeCodes() {
        var chk_value =[];
        $('input[name="shareModeCode"]:checked').each(function(){
            chk_value.push($(this).val());
        });
        shareModeCodes = chk_value.join(',');
    }
    $('#shareModeCodes').on('click', 'input[name="shareModeCode"]', function () {
        getShareModeCodes();
        if(shareModeCodes != ''){
            $('.errorShareModeCodes').hide();
        }
    });
    //数据资源共享方式验证
    function checkShareModeCodesValue() {
        if(shareModeCodes == ''){
            $('.errorShareModeCodes').html('*请选择数据资源共享方式').css("display", "block");
            return true;
        }else {
            return false;
        }
    }

    //选择相关地区
    $('#shareScope').on('change', '#shareScope_ZYGXFW_02', function () {
        if(!$(this).prop("checked")){
            $('#shareArea').css("display", "none");
            $('#shareAreaNames').html('');
            shareAreaCodes = '';
            $('#shareAreaCodes').val('');
        }else{
            $('#shareArea').css("display", "block");
        }
    });
    //选择相关部门
    $('#shareScope').on('change', '#shareScope_ZYGXFW_03', function () {
        if(!$(this).prop("checked")){
            $('#shareDept').css("display", "none");
            $('#shareDeptNames').html('');
            shareDeptCodes = '';
            $('#shareDeptCodes').val('');
        }else{
            $('#shareDept').css("display", "block");
        }
    });

    //数据资源共享地区
    var $shareAreaNames = $('#shareAreaNames');
    var shareAreaCodes=$('#shareAreaCodes').val();
    $('#chooseShareAreaNames').click(function () {
        openShareArea();
        $shareAreaNames.removeClass('errorC');
        $('.errorShareAreaCodes').hide();
    });

    function openShareArea() {
        //打开模态框
        $('#addShareArea').modal({backdrop: 'static', keyboard: false});
        //获取数据资源共享地区
        getShareAreaList();
    }
    //获取数据资源共享地区
    var $areaCodeListTre;
    function getShareAreaList() {
        $.get(rootPath + "/area/tree", {},
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    $areaCodeListTre = $('#list-shareArea').treeview({
                        data: data.area_list,
                        levels:1,
                        onNodeSelected: function (event, node) {
                            var list = [];
                            $('#list-shareArea-selected li').each(function () {
                                list.push($(this).attr('data-shareAreaCode'));
                            });
                            var areaSelected = $('#list-shareArea-selected').html();
                            if(list.indexOf(node.code) == -1){
                                areaSelected += '<li class="list-group-item share-in" data-shareAreaCode="' + node.code +'">' + node.text+ '</li>';
                                $('#list-shareArea-selected').html(areaSelected);
                            }
                        }
                    });
                } else {
                    dmallError("获取数据资源共享地区失败");
                }
            },
            "json"
        );
    }
    //加载数据资源共享地区
    function getShareAreaNames(codes) {
        $.get(rootPath + "/area/areas", {},
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    var areaCodeList = data.areaCodeList;
                    var html = '';
                    for (var j = 0; j < codes.length; j++){
                        for (var i = 0; i < areaCodeList.length; i++){
                            if(areaCodeList[i].code == codes[j]){
                                html += areaCodeList[i].code + '：' + areaCodeList[i].name + '&nbsp;&nbsp;&nbsp;';
                            }
                        }
                    }
                    $('#shareAreaNames').html(html);
                } else {
                    dmallError("获取数据资源共享地区失败");
                }
            },
            "json"
        );
    }


    //选择共享地区
    // $('#list-shareArea').on('click', 'li', function () {
    //     var areaSelected = $('#list-shareArea-selected').html();
    //     areaSelected += '<li class="list-group-item share-in" data-shareAreaCode="' + $(this).attr('data-shareAreaCode') +'">' + $(this).html() + '</li>';
    //     $('#list-shareArea-selected').html(areaSelected);
    // });
    //取消共享地区
    $('#list-shareArea-selected').on('click', 'li', function () {
        // var shareArea = $('#list-shareArea').html();
        // shareArea += '<li class="list-group-item share-in" data-shareAreaCode="' + $(this).attr('data-shareAreaCode') +'">' + $(this).html() + '</li>';
        // $('#list-shareArea').html(shareArea);
        $(this).remove();
    });
    //数据资源共享地区提交
    $("#shareArea_btn_commit").click(function () {
        var html='';
        var shareAreaCode = [];
        var areaSelected = $('#list-shareArea-selected').children();
        for (var i = 0; i < areaSelected.length; i++) {
            html += $(areaSelected[i]).html() + '；&nbsp;&nbsp;&nbsp;';
            shareAreaCode.push($(areaSelected[i]).attr('data-shareAreaCode'));
        }
        $shareAreaNames.html(html);
        shareAreaCodes = shareAreaCode.join(',');
        $('#shareAreaCodes').val(shareAreaCodes);
    });
    //数据资源共享地区验证
    function checkShareArea() {
        if($('#shareArea').css('display') == 'none'){
            return false;
        }else if($shareAreaNames.html() != ''){
            return false;
        }
        checkNotBlank($shareAreaNames, $('.errorShareAreaCodes'), '*请选择数据资源共享地区');
        return true;
    }

    //数据资源共享部门
    var $shareDeptNames = $('#shareDeptNames');
    var shareDeptNames = '';
    var shareDeptCodes = $('#shareDeptCodes').val();
    $('#chooseShareDeptNames').click(function () {
        openShareDept();
        $shareDeptNames.removeClass('errorC');
        $('.errorShareDeptCodes').hide();
    });
    function openShareDept() {
        //打开模态框
        $('#addShareDept').modal({backdrop: 'static', keyboard: false});
        //获取数据资源共享部门
        getShareDeptList();
    }
    //获取数据资源共享部门
    var $deptCodeListTre;
    function getShareDeptList() {
        $.get(rootPath + "/organ/organCodes/tree", {},
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    $deptCodeListTre = $('#list-shareDept').treeview({
                        data: data.organCodeList,
                        onNodeSelected: function (event, node) {
                            var list = [];
                            $('#list-shareDept-selected li').each(function () {
                                list.push($(this).attr('data-shareDeptCode'));
                            });
                            var deptSelected = $('#list-shareDept-selected').html();
                            if(list.indexOf(node.code) == -1){
                                deptSelected += '<li class="list-group-item share-in" data-shareDeptCode="' + node.code +'">' + node.text+ '</li>';
                                $('#list-shareDept-selected').html(deptSelected);
                            }
                        }
                    });
                } else {
                    dmallError("获取数据资源共享部门失败");
                }
            },
            "json"
        );
    }
    //加载数据资源共享地区
    function getShareDeptNames(codes) {
        $.get(rootPath + "/organ/organCodes", {},
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    var organCodeList = data.organCodeList;
                    var html = '';
                    for (var j = 0; j < codes.length; j++){
                        for (var i = 0; i < organCodeList.length; i++){
                            if(organCodeList[i].code == codes[j]){
                                html += organCodeList[i].code + '：' + organCodeList[i].name + '&nbsp;&nbsp;&nbsp;';
                            }
                        }
                    }
                    $('#shareDeptNames').html(html);
                } else {
                    dmallError("获取数据资源共享地区失败");
                }
            },
            "json"
        );
    }

    //选择共享部门
    // $('#list-shareDept').on('click', 'li', function () {
    //     var deptSelected = $('#list-shareDept-selected').html();
    //     deptSelected += '<li class="list-group-item share-in" data-shareDeptCode="' + $(this).attr('data-shareDeptCode') +'">' + $(this).html() + '</li>';
    //     $('#list-shareDept-selected').html(deptSelected);
    //     $(this).remove();
    // });
    //取消共享部门
    $('#list-shareDept-selected').on('click', 'li', function () {
        // var shareDept = $('#list-shareDept').html();
        // shareDept += '<li class="list-group-item share-in" data-shareDeptCode="' + $(this).attr('data-shareDeptCode') +'">' + $(this).html() + '</li>';
        // $('#list-shareDept').html(shareDept);
        $(this).remove();
    });
    //数据资源共享部门提交
    $("#shareDept_btn_commit").click(function () {
        var html='';
        var shareDeptCode = [];
        var deptSelected = $('#list-shareDept-selected').children();
        for (var i = 0; i < deptSelected.length; i++) {
            html += $(deptSelected[i]).html() + '；&nbsp;&nbsp;&nbsp;';
            shareDeptCode.push($(deptSelected[i]).attr('data-shareDeptCode'));
        }
        $shareDeptNames.html(html);
        shareDeptCodes = shareDeptCode.join(',');
        $('#shareDeptCodes').val(shareDeptCodes);
    });
    //数据资源共享部门验证
    function checkShareDept() {
        if($('#shareDept').css('display') == 'none'){
            return false;
        }else if($shareDeptNames.html() != ''){
            return false;
        }
        checkNotBlank($shareDeptNames, $('.errorShareDeptCodes'), '*请选择数据资源共享部门');
        return true;
    }

    //验证
    function checkBasePage() {
        //检查数据资源编号
        if(!checkResValue())
        if(!checkResourceIdValue())
            //检查数据资源名称
            if(!checkResourceTitleValue())
                //检查数据资源事权单位
                if(!checkRoutinePowerDeptNameValue())
                    //检查数据资源提供单位
                    if(!checkProvideDeptNameValue())
                        //检查行业类别
                        if(!checkIndustryNameValue())
                            //检查公安业务分类
                            if(!checkBusinessNameValue())
                                //检查数据资源要素一级分类
                                if(!checkData1stNameValue())
                                    //检查数据资源要素二级分类
                                    if(!checkData2ndNameValue())
                                        //检查数据资源要素细目分类
                                        if(!checkDataDetailNameValue())
                                            //检查数据资源属性分类
                                            if(!checkDataPropertyNameValue())
                                                //检查更新方式
                                                if(!checkUpdateModeNameValue())
                                                    //检查更新周期
                                                    if(!checkUpdateCycleNameValue())
                                                        //检查数据资源描述
                                                        if(!checkResourceDescValue())
                                                            //检查数据资源共享范围
                                                            if(!checkShareScopeCodesValue())
                                                                //检查数据资源共享方式
                                                                if(!checkShareModeCodesValue())
                                                                    //检查数据资源共享部门
                                                                    if(!checkShareDept())
                                                                        //检查数据资源共享地区
                                                                        if(!checkShareArea())
                                                                            return false;

        return true;
    };

    //到物理数据关联
    $('#toRrlation').click(function () {
        if(checkItemMappingRepeat()){
            $(this).prop('disabled', true);
            return;
        }
        $("#resourceType9").hide();
        $("#resourceType10").show();
        $('#toRrlation').hide();
        $("#lastStep").hide();
        $('#toItemMapping').show();
        $("#shelveButton").show();
        $("#newAndSubmitBtn").show();
        // 载入到数据项映射表中
        addItemMappingTable();
        checkExchangeItem();
    });
    //到数据项映射
    $('#toItemMapping').click(function () {
        $("#resourceType9").show();
        $("#resourceType10").hide();
        $('#toRrlation').show();
        $("#lastStep").show();
        $('#toItemMapping').hide();
        $("#shelveButton").hide();
        $("#newAndSubmitBtn").hide();
        $('#virtualTextTable tr').each(function () {
            if($(this).children().eq(0).children('a').html() == '未指定' && $(this).children().eq(1).children('a').html() == '未指定'){
                $(this).remove();
            }
        });

        oldFinalTableList = [];
        $('#relationFinalTable tr').each(function () {
            var newObj = {};
            newObj['dataTableItemNo'] = $(this).children('td').eq(0).html();
            newObj['dataDirectoryItemNo'] = $(this).children('td').eq(1).html();
            newObj['dbColumn'] = $(this).children('td').eq(2).html();
            newObj['dbColumnType'] = $(this).children('td').eq(3).html();
            oldFinalTableList.push(newObj);
        });
    });

    //获取数据项详情
    $("#relationFinalTable").on("click", ".toDataItemDetail", function (e) {
        e.preventDefault();
        var itemNo = $(this).html();
        openDataItem(itemNo);
    });
    $("#itemMappingTable").on("click", ".toDataItemDetail", function (e) {
        e.preventDefault();
        var itemNo = $(this).html();
        openDataItem(itemNo);
    });

});
$("body").on("click", ".editMeta", function (e) {
    addMeta($(this).parent().siblings("a"));
    return false;
});
//数据元类目树
function getMetadata(){
    $.get(rootPath + "/dept/content/metadataCategory", {},
        function (data, status) {
            if ((status == "success") && (data.result == "success")) {
                treeData = data.metadataCategory;
                drawMetaTree(data.metadataCategory);
                $("#metaName").removeClass("errorC");
                $(".errorMetaName").hide();
                $('#addMetaModal').modal({backdrop: 'static', keyboard: false});
            } else {
                dmallError(data.result);
            }
        },
        "json"
    );
}
//添加数据元
function addMeta($selector){
    metaTag = 1;
    $('#addMetaModal').data("obj",$selector);
    if($selector.data("metacode") == ""){
        emptyModal("addMetaModal");
    } else{
        $("#metaName").val($selector.text());
        $("#metaName").data("metacode",$selector.data("metacode"));
    }
    getMetadata();
   // drawMetaTree(treeData);
}
function delMeta(obj){
    var $selector = $(obj).parent().siblings("a");
    $selector.attr('onclick', 'addMeta($(this));');
    $selector.text("添加关联");
    $selector.siblings("div").hide();
    $selector.data("metacode","");
    $selector.data("catecode","");
}
function drawMetaTree(data){
    $metaTree = $('#list-meta').treeview({
        data: data,
        onNodeSelected: function (event, node) {
            if(node.resourceTypeName != "Category"){
                var $metaList = $("#metaName");
                $metaList.data("metaName", node.text);
                $metaList.data("metacode", node.code);
                $metaList.data("catecode", node.parent_code);
                $metaList.val($metaList.data("metaName"));
                $("#metaName").removeClass("errorC");
                $(".errorMetaName").hide();
                $("#list-meta").hide();
                metaTag = 1;
            }else{
                dmallError("只能选择数据元，类目不可选");
            }
        },
        onNodeCollapsed: function (event, node) {
            metaTag = 1;
        },
        onNodeExpanded: function (event, node) {
            metaTag = 1;
        }
    });
    return $metaTree;
}

var searchMetaTree = function (tree) {
    drawMetaTree(treeData);
    var search = $('#metaName').val();
    var pattern = toEscStr(search);
    var options = {
        revealResults: true,
        ignoreCase: false,
        exactMatch: false
    };
    var selectableNodes = $metaTree.treeview('search', [pattern, options]);
    //   var selectableNodes = tree.treeview('search', [pattern, {ignoreCase: false, exactMatch: false}]);
    if (search) {
        if (selectableNodes.length > 0) {
            var Nodes = [];
            for (var i = 0; i < selectableNodes.length; i++) {
                var node = selectableNodes[i];
                delete node.state;
                if (node.nodes) {
                    delete node.nodes;
                }
                Nodes.push(node);
            }
        }
        drawMetaTree(Nodes);
    }else{
        drawMetaTree(treeData);
    }
}
function viewMeta(obj){
    $(obj).removeAttr('onclick');
    var metacode = $(obj).data("metacode");
    var catecode = $(obj).data("catecode");
    $("#viewMetaModal").data("metacode",metacode);
    $("#viewMetaModal").data("catecode",catecode);
    $.get("/" + prjName + "/metadata/detail",
        {
            metaCode:metacode,
            cateCode:catecode
        },function(data,status){
            $(obj).attr('onclick', 'viewMeta(this);');
            if(data.result != "success"){
                dmallError(data.result);
            }else{
                var meta_data = eval("(" + data.metadata + ")");
                if(meta_data.message != "success"){
                    dmallError(meta_data.message);
                }else{
                    $("#viewMetaModal").modal({backdrop:'static', keyboard: false});
                    $("#metaDetail div").remove();
                    var metadata = meta_data.data.result.attrDetailMap;
                    for(var i in metadata) {
                        var htmlStr = '';
                        htmlStr += '<div style="width:100%"><h5 style="color: #00B4DF"><strong>' + i + '</strong></h5><table style="border-bottom:0" class="table" width="100%">' +
                        '<thead><tr><td style="width:12%"></td><td style="width:20%"></td><td style="width:2%"></td><td style="width:12%"></td>' +
                        '<td style="width:20%"></td><td style="width:2%"></td><td style="width:12%"></td><td style="width:20%"></td></tr></thead>';
                        var num = 0;
                        var detail = metadata[i];
                        for (var j in detail) {
                            if (num % 3 == 0) {
                                htmlStr += '<tr>';
                            }
                            htmlStr += '<th class="text-left">' + j + '</th><td class="text-left"><span>' + detail[j] + '</span></td>';
                            if (num % 3 != 2) {
                                htmlStr += '<td style="border:0"></td>';
                            }
                            if (num % 3 == 2) {
                                htmlStr += '</tr>';
                            }
                            num++;
                        }
                        if (i == "表示类") {
                            if (num % 3 == 0) {
                                htmlStr += '<tr>';
                            }
                            htmlStr += '<th class="text-left">值域:</th><td class="text-left">' +
                            '<a href="javascript:void(0)" onclick="viewValueRange()" class="fa fa-file-text-o text-primary oper-icon-2"></a></td><td style="border:0"></td>';
                            if (num % 3 == 2) {
                                htmlStr += '</tr>';
                            }
                            num++;
                        }
                        if (num % 3 != 0) {
                            htmlStr += '</tr>';
                        }
                        htmlStr += '</table></div>';
                        $("#metaDetail").append(htmlStr);
                    }
                    var htmlStr1 = '<div style="width:100%"><h5 style="color: #00B4DF"><strong>所属类目</strong></h5><table style="border-bottom:0" class="table">'+
                        '<thead><tr><td style="width: 100%"></td></tr></thead>'
                    var metacate = data.qname;
                    var cate = metacate.split(".").join(" > ").replace(">","：");
                    htmlStr1 += '<tr><td class="text-left">' + cate + '</td></tr></table></div>';
                    $("#metaDetail").append(htmlStr1);
                }
            }
        },"json");
}
function viewValueRange(){
    $('#viewMetaModal').modal('hide');
    $('#viewValueRangeModal').modal('hide');
    $('#viewValueRangeModal').modal({backdrop: 'static', keyboard: false});
    $("#valueRangeTable tr:not(:first)").remove();
    var metacode = $("#viewMetaModal").data("metacode");
    var catecode = $("#viewMetaModal").data("catecode");
    $.get("/" + prjName + "/metadata/value_range",
        {
            metaCode:metacode,
            cateCode:catecode
        },
        function(data,status){
            if(data.result != "success"){
                dmallError(data.result);
            }else{
                var vrList=data.valueRange.list;
                if(vrList.length != 0) {
                    var trHTML = '<tbody id="valueRange">';
                    for (var j = 0; j < vrList.length; j++) {
                        if(vrList[j].rule != undefined){
                            trHTML += '<tr><td>' + vrList[j].id + '</td><td>' + vrList[j].name + '</td><td>' + vrList[j].code + '</td><td>' + vrList[j].rule + '</td></tr>';
                        }else{
                            trHTML += '<tr><td>' + vrList[j].id + '</td><td>' + vrList[j].name + '</td><td>' + vrList[j].code + '</td><td></td></tr>';
                        }
                    }
                    trHTML += '</tbody>';
                }else{
                    var trHTML = '<tfoot><tr><td>该数据元没有值域</td></tr></tfoot>';
                }
                $("#valueRangeTable").append(trHTML);
            }
        },"json");
}
function modal_close(){
    $('#viewValueRangeModal').hide();
    $('#viewValueRangeModal').modal('hide');
    $('#viewMetaModal').modal({backdrop: 'static', keyboard: false});
}
function first_modal_close(){
    $('#viewMetaModal').modal('hide');
}






