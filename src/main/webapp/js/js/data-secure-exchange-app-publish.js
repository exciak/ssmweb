/**
 * Created by DD on 2016/5/19.
 */

$(document).ready(function () {
    var outsideTag = 0;
    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    var prjName = arr[1];
    var listData;

    //加载已选流程单号
    var len = $("#selectedExchangeNoList").children().length;
    var arr = [];
    for (var i = 0; i < len; i++) {
        var num = $('#selectedExchangeNoList option:eq(' + i + ')').val();
        num = num.split('——');
        arr.push(num[0]);
    }
    var all = arr.join(',');
    $('#selectedExchangeNo').val(all);

    //应用描述
    $("#applyDescription").val($("#hiddenapplyDescription").val());

    //发布说明
    $("#reviewDescription").val($("#hiddenreviewDescription").val());

    function getExchangeNoList(page) {
        var myString = $("#inputExchangeNo").val();
        $.get("../app/exchangeNoList",
            {
                searchNo:myString,
                pageNumber:page
            },
            function (data, status) {
                if (status == "success" && (data.result == "success")) {
                    listData = data.exchangeNoList;
                    $("#exchangeNoList").empty();
                    if (data.exchangeNoList.length > 0) {
                        for (var i = 0; i < data.exchangeNoList.length; i++) {
                            var exchangeNos = data.exchangeNoList[i];
                            var trHTML = '<li class="longText" id=' + i + ' title=' + exchangeNos.exchangeNo + '>' + exchangeNos.exchangeNo + '——' + exchangeNos.resourceName + '</li>';
                            $("#exchangeNoList").append(trHTML);
                        }
                        $("#currentPage2").val(data.curPage);
                        $("#totalPage2").val(data.totalPages);
                        $("#wrongMsg").hide();
                        if (data.totalPages == 1) {
                            $("#pageDiv").hide();
                        } else {
                            $("#pageDiv").show();
                        }
                    } else {
                        $("#wrongMsg").show();
                        $("#pageDiv").hide();
                    }
                } else {
                    dmallError(data.result);
                }
            },
            "json"
        );
    }

    $("#inputExchangeNo").keyup(function () {
        getExchangeNoList(1);
    });

    $("#pageDiv").click(function () {
        outsideTag = 1;
    });

    $("#inputExchangeNo").click(function () {
        $("#inputExchangeNo").removeClass("errorC");
        //$(".errorexchangeNo").hide();
        $("#exchangeNoListDiv").show();
        getExchangeNoList(1);
        outsideTag = 0;
    });
    $("#exchangeNoList").delegate("li", "click", function () {
        var exchangeNoName = this.innerText;
        $("#inputExchangeNo").val(exchangeNoName);
        $("#inputExchangeNo").siblings("i").removeClass("hidden");
        $("#exchangeNoListDiv").hide();
        outsideTag = 1;
    });

    // 流程单号列表翻页
    $("#previouspage2").click(
        function () {
            if (parseInt($("#currentPage2").val()) > 1) {
                getExchangeNoList(parseInt($("#currentPage2").val()) - 1);
            }
        });

    $("#nextpage2").click(
        function () {
            if (parseInt($("#currentPage2").val()) < parseInt($("#totalPage2").val())) {
                getExchangeNoList(parseInt($("#currentPage2").val()) + 1);
            }
        });
    $('#btnAddExchangeNo').click(function () {
        var id = $("#inputExchangeNo").attr("value");
        var len = $('#selectedExchangeNoList').children().length;
        var flag = 0;
        if (id == "") {
            return;
        }
        for (var j = 0; j < len; j++) {
            if (id == $('#selectedExchangeNoList option:eq(' + j + ')').val()) {
                flag = 1;
            }
        }
        /*var reg = /^[0-9]\d*$|^0$/;
         if (!reg.test(id)) {
         $("#errorExchangeNoInput").removeClass("hidden");
         $("#inputExchangeNo").addClass("errorC");
         }*/
        if (flag == 1) {
            dmallError("不能重复添加流程单号。");
            $("#inputExchangeNo").addClass("errorC");
        } else {
            var newOption = new Option(id, id);

            $('#selectedExchangeNoList').append(newOption);
            $("#inputExchangeNo").removeClass("errorC");
            $('#inputExchangeNo').val("");
            $("#inputExchangeNo").siblings("i").addClass("hidden");
            len++;

            var arr = [];
            for (var i = 0; i < len; i++) {
                var num = $('#selectedExchangeNoList option:eq(' + i + ')').val();
                num = num.split('——');
                arr.push(num[0]);
            }
            var all = arr.join(',');
            $('#selectedExchangeNo').val(all);
        }
        //$('#selectedExchangeNo').val($('#selectedExchangeNo').attr("value") + id + "," );
    })

    $('#btnRemoveExchangeNo').click(function () {
        var selectOpt = $("#selectedExchangeNoList option:selected");
        selectOpt.remove();

        var arr = [];
        var len = $('#selectedExchangeNoList').children().length;
        for (var i = 0; i < len; i++) {
            arr.push($('#selectedExchangeNoList option:eq(' + i + ')').val());
        }
        var all = arr.join(',');
        $('#selectedExchangeNo').val(all);

    })

    /*var fileValue = $("#file").attr(value);
     if(fileValue != null) $("#deleteFile").removeClass("hidden");*/

    //删除已选文件
    $('#deleteFile').click(function () {
        $('#file').val("");
        $("#filetxt").val("");
    })

    $("#inputExchangeNo").focus(function () {
        $("#inputExchangeNo").removeClass("errorC");
        $("#errorExchangeNo").addClass("hidden");
    });

    $("#appName").focus(function () {
        $("#errorAppName").addClass("hidden");
        $("#appName").removeClass("errorC");
    });

    $("#applyDescription").focus(function () {
        $("#errorApplyDescription").addClass("hidden");
        $("#applyDescription").removeClass("errorC");
    });

    $("#dbaccessID").focus(function () {
        $("#errordbaccessID").addClass("hidden");
    })

    /*$("#account").focus(function () {
        $("#errorAccount").addClass("hidden");
        $("#account").removeClass("errorC");
    });*/

    $("#reviewDescription").focus(function () {
        $("#errorReviewDescription").addClass("hidden");
        $("#reviewDescription").removeClass("errorC");
    });

    $("#resultTable").focus(function () {
        $("#errorResultTable").addClass("hidden");
        $("#emptyResultTable").addClass("hidden");
        $("#resultTable").removeClass("errorC");
    });

    $("#authorizerId").focus(function () {
        $("#errorAuthorizerId").addClass("hidden");
    })

    var saveoptions = {
        type: "post",
        url: "savedraft",
        dataType: "json",
        data: $('#filesForm').serialize(),
        success: function (data) {
            if (data.result != "success") {
                dmallError(data.result);
                $("#appSavedraftInfo").hide();
                $("#agree_btn").attr("disabled", false);
                $("#save_btn").attr("disabled", false);
                $("#disagree_btn").attr("disabled", false);
                $("#terminate_btn").attr("disabled", false);
            } else {
                window.location.href = "../app";
            }
        },
        error: function () {
            dmallError("保存草稿失败。");
            $("#appSavedraftInfo").hide();
            $("#save_btn").attr("disabled", false);
            $("#agree_btn").attr("disabled", false);
            $("#disagree_btn").attr("disabled", false);
            $("#terminate_btn").attr("disabled", false);
        }
    };

    //$('#filesForm').ajaxForm(options);

    // bind to the form's submit event
    var isSave = 0;
    $('#filesForm').submit(function () {

        var invalid = false;

        if ($("#selectedExchangeNo").val() === "") {
            $("#errorExchangeNo").removeClass("hidden");
            invalid = true;
        }

        if ($("#appName").val() === "") {
            $("#errorAppName").removeClass("hidden");
            $("#appName").addClass("errorC");
            invalid = true;
        }

        if ($("#applyDescription").val() === "") {
            $("#errorApplyDescription").removeClass("hidden");
            $("#applyDescription").addClass("errorC");
            invalid = true;
        }

        if ($("#resultTable").val() === "") {
            $("#emptyResultTable").removeClass("hidden");
            $("#resultTable").addClass("errorC");
            invalid = true;
        }

        if ($("#dbaccessID").val() === "") {
            $(".errorDbSrcListValue").removeClass("hidden");
            invalid = true;
        }

        /*if ($("#account").val() === "") {
            $("#errorAccount").removeClass("hidden");
            $("#account").addClass("errorC");
            invalid = true;
        }*/

        if ($("#reviewDescription").val() === "") {
            $("#errorReviewDescription").removeClass("hidden");
            $("#reviewDescription").addClass("errorC");
            invalid = true;
        }

        if ($("#authorizerId option:selected").index() === 0) {
            $("#errorAuthorizerId").removeClass("hidden");
            invalid = true;
        }

        var resultTable = $.trim($("#resultTable").val());
        if (resultTable != "") {
            var strs = new Array();
            strs = resultTable.split(";");
            for (i = 0; i < strs.length; i++) {
                var ret = inputTable($.trim(strs[i]));
                if (!ret) {
                    invalid = true;
                    $("#errorResultTable").removeClass("hidden");
                    $("#resultTable").addClass("errorC");
                    break;
                }
            }
        }

        if (invalid == true) {
            return false;
        }

        if (resultTable != "") {
            if (isSave == 1) {
                $("#appSavedraftInfo").show();
            }
            else {
                $("#appPublishInfo").show();
            }

        }

        // inside event callbacks 'this' is the DOM element so we first
        // wrap it in a jQuery object and then invoke ajaxSubmit

        $("#agree_btn").attr("disabled", true);
        $("#save_btn").attr("disabled", true);
        $("#disagree_btn").attr("disabled", true);
        $("#terminate_btn").attr("disabled", true);

        if (isSave == 1) {
            $(this).ajaxSubmit(saveoptions);
        }
        else {
            $(this).ajaxSubmit(options);
        }


        // !!! Important !!!
        // always return false to prevent standard browser submit and page navigation
        return false;
    });

    $("#save_btn").click(function () {
        isSave = 1;
        $("#filesForm").attr("action", "app/savedraft");
        $('#filesForm').submit();

    });

    $("#backLastPage").click(function () {
        location.href = "../app";
    });

    // form异步提交上传文件
    var options = {
        type: "post",
        url: "publish",
        dataType: "json",
        data: $('#filesForm').serialize(),
        success: function (data) {
            if (data.result != "success") {
                dmallError(data.result);
                $("#appPublishInfo").hide();
                $("#agree_btn").attr("disabled", false);
                $("#save_btn").attr("disabled", false);
                $("#disagree_btn").attr("disabled", false);
                $("#terminate_btn").attr("disabled", false);
            } else {
                window.location.href = "../app";
            }
        },
        error: function () {
            dmallError("发布应用失败。");
            $("#appPublishInfo").hide();
            $("#save_btn").attr("disabled", false);
            $("#agree_btn").attr("disabled", false);
            $("#disagree_btn").attr("disabled", false);
            $("#terminate_btn").attr("disabled", false);
        }
    };

    $('#file').change(function () {
        var filename = this.value.substr(this.value.lastIndexOf('\\') + 1);
        $('#filetxt').val(filename);
    });

    $("#chooseDbSrc").click(function(){
        openDbSrcModal();
    });

    function openDbSrcModal() {
        $('#addDbSrcModal').modal({backdrop: 'static', keyboard: false});
        freshDbSrcList(1, "");
    };
    $("#btn_commit").click(function () {
        $("#list-all option:selected").each(function () {
            var $dbSrcList = $("#dbSrcList");
            $dbSrcList.attr("value", "");
            $("#resourceParamType").val($(this).get(0).id);
            $dbSrcList.val($(this).get(0).text);
            $dbSrcList.data("srcid", $(this).get(0).value);
            $("#dbaccessID").val( $(this).get(0).value);
            removeDbSrcListError();
        });
    });

    function checkDbSrcListValue() {
        if ($("#dbSrcList").val() == "") {
            $("#dbSrcList").addClass("errorC");
            $(".errorDbSrcListValue").html("*请选择数据源");
            $(".errorDbSrcListValue").css("display", "block");
            return true;
        }
        return false;
    }
    $("#dbSrcList").blur(function () {
        checkDbSrcListValue();
    });
    $("input[type=text]").focus(function(){
        $(this).removeClass("errorC");
        $(this).siblings("small").hide();
    });

    function removeDbSrcListError() {
        $("#dbSrcList").removeClass("errorC");
        $(".errorDbSrcListValue").hide();
    }
    $("#chooseDbSrc").click(function(){
        openDbSrcModal();
    });
    function freshDbSrcList(pageNum, dbAccessId) {
        var dbType = "odps";
        $.get("/" + prjName + "/dbaccess/getdbsrc",
            {
                pageNumber: pageNum,
                action: "ROLE_DEPARTMENT_USER",
                dbSrcType: dbType
            },
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    var $listAll = $('#list-all');
                    $listAll.empty();
                    for (var i = 0; i < data.dbSrcList.length; i++) {
                        var dbAccess = data.dbSrcList[i];
                        if(dbAccess.description == "" || dbAccess.description == null){
                            var dbName = dbAccess.name + "(描述：暂无描述)";
                        }else{
                            var dbName = dbAccess.name + "(描述：" + dbAccess.description + ")";
                        }
                        var newOption = "<option value='" + dbAccess.id + "' id='" + dbAccess.type + "'>" + dbName + "</option>";
                        $listAll.append(newOption);
                    }
                    $("#totalPage").html(data.totalPage);
                    $("#currentPage").html(data.curPage);
                } else {
                    dmallError("获取数据源列表失败");
                }
            },
            "json"
        );
    };

    function exchangeNoBlur(){
        if(outsideTag != 1){
            $("#exchangeNoListDiv").hide();
            if(checkExchangeNo()){
                $("#inputExchangeNo").val("");
            }else{
                //todo
            }
        }
    }

    $("#exchangeNoListDiv").mouseover(function(){
        $("#inputExchangeNo").unbind('blur');
    });
    $("#exchangeNoListDiv").mouseleave(function(){
        $("#inputExchangeNo").bind("blur",function(){
            exchangeNoBlur();
        });
    });
    $("#inputExchangeNo").blur(function(){
        exchangeNoBlur();
    });
    function checkExchangeNo(){
        var str = $("#inputExchangeNo").val();
        if(listData.length != 1){
            return true;
        }else if(str != listData[0].exchangeNo){
            return true;
        }
    }
});
