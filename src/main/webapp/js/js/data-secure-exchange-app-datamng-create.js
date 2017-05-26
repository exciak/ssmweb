/**
 * Created by DD on 2016/5/19.
 */

$(document).ready(function () {
    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    var prjName = arr[1];
    $("#agree_btn").click(function(){
        if (checkDbSrcListValue() || checkDbTableListValue()) {
            return false;
        }
        var dbId = $("#dbSrcList").data("srcid");
        var dbName = $("#dbTableList option:selected").val();
        if($("[name='writeDev']").filter(":checked").val() == "true"){
            var writeDev = true;
        } else{
            var writeDev = false;
        }
        $("#agree_btn").attr("disabled", true);
        $("#cancel_btn").attr("disabled", true);
        $.post("/" + prjName + "/mydata/app/dev_data",
            {
                dbAccessId:dbId,
                dbTable:dbName,
                writeDev:writeDev
            },function(data,status){
                if (data.result != "success") {
                    dmallError(data.result);
                    $("#agree_btn").attr("disabled", false);
                    $("#cancel_btn").attr("disabled", false);
                } else {
                    window.location.href = "/" + prjName+"/mydata/app/dev_datas";
                }
            }
        ,"json");
    });
    $("#backLastPage").click(function () {
        location.href = "/" + prjName+ "/mydata/app/dev_datas";
    });
    $("input[type=text]").focus(function(){
        $(this).removeClass("errorC");
        $(this).siblings("small").hide();
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
                        var dbName = dbAccess.name + "(类型：" + dbAccess.type + ")";
                        var newOption = "<option value='" + dbAccess.id + "' id='" + dbAccess.type + "'>" + dbName + "</option>";
                        $listAll.append(newOption);
                        if (("" != dbAccessId) && (dbAccess.id == dbAccessId)) {
                            $("#dbSrcList").val(dbName);
                        }
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

    function dbSrcInputChange() {
        var $dbTableList = $('#dbTableList');
        $dbTableList.empty();
        $("#dbTableColumnsTable tbody").empty();
        $("#idColumnsDiv").hide();
        var dbId = $("#dbSrcList").data("srcid");
        if (dbId == "") {
            $dbTableList.append("<option value=''>" + "请先选择数据源" + "</option>");
        } else {
            $dbTableList.append("<option value=''>" + "请选择" + "</option>");

            $("#loadingDbTable").show();
            freshDbTableList(dbId, "");
        }
    }

    $("#previouspage").click(
        function () {
            if (parseInt($("#currentPage").text()) > 1) {
                freshDbSrcList(parseInt($("#currentPage").text()) - 1, "");
            }
        });

    $("#nextpage").click(
        function () {
            if (parseInt($("#currentPage").text()) < parseInt($("#totalPage").text())) {
                freshDbSrcList(parseInt($("#currentPage").text()) + 1, "");
            }
        });

//获取焦点
    $("#dbTableList").focus(function () {
        $("#dbTableList").removeClass("errorC");
        $(".errorDbTableListValue").hide();
    });

//获取表
    function freshDbTableList(dbAccessId, dbTable) {
        $.get("/" + prjName + "/dbaccess/tables",
            {
                dbSrcId: dbAccessId
            },
            function (data, status) {
                $("#loadingDbTable").hide();
                if (status == "success") {
                    $("#dbTableList").empty();
                    if (data.resultList.length == 0) {
                        dmallError("没有获取到表");
                    } else {
                        var baseOption = new Option("请选择","");
                        $("#dbTableList").append(baseOption);
                        for (var i = 0; i < data.resultList.length; i++) {
                            var table = data.resultList[i];
                            if(table.indexOf(".") == "-1" ){
                                var newOption = new Option(table, table);
                                $("#dbTableList").append(newOption);
                            }
                        }
                        if (dbTable != "") {
                            $("#dbTableList").val(dbTable);
                            $("#dbTable").val(dbTable);
                        }
                    }
                } else {
                    dmallError("获取表失败");
                }
            },
            "json"
        );
    }
//失去焦点
    $("#dbTableList").blur(function () {
        checkDbTableListValue();
    });

// 获取字段
    $("#dbTableList").change(function(){
        var dbTableName = $("#dbTableList option:selected").val();
        var dbId = $("#dbSrcList").data("srcid");
        $("#idColumnsDiv").hide();
        $("#storageColumns").hide();
        if ('0' == dbTableName) {
            return;
        }
        freshDbColumn(dbId, dbTableName, null, "new");
        return false;
    });

//获取字段和分区
    function freshDbColumn(dbAccessId, dbTableName, partitionMap, type) {
        $("#dbTableColumnsTable tbody").empty();
        $("#loadingDbColumns").show();

        $.get("/" + prjName + "/dbaccess/table_columns",
            {
                dbSrcId: dbAccessId,
                dbTableName: dbTableName
            },
            function (data, status) {
                $("#loadingDbColumns").hide();

                if (status == "success") {
                    if (!data.tableInfo) {
                        dmallError("没有获取到列");
                    } else {
                        var tableInfo = data.tableInfo;
                        if(tableInfo.columns.length > 0) {
                            for (var i = 0; i < tableInfo.columns.length; i++) {
                                var columns = tableInfo.columns[i];
                                if(type == "new"){
                                    var trHTML = '<tr><td name="dbTableColumnName">' + columns.name + '</td>' +
                                        '<td name="dbTableColumnType">' + columns.type + '</td></tr>';
                                } else if(type == "edit"){
                                    var desc = "";
                                    if($("#dbColumn"+i).val() != undefined){
                                        desc = $("#dbColumn"+i).val();
                                    }
                                    var trHTML = '<tr><td name="dbTableColumnName">' + columns.name + '</td>' +
                                        '<td name="dbTableColumnType">' + columns.type + '</td></tr>';
                                } else{
                                    var trHTML = '<tr><td name="dbTableColumnName">' + columns.name + '</td>' +
                                        '<td name="dbTableColumnType">' + columns.type + '</td></tr>';
                                }
                                $("#dbTableColumnsTable tbody").append(trHTML);
                            }
                            $("#dbTableColumnsTableBody").show();
                            $("#idColumnsDiv").show();
                        }
                    }
                } else {
                    dmallError("获取列失败");
                }
            },
            "json"
        );
    }

//折叠样式
    $(".panel-heading a").click(function () {
        var el = $(this).children("i");
        if ($(el).hasClass("fa-plus")) {
            $(el).removeClass("fa-plus").addClass("fa-minus");
        } else {
            $(el).removeClass("fa-minus").addClass("fa-plus");
        }
    });

    function removeDbSrcListError() {
        $("#dbSrcList").removeClass("errorC");
        $(".errorDbSrcListValue").hide();
    }
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
            removeDbSrcListError();
            dbSrcInputChange();
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

    function checkDbTableListValue() {
        if ($("#dbTableList option").length <= 0 || $("#dbTableList option:selected").val() == "") {
            $("#dbTableList").addClass("errorC");
            $(".errorDbTableListValue").html("*请选择表");
            $(".errorDbTableListValue").css("display", "block");
            return true;
        }
        return false;
    };
    //失去焦点
    $("#dbTableList").blur(function () {
        checkDbTableListValue();
    });
});



