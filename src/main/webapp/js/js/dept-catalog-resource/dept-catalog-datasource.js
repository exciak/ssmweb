$(document).ready(function(){
    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    var prjName = arr[1];
    $("#list-all").focus(function(){
        $("#list-all").css("border","none");
        $("#list-all").siblings("small").hide();
    });
    $("#btn_commit").click(function () {
        if($("#list-all option:selected").length <= 0){
            $("#list-all").css("border","1px solid red");
            $("#list-all").siblings("small").html("*请选择数据源").show();
            return false;
        }
        var type = $("#btn_commit").data("type");
        var $dbSrcList;
        switch (type){
            case "odps":
                $("#btn_commit").attr("disabled",true);
                var dbId = $("#list-all option:selected").get(0).value;
                if(($("#exchange_package").prop("checked") && $("[name='exchangeType']").filter(":checked").val() == "DIRECT")||$("[name='exchangeType']").filter(":checked").val() == "SECURE"){
                    $.get("/" + prjName +"/odps_owner/hasOdpsOwnerPrivilege",
                        {
                            dbaccessId:dbId
                        },
                        function(data, status){
                            if ((status == "success") && (data.result == "success")) {
                                odpsSrcChoose();
                            } else {
                                $("#btn_commit").attr("disabled",false);
                                dmallError(data.result);
                            }
                        },
                        "json");
                } else{
                    odpsSrcChoose();
                }
                break;
            case "mark":
                $("#btn_commit").attr("disabled",true);
                var dbId = $("#list-all option:selected").get(0).value;
                $.get("/" + prjName +"/odps_owner/hasOdpsOwnerPrivilege",
                    {
                        dbaccessId:dbId
                    },
                    function(data, status){
                        if ((status == "success") && (data.result == "success")) {
                            markSrcChoose();
                        } else {
                            $("#btn_commit").attr("disabled",false);
                            dmallError(data.result);
                        }
                    }, "json");
                break;
            case "ads":
            case "rds":
                $("#btn_commit").attr("disabled",true);
                $dbSrcList = $("#rdsSrcList");
                $("#storageRdsColumns").hide();
                $("#rdsColumnsDiv").hide();
                $(".errorRdsTableColumnsListValue").hide();
                $("#list-all option:selected").each(function () {
                    $dbSrcList.attr("value", "");
                    $("#resourceParamType").val($(this).get(0).id);
                    $dbSrcList.val($(this).get(0).text);
                    $dbSrcList.data("srcid", $(this).get(0).value);
                    dbAccessId = $dbSrcList.data("srcid");
                    removeRdsSrcListError();
                    $("#rdsTable").val("");
                    $("#splitPkList").empty();
                    var opHTML = '<option value="">请选择</option>';
                    $("#splitPkList").append(opHTML);
                });
                $("#addDbSrcModal").modal('hide');
                break;
            case "structFile":
                $("#btn_commit").attr("disabled",true);
                $dbSrcList = $("#fileDbSrcList");
                $("#storageFileDbPartition").hide();
                $("#filePartitionWrap").hide();
                $("#storageFileDbBody").empty();
                $("#storageFileTableBody").empty();
                $("#list-all option:selected").each(function () {
                    $dbSrcList.attr("value", "");
                    $dbSrcList.val($(this).get(0).text);
                    $dbSrcList.data("srcid", $(this).get(0).value);
                    $dbSrcList.data("connectid", $(this).get(0).id);
                    dbAccessId = $dbSrcList.data("srcid");
                    if($(this).data("type") == "ODPS"){
                        $("#whereDiv").hide();
                    }else{
                        $("#whereDiv").show();
                    }
                    $("#fileDbTable").val("");
                    removeFileDbSrcListError();
                });
                //$("#fileDbColumnsDiv").hide();
                $("#addDbSrcModal").modal('hide');
                $(".errorFileDbTableColumnsListValue").hide();
                break;
            case "virtual":
                $("#btn_commit").attr("disabled",true);
                var dbId = $("#list-all option:selected").get(0).value;
                var dbType = $("#relateSrcList").val();
                if(dbType == "odps"){
                    var mask =  $("#btn_commit").data("mask");
                    if(mask == "masked"){
                        virtualMaskedSrcChoose();
                    }else{
                        if(($("#virtual_exchange_package").prop("checked") && $("[name='virtualExchangeType']").filter(":checked").val() == "DIRECT")
                            ||$("[name='virtualExchangeType']").filter(":checked").val() == "SECURE"){
                            $.get("/" + prjName +"/odps_owner/hasOdpsOwnerPrivilege",
                                {
                                    dbaccessId:dbId
                                },
                                function(data, status){
                                    if ((status == "success") && (data.result == "success")) {
                                        virtualSrcChoose();
                                    } else {
                                        $("#btn_commit").attr("disabled",false);
                                        dmallError(data.result);
                                    }
                                },
                                "json");
                        } else{
                            virtualSrcChoose();
                        }
                    }
                }else{
                    virtualSrcChoose();
                }
        }
    });
    $("#previouspage").click(function () {
        var type = $("#btn_commit").data("type");
            if (parseInt($("#currentPage").text()) > 1) {
                switch (type){
                    case "odps":
                    case "mark":
                        freshDbSrcList(parseInt($("#currentPage").text()) - 1, "");break;
                    case "ads":
                    case "rds":
                        getRDSDbSrcList(parseInt($("#currentPage").text()) - 1,type);break;
                    case "structFile":
                        getFileDbSrcList(parseInt($("#currentPage").text()) - 1);break;
                    case "virtual":
                        getVirtualDbSrcList(parseInt($("#currentPage").text()) - 1);break;
                }
            }
        });

    $("#nextpage").click(function () {
        var type = $("#btn_commit").data("type");
            if (parseInt($("#currentPage").text()) < parseInt($("#totalPage").text())) {
                switch (type){
                    case "odps":
                    case "mark":
                        freshDbSrcList(parseInt($("#currentPage").text()) + 1, "");break;
                    case "ads":
                    case "rds":
                        getRDSDbSrcList(parseInt($("#currentPage").text()) + 1,type);break;
                    case "structFile":
                        getFileDbSrcList(parseInt($("#currentPage").text()) + 1);break;
                    case "virtual":
                        getVirtualDbSrcList(parseInt($("#currentPage").text()) + 1);break;
                }
            }
        });
});
//根据数据源ID获取数据源
function getDbSrcById(dbAccessId,$selector) {
    $.get("/" + prjName + "/dbaccess/dbaccess_detail",
        {
            dbaccessID:dbAccessId,
            usage: "catalog"
        },
        function (data, status) {
            if (status == "success" && data.result == "success") {
                var dbName = data.dbaccess.name;
                $selector.val(dbName);
                if(data.dbaccess.type == "ODPS"){
                    $("#whereDiv").hide();
                }else{
                    $("#whereDiv").show();
                }
                $selector.data("connectid",data.dbaccess.connectID);
            } else {
                dmallError("获取数据源失败");
            }
        },
        "json"
    );
}
//选择odps数据源
function odpsSrcChoose(){
    $("#partitionWrap").hide();
    $("#idColumnsDiv").hide();
    $(".errorDbTableColumnsListValue").hide();
    $("#list-all option:selected").each(function () {
        var $dbSrcList = $("#dbSrcList");
        $dbSrcList.attr("value", "");
        $("#resourceParamType").val($(this).get(0).id);
        $dbSrcList.val($(this).get(0).text);
        $dbSrcList.data("srcid", $(this).get(0).value);
        dbAccessId = $dbSrcList.data("srcid");
        $("#dbTable").val("");
        removeDbSrcListError();
    });
    $("#addDbSrcModal").modal('hide');
}
//虚转实
function virtualSrcChoose(){
    $("#partitionWrap").hide();
    $("#idColumnsDiv").hide();
    $("#list-all option:selected").each(function () {
        var $dbSrcList = $("#virtualSrcList");
        $dbSrcList.attr("value", "");
        $("#resourceParamType").val($(this).get(0).id);
        $dbSrcList.val($(this).get(0).text);
        $dbSrcList.data("srcid", $(this).get(0).value);
        dbAccessId = $dbSrcList.data("srcid");
    });
    $("#virtualTable").val("");
    $("#virtualSrcList").removeClass("errorC");
    $(".errorVirtualSrcListValue").hide();
    $("#addDbSrcModal").modal('hide');

    $('#virtualFinalTable').hide();
    $('#relationFinalTable').empty();
}
function virtualMaskedSrcChoose(){
    $("#idVirtualMaskedColumnsDiv").hide();
    $(".errorVirtualMaskedDbSrcListValue").hide();
    $("#list-all option:selected").each(function () {
        var $dbSrcList = $("#virtualMaskedDbSrcList");
        $dbSrcList.attr("value", "");
        $("#resourceParamType").val($(this).get(0).id);
        $dbSrcList.val($(this).get(0).text);
        $dbSrcList.data("srcid", $(this).get(0).value);
    });
    $("#virtualMaskedDbTable").val("");
    $("#virtualMaskedDbSrcList").removeClass("errorC");
    $(".errorVirtualMaskedDbSrcListValue").hide();
    $("#addDbSrcModal").modal('hide');
}
function markSrcChoose(){
    $("#maskedPartitionWrap").hide();
    $("#idMaskedColumnsDiv").hide();
    $(".errorMaskedDbTableColumnsListValue").hide();
    $("#list-all option:selected").each(function () {
        var $dbSrcList = $("#maskedDbSrcList");
        $dbSrcList.attr("value", "");
        $dbSrcList.val($(this).get(0).text);
        $dbSrcList.data("srcid", $(this).get(0).value);
        maskedDbAccessId = $dbSrcList.data("srcid");
        $("#maskedDbTable").val("");
    });
    $("#addDbSrcModal").modal('hide');
}

//打开模态框
function openSrcModal(type){
    $("#list-all").css("border","none");
    $("#list-all").siblings("small").hide();
    $('#addDbSrcModal').modal({backdrop: 'static', keyboard: false});
    $("#btn_commit").attr("disabled",false);
    $("#btn_commit").data("type", type);
    $('#list-all').empty();
    switch (type){
        case "odps":
        case "mark":
            freshDbSrcList(1, "");
            break;
        case "ads":
        case "rds":
            getRDSDbSrcList(1,type);
            break;
        case "structFile":
            getFileDbSrcList(1);
            break;
        case "virtual":
            getVirtualDbSrcList(1);
            break;
    }
}